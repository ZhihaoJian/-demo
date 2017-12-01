// pages/movies/more-movies/more-movies.js
const app = getApp();
const util = require('../../../utils/util.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies: [],
        dataUrl: "",
        totalCount: 0,
        isEmpty: true
    },

    onPullDownRefresh: function (e) {
        let nextUrl = `${this.data.dataUrl}?start=0&count=20`;
        wx.showNavigationBarLoading();

        //下拉刷新制空参数
        this.data.movies = [];
        this.data.isEmpty = true;

        util.http(nextUrl, this.processDoubanData);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let category = options.category;
        this.data.category = category;

        let doubanBase = app.globalData.doubanBase;
        let dataUrl = "";

        switch (category) {
            case "正在热映":
                dataUrl = `${doubanBase}/v2/movie/in_theaters`;
                break;
            case "即将上映":
                dataUrl = `${doubanBase}/v2/movie/coming_soon`
                break;
            case "Top250":
                dataUrl = `${doubanBase}/v2/movie/top250`
                break;
        }

        //缓存当前url,以便滚动加载和下拉刷新
        this.data.dataUrl = dataUrl;


        util.http(dataUrl, this.processDoubanData);

    },

    /**
     * 处理豆瓣加载的数据
     */
    processDoubanData: function (moviesDouban) {
        let movies = [];
        for (let idx in moviesDouban.subjects) {
            let subject = moviesDouban.subjects[idx];
            let title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }
            //[1,1,1,1]  [1,1,1,0,0]
            let temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                stars: util.coverToStarArray(subject.rating.stars)
            }
            movies.push(temp);
        }


        let totalMovies = {};


        //绑定且填充滚动加载数据 
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }

        this.setData({
            movies: totalMovies
        });

        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.data.totalCount += 20;

    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.setNavigationBarTitle({
            title: this.data.category
        })
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
     * 滚动加载更多
     */
    onScrollLower: function (e) {
        let nextUrl = `${this.data.dataUrl}?start=${this.data.totalCount}&count=20`;
        wx.showNavigationBarLoading();
        util.http(nextUrl, this.processDoubanData);
    },
    /**
     * 新版本下拉刷新
     */
    onReachBottom: function (event) {
        let nextUrl = this.data.requestUrl +
            "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },

    onMovieTap: function (e) {
        let moveid = e.currentTarget.dataset.moveid;

        wx.navigateTo({
            url: `movie-detail/movie-detail?id=${moveid}`,
        })
    }
})