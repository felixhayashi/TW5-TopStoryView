/*\

title: $:/plugins/felixhayashi/topstoryview/focus_notifier.js
type: application/javascript
module-type: startup

@preserve

\*/
(function(){"use strict";exports.name="focus_notifier";exports.platforms=["browser"];exports.after=["story"];exports.synchronous=true;exports.startup=function(){var e=require("$:/plugins/felixhayashi/topstoryview/config.js").config;var t=function(){var t=r.getElementsByClassName(e.classNames.tiddlerFrame);if(t.length){var s=t[0].getBoundingClientRect().left;var l=document.elementFromPoint(s+1,i);var d=e.fn.extractTitleFromFrame(l,e.classNames.tiddlerFrame,e.classNames.tiddlerTitle);if(d!==a&&$tw.wiki.getTiddler(d)){a=d;$tw.wiki.addTiddler(new $tw.Tiddler({title:e.references.focussedTiddlerStore,text:a}))}}else{if(a){a="";$tw.wiki.addTiddler(new $tw.Tiddler({title:e.references.focussedTiddlerStore,text:a}))}}n=false};var r=document.getElementsByClassName(e.classNames.storyRiver)[0];var s=$tw.wiki.getTiddler(e.references.focusOffsetStore);var i=s?parseInt(s.fields.text):150;var a=null;var n=false;$tw.wiki.addEventListener("change",function(r){if(r[e.references.refreshTrigger]){t()}});window.addEventListener("scroll",function(r){if(!n){n=true;window.setTimeout(t,e.checkbackTime)}},false);t()}})();