<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['percent', 'fixed']); 
            $table->decimal('value', 8, 2);
            $table->decimal('minimum_amount', 8, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('usage_limit')->nullable(); 
            $table->enum('customer_type', ['all', 'vip'])->default('all');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
