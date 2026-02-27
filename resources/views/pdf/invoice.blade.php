<!-- resources/views/pdf/invoice.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 5px; text-align: left; }
        h2 { margin-bottom: 5px; }
    </style>
</head>
<body>
    <h2>Invoice #{{ $order->id }}</h2>
    <p>Status: {{ $order->status }}</p>
    <p>Delivery To: {{ $order->shipping_address }}</p>
    <p>Customer Contact: {{ $order->phone_number }}</p>

    <table>
        <thead>
            <tr>
                <th>Book</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->book->title }}</td>
                <td>{{ $item->quantity }}</td>
                <td>${{ number_format($item->book->discounted_price ?? $item->book->price, 2) }}</td>
                <td>${{ number_format(($item->book->discounted_price ?? $item->book->price) * $item->quantity, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <p>Subtotal: ${{ number_format($order->subtotal, 2) }}</p>
    <p>Shipping: ${{ number_format($order->shipping_fee, 2) }}</p>
    <p><strong>Total: ${{ number_format($order->total, 2) }}</strong></p>
</body>
</html>