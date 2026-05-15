<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    protected function syncCustomerRecord(string $customerEmail): void
    {
        $customerEmail = trim($customerEmail);

        if ($customerEmail === '') {
            return;
        }

        $existingCustomer = DB::table('customers')
            ->where('customer_email', $customerEmail)
            ->first();

        $confirmedBookingsQuery = Booking::where('customer_email', $customerEmail)
            ->whereIn('status', ['confirmed', 'completed']);

        $totalBookings = (clone $confirmedBookingsQuery)->count();

        if ($totalBookings === 0) {
            if ($existingCustomer) {
                DB::table('customers')
                    ->where('customer_email', $customerEmail)
                    ->update([
                        'total_bookings' => 0,
                        'status' => 'inactive',
                        'last_activity' => now(),
                        'updated_at' => now(),
                    ]);
            }

            return;
        }

        $latestBooking = (clone $confirmedBookingsQuery)
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->first();

        $firstConfirmedBooking = (clone $confirmedBookingsQuery)
            ->orderBy('created_at')
            ->orderBy('id')
            ->first();

        if (!$latestBooking || !$firstConfirmedBooking) {
            return;
        }

        $existingCustomerName = $existingCustomer ? trim((string) $existingCustomer->customer_name) : '';
        $existingCustomerPhone = $existingCustomer ? trim((string) $existingCustomer->customer_phone) : '';

        $customerPayload = [
            'customer_name' => $existingCustomerName !== '' ? $existingCustomerName : $latestBooking->customer_name,
            'customer_email' => $customerEmail,
            'customer_phone' => $existingCustomerPhone !== '' ? $existingCustomerPhone : $latestBooking->customer_phone,
            'total_bookings' => $totalBookings,
            'status' => 'active',
            'join_date' => $firstConfirmedBooking->created_at->toDateString(),
            'last_activity' => $latestBooking->updated_at ?? now(),
            'updated_at' => now(),
        ];

        if ($existingCustomer) {
            DB::table('customers')
                ->where('customer_email', $customerEmail)
                ->update($customerPayload);

            return;
        }

        $customerPayload['created_at'] = now();

        DB::table('customers')->insert($customerPayload);
    }

    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|in:5,10,25,50',
            'search' => 'nullable|string|max:255',
            'vehicle_type' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:pending,confirmed,cancelled,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $page = (int) ($request->query('page', 1));
        $perPage = (int) ($request->query('per_page', 10));
        $search = trim((string) $request->query('search', ''));
        $vehicleType = trim((string) $request->query('vehicle_type', ''));
        $status = trim((string) $request->query('status', ''));

        $query = Booking::query();

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $likeSearch = '%' . $search . '%';

                $builder->where('customer_name', 'like', $likeSearch)
                    ->orWhere('customer_email', 'like', $likeSearch)
                    ->orWhere('customer_phone', 'like', $likeSearch)
                    ->orWhere('pickup_location', 'like', $likeSearch)
                    ->orWhere('drop_location', 'like', $likeSearch)
                    ->orWhere('vehicle_type', 'like', $likeSearch);
            });
        }

        if ($vehicleType !== '') {
            $query->where('vehicle_type', $vehicleType);
        }

        if ($status !== '') {
            $query->where('status', $status);
        }

        $bookings = $query
            ->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'status' => 'success',
            'bookings' => $bookings->items(),
            'pagination' => [
                'current_page' => $bookings->currentPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
                'last_page' => $bookings->lastPage(),
            ],
            'filters' => [
                'search' => $search,
                'vehicle_type' => $vehicleType,
                'status' => $status,
            ],
        ], 200);
    }

    public function show($id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'booking' => $booking,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|string|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'pickup_location' => 'required|string|max:255',
            'drop_location' => 'required|string|max:255',
            'pickup_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:pickup_date',
            'vehicle_type' => 'required|string|max:255',
            'passengers' => 'required|integer|min:1',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::info($validator->errors());
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $booking = Booking::create([
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'pickup_location' => $request->pickup_location,
            'drop_location' => $request->drop_location,
            'pickup_date' => $request->pickup_date,
            'return_date' => $request->return_date,
            'vehicle_type' => $request->vehicle_type,
            'passengers' => $request->passengers,
            'amount' => $request->amount,
            'notes' => $request->notes,
        ]);

        // $WhatsappController = app()->make(WhatsappController::class);
        // $WhatsappController->sendMessage($booking);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking created successfully',
            'booking' => $booking,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|string|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'pickup_location' => 'required|string|max:255',
            'drop_location' => 'required|string|max:255',
            'pickup_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:pickup_date',
            'vehicle_type' => 'required|string|max:255',
            'passengers' => 'required|integer|min:1',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:pending,confirmed,cancelled,completed',
        ]);

        if ($validator->fails()) {
            Log::info($validator->errors());
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found',
            ], 404);
        }

        $originalEmail = $booking->customer_email;
        $originalStatus = $booking->status;

        $booking->update($validator->validated());
        $booking->refresh();

        $emailsToSync = [];

        if (in_array($originalStatus, ['confirmed', 'completed'], true)) {
            $emailsToSync[] = $originalEmail;
        }

        if (in_array($booking->status, ['confirmed', 'completed'], true)) {
            $emailsToSync[] = $booking->customer_email;
        }

        foreach (array_unique($emailsToSync) as $email) {
            $this->syncCustomerRecord($email);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Booking updated successfully',
            'booking' => $booking->fresh(),
        ], 200);
    }

    public function destroy($id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found',
            ], 404);
        }

        $customerEmail = $booking->customer_email;
        $shouldSyncCustomer = in_array($booking->status, ['confirmed', 'completed'], true);

        $booking->delete();

        if ($shouldSyncCustomer) {
            $this->syncCustomerRecord($customerEmail);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Booking deleted successfully',
        ], 200);
    }

    public function getTotalBookings()
    {
        $totalBookings = Booking::count();
        Log::info('Total bookings: ' . $totalBookings);
        return response()->json(['status' => 'success', 'total_bookings' => $totalBookings,], 200);
    }

    public function getTodayBookings(){
        $today = date('Y-m-d');
        $today_bookings = Booking::whereDate('created_at', $today)->count();
        Log::info('Today bookings: ' . $today_bookings);
        return response()->json(['status' => 'success', 'today_bookings' => $today_bookings,], 200);
    }

    public function updateStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|exists:bookings,id',
            'status' => 'required|string|in:pending,confirmed,cancelled'
        ]);

        if ($validator->fails()) {
            Log::info($validator->errors());
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }



        $item = Booking::find($request->id);

        if (!$item) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found'
            ], 404);
        }

        $allowedTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['cancelled'],
            'cancelled' => [],
        ];

        $currentStatus = $item->status;
        $nextStatus = $request->status;

        if ($currentStatus === $nextStatus) {
            return response()->json([
                'status' => 'success',
                'message' => 'Booking is already marked as ' . $currentStatus,
                'booking' => $item,
            ], 200);
        }

        if (!in_array($nextStatus, $allowedTransitions[$currentStatus] ?? [], true)) {
            return response()->json([
                'status' => 'error',
                'message' => "Cannot change booking status from {$currentStatus} to {$nextStatus}",
            ], 422);
        }

        $item->status = $nextStatus;
        $item->save();
        $item->refresh();

        $this->syncCustomerRecord($item->customer_email);

        return response()->json([
            'status' => 'success',
            'message' => $nextStatus === 'confirmed'
                ? 'Booking confirmed successfully'
                : 'Booking cancelled successfully',
            'booking' => $item->fresh(),
        ], 200);
    }
}
