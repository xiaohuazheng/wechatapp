import _ from '../../../utils/underscore';
let app = getApp();

Page({
    data: {
        shareObj: {
            share: []
        }
    },
    onLoad() {
        app.register('bc', app);
        this.getData('new');
    },
    getData() {
        let _this = this;
        app.util.getCirclesInfo(data => {
            if (_.isArray(data) && data.length) {
                for (let i = 0; i < data.length; i++) {
                    data[i].isTouchMoved = false;
                }
                _this.setData({
                    'shareObj.share': data
                });
            }
        });
    },
    onShareAppMessage() {
        let title = `${(app._user && app._user.nickName || 'GameGuy')} 邀你加入GG游戏圈，我也在，所以更懂你`;
        return app.util.getShareParams(`/pages/b/c/c`, title);
    },
    touchS(e) {
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY
        });
    },
    touchM(e) {
        let _this = this,
            index = e.currentTarget.dataset.index,
            startX = this.data.startX,
            startY = this.data.startY,
            touchMoveX = e.changedTouches[0].clientX,
            touchMoveY = e.changedTouches[0].clientY,
            angle = app.util.angle({
                X: startX,
                Y: startY
            }, {
                X: touchMoveX,
                Y: touchMoveY
            });

        if (Math.abs(angle) > 30) return;
        if (touchMoveX > startX) {
            this.data.shareObj.share.forEach((v, i) => {
                if (v.isTouchMoved) v.isTouchMoved = false;
            });
            this.data.shareObj.share[index].isTouchMoved = true;
            this.setData({
                shareObj: this.data.shareObj
            });
        } else {
            this.data.shareObj.share[index].isTouchMoved = false;
            this.setData({
                shareObj: this.data.shareObj
            });
        }
    }
});