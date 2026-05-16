<?php

use think\facade\Route;

Route::get('think', function () {
    return 'hello,ThinkPHP8!';
});

Route::get('hello/:name', 'index/hello');
Route::get('api/home', 'HomeApi/index');

// jobList
Route::get('api/job/list', 'app\controller\JobController@index');
Route::post('api/job/save', 'app\controller\JobController@save');
Route::post('api/job/delete/:id', 'app\controller\JobController@delete');
Route::post('api/job/switchStatus', 'app\controller\JobController@switchStatus');

// newsList
Route::get('api/news/list', 'app\controller\NewsController@list');
Route::get('api/news/detail/:id', 'app\controller\NewsController@detail');

// CourseList
Route::get('api/course/list', 'app\controller\CourseController@list');
