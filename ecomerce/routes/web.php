<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
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
    return Inertia::render('ProductDetails', ['id' => $id]);
});

Route::post('/addcategory', [CategoryController::class, 'addCategory'])->name('addcategory');
Route::get('/categories', [CategoryController::class, 'getCategories']);

Route::post('/addproducts', [ProductController::class, 'store']);
Route::get('/products-with-categories', [ProductController::class, 'getProductsWithCategories']);
Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);
Route::match(['post', 'put'], '/updateproduct/{id}', [ProductController::class, 'update']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
