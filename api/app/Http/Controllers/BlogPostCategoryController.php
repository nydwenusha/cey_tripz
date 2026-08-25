<?php

namespace App\Http\Controllers;

use App\Models\BlogPostCategory;
use Illuminate\Http\Request;

class BlogPostCategoryController extends Controller
{
    public function index(){
        return BlogPostCategory::all();
    }

    public function store(Request $request){
        $request->validate([
            'category' => 'required|unique:blog_post_categories,name',
        ]);

        $category = BlogPostCategory::create([
            'name' => $request->category,
        ]);

        return response()->json($category, 201);

       
    }
}
