let app = getApp();

Page({
    data: {
        offset: 0,
        shareObj: {
            share: []
        }
    },
    onLoad(query) {
        this.query = query;
        app.register('bs', app);
        this.setData({
            searchValue: query.value
        });
        this.getData();
    },
    getData() {
        this.setData({
            'shareObj.share': []
        });
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
    scroll(e) {
        app.util.onScroll(e, this);
        this.setData({
            showRecent: false
        });
    },
});