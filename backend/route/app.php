<?php
use think\facade\Route;

Route::get('think', function () {
    return 'hello,ThinkPHP8!';
});

Route::get('hello/:name', 'index/hello');
Route::get('api/home', 'HomeApi/index');

// jobList
Route::get('api/job/index', 'app\controller\JobController@index');
Route::post('api/job/save', 'app\controller\JobController@save');
Route::post('api/job/delete', 'app\controller\JobController@delete');
Route::post('api/job/switchStatus', 'app\controller\JobController@switchStatus');