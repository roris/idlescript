// ==UserScript==
// @name        idlescript
// @namespace   idlescript
// @description pls don't time out
// @include     http://l4cs.jpn.org/gikopoi/flash/gikopoi134_gen/flash_gikopoi.html
// @include     http://l4cs.jpn.org/gikopoi/flash/gikopoi134_for/flash_gikopoi.html
// @version     1
// @grant       none
// ==/UserScript==

// ALT+SHIFT+A: toggle afk
// ALT+SHIFT+I: toggle idle
// ALT+SHIFT+L: #list
// ALT+SHIFT+R: #rula

(function (doc, win) { 
	var is = {
		interval: 0,
		afk: false,
		idle: true,
		time: 0,
		clock: doc.createElement("div"),
		lb_afk: doc.createElement("div")
	};

	function send_msg(msg)
	{	
		doc['gikopoi'].JSCallBackSendMessage(msg);
	}

	function do_keep_alive()
	{
		var delta = (Date.now() / 1000) - is.time;
		var deltas = Math.floor(60 - (delta % 60));
		var deltam = Math.floor(25 - (delta / 60));

		if(delta >= 1500) {
			send_msg(is.lb_afk.textContent);
			is.clock.style.color = "black";
			is.time = Date.now() / 1000;
			deltas = 0;
			deltam = 25;
		} else if(delta > 1490) {
			is.clock.style.color = "red";
		}

		is.clock.textContent = "" + (deltam < 10 ? "0" + deltam : deltam) + ":" + (deltas < 10 ? "0" + deltas : deltas);
	}

	function start_keep_alive()
	{
		is.time = Date.now() / 1000;
		do_keep_alive();
		is.interval = setInterval(do_keep_alive, 1000);
		is.idle = true;
	}
  
	is.clock.style.color = "black";
	is.clock.style.position = "absolute";
	is.clock.style.top = 0;
	is.clock.style.right = 0;
	is.clock.style.fontSize = "24px";
	is.clock.style.fontWeight = 4;

	is.lb_afk.style.position = "absolute";
	is.lb_afk.style.top = "24px";
	is.lb_afk.style.right = 0;
	is.lb_afk.style.fontSize = "24px";
	is.lb_afk.style.color = "red";

	doc.body.appendChild(is.clock);
	doc.body.appendChild(is.lb_afk);

	win.onkeyup = function(e)
	{
		if(e.altKey && e.shiftKey) {
			switch(e.keyCode) {
			case 65:
				is.lb_afk.textContent = is.afk ? "" : "afk";
				is.afk = !is.afk;
				send_msg(is.lb_afk.textContent);
				break;
			case 73:
				if(is.idle) {
					clearInterval(is.invertval);
					is.idle = false;
					is.clock.textContent = "";
				} else {
					start_keep_alive();
				}
				break;
			case 76:
				send_msg("#list");
				break;
			case 82:
				send_msg("#rula");
			}
		}
	};

	start_keep_alive();
  
})(document, window);
