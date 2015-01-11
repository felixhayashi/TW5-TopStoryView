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
  exports.after = ["rootwidget"];
  exports.synchronous = true;
  
  /***************************** CODE ******************************/

  exports.startup = function() {
    
    var config = {
      // Essential tiddlywiki classes that we depend on
      classNames: {
        tiddlerFrame: "tc-tiddler-frame",
        storyRiver: "tc-story-river",
        tiddlerTitle: "tc-title"
      },
      references: {
        // A user may specify which vertical offset defines
        // the current focus. Note that setting this tiddlers
        // value also influences the scrolling behavior.
        offsetTopStore: "$:/config/storyRiver/top/scrollOffset",
        // This tiddler holds a reference to the currently focussed
        // tiddler. A tiddler is focussed if it was scrolled to
        // reach the top offset.
        focussedTiddlerStore: "$:/temp/focussedTiddler"
      },
      // Time after a scroll event that has to elapse before we
      // check which tiddler is actually focussed. This is necessary
      // to avoid updates that only result from scroll animations.
      checkbackTime: $tw.utils.getAnimationDuration()
    };
        
    var storyRiverElement = document.getElementsByClassName(config.classNames.storyRiver)[0];
    
    var tObj = $tw.wiki.getTiddler(config.references.offsetTopStore);
    var offsetTop = (tObj ? parseInt(tObj.fields.text) : 71); // px
    
    var curRef = null;
    var hasActiveTimeout = false;
    
    window.addEventListener('scroll', function(event) {
      
      if(hasActiveTimeout) return; // 
      
      hasActiveTimeout = true;
      
      window.setTimeout(function() {
      
        var frames = storyRiverElement.getElementsByClassName(config.classNames.tiddlerFrame);
        
        if(!frames.length) return;
        
        var offsetLeft = frames[0].getBoundingClientRect().left;
        // + 1px as sometimes scroll is not correctly on point
        var target = document.elementFromPoint(offsetLeft, offsetTop + 1);
        
        if($tw.utils.hasClass(target, config.classNames.tiddlerFrame)) {
          
          var title = target.getElementsByClassName(config.classNames.tiddlerTitle)[0];
          if(title) {
            title = title.innerHTML.trim();
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
        
      }, 500);
      
    }, false);
        
  };

})();
