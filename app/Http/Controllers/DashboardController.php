<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Book;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
{
    
    $salesData = collect(range(6, 0))->map(function ($days) {
        $date = now()->subDays($days);
        return [
            'date' => $date->format('D'), 
            'amount' => \App\Models\Order::whereDate('created_at', $date)
                        ->where('status', 'completed') 
                        ->sum('order_total'),
        ];
    });

    return Inertia::render('Dashboard', [
        'salesData' => $salesData,
        'quickStats' => [
            'todaySalesCount' => \App\Models\Order::whereDate('created_at', now())->count(),
            'totalRevenue'    => \App\Models\Order::where('status', 'completed')->sum('order_total'),
            'pendingOrders'   => \App\Models\Order::where('status', 'pending')->count(),
            'totalUsers'      => \App\Models\User::count(),
            'totalProducts'   => \App\Models\Book::count(),
        ]
    ]);
}

}
