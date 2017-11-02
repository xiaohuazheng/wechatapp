/*
 *   本地存储，cookie
 */

class Local {
    constructor() {

    }
    /**
     * getStorage
     * @param  {String} key
     * @param  {function} cb
     */
    get(key, cb) {
        wx.getStorage({
            key: key,
            success(res) {
                typeof cb === 'function' && cb(res);
            }
        });
    }
    /**
     * getStorageSync
     * @param  {String} key
     * @return {object}
     */
    getSync(key) {
        try {
            let res = wx.getStorageSync(key);
            if (res) return res;
        } catch (e) {}
        return null;
    }
    /**
     * getStorage
     * @param  {String} key
     * @param  {object} value
     * @param  {function} cb
     */
    set(key, value, cb) {
        if (!key || !value) return;
        wx.setStorage({
            key: key,
            data: value,
            success() {
                typeof cb === 'function' && cb();
            }
        });
    }
    /**
     * setStorageSync
     * @param  {String} key
     * @return {object} value
     */
    setSync(key, value) {
        if (!key || !value) return;
        try {
            wx.setStorageSync(key, value);
        } catch (e) {}
    }
    /**
     * getStorageInfo
     * @param  {function} cb
     */
    info(cb) {
        wx.getStorageInfo({
            success(res) {
                typeof cb === 'function' && cb(res);
            }
        });
    }
    /**
     * setStorageSync
     * @return {object} 
     */
    infoSync() {
        try {
            let res = wx.getStorageInfoSync();
            if (res) return res;
        } catch (e) {}
        return null;
    }
    /**
     * removeStorage
     * @param  {String} key
     * @param  {object} cb
     */
    remove(key, cb) {
        wx.removeStorage({
            key: key,
            success() {
                typeof cb === 'function' && cb();
            }
        });
    }
    /**
     * removeStorageSync
     * @param  {String} key
     */
    removeSync(key) {
        try {
            wx.removeStorageSync(key);
        } catch (e) {}
    }
    /**
     * clearStorage
     */
    clear() {
        wx.clearStorage();
    }
    /**
     * clearStorageSync
     */
    clearSync() {
        try {
            wx.clearStorageSync();
        } catch (e) {}
    }
    /**
     * _get
     */
    _get() {
        return this.getSync('gg_cookie_key') || {};
    }
    /**
     * _set
     * @param {String} value
     */
    _set(value) {
        this.setSync('gg_cookie_key', value);
    }
    /**
     * getCookie
     * @param {String} key
     */
    getCookie(key) {
        let obj = this._get()[key];
        if (obj && obj.expires) {
            let time = +new Date();
            if (obj.expires >= time) {
                return obj.value
            }
            this.removeCookie(key)
        }
        return null;
    }
    /**
     * setCookie
     * @param  {String} key
     * @param  {object} value
     * @param  {number} expires 过期天数 默认1h
     */
    setCookie(key, value, expires) {
        let cookie = this._get();
        expires = +new Date() + ((expires || 1) * 60 * 60 * 1000);
        cookie[key] = {
            value: value,
            expires: expires
        };
        this._set(cookie);
    }
    /**
     * removeCookie
     * @param {String} key
     */
    removeCookie(key) {
        let cookie = this._get();
        delete cookie[key];
        this._set(cookie);
    }
}

export default Local