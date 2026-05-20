/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306_1
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : competition-project

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 15/05/2026 23:36:52
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for company
-- ----------------------------
DROP TABLE IF EXISTS `company`;
CREATE TABLE `company`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '企业ID',
  `name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '企业名称',
  `logo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '企业logo',
  `industry` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '所属行业',
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '企业地址',
  `contact` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '联系人',
  `tel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '联系电话',
  `intro` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '企业简介',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态',
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '企业表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of company
-- ----------------------------
INSERT INTO `company` VALUES (1, '海南科技有限公司', '', '互联网IT', '海口市美兰区', '陈经理', '18866668888', '海南本土互联网科技企业，主营软件开发与大数据服务', 1, 1778859376);
INSERT INTO `company` VALUES (2, '自贸港贸易集团', '', '商贸物流', '三亚市吉阳区', '林主管', '18977779999', '专注跨境贸易、进出口商务服务', 1, 1778859376);
INSERT INTO `company` VALUES (3, '海南教育文化集团', '', '教育培训', '琼海市', '周总', '18655556666', '人才培训、职业技能教育为主', 1, 1778859376);

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '课程名',
  `cover` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '课程封面',
  `price` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '价格',
  `course_intro` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '课程介绍',
  `study_num` int(11) NULL DEFAULT 0 COMMENT '学习人数',
  `status` tinyint(4) NULL DEFAULT 1,
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '在线课程表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES (1, '自贸港政策解读课程', '', 199.00, '详解海南自贸港就业、创业、落户全部政策', 86, 1, 1778859376);
INSERT INTO `course` VALUES (2, '职场办公全能培训', '', 129.00, 'Excel、PPT、办公礼仪全套职场技能', 152, 1, 1778859376);

-- ----------------------------
-- Table structure for forum_reply
-- ----------------------------
DROP TABLE IF EXISTS `forum_reply`;
CREATE TABLE `forum_reply`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `topic_id` int(11) NOT NULL COMMENT '帖子id',
  `user_id` int(11) NOT NULL COMMENT '回复人',
  `reply_content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '回复内容',
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '论坛回复表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of forum_reply
-- ----------------------------
INSERT INTO `forum_reply` VALUES (1, 1, 2, '海口互联网企业多，适合技术岗', 1778859376);
INSERT INTO `forum_reply` VALUES (2, 2, 1, '可以先自学基础，再报班系统学习', 1778859376);

-- ----------------------------
-- Table structure for forum_topic
-- ----------------------------
DROP TABLE IF EXISTS `forum_topic`;
CREATE TABLE `forum_topic`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '发帖人',
  `title` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '帖子标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '帖子内容',
  `look_num` int(11) NULL DEFAULT 0 COMMENT '浏览数',
  `reply_num` int(11) NULL DEFAULT 0 COMMENT '回复数',
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '论坛主题表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of forum_topic
-- ----------------------------
INSERT INTO `forum_topic` VALUES (1, 1, '海南找工作哪里机会多', '想问下各位前辈，海口和三亚哪边就业机会更大', 45, 2, 1778859376);
INSERT INTO `forum_topic` VALUES (2, 2, '零基础转行IT可行吗', '本人零基础，想转行做程序员，求经验分享', 68, 5, 1778859376);

-- ----------------------------
-- Table structure for job
-- ----------------------------
DROP TABLE IF EXISTS `job`;
CREATE TABLE `job`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '职位ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `job_name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '职位名称',
  `salary` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '薪资',
  `city` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '工作城市',
  `edu` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '学历要求',
  `exp` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '经验要求',
  `skill` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '技能要求',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '职位详情',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '1招聘中0下架',
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '职位表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of job
-- ----------------------------
INSERT INTO `job` VALUES (1, 1, 'Java开发工程师', '6000-10000', '海口', '本科', '1-3年', 'Java,MySQL,SpringBoot', '负责后端项目开发维护，参与需求评审', 1, 1778859376);
INSERT INTO `job` VALUES (2, 1, '前端开发', '5500-8500', '海口', '大专', '不限', 'Vue,HTML,CSS', '负责页面制作与交互功能开发', 1, 1778859376);
INSERT INTO `job` VALUES (3, 2, '外贸业务员', '5000-9000', '三亚', '大专', '1年以上', '英语,商务谈判', '对接海外客户，处理进出口订单', 1, 1778859376);
INSERT INTO `job` VALUES (4, 3, '职业培训讲师', '4800-7500', '琼海', '本科', '2年以上', '口才,授课,办公软件', '负责职业技能课程线下授课', 1, 1778859376);

