/*!
 * 
 * Copyright (c) 2016 Ineer
 * Licensed under MIT (https://github.com/ineer/canGetBilibili/blob/master/LICENSE)
 */

var bgp          = chrome.extension.getBackgroundPage();
var tempHTML     = '<li class="tabel-item bilibili-color1">视频编号</li><li class="tabel-item bilibili-color2">1080P</li><li class="tabel-item bilibili-color3">超清</li><li class="tabel-item bilibili-color4">高清</li><li class="tabel-item bilibili-color5">流畅</li>';
var videoList    = document.getElementById('videoList');
var clearHistory = document.getElementById('clearHistory');
var RefreshAdr   = document.getElementById('RefreshAdr');
var getHelp      = document.getElementById('getHelp');

getVideoList();

clearHistory.onclick = function() {
    bgp.clearVideoList();
    getVideoList();
};

RefreshAdr.onclick = function() {
    bgp.refreshVideo();
    getVideoList();
};

getHelp.onclick = function() {
    window.open('http://www.zhihu.com/people/ineer');
};

window.onfocus = function() {
    bgp.tempName = '';
};

function getVideoList() {
    for (var i in bgp.videoList) {
        var tempQ4 = '';
        var tempQ3 = '';
        var tempQ2 = '';
        var tempQ1 = '';
        tempHTML += '<li class="tabel-item bilibili-color1">' + getUrl(i) + '</li>';
        for (var j in bgp.videoList[i]) {
            if (j === '-hd.flv') {
                for (var k = 0; k < bgp.videoList[i][j].length; k++) {
                    tempQ4 += '<a href="' + bgp.videoList[i][j][k] + '" download="' + i + '-' + (k + 1) + j + '">[' + (k + 1) + ']</a>';
                }
            }
            if (j === '.flv') {
                for (var k = 0; k < bgp.videoList[i][j].length; k++) {
                    tempQ3 += '<a href="' + bgp.videoList[i][j][k] + '" download="' + i + '-' + (k + 1) + j + '">[' + (k + 1) + ']</a>';
                }
            }
            if (j === '-hd.mp4') {
                for (var k = 0; k < bgp.videoList[i][j].length; k++) {
                    tempQ2 += '<a href="' + bgp.videoList[i][j][k] + '" download="' + i + '-' + (k + 1) + j + '">[' + (k + 1) + ']</a>';
                }
            }
            if (j === '.mp4') {
                for (var k = 0; k < bgp.videoList[i][j].length; k++) {
                    tempQ1 += '<a href="' + bgp.videoList[i][j][k] + '" download="' + i + '-' + (k + 1) + j + '">[' + (k + 1) + ']</a>';
                }
                console.log(tempQ1)
            }
        }
        if (tempQ4.length === 0) {tempQ4 = '-';}
        if (tempQ3.length === 0) {tempQ3 = '-';}
        if (tempQ2.length === 0) {tempQ2 = '-';}
        if (tempQ1.length === 0) {tempQ1 = '-';}
        
        tempHTML += '<li class="tabel-item bilibili-color2">' + tempQ4 + '</li>' + '<li class="tabel-item bilibili-color3">' + tempQ3 + '</li>' + '<li class="tabel-item bilibili-color4">' + tempQ2 + '</li>' + '<li class="tabel-item bilibili-color5">' + tempQ1 + '</li>';
    }
    
    videoList.innerHTML = tempHTML;
    tempHTML = '<li class="tabel-item bilibili-color1">视频编号</li><li class="tabel-item bilibili-color2">1080P</li><li class="tabel-item bilibili-color3">超清</li><li class="tabel-item bilibili-color4">高清</li><li class="tabel-item bilibili-color5">流畅</li>';
}

function getUrl(i) {
    if (i.indexOf('av') > -1) {
        i = '<a href="http://www.bilibili.com/video/' + i + '" target="_blank">' + i + '</a>';
    }
    if (i.indexOf('movie') > -1) {
        i = '<a href="http://bangumi.bilibili.com/movie/' + RegExp('e[0-9]*').exec(i)[0].replace('e', '') + '" target="_blank">' + i + '</a>';
    }
    if (i.indexOf('anime') > -1) {
        i = '<a href="http://bangumi.bilibili.com/anime/v/' + RegExp('e[0-9]*').exec(i)[0].replace('e', '') + '" target="_blank">' + i + '</a>';
    }
    return i;
}