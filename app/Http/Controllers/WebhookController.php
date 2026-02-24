<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TelegramService;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handle GitHub push webhook
     */
    public function handleGitHubPush(Request $request)
    {
        try {
            // Verify GitHub signature
            $signature = $request->header('X-Hub-Signature-256');
            if (!$this->verifyGitHubSignature($request, $signature)) {
                return response()->json(['error' => 'Invalid signature'], 403);
            }

            $payload = $request->json()->all();

            // Only process push events
            if ($request->header('X-GitHub-Event') !== 'push') {
                return response()->json(['status' => 'ignored']);
            }

            // Extract push details
            $branch = basename($payload['ref'] ?? '');
            $repository = $payload['repository']['full_name'] ?? 'Unknown';
            $pusher = $payload['pusher']['name'] ?? 'Unknown';
            $commits = $payload['commits'] ?? [];
            $commitCount = count($commits);

            // Build message
            $message = $this->buildPushMessage($repository, $branch, $pusher, $commits, $commitCount);

            // Send to Telegram
            $telegramService = new TelegramService();
            $result = $telegramService->sendPushNotification($message);

            Log::info('GitHub push webhook processed', [
                'repository' => $repository,
                'branch' => $branch,
                'commits' => $commitCount,
                'telegram_sent' => $result,
            ]);

            return response()->json(['status' => 'success', 'telegram_sent' => $result]);

        } catch (\Exception $e) {
            Log::error('Webhook processing failed: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Build formatted push notification message
     */
    private function buildPushMessage($repository, $branch, $pusher, $commits, $commitCount)
    {
        $message = "<b>🚀 CODE PUSH NOTIFICATION</b>\n\n";
        $message .= "<b>📦 Repository:</b> {$repository}\n";
        $message .= "<b>🌿 Branch:</b> {$branch}\n";
        $message .= "<b>👤 Pusher:</b> {$pusher}\n";
        $message .= "<b>📝 Commits:</b> {$commitCount}\n\n";

        $message .= "<b>📋 Commit Messages:</b>\n";
        foreach ($commits as $commit) {
            $hash = substr($commit['id'], 0, 7);
            $commitMessage = $commit['message'] ?? 'No message';
            // Get first line only
            $commitMessage = explode("\n", $commitMessage)[0];
            $message .= "• <code>{$hash}</code> {$commitMessage}\n";
        }

        return $message;
    }

    /**
     * Verify GitHub webhook signature
     */
    private function verifyGitHubSignature($request, $signature)
    {
        $secret = env('GITHUB_WEBHOOK_SECRET');
        if (!$secret || !$signature) {
            return false;
        }

        $payload = $request->getContent();
        $hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);

        return hash_equals($hash, $signature);
    }
}
