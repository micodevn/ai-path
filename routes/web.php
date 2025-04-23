<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/mbti', function () {
    $htmlContent = file_get_contents(resource_path('html/MBTI/index.html'));
    return view('mbti', compact('htmlContent'));
});
Route::get('/result', function () {
    $result = file_get_contents(resource_path('html/MBTI/index.html'));
    return view('result', compact('result'));
});
