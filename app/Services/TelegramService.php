<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    private $botToken;
    private $chatId;
    private $apiUrl = 'https://api.telegram.org/bot';

    public function __construct()
    {
        $this->botToken = config('services.telegram_dev.bot_token');
        $this->chatId = config('services.telegram_dev.chat_id');
    }

    public function sendTransactionNotification($order, $imagePath = null)
    {
        try {
         
            if (!$this->botToken || !$this->chatId) {
                Log::error('Telegram credentials not configured');
                return false;
            }

            $message = $this->formatTransactionMessage($order, $imagePath);

            $messageUrl = "{$this->apiUrl}{$this->botToken}/sendMessage";
            Log::info('Sending message to Telegram', ['url' => $messageUrl, 'chat_id' => $this->chatId]);

            $response = Http::timeout(30)->post(
                $messageUrl,
                [
                    'chat_id' => $this->chatId,
                    'text' => $message,
                    'parse_mode' => 'HTML',
                ]
            );

            Log::info('Message response: ' . $response->status(), ['body' => $response->body()]);

            if ($imagePath) {
                $fullPath = storage_path('app/public/' . $imagePath);
                if (file_exists($fullPath)) {
                    Log::info('Sending image to Telegram', ['path' => $fullPath]);
                    $this->sendTransactionImage($imagePath, $order);
                } else {
                    Log::warning('Image file not found', ['path' => $fullPath]);
                }
            }

            return $response->successful();

        } catch (\Exception $e) {
            Log::error('Telegram notification failed: ' . $e->getMessage(), ['exception' => (string)$e]);
            return false;
        }
    }

    private function formatTransactionMessage($order, $imagePath)
    {
        $shippingFee = $order->shipping_fee ?? 0;
        $subtotal = 0;

        $message = "<b>📦 NEW ORDER NOTIFICATION</b>\n\n";
        $message .= "<b>Order ID:</b> #{$order->id}\n";
        $message .= "<b>Customer:</b> {$order->customer->name}\n";
        $message .= "<b>Email:</b> {$order->customer->email}\n";
        $message .= "<b>Phone:</b> {$order->phone_number}\n";
        $message .= "<b>Address:</b> {$order->shipping_address}\n\n";

        $message .= "<b>📚 Items:</b>\n";

        foreach ($order->items as $item) {

            $price = $item->book->discounted_price 
                ? $item->book->discounted_price 
                : $item->book->price;

            $itemTotal = $price * $item->quantity;
            $subtotal += $itemTotal;

            $message .= "• {$item->book->title}\n";
            $message .= "  Quantity: {$item->quantity}\n";
            $message .= "  Price: $" . number_format($itemTotal, 2) . "\n\n";
        }

        $totalAmount = $subtotal + $shippingFee;

        $message .= "<b>🚚 Shipping Fee:</b> $" . number_format($shippingFee, 2) . "\n";
        $message .= "<b>💰 Total Amount:</b> $" . number_format($totalAmount, 2) . "\n";
        $message .= "<b>Payment Method:</b> " . ucfirst($order->payment_method) . "\n";
        $message .= "<b>Status:</b> {$order->status}\n";
        $message .= "<b>Order Date:</b> " . $order->order_date->format('Y-m-d H:i:s') . "\n";

        $message .= $imagePath
            ? "\n✅ <b>Payment Proof:</b> Received\n"
            : "\n❌ <b>Payment Proof:</b> Not Provided\n";

        return $message;
    }

    // ✅ THIS IS THE MISSING METHOD (ADDED ONLY THIS)
    private function sendTransactionImage($imagePath, $order)
    {
        try {

            $photoUrl = "{$this->apiUrl}{$this->botToken}/sendPhoto";
            $fullPath = storage_path('app/public/' . $imagePath);

            $response = Http::timeout(30)
                ->attach(
                    'photo',
                    file_get_contents($fullPath),
                    basename($fullPath)
                )
                ->post($photoUrl, [
                    'chat_id' => $this->chatId,
                    'caption' => "📸 Payment Proof for Order #{$order->id}",
                    'parse_mode' => 'HTML',
                ]);

            Log::info('Image response: ' . $response->status(), ['body' => $response->body()]);

            return $response->successful();

        } catch (\Exception $e) {
            Log::error('Failed to send image: ' . $e->getMessage(), ['exception' => (string)$e]);
            return false;
        }
    }

    public function sendPushNotification($message)
    { 
        
        try {
          
            if (!$this->botToken || !$this->chatId) {
                Log::error('Telegram credentials not configured');
                return false;
            }

            $messageUrl = "{$this->apiUrl}{$this->botToken}/sendMessage";
            Log::info('Sending push notification to Telegram', ['url' => $messageUrl]);

            $response = Http::timeout(30)->post(
                $messageUrl,
                [
                    'chat_id' => $this->chatId,
                    'text' => $message,
                    'parse_mode' => 'HTML',
                ]
            );

            Log::info('Push notification response: ' . $response->status(), ['body' => $response->body()]);
            return $response->successful();

        } catch (\Exception $e) {
            Log::error('Failed to send push notification: ' . $e->getMessage(), ['exception' => (string)$e]);
            return false;
        }
    }
}