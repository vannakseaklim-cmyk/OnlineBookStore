<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
    'customer_id', 
    'order_date', 
    'order_total', 
    'status', 
    'cancel_reason',
    'phone_number', 
    'shipping_address', 
    'shipping_fee',
    'payment_method', 
    'transaction_image'

    ];
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }

    public function getSubtotalAttribute()
    {
        return $this->items->sum(fn($i) => ($i->book->discounted_price ?? $i->book->price) * $i->quantity);
    }

    public function getTotalAttribute()
    {
        return $this->subtotal + ($this->shipping_fee ?? 0);
    }
}
