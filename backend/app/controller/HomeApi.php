<?php

namespace app\controller;

use think\facade\Db;

class HomeApi
{
    public function index()
    {
        $data = [
            'job'   => Db::table('job')->limit(4)->select(),
            'news'  => Db::table('news')->limit(4)->select(),
            'topic' => Db::table('forum_topic')->limit(4)->select(),
        ];

        return json($data);
    }
}
