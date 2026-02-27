<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\TelegramService;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with(['items.book', 'customer'])
        ->when($request->status, function ($query, $status) {
            return $query->where('status', $status);
        })
        ->latest()
        ->paginate(10)
        ->withQueryString(); 

        return Inertia::render('Orders/Index', [
            'ordersData' => $orders,
            'filters' => $request->only(['status']) 
        ]);
    }

    public function store()
    {
        $cart = ShoppingCart::where('customer_id', auth()->id())
            ->with('items.book')
            ->firstOrFail();
        
        $shippingFee = 2.00; 

        $order = Order::create([
            'customer_id' => auth()->id(),
            'total_price' => $cart->items->sum(
                fn ($item) => $item->book->price * $item->quantity
            ),
            'status' => 'pending',
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'book_id' => $item->book_id,
                'price' => $item->book->price,
                'quantity' => $item->quantity,
            ]);
        }
        $cart->items()->delete();

        return redirect()->route('orders.show', $order->id);
    }

    public function show(Order $order)
    {
        
        $order->load(['customer', 'items.book']);

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
        'status' => 'required|in:pending,completed,cancelled',
        'cancel_reason' => 'required_if:status,cancelled|nullable|string',
    ]);

        $order->status = $request->status;
        
        if ($request->status !== 'cancelled') {
            $order->cancel_reason = null;
        } else {
            $order->cancel_reason = $request->cancel_reason;
        }

        $order->save();

        return back();
    }
}
