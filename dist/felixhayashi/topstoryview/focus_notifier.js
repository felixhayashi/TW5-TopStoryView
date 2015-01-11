/*\

title: $:/plugins/felixhayashi/topstoryview/focus_notifier.js
type: application/javascript
module-type: startup

@preserve

\*/
(function(){"use strict";exports.name="focus_notifier";exports.platforms=["browser"];exports.after=["rootwidget"];exports.synchronous=true;exports.startup=function(){var e={classNames:{tiddlerFrame:"tc-tiddler-frame",storyRiver:"tc-story-river",tiddlerTitle:"tc-title"},references:{offsetTopStore:"$:/config/storyRiver/top/scrollOffset",focussedTiddlerStore:"$:/temp/focussedTiddler"},checkbackTime:$tw.utils.getAnimationDuration()};var t=document.getElementsByClassName(e.classNames.storyRiver)[0];var r=$tw.wiki.getTiddler(e.references.offsetTopStore);var s=r?parseInt(r.fields.text):71;var i=null;var l=false;window.addEventListener("scroll",function(r){if(l)return;l=true;window.setTimeout(function(){var r=t.getElementsByClassName(e.classNames.tiddlerFrame);if(!r.length)return;var o=r[0].getBoundingClientRect().left;var a=document.elementFromPoint(o,s+1);if($tw.utils.hasClass(a,e.classNames.tiddlerFrame)){var n=a.getElementsByClassName(e.classNames.tiddlerTitle)[0];if(n){n=n.innerHTML.trim();if(n!==i&&$tw.wiki.getTiddler(n)){i=n;$tw.wiki.addTiddler(new $tw.Tiddler({title:e.references.focussedTiddlerStore,text:i}))}}}l=false},500)},false)}})();