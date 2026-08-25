<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'payment_code',
        'booking_id',
        'customer_name',
        'customer_email',
        'amount',
        'currency',
        'payment_method',
        'status',
        'transaction_id',
        'payment_date',
        'due_date',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'due_date' => 'date',
    ];
}
