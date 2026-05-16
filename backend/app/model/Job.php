<?php

namespace app\model;

use think\Model;

class Job extends Model
{
    // 表名
    protected $name = 'job';

    // 关闭自动写入 update_time
    protected $updateTime = false;
}
