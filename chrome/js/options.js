/*!
 * 
 * Copyright (c) 2016 Ineer
 * Licensed under MIT (https://github.com/ineer/canGetBilibili/blob/master/LICENSE)
 */

var bgp          = chrome.extension.getBackgroundPage();
var tempHTML     = '<li class="tabel-item bilibili-color1">视频av号</li><li class="tabel-item bilibili-color2">flv</li><li class="tabel-item bilibili-color3">mp4</li>';
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

bgp.isDownload = true;

function getVideoList() {
    for (var i in bgp.videoList) {
        tempHTML += '<li class="tabel-item bilibili-color1">' + i + '</li>';
        if (bgp.videoList[i]['flv']) {
            tempHTML += '<li class="tabel-item bilibili-color2"><a href="' + bgp.videoList[i]['flv'] + '" download="' + i + '.flv">下载</a></li>';
        } else {
            tempHTML += '<li class="tabel-item bilibili-color2"> - </li>';
        }
        if (bgp.videoList[i]['mp4']) {
            tempHTML += '<li class="tabel-item bilibili-color3"><a href="' + bgp.videoList[i]['mp4'] + '" download="' + i + '.mp4">下载</a></li>';
        } else {
            tempHTML += '<li class="tabel-item bilibili-color3"> - </li>';
        }
    }
    
    videoList.innerHTML = tempHTML;
    tempHTML = '<li class="tabel-item bilibili-color1">视频av号</li><li class="tabel-item bilibili-color2">flv</li><li class="tabel-item bilibili-color3">mp4</li>';
}