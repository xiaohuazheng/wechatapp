let app = getApp();

Page({
    data: {
        shareObj: {
            share: []
        },
        offset: 0,
        userInfo: {},
        sort: [{
            txt: '新享',
            type: 1
        }, {
            txt: '新槽',
            type: 2
        }, {
            txt: '热享',
            type: 3
        }, {
            txt: '热槽',
            type: 4
        }, {
            txt: '默认',
            type: 0
        }],
        curSort: 5,
        banners: [{
            url: '../../b/a/a?aid=1&type=2',
            img: '../../../assets/images/400x140.test.jpg'
        }, {
            url: '../../b/a/a?aid=1&type=2',
            img: '../../../assets/images/400x140.test.jpg'
        }],
        mine: [{
            url: '../../u/f/f?type=favorite',
            img: '../../../assets/images/gameed.png',
            word: '我的收藏'
        }, {
            url: '../../b/i/i?tab=time&from=myc',
            img: '../../../assets/images/icons/share.png',
            word: '我的评论'
        }, {
            url: '../../b/i/i?tab=time&from=cme',
            img: '../../../assets/images/icons/comment.png',
            word: '评论我的'
        }]
    },
    onLoad() {
        app.register('bz', app);
        this.setData({
            showFinger: !app.local.getSync('rt_finger_showed')
        });
        app.getWxUserInfo(res => {
            this.setData({
                userInfo: res
            });
        });
        this.getData();
    },
    onShow() {
        if (app.cache.back_index_show_mine) {
            this.showMine();
            app.removeCache('back_index_show_mine');
        }
    },
    getData(sort) {
        !this.data.isLoading && this.setData({
            isLoading: true
        });
        app.httpService.getIndexArticles(this.data.offset)
        .then(data => {
            app.util.getSharesCb(this, data);
        }, () => {
            this.setData({
                isNetError: true
            });
        });
    },
    nextLoad(sort) {
        this.data.hasNextPage = false;
        app.httpService.getIndexArticles(this.data.offset)
        .then(data => {
            app.util.nextSharesCb(this, data);
        }, () => {
            this.setData({
                hasNextPage: false
            });
        });
    },
    onShareAppMessage() {
        let title = `${(app._user && app._user.nickName || 'GameGuy')} 邀你加入GG游戏圈，我也在，所以更懂你`;
        return app.util.getShareParams(`/pages/b/z/z`, title);
    }
});