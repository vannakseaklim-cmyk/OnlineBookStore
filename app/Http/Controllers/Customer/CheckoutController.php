<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Services\TelegramService;
use App\Models\ShoppingCart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Book;

class CheckoutController extends Controller
{
    public function index()
    {
    $cart = ShoppingCart::with('items.book')
        ->where('customer_id', Auth::id())
        ->where('status', 0)
        ->first();

    if (!$cart || $cart->items->isEmpty()) {
        return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
    }

    return Inertia::render('Customer/Checkout', [
        'cart' => $cart
    ]);
    }

        public function placeOrder(Request $request)
    {
        $request->validate([
            'phone_number'      => 'required|string|max:20',
            'shipping_address'  => 'required|string|max:500',
            'payment_method'    => 'required|in:online,delivery',
            'transaction_image' => $request->payment_method === 'online' 
                ? 'required|image|mimes:jpeg,png,jpg|max:2048' 
                : 'nullable',
        ]);

        $cart = ShoppingCart::with('items.book')
            ->where('customer_id', Auth::id())
            ->where('status', 0)
            ->firstOrFail();

        $total = $cart->items->sum(fn($item) => (float)$item->price * $item->quantity);

        $imagePath = null;
        if ($request->hasFile('transaction_image')) {
            $imagePath = $request->file('transaction_image')->store('payments', 'public');
        }

        try {
            return DB::transaction(function () use ($request, $cart, $total, $imagePath) {
                $order = Order::create([
                    'customer_id'       => Auth::id(),
                    'order_date'        => now(),
                    'order_total'       => $total,
                    'status'            => 'pending',
                    'phone_number'      => $request->phone_number,
                    'shipping_address'  => $request->shipping_address,
                    'payment_method'    => $request->payment_method,
                    'transaction_image' => $imagePath,
                ]);

                foreach ($cart->items as $item) {
                    if ($item->book->stock < $item->quantity) {
                       
                        throw new \Exception("Sorry, '{$item->book->title}' is out of stock.");
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'book_id'  => $item->book_id,
                        'quantity' => $item->quantity,
                        'price'    => $item->price,
                    ]);

                    $item->book->decrement('stock', $item->quantity);
                }

                $cart->update(['status' => 1]);

                if ($imagePath || $request->payment_method === 'online') {
                    $telegramService = new TelegramService();
                    $telegramService->sendTransactionNotification($order->load('items.book', 'customer'), $imagePath);
                }

                return redirect()->route('customer.orders.index')->with('success', 'Order placed successfully!');
            });
        } catch (\Exception $e) {
           
            return back()->with('error', $e->getMessage());
        }
    }

}
