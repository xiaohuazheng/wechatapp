import _ from '../../../utils/underscore';
let app = getApp();

Page({
    data: {
        shareObj: {
            share: []
        },
        offset: 0
    },
    onLoad(query) {
        this.query = query;
        app.register('uf', app);
        if (query.type == 'favorite') {
            this.setData({
                'shareObj.isShowDelete': true
            });
        } else if (query.type == 'shares') {
            this.setData({
                'shareObj.isShowRead': true
            });
        }
        let barTitle = query.type == 'favorite' ? '我的收藏' : '我的分享&吐槽';
        app.util.setPageTitle(barTitle);
        this.getData();
    },
    getData() {
        !this.data.isLoading && this.setData({
            isLoading: true
        });
        let req_type = this.query.type == 'favorite' ? 'getUFavoretes' : (this.query.type == 'shares' ? 'getUArticles' : '');

        req_type && app.httpService[req_type](this.data.offset)
        .then(data => {
            if (_.isArray(data)) {
                app.util.getSharesCb(this, data);
            } else if (data && data.code == 401) {
                app.getUserInfo();
            }
        }, () => {
            this.setData({
                isNetError: true
            });
        });
    },
    nextLoad() {
        let req_type = this.query.type == 'favorite' ? 'getUFavoretes' : (this.query.type == 'shares' ? 'getUArticles' : '');
        this.data.hasNextPage = false;

        req_type && app.httpService[req_type](this.data.offset)
        .then(data => {
            app.util.nextSharesCb(this, data);
        }, () => {
            this.setData({
                isNetError: true
            });
        });
    },
    deleteItem(e) {
        let _this = this,
            aid = e.currentTarget.dataset.aid,
            index = e.currentTarget.dataset.index;
        app.util.showModal('确定删除收藏？', true, '', '', () => {
            app.httpService.deleteFavoriteArticle(aid)
            .then(data => {
                _this.data.shareObj.share.splice(index, 1);
                _this.setData({
                    shareObj: _this.data.shareObj
                });
            }, () => {
                app.util.showTipToast('系统繁忙，请稍后重试');
            });
        });
    },
    userHeadTap(e) {
        if (this.query.type == 'favorite') {
            app.util.rLoadpage('../../u/g/g', {
                ggid: e.currentTarget.dataset.ggid
            }, app);
        } else if (this.query.type == 'shares') {
            return;
        }
    }
});