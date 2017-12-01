const postsData = require('../../../data/posts-data.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlayingMusic: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        //获取全局变量参数判断音乐播放状态
        let globalData = app.globalData;

        //获取跳转的页面id
        let postId = options.id;
        this.data.currentPostId = postId;
        //获取对应页面id的数据
        let postData = postsData.postList[postId];
        this.setData({
            postData: postData
        })

        //读取缓存判断是否收藏过
        let postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            let postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        }
        else {
            let postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        if (globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.currentPostId) {
            this.setData({
                isPlayingMusic: true
            });
        }

        this.setAudioPlaying();


    },

    setAudioPlaying: function () {

        // 监听音乐播放，总控制开关

        wx.onBackgroundAudioPlay(() => {
            this.setData({
                isPlayingMusic: true
            });
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = this.data.currentPostId;
        });

        wx.onBackgroundAudioPause(() => {
            this.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });

        wx.onBackgroundAudioStop(() => {
            this.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
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

    onCollectionTap: function (event) {
        let postsCollected = wx.getStorageSync('posts_collected');
        let postCollected = postsCollected[this.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        wx.setStorageSync('posts_collected', postsCollected);
        this.setData({
            collected: postCollected
        })

        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            icon: "success"
        })
    },

    onShareTap: function (e) {
        let itemList = [
            "分享到微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ]

        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                wx.showModal({
                    title: '用户' + itemList[res.tapIndex],
                    content: '现在无法实现分享功能',
                })
            }
        })
    },

    onMusicTap: function () {

        let isPlayingMusic = this.data.isPlayingMusic;
        let postData = this.data.postData;

        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }
})