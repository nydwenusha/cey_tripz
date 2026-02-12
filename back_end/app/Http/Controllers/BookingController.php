<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{

    public function index(){
        $bookings = Booking::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Bookings retrieved successfully',
            'bookings' => $bookings,
        ], 200);
    }
    public function store(Request $request){
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

        if($validator->fails()){
            Log::info($validator->errors());
            return response()->json($validator->errors(), 422);
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

        $WhatsappController = app()->make(WhatsappController::class);
        $WhatsappController->sendMessage($booking);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking created successfully',
            'booking' => $booking,
        ], 201);
    }

}
