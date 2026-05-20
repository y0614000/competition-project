<?php

namespace app\controller;

use think\Request;
use think\facade\Db; // 用Db，不用模型

class ApplyController
{
    // 获取我的投递记录
    public function getList(Request $r)
    {
        $userId = $r->get('user_id');

        $list = Db::table('user_apply')
            ->where('user_id', $userId)
            ->order('id desc')
            ->select();

        return json([
            'code' => 1,
            'data' => $list
        ]);
    }

    // 新增投递
    public function add(Request $r)
    {
        Db::table('user_apply')->insert([
            'user_id'   => $r->post('user_id'),
            'jobName'   => $r->post('jobName'),
            'company'   => $r->post('company'),
            'city'      => $r->post('city'),
            'applyTime' => $r->post('applyTime'),
            'status'    => $r->post('status'),
            'tagType'   => $r->post('tagType'),
        ]);

        return json(['code' => 1, 'msg' => '新增成功']);
    }

    // 编辑
    public function edit(Request $r)
    {
        $id = $r->post('id');

        Db::table('user_apply')->where('id', $id)->update([
            'jobName'   => $r->post('jobName'),
            'company'   => $r->post('company'),
            'city'      => $r->post('city'),
            'applyTime' => $r->post('applyTime'),
            'status'    => $r->post('status'),
            'tagType'   => $r->post('tagType'),
        ]);

        return json(['code' => 1]);
    }

    // 取消投递
    public function cancel(Request $r)
    {
        $id = $r->post('id');

        Db::table('user_apply')->where('id', $id)->update([
            'status'  => '已取消',
            'tagType' => 'info'
        ]);

        return json(['code' => 1]);
    }

    // 删除
    public function del(Request $r)
    {
        $id = $r->post('id');
        Db::table('user_apply')->where('id', $id)->delete();

        return json(['code' => 1]);
    }
}
