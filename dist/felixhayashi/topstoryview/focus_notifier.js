/*\

title: $:/plugins/felixhayashi/topstoryview/focus_notifier.js
type: application/javascript
module-type: startup

@preserve

\*/
(function(){"use strict";exports.name="focus_notifier";exports.platforms=["browser"];exports.after=["rootwidget"];exports.synchronous=true;exports.startup=function(){var e={classNames:{tiddlerFrame:"tc-tiddler-frame",storyRiver:"tc-story-river",tiddlerTitle:"tc-title"},references:{focusOffsetStore:"$:/config/storyRiver/top/focusOffset",focussedTiddlerStore:"$:/temp/focussedTiddler"},checkbackTime:$tw.utils.getAnimationDuration()};var t=function(){var t=r.getElementsByClassName(e.classNames.tiddlerFrame);if(!t.length)return;var s=t[0].getBoundingClientRect().left;var o=document.elementFromPoint(s,i+1);if($tw.utils.hasClass(o,e.classNames.tiddlerFrame)){var d=o.getElementsByClassName(e.classNames.tiddlerTitle)[0];if(d){d=d.innerHTML.trim();if(d!==a&&$tw.wiki.getTiddler(d)){a=d;$tw.wiki.addTiddler(new $tw.Tiddler({title:e.references.focussedTiddlerStore,text:a}))}}}l=false};var r=document.getElementsByClassName(e.classNames.storyRiver)[0];var s=$tw.wiki.getTiddler(e.references.focusOffsetStore);var i=s?parseInt(s.fields.text):150;var a=null;var l=false;window.addEventListener("scroll",function(r){if(!l){l=true;window.setTimeout(t,e.checkbackTime)}},false);t()}})();