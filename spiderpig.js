function Spiderpig() {
	this.baseUrl = "https://sisidra.github.io/spiderpig";
	this.topOffset = 5;
	this.leftOffset = 0;
	this.topMax = 40;
	this.leftMax = Spiderpig.screenWidth() - this.leftOffset;

	this.directionChangeProb = 0.995;
	this.topChangeProb = 0.9;
	this.trackFrequencyProb = 1/20;
	this.trackMinDist = 20;
	this.trackDuration = 20000;
	this.trackDurationProb = 5000;
	this.speed = 50;

	this.includeCSS();

	this.tagPig = document.createElement("img");
	this.tagPig.src = this.baseUrl + "/spiderpig.png";
	this.tagPig.className = "spiderpig";

	this.tagTrack = document.createElement("img");
	this.tagTrack.src = this.baseUrl + "/track.png";
	this.tagTrack.className = "spiderpigtrack";
	this.tagPig.spiderpig = this;
	this.tagPig.ondblclick = function() {
		this.spiderpig.stop();
	}

	this.imgPig = new Image();
	this.imgPig.spiderpig = this;

	this.stepCnt = 0;
	this.trackCnt = 0;
	this.direction = 0;
}

Spiderpig.prototype.includeCSS = function() {
	if (document.createStyleSheet) {
		document.createStyleSheet(this.baseUrl + '/spiderpig.css');
	} else {
		var tag = document.createElement('style');
		tag.type = "text/css";
		tag.media = "screen";
		tag.appendChild(document.createTextNode("@import url('" + this.baseUrl + "/spiderpig.css');"));
		document.getElementsByTagName("head")[0].appendChild(tag);
	}
}

Spiderpig.prototype.startOnLoad = function() {
	this.imgPig.onload = function() { this.spiderpig.start(); };
	this.imgPig.src = this.tagPig.src;
}

Spiderpig.prototype.start = function() {
	this.leftMax = Spiderpig.screenWidth() - this.leftOffset;
	document.body.appendChild(this.tagPig);
	this.tagPig.style.top = (this.topOffset + this.topMax / 2) + "px";
	this.tagPig.style.left = ((this.leftMax - this.tagPig.width) / 2) + "px";

	this.step();
}

Spiderpig.prototype.stop = function() {
	clearTimeout(this.timeout);
	document.body.removeChild(this.tagPig);
	var xxx = document.createElement("blink");
	xxx.style.textDecorationBlink = true;
	xxx.style.color = "red";
	xxx.style.fontWeight = "bold";
	xxx.style.fontSize = "40px";
	xxx.style.position = "absolute";
	xxx.style.top = "0px";
	xxx.style.left = "20px";
	xxx.appendChild(document.createTextNode("OMG, you killed Spiderpig! You Bastard!!!"));
	document.body.appendChild(xxx);
	setTimeout(function() { document.body.removeChild(xxx); }, 5000);
}

Spiderpig.prototype.step = function() {
	if (Math.random() > this.topChangeProb) {
		var top = parseInt(this.tagPig.style.top);
		if (((top < this.topMax + this.topOffset) && (Math.random() > 0.5)) || (top == this.topOffset)) {
			this.tagPig.style.top = (top + 1) + "px";
		} else {
			this.tagPig.style.top = (top - 1) + "px";
		}
	}

	var oldDirection = this.direction;
	var left = parseInt(this.tagPig.style.left);
	if (left + this.direction > this.leftMax - this.imgPig.width) {
		this.direction = -1;
	} else if (left + this.direction < this.leftOffset) {
		this.direction = 1;
	} else if (Math.random() > this.directionChangeProb) {
		this.direction = -this.direction;
	} else if (this.direction == 0) {
		this.direction = Math.random() > 0.5 ? 1 : -1;
	}
	this.tagPig.style.left = (left + this.direction) + "px";

	this.trackCnt++;
	if ((this.trackCnt > this.trackMinDist && Math.random() < this.trackFrequencyProb) || this.direction != oldDirection) {
		this.addTrack(20, 4);
		this.addTrack(64, -1);
		this.trackCnt = 0;
	}

	this.stepCnt++;

	var a = this;
	this.timeout = setTimeout(function() { a.step(); }, this.speed);
}

Spiderpig.prototype.addTrack = function(oLeft, oTop) {
	var track = this.tagTrack.cloneNode(true);
	var left = parseInt(this.tagPig.style.left);
	var top = parseInt(this.tagPig.style.top);
	track.style.left = (left + this.tagPig.width - oLeft) + "px";
	track.style.top = (top + oTop) + "px";
	document.body.appendChild(track);
	setTimeout(function() { document.body.removeChild(track); }, this.trackDuration + Math.ceil(this.trackDurationProb * Math.random()));
}

Spiderpig.prototype.attachOnLoad = function() {
	var pig = this;
	if (window.addEventListener) {
		window.addEventListener("load", function() { pig.startOnLoad(); }, false);
//		window.addEventListener("resize", function() { pig.leftMax = Spiderpig.screenWidth(); }, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", function() { pig.startOnLoad(); });
//		window.attachEvent("onresize", function() { pig.leftMax = Spiderpig.screenWidth(); });
	} else {
		window.onload = this.start;
	}
}

Spiderpig.screenWidth = function() {
  if (typeof(window.innerWidth) == 'number') {
    //Non-IE
    return window.innerWidth;
  } else if (document.documentElement && document.documentElement.clientWidth) {
    //IE 6+ in 'standards compliant mode'
    return document.documentElement.clientWidth;
  } else if (document.body && document.body.clientWidth) {
    //IE 4 compatible
    return document.body.clientWidth;
  }
  return 1200;
}

var spiderpig = new Spiderpig();
spiderpig.attachOnLoad();
