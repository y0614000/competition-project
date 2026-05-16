<?php

namespace app\controller;

use think\Request;
use think\facade\Db;

class ForumTopicController
{
    // 话题列表（带搜索+分页）
    public function list(Request $request)
    {
        $page       = $request->get('page', 1);
        $limit      = $request->get('limit', 10);
        $title      = $request->get('title', '');
        $status     = $request->get('status', '');

        $where = [];
        if (!empty($title)) {
            $where[] = ['title', 'like', "%{$title}%"];
        }
        if ($status !== '') {
            $where[] = ['status', '=', $status];
        }

        $list = Db::name('forum_topic')
            ->where($where)
            ->order('id desc')
            ->paginate([
                'list_rows' => $limit,
                'page'      => $page
            ]);

        // 格式化时间戳为日期格式
        foreach ($list as &$item) {
            $item['createTime'] = date('Y-m-d H:i:s', $item['create_time']);
        }

        return json([
            'code' => 200,
            'msg'  => 'success',
            'data' => [
                'list'  => $list->items(),
                'total' => $list->total()
            ]
        ]);
    }

    // 新增/编辑话题
    public function save(Request $request)
    {
        $data = $request->post();

        if (empty($data['title'])) {
            return json(['code' => 400, 'msg' => '话题标题不能为空']);
        }

        if (!empty($data['id'])) {
            // 编辑
            Db::name('forum_topic')->where('id', $data['id'])->update($data);
        } else {
            // 新增：自动写入创建时间，默认浏览/评论数为0
            $data['create_time'] = time();
            $data['view'] = 0;
            $data['comment'] = 0;
            Db::name('forum_topic')->insert($data);
        }

        return json(['code' => 200, 'msg' => '保存成功']);
    }

    // 删除话题
    public function delete(Request $request)
    {
        $id = (int)$request->post('id');
        if ($id <= 0) {
            return json(['code' => 400, 'msg' => '参数错误']);
        }
        Db::name('forum_topic')->delete($id);
        return json(['code' => 200, 'msg' => '删除成功']);
    }
}
