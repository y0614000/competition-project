<?php

namespace app\controller;

use think\Request;
use think\facade\Db;

class JobController
{
    // 职位列表（优化：搜索、分页、状态筛选）
    public function index(Request $request)
    {
        $page       = $request->get('page', 1);
        $limit      = $request->get('limit', 10);
        $searchKey  = $request->get('searchKey', '');
        $status     = $request->get('status', '');

        $where = [];

        // 搜索职位名称
        if (!empty($searchKey)) {
            $where[] = ['job_name', 'like', "%{$searchKey}%"];
        }

        // 状态筛选
        if ($status !== '') {
            $where[] = ['status', '=', (int)$status];
        }

        // 查询数据
        $list = Db::name('job')
            ->where($where)
            ->order('id', 'desc')
            ->paginate([
                'list_rows' => $limit,
                'page'      => $page
            ]);

        return json([
            'code' => 200,
            'msg'  => 'success',
            'data' => [
                'list'  => $list->items(),
                'total' => $list->total()
            ]
        ]);
    }

    // 保存（优化：区分新增 / 修改，自动写入创建时间）
    public function save(Request $request)
    {
        $data = $request->post();

        // 验证职位名称不能为空
        if (empty($data['job_name'])) {
            return json(['code' => 400, 'msg' => '职位名称不能为空']);
        }

        if (!empty($data['id'])) {
            // 修改
            Db::name('job')->where('id', $data['id'])->update($data);
        } else {
            // 新增 → 自动写入创建时间
            $data['create_time'] = date('Y-m-d H:i:s');
            Db::name('job')->insert($data);
        }

        return json(['code' => 200, 'msg' => '保存成功']);
    }

    // 删除（优化：强制 int 类型，更安全）
    public function delete(Request $request)
    {
        $id = (int)$request->post('id');

        if ($id <= 0) {
            return json(['code' => 400, 'msg' => '参数错误']);
        }

        Db::name('job')->delete($id);

        return json(['code' => 200, 'msg' => '删除成功']);
    }

    // 切换状态（优化：类型强制转换）
    public function switchStatus(Request $request)
    {
        $id     = (int)$request->post('id');
        $status = (int)$request->post('status');

        if ($id <= 0) {
            return json(['code' => 400, 'msg' => '参数错误']);
        }

        Db::name('job')->where('id', $id)->update([
            'status' => $status
        ]);

        return json(['code' => 200, 'msg' => '状态更新成功']);
    }
}
