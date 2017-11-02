import Local from 'utils/local';
import Util from 'utils/util';
import Events from 'utils/events';
import _ from 'utils/underscore';
import wxService from 'utils/wxService';
import httpService from 'utils/httpService';

App({
    version: 'v0.0.0',
    onLaunch() {
        //读取缓存
        let data = this.local.infoSync();
        if (data && data.keys.length) {
            data.keys.forEach((key) => {
                let value = this.local.getSync(key);
                if (value) this.cache[key] = value;
            });
            if (this.cache.version !== this.version) {
                this.cache = {};
                this.local.clearSync();
                this.local.set('version', this.version);
            }
            this.session_token = this.cache.session_token;
            this._user = this.cache.ggInfo;

            if (this.session_token) {
                this.wxService.checkSession()
                .then(() => {
                    console.log('checkSession success');
                },
                () => {
                    this.getUserInfo();
                });
            } else {
                this.getUserInfo();
            }
        } else {
            this.local.set('version', this.version);
            this.getUserInfo();
        }
    },
    getUserInfo(scb, ecb) {
        this.wxService.login()
        .then(res => {
            return this.httpService.postUserLogin(res.code)       
        })
        .then(data => {
            if (data.code == 0) {
                let user = data.result || {};
                this.session_token = user.sessionToken;
                this.local.set('session_token', user.sessionToken);
                this._user = user;

                if (user.avatarUrl) {
                    this.getWxInfo(user);
                } else {
                    this.getWxInfo();
                }

                typeof scb === 'function' && scb();
            } else {
                typeof ecb === 'function' && ecb();
            }
        }, () => {
            typeof ecb === 'function' && ecb();
        });
    },
    // 调用 wx.getUserInfo 以及请求后端用户信息
    getWxInfo(user, scb, ecb) {
        let _this = this;

        this.wxService.getUserInfo()
        .then((res) => {
            // 发请求
            let { nickName, gender, language, city, province, country, avatarUrl } = res.userInfo;
            
            let userParams = { nickName, gender, language, city, province, country, avatarUrl };

            let gginfo = user || _this._user || {};
            _.extend(gginfo, userParams);
            _this._user = gginfo;
            _this.local.set('ggInfo', gginfo);

            typeof scb === 'function' && scb(gginfo);

            if (!user) {
                let params = {
                    encryptedData: res.encryptedData,
                    iv: res.iv
                }
                this.httpService.postUserInfo(params);
            }
        }, () => {
            typeof ecb === 'function' && ecb();
        });
    },
    // 首页获取用户信息
    getWxUserInfo(cb) {
        if (this._user) {
            typeof cb === 'function' && cb(this._user);
        } else {
            this.getWxInfo(0, cb);
        }
    },
    // 更新个人信息
    updateWxInfo(cb) {
        this.getWxInfo(0, (res) => {
            typeof cb === 'function' && cb(res);
        }, () => {
            wx.openSetting()
            .then(res => {
                this.getWxInfo(0, cb);
            });
        });
    },
    // 提示登录后事件处理
    loginTo(obj, cb) {
        if (this.session_token) {
            if (cb && typeof cb == "string") {
                this.util.loadpage('new', cb);
            } else {
                typeof cb == "function" && cb();
            }
        } else {
            let str = '未登录或登录失效，请重新登录';
            this.util.showModal(str, 0, '', '知道了', () => {
                this.getUserInfo(() => {
                    this.util.showOkToast('登录成功');
                }, () => {
                    this.util.showTipToast('登录失败，请稍后重试');
                });
            });
        }
    },
    //设置全局缓存
    setCache(key, value) {
        if (!key || !value) return;
        this.cache[key] = value;
    },
    //清除全局缓存
    removeCache(...keys) {
        if (!keys) return;
        let _this = this;
        keys.forEach((key) => {
            _this.cache[key] = '';
        });
    },
    register: new Events().register,
    local: new Local,
    util: new Util,
    wxService: new wxService,
    httpService: new httpService,
    cache: {},
    ggPages: [],
    session_token: null,
    _user: null
});