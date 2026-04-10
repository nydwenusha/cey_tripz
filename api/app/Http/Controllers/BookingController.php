<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{

    public function index()
    {
        $bookings = Booking::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Bookings retrieved successfully',
            'bookings' => $bookings,
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

    public function getTotalBookings()
    {
        $totalBookings = Booking::count();
        Log::info('Total bookings: ' . $totalBookings);
        return response()->json(['status' => 'success', 'message' => 'Total bookings retrieved successfully', 'total_bookings' => $totalBookings,], 200);
    }

    public function getTodayBookings(){
        $today = date('Y-m-d');
        $today_bookings = Booking::whereDate('created_at', $today)->count();
        Log::info('Today bookings: ' . $today_bookings);
        return response()->json(['status' => 'success', 'message' => 'Today bookings retrieved successfully', 'today_bookings' => $today_bookings,], 200);
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

        $item->status = $request->status;
        $item->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Booking status updated successfully',
            'booking' => $item,
        ], 200);
    }
}
