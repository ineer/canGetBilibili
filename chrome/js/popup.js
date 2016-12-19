/*!
 * 
 * Copyright (c) 2016 Ineer
 * Licensed under MIT (https://github.com/ineer/canGetBilibili/blob/master/LICENSE)
 */

var bgp             = chrome.extension.getBackgroundPage();
var isDownloadingQ4 = document.getElementById('isDownloadingQ4');
var isDownloadingQ3 = document.getElementById('isDownloadingQ3');
var isDownloadingQ2 = document.getElementById('isDownloadingQ2');
var isDownloadingQ1 = document.getElementById('isDownloadingQ1');
var isTip           = document.getElementById('isTip');
var downloadPage    = document.getElementById('downloadPage');

init();

function init() {
    bgp.getStorage({isQ4: true, isQ3: true, isQ2: true, isQ1: true, isTip: true}, function(items) {
        isDownloadingQ4.checked = items.isQ4;
        isDownloadingQ3.checked = items.isQ3;
        isDownloadingQ2.checked = items.isQ2;
        isDownloadingQ1.checked = items.isQ1;
        isTip.checked           = items.isTip;
        bgp.isQ4                = items.isQ4;
        bgp.isQ3                = items.isQ3;
        bgp.isQ2                = items.isQ2;
        bgp.isQ1                = items.isQ1;
    });
}

isDownloadingQ4.onclick = function() {
    save_options();
};
isDownloadingQ3.onclick = function() {
    save_options();
};
isDownloadingQ2.onclick = function() {
    save_options();
};
isDownloadingQ1.onclick = function() {
    save_options();
};
isTip.onclick = function() {
    save_options();
};

downloadPage.onclick = function() {
    window.open(chrome.runtime.getURL('options.html'));
};

function save_options() {
    bgp.setStorage({isQ4: isDownloadingQ4.checked, isQ3: isDownloadingQ3.checked, isQ2: isDownloadingQ2.checked, isQ1: isDownloadingQ1.checked, isTip: isTip.checked}, function() {
        bgp.isQ4  = isDownloadingQ4.checked;
        bgp.isQ3  = isDownloadingQ3.checked;
        bgp.isQ2  = isDownloadingQ2.checked;
        bgp.isQ1  = isDownloadingQ1.checked;
        bgp.isTip = isTip.checked;
    });
}