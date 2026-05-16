<?php

namespace app\controller;

use think\Request;
use think\facade\Db;

class NewsController
{
    // 资讯列表
    public function list(Request $request)
    {
        $list = Db::name('news')
            ->order('id desc')
            ->select();

        // 把时间戳转成日期格式，方便前端展示
        foreach ($list as &$item) {
            $item['create_time'] = date('Y-m-d', $item['create_time']);
            // 把 type 转成文字，和你页面的标签对应
            $item['type_text'] = $item['type'] == 1 ? '政策' : '公告';
            // 这里你表里没有 source，我给你加个默认值，你也可以在表里加字段
            $item['source'] = '海南官方平台';
        }

        return json([
            'code' => 200,
            'data' => $list
        ]);
    }

    // 资讯详情
    public function detail(Request $request)
    {
        $id = $request->param('id');
        $info = Db::name('news')->where('id', $id)->find();

        // 浏览量+1
        Db::name('news')->where('id', $id)->inc('views')->update();

        return json([
            'code' => 200,
            'data' => $info
        ]);
    }
}
