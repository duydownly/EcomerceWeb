<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Category; // Add this import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller {
    public function show($id) {
        return response()->json(Product::findOrFail($id));
    }
    public function store(Request $request)
    {
        Log::info('Request Data:', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'description' => 'nullable|string',
            'categories' => 'required|array',
            'categories.*' => 'integer|exists:categories,id',
        ]);

        // Xử lý ảnh
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }

        // Tạo sản phẩm
        $product = Product::create([
            'name' => $request->name,
            'stock' => $request->stock,
            'price' => $request->price,
            'image' => $imagePath,
            'description' => $request->description,
        ]);

        // Gán danh mục sản phẩm
        $product->categories()->attach($request->categories);

        return response()->json(['message' => 'Product added successfully', 'product' => $product], 201);
    }
    public function getProductsWithCategories()
    {
        $query = "
            SELECT 
        p.id::text AS id,  -- Ép kiểu ID thành string
                p.name,
                p.stock,
                p.price,
                p.image,
                p.description,
                p.created_at,
                p.updated_at,
                STRING_AGG(c.id::text, ',') AS category_ids,
                STRING_AGG(c.name, ',') AS category_names
            FROM 
                products p
            LEFT JOIN 
                category_product cp ON p.id = cp.product_id
            LEFT JOIN 
                categories c ON cp.category_id = c.id
            GROUP BY 
                p.id, p.name, p.stock, p.price, p.image, p.description, p.created_at, p.updated_at
        ";

        $products = DB::select($query);

        $formattedProducts = array_map(function ($product) {
            $imageUrl = $product->image ? Storage::url($product->image) : null;

            $categoryIds = $product->category_ids ? explode(',', $product->category_ids) : [];
            $categoryNames = $product->category_names ? explode(',', $product->category_names) : [];

            $categories = [];
            foreach ($categoryIds as $index => $id) {
                $categories[] = [
                    'id' => $id,
                    'name' => $categoryNames[$index] ?? null
                ];
            }

            return [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => $product->stock,
                'price' => $product->price,
                'image' => $imageUrl,
                'description' => $product->description,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
                'categories' => $categories
            ];
        }, $products);

        return response()->json($formattedProducts);
    }

    public function getAllCategories() {
        return response()->json(Category::all());
    }
    public function deleteProduct($id)
    {
        // Kiểm tra sản phẩm có tồn tại không
        $product = DB::select("SELECT * FROM products WHERE id = ?", [$id]);
    
        if (empty($product)) {
            return response()->json(['message' => 'Product not found'], 404);
        }
    
        // Xóa ảnh nếu có
        if ($product[0]->image) {
            Storage::disk('public')->delete($product[0]->image);
        }
    
        // Xóa liên kết danh mục sản phẩm
        DB::delete("DELETE FROM category_product WHERE product_id = ?", [$id]);
    
        // Xóa sản phẩm
        DB::delete("DELETE FROM products WHERE id = ?", [$id]);
    
        return response()->json(['message' => 'Product deleted successfully']);
    }
    public function update(Request $request, $id)
    {
        $product = DB::table('products')->where('id', $id)->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'categories' => 'required|array',
            'categories.*' => 'integer|exists:categories,id',
        ]);

        // Handle new image upload
        $imagePath = $product->image; // Keep the old image by default
        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::delete('public/' . $product->image); // Delete old image
            }
            $path = $request->file('image')->store('images', 'public');
            $imagePath = str_replace('public/', '', $path); // Save relative path
        }

        // Update product
        DB::update("
            UPDATE products 
            SET name = ?, stock = ?, price = ?, image = ?, updated_at = NOW() 
            WHERE id = ?
        ", [
            $request->input('name', $product->name),
            $request->input('stock', $product->stock),
            $request->input('price', $product->price),
            $imagePath,
            $id
        ]);

        // Update product categories
        DB::table('category_product')->where('product_id', $id)->delete(); // Remove old categories
        foreach ($request->categories as $categoryId) {
            DB::insert("INSERT INTO category_product (product_id, category_id) VALUES (?, ?)", [$id, $categoryId]);
        }

        return response()->json(['message' => 'Product updated successfully']);
    }
    public function updateDescription(Request $request, $id)
    {
        $request->validate([
            'description' => 'required|string|max:255',
        ]);

        $affectedRows = DB::update("UPDATE products SET description = ? WHERE id = ?", [
            $request->description,
            $id
        ]);

        if ($affectedRows === 0) {
            return response()->json(['message' => 'Product not found or no changes made'], 404);
        }

        return response()->json(['message' => 'Description updated successfully']);
    }
    
    public function getProductsForHomepage()
    {
        $query = "
            SELECT 
                p.id::text AS product_id,  -- Convert product ID to string
                p.image, 
                c.id::text AS category_id,  -- Convert category ID to string
                c.name AS category_name
            FROM products p
            JOIN category_product cp ON p.id = cp.product_id
            JOIN categories c ON cp.category_id = c.id
            WHERE c.id IN ('1059392070229393409', '1059392123040759809', '1059392145917804545')  -- Ensure IDs are strings
        ";

        $products = DB::select($query);

        return response()->json($products);
    }
}
