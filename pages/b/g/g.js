import _ from '../../../utils/underscore';
let app = getApp();

Page({
    data: {
        circle: {},
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
        offset: 0,
        shareObj: {
            share: []
        },
        banner: []
    },
    onLoad(query) {
        this.query = query;
        app.register('bg', app);
        this.getData();
    },
    getData() {;
        this.getCircleData();
        this.getShareData();
    },
    getCircleData() {
        if (this.data.circle.name) return;

        let _this = this;
        app.util.getCirclesInfo(data => {
            if (_.isArray(data) && data.length) {
                let circle = _.findWhere(data, {
                    id: parseInt(_this.query.gid)
                });
                app.util.setPageTitle(circle.name);
                _this.setData({
                    circle: circle
                });
            }
        });
    },
    getShareData() {
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
    onShareAppMessage() {
        let name = this.data.circle.name,
            title = '';
        if (name == '怀旧' || name == '儿时') {
            title = `${(app._user && app._user.nickName || 'GameGuy')} 邀你一起拾起旧时光`;
        } else if (name == '游戏人生') {
            title = `${(app._user && app._user.nickName || 'GameGuy')} 邀你一起分享&吐槽游戏人生。人生何处不游戏，也曾经历，一起感悟，一起吐槽`;
        } else {
            title = `${(app._user && app._user.nickName || 'GameGuy')} 向你推荐 ${name} 游戏圈，也玩 ${name}，所以更懂你`;
        }
        return app.util.getShareParams(`/pages/b/g/g?gid=${this.data.circle.id}`, title);
    },
    scroll(e) {
        app.util.onScroll(e, this);
        this.setData({
            showSort: false
        });
    }
});