# TopStoryView

TopStoryView is a TiddlyWiki plugin that adds another story view to tiddlywiki.

## How to install and configure it?

You can use this plugin by importing it (e.g. from the [TiddlyMap demo site](http://bit.ly/tiddlymap)) and switching your wiki's story view to *top* story view.

![selection_426](https://cloud.githubusercontent.com/assets/4307137/5669923/f6409ca6-977b-11e4-94ba-134248aa7305.png)

You can configure the plugin by opening TiddlyWiki's configuration and selecting TopStoryView in the plugin section.

![selection_584](https://cloud.githubusercontent.com/assets/4307137/6992188/3c8f75e8-dabf-11e4-8d04-04bb64c7dc4e.png)

## Motivation

See this discussion https://github.com/Jermolene/TiddlyWiki5/issues/1290

## What it does

### It changes the scrolling behavior

* When opening or navigating to a tiddler, the site is scrolled until the title of the tiddler reaches the very top of the browser window.
  * Even the last tiddler is scrolled till it reaches the top. This works because the plugin adds an invisible spacer at the bottom so the tiddler can be scrolled to the top.
* The plugin scrolls tiddlers to 71px below the window border. To change this offset edit the body of `$:/config/storyRiver/top/scrollOffset` into e.g. `60px` (only pixel values are allowed).

### It changes the insert behavior

Tiddlers that do not exist in the story river are always inserted at the very top. No matter from which point the where opened or created. Why? This way it is ensured that the river reflects the browsing history. The motto is: "new content pushes down old content". Alternatively, you can configure the plugin to always insert a tiddler at the very top, even if it already existed in the story river.

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