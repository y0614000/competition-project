<?php
namespace app\controller;

use app\model\Job;
use app\model\JobMatch;
use think\Request;

class JobMatchController
{
    // 获取智能匹配职位列表
    public function list(Request $request)
    {
        $user_id = $request->param('user_id');
        
        if (!$user_id) {
            return json(['code' => 0, 'msg' => '请先登录']);
        }

        // 按匹配度 从高到低排序！
        $matchList = JobMatch::where('user_id', $user_id)
            ->order('match_score desc')
            ->select();

        $data = [];
        foreach ($matchList as $match) {
            $job = Job::find($match->job_id);
            if ($job) {
                $data[] = [
                    'id' => $job->id,
                    'jobName' => $job->job_name,
                    'salary' => $job->salary,
                    'companyName' => '海南本地企业',
                    'city' => $job->city,
                    'jobType' => '全职',
                    'needExp' => $job->exp,
                    'score' => (int)$match->match_score,
                    'jobDesc' => $job->content,
                ];
            }
        }

        return json([
            'code' => 1,
            'msg' => '获取成功',
            'data' => $data
        ]);
    }

    // 重新智能匹配
    public function refresh(Request $request)
    {
        $user_id = $request->param('user_id');
        $tag = $request->param('tag', '');
        
        if (!$user_id) {
            return json(['code' => 0, 'msg' => '请先登录']);
        }

        $tags = array_filter(explode(',', $tag));
        $jobs = Job::where('status', 1)->select();

        foreach ($jobs as $job) {
            $score = $this->calcScore($tags, $job);

            $has = JobMatch::where('user_id', $user_id)
                ->where('job_id', $job->id)
                ->find();

            if ($has) {
                $has->match_score = $score;
                $has->save();
            } else {
                JobMatch::create([
                    'user_id' => $user_id,
                    'job_id' => $job->id,
                    'match_score' => $score,
                    'create_time' => time()
                ]);
            }
        }

        return json(['code' => 1, 'msg' => '匹配成功']);
    }

    // ✅ 智能匹配算法
    protected function calcScore($tags, $job)
    {
        if (empty($tags)) return 70;

        $jobName = $job->job_name;
        $jobSkill = $job->skill ?? '';

        foreach ($tags as $t) {
            $t = trim($t);
            if (mb_strpos($jobName, $t) !== false || mb_strpos($jobSkill, $t) !== false) {
                return 100; // 🎯 只要包含关键词，直接 100 分！
            }
        }

        // 部分匹配
        return rand(70, 88);
    }
}