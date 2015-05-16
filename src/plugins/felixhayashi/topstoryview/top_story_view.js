/*\
title: $:/plugins/felixhayashi/topstoryview/top.js
type: application/javascript
module-type: storyview

Views the story as a linear sequence

@preserve

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

  /**************************** IMPORTS ****************************/
   
  var config = require("$:/plugins/felixhayashi/topstoryview/config.js").config;

  /***************************** CODE ******************************/

  var easing = "cubic-bezier(0.645, 0.045, 0.355, 1)"; // From http://easings.net/#easeInOutCubic

  var TopStoryView = function(listWidget) {
        
    this.listWidget = listWidget;
        
    this.pageScroller = new $tw.utils.PageScroller();
    this.pageScroller.scrollIntoView = this.scrollIntoView;
    this.pageScroller.storyRiverDomNode = document.getElementsByClassName(config.classNames.storyRiver)[0];
    
    // load user config
    var confRef = $tw.wiki.getTiddler(config.references.userConfig);
    var userConf = (confRef ? confRef.fields : {});
    
    var scrollOffset = parseInt(userConf["scroll-offset"]);
    this.pageScroller.scrollOffset = (isNaN(scrollOffset) ? 71 : scrollOffset); // px
    //~ console.log("tsv:", "scrollOffset", this.pageScroller.scrollOffset);
    
    this.recalculateBottomSpace();
    
  };
  
  /**
   * This function is called by the list widget that is associated with
   * the wiki's story view on every refresh before it started to refresh itself
   */
  TopStoryView.prototype.refreshStart = function(changedTiddlers,changedAttributes) {
    // -  
  };
  
  /**
   * This function is called by the list widget that is associated with
   * the wiki's story view on every refresh after it refreshed itself
   */
  TopStoryView.prototype.refreshEnd = function(changedTiddlers,changedAttributes) {
    // -
  };

  /**
   * This function is called by the list widget that is associated with
   * the wiki's story view everytime the history changes. In other words,
   * if the history list tiddler (i.e usually $:/HistoryList) is contained
   * in the changedTiddlers hashmap, navigateTo will be called. 
   * 
   * If a list item has been newly inserted into the list, the `insert()`
   * method is called first by the widget and `navigateTo()` will be called
   * subsequently.
   */ 
  TopStoryView.prototype.navigateTo = function(historyInfo) {
     
    var listElIndex = this.listWidget.findListItem(0, historyInfo.title);
    
    if(listElIndex === undefined) return;
      
    var listItemWidget = this.listWidget.children[listElIndex];
    var targetElement = listItemWidget.findFirstDomNode();
    
    // when should this ever happen? Anyhow...
    if(!(targetElement instanceof Element)) return;
            
    this.pageScroller.scrollIntoView(targetElement);
    
  };
    
  /**
   * Function is called when a list item is inserted into the list
   * widget that is associated with the story river.
   */
  TopStoryView.prototype.insert = function(listItemWidget) {
    
    if(!listItemWidget) return;
        
    var targetElement = listItemWidget.findFirstDomNode();
    if(!(targetElement instanceof Element)) return;
                 
    this.startInsertAnimation(targetElement, function() {
      // already recalculate (even if not visible yet) so navigateTo will be possible
      this.recalculateBottomSpace();
      this.pageScroller.scrollIntoView(targetElement);
    }.bind(this));
    
  };
  
  /**
   * Function is called when an item is removed from the list widget
   * associated with the story river. At the time `remove()` is called,
   * the listItemWidget passed as parameter is still contained in
   * `this.storyList.children`. This means that `this.storyList.children.length`
   * will always (!) be greater 0.
   */
  TopStoryView.prototype.remove = function(listItemWidget) {

    if(!listItemWidget) return;
    
    var targetElement = listItemWidget.findFirstDomNode();
    if(!(targetElement instanceof Element)) {
      // when would this happen? anyhow...
      listItemWidget.removeChildDomNodes();
      return;
    }
    
    // needs to be calculated before remove animation
    var isLast = (this.getLastFrame() === targetElement);
    
    this.startRemoveAnimation(listItemWidget, targetElement, function() {

      // since it is not visible anymore, we can already remove the frame
      listItemWidget.removeChildDomNodes();
      
      // update state
      this.recalculateBottomSpace();
      
      if(isLast) {
        // focus new last frame
        //~ console.log("tsv:", "lastframe", this.getLastFrame());
        this.pageScroller.scrollIntoView(this.getLastFrame());
      }
      
    }.bind(this));
    
  };
    
  /**
   * Returns the last tiddler frame or null if no tiddler is contained
   * in the river.
   */
  TopStoryView.prototype.getLastFrame = function() {
    
    var lastItem = this.listWidget.children[this.listWidget.children.length-1];
    return (lastItem ? lastItem.findFirstDomNode() : null);
    
  };
  
  /**
   * Called after insert- or remove-animations finished when the last
   * tiddler changed. Recalculates the bottom space: In order to be
   * able to scroll the last frame to the top of the window,
   * we need to add a padding below.
   */
  TopStoryView.prototype.recalculateBottomSpace = function() {

    var sr = this.pageScroller.storyRiverDomNode;
    
    if(this.getLastFrame()) {

      var rect = this.getLastFrame().getBoundingClientRect();
      var windowHeight = window.innerHeight;
        
      if(rect.height < windowHeight) {
        
        // recalculate style
        sr.style["paddingBottom"] = (windowHeight - rect.height) + "px";
                
        return;
      }
      
    }
    
    // in any other case
    sr.style["paddingBottom"] = "";

  };
  
  /**
   * Starts an animated scroll to bring the specified element to the top
   * of the window's viewport.
   */
  TopStoryView.prototype.scrollIntoView = function(element) {
    
    if(!element) return;
    
    var duration = $tw.utils.getAnimationDuration();
    // Now get ready to scroll the body
    this.cancelScroll();
    this.startTime = Date.now();
    var scrollPosition = $tw.utils.getScrollPosition();
      
    // Get the client bounds of the element and adjust by the scroll position
    var clientBounds = element.getBoundingClientRect(),
      bounds = {
        left: clientBounds.left + scrollPosition.x,
        top: clientBounds.top + scrollPosition.y,
        width: clientBounds.width,
        height: clientBounds.height
      };
      // We'll consider the horizontal and vertical scroll directions separately via this function
      var getEndPos = function(targetPos,targetSize,currentPos,currentSize) {
        // If the target is above/left of the current view, then scroll to it's top/left
        if(targetPos <= currentPos) {
          return targetPos;
        // If the target is smaller than the window and the scroll position is too far up, then scroll till the target is at the bottom of the window
        } else if(targetSize < currentSize && currentPos < (targetPos + targetSize - currentSize)) {
          return targetPos + targetSize - currentSize;
        // If the target is big, then just scroll to the top
        } else if(currentPos < targetPos) {
          return targetPos;
        // Otherwise, stay where we are
        } else {
          return currentPos;
        }
      },
      endX = getEndPos(bounds.left,bounds.width,scrollPosition.x,window.innerWidth),
      endY = bounds.top - this.scrollOffset;
    // Only scroll if necessary
    if(endX !== scrollPosition.x || endY !== scrollPosition.y) {
      var self = this,
        drawFrame;
      drawFrame = function () {
        var t;
        if(duration <= 0) {
          t = 1;
        } else {
          t = ((Date.now()) - self.startTime) / duration; 
        }
        if(t >= 1) {
          self.cancelScroll();
          t = 1;
        }
        t = $tw.utils.slowInSlowOut(t);
        window.scrollTo(scrollPosition.x + (endX - scrollPosition.x) * t,scrollPosition.y + (endY - scrollPosition.y) * t);
        if(t < 1) {
          self.idRequestFrame = self.requestAnimationFrame.call(window,drawFrame);
        }
      };
      drawFrame();
    }
  };

  /**
   * Animation for when a tiddler is inserted
   */
  TopStoryView.prototype.startInsertAnimation = function(targetElement, callback) {
    
    var duration = $tw.utils.getAnimationDuration();
    
    // Get the current height of the tiddler
    var computedStyle = window.getComputedStyle(targetElement),
      currMarginBottom = parseInt(computedStyle.marginBottom,10),
      currMarginTop = parseInt(computedStyle.marginTop,10),
      currHeight = targetElement.offsetHeight + currMarginTop;
    // Reset the margin once the transition is over
    setTimeout(function() {
      $tw.utils.setStyle(targetElement,[
        {transition: "none"},
        {marginBottom: ""}
      ]);
      callback();
    },duration);
    // Set up the initial position of the element
    $tw.utils.setStyle(targetElement,[
      {transition: "none"},
      {marginBottom: (-currHeight) + "px"},
      {opacity: "0.0"}
    ]);
    $tw.utils.forceLayout(targetElement);
    // Transition to the final position
    $tw.utils.setStyle(targetElement,[
      {transition: "opacity " + duration + "ms " + easing + ", " +
            "margin-bottom " + duration + "ms " + easing},
      {marginBottom: currMarginBottom + "px"},
      {opacity: "1.0"}
    ]);
  };
  
  /**
   * Animation for when a tiddler is removed
   */
  TopStoryView.prototype.startRemoveAnimation = function(listItemWidget, targetElement, callback) {
    
    var duration = $tw.utils.getAnimationDuration();

    // Get the current height of the tiddler
    var currWidth = targetElement.offsetWidth,
      computedStyle = window.getComputedStyle(targetElement),
      currMarginBottom = parseInt(computedStyle.marginBottom,10),
      currMarginTop = parseInt(computedStyle.marginTop,10),
      currHeight = targetElement.offsetHeight + currMarginTop;
    // Remove the dom nodes of the listItemWidget at the end of the transition
    setTimeout(callback,duration);
    // Animate the closure
    $tw.utils.setStyle(targetElement,[
      {transition: "none"},
      {transform: "translateX(0px)"},
      {marginBottom:  currMarginBottom + "px"},
      {opacity: "1.0"}
    ]);
    $tw.utils.forceLayout(targetElement);
    $tw.utils.setStyle(targetElement,[
      {transition: $tw.utils.roundTripPropertyName("transform") + " " + duration + "ms " + easing + ", " +
            "opacity " + duration + "ms " + easing + ", " +
            "margin-bottom " + duration + "ms " + easing},
      {transform: "translateX(-" + currWidth + "px)"},
      {marginBottom: (-currHeight) + "px"},
      {opacity: "0.0"}
    ]);
    
  };

  exports.top = TopStoryView;

})();