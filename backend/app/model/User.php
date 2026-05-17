<?php

namespace app\model;

use think\Model;

class User extends Model
{
    protected $table = 'user';
    protected $createTime = 'create_time';
    protected $updateTime = 'update_time';
}
