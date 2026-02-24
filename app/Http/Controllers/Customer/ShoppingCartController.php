<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ShoppingCart;
use App\Models\ShoppingCartItem;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShoppingCartController extends Controller
{
     public function index()
    {
        $cart = ShoppingCart::with('items.book')
            ->where('customer_id', Auth::id())
            ->where('status', 0)
            ->first();

        return Inertia::render('Customer/Cart/Index', [
            'cart' => $cart
        ]);
    }


public function add(Request $request, $book)
{
    $request->validate([
        'quantity' => 'required|integer|min:1',
    ]);

    $bookModel = Book::findOrFail($book);

     
    if ($bookModel->stock < 1) {
        return back()->with('error', 'This book is out of stock.');
    }

     
    if ($request->quantity > $bookModel->stock) {
        return back()->with('error', 'Requested quantity exceeds available stock.');
    }

    $cart = ShoppingCart::firstOrCreate([
        'customer_id' => Auth::id(),
        'status' => 0,
    ]);

        $cartItem = $cart->items()->where('book_id', $bookModel->id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;

            if ($newQuantity > $bookModel->stock) {
                return back()->with('error', 'Not enough stock for this book.');
            }

            $cartItem->update([
                'quantity' => $newQuantity,
            ]);
        } else {
            $cart->items()->create([
                'book_id' => $bookModel->id,
                'quantity' => $request->quantity,
                'price' => $bookModel->price,
            ]);
        }
    

    return back()->with('success', 'Book added to cart!');
}



    public function update(Request $request, ShoppingCartItem $cartItem)
{
    $request->validate([
        'quantity' => 'required|integer|min:1',
    ]);
    

    $book = $cartItem->book;

        if ($request->quantity > $book->stock) {
            return back()->with('error', 'Not enough stock available.');
        }

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        return back()->with('success', 'Quantity updated');
}

public function destroy(ShoppingCartItem $cartItem) 
{
    $cartItem->delete();

    return back()->with('success', 'Item removed');
}
}
