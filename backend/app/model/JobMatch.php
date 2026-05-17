<?php
namespace app\model;

use think\Model;

class JobMatch extends Model
{
    protected $table = 'job_match';
    protected $createTime = 'create_time';
    protected $updateTime = false;
}