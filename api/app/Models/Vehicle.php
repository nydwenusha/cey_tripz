<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'name',
        'type',
        'description',
        'status',
        'category',
        'daily_rate',
        'weekly_rate',
        'monthly_rate',
        'fuel_type',
        'transmission',
        'year',
        'color',
        'mileage',
        'engine',
        'capacity',
        'tags',
        'featured',
        'images',
    ];

    protected $casts = [
        'daily_rate' => 'decimal:2',
        'weekly_rate' => 'decimal:2',
        'monthly_rate' => 'decimal:2',
        'year' => 'integer',
        'capacity' => 'integer',
        'featured' => 'boolean',
        'tags' => 'array',
        'images' => 'array',
    ];
}
