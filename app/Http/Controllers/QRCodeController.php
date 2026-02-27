<?php

namespace App\Http\Controllers;

use App\Models\QRCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QRCodeController extends Controller
{
    public function index()
    {
        $qrcodes = QRCode::latest()->paginate(10);
        return Inertia::render('QRCodes/Index', [
            'qrcodeData' => $qrcodes,
        ]);
    }

    public function create()
    {
        return Inertia::render('QRCodes/CreateEdit', [
            'qrcode' => null
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'bank_name' => 'required|string|max:255',
            'qr_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string|max:500',
            'active' => 'nullable|boolean',
        ]);

        $data = $request->all();
        if ($request->hasFile('qr_image')) {
            $data['qr_image'] = $request->file('qr_image')->store('qrcodes', 'public');
        }

        QRCode::create($data);

        return redirect()->route('qrcodes.index')->with('success', 'QR Code added successfully.');
    }

    public function edit(QRCode $qrcode)
    {
        return Inertia::render('QRCodes/CreateEdit', [
            'qrcode' => $qrcode
        ]);
    }

    public function update(Request $request, QRCode $qrcode)
    {
        $request->validate([
            'bank_name' => 'required|string|max:255',
            'qr_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string|max:500',
            'active' => 'nullable|boolean',
        ]);

        $data = $request->all();
        if ($request->hasFile('qr_image')) {
            $data['qr_image'] = $request->file('qr_image')->store('qrcodes', 'public');
        }

        $qrcode->update($data);

        return redirect()->route('qrcodes.index')->with('success', 'QR Code updated successfully.');
    }

    public function destroy(QRCode $qrcode)
    {
        $qrcode->delete();
        return redirect()->route('qrcodes.index')->with('success', 'QR Code deleted successfully.');
    }
}
