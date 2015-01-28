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
    this.pageScroller.storyRiverElement = document.getElementsByClassName(config.classNames.storyRiver)[0];
    this.pageScroller.backDropElement = document.getElementsByClassName(config.classNames.backDrop)[0];
    
    var tObj = $tw.wiki.getTiddler(config.references.scrollOffsetStore);
    this.pageScroller.offsetTop = (tObj ? parseInt(tObj.fields.text) : 71); // px
    
    this.lastFrame = null;
    
    this.handleChange();
    
  };

  TopStoryView.prototype.navigateTo = function(historyInfo) {
     
    var listElementIndex = this.listWidget.findListItem(0,historyInfo.title);
    if(listElementIndex === undefined) {
      return;
    }
    var listItemWidget = this.listWidget.children[listElementIndex],
        targetElement = listItemWidget.findFirstDomNode();
    
    if(targetElement instanceof Element) {
      this.pageScroller.scrollIntoView(targetElement);
    }
    
  };

  TopStoryView.prototype.scrollIntoView = function(element) {

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
      endY = bounds.top - this.offsetTop;
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
  }

// shuffle via display none;

  TopStoryView.prototype.handleChange = function(change, targetElement) {
    
    // recalculate necessary height
    var sr = this.pageScroller.storyRiverElement;
    var frames = sr.getElementsByClassName(config.classNames.tiddlerFrame);
    var frame = frames[frames.length-1];
    
    if(frame && this.lastFrame !== frame) { // another frame became the last frame
      
      var rect = frame.getBoundingClientRect();
      var windowHeight = window.innerHeight;
      
      if(rect.height < windowHeight) {
        sr.style["paddingBottom"] = (windowHeight - rect.height) + "px";
      } else {
        sr.style["paddingBottom"] = "";
      }
    
    }
    
    // set last frame to frame. frame might be null if no frame exists.
    this.lastFrame = frame;
    
    // force a refresh
    $tw.wiki.addTiddler(new $tw.Tiddler({
      title: config.references.refreshTrigger
    }));
     
  };
  
  /**
   * Function is called on every insert in the story river. An exception
   * is made by tw at startup: The initial set of tiddlers is added without
   * calling insert on every tiddler.
   */
  TopStoryView.prototype.insert = function(widget) {

    var targetElement = widget.findFirstDomNode();
    
    if(!(targetElement instanceof Element)) {
      return;
    }
    var title = config.fn.extractTitleFromFrame(targetElement,
                                                config.classNames.tiddlerFrame,
                                                config.classNames.tiddlerTitle);
    var tObj = $tw.wiki.getTiddler(title);
    
    if(tObj && !tObj.isDraft()) {
      // put it at the very top; it's ok if sibling is null
      var sr = this.pageScroller.storyRiverElement;
      sr.insertBefore(targetElement,
                      sr.firstElementChild.nextSibling);
    }
    
    this.startInsertAnimation(targetElement, function() {
      this.handleChange("insert", targetElement);
    }.bind(this));
    
  };
  
  /**
   * Function is called on every remove in the story river.
   */
  TopStoryView.prototype.remove = function(widget) {

    var targetElement = widget.findFirstDomNode();
    
    if(!(targetElement instanceof Element)) {
      widget.removeChildDomNodes();
      return;
    }
        
    this.startRemoveAnimation(widget, targetElement, function() {
      var isRescroll = (this.lastFrame === targetElement);
      widget.removeChildDomNodes();
      this.handleChange("remove", targetElement);
            
      if(isRescroll && this.lastFrame) {
        this.pageScroller.scrollIntoView(this.lastFrame);
      }
      
    }.bind(this));
    
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
  TopStoryView.prototype.startRemoveAnimation = function(widget, targetElement, callback) {
    
    var duration = $tw.utils.getAnimationDuration();

    // Get the current height of the tiddler
    var currWidth = targetElement.offsetWidth,
      computedStyle = window.getComputedStyle(targetElement),
      currMarginBottom = parseInt(computedStyle.marginBottom,10),
      currMarginTop = parseInt(computedStyle.marginTop,10),
      currHeight = targetElement.offsetHeight + currMarginTop;
    // Remove the dom nodes of the widget at the end of the transition
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