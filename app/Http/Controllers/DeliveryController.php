<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Delivery;

class DeliveryController extends Controller
{
    // Show all delivery locations
    public function index()
    {
        $deliveries = Delivery::all();
        return Inertia::render('Deliveries/Index', [
            'deliveryData' => $deliveries,
        ]);
    }

    // Show create form
    public function create()
    {
        return Inertia::render('Deliveries/CreateEdit', [
            'delivery' => null
        ]);
    }

    // Store new delivery location
    public function store(Request $request)
    {
        $request->validate([
            'location' => 'required|string|max:255|unique:deliveries,location',
            'cost' => 'required|numeric|min:0',
        ]);

        Delivery::create($request->all());

        return redirect()->route('deliveries.index')->with('success', 'Delivery location added.');
    }

    // Show edit form
    public function edit(Delivery $delivery)
    {
        return Inertia::render('Deliveries/CreateEdit', [
            'delivery' => $delivery
        ]);
    }

    // Update delivery location
    public function update(Request $request, Delivery $delivery)
    {
        $request->validate([
            'location' => 'required|string|max:255|unique:deliveries,location,' . $delivery->id,
            'cost' => 'required|numeric|min:0',
        ]);

        $delivery->update($request->all());

        return redirect()->route('deliveries.index')->with('success', 'Delivery location updated.');
    }

    // Delete delivery location
    public function destroy(Delivery $delivery)
    {
        $delivery->delete();
        return redirect()->route('deliveries.index')->with('success', 'Delivery location deleted.');
    }
}
