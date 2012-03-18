// Check active users for CityVille
// 2012/03/11
// Copyright (c) 2012, MORISHIGE Yoshitaka
// Released under the MIT license
// http://www.opensource.org/licenses/mit-license.php
//
// ==UserScript==
// @name	CityVille_CheckActiveUser
// @namespace http://morishige.jp/
// @description check active users for CityVille on facebook.
// @author MORISHIGE Yoshitaka
// @version 0.2
// @released 2012-03-11
// @updated 2012-03-11
// @include https://*.cityville.zynga.com/neighbors.php*
// @include https://cityville.zynga.com/neighbors.php*
// ==/UserScript==

// データは、以下のJSON形式で保存してます。
// {
//	[name]: {level: [level], exp: [exp], coin: [coin], date: [date]},
//	[name]: {level: [level], exp: [exp], coin: [coin], date: [date]}
// }


if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported") > -1)) {
	this.GM_getValue = function(key, def) {
		return window.localStorage.getItem(key) || def
	};
	this.GM_setValue = function(key, value) {
		return window.localStorage.setItem(key, value);
	};
}


var now = new Date().getTime();
var savedJson = GM_getValue("CityVille_CheckActiveUser", null);
var save;
if (savedJson == null) {
	save = {};
} else {
	save = JSON.parse(savedJson);
}
var users = document.evaluate(
	"//div[@class='n_list_info']",
	document,
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null
);
for (var i = 0; i < users.snapshotLength; i++) {
	var user = users.snapshotItem(i);
	
	// なぜか名前が無い時があるので。
	if (user.getElementsByTagName("a")[0].firstChild == null) {
		continue;
	}
	
	var name = user.getElementsByTagName("a")[0].firstChild.nodeValue;
	var level = user.getElementsByTagName("span")[0].firstChild.nodeValue;
	var exp = user.getElementsByTagName("span")[1].firstChild.nodeValue;
	exp = exp.split(",").join("");
	var coin = user.getElementsByTagName("span")[2].firstChild.nodeValue;
	coin = coin.split(",").join("")
	
	// 以前と同じ経験値なら
	if (save[name] != null && save[name].exp == exp) {
		var oldDate = new Date();
		oldDate.setTime(save[name].date);
		var since = document.createElement("span");
		since.appendChild(document.createTextNode(" "+ (oldDate.getMonth() + 1) +"/"+ oldDate.getDate()));
		if ((now - save[name].date) / (24 * 3600 * 1000) > 7) {
			since.style.color = "red";
		} else {
			since.style.color = "gray";
		}
		user.getElementsByTagName("span")[1].appendChild(since);
		// console.log("name="+name+" same exp since "+ oldDate.getFullYear() +"/"+ (oldDate.getMonth() + 1) +"/"+ oldDate.getDate());
	} else if (save[name] == null) { // データが無い場合。
		save[name] = {level: level, exp: exp, coin: coin, date: now};
	} else { // 経験値に変化あり
		var oldDate = new Date();
		oldDate.setTime(save[name].date);
		var up = document.createTextNode("(up "+ (exp - save[name].exp) +" "+ (oldDate.getMonth() + 1) +"/"+ oldDate.getDate() +")");
		user.getElementsByTagName("span")[1].appendChild(up);
		// console.log("name="+name+" exp up="+ (exp - save[name].exp) + " nowExp="+exp+" oldExp="+save[name].exp);
		save[name].level = level;
		save[name].exp = exp;
		save[name].coin = coin;
		save[name].date = now;
	}
}
GM_setValue("CityVille_CheckActiveUser", JSON.stringify(save));
