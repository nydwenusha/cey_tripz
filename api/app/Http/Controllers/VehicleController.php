<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    private function vehicleRules(bool $includeImages = true): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
            'category' => 'required|string|max:100',
            'daily_rate' => 'required|numeric|min:0',
            'weekly_rate' => 'required|numeric|min:0',
            'monthly_rate' => 'required|numeric|min:0',
            'fuel_type' => 'required|string|max:50',
            'transmission' => 'required|string|max:50',
            'year' => 'nullable|integer|min:2000|max:2100',
            'color' => 'nullable|string|max:100',
            'mileage' => 'nullable|string|max:50',
            'engine' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1|max:100',
            'featured' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ];

        if ($includeImages) {
            $rules['images'] = 'nullable|array|max:4';
            $rules['images.*'] = 'image|mimes:jpeg,png,jpg,gif,webp|max:5120';
        }

        return $rules;
    }

    public function publicIndex(): JsonResponse
    {
        $vehicles = Vehicle::query()
            ->where('status', 'active')
            ->orderByDesc('featured')
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'vehicles' => $this->formatVehicleCollection($vehicles),
        ], 200);
    }

    public function publicShow(int $id): JsonResponse
    {
        $vehicle = Vehicle::query()
            ->where('status', 'active')
            ->find($id);

        if (!$vehicle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vehicle not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'vehicle' => $this->formatVehicle($vehicle, $this->getBookingStats(collect([$vehicle]))),
        ], 200);
    }

    public function index(): JsonResponse
    {
        $vehicles = Vehicle::query()
            ->orderByDesc('featured')
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'vehicles' => $this->formatVehicleCollection($vehicles),
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), $this->vehicleRules());

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $imagePaths = [];

        if ($request->hasFile('images')) {
            $imagePaths = $this->storeUploadedImages($request->file('images'));
        }

        $vehicle = Vehicle::create([
            'name' => trim((string) $validated['name']),
            'type' => trim((string) $validated['type']),
            'description' => trim((string) ($validated['description'] ?? '')),
            'status' => $validated['status'],
            'category' => trim((string) $validated['category']),
            'daily_rate' => $validated['daily_rate'],
            'weekly_rate' => $validated['weekly_rate'],
            'monthly_rate' => $validated['monthly_rate'],
            'fuel_type' => trim((string) $validated['fuel_type']),
            'transmission' => trim((string) $validated['transmission']),
            'year' => $validated['year'] ?? null,
            'color' => trim((string) ($validated['color'] ?? '')),
            'mileage' => trim((string) ($validated['mileage'] ?? '')),
            'engine' => trim((string) $validated['engine']),
            'capacity' => $validated['capacity'],
            'tags' => array_values($validated['tags'] ?? []),
            'featured' => (bool) ($validated['featured'] ?? false),
            'images' => $imagePaths,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle added successfully',
            'vehicle' => $this->formatVehicle($vehicle, $this->getBookingStats(collect([$vehicle]))),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), $this->vehicleRules(false));

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vehicle not found',
            ], 404);
        }

        $validated = $validator->validated();

        $vehicle->update([
            'name' => trim((string) $validated['name']),
            'type' => trim((string) $validated['type']),
            'description' => trim((string) ($validated['description'] ?? '')),
            'status' => $validated['status'],
            'category' => trim((string) $validated['category']),
            'daily_rate' => $validated['daily_rate'],
            'weekly_rate' => $validated['weekly_rate'],
            'monthly_rate' => $validated['monthly_rate'],
            'fuel_type' => trim((string) $validated['fuel_type']),
            'transmission' => trim((string) $validated['transmission']),
            'year' => $validated['year'] ?? null,
            'color' => trim((string) ($validated['color'] ?? '')),
            'mileage' => trim((string) ($validated['mileage'] ?? '')),
            'engine' => trim((string) $validated['engine']),
            'capacity' => $validated['capacity'],
            'tags' => array_values($validated['tags'] ?? []),
            'featured' => (bool) ($validated['featured'] ?? false),
        ]);

        $freshVehicle = $vehicle->fresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle updated successfully',
            'vehicle' => $this->formatVehicle($freshVehicle, $this->getBookingStats(collect([$freshVehicle]))),
        ], 200);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vehicle not found',
            ], 404);
        }

        $vehicle->update([
            'status' => $validator->validated()['status'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle status updated successfully',
            'vehicle' => $this->formatVehicle($vehicle->fresh(), $this->getBookingStats(collect([$vehicle->fresh()]))),
        ], 200);
    }

    public function updateFeatured(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'featured' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vehicle not found',
            ], 404);
        }

        $vehicle->update([
            'featured' => (bool) $validator->validated()['featured'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle feature status updated successfully',
            'vehicle' => $this->formatVehicle($vehicle->fresh(), $this->getBookingStats(collect([$vehicle->fresh()]))),
        ], 200);
    }

    public function addImage(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'images' => 'required|array|min:1|max:4',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vehicle not found',
            ], 404);
        }

        $images = $vehicle->images ?? [];
        $storedImages = $this->storeUploadedImages($request->file('images'));
        $images = array_values(array_merge($images, $storedImages));

        $vehicle->update([
            'images' => $images,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => count($storedImages) > 1
                ? 'Vehicle images added successfully'
                : 'Vehicle image added successfully',
            'vehicle' => $this->formatVehicle($vehicle->fresh(), $this->getBookingStats(collect([$vehicle->fresh()]))),
        ], 200);
    }

    public function removeImage(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'index' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vehicle not found',
            ], 404);
        }

        $images = $vehicle->images ?? [];
        $index = (int) $validator->validated()['index'];

        if (!array_key_exists($index, $images)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vehicle image not found',
            ], 404);
        }

        $removedImage = $images[$index];
        unset($images[$index]);

        $vehicle->update([
            'images' => array_values($images),
        ]);

        $this->deleteStoredImage($removedImage);

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle image removed successfully',
            'vehicle' => $this->formatVehicle($vehicle->fresh(), $this->getBookingStats(collect([$vehicle->fresh()]))),
        ], 200);
    }

    public function destroy(int $id): JsonResponse
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vehicle not found',
            ], 404);
        }

        foreach ($vehicle->images ?? [] as $image) {
            $this->deleteStoredImage($image);
        }

        $vehicle->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle deleted successfully',
        ], 200);
    }

    private function formatVehicleCollection(Collection $vehicles): array
    {
        $bookingStats = $this->getBookingStats($vehicles);

        return $vehicles
            ->map(fn (Vehicle $vehicle) => $this->formatVehicle($vehicle, $bookingStats))
            ->values()
            ->all();
    }

    private function getBookingStats(Collection $vehicles): Collection
    {
        $vehicleNames = $vehicles->pluck('name')->filter()->unique()->values();

        if ($vehicleNames->isEmpty()) {
            return collect();
        }

        return Booking::query()
            ->select(
                'vehicle_type',
                DB::raw('COUNT(*) as total_bookings'),
                DB::raw("COALESCE(SUM(CASE WHEN status IN ('confirmed', 'completed') THEN amount ELSE 0 END), 0) as total_revenue")
            )
            ->whereIn('vehicle_type', $vehicleNames)
            ->groupBy('vehicle_type')
            ->get()
            ->keyBy('vehicle_type');
    }

    private function formatVehicle(Vehicle $vehicle, Collection $bookingStats): array
    {
        $stats = $bookingStats->get($vehicle->name);
        $revenueValue = (float) ($stats->total_revenue ?? 0);
        $totalBookings = (int) ($stats->total_bookings ?? 0);
        $storedImages = collect($vehicle->images ?? [])
            ->filter(fn ($image) => trim((string) $image) !== '')
            ->values()
            ->all();
        $imageUrls = collect($storedImages)
            ->map(fn ($image) => $this->normalizeImagePath($image))
            ->filter()
            ->values()
            ->all();

        return [
            'id' => $vehicle->id,
            'name' => $vehicle->name,
            'type' => $vehicle->type,
            'description' => $vehicle->description,
            'shortDesc' => $vehicle->description,
            'status' => $vehicle->status,
            'category' => $vehicle->category,
            'dailyRate' => (float) $vehicle->daily_rate,
            'weeklyRate' => (float) $vehicle->weekly_rate,
            'monthlyRate' => (float) $vehicle->monthly_rate,
            'engineValue' => $vehicle->engine,
            'mileageValue' => $vehicle->mileage,
            'capacityValue' => $vehicle->capacity,
            'price' => '$' . number_format((float) $vehicle->daily_rate, 2) . '/day',
            'revenue' => '$' . number_format($revenueValue, 2),
            'revenueValue' => $revenueValue,
            'rating' => 0,
            'totalBookings' => $totalBookings,
            'featured' => (bool) $vehicle->featured,
            'tags' => array_values($vehicle->tags ?? []),
            'capacity' => $vehicle->capacity ? $vehicle->capacity . ' persons' : null,
            'duration' => 'Daily rental',
            'images' => $imageUrls,
            'imagePaths' => $storedImages,
            'cardImg' => $imageUrls[0] ?? null,
            'fuelType' => $vehicle->fuel_type,
            'transmission' => $vehicle->transmission,
            'year' => (string) ($vehicle->year ?? ''),
            'color' => $vehicle->color,
            'mileage' => $this->formatMileage($vehicle->mileage),
            'engine' => $this->formatEngine($vehicle->engine),
            'specs' => array_values(array_filter([
                $vehicle->capacity ? $vehicle->capacity . ' Seats' : null,
                $vehicle->fuel_type ?: null,
                $vehicle->transmission ?: null,
                $this->formatEngine($vehicle->engine),
                $this->formatMileage($vehicle->mileage),
            ])),
        ];
    }

    private function storeUploadedImages(array $images): array
    {
        $uploadDirectory = public_path('storage/vehicles');

        if (!is_dir($uploadDirectory)) {
            mkdir($uploadDirectory, 0755, true);
        }

        $storedPaths = [];

        foreach ($images as $index => $image) {
            $fileName = time() . '_' . $index . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $image->getClientOriginalName());
            $image->move($uploadDirectory, $fileName);
            $storedPaths[] = 'vehicles/' . $fileName;
        }

        return $storedPaths;
    }

    private function normalizeImagePath(string $imagePath): ?string
    {
        $trimmedPath = trim($imagePath);

        if ($trimmedPath === '') {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $trimmedPath)) {
            return $trimmedPath;
        }

        return asset('storage/' . ltrim($trimmedPath, '/'));
    }

    private function deleteStoredImage(?string $imagePath): void
    {
        $trimmedPath = trim((string) $imagePath);

        if ($trimmedPath === '' || preg_match('/^https?:\/\//i', $trimmedPath)) {
            return;
        }

        $fullPath = public_path('storage/' . ltrim($trimmedPath, '/'));

        if (file_exists($fullPath)) {
            @unlink($fullPath);
        }
    }

    private function formatEngine(?string $engine): ?string
    {
        $value = trim((string) $engine);

        if ($value === '') {
            return null;
        }

        return preg_match('/[A-Za-z]/', $value) ? $value : $value . ' cc';
    }

    private function formatMileage(?string $mileage): ?string
    {
        $value = trim((string) $mileage);

        if ($value === '') {
            return null;
        }

        return preg_match('/km|\/|[A-Za-z]/i', $value) ? $value : $value . ' km/l';
    }
}
