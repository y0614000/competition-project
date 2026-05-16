<?php
namespace app\controller;

use think\Request;
use think\facade\Db;

class JobController
{
    // 列表：接口地址是 api/job/list
    public function index(Request $request)
    {
        $page       = $request->get('page', 1);
        $limit      = $request->get('limit', 10);
        $searchKey  = $request->get('searchKey', '');
        $status     = $request->get('status', '');

        $where = [];
        if (!empty($searchKey)) {
            $where[] = ['job_name', 'like', "%{$searchKey}%"];
        }
        if ($status !== '') {
            $where[] = ['status', '=', (int)$status];
        }

        $list = Db::name('job')
            ->where($where)
            ->order('id desc')
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

    public function save(Request $request)
    {
        $data = $request->post();

        if (empty($data['job_name'])) {
            return json(['code' => 400, 'msg' => '职位名称不能为空']);
        }

        if (!empty($data['id'])) {
            Db::name('job')->where('id', $data['id'])->update($data);
        } else {
            $data['create_time'] = date('Y-m-d H:i:s');
            Db::name('job')->insert($data);
        }

        return json(['code' => 200, 'msg' => '保存成功']);
    }

    public function delete(Request $request)
    {
        $id = (int)$request->post('id');
        Db::name('job')->delete($id);
        return json(['code' => 200, 'msg' => '删除成功']);
    }

    public function switchStatus(Request $request)
    {
        $id     = (int)$request->post('id');
        $status = (int)$request->post('status');
        Db::name('job')->where('id', $id)->update(['status' => $status]);
        return json(['code' => 200, 'msg' => '状态更新成功']);
    }
}