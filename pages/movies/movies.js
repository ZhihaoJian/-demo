const app = getApp();
const util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inTheaters: {},
        commingSoon: {},
        top250: {},
        searchResult: {},
        containerShow: true,
        searchPanel: false,
        inputValue: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let doubanBase = app.globalData.doubanBase;

        let inTheatersUrl = doubanBase + '/v2/movie/in_theaters';
        let commingSoonUrl = doubanBase + '/v2/movie/coming_soon';
        let top250Url = doubanBase + '/v2/movie/top250';

        this.getMovieListData(inTheatersUrl, "inTheaters", '正在热映');
        this.getMovieListData(commingSoonUrl, "commingSoon", '即将上映');
        this.getMovieListData(top250Url, "top250", '豆瓣TOP250');
    },

    /**
     * 获取豆瓣电影数据
     */
    getMovieListData: function (url, settedKey, cagetoryTitle) {
        wx.request({
            url: url,
            method: 'GET',
            data: {
                "count": 3
            },
            header: {
                "Content-Type": "json"
            },
            success: (res) => {
                console.log(res);
                this.processDoubanData(res.data, settedKey, cagetoryTitle)

            },
            fail: (err) => {

            },
            complete: () => {

            }
        })
    },

    /**
     * 处理豆瓣数据
     */
    processDoubanData: function (moviesDouban, settedKey, cagetoryTitle) {
        let movies = [];
        for (let idx in moviesDouban.subjects) {
            let subject = moviesDouban.subjects[idx];
            let title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }
            let temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                stars: util.convertToStarsArray(subject.rating.stars)
            }
            movies.push(temp);
        }

        let readyData = {};
        readyData[settedKey] = {
            movies: movies,
            cagetoryTitle: cagetoryTitle
        };

        this.setData(readyData);
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 点击'更多'
     */
    onMoreTap: function (e) {
        //获取当前门类
        let category = e.currentTarget.dataset.category;

        wx.navigateTo({
            url: `more-movies/more-movies?category=${category}`,
        })
    },
    // 搜索框聚焦
    onBindForcus: function (e) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },
    // 取消搜索
    onCancelTap: function (e) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult: {},
            inputValue: ""
        })
    },
    onBlur: function (e) {
        let text = e.detail.value;
        let searchUrl = `${app.globalData.doubanBase}/v2/movie/search?q=${text}`;
        this.getMovieListData(searchUrl, "searchResult", "");
    },
    onMovieTap: function (e) {
        let moveid = e.currentTarget.dataset.moveid;

        wx.navigateTo({
            url: `movie-detail/movie-detail?id=${moveid}`,
        })
    }
})