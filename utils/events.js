import Local from 'local';
import Util from 'util';
import _ from 'underscore';

const local = new Local;
const _util = new Util;

// 页面注册事件
const pageEvent = {
    bz: ['toDetail', 'topBallTap', 'scroll', 'sortBallTap', 'searchInput', 'editBallTap', 'lower', 'reload', 'userHeadTap', 'bannerTap', 'searchTap', 'goWe', 'wxLogin', 'updateWxInfo', 'myBtnTap', 'myS', 'rtFinger', 'showMine', 'touchSP', 'touchSU', 'touchMU', 'touchMU', 'touchEU', 'touchCU'],
    bs: ['toDetail', 'topBallTap', 'lower', 'reload', 'searchInput', 'userHeadTap', 'searchTap', 'searchFocus', 'clearRecents', 'deleteRecent', 'recentSearch', 'closeRecent'],
    bg: ['toDetail', 'topBallTap', 'sortBallTap', 'lower', 'reload', 'userHeadTap', 'rankTap', 'bannerTap'],
    ug: ['toDetail', 'topBallTap', 'scroll', 'lower', 'reload', 'goWe', 'guyS'],
    uf: ['toDetail', 'topBallTap', 'scroll', 'touchS', 'touchM', 'reload', 'lower', 'editBallTap'],
    bc: ['reload', 'oneTap', 'circleTap', 'goWe'],
    bi: ['reload', 'rUserTap', 'topBallTap', 'userHeadTap', 'previewImg', 'replyComment', 'toShare'],
    ba: ['reload', 'rUserTap', 'previewImg', 'writeComment', 'replyComment', 'moreComments', 'showGuide', 'hideGuide', 'touchMS', 'touchSS'],
    gw: ['reload'],
    gr: ['userHeadTap'],
    be: ['navBack', 'entryCtnt']
};

