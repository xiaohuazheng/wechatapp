import _ from '../../../utils/underscore';
let app = getApp();

Page({
    data: {
        textContent: '',
        toneWord: []
    },
    onLoad(query) {
        this.query = query;
        app.register('be', app);

        let _this = this;
        app.util.getWeInfo(data => {
            _this.setData({
                toneWord: data.toneWord
            });
        });
    },
    onSubmit() {
        if (this.data.textContent.trim() == '') {
            app.util.showTipToast('请输入内容');
            return;
        }

        let toneWord = app.util.checkToneWord(this.data.textContent, '', this.data.toneWord);
        if (toneWord) {
            let tipWords = `评论包含敏感词“${toneWord}”，请修改`;
            app.util.showModal(tipWords, false, '', '知道了', '');
            return;
        }

        let postParams = {
            "content": this.data.textContent
        };
        if (this.query.type == 1) {
            let reply_param = app.cache.current_reply_param;
            if (reply_param) {
                _.extend(postParams, reply_param);
            }
        }

        app.httpService.postSendComment(this.query.aid, postParams)
        .then(data => {
            if (data.code == 0) {
                if (this.query.from == 0) {
                    app.util.loadpage('dir', '../../b/i/i', {
                        tab: 'time',
                        aid: this.query.aid,
                        from: 'aid'
                    });
                } else {
                    let pages = getCurrentPages(),
                        pre_page = pages[pages.length - 2];
                    pre_page.setData({
                        'newC.offset': 0,
                        curTab: 0
                    });
                    app.util.loadpage('back');
                }
            } else {
                app.util.showTipToast('系统繁忙，请稍后重试');
            }
        }, () => {
            app.util.showTipToast('系统繁忙，请稍后重试');
        });
    }
});