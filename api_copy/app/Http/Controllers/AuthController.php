<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone_number' => ['required'],
            'role' => ['required', 'string', 'in:admin,tourist,guide,agent'],
            'status' => ['required', 'string', 'in:active,deactive,banned'],
        ]);

        if ($validator->fails()) {
            Log::info($validator->errors());
            return response()->json($validator->errors(), 422);
        };

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'role' => $request->role,
            'status' => $request->status
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => 'success',
            'message' => 'User created sucessfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        Log::info('First Step Completed!!!');

        if ($validator->fails()) {
            Log::info($validator->errors());
            return response()->json($validator->errors(), 422);
        }

        Log::info('Second Step Completed!!!');

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            Log::info('error detected');
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }

        Log::info('Third Step Completed!!!');

        return response()->json([
            'status' => 'success',
            'user' => JWTAuth::user(),
            'token' => $token,
        ]);
    }

    // Logout function
    public function logout(Request $request)
    {
        try {
            //  Token එක check කරන්න
            $token = JWTAuth::getToken();

            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token not provided'
                ], 401);
            }

            //  JWT Logout කරන්න
            JWTAuth::invalidate($token);

            //  Success response
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged out'
            ], 200);
        } catch (JWTException $e) {
            //  Token invalid නම්
            Log::error('JWT Logout Error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to logout, please try again'
            ], 500);
        }
    }

    // Get user profile
    public function profile()
    {
        return response()->json([
            'status' => 'success',
            'user' => JWTAuth::user(),
        ]);
    }
}
