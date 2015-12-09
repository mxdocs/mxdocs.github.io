---
layout: post
title:  "TransCC for the Web: 'regal.virtualos' and co."
date:   2015-11-29 08:44:00 -0600
categories: monkey_webcc
---

I've started a little project around Monkey 1's compiler. I've been putting off doing this for a while. What really got me to do this was the lack of a solid system for people to run Monkey code examples without needing to set up an environment. The idea here is to find a piece of code, and immediately be able to use or prototype it in your browser.

[b]This is not a separate compiler from 'TransCC'[/b]. With *very slight* alterations, this just works. No hassle, no hacks or edits to targets (Though, this may be beneficial later), and definitely no expensive server-side load.

TransCC uses the deprecated 'os' module, which now has been superseded by the 'brl.process', 'brl.filesystem', and 'brl.filepath' modules. Despite this apparent deprecation, a crucial code-base is still alive individually in 'os'. It's the same code, but not split up for portability. So, since my method of porting the compiler is to override the less portable version, porting won't be an issue later.

Though I don't intend to make any actual modifications to 'Trans', I have previously ported it to the 'brl' modules with little effort. So, moving forward, I may make a pull request if someone doesn't beat me to it.

The big thing to take away here is that I'm still using 'os'. Except, not really. I'm overriding 'os' completely. In my particular setup