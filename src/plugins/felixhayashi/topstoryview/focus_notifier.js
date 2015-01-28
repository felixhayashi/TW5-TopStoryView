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
      
      //~ console.log("handleScrollEvent called");
      
      var frames = storyRiverElement.getElementsByClassName(config.classNames.tiddlerFrame);
      
      if(frames.length) {
      
        //~ console.log("Frames contained in storyriver", frames);
        
        var offsetLeft = frames[0].getBoundingClientRect().left;

        //~ console.log("Trigger offset:", "left", offsetLeft, "top", offsetTop);

        // + 1px as sometimes scroll is not correctly on point
        var target = document.elementFromPoint(offsetLeft + 1, offsetTop);

        //~ console.log("Focussed target by offset: ", target);
        
        var title = config.fn.extractTitleFromFrame(target,
                                                    config.classNames.tiddlerFrame,
                                                    config.classNames.tiddlerTitle);
        
        //~ console.log("Title", title);
        if(title !== curRef && $tw.wiki.getTiddler(title)) { // focus changed
          //~ console.log("Focus changed");
          curRef = title;
        }
        
      } else {
        curRef = "";
      }
      
      $tw.wiki.addTiddler(new $tw.Tiddler({
        title: config.references.focussedTiddlerStore,
        text: curRef
      }));
      
      hasActiveTimeout = false;
      
    };
    
    

    var storyRiverElement = document.getElementsByClassName(config.classNames.storyRiver)[0];
    
    var tObj = $tw.wiki.getTiddler(config.references.focusOffsetStore);
    var offsetTop = (tObj ? parseInt(tObj.fields.text) : 150); // px
    
    var curRef = null;
    var hasActiveTimeout = false;
    
    $tw.wiki.addEventListener("change", function(changedTiddlers) {
      
      if(changedTiddlers[config.references.refreshTrigger]) {
        handleScrollEvent();
      }
      
    });
    
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
