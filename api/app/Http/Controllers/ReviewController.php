<?php

namespace App\Http\Controllers;

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
    public function index(): JsonResponse
    {
        $reviews = Review::with('images')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'reviews' => $reviews->map(function (Review $review) {
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
                            'image_url' => asset('storage/' . ltrim($image->image_path, '/')),
                            'image_title' => $image->image_title,
                            'sort_order' => $image->sort_order,
                            'is_cover' => $image->is_cover,
                            'created_at' => optional($image->created_at)->toDateTimeString(),
                        ];
                    })->values(),
                ];
            })->values(),
        ]);
    }

    public function store(Request $request): JsonResponse{
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'tour_name' => 'required|string|max:191',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:5000',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:4096',
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
            'review' => [
                'id' => $review->id,
                'review_code' => $review->review_code,
                'customer_name' => $review->customer_name,
                'tour_name' => $review->tour_name,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'status' => $review->status,
                'images' => $review->images->map(function (ReviewImage $image) {
                    return [
                        'id' => $image->id,
                        'image_path' => $image->image_path,
                        'image_url' => asset('storage/' . $image->image_path),
                        'image_title' => $image->image_title,
                        'sort_order' => $image->sort_order,
                        'is_cover' => $image->is_cover,
                    ];
                })->values(),
            ],
        ], 201);
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


