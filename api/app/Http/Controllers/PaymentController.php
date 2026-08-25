<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|in:5,10,25,50',
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:pending,completed,failed,refunded',
            'payment_method' => 'nullable|string|in:Credit Card,Debit Card,PayPal,Bank Transfer,Cash',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $search = trim((string) $request->query('search', ''));
        $status = trim((string) $request->query('status', ''));
        $paymentMethod = trim((string) $request->query('payment_method', ''));

        $query = Payment::query();

        if ($search !== '') {
            $likeSearch = '%' . $search . '%';

            $query->where(function ($builder) use ($likeSearch) {
                $builder->where('payment_code', 'like', $likeSearch)
                    ->orWhere('customer_name', 'like', $likeSearch)
                    ->orWhere('customer_email', 'like', $likeSearch)
                    ->orWhere('transaction_id', 'like', $likeSearch)
                    ->orWhere('description', 'like', $likeSearch);
            });
        }

        if ($status !== '') {
            $query->where('status', $status);
        }

        if ($paymentMethod !== '') {
            $query->where('payment_method', $paymentMethod);
        }

        $payments = $query
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'status' => 'success',
            'payments' => $payments->items(),
            'pagination' => [
                'current_page' => $payments->currentPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
                'last_page' => $payments->lastPage(),
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'payment_method' => $paymentMethod,
            ],
        ], 200);
    }

    public function show(int $id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'payment' => $payment,
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'nullable|integer|exists:bookings,id',
            'customer_name' => 'nullable|string|max:255|required_without:booking_id',
            'customer_email' => 'nullable|string|email|max:255|required_without:booking_id',
            'amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'payment_method' => 'required|string|in:Credit Card,Debit Card,PayPal,Bank Transfer,Cash',
            'status' => 'required|string|in:pending,completed,failed,refunded',
            'transaction_id' => 'nullable|string|max:255|unique:payments,transaction_id',
            'payment_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $booking = null;

        if (!empty($validated['booking_id'])) {
            $booking = Booking::find($validated['booking_id']);
        }

        $customerName = trim((string) ($validated['customer_name'] ?? ($booking?->customer_name ?? '')));
        $customerEmail = trim((string) ($validated['customer_email'] ?? ($booking?->customer_email ?? '')));

        if ($customerName === '' || $customerEmail === '') {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer name and customer email are required',
            ], 422);
        }

        $paymentDate = $validated['payment_date'] ?? null;

        if (($validated['status'] ?? '') === 'completed' && empty($paymentDate)) {
            $paymentDate = now();
        }

        $payment = DB::transaction(function () use ($validated, $customerName, $customerEmail, $paymentDate) {
            $createdPayment = Payment::create([
                'booking_id' => $validated['booking_id'] ?? null,
                'customer_name' => $customerName,
                'customer_email' => $customerEmail,
                'amount' => $validated['amount'],
                'currency' => strtoupper((string) ($validated['currency'] ?? 'USD')),
                'payment_method' => $validated['payment_method'],
                'status' => $validated['status'],
                'transaction_id' => $validated['transaction_id'] ?? null,
                'payment_date' => $paymentDate,
                'due_date' => $validated['due_date'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            $createdPayment->payment_code = 'PAY-' . str_pad((string) $createdPayment->id, 5, '0', STR_PAD_LEFT);
            $createdPayment->save();

            return $createdPayment->fresh();
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Payment created successfully',
            'payment' => $payment,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:Credit Card,Debit Card,PayPal,Bank Transfer,Cash',
            'status' => 'required|string|in:pending,completed,failed,refunded',
            'transaction_id' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('payments', 'transaction_id')->ignore($payment->id),
            ],
            'payment_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $paymentDate = $validated['payment_date'] ?? null;

        if (($validated['status'] ?? '') === 'completed' && empty($paymentDate)) {
            $paymentDate = now();
        }

        $payment->update([
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'status' => $validated['status'],
            'transaction_id' => $validated['transaction_id'] ?? null,
            'payment_date' => $paymentDate,
            'due_date' => $validated['due_date'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Payment updated successfully',
            'payment' => $payment->fresh(),
        ], 200);
    }

    public function stats(): JsonResponse
    {
        $statusTotals = Payment::query()
            ->select('status', DB::raw('COALESCE(SUM(amount), 0) as total_amount'), DB::raw('COUNT(*) as total_count'))
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        $completedTotal = (float) ($statusTotals->get('completed')->total_amount ?? 0);
        $pendingTotal = (float) ($statusTotals->get('pending')->total_amount ?? 0);
        $failedTotal = (float) ($statusTotals->get('failed')->total_amount ?? 0);
        $refundedTotal = (float) ($statusTotals->get('refunded')->total_amount ?? 0);

        $stats = [
            'total' => $completedTotal + $pendingTotal - $refundedTotal,
            'completed' => $completedTotal,
            'pending' => $pendingTotal,
            'failed' => $failedTotal,
            'refunded' => $refundedTotal,
            'counts' => [
                'all' => (int) $statusTotals->sum('total_count'),
                'completed' => (int) ($statusTotals->get('completed')->total_count ?? 0),
                'pending' => (int) ($statusTotals->get('pending')->total_count ?? 0),
                'failed' => (int) ($statusTotals->get('failed')->total_count ?? 0),
                'refunded' => (int) ($statusTotals->get('refunded')->total_count ?? 0),
            ],
        ];

        return response()->json([
            'status' => 'success',
            'stats' => $stats,
        ], 200);
    }
}
