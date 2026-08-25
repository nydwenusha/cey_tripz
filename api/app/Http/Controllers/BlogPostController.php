<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BlogPostCategory;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index(): JsonResponse
    {
        $blogPosts = BlogPost::with(['tags:id,name', 'categoryRelation:id,name'])
            ->latest()
            ->get();

        return response()->json([
            'message' => $blogPosts->isEmpty() ? 'No blog posts found.' : 'Blog posts retrieved successfully.',
            'blogPosts' => $blogPosts->map(fn (BlogPost $post) => $this->formatBlogPost($post))->values()->all(),
        ], 200);
    }

    public function show(int $id): JsonResponse
    {
        $post = BlogPost::with(['tags:id,name', 'categoryRelation:id,name'])->find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'blogPost' => $this->formatBlogPost($post),
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $normalizedInput = $this->normalizeRequestPayload($request);

        $validator = Validator::make($normalizedInput, $this->rules());

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        [$category, $categoryError] = $this->resolveCategory($normalizedInput);

        if ($categoryError) {
            return $categoryError;
        }

        $featuredImagePath = $this->storeFeaturedImage($request);
        $authorName = Auth::user()?->name ?? 'Admin';

        $blogPostAttributes = [
            'title' => trim((string) $normalizedInput['title']),
            'content' => trim((string) $normalizedInput['content']),
            'excerpt' => trim((string) ($normalizedInput['excerpt'] ?? '')),
            'category' => $category->name,
            'category_id' => $category->id,
            'image' => $featuredImagePath,
            'author' => trim((string) ($normalizedInput['author'] ?? $authorName)),
            'author_avatar' => null,
            'date' => now()->toDateString(),
            'location' => trim((string) ($normalizedInput['location'] ?? '')),
            'read_time' => trim((string) ($normalizedInput['read_time'] ?? '')),
            'likes' => 0,
        ];

        if (Schema::hasColumn('blog_posts', 'status')) {
            $blogPostAttributes['status'] = $normalizedInput['status'];
        }
        if (Schema::hasColumn('blog_posts', 'scheduled_date')) {
            $blogPostAttributes['scheduled_date'] = $normalizedInput['status'] === 'scheduled'
                ? $normalizedInput['scheduled_date']
                : null;
        }
        if (Schema::hasColumn('blog_posts', 'is_featured')) {
            $blogPostAttributes['is_featured'] = (bool) ($normalizedInput['is_featured'] ?? false);
        }
        if (Schema::hasColumn('blog_posts', 'meta_title')) {
            $blogPostAttributes['meta_title'] = $normalizedInput['meta_title'] ?: null;
        }
        if (Schema::hasColumn('blog_posts', 'meta_description')) {
            $blogPostAttributes['meta_description'] = $normalizedInput['meta_description'] ?: null;
        }
        if (Schema::hasColumn('blog_posts', 'user_id')) {
            $blogPostAttributes['user_id'] = Auth::id();
        }

        $blogPost = BlogPost::create($blogPostAttributes);

        $this->syncTags($blogPost, $normalizedInput['tags'] ?? []);
        $blogPost->load(['tags:id,name', 'categoryRelation:id,name']);

        return response()->json([
            'message' => 'Blog post created successfully',
            'blogPost' => $this->formatBlogPost($blogPost),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $blogPost = BlogPost::with(['tags:id,name', 'categoryRelation:id,name'])->find($id);

        if (!$blogPost) {
            return response()->json([
                'message' => 'Blog post not found.',
            ], 404);
        }

        $normalizedInput = $this->normalizeRequestPayload($request);

        $validator = Validator::make($normalizedInput, $this->rules());

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        [$category, $categoryError] = $this->resolveCategory($normalizedInput);

        if ($categoryError) {
            return $categoryError;
        }

        $featuredImagePath = $this->storeFeaturedImage($request, $blogPost->image);

        $blogPostAttributes = [
            'title' => trim((string) $normalizedInput['title']),
            'content' => trim((string) $normalizedInput['content']),
            'excerpt' => trim((string) ($normalizedInput['excerpt'] ?? '')),
            'category' => $category->name,
            'category_id' => $category->id,
            'image' => $featuredImagePath ?? $blogPost->image,
            'author' => trim((string) ($normalizedInput['author'] ?? $blogPost->author ?? (Auth::user()?->name ?? 'Admin'))),
            'location' => trim((string) ($normalizedInput['location'] ?? '')),
            'read_time' => trim((string) ($normalizedInput['read_time'] ?? '')),
        ];

        if (Schema::hasColumn('blog_posts', 'status')) {
            $blogPostAttributes['status'] = $normalizedInput['status'];
        }
        if (Schema::hasColumn('blog_posts', 'scheduled_date')) {
            $blogPostAttributes['scheduled_date'] = $normalizedInput['status'] === 'scheduled'
                ? $normalizedInput['scheduled_date']
                : null;
        }
        if (Schema::hasColumn('blog_posts', 'is_featured')) {
            $blogPostAttributes['is_featured'] = (bool) ($normalizedInput['is_featured'] ?? false);
        }
        if (Schema::hasColumn('blog_posts', 'meta_title')) {
            $blogPostAttributes['meta_title'] = $normalizedInput['meta_title'] ?: null;
        }
        if (Schema::hasColumn('blog_posts', 'meta_description')) {
            $blogPostAttributes['meta_description'] = $normalizedInput['meta_description'] ?: null;
        }

        $blogPost->update($blogPostAttributes);

        $this->syncTags($blogPost, $normalizedInput['tags'] ?? []);
        $blogPost->load(['tags:id,name', 'categoryRelation:id,name']);

        return response()->json([
            'message' => 'Blog post updated successfully',
            'blogPost' => $this->formatBlogPost($blogPost),
        ], 200);
    }

    public function destroy(int $id): JsonResponse
    {
        $post = BlogPost::find($id);

        if (!$post) {
            return response()->json(['message' => 'Blog post not found.'], 404);
        }

        $this->deletePublicImage($post->image);

        $post->tags()->detach();
        $post->delete();

        return response()->json(['message' => 'Blog post deleted successfully.'], 200);
    }

    private function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer|exists:blog_post_categories,id',
            'status' => 'nullable|string|in:pending,draft,published,scheduled',
            'scheduled_date' => 'nullable|date',
            'is_featured' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'featuredImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'author' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'read_time' => 'nullable|string|max:255',
        ];
    }

    private function normalizeRequestPayload(Request $request): array
    {
        $normalizedInput = $request->all();
        $normalizedInput['tags'] = $this->normalizeTags($request->input('tags', []));
        $normalizedInput['title'] = trim((string) ($normalizedInput['title'] ?? ''));
        $normalizedInput['content'] = trim((string) ($normalizedInput['content'] ?? ''));
        $normalizedInput['excerpt'] = trim((string) ($normalizedInput['excerpt'] ?? ''));
        $normalizedInput['category'] = trim((string) ($normalizedInput['category'] ?? ''));
        $normalizedInput['category_id'] = ($normalizedInput['category_id'] ?? '') !== '' ? ($normalizedInput['category_id'] ?? null) : null;
        $normalizedInput['status'] = trim((string) ($normalizedInput['status'] ?? 'pending')) ?: 'pending';
        $normalizedInput['scheduled_date'] = $normalizedInput['scheduled_date'] ?? null;
        $normalizedInput['is_featured'] = filter_var($normalizedInput['is_featured'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $normalizedInput['meta_title'] = trim((string) ($normalizedInput['meta_title'] ?? ''));
        $normalizedInput['meta_description'] = trim((string) ($normalizedInput['meta_description'] ?? ''));
        $normalizedInput['location'] = trim((string) ($normalizedInput['location'] ?? ''));
        $normalizedInput['read_time'] = trim((string) ($normalizedInput['read_time'] ?? ''));

        return $normalizedInput;
    }

    private function normalizeTags(mixed $tags): array
    {
        if (is_string($tags)) {
            $decoded = json_decode($tags, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $tags = $decoded;
            } elseif (trim($tags) === '') {
                $tags = [];
            } else {
                $tags = [$tags];
            }
        }

        if (!is_array($tags)) {
            return [];
        }

        return collect($tags)
            ->map(fn ($tag) => trim((string) $tag))
            ->filter()
            ->unique(fn ($tag) => Str::lower($tag))
            ->values()
            ->all();
    }

    private function resolveCategory(array $input): array
    {
        $category = null;

        if (!empty($input['category_id'])) {
            $category = BlogPostCategory::find($input['category_id']);
        }

        if (!$category && !empty($input['category'])) {
            $category = BlogPostCategory::where('name', $input['category'])->first();
        }

        if (!$category) {
            return [
                null,
                response()->json([
                    'message' => 'The category does not exist.',
                    'errors' => ['category' => ['Please select a valid category.']],
                ], 422),
            ];
        }

        return [$category, null];
    }

    private function storeFeaturedImage(Request $request, ?string $existingImage = null): ?string
    {
        $file = $request->file('featuredImage') ?? $request->file('image');

        if (!$file) {
            return $existingImage;
        }

        $directory = public_path('storage/blog_images');
        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $this->deletePublicImage($existingImage);

        $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $extension = $file->getClientOriginalExtension();
        $storedFileName = $fileName . '.' . $extension;
        $file->move($directory, $storedFileName);

        return 'blog_images/' . $storedFileName;
    }

    private function deletePublicImage(?string $imagePath): void
    {
        if (!$imagePath) {
            return;
        }

        $absolutePath = public_path('storage/' . ltrim($imagePath, '/'));

        if (is_file($absolutePath)) {
            @unlink($absolutePath);
        }
    }

    private function syncTags(BlogPost $blogPost, array $tags): void
    {
        if (empty($tags)) {
            $blogPost->tags()->detach();
            return;
        }

        $tagIds = collect($tags)
            ->map(fn ($tagName) => Tag::firstOrCreate(['name' => $tagName])->id)
            ->values()
            ->all();

        $blogPost->tags()->sync($tagIds);
    }

    private function formatBlogPost(BlogPost $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => Str::slug($post->title),
            'image' => $post->image,
            'image_url' => $this->normalizeImagePath($post->image),
            'author' => $post->author,
            'author_avatar' => $post->author_avatar,
            'date' => $post->date,
            'published_date' => $post->date ?? optional($post->created_at)->toDateString(),
            'category' => $post->categoryRelation?->name ?? $post->category,
            'category_id' => $post->category_id,
            'location' => $post->location,
            'read_time' => $post->read_time,
            'likes' => (int) ($post->likes ?? 0),
            'views' => 0,
            'comments' => 0,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'status' => Schema::hasColumn('blog_posts', 'status') ? ($post->getAttribute('status') ?: 'draft') : 'published',
            'is_featured' => Schema::hasColumn('blog_posts', 'is_featured') ? (bool) $post->getAttribute('is_featured') : false,
            'meta_title' => Schema::hasColumn('blog_posts', 'meta_title') ? ($post->getAttribute('meta_title') ?? '') : '',
            'meta_description' => Schema::hasColumn('blog_posts', 'meta_description') ? ($post->getAttribute('meta_description') ?? '') : '',
            'scheduled_date' => Schema::hasColumn('blog_posts', 'scheduled_date') ? $post->getAttribute('scheduled_date') : null,
            'created_at' => $post->created_at,
            'updated_at' => $post->updated_at,
            'user_id' => Schema::hasColumn('blog_posts', 'user_id') ? $post->getAttribute('user_id') : null,
            'tags' => $post->tags->pluck('name')->values()->all(),
        ];
    }

    private function normalizeImagePath(?string $imagePath): ?string
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
}
