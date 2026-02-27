<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\ShoppingCart;
use App\Models\Order;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Load user with roles to make admin checks easy in React
        $user = $request->user()?->load('roles');
        $activeCart = $user ? ShoppingCart::where('customer_id', $user->id)->where('status', 'active')->first() : null;

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user()?->load('roles'),
                // permissions optional if you need Spatie permissions in React
                'can' => $user
                    ? $user->roles
                        ->flatMap(fn($role) => $role->permissions)
                        ->mapWithKeys(fn($permission) => [$permission->name => $user->can($permission->name)])
                        ->all()
                    : [],
                'cartCount' => $activeCart ? $activeCart->items->count() : 0,
                'pendingOrdersCount' => $user ? \App\Models\Order::where('status', 'pending')->count() : 0,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
