/*\

title: $:/plugins/felixhayashi/topstoryview/focus_notifier.js
type: application/javascript
module-type: startup

@preserve

\*/
(function(){"use strict";exports.name="focus_notifier";exports.platforms=["browser"];exports.after=["story"];exports.synchronous=true;exports.startup=function(){var e=require("$:/plugins/felixhayashi/topstoryview/config.js").config;var t=function(){var t=r.getElementsByClassName(e.classNames.tiddlerFrame);if(t.length){var s=t[0].getBoundingClientRect().left;var l=document.elementFromPoint(s+1,i);if($tw.utils.hasClass(l,e.classNames.tiddlerFrame)){var o=l.getElementsByClassName(e.classNames.tiddlerTitle)[0];if(o){var f=o.innerText||o.textContent;f=f.trim();if(f!==a&&$tw.wiki.getTiddler(f)){a=f}}}}else{a=""}$tw.wiki.addTiddler(new $tw.Tiddler({title:e.references.focussedTiddlerStore,text:a}));n=false};var r=document.getElementsByClassName(e.classNames.storyRiver)[0];var s=$tw.wiki.getTiddler(e.references.focusOffsetStore);var i=s?parseInt(s.fields.text):150;var a=null;var n=false;$tw.wiki.addEventListener("change",function(r){if(r[e.references.refreshTrigger]){t()}});window.addEventListener("scroll",function(r){if(!n){n=true;window.setTimeout(t,e.checkbackTime)}},false);t()}})();