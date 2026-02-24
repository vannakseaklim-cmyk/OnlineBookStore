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
        // Load from config/services.php
        $this->botToken = config('services.telegram_dev.bot_token');
        $this->chatId = config('services.telegram_dev.chat_id');
    }

    public function sendTransactionNotification($order, $imagePath = null)
    {
        try {
            // Verify credentials are set
            if (!$this->botToken || !$this->chatId) {
                Log::error('Telegram credentials not configured');
                return false;
            }

            $message = $this->formatTransactionMessage($order, $imagePath);

            // First, send the message
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

            // Then, send the image if provided
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
        $shipping_fee = 2;
        $total_with_shipping = $order->order_total + $shipping_fee;

        $message = "<b>📦 NEW ORDER NOTIFICATION</b>\n\n";
        $message .= "<b>Order ID:</b> #{$order->id}\n";
        $message .= "<b>Customer:</b> {$order->customer->name}\n";
        $message .= "<b>Email:</b> {$order->customer->email}\n";
        $message .= "<b>Phone:</b> {$order->phone_number}\n";
        $message .= "<b>Address:</b> {$order->shipping_address}\n\n";

        $message .= "<b>📚 Items:</b>\n";

        foreach ($order->items as $item) {
            $item_total = $item->price * $item->quantity;

            $message .= "• {$item->book->title}\n";
            $message .= "  Quantity: {$item->quantity}\n";
            $message .= "  Price: \${$item->price} | Subtotal: \${$item_total}\n";
        }

        $message .= "\n<b>🚚 Shipping Fee:</b> \${$shipping_fee}\n";
        $message .= "<b>💰 Total Amount:</b> \${$total_with_shipping}\n";
        $message .= "<b>Payment Method:</b> " . ucfirst($order->payment_method) . "\n";
        $message .= "<b>Status:</b> {$order->status}\n";
        $message .= "<b>Order Date:</b> " . $order->order_date->format('Y-m-d H:i:s') . "\n";

        $message .= $imagePath
            ? "\n✅ <b>Payment Proof:</b> Received\n"
            : "\n❌ <b>Payment Proof:</b> Not Provided\n";

        return $message;
    }

    private function sendTransactionImage($imagePath, $order)
    {
        try {
            $fullPath = storage_path('app/public/' . $imagePath);

            if (!file_exists($fullPath)) {
                Log::error('Image file does not exist', ['path' => $fullPath]);
                return false;
            }

            $imageContent = file_get_contents($fullPath);
            $photoUrl = "{$this->apiUrl}{$this->botToken}/sendPhoto";

            Log::info('Sending photo to Telegram', ['url' => $photoUrl, 'file' => basename($imagePath)]);

            $response = Http::timeout(30)->attach(
                'photo',
                $imageContent,
                basename($imagePath)
            )->post(
                $photoUrl,
                [
                    'chat_id' => $this->chatId,
                    'caption' => "Payment proof for Order #{$order->id}",
                ]
            );

            Log::info('Photo response: ' . $response->status(), ['body' => $response->body()]);
            return $response->successful();

        } catch (\Exception $e) {
            Log::error('Failed to send payment image: ' . $e->getMessage(), ['exception' => (string)$e]);
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
