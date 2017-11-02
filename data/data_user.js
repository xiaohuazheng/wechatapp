
// 用户信息 第一页数据

var user = {
    "isSigned": true,
    "userId": "1234",
    "nickName": "测试账号",
    "gender": 1, // 性别
    "language": "zh_CN",
    "city": "Chengdu",
    "province": "Sichuan",
    "country": "CN",
    "avatarUrl": "", // 头像
    "collectionCount": 32, //收藏文章数量
    "articleCount": 28, // 发布文章数量
    "commentCount": 33, // 评论（包括评论文章和回复评论）数量

    // 以下为个圈子积分
    "score": 123, // 总积分
    "dota2Score": 32,  // DOTA2积分  这些数据不返回，在排名的时候使用而已
    "lolScore": 45  //lol积分
}

exports.user = user;