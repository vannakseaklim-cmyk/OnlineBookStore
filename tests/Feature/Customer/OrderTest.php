<?php

namespace Tests\Feature\Customer;

use Tests\TestCase;
use App\Models\User;
use App\Models\Book;
use App\Models\ShoppingCart;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Clear Spatie Cache & Setup Roles
        $this->app->make(PermissionRegistrar::class)->forgetCachedPermissions();
        Role::firstOrCreate(['name' => 'customer']);
    }

    public function test_customer_can_complete_checkout()
    {
        // 1. Arrange
        $user = \App\Models\User::factory()->create();
        $user->assignRole('customer');
        $book = \App\Models\Book::factory()->create(['price' => 20, 'stock' => 10]);

        // Create the Shopping Cart in DB (Controller uses firstOrFail())
        $cart = \App\Models\ShoppingCart::create([
            'customer_id' => $user->id,
            'status'      => 0,
            
        ]);
        
        $cart->items()->create([
            'book_id'  => $book->id,
            'quantity' => 1,
            'price'    => $book->price,
        ]);

        // 2. Act
        $response = $this->actingAs($user)->post(route('checkout.placeOrder'), [
            'phone_number'     => '0123456789',
            'shipping_address' => '123 Test Street, Phnom Penh',
            'payment_method'   => 'delivery', // MUST be 'online' or 'delivery'
            // 'transaction_image' is nullable because payment_method is 'delivery'
        ]);

        // 3. Debug: If it still fails, this shows exactly what's wrong
        if (session('errors')) {
            dump(session('errors')->getMessages());
        }

        // 4. Assert
        $response->assertRedirect(); // Controller redirects to customer.orders.index
        
        $this->assertDatabaseHas('orders', [
            'customer_id'      => $user->id,
            'shipping_address' => '123 Test Street, Phnom Penh',
            'payment_method'   => 'delivery',
        ]);

        // Verify stock was decremented (A great addition to your test!)
        $this->assertEquals(9, $book->fresh()->stock);
    }

}
