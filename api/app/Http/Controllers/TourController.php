<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Tour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TourController extends Controller
{
    private function tourRules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'status' => 'required|string|max:30',
            'category' => 'required|string|max:100',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'description' => 'nullable|string',
            'duration' => 'required|string|max:100',
            'max_participants' => 'required|integer|min:1',
            'difficulty' => 'required|string|max:50',
            'inclusions' => 'nullable|array',
            'inclusions.*' => 'string|max:255',
            'exclusions' => 'nullable|array',
            'exclusions.*' => 'string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:80',
            'featured' => 'nullable|boolean',
            'highlights' => 'nullable|array',
            'highlights.*' => 'string|max:255',
            'meeting_point' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'cancellation_policy' => 'nullable|string|max:80',
        ];
    }

    public function publicIndex(): JsonResponse
    {
        $tours = Tour::query()
            ->where('status', 'active')
            ->orderByDesc('featured')
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'tours' => $this->formatTourCollection($tours),
        ], 200);
    }

    public function publicShow(int $id): JsonResponse
    {
        $tour = Tour::query()
            ->where('status', 'active')
            ->find($id);

        if (!$tour) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tour not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'tour' => $this->formatTour($tour, $this->getReviewStats(collect([$tour]))),
        ], 200);
    }

    public function index(): JsonResponse
    {
        $tours = Tour::query()
            ->orderByDesc('featured')
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'tours' => $this->formatTourCollection($tours),
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), $this->tourRules());

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $payload = $this->payloadFromValidated($validator->validated());
        $payload['photo_path'] = $this->storeUploadedPhoto($request);

        $tour = Tour::create($payload);

        return response()->json([
            'status' => 'success',
            'message' => 'Tour added successfully',
            'tour' => $this->formatTour($tour, $this->getReviewStats(collect([$tour]))),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), $this->tourRules());

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tour not found',
            ], 404);
        }

        $payload = $this->payloadFromValidated($validator->validated());
        $photoPath = $this->storeUploadedPhoto($request, $tour->photo_path);

        if ($photoPath !== null) {
            $payload['photo_path'] = $photoPath;
        }

        $tour->update($payload);
        $freshTour = $tour->fresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Tour updated successfully',
            'tour' => $this->formatTour($freshTour, $this->getReviewStats(collect([$freshTour]))),
        ], 200);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|max:30',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tour not found',
            ], 404);
        }

        $tour->update([
            'status' => $this->normalizeStatus($validator->validated()['status']),
        ]);

        $freshTour = $tour->fresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Tour status updated successfully',
            'tour' => $this->formatTour($freshTour, $this->getReviewStats(collect([$freshTour]))),
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

        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tour not found',
            ], 404);
        }

        $tour->update([
            'featured' => (bool) $validator->validated()['featured'],
        ]);

        $freshTour = $tour->fresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Tour feature status updated successfully',
            'tour' => $this->formatTour($freshTour, $this->getReviewStats(collect([$freshTour]))),
        ], 200);
    }

    public function destroy(int $id): JsonResponse
    {
        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tour not found',
            ], 404);
        }

        $this->deleteStoredPhoto($tour->photo_path);
        $tour->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tour deleted successfully',
        ], 200);
    }

    private function payloadFromValidated(array $validated): array
    {
        return [
            'name' => trim((string) $validated['name']),
            'destination' => trim((string) $validated['destination']),
            'price' => $validated['price'],
            'status' => $this->normalizeStatus($validated['status']),
            'category' => trim((string) $validated['category']),
            'description' => trim((string) ($validated['description'] ?? '')),
            'duration' => trim((string) $validated['duration']),
            'max_participants' => $validated['max_participants'],
            'difficulty' => trim((string) $validated['difficulty']),
            'inclusions' => array_values($validated['inclusions'] ?? []),
            'exclusions' => array_values($validated['exclusions'] ?? []),
            'tags' => array_values($validated['tags'] ?? []),
            'featured' => (bool) ($validated['featured'] ?? false),
            'highlights' => array_values($validated['highlights'] ?? []),
            'meeting_point' => trim((string) ($validated['meeting_point'] ?? '')),
            'requirements' => trim((string) ($validated['requirements'] ?? '')),
            'cancellation_policy' => trim((string) ($validated['cancellation_policy'] ?? 'standard')),
        ];
    }

    private function normalizeStatus(string $status): string
    {
        $normalized = strtolower(trim($status));

        return in_array($normalized, ['active', 'inactive', 'draft'], true) ? $normalized : 'active';
    }

    private function displayStatus(string $status): string
    {
        return ucfirst($this->normalizeStatus($status));
    }

    private function formatTourCollection(Collection $tours): array
    {
        $reviewStats = $this->getReviewStats($tours);

        return $tours
            ->map(fn (Tour $tour) => $this->formatTour($tour, $reviewStats))
            ->values()
            ->all();
    }

    private function getReviewStats(Collection $tours): Collection
    {
        $tourNames = $tours->pluck('name')->filter()->unique()->values();

        if ($tourNames->isEmpty()) {
            return collect();
        }

        return Review::query()
            ->select(
                'tour_name',
                DB::raw('COUNT(*) as total_reviews'),
                DB::raw('AVG(rating) as average_rating')
            )
            ->whereIn('tour_name', $tourNames)
            ->groupBy('tour_name')
            ->get()
            ->keyBy('tour_name');
    }

    private function formatTour(Tour $tour, Collection $reviewStats): array
    {
        $stats = $reviewStats->get($tour->name);
        $reviewCount = (int) ($stats->total_reviews ?? 0);
        $averageRating = $stats ? round((float) $stats->average_rating, 1) : 0;

        return [
            'id' => $tour->id,
            'name' => $tour->name,
            'destination' => $tour->destination,
            'price' => (float) $tour->price,
            'status' => $this->displayStatus($tour->status),
            'statusValue' => $tour->status,
            'category' => $tour->category,
            'photoPath' => $tour->photo_path,
            'photoUrl' => $this->normalizePhotoPath($tour->photo_path),
            'description' => $tour->description,
            'duration' => $tour->duration,
            'maxParticipants' => $tour->max_participants,
            'capacity' => $tour->max_participants,
            'difficulty' => $tour->difficulty,
            'inclusions' => array_values($tour->inclusions ?? []),
            'exclusions' => array_values($tour->exclusions ?? []),
            'tags' => array_values($tour->tags ?? []),
            'featured' => (bool) $tour->featured,
            'highlights' => array_values($tour->highlights ?? []),
            'meetingPoint' => $tour->meeting_point,
            'requirements' => $tour->requirements,
            'cancellationPolicy' => $tour->cancellation_policy,
            'bookings' => 0,
            'rating' => $averageRating,
            'reviewCount' => $reviewCount,
            'revenue' => 0,
            'created_at' => $tour->created_at,
            'updated_at' => $tour->updated_at,
        ];
    }

    private function storeUploadedPhoto(Request $request, ?string $existingPhoto = null): ?string
    {
        if (!$request->hasFile('photo')) {
            return $existingPhoto;
        }

        $photo = $request->file('photo');
        $uploadDirectory = public_path('storage/tours');

        if (!is_dir($uploadDirectory)) {
            mkdir($uploadDirectory, 0755, true);
        }

        $this->deleteStoredPhoto($existingPhoto);

        $fileName = time() . '_' . uniqid('', true) . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $photo->getClientOriginalName());
        $photo->move($uploadDirectory, $fileName);

        return 'tours/' . $fileName;
    }

    private function normalizePhotoPath(?string $photoPath): ?string
    {
        $trimmedPath = trim((string) $photoPath);

        if ($trimmedPath === '') {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $trimmedPath)) {
            return $trimmedPath;
        }

        return asset('storage/' . ltrim($trimmedPath, '/'));
    }

    private function deleteStoredPhoto(?string $photoPath): void
    {
        $trimmedPath = trim((string) $photoPath);

        if ($trimmedPath === '' || preg_match('/^https?:\/\//i', $trimmedPath)) {
            return;
        }

        $fullPath = public_path('storage/' . ltrim($trimmedPath, '/'));

        if (file_exists($fullPath)) {
            @unlink($fullPath);
        }
    }
}
