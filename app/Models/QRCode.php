<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QRCode extends Model
{
    protected $table = 'q_r_codes';
    
    protected $fillable = [
        'bank_name',
        'qr_image',
        'description',
        'active',
    ];
}
