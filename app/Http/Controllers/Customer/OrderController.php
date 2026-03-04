<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use App\Models\OrderItem;
use App\Models\Delivery;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\ShoppingCart;

class OrderController extends Controller
{
     public function index()
    {
        $orders = Order::where('customer_id', Auth::id()) 
            ->with(['items.book'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Order/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        
        if ($order->customer_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Customer/Order/Show', [
            'order' => $order->load(['items.book'])
        ]);
    }

    public function invoice(Order $order)
    {
        $order->load('items.book'); 
        $order->shipping_fee = $order->shipping_fee ?? 0; 

        $pdf = Pdf::loadView('pdf.invoice', [
            'order' => $order
        ]);

        return $pdf->download("invoice-{$order->id}.pdf");
    }

}