<?php

use think\facade\Route;

Route::get('think', function () {
    return 'hello,ThinkPHP8!';
});

Route::get('hello/:name', 'index/hello');
// 首页路由
Route::get('api/home', 'HomeApi/index');

// jobList
Route::get('api/job/list', 'app\controller\JobController@index');
Route::post('api/job/save', 'app\controller\JobController@save');
Route::post('api/job/delete', 'app\controller\JobController@delete');
Route::post('api/job/switchStatus', 'app\controller\JobController@switchStatus');

// newsList
Route::get('api/news/list', 'app\controller\NewsController@list');
Route::get('api/news/detail/:id', 'app\controller\NewsController@detail');

// CourseList
// 课程列表
Route::get('api/course/list', 'app\controller\CourseController@list');
// 课程报名
Route::post('api/course/join', 'app\controller\CourseController@join');

// forum
Route::get('api/forum/topic/list', 'app\controller\ForumTopicController@list');
Route::post('api/forum/topic/save', 'app\controller\ForumTopicController@save');
Route::post('api/forum/topic/delete', 'app\controller\ForumTopicController@delete');


// 企业信息接口
Route::get('CompanyController/all', 'CompanyController/all');
Route::post('CompanyController/create', 'CompanyController/create');
Route::post('CompanyController/update', 'CompanyController/update');
Route::post('CompanyController/delete', 'CompanyController/delete');
