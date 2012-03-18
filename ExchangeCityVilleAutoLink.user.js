// Auto click for Exchange CityVille
// version 0.1 BETA :D
// 2012/03/18
// Copyright (c) 2012, MORISHIGE Yoshitaka
// Released under the MIT license
// http://www.opensource.org/licenses/mit-license.php
//
// ==UserScript==
// @name	AutoClickForExchangeCityVille
// @namespace http://morishige.jp/
// @description Auto click for Exchange CityVille.
// @include http://gamersunite.coolchaser.com/games/cityville/link_exchange
// ==/UserScript==

// 収集したいアイテム名を下記に列挙します。
var targets = [
	// 'Energy',
	// 'Spain Passport Stamp',
	// 'US Passport Stamp',
	// 'Japan Passport Stamp',
	// 'UK passport stamps',
	// 'Dubai passport stamps',
	'Zoning Permit',
	// 'Green Shamrock',
	// 'Red Shamrock',
	// 'Orange Shamrock',
	'Yellow Shamrock',
	'Blue Shamrock',
	'Purple Shamrock'
];


// クリック間隔 [秒]
var INTERVAL_CLICK = 15;

// リロード間隔 [秒]
var INTERVAL_RELOAD = 3 * 60;

// 以下、編集は必要有りません。


// GM_getValue, GM_setValue を Google Chrome でも動作させるためのオマジナイ
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported") > -1)) {
	this.GM_getValue = function(key, def) {
		return window.localStorage.getItem(key) || def
	};
	this.GM_setValue = function(key, value) {
		return window.localStorage.setItem(key, value);
	};
}

var clickQueue = [];
var checkTargets = function() {
	var items = document.evaluate(
		// "//li[@class='avail']/div[@class='comment_text']",
		"//li[@class='avail']",
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
	for (var i = 0; i < items.snapshotLength; i++) {
		if (i > 20) { // 最新20個のみを対象
			break;
		}
		var item = items.snapshotItem(i);
		var name = item.getElementsByTagName("p")[0].firstChild.nodeValue;
		var since = item.getElementsByTagName("p")[2].firstChild.nodeValue;
		var times = item.getElementsByTagName("em")[0].firstChild.nodeValue;
		console.log("name="+name+" since="+since+" times="+times);
		
		// 5回以上クリックされたものは無視
		if (times >= 5) {
			continue;
		}
		
		// 2分以上経過したものは無視
		if (since != 'mere moments ago' && since != '1 minute ago') {
			continue;
		}
		
		for (var j = 0; j < targets.length; j++) {
			if (name == targets[j]) {
				console.log("hit! name="+name);
				clickQueue.push(item);
			}
		}
	}
};

var click = function() {
	if (clickQueue.length <= 0) {
		reload();
		return;
	}
	var target = clickQueue.shift();
	var e = document.createEvent('MouseEvents');
	e.initEvent('click', true, false);
	target.dispatchEvent(e);
	setTimeout(click, INTERVAL_CLICK * 1000);
}

var reload = function() {
	console.log("wait...")
	setTimeout(function() {
		window.location.reload();
	}, INTERVAL_RELOAD * 1000);
}

checkTargets();
click();
