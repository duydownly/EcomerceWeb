<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getUsers()
    {
        try {
            $users = DB::select('SELECT id, name, email, address, phone, banned FROM users');
    
            // Chuyển đổi id thành string
            $users = array_map(function ($user) {
                $user->id = (string) $user->id;
                return $user;
            }, $users);
    
            return response()->json($users);
        } catch (\Exception $e) {
            \Log::error('Error fetching users: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch users'], 500);
        }
    }
    

    public function updateBannedUsersTrue(Request $request)
    {
        try {
            $userId = $request->input('id');
            DB::update('UPDATE users SET banned = TRUE WHERE id = ?', [$userId]);
            return response()->json(['success' => true, 'message' => 'User banned successfully']);
        } catch (\Exception $e) {
            \Log::error('Error banning user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to ban user'], 500);
        }
    }

    public function updateBannedUsersFalse(Request $request)
    {
        try {
            $userId = $request->input('id');
            DB::update('UPDATE users SET banned = FALSE WHERE id = ?', [$userId]);
            return response()->json(['success' => true, 'message' => 'User unbanned successfully']);
        } catch (\Exception $e) {
            \Log::error('Error unbanning user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to unban user'], 500);
        }
    }
    public function updateByAdmin(Request $request)
    {
        try {
            \Log::info('Request data:', $request->all()); // Log dữ liệu gửi lên
    
            $request->validate([
                'id' => 'required|exists:users,id',
                'name' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
            ]);
    
            // Sử dụng raw query để cập nhật dữ liệu
            $affected = DB::update(
                "UPDATE users SET name = ?, address = ?, phone = ? WHERE id = ?",
                [$request->name, $request->address, $request->phone, $request->id]
            );
    
            if ($affected === 0) {
                return response()->json(['error' => 'User not updated. No changes made.'], 400);
            }
    
            return response()->json(['message' => 'User updated successfully'], 200);
        } catch (\Exception $e) {
            \Log::error('Error updating user: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }
}
