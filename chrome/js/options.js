/*!
 * 
 * Copyright (c) 2016 Ineer
 * Licensed under MIT (https://github.com/ineer/canGetBilibili/blob/master/LICENSE)
 */

var bgp          = chrome.extension.getBackgroundPage();
var tempHTML     = '<li class="tabel-item bilibili-color1">视频代号</li><li class="tabel-item bilibili-color2">flv</li><li class="tabel-item bilibili-color3">mp4</li>';
var videoList    = document.getElementById('videoList');
var clearHistory = document.getElementById('clearHistory');
var getHelp      = document.getElementById('getHelp');

getVideoList();

clearHistory.onclick = function() {
    bgp.clearVideoList();
    getVideoList();
};

getHelp.onclick = function() {
    window.open('http://www.zhihu.com/people/ineer');
};

window.onfocus = function() {
    bgp.isDownload = true;
    bgp.tempName = '';
};

bgp.isDownload = true;

function getVideoList() {
    for (var i in bgp.videoList) {
        var tempFlv = '';
        var tempMp4 = '';
        tempHTML += '<li class="tabel-item bilibili-color1">' + i + '</li>';
        for (var j in bgp.videoList[i]) {
            if (j.indexOf('flv') > -1) {
                tempFlv += '<a href="' + bgp.videoList[i][j] + '" download="' + i + '-'  + j.split('-')[2] + '.flv">[' + j.split('-')[2] + ']</a>';
            }
            if (j.indexOf('mp4') > -1) {
                tempMp4 += '<a href="' + bgp.videoList[i][j] + '" download="' + i + '-'  + j.split('-')[2] + '.mp4">[' + j.split('-')[2] + ']</a>';
            }
        }
        if (tempFlv.length === 0) {
            tempFlv = '-';
        }
        if (tempMp4.length === 0) {
            tempMp4 = '-';
        }
        tempHTML += '<li class="tabel-item bilibili-color2">' + tempFlv + '</li>' + '<li class="tabel-item bilibili-color3">' + tempMp4 + '</li>';
    }
    
    videoList.innerHTML = tempHTML;
    tempHTML = '<li class="tabel-item bilibili-color1">视频代号</li><li class="tabel-item bilibili-color2">flv</li><li class="tabel-item bilibili-color3">mp4</li>';
}