let app = getApp();

Page({
    data: {
        slogenInfo: '',
        stateInfo: []
    },
    onLoad(query) {
        this.query = query;
        app.register('gw', app);
        let barTitle = query.type == 'score' ? '声望' : (query.type == 'contact' ? '联系我们' : (query.type == 'create' ? '分享吐槽' : 'GG'));
        app.util.setPageTitle(barTitle);
        this.getData();
    },
    getData() {
        let _this = this,
            stateInfo;
        app.util.getWeInfo(data => {
            data.slogenInfo && _this.setData({
                slogenInfo: data.slogenInfo
            });
            switch (_this.query.type) {
                case 'score':
                    stateInfo = data.scoreInfo;
                    break;
                case 'contact':
                    stateInfo = data.contactInfo;
                    break;
                case 'create':
                    stateInfo = data.createInfo;
                    break;
                default:
                    stateInfo = data.contactInfo;
                    break;
            }
            _this.setData({
                stateInfo: stateInfo
            });
        });
    }
});