// ==UserScript==
// @name        idlescript
// @namespace   idlescript
// @description Prevent Gikopoi timeouts.
// @include     http://l4cs.jpn.org/gikopoi/flash/gikopoi*/flash_gikopoi.html
// @version     1.05
// @grant       none
// @updateURL   https://github.com/roris/idlescript/raw/master/idlescript.user.js
// ==/UserScript==
(function (doc, win) {
  function now() {
    return new Date().getTime() / 1000;
  }
  var keepAliveInterval = 1500; // keep alive interval in seconds
  var intervalFn = undefined;
  var afk = false;
  var prevTime = now();
  var btnAfk = doc.createElement('button');
  var btnRula = doc.createElement('button');
  var btnList = doc.createElement('button');
  var divTimer = doc.createElement('div');
  var divPanel = doc.createElement('div');
  var txtAfk = doc.createElement('textarea');
  function sendMessage(m) {
    doc['gikopoi'].JSCallBackSendMessage(m);
  }
  function zeroPad(n) {
    return '' + n < 10 ? '0' + n : n;
  }
  function sendKeepAlive() {
    var tDelta = now() - prevTime;
    var deltaS = Math.floor(tDelta % 60);
    var deltaM = Math.floor(25 - (tDelta / 60));
    deltaS = deltaS == 0 ? 0 : 60 - deltaS;
    if (tDelta >= keepAliveInterval) {
      sendMessage(afk ? textAfk.content : '');
      divTimer.style.color = 'black';
      prevTime = now();
      deltaS = 0;
      deltaM = 1500 / 60;
    } else if (tDelta > keepAliveInterval - 10) {
      divTimer.style.color = 'red';
    }
    divTimer.textContent = zeroPad(deltaM) + ':' + zeroPad(deltaS);
  }
  function startKeepAlive() {
    prevTime = now();
    sendKeepAlive();
    intervalFn = setInterval(sendKeepAlive, 1000);
  }
  btnRula.textContent = 'Rula';
  btnRula.onclick = function () {
    sendMessage('#rula');
  };
  btnList.textContent = 'List';
  btnList.onclick = function () {
    sendMessage('#list');
  };
  btnAfk.textContent = 'AFK';
  btnAfk.onclick = function () {
    afk = !afk;
    btnAfk.style.color = afk ? 'red' : 'black';
    if (afk) {
      clearInterval(intervalFn);
      startKeepAlive();
    }
  };
  divTimer.style.color = 'black';
  divTimer.style.position = 'absolute';
  divTimer.style.right = 0;
  divTimer.style.fontSize = '24px';
  divPanel.style.position = 'fixed';
  divPanel.style.top = 0;
  divPanel.style.right = 0;
  txtAfk.style.top = 48;
  txtAfk.style.position = 'fixed';
  divPanel.appendChild(btnAfk);
  divPanel.appendChild(btnRula);
  divPanel.appendChild(btnList);
  divPanel.appendChild(divTimer);
  divPanel.appendChild(txtAfk);
  doc.body.appendChild(divPanel);
  startKeepAlive();
}) (document, window);
