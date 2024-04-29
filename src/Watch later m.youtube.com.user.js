// ==UserScript==
// @name        Watch later m.youtube.com
// @namespace   Violentmonkey Scripts
// @match       https://m.youtube.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 29/04/2024, 9:27:02 am
// @require     https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js
// ==/UserScript==
var myElement = document.body;
var myOptions = {};
var hammertime = new Hammer(myElement, myOptions);
hammertime.on('pan', function (event) {
  if (event.additionalEvent == 'panright' || event.additionalEvent == 'panleft') {
    console.log('event', event);
    console.log('event.target', event.target);
    let elItemNames = ['ytm-video-with-context-renderer', 'ytm-rich-item-renderer', 'ytm-video-card-renderer', 'ytm-playlist-video-renderer', 'ytm-video-preview']
    let elItem = null;
    elItemNames.forEach(name => {
      if (elItem) return;
      elItem = event.target.closest(name) || null;
    });
    if (elItem) {
      console.log('elItem', elItem);
      let videoId = parseVideoIFromElement(elItem);
      console.log('videoId', videoId);

      // if panright
      if (event.additionalEvent == 'panright') {
        elItem.style.background = 'linear-gradient(260deg, rgba(49,224,17,1) 0%, rgba(49,224,17,0.5) 28%, rgba(49,224,17,0.01) 100%)';
        setTimeout(() => {
          elItem.style.background = '';
        }, 1000);
      }
      // if panleft
      if (event.additionalEvent == 'panleft') {
        elItem.style.background = 'linear-gradient(90deg, rgba(49,224,17,1) 0%, rgba(49,224,17,0.5) 28%, rgba(49,224,17,0.01) 100%)';
        setTimeout(() => {
          elItem.style.background = '';
        }, 1000);
      }
    }
  }
});

function parseVideoIFromElement(element) {
  let videoId = null;
  try {
    if (!videoId) {
      videoId = element.innerHTML.match(/watch\?v=([\w\d_\-]+)/)[1];
    }
  } catch (error) { }
  try {
    if (!videoId) {
      videoId = element.innerHTML.match(/shorts\/([\w\d_\-]+)/)[1];
    }
  } catch (error) { }
  return videoId;
}