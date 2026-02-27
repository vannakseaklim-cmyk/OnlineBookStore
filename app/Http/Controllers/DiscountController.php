<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Discount;
use Inertia\Inertia;

class DiscountController extends Controller
{
     public function index()
    {
        return Inertia::render('Discounts/Index', [
            'discounts' => Discount::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('Discounts/CreateEdit', [
            'datas' => null
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'discount_percent' => 'required|numeric|min:0|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'active' => 'required|boolean'
        ]);

        Discount::create($request->all());

        return redirect()->route('discounts.index');
    }

    public function edit(Discount $discount)
    {
        return Inertia::render('Discounts/CreateEdit', [
            'datas' => $discount
        ]);
    }

    public function update(Request $request, Discount $discount)
    {
        $discount->update($request->all());

        return redirect()->route('discounts.index');
    }

    public function destroy(Discount $discount)
    {
        $discount->delete();
        return redirect()->route('discounts.index');
    }
}
