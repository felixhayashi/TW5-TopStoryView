# TopStoryView

TopStoryView is a TiddlyWiki plugin that adds another story view to tiddlywiki -- the *top* view.

## What it does

It behaves like TiddlyWiki's *classic* story view but with a different scrolling strategy:

* When opening or navigating to a tiddler, the site is scrolled until the title of the tiddler reaches the very top of the browser window.
* Even the last tiddler is scrolled till it reaches the top. This works because the plugin adds an invisible spacer at the bottom so the tiddler can be scrolled to the top.

### What happens if a tiddler at the bottom of the story-river is removed?

In this case the plugin will put the tiddler above into focus (unless the story river is empty).

## How it looks like

The [demo site](http://bit.ly/tiddlymap) of TiddlyMap uses this story view.

## How to install and configure it?

You can use this plugin by importing it (e.g. from the [TiddlyMap demo site](http://bit.ly/tiddlymap)) and switching your wiki's story view to *top* story view.

![selection_426](https://cloud.githubusercontent.com/assets/4307137/5669923/f6409ca6-977b-11e4-94ba-134248aa7305.png)

You can configure the plugin by opening TiddlyWiki's configuration and selecting TopStoryView in the plugin section.

![selection_584](https://cloud.githubusercontent.com/assets/4307137/6992188/3c8f75e8-dabf-11e4-8d04-04bb64c7dc4e.png)

## Motivation

See this discussion https://github.com/Jermolene/TiddlyWiki5/issues/1290