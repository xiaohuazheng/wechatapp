import es6 from '../assets/plugins/es6-promise';
import ServiceBase from 'serviceBase';
import Api from 'api';

const api = new Api;

// test data
const index = require('../data/data_index.js');
const circles = require('../data/data_circles.js');
const circle = require('../data/data_circle.js');
const comment = require('../data/data_comment.js');
const share = require('../data/data_share.js');
const detailcomment = require('../data/data_detailcomment.js');
const rank = require('../data/data_rank.js');
const user = require('../data/data_user.js');


class Service extends ServiceBase {
    constructor() {
        super();
    }

    // 获取首页 最热文章数据
    getIndexArticles(offset) {
        //return this.getRequest(api.api_0(offset));
        return new es6.Promise((resolve, reject) => {
            resolve(index.index);
        });
    }

    // 获取所有圈子数据
    getCircles() {
        //return this.getRequest(api.api_1());
        return new es6.Promise((resolve, reject) => {
            resolve(circles.circles);
        });
    }

    // 获取文案信息
    getWeInfo() {
        return this.getRequest(api.api_2());
    }

    // 获取文章详情数据
    getArticle(aid) {
        //return this.getRequest(api.api_3(aid));
        return new es6.Promise((resolve, reject) => {
            resolve(share.share);
        });
    }

    // 获取文章详情页评论数据
    getAComment(aid, offset, sort) {
        return this.getRequest(api.api_4(aid, offset, sort));
    }

    // 获取文章评论数据
    getAComments(aid, offset, sort) {
        return this.getRequest(api.api_5(aid, offset, sort));
    }

    // 获取我的收藏数据
    getUFavoretes(offset) {
        return this.getRequest(api.api_6(offset));
    }

    // 获取我的分享&吐槽数据
    getUArticles(offset) {
        return this.getRequest(api.api_7(offset));
    }

    // 获取我的评论数据
    getUComments(id, offset, sort) {
        return this.getRequest(api.api_8(id, offset, sort));
    }

    // 获取评论我的数据
    getUCommenteds(id, offset, sort) {
        return this.getRequest(api.api_9(id, offset, sort));
    }

    // 获取搜索数据
    getSearchs() {
        return this.getRequest(api.api_11());
    }

    // 获取用户数据
    postUserLogin(code) {
        return this.postRequest(api.api_50(), {
            code: code
        });
    }

    // 更新用户信息
    postUserInfo(params) {
        return this.postRequest(api.api_51(), params);
    }

    // 发布评论
    postSendComment(aid, params) {
        return this.postRequest(api.api_53(aid), params);
    }

    // 收藏文章
    postFavoriteArticle(aid) {
        return this.postRequest(api.api_54(aid));
    }

    // 喜欢文章
    postLikeArticle(aid) {
        return this.postRequest(api.api_55(aid));
    }

    // 点赞评论
    postLikeComment(cid) {
        return this.postRequest(api.api_56(cid));
    }

    // 取消收藏文章
    deleteFavoriteArticle(aid) {
        return this.deleteRequest(api.api_54(aid));
    }

    // 取消喜欢文章
    deleteLikeArticle(aid) {
        return this.deleteRequest(api.api_55(aid));
    }

    // 取消点赞评论
    deleteLikeComment(cid) {
        return this.deleteRequest(api.api_56(cid));
    }

}

export default Service