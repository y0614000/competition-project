<?php

namespace app\controller;

use think\Request;
use think\facade\Db;

class CompanyController
{
    // 所有企业
    public function all()
    {
        $list = Db::table('company')->select();
        return json(['code' => 1, 'data' => $list]);
    }

    // 新增
    public function create(Request $r)
    {
        Db::table('company')->insert([
            'name' => $r->name,
            'logo' => $r->logo,
            'industry' => $r->industry,
            'address' => $r->address,
            'contact' => $r->contact,
            'tel' => $r->tel,
            'intro' => $r->intro,
            'status' => $r->status,
            'create_time' => date('Y-m-d H:i:s')
        ]);
        return json(['code' => 1]);
    }

    // 修改
    public function update(Request $r)
    {
        Db::table('company')->where('id', $r->id)->update([
            'name' => $r->name,
            'logo' => $r->logo,
            'industry' => $r->industry,
            'address' => $r->address,
            'contact' => $r->contact,
            'tel' => $r->tel,
            'intro' => $r->intro,
            'status' => $r->status
        ]);
        return json(['code' => 1]);
    }

    // 删除
    public function delete(Request $r)
    {
        Db::table('company')->where('id', $r->id)->delete();
        return json(['code' => 1]);
    }
}
