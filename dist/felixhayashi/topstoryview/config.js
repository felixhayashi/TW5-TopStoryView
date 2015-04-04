/*\

title: $:/plugins/felixhayashi/topstoryview/config.js
type: application/javascript
module-type: library

@preserve

\*/
(function(){"use strict";exports.config={classNames:{storyRiver:"tc-story-river",backDrop:"story-backdrop",tiddlerFrame:"tc-tiddler-frame",tiddlerTitle:"tc-title"},references:{focusOffsetStore:"$:/config/storyRiver/top/focusOffset",scrollOffsetStore:"$:/config/storyRiver/top/scrollOffset",focussedTiddlerStore:"$:/temp/focussedTiddler",navigateToBehaviour:"$:/plugins/felixhayashi/topstoryview/navigateToBehaviour",refreshTrigger:"$:/temp/focussedTiddler/refresh"},checkbackTime:$tw.utils.getAnimationDuration(),fn:{extractTitleFromFrame:function(e,t,r){if(!(e instanceof Element))return;if(!$tw.utils.hasClass(e,t))return;var i=e.getElementsByClassName(r)[0];if(i){var s=i.innerText||i.textContent;return s.trim()}}}}})();