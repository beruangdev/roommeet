<?php

use App\Http\Controllers\RoomController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

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

Route::get('/pull', function () {
    $fetch = shell_exec('git fetch origin main');
    $reset = shell_exec('git reset --hard HEAD');
    $pull = shell_exec('git pull origin main');
    return response()->json(compact('fetch', 'reset', 'pull'));
});

Route::get('/', function () {
    return view('welcome');
});
// Route::get('/meet', function () {
//     return view('meet.meet');
// })->name("room.show");
Route::get('meet', [RoomController::class, 'join'])->name('room.join');
Route::post('room-create', [RoomController::class, 'create'])->name('room.create');


Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});
