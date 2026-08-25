<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    protected $fillable = [
        'name',
        'destination',
        'price',
        'status',
        'category',
        'photo_path',
        'description',
        'duration',
        'max_participants',
        'difficulty',
        'inclusions',
        'exclusions',
        'tags',
        'featured',
        'highlights',
        'meeting_point',
        'requirements',
        'cancellation_policy',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'max_participants' => 'integer',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'tags' => 'array',
        'featured' => 'boolean',
        'highlights' => 'array',
    ];
}
