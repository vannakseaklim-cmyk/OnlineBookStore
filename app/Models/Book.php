<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Book extends Model
{
    use HasFactory; 

    // include computed price in JSON responses
    protected $appends = ['discounted_price'];

    protected $fillable = [
        'category_id', 
        'title', 
        'pages',
        'author', 
        'description',
        'price', 
        'stock', 
        'cover_image',
        'discount_id', // reference to discount table
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function isAvailable(): bool
    {
        return $this->stock > 0;
    }

    public function discount()
    {
        // a book belongs to a discount record (nullable)
        return $this->belongsTo(Discount::class);
    }

    /**
     * Returns the price after applying the associated discount, if any.
     * Uses the current percent on the related model and only applies when
     * the discount is active (between start and end dates).
     */
    public function getDiscountedPriceAttribute(): ?float
    {
        if (! $this->discount) {
            return null;
        }
        $percent = $this->discount->discount_percent;
        return round($this->price - ($this->price * ($percent / 100)), 2);
    }
}
