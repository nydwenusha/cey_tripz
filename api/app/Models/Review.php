<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Review extends Model
{
    protected $fillable = [
        'review_code',
        'booking_id',
        'customer_name',
        'customer_email',
        'tour_name',
        'rating',
        'comment',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(ReviewImage::class)->orderBy('sort_order')->orderBy('id');
    }
}
