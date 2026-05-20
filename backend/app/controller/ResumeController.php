<?php

namespace app\controller;

use app\model\User;
use think\Request;

class ResumeController
{
    // 获取简历
    public function get(Request $request)
    {
        $user_id = $request->param('user_id');
        if (!$user_id) {
            return json(['code' => 0, 'msg' => '请先登录']);
        }

        $user = User::find($user_id);
        if (!$user) {
            return json(['code' => 0, 'msg' => '用户不存在']);
        }

        return json([
            'code' => 1,
            'data' => $user
        ]);
    }

    // 保存所有简历字段
    public function save(Request $request)
    {
        $user_id = $request->param('user_id');
        if (!$user_id) {
            return json(['code' => 0, 'msg' => '请先登录']);
        }

        $user = User::find($user_id);
        if (!$user) {
            return json(['code' => 0, 'msg' => '用户不存在']);
        }

        $user->real_name = $request->param('real_name');
        $user->gender = $request->param('gender');
        $user->phone = $request->param('phone');
        $user->email = $request->param('email');
        $user->city_hope = $request->param('city_hope');
        $user->job_hope = $request->param('job_hope');
        $user->salary_hope = $request->param('salary_hope');
        $user->work_type = $request->param('work_type');
        $user->education = $request->param('education');
        $user->experience = $request->param('experience');
        $user->skill = $request->param('skill');
        $user->award = $request->param('award');
        $user->project_exp = $request->param('project_exp');
        $user->certificate = $request->param('certificate');
        $user->hobby = $request->param('hobby');
        $user->desc = $request->param('desc');

        $user->save();

        return json(['code' => 1, 'msg' => '简历保存成功']);
    }
}
