<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('dashboardadmin', function () {
        return Inertia::render('dashboardadmin');
    })->name('dashboardadmin');
    
});
Route::get('/productdetails/{id}', function ($id) {
    return Inertia::render('productdetails', [
        'id' => (string) $id, // Ensure the ID is passed as a string
    ]);
})->name('productdetails');

Route::get('/orderdetailsuser', function () {
    return Inertia::render('OrderDetailsUser');
})->name('orderdetailsuser');

Route::get('/ordermanagementuser', function () {
    return Inertia::render('OrderManagementUser');
})->name('ordermanagementuser');

Route::post('/addcategory', [CategoryController::class, 'addCategory'])->name('addcategory');
Route::get('/categories', [CategoryController::class, 'getCategories']);
Route::delete('/deletecategory/{id}', [CategoryController::class, 'deleteCategory']);
Route::put('/updatecategory/{id}', [CategoryController::class, 'updateCategory'])->name('updatecategory');

Route::post('/addproducts', [ProductController::class, 'store']);
Route::get('/products-with-categories', [ProductController::class, 'getProductsWithCategories']);
Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);
Route::match(['post', 'put'], '/updateproduct/{id}', [ProductController::class, 'update'])->name('updateproduct');
Route::put('/adddescriptionproducts/{id}', [ProductController::class, 'updateDescription']);
Route::get('/getusers', [UserController::class, 'getUsers'])->name('getusers');
Route::post('/updatebanneduserstrue', [UserController::class, 'updateBannedUsersTrue']);
Route::post('/updatebannedusersfalse', [UserController::class, 'updateBannedUsersFalse']);
Route::put('/updateusersbyadmin', [UserController::class, 'updateByAdmin']);
Route::get('/productforhomepage', [ProductController::class, 'getProductsForHomepage']);

Route::post('/addorder', [OrderController::class, 'addOrder'])->name('addorder');
Route::post('/getorderforuser', [OrderController::class, 'getOrderForUser'])->name('getorderforuser');
Route::post('/getorderforadmin', [OrderController::class, 'getOrderForAdmin'])->name('getorderforadmin');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
