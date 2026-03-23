<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'pickup_location',
        'drop_location',
        'pickup_date',
        'return_date',
        'vehicle_type',
        'passengers',
        'amount',
        'notes',
        'status'
    ];  
}
