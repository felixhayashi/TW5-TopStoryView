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
    
    var tObj = $tw.wiki.getTiddler(config.references.scrollOffsetStore);
    this.pageScroller.offsetTop = (tObj ? parseInt(tObj.fields.text) : 71); // px
    
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

  // Hack to trigger a recheck on the currently focussed tiddler
  TopStoryView.prototype.startZeroScroll = function() {
    var scrPos = $tw.utils.getScrollPosition();
    window.scrollTo(scrPos.x, scrPos.y+1);
    window.scrollTo(scrPos.x, scrPos.y);
  };
    
  TopStoryView.prototype.insert = function(widget) {
    
    var targetElement = widget.findFirstDomNode(),
      duration = $tw.utils.getAnimationDuration();
    // Abandon if the list entry isn't a DOM element (it might be a text node)
    if(!(targetElement instanceof Element)) {
      return;
    }
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
      // force a recheck
      this.startZeroScroll();
    }.bind(this),duration);
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

    
  TopStoryView.prototype.remove = function(widget) {
    
    var targetElement = widget.findFirstDomNode(),
      duration = $tw.utils.getAnimationDuration(),
      removeElement = function() {
        widget.removeChildDomNodes();
        // force a recheck
        this.startZeroScroll();
      }.bind(this);
    // Abandon if the list entry isn't a DOM element (it might be a text node)
    if(!(targetElement instanceof Element)) {
      removeElement();
      return;
    }
    // Get the current height of the tiddler
    var currWidth = targetElement.offsetWidth,
      computedStyle = window.getComputedStyle(targetElement),
      currMarginBottom = parseInt(computedStyle.marginBottom,10),
      currMarginTop = parseInt(computedStyle.marginTop,10),
      currHeight = targetElement.offsetHeight + currMarginTop;
    // Remove the dom nodes of the widget at the end of the transition
    setTimeout(removeElement,duration);
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