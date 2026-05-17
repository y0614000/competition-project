<?php
namespace app\controller;
use app\model\User as UserModel;
use think\Request;
use think\facade\Session;

class User
{
    // 极简注册
    public function register(Request $request)
    {
        $username = $request->post('username');
        $password = $request->post('password');
        $repass   = $request->post('repass');

        // 只验证必填
        if (!$username || !$password || !$repass) {
            return json(['code' => 0, 'msg' => '请填写完整信息']);
        }
        if ($password !== $repass) {
            return json(['code' => 0, 'msg' => '两次密码不一致']);
        }

        // 检查账号是否存在
        $exist = UserModel::where('username', $username)->find();
        if ($exist) {
            return json(['code' => 0, 'msg' => '账号已存在']);
        }

        // 极简入库：其他字段自动填充默认值
        $user = new UserModel();
        $user->username = $username;
        $user->password = password_hash($password, PASSWORD_DEFAULT);
        $user->nickname = '用户'.rand(1000,9999); // 自动生成昵称
        $user->phone    = null;
        $user->email    = null;
        $user->avatar   = null;
        $user->sex      = 0;
        $user->status   = 1;
        $user->save();

        return json(['code' => 1, 'msg' => '注册成功！']);
    }

    // 登录（不变）
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

        Session::set('user', [
            'id' => $user->id,
            'username' => $user->username
        ]);

        return json(['code' => 1, 'msg' => '登录成功']);
    }

    // 退出
    public function logout()
    {
        Session::clear();
        return json(['code' => 1, 'msg' => '退出成功']);
    }
}