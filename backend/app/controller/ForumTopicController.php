<?php

namespace app\controller;

use think\Request;
use think\facade\Db;

class ForumTopicController
{
    // 话题列表
    public function list(Request $request)
    {
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 10);

        $list = Db::name('forum_topic')
            ->order('id desc')
            ->paginate([
                'list_rows' => $limit,
                'page' => $page
            ]);

        return json([
            'code' => 200,
            'data' => [
                'list' => $list->items(),
                'total' => $list->total()
            ]
        ]);
    }

    // 发布话题（完全匹配你的表）
    public function save(Request $request)
    {
        $title = $request->post('title');
        $content = $request->post('content');
        $user_id = $request->post('user_id');
        $author = $request->post('author', '用户');

        Db::name('forum_topic')->insert([
            'user_id' => $user_id,
            'title' => $title,
            'content' => $content,
            'author' => $author,
            'look_num' => 0,
            'reply_num' => 0,
            'views' => 0,
            'comments' => 0,
            'create_time' => time()
        ]);

        return json(['code' => 200, 'msg' => '发布成功']);
    }

    // 删除话题
    public function delete(Request $request)
    {
        $id = $request->post('id');
        Db::name('forum_topic')->delete($id);
        return json(['code' => 200, 'msg' => '删除成功']);
    }
}
