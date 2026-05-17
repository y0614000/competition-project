<?php

namespace app\controller;

use app\model\User as UserModel; 
use think\Request;

class User
{
    // 注册
    public function register(Request $request)
    {
        $username = $request->post('username');
        $password = $request->post('password');
        $repass   = $request->post('repass');

        if (!$username || !$password || !$repass) {
            return json(['code' => 0, 'msg' => '请填写完整信息']);
        }

        if ($password !== $repass) {
            return json(['code' => 0, 'msg' => '两次密码不一致']);
        }

        $has = UserModel::where('username', $username)->find();
        if ($has) {
            return json(['code' => 0, 'msg' => '账号已存在']);
        }

        $user = new UserModel();
        $user->username = $username;
        $user->password = password_hash($password, PASSWORD_DEFAULT);
        $user->nickname = '用户' . rand(1000, 9999);
        $user->phone = null;
        $user->email = null;
        $user->avatar = null;
        $user->sex = 0;
        $user->status = 1;
        $user->save();

        return json(['code' => 1, 'msg' => '注册成功']);
    }

    // 登录
    public function login(Request $request)
    {
        $username = $request->post('username');
        $password = $request->post('password');

        if (!$username || !$password) {
            return json(['code' => 0, 'msg' => '请输入账号密码']);
        }

        $user = UserModel::where('username', $username)->find();

        if (!$user) {
            return json(['code' => 0, 'msg' => '账号不存在']);
        }

        if ($user->status == 0) {
            return json(['code' => 0, 'msg' => '账号已禁用']);
        }

        if (!password_verify($password, $user->password)) {
            return json(['code' => 0, 'msg' => '密码错误']);
        }

        return json([
            'code' => 1,
            'msg' => '登录成功',
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'nickname' => $user->nickname
            ]
        ]);
    }
}
