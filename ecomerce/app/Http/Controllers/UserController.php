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
            return response()->json($users);
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Error fetching users: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch users'], 500);
        }
    }
}
