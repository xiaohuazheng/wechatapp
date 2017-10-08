import _ from '../../../utils/underscore';
let app = getApp();

Page({
    data: {
        detail: {},
        ctnts: [],
        imgs: [],
        hotC: {
            comment: [],
            page_type: 'getAComments'
        },
        canShare: wx.canIUse('button.open-type.share')
    },
    onLoad(query) {
        this.query = query;
        app.register('ba', app);
        app.util.setPageTitle(query.type == 1 ? '吐槽' : '分享');
        this.getData();
    },
    onShow() {
        this.getCommentData();
    },
    onShareAppMessage() {
        let type = this.query.type == 1 ? '吐槽' : '分享';
        let title = `${(app._user && app._user.nickName || 'GameGuy')} 邀你一起阅读这篇${type}`;
        return app.util.getShareParams(`/pages/b/a/a?aid=${this.data.detail.id}`, title);
    },
    getData() {
        !this.data.isLoading && this.setData({
            isLoading: true
        });

        app.httpService.getArticle(this.query.aid)
        .then(data => {
            if (data.code == 200) {
                let share = data.result || {},
                    ctnts = app.util.parseArticleContent(share.content),
                    imgs = app.util.parseArticleImg(share.content);
                this.setData({
                    detail: share,
                    ctnts: ctnts,
                    imgs: imgs
                });
            } else if (data.code == 401) {
                app.getUserInfo();
            }
        });
    },
    getCommentData() {
        app.httpService.getAComment(this.query.aid, 0, 'hot')
        .then(data => {
            if (_.isArray(data)) {
                this.setData({
                    'hotC.comment': app.util.parseComment(this.query.aid, data)
                });
            } else if (data && data.code == 401) {
                app.getUserInfo();
            }
        });
    },
    toUpvote(e) {
        let _this = this,
            index = e.currentTarget.dataset.index;
        app.loginTo(_this, () => {
            app.httpService.postLikeComment(e.currentTarget.dataset.cid)
            .then(data => {
                console.log('toUpvote ok');
            });

            _this.data.hotC.comment[index].upvote_count += 1;
            _this.data.hotC.comment[index].is_upvote = true;
            _this.setData({
                hotC: _this.data.hotC
            });
        });
    },
    unUpvote(e) {
        let _this = this,
            index = e.currentTarget.dataset.index;
        app.loginTo(_this, () => {
            app.httpService.deleteLikeComment(e.currentTarget.dataset.cid)
            .then(data => {
                console.log('unUpvote ok');
            });

            _this.data.hotC.comment[index].upvote_count -= 1;
            _this.data.hotC.comment[index].is_upvote = false;
            _this.setData({
                hotC: _this.data.hotC
            });
        });
    },
    toFavorite(e) {
        let _this = this;
        app.loginTo(_this, () => {
            app.httpService.postFavoriteArticle(_this.data.detail.id)
            .then(data => {
                _this.data.detail.is_favorite = true;
                _this.data.detail.favorite_count += 1;
                _this.setData({
                    detail: _this.data.detail
                });
            }, () => {
                app.util.showTipToast('系统繁忙，请稍后重试');
            });
        });
    },
    unFavorite(e) {
        let _this = this;
        app.loginTo(_this, () => {
            app.httpService.deleteFavoriteArticle(_this.data.detail.id)
            .then(data => {
                _this.data.detail.is_favorite = false;
                _this.data.detail.favorite_count -= 1;
                _this.setData({
                    detail: _this.data.detail
                });
            }, () => {
                app.util.showTipToast('系统繁忙，请稍后重试');
            });
        });
    },
    toPretty(e) {
        let _this = this;
        app.loginTo(_this, () => {
            app.httpService.postLikeArticle(_this.data.detail.id)
            .then(data => {
                console.log('toPretty ok');
            });

            _this.data.detail.is_upvote = true;
            _this.data.detail.upvote_count += 1;
            _this.setData({
                detail: _this.data.detail
            });
        });
    },
    unPretty(e) {
        let _this = this;
        app.loginTo(_this, () => {
            app.httpService.deleteLikeArticle(_this.data.detail.id)
            .then(data => {
                console.log('unPretty ok');
            });

            _this.data.detail.is_upvote = false;
            _this.data.detail.upvote_count -= 1;
            _this.setData({
                detail: _this.data.detail
            });
        });
    }
});