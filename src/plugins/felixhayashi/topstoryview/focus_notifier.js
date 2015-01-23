/*\

title: $:/plugins/felixhayashi/topstoryview/focus_notifier.js
type: application/javascript
module-type: startup

@preserve

\*/

(function(){
  
  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";
  
  // Export name and synchronous status
  exports.name = "focus_notifier";
  exports.platforms = ["browser"];
  exports.after = ["story"];
  exports.synchronous = true;
  
  exports.startup = function() {
    
  /**************************** IMPORTS ****************************/

    var config = require("$:/plugins/felixhayashi/topstoryview/config.js").config;
    
  /***************************** CODE ******************************/
        
    var handleScrollEvent = function() {
      
      var frames = storyRiverElement.getElementsByClassName(config.classNames.tiddlerFrame);
      if(!frames.length) return;
      
      var offsetLeft = frames[0].getBoundingClientRect().left;
      // + 1px as sometimes scroll is not correctly on point
      var target = document.elementFromPoint(offsetLeft, offsetTop + 1);
      
      if($tw.utils.hasClass(target, config.classNames.tiddlerFrame)) {
        
        var el = target.getElementsByClassName(config.classNames.tiddlerTitle)[0];
        if(el) {
          var title = el.innerText || el.textContent;
          title = title.trim();
          if(title !== curRef && $tw.wiki.getTiddler(title)) { // focus changed
            curRef = title;
            $tw.wiki.addTiddler(new $tw.Tiddler({
              title: config.references.focussedTiddlerStore,
              text: curRef
            }));
          }
        }
      }
      
      hasActiveTimeout = false;
      
    };

    var storyRiverElement = document.getElementsByClassName(config.classNames.storyRiver)[0];
    
    var tObj = $tw.wiki.getTiddler(config.references.focusOffsetStore);
    var offsetTop = (tObj ? parseInt(tObj.fields.text) : 150); // px
    
    var curRef = null;
    var hasActiveTimeout = false;
    
    window.addEventListener('scroll', function(event) {
      if(!hasActiveTimeout) {
        hasActiveTimeout = true;
        window.setTimeout(handleScrollEvent, config.checkbackTime);
      }
    }, false);  
    
    // simulate a scroll after startup
    handleScrollEvent();
        
  };

})();
