<?php
namespace app\controller;

use think\facade\Db;

class HomeApi
{
    public function index()
    {
        // 只有这一行查询，绝对干净
        $job = Db::table('job')->limit(4)->select();

        return json([
            'code' => 200,
            'job'  => $job
        ]);
    }
}