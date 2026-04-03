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
        'location',
        'read_time',
        'likes',
        'excerpt',
        'content',
        'user_id',
    ];

     public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blo_post_tag', 'blog_post_id', 'tag_id');
    }

 
}
