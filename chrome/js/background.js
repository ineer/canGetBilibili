/*!
 * 
 * Copyright (c) 2016 Ineer
 * Licensed under MIT (https://github.com/ineer/canGetBilibili/blob/master/LICENSE)
 */

var filter1    = {};
var videoList  = {};
var isQ4       = false;
var isQ3       = false;
var isQ2       = false;
var isQ1       = false;
var isTip      = true;
var isCross    = false;
var playurlCache = {};
var tempName   = '';
var tempType   = '';
var tempVideo  = [];

getStorage({videoList: {}, playurlCache: {}, isQ4: true, isQ3: true, isQ2: true, isQ1: true, isTip: true}, function(items) {
	videoList    = items.videoList;
	playurlCache = items.playurlCache;
	isQ4         = items.isQ4;
	isQ3         = items.isQ3;
	isQ2         = items.isQ2;
	isQ1         = items.isQ1;
	isTip        = items.isTip;
	if (Object.keys(videoList).length > 0) {
		chrome.browserAction.setBadgeText({text: String(Object.keys(videoList).length)});
	}
});

getFilter(function(err) {
	if (!err) {
		chrome.webRequest.onBeforeRequest.addListener(function(request) {

		    if (isQ4 || isQ3 || isQ2 || isQ1) {
		    	if (RegExp('av[0-9]*').test(request.url)) {
		    		isCross = true;
					tempName = RegExp('av[0-9]*').exec(request.url)[0]
							 + (RegExp('_[0-9]*').test(request.url) ? tempName = RegExp('_[0-9]*').exec(request.url)[0].replace('_', '-') : '');
					if (!videoList[tempName]) {
						videoList[tempName] = {};
					}
				} else if (RegExp('anime/v').test(request.url)) {
					if (!isCross) {
						tempName = RegExp('anime/v/[0-9]*').exec(request.url)[0].replace('/v/', '');
						if (!videoList[tempName]) {
							videoList[tempName] = {};
						}
					} else {
						isCross = false;
					}
				} else if (RegExp('movie/').test(request.url)) {
					if (!isCross) {
						tempName = RegExp('movie/[0-9]*').exec(request.url)[0].replace('/', '');
						if (!videoList[tempName]) {
							videoList[tempName] = {};
						}
					} else {
						isCross = false;
					}
				}
				
				if (RegExp('playurl').test(request.url)) {
					if (isQ4 && RegExp('quality=4').test(request.url) && !playurlCache[RegExp('cid=[0-9]*').exec(request.url)[0] + '-' + RegExp('quality=[0-9]*').exec(request.url)[0]]) {
						getVideo(request.url);
					}
					if (isQ3 && RegExp('quality=3').test(request.url) && !playurlCache[RegExp('cid=[0-9]*').exec(request.url)[0] + '-' + RegExp('quality=[0-9]*').exec(request.url)[0]]) {
						getVideo(request.url);
					}
					if (isQ2 && RegExp('quality=2').test(request.url) && !playurlCache[RegExp('cid=[0-9]*').exec(request.url)[0] + '-' + RegExp('quality=[0-9]*').exec(request.url)[0]]) {
						getVideo(request.url);
					}
					if (isQ1 && RegExp('quality=1').test(request.url) && !playurlCache[RegExp('cid=[0-9]*').exec(request.url)[0] + '-' + RegExp('quality=[0-9]*').exec(request.url)[0]]) {
						getVideo(request.url);
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
	}).catch(function(err) {
		console.log(err)
	});
}

function clearVideoList() {
	videoList = {};
	playurlCache = {};
	setStorage({videoList: {}, playurlCache: {}}, function() {
		chrome.browserAction.setBadgeText({text: ''});
	});
}

function setStorage(obj, func) {
  chrome.storage.sync.set(obj, func);
}

function getStorage(obj, func) {
  chrome.storage.sync.get(obj, func);
}

function setTip(title, body) {
	var notification = new Notification(title,{
		body : body,
		icon : chrome.extension.getURL('images/icon38.png')
	});
}

function saveVideoList() {
	setStorage({videoList: videoList, playurlCache: playurlCache}, function() {
		
	});
}

function getVideo(url) {
	getPlayurl(url, setVideoList);
}

function setVideoList(err) {
	if (!err && !videoList[tempName][tempType]) {
		videoList[tempName][tempType] = tempVideo;
		if (isTip) {
			setTip("温馨提示", '发现' + tempName + '的' + getFormat(tempType) + '视频, 累计发现' + String(Object.keys(videoList).length) + '个视频');
		}
		chrome.browserAction.setBadgeText({text: String(Object.keys(videoList).length)});
		saveVideoList();
	}
}

function refreshVideo() {

	for (var i in videoList) {
		tempName = i;
		for (var j in videoList[i]) {
			var tempIndex = '';

			tempIndex = 'cid=' + RegExp('/[0-9]*-').exec(videoList[i][j][0])[0].replace('/', '');
			if (videoList[i][j][0].indexOf('hd.flv') > -1) {
				// 4
				tempIndex += 'quality=4';
			} else if (videoList[i][j][0].indexOf('hd.mp4') > -1) {
				// 2
				tempIndex += 'quality=2';
			} else if (videoList[i][j][0].indexOf('flv') > -1) {
				// 3
				tempIndex += 'quality=3';
			} else if (videoList[i][j][0].indexOf('mp4') > -1) {
				// 1
				tempIndex += 'quality=1';
			}
			var tempUrl = playurlCache[tempIndex];
			playurlCache[tempIndex] = false;
			if (!playurlCache[tempIndex]) {
				getPlayurlSyn(tempUrl, tempName, tempIndex);
			}
		}
	}
	if (isTip) {
		setTip("温馨提示", '更新视频下载地址完毕');
	}
}

function getPlayurl(url, callback) {
	if (tempName.length === 0) {
		return false;
	}
	playurlCache[RegExp('cid=[0-9]*').exec(url)[0] + '-' + RegExp('quality=[0-9]*').exec(url)[0]] = url;
	fetch(url, {credentials: 'include'}).then(function(res) {
		if (res.status === 200) {
			
			if (RegExp('json').test(url)) {
				res.json().then(function(json) {
					var tempArr = json.durl;
					tempVideo = [];
					if (tempArr.length > 0) {
						tempType = getVideoType(tempArr[0].url);
						for (var i = 0; i < tempArr.length; i++) {
							tempVideo[i] = tempArr[i].url;
						}
						callback(false);
					}
				});
			} else {
				res.text().then(function(text) {
					var tempArr = new window.DOMParser().parseFromString(text, "text/xml").querySelectorAll('durl>url');
					tempVideo = [];
					if (tempArr) {
						tempType = getVideoType(tempArr[0].textContent);
						for (var i = 0; i < tempArr.length; i++) {
							tempVideo[i] = tempArr[i].textContent;
						}
						callback(false);
					}
				});
			}
		} else {
			playurlCache[RegExp('cid=[0-9]*').exec(url)[0] + '-' + RegExp('quality=[0-9]*').exec(url)[0]] = false;
		}
	}).catch(function(err) {
		console.warn(err);
		playurlCache[RegExp('cid=[0-9]*').exec(url)[0] + '-' + RegExp('quality=[0-9]*').exec(url)[0]] = false;
	});
	
}

function getPlayurlSyn(url, name, index) {
	playurlCache[index] = url;
	fetch(url, {credentials: 'include'}).then(function(res) {
		if (res.status === 200) {
			
			if (RegExp('json').test(url)) {
				res.json().then(function(json) {
					var tempArr = json.durl;
					tempVideo = [];
					if (tempArr.length > 0) {
						tempType = getVideoType(tempArr[0].url);
						for (var i = 0; i < tempArr.length; i++) {
							tempVideo[i] = tempArr[i].url;
						}
						videoList[name][tempType] = tempVideo;
						saveVideoList();
					}
				});
			} else {
				res.text().then(function(text) {
					var tempArr = new window.DOMParser().parseFromString(text, "text/xml").querySelectorAll('durl>url');
					tempVideo = [];
					if (tempArr) {
						tempType = getVideoType(tempArr[0].textContent);
						for (var i = 0; i < tempArr.length; i++) {
							tempVideo[i] = tempArr[i].textContent;
						}
						videoList[name][tempType] = tempVideo;
						saveVideoList();
					}
				});
			}
		} else {
			playurlCache[index] = false;
		}
	}).catch(function(err) {
		console.warn(err);
		playurlCache[index] = false;
	});
}

function getVideoType(url) {
    if (RegExp('-hd').test(url) && RegExp('.flv').test(url)) {
        return '-hd.flv';
    } else if (RegExp('-hd').test(url) && RegExp('.mp4').test(url)) {
        return '-hd.mp4';
    } else if (!RegExp('-hd').test(url) && RegExp('.flv').test(url)) {
        return '.flv';
    } else if (!RegExp('-hd').test(url) && RegExp('.mp4').test(url)) {
        return '.mp4';
    }
}

function getFormat(type) {
	if (type === '-hd.flv') return '1080P';
	if (type === '.flv')    return '超清';
	if (type === '-hd.mp4') return '高清';
	if (type === '.mp4')    return '流畅';
}