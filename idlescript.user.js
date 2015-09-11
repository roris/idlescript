// ==UserScript==
// @name        idlescript
// @namespace   idlescript
// @description pls don't time out
// @include	http://l4cs.jpn.org/gikopoi/flash/gikopoi*/flash_gikopoi.html
// @version     1.02
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
    btn_afk: doc.createElement('button'),
    btn_rula: doc.createElement('button'),
    btn_list: doc.createElement('button'),
    btn_ka: doc.createElement('button'),
    clock: doc.createElement('div'),
    lb_afk: doc.createElement('div'),
    panel: doc.createElement('div')
  };
  function send_msg(msg)
  {
    doc['gikopoi'].JSCallBackSendMessage(msg);
  }
  function do_keep_alive()
  {
    var delta = (Date.now() / 1000) - is.time;
    var deltas = Math.floor(delta % 60);
    var deltam = Math.floor(25 - (delta / 60));
    deltas = deltas == 0 ? 0 : 60 - deltas;
    if (delta >= 1500) {
      send_msg(is.lb_afk.textContent);
      is.clock.style.color = 'black';
      is.time = Date.now() / 1000;
      deltas = 0;
      deltam = 25;
    } else if (delta > 1490) {
      is.clock.style.color = 'red';
    }
    is.clock.textContent = '' + (deltam < 10 ? '0' + deltam : deltam) + ':' + (deltas < 10 ? '0' + deltas : deltas);
  }
  function color_buttons() {
    switch (is.lb_afk.textContent) {
      case 'afk':
        is.btn_afk.style.color = 'red';
        is.btn_ka.style.color = '';
        break;
      default:
        is.btn_afk.style.color = '';
        break;
    }
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
      is.lb_afk.textContent = '';
    } else {
      is.lb_afk.textContent = text;
      if (is.idle) {
        is.time = Date.now() / 1000;
        do_keep_alive();
      } else {
        start_idle();
      }
    }
    color_buttons();
  }
  function check_keep_alive() {
    if (is.idle) {
      clearInterval(is.interval);
      is.idle = false;
      is.clock.textContent = '';
      is.btn_ka.style.color = '';
    } else {
      start_idle();
      color_buttons();
      is.btn_ka.style.color = 'red';
    }
  }
  win.onkeyup = function (e)
  {
    if (e.altKey && e.shiftKey) {
      switch (e.keyCode) {
        case 65:
          check_mode('afk');
          break;
        case 73:
          check_keep_alive();
          break;
        case 76:
          send_msg('#list');
          break;
        case 82:
          send_msg('#rula');
          break;
        default:
          return;
      }
      send_msg(is.lb_afk.textContent);
    }
  };
  is.btn_afk.textContent = 'AFK';
  is.btn_afk.onclick = function () {
    check_mode('afk');
    send_msg(is.lb_afk.textContent);
  };
  is.btn_rula.textContent = 'Rula';
  is.btn_rula.onclick = function () {
    send_msg('#rula');
  };
  is.btn_list.textContent = 'List';
  is.btn_list.onclick = function () {
    send_msg('#list');
  };
  is.btn_ka.textContent = 'Keep Alive';
  is.btn_ka.onclick = function () {
    check_keep_alive();
  }
  is.clock.style.color = 'black';
  is.clock.style.position = 'absolute';
  is.clock.style.right = 0;
  is.clock.style.fontSize = '24px';
  is.panel.style.position = 'fixed';
  is.panel.style.top = 0;
  is.panel.style.right = 0;
  is.panel.appendChild(is.btn_ka);
  is.panel.appendChild(is.btn_afk);
  is.panel.appendChild(is.btn_rula);
  is.panel.appendChild(is.btn_list);
  is.panel.appendChild(is.clock);
  doc.body.appendChild(is.panel);
  start_idle();
  color_buttons();
  is.btn_ka.style.color = 'red';
}) (document, window);