class Events {
    constructor() {

    }
    // 页面注册事件函数
    register(pageName, app) {
        let pages = getCurrentPages(),
            page = pages[pages.length - 1],
            events = pageEvent[pageName];
        // 初始默认加载状态
        page.setData({
            isLoading: true
        });
        // tabbar页面强制navigateTo跳转
        if (pageName == 'bz' || pageName == 'bc' || pageName == 'gr') {
            page.data.isTabPage = true;
        }
        // 当前页面是否是页面栈第一个
        page.setData({
            isFirstQ: (pages.length <= 1)
        });
        // 判断是否有return_to url,加入自定义页面站栈
        let ggPages = app.ggPages,
            gLen = ggPages.length;
        if (page.query && page.query.r_b) {
            for (let i = gLen - 1; i >= 0; i--) {
                let r_url = ggPages[i],
                    r_route = r_url.split('?')[0];
                if (r_url) {
                    if (r_route != page.__route__) {
                        r_url = r_url.replace(/^pages\//, '../../');
                        page.setData({
                            return_to: r_url
                        });
                        break;
                    } else {
                        ggPages[i] = 0;
                    }
                }
            }
        }
        app.ggPages = _.compact(ggPages);

        events.forEach((event) => {
            switch (event) {
                case 'touchS':
                    page[event] = (e) => {
                        _util.touchstart(page, e);
                    };
                    break;
                case 'touchM':
                    page[event] = (e) => {
                        _util.touchmove(page, e);
                    }
                    break;
                case 'toDetail':
                    page[event] = (e) => {
                        let aid = e.currentTarget.dataset.aid,
                            type = e.currentTarget.dataset.type;
                        if (page.data.isTabPage) {
                            _util.loadpage('new', '../../b/a/a', {
                                aid: aid,
                                type: type
                            });
                        } else {
                            _util.rLoadPage('../../b/a/a', {
                                aid: aid,
                                type: type
                            }, app);
                        }
                    }
                    break;
                case 'topBallTap':
                    page[event] = () => {
                        page.setData({
                            scrollTop: 0
                        });
                    }
                    break;
                case 'sortBallTap':
                    page[event] = (e) => {
                        let index = e.currentTarget.dataset.index,
                            type = e.currentTarget.dataset.type,
                            d = page.data.sort.length - 1;
                        if (index == d) {
                            page.setData({
                                showSort: !page.data.showSort
                            });
                        } else {
                            let tmp = page.data.sort[d];
                            page.data.sort[d] = page.data.sort[index];
                            page.data.sort[index] = tmp;
                            page.setData({
                                sort: page.data.sort,
                                showSort: false
                            });

                            page.data.curSort = page.data.sort[d].type;
                        }
                    }
                    break;
                case 'toShare':
                    page[event] = (e) => {
                        _util.rLoadpage('../../b/a/a', {
                            aid: e.currentTarget.dataset.aid,
                            type: e.currentTarget.dataset.type
                        }, app);
                    }
                    break;
                case 'scroll':
                    page[event] = (e) => {
                        _util.onScroll(e, page);
                    }
                    break;
                case 'lower':
                    page[event] = () => {
                        if (page.data.hasNextPage) {
                            page.nextLoad();
                        }
                    }
                    break;
                case 'reload':
                    page[event] = () => {
                        page.data.isNetError && page.setData({
                            isNetError: false
                        });
                        page.getData();
                    }
                    break;
                case 'editBallTap':
                    page[event] = () => {
                        page.setData({
                            showRecent: false
                        });
                        _util.loadpage('new', '../../g/w/w?type=create');
                    }
                    break;
                case 'userHeadTap':
                    page[event] = (e) => {
                        let ggid = e.currentTarget.dataset.ggid;
                        let userid = app._user && app._user.id;
                        if (ggid == userid) {
                            if (page.data.isTabPage) {
                                page.showMine();
                            } else {
                                app.setCache('back_index_show_mine', true);
                                _util.loadpage('tab', '../../b/z/z');
                            }
                        } else {
                            if (page.data.isTabPage) {
                                _util.loadpage('new', '../../u/g/g', {
                                    ggid: ggid
                                });
                            } else {
                                _util.rLoadpage('../../u/g/g', {
                                    ggid: ggid
                                }, app);
                            }
                        }
                    }
                    break;
                case 'touchCU':
                    page[event] = (e) => {
                        page.setData({
                            showMe: true,
                            showP: true
                        });
                    }
                    break;
                case 'touchEU':
                    page[event] = (e) => {
                        let startX_u = page.data.startX_u,
                            startY_u = page.data.startY_u,
                            touchMoveX = e.changedTouches[0].clientX,
                            touchMoveY = e.changedTouches[0].clientY,
                            deltaX = touchMoveX - startX_u,
                            deltaY = touchMoveY - startY_u;
                        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                            if (touchMoveX <= startX_u) {
                                page.setData({
                                    showMe: false
                                });
                                setTimeout(() => {
                                    page.setData({
                                        showP: false
                                    });
                                }, 400);
                            } else {
                                page.setData({
                                    showMe: true,
                                    showP: true
                                });
                            }
                        }
                    }
                    break;
                case 'touchSU':
                    page[event] = (e) => {
                        page.setData({
                            startX_u: e.changedTouches[0].clientX,
                            startY_u: e.changedTouches[0].clientY,
                            showSort: false
                        });
                    }
                    break;
                case 'touchSP':
                    page[event] = (e) => {
                        page.setData({
                            showMe: false
                        });
                        setTimeout(() => {
                            page.setData({
                                showP: false
                            });
                        }, 400);
                    }
                    break;
                case 'showMine':
                    page[event] = () => {
                        page.setData({
                            showMe: true,
                            showP: true
                        });
                    }
                    break;
                case 'circleTap':
                    page[event] = (e) => {
                        let index = e.currentTarget.dataset.index;
                        page.data.shareObj.share.forEach((v, i) => {
                            if (v.isTouchMoved) v.isTouchMoved = false;
                        });
                        page.data.shareObj.share[index].isTouchMoved = true;
                        page.setData({
                            shareObj: page.data.shareObj
                        });
                        _util.loadpage('new', '../../b/g/g', {
                            gid: e.currentTarget.dataset.gid
                        });
                    }
                    break;
                case 'goWe':
                    page[event] = (e) => {
                        _util.loadpage('new', '../../g/w/w?type=' + e.currentTarget.dataset.type);
                    }
                    break;
                case 'rtFinger':
                    page[event] = () => {
                        let str = '点击右上角，选择“显示在聊天顶部”或者“添加到桌面”，无需下载，分享吐槽更快捷';
                        _util.showModal(str, false, '', '知道了', () => {
                            page.setData({
                                showFinger: false
                            });
                            local.set('rt_finger_showed', true);
                        });
                    }
                    break;
                case 'updateWxInfo':
                    page[event] = () => {
                        let str = '同步最新微信头像和昵称？';
                        _util.showModal(str, true, '取消', '确定', () => {
                            app.updateWxInfo((res) => {
                                page.setData({
                                    userInfo: res
                                });
                            });
                        });
                    }
                    break;
                case 'wxLogin':
                    page[event] = () => {
                        app.updateWxInfo((res) => {
                            page.setData({
                                userInfo: res
                            });
                        });
                    }
                    break;
                case 'myBtnTap':
                    page[event] = (e) => {
                        app.loginTo(page, e.currentTarget.dataset.url);
                    }
                    break;
                case 'myS':
                    page[event] = () => {
                        _util.loadpage('new', '../../u/f/f?type=shares');
                    }
                    break;
                case 'guyS':
                    page[event] = () => {
                        page.setData({
                            scrollTop: 140
                        });
                    }
                    break;
                case 'bannerTap':
                    page[event] = (e) => {
                        let url = e.currentTarget.dataset.url;
                        if (url) {
                            if (page.data.isTabPage) {
                                _util.loadpage('new', url);
                            } else {
                                _util.rLoadPage(url, '', app);
                            }
                        }
                    }
                    break;
                case 'closeRecent':
                    page[event] = () => {
                        page.setData({
                            showRecent: false
                        });
                    }
                    break;
                case 'searchInput':
                    page[event] = (e) => {
                        page.data.searchValue = e.detail.value;
                    }
                    break;
                case 'searchTap':
                    page[event] = () => {
                        let value = page.data.searchValue || '';
                        if (value.trim() != '') {
                            let recents = local.getSync('recent_searchs') || [];
                            _.filter(recents, (item, index) => {
                                if (item == value) {
                                    recents[index] = 0;
                                }
                            });
                            recents = _.compact(recents);
                            recents.unshift(value);
                            if (recents.length > 10) {
                                recents.splice(0, 10);
                            }
                            local.set('recent_searchs', recents);

                            if (page.data.isTabPage) {
                                page.setData({
                                    searchValue: ''
                                });
                                _util.loadpage('new', `../../b/s/s?value=${value}`);
                            } else {
                                page.setData({
                                    showRecent: false
                                });
                                page.getData();
                            }
                        } else {
                            _util.showTipToast('请输入关键词');
                        }
                    }
                    break;
                case 'searchFocus':
                    page[event] = () => {
                        let recents = local.getSync('recent_searchs') || [];
                        page.setData({
                            showRecent: true,
                            recents: recents
                        });
                    }
                    break;
                case 'clearRecents':
                    page[event] = () => {
                        page.setData({
                            recents: []
                        });
                        local.removeSync('recent_searchs');
                    }
                    break;
                case 'deleteRecent':
                    page[event] = (e) => {
                        page.setData({
                            showRecent: true
                        });
                        let index = e.currentTarget.dataset.index;
                        let recents = page.data.recents;
                        recents.splice(index, 1);
                        page.setData({
                            recents: recents
                        });
                        local.set('recent_searchs', recents);
                    }
                    break;
                case 'recentSearch':
                    page[event] = (e) => {
                        page.setData({
                            searchValue: e.currentTarget.dataset.v
                        });
                        page.setData({
                            showRecent: false
                        });
                        page.searchTap();
                    }
                    break;
                case 'rankTap':
                    page[event] = (e) => {
                        let circleId = page.query.gid || e.currentTarget.dataset.gid || 'default';
                        app.setCache('cur_rank_cirlce_id', circleId);
                        _util.loadpage('tab', '../../g/r/r');
                    }
                    break;
                case 'previewImg':
                    page[event] = (e) => {
                        _util.doPreviewImage(e);
                    }
                    break;
                case 'navBack':
                    page[event] = () => {
                        _util.showModal('退出此次编辑？', true, '否', '是', () => {
                            _util.loadpage('back');
                        });
                    }
                    break;
                case 'entryCtnt':
                    page[event] = (e) => {
                        page.setData({
                            textContent: e.detail.value
                        });
                    }
                    break;
                case 'rUserTap':
                    page[event] = (e) => {
                        _util.rLoadPage('../../u/g/g', {
                            ggid: e.currentTarget.dataset.ggid
                        }, app);
                    }
                    break;
                case 'writeComment':
                    page[event] = (e) => {
                        app.loginTo(page, `../../b/e/e?type=0&from=0&aid=${page.query.aid}`);
                    }
                    break;
                case 'replyComment':
                    page[event] = (e) => {
                        let from = page.data.detail ? '0' : '1';
                        let reply_param = {
                            reply_user_id: e.currentTarget.dataset.ggid,
                            reply_nick_name: e.currentTarget.dataset.ggname,
                            reply_content: e.currentTarget.dataset.ctnt
                        };
                        app.setCache('current_reply_param', reply_param);
                        app.loginTo(page, `../../b/e/e?type=1&from=${from}&aid=${page.query.aid}&cid=${e.currentTarget.dataset.cid}`);
                    }
                    break;
                case 'moreComments':
                    page[event] = (e) => {
                        _util.rLoadPage('../../b/i/i', {
                            from: 'aid',
                            tab: e.currentTarget.dataset.tab,
                            aid: page.query.aid
                        }, app);
                    }
                    break;
                case 'showGuide':
                    page[event] = () => {
                        page.setData({
                            hideInvite: true
                        });
                        if (page.data.canShare) return;
                        page.setData({
                            showGuide: true
                        });
                        clearTimeout(page.data.guideTimer);
                        page.data.guideTimer = setTimeout(() => {
                            page.setData({
                                showGuide: false
                            });
                        }, 1200);
                    }
                    break;
                case 'hideGuide':
                    page[event] = () => {
                        clearTimeout(page.data.guideTimer);
                        page.setData({
                            showGuide: false
                        });
                    }
                    break;
                case 'touchMS':
                    page[event] = (e) => {
                        let startX_s = page.data.startX_s,
                            startY_s = page.data.startY_s,
                            touchMoveX = e.changedTouches[0].clientX,
                            touchMoveY = e.changedTouches[0].clientY,
                            angle = _util.angle({
                                X: startX_s,
                                Y: startY_s
                            }, {
                                X: touchMoveX,
                                Y: touchMoveY
                            });

                        if (Math.abs(angle) > 40) return;
                        if (touchMoveX > startX_s) {
                            page.setData({
                                hideInvite: true
                            });
                        } else {
                            page.setData({
                                hideInvite: false
                            });
                        }
                    }
                    break;
                case 'touchSS':
                    page[event] = (e) => {
                        page.setData({
                            startX_s: e.changedTouches[0].clientX,
                            startY_s: e.changedTouches[0].clientY
                        });
                    }
                    break;
                default:
                    break;
            }
        });
    }
}

export default Events