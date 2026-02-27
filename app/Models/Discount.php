<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
   protected $fillable = [
    'name',
    'discount_percent',
    'start_date',
    'end_date',
    'active',
    ];

    public function books()
    {
        return $this->hasMany(Book::class);
    }
}
