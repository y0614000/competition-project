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
            $item['teacher'] = '官方讲师';
            $item['time'] = '待定';
            $item['tag'] = $item['price'] == 0 ? '免费' : '热门';
            $item['create_time'] = date('Y-m-d', strtotime($item['create_time']));
        }

        return json([
            'code' => 200,
            'data' => $list
        ]);
    }

    // ✅ 课程报名（我直接给你写好）
    public function join(Request $request)
    {
        $userId = $request->post('userId');
        $courseId = $request->post('courseId');

        // 1. 校验参数
        if (!$userId || !$courseId) {
            return json([
                'code' => 400,
                'msg' => '参数不完整'
            ]);
        }

        // 2. 判断课程是否存在
        $course = Db::name('course')->where('id', $courseId)->find();
        if (!$course) {
            return json([
                'code' => 400,
                'msg' => '课程不存在'
            ]);
        }

        // 3. 判断是否已经报名
        $has = Db::name('user_course')
            ->where('user_id', $userId)
            ->where('course_id', $courseId)
            ->find();

        if ($has) {
            return json([
                'code' => 400,
                'msg' => '你已经报名过该课程，无需重复报名'
            ]);
        }

        // 4. 插入报名记录
        Db::name('user_course')->insert([
            'user_id' => $userId,
            'course_id' => $courseId,
            'create_time' => date('Y-m-d H:i:s')
        ]);

        // 5. 学习人数 +1
        Db::name('course')
            ->where('id', $courseId)
            ->inc('study_num')
            ->update();

        return json([
            'code' => 200,
            'msg' => '报名成功'
        ]);
    }
}
