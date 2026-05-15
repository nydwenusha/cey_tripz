<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'image',
        'author',
        'author_avatar',
        'date',
        'category',
        'category_id',
        'status',
        'scheduled_date',
        'is_featured',
        'meta_title',
        'meta_description',
        'location',
        'read_time',
        'likes',
        'excerpt',
        'content',
        'user_id',
    ];

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blog_post_tag', 'blog_post_id', 'tag_id');
    }

    public function categoryRelation()
    {
        return $this->belongsTo(BlogPostCategory::class, 'category_id');
    }
}
