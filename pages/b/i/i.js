import _ from '../../../utils/underscore';
let app = getApp();

Page({
    data: {
        navTab: ["最新", "最热"],
        curTab: 0,
        hotC: {
            comment: [],
            offset: 0
        },
        newC: {
            comment: [],
            offset: 0
        },
        curC: {
            comment: []
        },
        sTouchs: {
            x: 0,
            y: 0
        },
        scrollTop: 0,
        hotTop: 0,
        newTop: 0,
        page_type: {
            myc: 'getUComments',
            cme: 'getUCommenteds',
            aid: 'getAComments'
        },
        barTitle: {
            myc: '我的评论',
            cme: '评论我的',
            aid: '评论'
        }
    },
    onLoad(query) {
        this.query = query;
        app.register('bi', app);

        if (query.tab == 'hot') {
            this.setData({
                curTab: 1
            });
        }

        app.util.setPageTitle(this.data.barTitle[query.from]);
        this.setData({
            'curC.page_type': this.data.page_type[query.from]
        });
    },
    onShow() {
        this.getData();
    },
    getData() {
        !this.data.isLoading && this.setData({
            isLoading: true
        });
        let page_type = this.data.page_type[this.query.from],
            sort = this.data.curTab == 1 ? 'hot' : 'time',
            offset = this.data.curTab == 1 ? this.data.hotC.offset : this.data.newC.offset,
            id = this.query.from == 'myc' ? '' : (this.query.from == 'cme' ? '' : this.query.aid);

        page_type && app.httpService[page_type](id, offset, sort)
        .then(data => {
            if (_.isArray(data)) {
                this.setData({
                    'curC.comment': app.util.parseComment(id, data)
                });
            } else if (data && data.code == 401) {
                app.getUserInfo();
            }
            app.util.setIhasNext(this, sort, data);
        }, () => {
            this.setData({
                isNetError: true
            });
        });
    },
    lower(e) {
        if ((this.data.curTab == 1 && this.data.hotC.hasNextPage) || (this.data.curTab == 0 && this.data.newC.hasNextPage)) {
            this.nextLoad();
        }
    },
    onTouchS(e) {
        this.setData({
            'sTouchs.x': e.changedTouches[0].clientX,
            'sTouchs.y': e.changedTouches[0].clientY
        });
    },
    onTouchE(e) {
        let deltaX = e.changedTouches[0].clientX - this.data.sTouchs.x;
        let deltaY = e.changedTouches[0].clientY - this.data.sTouchs.y;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
            let targetTab = this.data.curTab == 0 ? 1 : 0;
            this.switchTab(targetTab);
        }
    },
    tabBarTap(e) {
        this.switchTab(e.currentTarget.dataset.index);
    },
    switchTab(index) {
        if (index == this.data.curTab) return;
        this.setData({
            curTab: index
        });
        if (index == 1) {
            this.data.newC.comment = this.data.curC.comment;
            if (this.data.hotC.comment.length) {
                this.setData({
                    'curC.comment': this.data.hotC.comment
                });
            } else {
                this.getData();
            }
        } else {
            this.data.hotC.comment = this.data.curC.comment;
            if (this.data.newC.comment.length) {
                this.setData({
                    'curC.comment': this.data.newC.comment
                });
            } else {
                this.getData();
            }
        }
        let scrollTop = index == 1 ? this.data.hotTop : this.data.newTop;
        this.setData({
            scrollTop: scrollTop
        });
    },
    nextLoad() {
        let page_type = this.data.page_type[this.query.from],
            sort = this.data.curTab == 1 ? 'hot' : 'time',
            offset = this.data.curTab == 1 ? this.data.hotC.offset : this.data.newC.offset,
            id = this.query.from == 'myc' ? '' : (this.query.from == 'cme' ? '' : this.query.aid);
        if (sort == 'hot') {
            this.data.hotC.hasNextPage = false;
        } else {
            this.data.newC.hasNextPage = false;
        }

        page_type && app.httpService[page_type](id, offset, sort)
        .then(data => {
            let comments = app.util.parseComment(id, data);
            this.setData({
                'curC.comment': this.data.curC.comment.concat(comments)
            });
            app.util.setIhasNext(this, sort, data);
        }, () => {
            if (sort == 'hot') {
                this.setData({
                    'hotC.hasNextPage': false
                });
            } else {
                this.setData({
                    'newC.hasNextPage': false
                });
            }
        });
    },
    scroll(e) {
        app.util.onScroll(e, this);
        if (this.data.curTab == 1) {
            this.data.hotTop = e.detail.scrollTop;
        } else {
            this.data.newTop = e.detail.scrollTop;
        }
    },
    toUpvote(e) {
        let _this = this,
            index = e.currentTarget.dataset.index;
        app.loginTo(_this, () => {
            app.httpService.postLikeComment(e.currentTarget.dataset.cid)
            .then(data => {
                console.log('toUpvote ok');
            });

            _this.data.curC.comment[index].upvote_count += 1;
            _this.data.curC.comment[index].is_upvote = true;
            _this.setData({
                curC: _this.data.curC
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

            _this.data.curC.comment[index].upvote_count -= 1;
            _this.data.curC.comment[index].is_upvote = false;
            _this.setData({
                curC: _this.data.curC
            });
        });
    }
});