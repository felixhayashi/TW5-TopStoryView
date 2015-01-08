# TopStoryView

TopStoryView is a TiddlyWiki plugin that adds another story view to tiddlywiki.

You can use this plugin by importing it and switching your wiki's story view to *top* story view.

![selection_426](https://cloud.githubusercontent.com/assets/4307137/5669923/f6409ca6-977b-11e4-94ba-134248aa7305.png)

## What it does

* Any scrolling action that results from a click (also called navigating) will scroll the tiddler to the very top of the viewport.
* The plugin respects the top-offset of the story river. This means if you add a top padding to the story river or add elements above the river that push it downwards, the scrolling will acknowledge it.

## Todos

Newly opened tiddlers should open

* at the very top if not opened from within a tiddler's body
* opened right above the tiddler from where the local link was opened.