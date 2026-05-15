<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $search = trim((string) $request->query('search', ''));

        $query = DB::table('customers');

        if ($search !== '') {
            $likeSearch = '%' . $search . '%';

            $query->where(function ($builder) use ($likeSearch) {
                $builder->where('customer_name', 'like', $likeSearch)
                    ->orWhere('customer_email', 'like', $likeSearch)
                    ->orWhere('customer_phone', 'like', $likeSearch);
            });
        }

        $customers = $query
            ->orderByDesc('join_date')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'status' => 'success',
            'customers' => $customers,
        ], 200);
    }

    public function show(int $id): JsonResponse
    {
        $customer = DB::table('customers')->where('id', $id)->first();

        if (!$customer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'customer' => $customer,
        ], 200);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $customer = DB::table('customers')->where('id', $id)->first();

        if (!$customer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer not found',
            ], 404);
        }

        DB::table('customers')
            ->where('id', $id)
            ->update([
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'updated_at' => now(),
            ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Customer updated successfully',
            'customer' => DB::table('customers')->where('id', $id)->first(),
        ], 200);
    }

    public function destroy(int $id): JsonResponse
    {
        $customer = DB::table('customers')->where('id', $id)->first();

        if (!$customer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer not found',
            ], 404);
        }

        DB::table('customers')->where('id', $id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Customer deleted successfully',
        ], 200);
    }
}
