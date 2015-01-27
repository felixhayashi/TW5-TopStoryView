# TopStoryView

TopStoryView is a TiddlyWiki plugin that adds another story view to tiddlywiki.

You can use this plugin by importing it and switching your wiki's story view to *top* story view.

![selection_426](https://cloud.githubusercontent.com/assets/4307137/5669923/f6409ca6-977b-11e4-94ba-134248aa7305.png)

## What it does

### It changes the scrolling behavior

* Any scrolling action that results from a click (also called navigating) will scroll the tiddler to the very top of the viewport.
  * Yes, even the last tiddler is scrolled till it reaches the top! The plugin exclusively adds the space the last tiddler needs to be scrolled till the top.
* The plugin scrolls tiddlers to 71px below the window border. To change this offset edit the body of `$:/config/storyRiver/top/scrollOffset` into e.g. `60px` (only pixel values are allowed).

### It changes the insert behavior

Tiddlers are always inserted at the very top of the story-river. No matter from which point the where opened or created. Why? This way it is ensured that the river reflects the browsing history. The motto is: "new content pushes down old content".

### It gives you Information on the currently focussed tiddler

Everytime a tiddler's body reaches a defined threshold, the value of `$:/temp/focussedTiddler` is updated with the title of the currently focussed tiddler. The threshold can be defined via `$:/config/storyRiver/top/scrollOffset`, where you can set the text to e.g. `100px` (only pixel values are allowed) -- the default is `150px`. You can use this information to trigger actions when the user scrolled to a certain tiddler.

Here are some ideas how you could use this feature:

You could write a small widget that listens to the changes of `$:/temp/focussedTiddler` to 

* Update the current permalink in the address bar
* Change the page title
* Unfold the table of contents or highlight the current topic.
* Log the user behavior

### What happens if a tiddler at the bottom of the story-river is removed?

In this case the plugin will trigger a scroll event to refocus the tiddler above the formerly last tiddler.

## How it looks like

The [demo site](http://bit.ly/tiddlymap) of TiddlyMap uses this story view.

Note, that TiddlyMap uses the *focussed tiddler* feature for its live view (see sidebar). Now that's cool or not?