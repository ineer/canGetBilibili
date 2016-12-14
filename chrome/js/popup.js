/*!
 * 
 * Copyright (c) 2016 Ineer
 * Licensed under MIT (https://github.com/ineer/canGetBilibili/blob/master/LICENSE)
 */

var bgp = chrome.extension.getBackgroundPage();
var isDownloadingFlv = document.getElementById('isDownloadingFlv');
var isDownloadingMp4 = document.getElementById('isDownloadingMp4');
var isTip = document.getElementById('isTip');
var downloadPage = document.getElementById('downloadPage');
init();

function init() {
    bgp.getStorage({isFlv: true, isMp4: false, isTip: true}, function(items) {
        isDownloadingFlv.checked = items.isFlv;
        isDownloadingMp4.checked = items.isMp4;
        isTip.checked = items.isTip;
        bgp.isFlv = items.isFlv;
        bgp.isMp4 = items.isMp4;
        bgp.isTip = items.isTip;
    });
}

isDownloadingFlv.onclick = function() {
    save_options();
};
isDownloadingMp4.onclick = function() {
    save_options();
};
isTip.onclick = function() {
    save_options();
};

downloadPage.onclick = function() {
//     chrome.runtime.openOptionsPage();
window.open(chrome.runtime.getURL('options.html'));
};

function save_options() {
    bgp.setStorage({isFlv: isDownloadingFlv.checked, isMp4: isDownloadingMp4.checked, isTip: isTip.checked}, function() {
        bgp.isFlv = isDownloadingFlv.checked;
        bgp.isMp4 = isDownloadingMp4.checked;
        bgp.isTip = isTip.checked;
    });
}