/*\

title: $:/plugins/felixhayashi/topstoryview/config.js
type: application/javascript
module-type: library

@preserve

\*/
(function(){"use strict";exports.config={classNames:{storyRiver:"tc-story-river",backDrop:"story-backdrop",tiddlerFrame:"tc-tiddler-frame",tiddlerTitle:"tc-title"},references:{focusOffsetStore:"$:/config/storyRiver/top/focusOffset",scrollOffsetStore:"$:/config/storyRiver/top/scrollOffset",focussedTiddlerStore:"$:/temp/focussedTiddler",refreshTrigger:"$:/temp/focussedTiddler/refresh"},checkbackTime:$tw.utils.getAnimationDuration(),fn:{extractTitleFromFrame:function(e,t,r){if(!(e instanceof Element))return;if(!$tw.utils.hasClass(e,t))return;var s=e.getElementsByClassName(r)[0];if(s){var i=s.innerText||s.textContent;return i.trim()}}}}})();