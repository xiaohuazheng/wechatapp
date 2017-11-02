import _ from '../../../utils/underscore';
let app = getApp();

Page({
    data: {
        ranks: {},
        rankItem: [{
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "hua",
            "articleCount": 0,
            "commentCount": 1,
            "scoreCount": 1123
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "hua",
            "articleCount": 10,
            "commentCount": 11,
            "scoreCount": 1023
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 923
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "hua",
            "articleCount": 0,
            "commentCount": 1,
            "scoreCount": 823
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "hua",
            "articleCount": 10,
            "commentCount": 11,
            "scoreCount": 723
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 623
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "hua",
            "articleCount": 0,
            "commentCount": 1,
            "scoreCount": 523
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "hua",
            "articleCount": 10,
            "commentCount": 11,
            "scoreCount": 423
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }, {
            "userId": "02da191f-7f70-4d86-92d0-49750cc9a320",
            "picUrl": "../../../assets/images/loved.png",
            "nickName": "老坛酸菜牛肉面",
            "articleCount": 110,
            "commentCount": 11,
            "scoreCount": 323
        }],
        circles: [],
        windowWidth: 375,
        navIdxs: [],
        scrollLeft: 0,
        curCircleIdx: 0,
        curCircleId: 0,
        sTouchs: {
            x: 0,
            y: 0
        }
    },
    onLoad() {
        app.register('gr', app);
        this.data.windowWidth = app.util.getSystemInfo().windowWidth;
    },
    onShow() {
        this.getData();
    },
    getData() {
        let _this = this;
        if (_this.data.navIdxs.length) {
            _this.getCurRankId();
        } else {
            app.util.getCirclesInfo(data => {
                let circles = _this.data.circles.concat(data);
                _this.setData({
                    circles: circles
                });
                _this.data.navIdxs = Array.from(Array(circles.length).keys());
                _this.getCurRankId();
            });
        }
        _this.getCurRankId();
        _this.data.navIdxs = Array.from(Array(_this.data.circles.length).keys());
    },
    getCurRankId() {
        let circleId = app.cache.cur_rank_cirlce_id || 'default';
        let circleIdx = _.findIndex(this.data.circles, (item) => {
            return item.id == circleId;
        });
        this.switchChannel(circleIdx, circleId, true);
    },
    reload() {
        this.getRankData(this.data.curCircleId);
    },
    getRankData(circleId, cb) {
        let _this = this;
        !_this.data.isLoading && _this.setData({
            isLoading: true
        });
        // 请求
        // let rankItem = app.util.getRankData(circleId);
        // _this.data.ranks[_this.data.curCircleIdx] = rankItem.data;
        // _this.setData({
        //     rankItem: rankItem.data
        // });
    },
    onShareAppMessage() {
        let title = `${(app._user && app._user.nickName || 'GameGuy')} 邀你一起共登琅琊，一览Game Guys and Girls风雨云晴`;
        return app.util.getShareParams(`/pages/b/z/z`, title);
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
    selectCricle(e) {
        let target_index = parseInt(e.currentTarget.id),
            curCircleIdx = this.data.curCircleIdx,
            navIdxsLen = this.data.navIdxs.length,
            scrollLeft;
        if (this.data.circles[target_index].activeCls != '') {
            return;
        }
        this.setScrollLeft(target_index, navIdxsLen - 1, navIdxsLen);
        this.hideCirclesPop();
        this.switchChannel(target_index);
    },
    switchChannel(targetCircleIdx, targetCircleId, first) {
        let _this = this;
        let circles = this.data.circles;
        let navIdxsLen = this.data.navIdxs.length;
        let circleId = 'default';
        circles.forEach((item, index, array) => {
            if (targetCircleId && targetCircleId == item.id) {
                targetCircleIdx = index;
            }
            item.activeCls = '';
            if (index == targetCircleIdx) {
                circleId = item.id;
                item.activeCls = 'navbar-item-active';
            }
        });
        if (targetCircleId) {
            this.setScrollLeft(targetCircleIdx, navIdxsLen - 1, navIdxsLen);
        }

        app.setCache('cur_rank_cirlce_id', circleId);
        this.setData({
            circles: circles,
            curCircleIdx: targetCircleIdx,
            curCircleId: circleId
        });
        // 如果已经请求过则直接展示
        if (_this.data.ranks[targetCircleIdx]) {
            _this.setData({
                rankItem: _this.data.ranks[targetCircleIdx]
            });
            return;
        }
        // 否则置空当前排名，发送请求
        _this.setData({
            rankItem: []
        });
        setTimeout(() => {
            _this.getRankData(circleId);
        }, 600);

    },
    onTouchS(e) {
        this.hideCirclesPop();
        this.setData({
            'sTouchs.x': e.changedTouches[0].clientX,
            'sTouchs.y': e.changedTouches[0].clientY
        });
    },
    onTouchE(e) {
        let _this = this,
            deltaX = e.changedTouches[0].clientX - this.data.sTouchs.x,
            deltaY = e.changedTouches[0].clientY - this.data.sTouchs.y;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
            let deltaNavIdx = deltaX > 0 ? -1 : 1,
                scroll_from = deltaX > 0 ? 1 : 0,
                curCircleIdx = this.data.curCircleIdx,
                navIdxs = this.data.navIdxs,
                tarCircleOfnavIdxs = navIdxs.indexOf(curCircleIdx) + deltaNavIdx,
                navIdxsLen = navIdxs.length;

            if (tarCircleOfnavIdxs >= 0 && tarCircleOfnavIdxs <= navIdxsLen - 1) {
                _this.setData({
                    scroll_from: scroll_from
                });
                if (navIdxsLen > 3) {
                    this.setScrollLeft(tarCircleOfnavIdxs, navIdxsLen, navIdxsLen);
                }
                this.switchChannel(navIdxs[tarCircleOfnavIdxs]);
            }
            this.data.arrow_up && this.hideCirclesPop();
        }
    },
    setScrollLeft(target_index, lastIdx, navIdxsLen) {
        let scrollLeft;
        if (target_index < 3) {
            scrollLeft = 0;
        } else if (target_index === lastIdx) {
            scrollLeft = this.rpx2px(190 * (navIdxsLen - 3));
        } else {
            scrollLeft = this.rpx2px(190 * (target_index - 2));
        }
        this.setData({
            scrollLeft: scrollLeft
        });
    },
    rpx2px(rpx) {
        return this.data.windowWidth * rpx / 750;
    },
    toggleNav() {
        if (!this.data.arrow_up) {
            this.showCirclesPop();
        } else {
            this.hideCirclesPop();
        }
    },
    showCirclesPop() {
        this.setData({
            arrow_up: 'true',
            show_cls: 'show'
        });
    },
    hideCirclesPop() {
        this.setData({
            arrow_up: '',
            show_cls: ''
        });
    }
});