/*\

title: $:/plugins/felixhayashi/topstoryview/focus_notifier.js
type: application/javascript
module-type: startup

@preserve

\*/
(function(){"use strict";exports.name="focus_notifier";exports.platforms=["browser"];exports.after=["story"];exports.synchronous=true;exports.startup=function(){var e=require("$:/plugins/felixhayashi/topstoryview/config.js").config;var t=function(){var t=s.getElementsByClassName(e.classNames.tiddlerFrame);if(!t.length)return;var r=t[0].getBoundingClientRect().left;var l=document.elementFromPoint(r,i+1);if($tw.utils.hasClass(l,e.classNames.tiddlerFrame)){var o=l.getElementsByClassName(e.classNames.tiddlerTitle)[0];if(o){var d=o.innerText||o.textContent;if(d!==a&&$tw.wiki.getTiddler(d)){a=d;$tw.wiki.addTiddler(new $tw.Tiddler({title:e.references.focussedTiddlerStore,text:a}))}}}n=false};var s=document.getElementsByClassName(e.classNames.storyRiver)[0];var r=$tw.wiki.getTiddler(e.references.focusOffsetStore);var i=r?parseInt(r.fields.text):150;var a=null;var n=false;window.addEventListener("scroll",function(s){if(!n){n=true;window.setTimeout(t,e.checkbackTime)}},false);t()}})();