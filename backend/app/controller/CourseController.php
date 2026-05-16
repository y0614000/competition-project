<?php

namespace app\controller;

use think\Request;
use think\facade\Db;

class CourseController
{
    // 课程列表
    public function list(Request $request)
    {
        $list = Db::name('course')
            ->where('status', 1)
            ->order('id desc')
            ->select();

        // 格式化数据，适配前端
        foreach ($list as &$item) {
            $item['title'] = $item['course_name'];
            $item['desc'] = $item['course_intro'];
            $item['teacher'] = '官方讲师'; // 表里没有，这里给默认值
            $item['time'] = '待定'; // 表里没有，这里给默认值
            $item['tag'] = $item['price'] == 0 ? '免费' : '热门';
            $item['create_time'] = date('Y-m-d', $item['create_time']);
        }

        return json([
            'code' => 200,
            'data' => $list
        ]);
    }
}
