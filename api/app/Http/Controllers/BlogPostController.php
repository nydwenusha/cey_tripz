<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BlogPostCategory;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class BlogPostController extends Controller
{
    public function index()
    {
        $blogPosts = BlogPost::all();

        if ($blogPosts->isEmpty()) {
            return response()->json(['message' => 'No blog posts found.'], 404);
        }

        return response()->json([
            'message' => 'Blog posts retrieved successfully.',
            'blogPosts' => $blogPosts
        ], 200);
    }

    public function show($id)
    {
        $post = BlogPost::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json([
            'blogPost' => $post,
            'status' => 'success'
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'excerpt' => 'required|string|max:255',
                'category' => 'required|string',
                'featuredImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'tags' => 'nullable|array',
                'tags.*' => 'string|max:50',
            ]);
        } catch (ValidationException $e) {
            Log::error('Validation failed for blog post', [
                'errors' => $e->errors(),
                'input' => $request->all()
            ]);

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        $category = BlogPostCategory::where('name', $validated['category'])->first();

        if (!$category) {
            return response()->json([
                'message' => 'The category does not exist.',
                'errors' => ['category' => ['This category does not exist in the system.']]
            ], 422);
        }

        // Handle featured image upload to API server public storage
        $featuredImagePath = null;
        if ($request->hasFile('featuredImage')) {
            $file = $request->file('featuredImage');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('storage/blog_images'), $fileName); // move to public/blog_images
            $featuredImagePath = 'blog_images/' . $fileName; // relative path for DB
        }

        $authorName = Auth::check() ? User::find(Auth::id())->name : 'Unknown Author';

        // Create blog post
        $blogPost = BlogPost::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $category->name,
            'excerpt' => $validated['excerpt'],
            'category_id' => $category->id,
            'image' => $featuredImagePath,
            'image_url' => $featuredImagePath ? asset('storage/' . $featuredImagePath) : null,
            'author' => $authorName,
            'date' => now()->toDateString(),
            'user_id' => Auth::id(),
        ]);

        // Attach tags if provided
        if (!empty($validated['tags'])) {
            $tagIds = Tag::whereIn('name', $validated['tags'])->pluck('id')->toArray();
            if (!empty($tagIds)) {
                $blogPost->tags()->attach($tagIds);
            }
        }

        return response()->json([
            'message' => 'Blog post created successfully',
            'blogPost' => $blogPost
        ], 201);
    }

    public function destroy($id)
    {
        $post = BlogPost::find($id);

        if (!$post) {
            return response()->json(['message' => 'Blog post not found.'], 404);
        }

        if (Auth::id() !== $post->user_id) {
            return response()->json(['message' => 'You are not authorized to delete this post.'], 403);
        }

        // Delete image from public storage
        if ($post->image && Storage::disk('public')->exists($post->image)) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return response()->json(['message' => 'Blog post deleted successfully.'], 200);
    }
}
