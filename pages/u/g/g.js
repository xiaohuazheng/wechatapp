let app = getApp();

Page({
    data: {
        ggInfo: {
            id: '1',
            avatar: 'http://wx.qlogo.cn/mmopen/vi_32/4IibMeaXCJiaRTHthwHQGKibwJP0eWOKUIymibUhZgsILacRLibNlFueWHEnKTvFLdxbuTbibMhKKsZnoIjEOfzyxf8g/0',
            nickName: '西门吹雪',
            article_count: 123,
            score: 999
        },
        offset: 0,
        shareObj: {
            share: []
        }
    },
    onLoad(query) {
        this.query = query;
        app.register('ug', app);
        this.getData();
    },
    onShareAppMessage() {
        let title = `${(app._user && app._user.nickName || 'GameGuy')} 邀你一起阅读 ${this.data.ggInfo.nickName || '他'} 的故事`;
        return app.util.getShareParams(`/pages/u/g/g?ggid=${this.query.ggid}`, title);
    },
    getData() {
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
    nextLoad() {
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
    userHeadTap(e) {
        return;
    }
});