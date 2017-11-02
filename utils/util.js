/*
 * descri: 公用方法库
 * author: xzavier
 */
import Local from 'local';
import _ from 'underscore';
import WxService from 'wxService';
import HttpService from 'httpService';

const local = new Local;
const wxService = new WxService;
const httpService = new HttpService;

// 给对象prototype添加方法
(function() {
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };
})();

class Util {
    constructor() {

    }
    /**
     * getSystemInfo
     * @return {Object}      
     */
    getSystemInfo() {
        try {
            let system = wxService.getSystemInfoSync();
            return system || {};
        } catch (e) {}
        return {};
    }
    /**
     * 设置遮罩层，防止多点
     * @param  {Object} page 
     * @return {Booolean}      
     */
    preventEvent(page) {
        page.setData({
            prevent: true
        });
        setTimeout(() => {
            page.setData({
                prevent: false
            });
        }, 1500);
    }
    /**
     * 设置顶部标题
     * @param  {String} name 
     * @return {Booolean}      
     */
    setPageTitle(name) {
        wxService.setNavigationBarTitle({
            title: name
        });
    }
    /**
     * 自定义图片toast
     * @param  {String} str 
     * @param  {Number} duration      
     */
    showTipToast(str, duration = 1000) {
        wxService.showToast({
            title: str,
            image: '../../../assets/images/icontip.png',
            duration: duration,
            mask: true
        });
    }
    /**
     * show toast
     * @param  {String} title 
     * @param  {Number} duration      
     */
    showOkToast(title = '成功', duration = 1000) {
        wxService.showToast({
            title: title,
            icon: 'success',
            mask: true,
            duration: duration
        });
    }
    /**
     * 解析文章数据
     * @param  {Object} article 
     * @return {Object}     
     */
    parseArticleItem(article) {
        return _.each(article, (item) => {
            item.guideRead = item.guideRead + '...';
            item.create_at = this.formatTimeSpan(item.create_at);
            item.isTouchMoved = false;
            item.authorName = item.user && item.user.nick_name;
            item.authorAvatar = item.user && item.user.avatar;
            item.authorId = item.user && item.user.id;
            item.circleName = item.circle && item.circle.name || '';
        });
    } 
    /**
     * 解析图片尺寸
     * @param  {String} imgUrl 
     * @return {String}     
     */
    parseImgStyle(imgUrl) {
        let size = imgUrl.split('/'),
            imgW = parseInt(size[size.length - 1].split(".")[0].split("x")[0]),
            imgH = parseInt(size[size.length - 1].split(".")[0].split("x")[1]);

        let width, height;
        if (imgW > 340) {
            height = imgH * (340 / imgW);
            width = 340;
        } else {
            width = imgW;
            height = imgH;
        }
        let style = width > 0 ? `width: ${width * 2}rpx;height: ${height * 2}rpx;` : '';
        return style;
    }
    /**
     * 解析文章图片
     * @param  {Object} article 
     * @return {Object}     
     */
    parseArticleImg(ctnt) {
        let img = ctnt.match(/(\[img\].*?\[\/img\])+/ig) || [];
        for (let i = 0; i < img.length; i++) {
            img[i] = img[i].slice(5, img[i].length - 6);
        }

        let imgs = [];
        for (let j = 0; j < img.length; j++) {
            imgs.push({});
            imgs[j].img = img[j];
            imgs[j].style = this.parseImgStyle(img[j]);
        }
        return imgs;
    }
    /**
     * 解析文章文字内容
     * @param  {Object} article 
     * @return {Object}     
     */
    parseArticleContent(ctnt) {
        let ctnts = ctnt.split(/(\[img\].*?\[\/img\])+/ig) || [];
        let result = [];
        for (let i = 0; i < ctnts.length; i++) {
            if (ctnts[i].indexOf('[img]') === -1 && ctnts[i].indexOf('[/img]') === -1) {
                result.push(ctnts[i]);
            }
        }
        return result;
    } 
    /**
     * bindtouchstart事件，手指触摸动作开始 记录起点X坐标
     * @param  {Object} obj 
     * @param {Object} e   
     */
    touchstart(obj, e) {
        //开始触摸时 重置所有删除
        obj.data.shareObj.share.forEach((v, i) => {
            // 只操作为true的
            if (v.isTouchMoved) v.isTouchMoved = false;
        });
        obj.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            shareObj: obj.data.shareObj
        });
    }
    /**
     * 滑动事件处理
     * @param  {Object} obj 
     * @param {Object} e   
     */
    touchmove(obj, e) {
        let index = e.currentTarget.dataset.index, //当前索引
            startX = obj.data.startX, //开始X坐标
            startY = obj.data.startY, //开始Y坐标
            touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
            angle = this.angle({
                X: startX,
                Y: startY
            }, {
                X: touchMoveX,
                Y: touchMoveY
            }); //获取滑动角度

        obj.data.shareObj.share.forEach((v, i) => {
            v.isTouchMove = false;
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
                if (touchMoveX > startX) v.isTouchMoved = false; //右滑
                else v.isTouchMoved = true; //左滑 
            }
        });

        obj.setData({
            shareObj: obj.data.shareObj
        });
    }
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle(start, end) {
        let _X = end.X - start.X,
            _Y = end.Y - start.Y;
        //返回角度 Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    }
    /**
     * 解析评论内容
     * @param  {String} aid 
     * @param  {Object} comment 
     * @return {Object}     
     */
    parseComment(aid, comment) {
        return _.each(comment, (item) => {
            item.create_at = this.formatTimeSpan(item.create_at);
            item.userid = item.user && item.user.id;
            item.useravatar = item.user && item.user.avatar || '../../../assets/images/head.png';
            item.username = item.user && item.user.nick_name || '未设置用户信息';
            if (aid) {
                item.article_id = aid;
            } else {
                item.article_id = '';
            }
        });
    } 
    /**
     * 解析创建时间
     * @param  {Number} timespan 
     * @return {String}     
     */
    formatTimeSpan(timespan) {
        if (typeof(timespan) == 'string') return timespan;
        if (isNaN(timespan)) return '在此之前';

        let date = new Date(timespan),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            _minute = 1000 * 60 * 1,
            _hour = _minute * 60,
            _day = _hour * 24,
            _week = _day * 7,
            _month = _day * 30,
            _fmonth = _month * 4,
            now = new Date(),
            nowTimespan = +new Date(),
            diff = nowTimespan - timespan,
            _s = '';

        if (diff < 0) return '在此之前';

        if (diff <= _minute) {
            _s = '刚刚';
        } else if (_minute < diff && diff <= _hour) {
            _s = `${Math.round((diff / (_minute)))}分钟前`;
        } else if (_hour < diff && diff <= _day) {
            _s = `${Math.round(diff / (_hour))}小时前`;
        } else if (_day < diff && diff <= _week) {
            _s = `${Math.round(diff / (_day))}天前`;
        } else if (_week < diff && diff <= _month) {
            _s = `${Math.round(diff / (_week))}周前`;
        } else if (_month < diff && diff <= _fmonth) {
            _s = `${Math.round(diff / (_month))}月前`;
        } else if (diff > _fmonth && year == now.getFullYear()) {
            _s = `${month}月${day}日${hour}:${minute}`;
        } else {
            _s = `${year}-${month}-${day} ${hour}:${minute}`;
        }
        return _s;
    }
    /**
     * 检验敏感词
     * @param  {String} content 
     * @param  {String} title 
     * @param  {String} toneWord 
     * @return {String}     
     */
    checkToneWord(content, title, toneWord) {
        for (let i = 0; i < toneWord.length; i++) {
            if (content.indexOf(toneWord[i]) > -1 || title.indexOf(toneWord[i]) > -1) {
                return toneWord[i];
            }
        }
        return false;
    } 
    /**
     * 模态框公用
     * @param  {String} ctnt 
     * @param  {Boolean} showCancel 
     * @param  {String} cancelText
     * @param  {String} confirmText
     * @param  {Function} cb    
     */
    showModal(ctnt, showCancel, cancelText, confirmText, cb) {
        wxService.showModal({
            title: "温馨提示",
            content: ctnt,
            showCancel: showCancel,
            cancelText: cancelText || '取消',
            confirmText: confirmText || '确定'
        })
        .then(res => {
            if (res.confirm) {
                _.isFunction(cb) && cb();
            }
        });
    }
    /**
     * 获取分享参数
     * @param  {String} url 
     * @param  {String} title
     * @return {Object}     
     */
    getShareParams(url, title) {
        return {
            title: title || '我也在，所以更懂你',
            path: url
        }
    } 
    /**
     * 图片预览公用方法
     * @param  {Object} e      
     */
    doPreviewImage(e) {
        let src = e.currentTarget.dataset.src;
        if (src && src.length > 0) {
            wxService.previewImage({
                urls: [src]
            });
        }
    }
    /**
     * 公用跳转
     * @param  {String} type 
     * @param  {String} url
     * @param  {Object} data 
     */
    loadpage(type, url, data) {
        if (type == 'back') {
            wxService.navigateBack({
                delta: 1
            });
            return;
        }
        if (type == 'tab') {
            wxService.switchTab({
                url: url
            });
            return;
        }
        if (url && data) {
            url = this.buildUrl(url, data);
        }
        if (type == 'new') {
            let pages = getCurrentPages();
            let page = pages[pages.length - 1];
            this.preventEvent(page);
            wxService.navigateTo({
                url: url
            });
            return;
        }
        if (type == 'dir') {
            wxService.redirectTo({
                url: url
            });
            return;
        }
        if (type == 'rel') {
            if (wx.reLaunch) {
                wxService.reLaunch({
                    url: url
                });
            } else {
                wxService.redirectTo({
                    url: url
                });
            }
        }
    } 
    /**
     * 拼接url
     * @param  {String} url
     * @param  {Object} data 
     * @return {String} 
     */
    buildUrl(url, data) {
        if (data) {
            let param = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
            url = url.indexOf('?') > -1 ? `${url}&${param}` : `${url}?${param}`;
        }
        return url;
    } 
    /**
     * 使用redirect方法，加上return_to参数，表示返回的url
     * @param  {String} url
     * @param  {Object} params 
     * @param  {Object} app 
     */
    rLoadPage(url, params, app) {
        let pages = getCurrentPages(),
            page = pages[pages.length - 1],
            _rurl = this.buildUrl(page.__route__, page.query);
        app.ggPages.push(_rurl);
        params = params || {};
        params.r_b = 'xx';
        this.loadpage('dir', url, params);
    } 
    /**
     * 监听scroll事件 显示回顶按钮
     * @param  {Object} e 
     * @param  {Object} obj
     */
    onScroll(e, obj) {
        if (e.detail.scrollTop > 300) {
            obj.setData({
                showTopBtn: true
            });
        } else {
            obj.setData({
                showTopBtn: false
            });
        }
    }
    /**
     * 设置是否有下一页
     * @param  {Object} obj 
     * @param  {Object} data
     */ 
    setHasNextPage(obj, data) {
        if (data.length < 5) {
            obj.setData({
                hasNextPage: false
            });
        } else {
            obj.setData({
                offset: obj.data.offset + 20,
                hasNextPage: true
            });
        }
    } 
    /**
     * 设置评论页是否有下一页
     * @param  {Object} obj 
     * @param  {String} sort 
     * @param  {Object} data
     */
    setIhasNext(obj, sort, data) {
        if (data.length < 10) {
            if (sort == 'hot') {
                obj.setData({
                    'hotC.hasNextPage': false
                });
            } else {
                obj.setData({
                    'newC.hasNextPage': false
                });
            }
        } else {
            if (sort == 'hot') {
                obj.setData({
                    'hotC.hasNextPage': true,
                    'hotC.offset': obj.data.hotC.offset + 10
                });
            } else {
                obj.setData({
                    'newC.hasNextPage': true,
                    'newC.offset': obj.data.newC.offset + 10
                });
            }
        }
    }
    /**
     * 获取文章后的回调
     * @param  {Object} obj
     * @param  {Object} data
     */
    getSharesCb(obj, data) {
        if (data && _.isArray(data) && data.length) {
            obj.setData({
                'shareObj.share': this.parseArticleItem(data)
            });
            this.setHasNextPage(obj, data);
        } else {
            obj.setData({
                isNetError: true
            });
        }
    }
    /**
     * 继续加载文章后的回调
     * @param  {Object} obj  
     * @param  {Object} data
     */
    nextSharesCb(obj, data) {
        if (data && _.isArray(data)) {
            if (data.length) {
                let share_data = this.parseArticleItem(data);
                obj.setData({
                    'shareObj.share': obj.data.shareObj.share.concat(share_data)
                });
                app.util.setHasNextPage(obj, data);
            } else {
                obj.setData({
                    hasNextPage: false
                });
            }
        }
    } 
    /**
     * 获取文案信息
     * @param  {Function} scb  
     * @param  {Function} ecb
     * @param  {Function} ccb
     */
    getWeInfo(scb, ecb) {
        let weInfo = local.getCookie('local_gg_info_key');
        if (!weInfo) {
            httpService.getWeInfo()
            .then(data => {
                if (data) {
                    local.setCookie('local_gg_info_key', data);
                    _.isFunction(scb) && scb(data);
                }
            }, ecb);
        } else {
            _.isFunction(scb) && scb(weInfo);
        }
    } 
    /**
     * 获取圈子信息
     * @param  {Function} scb  
     * @param  {Function} ecb
     * @param  {Function} ccb
     */
    getCirclesInfo(scb, ecb) {
        let circles = local.getCookie('local_circles_key');
        if (!circles) {
            httpService.getCircles()
            .then(data => {
                if (_.isArray(data) && data.length) {
                    local.setCookie('local_circles_key', data);
                    _.isFunction(scb) && scb(data);
                }
            }, ecb);
        } else {
            _.isFunction(scb) && scb(circles);
        }
    }
};

export default Util
