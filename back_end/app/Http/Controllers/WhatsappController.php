<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;
use Twilio\Rest\Client;

class WhatsappController extends Controller
{
    public function sendMessage($booking): JsonResponse   
    {
        try {
            $sid = env('TWILIO_SID');
            $token = env('TWILIO_AUTH_TOKEN');
            $from = env('TWILIO_WHATSAPP_FROM');
            $to = env('TWILIO_WHATSAPP_TO');
            $body = "New Booking Alert!\nCustomer: {$booking->customer_name}\nEmail: {$booking->customer_email}\nPhone: {$booking->customer_phone}\nPickup: {$booking->pickup_location} on {$booking->pickup_date}\nDrop: {$booking->drop_location} on {$booking->return_date}\nVehicle: {$booking->vehicle_type}\nPassengers: {$booking->passengers}\nAmount: \${$booking->amount}\nNotes: {$booking->notes}";
            $client = new Client($sid, $token);

            $message = $client->messages->create(
                'whatsapp:' . $to,
                [
                    'from' => 'whatsapp:' . $from,
                    'body' => $body
                ]
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Message sent successfully',
                'sid' => $message->sid,
            ], 200);
        } catch (\Exception $e) {
            Log::error('WhatsApp Message Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send message: ' . $e->getMessage(),
            ], 500);
        };
    }
}
