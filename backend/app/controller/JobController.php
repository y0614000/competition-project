<?php

namespace app\controller;

use think\Request;
use think\facade\Db;

class JobController
{
    // 职位列表
    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 10);
        $searchKey = $request->get('searchKey', '');
        $status = $request->get('status', '');

        $where = [];
        if ($searchKey) {
            $where[] = ['job_name', 'like', "%{$searchKey}%"];
        }
        if ($status !== '') {
            $where[] = ['status', '=', $status];
        }

        $list = Db::name('job')
            ->where($where)
            ->order('id desc')
            ->paginate([
                'list_rows' => $limit,
                'page' => $page
            ]);

        return json([
            'code' => 200,
            'msg' => 'ok',
            'data' => [
                'list' => $list->items(),
                'total' => $list->total()
            ]
        ]);
    }

    // 保存
    public function save(Request $request)
    {
        $data = $request->post();
        Db::name('job')->save($data);
        return json(['code' => 200, 'msg' => '保存成功']);
    }

    // 删除
    public function delete(Request $request)
    {
        $id = $request->post('id');
        Db::name('job')->delete($id);
        return json(['code' => 200, 'msg' => '删除成功']);
    }

    // 切换状态
    public function switchStatus(Request $request)
    {
        $id = $request->post('id');
        $status = $request->post('status');
        Db::name('job')->where('id', $id)->update(['status' => $status]);
        return json(['code' => 200, 'msg' => '状态更新成功']);
    }
}
