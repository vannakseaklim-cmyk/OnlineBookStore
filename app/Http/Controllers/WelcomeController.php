<?php

namespace App\Http\Controllers;

use App\Models\Book;

use Inertia\Inertia;
use Illuminate\Http\Request;

class WelcomeController extends Controller

{
    
public function index()
{
    $books = Book::with('category')
        ->latest()
        ->take(8)
        ->get()
        ->map(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'author' => $book->author,
                'price' => $book->price,
                'image_url' => $book->cover_image ? asset('storage/' . $book->cover_image) : '/images/no-book.png',
                'category_name' => $book->category?->name ?? 'General',
                'is_best_seller' => $book->is_best_seller ?? false,
            ];
        });

    return Inertia::render('Welcome', [
        'bestSellers' => $books, 
    ]);
}
}


