<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = Book::with('category')
            ->whereHas('category', function ($q) {
                $q->where('status', 1); 
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('title', 'like', "%{$search}%")
                       ->orWhere('author', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($q, $categoryId) {
                $q->where('category_id', $categoryId);
            })
            ->when($request->min_price, fn ($q, $min) => $q->where('price', '>=', $min))
            ->when($request->max_price, fn ($q, $max) => $q->where('price', '<=', $max))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Customer/Books/Index', [
            'books' => $books,
            'categories' => Category::where('status', 1)->get(),
            'filters' => $request->only([
                'search',
                'category_id',
                'min_price',
                'max_price'
            ]),
        ]);
    }

    public function show(Book $book)
    {
        return Inertia::render('Customer/Books/Show', [
            'book' => $book->load('category')
        ]);
    }
}
