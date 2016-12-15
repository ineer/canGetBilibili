/*!
 * 
 * Copyright (c) 2016 Ineer
 * Licensed under MIT (https://github.com/ineer/canGetBilibili/blob/master/LICENSE)
 */

var filter1    = {};
var videoList  = {};
var isFlv      = false;
var isMp4      = false;
var isTip      = true;
var isDownload = false;
var tempName   = '';
var tempType   = '';
var tempVideo  = '';

getStorage({videoList: {}, isFlv: true, isMp4: false, isTip: true}, function(items) {
	videoList = items.videoList;
	isFlv     = items.isFlv;
	isMp4     = items.isMp4;
	isTip     = items.isTip;
});

getFilter(function(err) {
	if (!err) {
		chrome.webRequest.onBeforeRequest.addListener(function(request) {
			
			if (RegExp('av[0-9]*').test(request.url) || RegExp('anime/v').test(request.url)) {
				isDownload = false;
			}

			if (isDownload) {
				return;
			}
			if (RegExp('.swf').test(request.url)) {
				isMp4 = false;
				setStorage({isMp4: false}, function() {
					
				});
			}

		    if (isFlv || isMp4) {
		    	if (RegExp('av[0-9]*').test(request.url)) {
					tempName = RegExp('av[0-9]*').exec(request.url)[0]
							 + (RegExp('_[0-9]*').test(request.url) ? tempName = RegExp('_[0-9]*').exec(request.url)[0] : '');
					videoList[tempName] = {};
				} else if (RegExp('anime/v').test(request.url)) {
					tempName = RegExp('anime/v/[0-9]*').exec(request.url)[0].replace('/v/', '');
					videoList[tempName] = {};
				} else if (RegExp('.flv').test(request.url)  && !RegExp('get_url').test(request.url) && !RegExp('bstart').test(request.url)) {
					if (request.url.indexOf('-hd') > -1) {
						var typeIndex = RegExp('/[0-9]*-[0-9]*-hd').exec(request.url)[0].replace('/', '-');
					} else {
						var typeIndex = RegExp('/[0-9]*-[0-9]*').exec(request.url)[0].replace('/', '-');
					}
					if (!videoList[tempName]['flv' + typeIndex] && isFlv) {
						sniff('flv' + typeIndex, isFlv, request);
					}
					if (isMp4) {
						return {cancel: true};
					}
				} else if (RegExp('.mp4').test(request.url) && !RegExp('get_url').test(request.url) && !RegExp('bstart').test(request.url)) {
					if (request.url.indexOf('-hd') > -1) {
						var typeIndex = RegExp('/[0-9]*-[0-9]*-hd').exec(request.url)[0].replace('/', '-');
					} else {
						var typeIndex = RegExp('/[0-9]*-[0-9]*').exec(request.url)[0].replace('/', '-');
					}
					if (!videoList[tempName]['mp4' + typeIndex] && isMp4) {
						sniff('mp4' + typeIndex, isFlv, request);
					}
				}
		    } else {
		    	console.log('你没有选择要下载的格式');
		    }
		    
		}, filter1, ['blocking']);
		console.log('初始化成功');
	} else {
	    console.log(err);
	}
});

function getFilter(callback) {
	fetch('https://ineer.github.io/canGetBilibili-rules/filter.json').then(function(res) {
		if (res.status === 200) {
			res.json().then(function(json) {
				filter1.urls = json.filter1;
				callback(false);
			});
		} else {
		    callback({status: res.status});
		}
	});
}

function clearVideoList() {
	videoList = {};
	setStorage({videoList: videoList}, function() {

	});
	chrome.browserAction.setBadgeText({text: ''});
}

function setStorage(obj, func) {
  chrome.storage.sync.set(obj, func);
  return obj;
}

function getStorage(obj, func) {
  chrome.storage.sync.get(obj, func);
  return obj;
}

function setTip(title, body) {
	var notification = new Notification(title,{
		body : body,
		icon : chrome.extension.getURL('images/icon38.png')
	});
}

function saveVideoList() {
	setStorage({videoList: videoList}, function() {

	});
}

function sniff(type, boo, req) {
	if (tempName.length === 0) {
		return false;
	}
	tempType = type;
	tempVideo = req.url;
	videoList[tempName][type] = tempVideo;
	tempType = '';
	tempVideo = '';
	if (isTip) {
		setTip("温馨提示", '发现' + tempName + ' ' + type + '视频, 累计发现' + String(Object.keys(videoList).length) + '个视频');
	}
	chrome.browserAction.setBadgeText({text: String(Object.keys(videoList).length)});
	saveVideoList();
}