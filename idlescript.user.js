// ==UserScript==
// @name        idlescript
// @namespace   idlescript
// @description pls don't time out
// @include	http://l4cs.jpn.org/gikopoi/flash/gikopoi*/flash_gikopoi.html
// @version     1.01
// @grant       none
// ==/UserScript==

// ALT+SHIFT+A: toggle afk
// ALT+SHIFT+I: toggle idle
// ALT+SHIFT+L: #list
// ALT+SHIFT+R: #rula

(function (doc, win) { 
	var is = {
		interval: 0,
		idle: true,
		time: Date.now() / 1000,
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

	function start_idle()
	{
		is.time = Date.now() / 1000;
		do_keep_alive();
		is.interval = setInterval(do_keep_alive, 1000);
		is.idle = true;
	}

	function check_mode(text)
	{
		if (is.lb_afk.textContent == text) {
			is.lb_afk.textContent = "";
		} else {
			is.lb_afk.textContent = text;
			if (is.idle) {
				is.time = Date.now() / 1000;
				do_keep_alive();
			} else {
				start_idle();
			}
		}
	}

	win.onkeyup = function(e)
	{
		if(e.altKey && e.shiftKey) {
			switch(e.keyCode) {
			case 65:
				check_mode("afk");
				break;
			case 73:
				if(is.idle) {
					clearInterval(is.interval);
					is.idle = false;
					is.clock.textContent = "";
				} else {
					start_idle();
				}
				break;
			case 76:
				send_msg("#list");
				break;
			case 82:
				send_msg("#rula");
				break;
			case 50:
				check_mode("=@=");
				break;
			case 80:
				check_mode("PLAY ON!");
			default:
					return;
			}
			send_msg(is.lb_afk.textContent);
		}
	};

	is.clock.style.color = "black";
	is.clock.style.position = "fixed";
	is.clock.style.top = 0;
	is.clock.style.right = 0;
	is.clock.style.fontSize = "24px";
	is.clock.style.fontWeight = 4;

	is.lb_afk.style.position = "fixed";
	is.lb_afk.style.top = "24px";
	is.lb_afk.style.right = 0;
	is.lb_afk.style.fontSize = "24px";
	is.lb_afk.style.color = "red";

	doc.body.appendChild(is.clock);
	doc.body.appendChild(is.lb_afk);

	start_idle();
  
})(document, window);
