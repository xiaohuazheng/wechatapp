class Api {
    constructor() {

    }
    // 获取首页 最热文章数据api
    api_0 (offset) {
        return `/articles?offset=${offset}&limit=20`;
    }
    // 获取所有圈子数据api
    api_1 () {
        return `/circles`;
    }
    // 获取文案信息
    api_2 () {
        return `/infos`;
    }
    // 获取文章详情数据api
    api_3 (aid) {
        return `/articles/${aid}`;
    }
    // 获取文章详情页评论数据api
    api_4 (id, offset, sort) {
        return `/articles/${id}/comments?offset=${offset}&limit=5&order_by=${sort}`;
    }
    // 获取文章评论数据api
    api_5 (id, offset, sort) {
        return `/articles/${id}/comments?offset=${offset}&limit=20&order_by=${sort}`;
    }
    // 获取我的收藏api
    api_6 (offset) {
        return `/users/my/favorites?offset=${offset}&limit=20`;
    }
    // 获取我的分享&吐槽api
    api_7 (offset) {
        return `/users/my/articles?offset=${offset}&limit=20`;
    }
    // 获取我的评论api
    api_8 (id, offset, sort) {
        return `/users/my/comments?offset=${offset}&limit=20&order_by=${sort}`;
    }
    // 获取评论我的api
    api_9 (id, offset, sort) {
        return `/users/my/commenteds?offset=${offset}&limit=20&order_by=${sort}`;
    }


    // 用户登录api
    api_50 () {
        return `/onLogin`;
    }
    // 更新用户信息api
    api_51 () {
        return `/uploadUserInfo`;
    }
    // 发布文章api
    api_52 () {
        return `/article`;
    }
    // 发布评论api
    api_53 (aid) {
        return `/articles/${aid}/comments`;
    }
    // 收藏文章or取消收藏api
    api_54 (aid) {
        return `/articles/${aid}/favorite`;
    }
    // 喜欢文章or取消喜欢api
    api_55 (aid) {
        return `/articles/${aid}/upvote`;
    }
    // 点赞评论or取消点赞api
    api_56 (cid) {
        return `/comments/${cid}/upvote`;
    }
}


export default Api