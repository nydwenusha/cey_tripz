<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use App\Models\ReviewImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    private const MAX_REVIEW_IMAGE_SIZE_KB = 10240;

    public function index(): JsonResponse
    {
        $reviews = Review::with('images')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'reviews' => $reviews->map(function (Review $review) {
                return $this->transformReview($review);
            })->values(),
        ]);
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $perPage = min(
            max((int) $request->query('per_page', $request->query('limit', 8)), 1),
            100
        );
        $requestedPage = max((int) $request->query('page', 1), 1);

        $query = Review::with('images')
            ->where('status', 'published')
            ->orderByDesc('updated_at')
            ->orderByDesc('created_at');

        $total = (clone $query)->count();
        $lastPage = max((int) ceil($total / $perPage), 1);
        $currentPage = min($requestedPage, $lastPage);

        $reviews = $query
            ->forPage($currentPage, $perPage)
            ->get();

        return response()->json([
            'status' => 'success',
            'reviews' => $reviews->map(function (Review $review) {
                return $this->transformReview($review);
            })->values(),
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $currentPage,
                'last_page' => $lastPage,
            ],
        ]);
    }

    public function bookingOptions(): JsonResponse
    {
        $bookings = Booking::query()
            ->orderByDesc('created_at')
            ->get([
                'id',
                'customer_name',
                'customer_email',
                'pickup_location',
                'drop_location',
                'vehicle_type',
                'status',
                'created_at',
            ]);

        return response()->json([
            'status' => 'success',
            'bookings' => $bookings,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'tour_name' => 'required|string|max:191',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:5000',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:' . self::MAX_REVIEW_IMAGE_SIZE_KB,
        ], [
            'images.max' => 'You can upload up to 10 photos per review.',
            'images.*.image' => 'Each uploaded file must be a valid image.',
            'images.*.mimes' => 'Photos must be JPEG, PNG, JPG, GIF, or WEBP files.',
            'images.*.max' => 'Each photo must be less than 10 MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $review = DB::transaction(function () use ($validated, $request) {
            $createdReview = Review::create([
                'customer_name' => trim($validated['customer_name']),
                'tour_name' => trim($validated['tour_name']),
                'rating' => (int) $validated['rating'],
                'comment' => trim($validated['comment']),
                'status' => 'pending',
            ]);

            $createdReview->review_code = 'REV-' . str_pad((string) $createdReview->id, 5, '0', STR_PAD_LEFT);
            $createdReview->save();

            $imageFiles = $request->file('images', []);

            foreach ($imageFiles as $index => $imageFile) {
                $storedImagePath = $this->storeImage($imageFile, $createdReview->id, $index);

                ReviewImage::create([
                    'review_id' => $createdReview->id,
                    'image_path' => $storedImagePath,
                    'image_title' => pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME),
                    'sort_order' => $index,
                    'is_cover' => $index === 0,
                ]);
            }

            return $createdReview->load('images');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Review submitted successfully. It is now pending admin review.',
            'review' => $this->transformReview($review),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'nullable|integer|exists:bookings,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:191',
            'tour_name' => 'required|string|max:191',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:5000',
            'status' => 'required|string|in:pending,published,rejected,reported',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $review = Review::with('images')->find($id);

        if (!$review) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review not found',
            ], 404);
        }

        $validated = $validator->validated();
        $booking = null;

        if (!empty($validated['booking_id'])) {
            $booking = Booking::find($validated['booking_id']);
        }

        $status = $validated['status'] === 'reported' ? 'rejected' : $validated['status'];

        $review->update([
            'booking_id' => $booking?->id,
            'customer_name' => $booking ? $booking->customer_name : trim($validated['customer_name']),
            'customer_email' => $booking ? $booking->customer_email : ($validated['customer_email'] ?? null),
            'tour_name' => trim($validated['tour_name']),
            'rating' => (int) $validated['rating'],
            'comment' => trim($validated['comment']),
            'status' => $status,
        ]);

        $review->refresh();
        $review->load('images');

        return response()->json([
            'status' => 'success',
            'message' => 'Review updated successfully',
            'review' => $this->transformReview($review),
        ]);
    }

    protected function transformReview(Review $review): array
    {
        return [
            'id' => $review->id,
            'review_code' => $review->review_code,
            'booking_id' => $review->booking_id,
            'customer_name' => $review->customer_name,
            'customer_email' => $review->customer_email,
            'tour_name' => $review->tour_name,
            'rating' => (int) $review->rating,
            'comment' => $review->comment,
            'status' => $review->status,
            'created_at' => optional($review->created_at)->toDateTimeString(),
            'updated_at' => optional($review->updated_at)->toDateTimeString(),
            'images' => $review->images->map(function (ReviewImage $image) {
                return [
                    'id' => $image->id,
                    'image_path' => $image->image_path,
                    'image_url' => $this->normalizeImagePath($image->image_path),
                    'image_title' => $image->image_title,
                    'sort_order' => $image->sort_order,
                    'is_cover' => $image->is_cover,
                    'created_at' => optional($image->created_at)->toDateTimeString(),
                ];
            })->values(),
        ];
    }

    protected function normalizeImagePath(?string $imagePath): ?string
    {
        $trimmedPath = trim((string) $imagePath);

        if ($trimmedPath === '') {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $trimmedPath)) {
            return $trimmedPath;
        }

        return asset('storage/' . ltrim($trimmedPath, '/'));
    }

    protected function storeImage(UploadedFile $image, int $reviewId, int $index): string
    {
        $directory = public_path('storage/reviews/' . $reviewId);

        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $fileName = time() . '_' . $index . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $image->getClientOriginalName());
        $image->move($directory, $fileName);

        return 'reviews/' . $reviewId . '/' . $fileName;
    }
}
