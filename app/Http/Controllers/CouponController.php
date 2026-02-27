<?php

namespace App\Http\Controllers;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::latest()->paginate(10);

        return Inertia::render('Coupons/Index', [
            'couponData' => $coupons
        ]);
    }

    public function create()
    {
        return Inertia::render('Coupons/CreateEdit');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:coupons,code',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'minimum_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'user_type' => 'required|in:all,vip',
            'active' => 'boolean',
        ]);

        $coupon = Coupon::create($request->all());

        return redirect()->route('coupons.index')->with('success', 'Coupon created!');
    }

    public function edit(Coupon $coupon)
    {
        return Inertia::render('Coupons/CreateEdit', [
            'datas' => $coupon
        ]);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $request->validate([
            'code' => 'required|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'minimum_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'user_type' => 'required|in:all,vip',
            'active' => 'boolean',
        ]);

        $coupon->update($request->all());

        return redirect()->route('coupons.index')->with('success', 'Coupon updated!');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return redirect()->route('coupons.index')->with('success', 'Coupon deleted!');
    }

    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required',
            'subtotal' => 'required|numeric'
        ]);

        $coupon = Coupon::where('code', $request->code)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->where('active', true)
            ->first();

        if (!$coupon) {
            return response()->json(['error' => 'Invalid or expired coupon'], 400);
        }

        if ($request->subtotal < $coupon->minimum_amount) {
            return response()->json([
                'error' => 'Minimum order must be $' . $coupon->minimum_amount
            ], 400);
        }

        $discount = $coupon->type === 'percent'
            ? $request->subtotal * ($coupon->value / 100)
            : $coupon->value;

        return response()->json([
            'discount' => $discount,
            'final_total' => $request->subtotal - $discount
        ]);
    }
}
