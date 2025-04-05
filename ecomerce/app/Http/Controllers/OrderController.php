<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function addOrder(Request $request)
    {
        $userId = $request->input('user_id');
        $products = $request->input('products'); // Array of products with product_id, quantity, and price

        try {
            DB::transaction(function () use ($userId, $products) {
                // Insert into orders table and get the new order ID using raw query
                $newOrderId = DB::select("INSERT INTO orders (user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?) RETURNING id", [
                    $userId,
                    'Pending',
                    now(),
                    now()
                ])[0]->id;

                // Prepare data for order_products table
                $orderProducts = [];
                foreach ($products as $product) {
                    $orderProducts[] = [
                        $newOrderId,
                        $product['product_id'], // Keep product_id as is
                        $product['quantity'],
                        $product['price']
                    ];
                }

                // Insert into order_products table using raw query
                foreach ($orderProducts as $orderProduct) {
                    DB::insert("INSERT INTO order_products (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", $orderProduct);
                }
            });

            return response()->json(['message' => 'Order added successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add order', 'details' => $e->getMessage()], 500);
        }
    }

    public function getOrderForUser(Request $request)
    {
        $userId = $request->input('user_id');

        try {
            $orders = DB::select("
                SELECT 
                    o.id::text AS order_id, -- Convert order_id to string
                    u.name AS customer_name,
                    u.email,
                    u.phone,
                    u.address,
                    o.status,
                    p.id::text AS product_id, -- Convert product_id to string
                    p.name AS product_name,
                    p.image AS image_product,
                    op.quantity,
                    p.price
                FROM 
                    orders o
                JOIN 
                    users u ON o.user_id = u.id
                JOIN 
                    order_products op ON o.id = op.order_id
                JOIN 
                    products p ON op.product_id = p.id
                WHERE 
                    u.id = ?
            ", [$userId]);

            return response()->json($orders, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch orders', 'details' => $e->getMessage()], 500);
        }
    }

    public function getOrderForAdmin(Request $request)
    {
        $orders = DB::select("
        SELECT 
                    o.id::text AS order_id, -- Convert order_id to string
                    u.name AS customer_name,
                    u.email,
                    u.phone,
                    u.address,
                    o.status,
                    p.id::text AS product_id, -- Convert product_id to string
                    p.name AS product_name,
                    p.image AS image_product,
                    op.quantity,
                    p.price
                FROM 
                    orders o
                JOIN 
                    users u ON o.user_id = u.id
                JOIN 
                    order_products op ON o.id = op.order_id
                JOIN 
                    products p ON op.product_id = p.id
        ");

        return response()->json($orders);
    }
}
