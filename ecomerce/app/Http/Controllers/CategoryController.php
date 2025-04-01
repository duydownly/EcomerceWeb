<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function addCategory(Request $request)
    {
        Log::info('API addCategory received a request', ['request_data' => $request->all()]);

        try {
            $request->validate([
                'name' => 'required|string|unique:categories,name',
            ]);
            Log::info('Validation passed');

            // Chèn dữ liệu bằng SQL thô
            DB::insert('INSERT INTO categories (name, created_at, updated_at) VALUES (?, NOW(), NOW())', [$request->name]);

            Log::info('Category inserted successfully');

            return response()->json([
                'status' => 'success',
                'message' => 'Category added successfully!',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error in adding category', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getCategories()
    {
        try {
            $categories = DB::select('SELECT * FROM categories');
    
            // Chuyển đổi id thành string
            $categories = array_map(function ($category) {
                $category->id = (string) $category->id;
                return $category;
            }, $categories);
    
            return response()->json([
                'status' => 'success',
                'data' => $categories
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch categories',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteCategory($id)
    {
        try {
            // Xóa category bằng SQL thô
            $deleted = DB::delete('DELETE FROM categories WHERE id = ?', [$id]);

            if ($deleted) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Category deleted successfully!',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Category not found!',
                ], 404);
            }
        } catch (\Exception $e) {
            Log::error('Error in deleting category', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateCategory(Request $request, $id)
    {
        Log::info('API updateCategory received a request', ['request_data' => $request->all()]);

        try {
            $request->validate([
                'name' => 'required|string|unique:categories,name',
            ]);
            Log::info('Validation passed');

            // Update category using raw SQL
            $updated = DB::update('UPDATE categories SET name = ?, updated_at = NOW() WHERE id = ?', [$request->name, $id]);

            if ($updated) {
                Log::info('Category updated successfully');
                return response()->json([
                    'status' => 'success',
                    'message' => 'Category updated successfully!',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Category not found!',
                ], 404);
            }
        } catch (\Exception $e) {
            Log::error('Error in updating category', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