-- ----------------------------
-- Table structure for job_apply
-- ----------------------------
DROP TABLE IF EXISTS `job_apply`;
CREATE TABLE `job_apply`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '求职者',
  `job_id` int(11) NOT NULL COMMENT '职位id',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '1已投递2已查看3面试邀约4录用5拒绝',
  `apply_time` int(11) NOT NULL COMMENT '投递时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '投递记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of job_apply
-- ----------------------------
INSERT INTO `job_apply` VALUES (1, 1, 1, 2, 1778859376);
INSERT INTO `job_apply` VALUES (2, 2, 3, 3, 1778859376);

-- ----------------------------
-- Table structure for job_match
-- ----------------------------
DROP TABLE IF EXISTS `job_match`;
CREATE TABLE `job_match`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `match_score` decimal(5, 2) NULL DEFAULT 0.00 COMMENT '匹配分数',
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '职位智能匹配表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of job_match
-- ----------------------------
INSERT INTO `job_match` VALUES (1, 1, 1, 92.50, 1778859376);
INSERT INTO `job_match` VALUES (2, 2, 3, 88.30, 1778859376);

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `cover` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '封面图',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容',
  `type` tinyint(4) NULL DEFAULT 1 COMMENT '1人才政策2招聘资讯',
  `views` int(11) NULL DEFAULT 0 COMMENT '浏览量',
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '资讯政策表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (1, '海南自贸港人才引进补贴政策', '', '符合条件外来人才可享受住房补贴、就业补贴，学历越高补贴越高', 1, 120, 1778859376);
INSERT INTO `news` VALUES (2, '5月海南大型线下招聘会通知', '', '本月下旬海口、三亚同步举办综合招聘会，海量岗位免费求职', 2, 235, 1778859376);

-- ----------------------------
-- Table structure for resume
-- ----------------------------
DROP TABLE IF EXISTS `resume`;
CREATE TABLE `resume`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `real_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '真实姓名',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `education` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '学历',
  `major` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '专业',
  `work_exp` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '工作经历',
  `self_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '自我评价',
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '简历表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of resume
-- ----------------------------
INSERT INTO `resume` VALUES (1, 1, '张三', '13800138000', 'zhangsan@qq.com', '本科', '计算机科学与技术', '曾从事后端开发两年，熟悉项目流程', '做事踏实认真，学习能力强，服从安排', 1778859376);
INSERT INTO `resume` VALUES (2, 2, '李四', '13900139000', 'lisi@qq.com', '大专', '商务英语', '外贸行业工作一年，熟悉跨境流程', '性格开朗，善于沟通，抗压能力强', 1778859376);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '账号',
  `password` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  `nickname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '昵称',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '手机号',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '邮箱',
  `avatar` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '头像',
  `sex` tinyint(4) NULL DEFAULT 0 COMMENT '0未知1男2女',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '1正常0禁用',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `update_time` int(11) NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'zhangsan', '123456', '张三', '13800138000', 'zhangsan@qq.com', '', 1, 1, 1778859376, 1778859376);
INSERT INTO `user` VALUES (2, 'lisi', '123456', '李四', '13900139000', 'lisi@qq.com', '', 2, 1, 1778859376, 1778859376);
INSERT INTO `user` VALUES (3, 'wangwu', '123456', '王五', '13700137000', 'wangwu@qq.com', '', 1, 1, 1778859376, 1778859376);

SET FOREIGN_KEY_CHECKS = 1;
