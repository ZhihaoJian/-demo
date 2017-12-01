function coverToStarArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}

function http(url, callback) {
    var _this = this;
    wx.request({
        url: url,
        method: 'GET',
        data: {
        },
        header: {
            "Content-Type": "json"
        },
        success: (res) => {
            callback(res.data);
        },
        fail: function (err) {

        },
        complete: function () {

        }
    })
}


function convertToCastString(casts) {
    var castsjoin = "";
    for (var idx in casts) {
        castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
    var castsArray = []
    for (var idx in casts) {
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : "",
            name: casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}

module.exports = {
    convertToStarsArray: coverToStarArray,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos
}