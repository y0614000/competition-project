<?php

namespace app\model;

use think\Model;

class User extends Model
{
    protected $table = 'user';
    protected $createTime = 'create_time';
    protected $updateTime = 'update_time';

    // 允许批量赋值的字段（加上 role）
    protected $fillable = [
        'username',
        'password',
        'nickname',
        'phone',
        'email',
        'avatar',
        'sex',
        'status',
        'role'  // 🔥 角色字段
    ];
}
