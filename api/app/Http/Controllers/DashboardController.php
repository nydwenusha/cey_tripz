<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Tour;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'range' => 'nullable|integer|in:7,30,90,365',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $range = (int) $request->query('range', 30);
        $periodEnd = now()->endOfDay();
        $periodStart = now()->subDays($range - 1)->startOfDay();
        $previousEnd = $periodStart->copy()->subSecond();
        $previousStart = $previousEnd->copy()->subDays($range - 1)->startOfDay();

        $bookingQuery = Booking::query()->whereBetween('created_at', [$periodStart, $periodEnd]);
        $previousBookingQuery = Booking::query()->whereBetween('created_at', [$previousStart, $previousEnd]);

        $paymentDate = DB::raw('COALESCE(payment_date, created_at)');
        $revenueQuery = Payment::query()
            ->where('status', 'completed')
            ->whereBetween($paymentDate, [$periodStart, $periodEnd]);
        $previousRevenueQuery = Payment::query()
            ->where('status', 'completed')
            ->whereBetween($paymentDate, [$previousStart, $previousEnd]);

        $bookingCount = (clone $bookingQuery)->count();
        $previousBookingCount = (clone $previousBookingQuery)->count();
        $revenue = (float) (clone $revenueQuery)->sum('amount');
        $previousRevenue = (float) (clone $previousRevenueQuery)->sum('amount');

        $activeCustomers = Schema::hasTable('customers')
            ? DB::table('customers')->where('status', 'active')->count()
            : 0;

        $activeVehicles = Schema::hasTable('vehicles')
            ? Vehicle::query()->where('status', 'active')->count()
            : 0;

        $bookingStatuses = (clone $bookingQuery)
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get()
            ->pluck('total', 'status');

        $paymentStatuses = Payment::query()
            ->whereBetween($paymentDate, [$periodStart, $periodEnd])
            ->select('status', DB::raw('COUNT(*) as total_count'), DB::raw('COALESCE(SUM(amount), 0) as total_amount'))
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        $dailyBookings = (clone $bookingQuery)
            ->selectRaw('DATE(created_at) as activity_date, COUNT(*) as total')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get();

        $dailyRevenue = (clone $revenueQuery)
            ->selectRaw('DATE(COALESCE(payment_date, created_at)) as activity_date, COALESCE(SUM(amount), 0) as total')
            ->groupBy(DB::raw('DATE(COALESCE(payment_date, created_at))'))
            ->get();

        $popularRoutes = (clone $bookingQuery)
            ->where('status', '!=', 'cancelled')
            ->select(
                'pickup_location',
                'drop_location',
                DB::raw('COUNT(*) as booking_count'),
                DB::raw('COALESCE(SUM(amount), 0) as booking_value')
            )
            ->groupBy('pickup_location', 'drop_location')
            ->orderByDesc('booking_count')
            ->limit(5)
            ->get()
            ->map(fn ($route) => [
                'pickup' => $route->pickup_location,
                'drop' => $route->drop_location,
                'bookings' => (int) $route->booking_count,
                'value' => (float) $route->booking_value,
            ])
            ->values();

        $recentBookings = (clone $bookingQuery)
            ->latest('created_at')
            ->limit(6)
            ->get([
                'id', 'customer_name', 'pickup_location', 'drop_location', 'pickup_date',
                'vehicle_type', 'amount', 'status', 'created_at',
            ])
            ->map(fn (Booking $booking) => $this->formatBooking($booking));

        $upcomingBookings = Booking::query()
            ->whereDate('pickup_date', '>=', today())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('pickup_date')
            ->orderBy('id')
            ->limit(6)
            ->get([
                'id', 'customer_name', 'pickup_location', 'drop_location', 'pickup_date',
                'vehicle_type', 'amount', 'status', 'created_at',
            ])
            ->map(fn (Booking $booking) => $this->formatBooking($booking));

        return response()->json([
            'status' => 'success',
            'generated_at' => now()->toIso8601String(),
            'period' => [
                'range' => $range,
                'start' => $periodStart->toDateString(),
                'end' => $periodEnd->toDateString(),
            ],
            'overview' => [
                'bookings' => [
                    'value' => $bookingCount,
                    'change' => $this->percentageChange($bookingCount, $previousBookingCount),
                ],
                'revenue' => [
                    'value' => round($revenue, 2),
                    'change' => $this->percentageChange($revenue, $previousRevenue),
                ],
                'active_tours' => [
                    'value' => Tour::query()->where('status', 'active')->count(),
                ],
                'active_customers' => [
                    'value' => $activeCustomers,
                ],
            ],
            'operations' => [
                'pending_bookings' => Booking::query()->where('status', 'pending')->count(),
                'upcoming_seven_days' => Booking::query()
                    ->whereBetween('pickup_date', [today(), today()->addDays(7)])
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->count(),
                'pending_payment_amount' => (float) Payment::query()->where('status', 'pending')->sum('amount'),
                'active_vehicles' => $activeVehicles,
            ],
            'booking_statuses' => collect(['pending', 'confirmed', 'completed', 'cancelled'])
                ->map(fn (string $status) => [
                    'status' => $status,
                    'count' => (int) ($bookingStatuses[$status] ?? 0),
                ])
                ->values(),
            'payment_statuses' => collect(['completed', 'pending', 'failed', 'refunded'])
                ->map(fn (string $status) => [
                    'status' => $status,
                    'count' => (int) ($paymentStatuses->get($status)->total_count ?? 0),
                    'amount' => (float) ($paymentStatuses->get($status)->total_amount ?? 0),
                ])
                ->values(),
            'revenue_trend' => $this->buildTrend($periodStart, $periodEnd, $range, $dailyBookings, $dailyRevenue),
            'popular_routes' => $popularRoutes,
            'recent_bookings' => $recentBookings,
            'upcoming_bookings' => $upcomingBookings,
        ], 200);
    }

    private function buildTrend(
        Carbon $periodStart,
        Carbon $periodEnd,
        int $range,
        Collection $dailyBookings,
        Collection $dailyRevenue
    ): array {
        $bucketSize = match ($range) {
            7 => 1,
            30 => 5,
            90 => 15,
            default => 31,
        };

        $bookingsByDate = $dailyBookings->pluck('total', 'activity_date');
        $revenueByDate = $dailyRevenue->pluck('total', 'activity_date');
        $trend = [];
        $cursor = $periodStart->copy();

        while ($cursor->lte($periodEnd)) {
            $bucketStart = $cursor->copy();
            $bucketEnd = $cursor->copy()->addDays($bucketSize - 1)->min($periodEnd);
            $bookings = 0;
            $revenue = 0;
            $day = $bucketStart->copy();

            while ($day->lte($bucketEnd)) {
                $key = $day->toDateString();
                $bookings += (int) ($bookingsByDate[$key] ?? 0);
                $revenue += (float) ($revenueByDate[$key] ?? 0);
                $day->addDay();
            }

            $trend[] = [
                'label' => $bucketSize === 1
                    ? $bucketStart->format('D')
                    : $bucketStart->format('M j'),
                'start' => $bucketStart->toDateString(),
                'end' => $bucketEnd->toDateString(),
                'bookings' => $bookings,
                'revenue' => round($revenue, 2),
            ];

            $cursor = $bucketEnd->copy()->addDay();
        }

        return $trend;
    }

    private function percentageChange(float|int $current, float|int $previous): ?float
    {
        if ((float) $previous === 0.0) {
            return (float) $current === 0.0 ? 0 : null;
        }

        return round((($current - $previous) / abs($previous)) * 100, 1);
    }

    private function formatBooking(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'customer_name' => $booking->customer_name,
            'pickup_location' => $booking->pickup_location,
            'drop_location' => $booking->drop_location,
            'pickup_date' => $booking->pickup_date,
            'vehicle_type' => $booking->vehicle_type,
            'amount' => (float) $booking->amount,
            'status' => $booking->status,
            'created_at' => $booking->created_at?->toIso8601String(),
        ];
    }
}
