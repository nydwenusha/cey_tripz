<?php

namespace App\Http\Controllers;

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

            $client = new Client($sid, $token);

            $message = $client->messages->create(
                'whatsapp:' . $to,
                [
                    'from' => 'whatsapp:' . $from,
                    'contentSid' => 'HXda0e728c2196c8c0aeb93038df43ed41',
                    'contentVariables' => json_encode([
                        "1" => $booking->customer_name,
                        "2" => $booking->customer_phone,
                        "3" => $booking->pickup_date,
                        "4" => $booking->return_date,
                        "5" => $booking->vehicle_type,
                    ]),
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
        }
    }
}
