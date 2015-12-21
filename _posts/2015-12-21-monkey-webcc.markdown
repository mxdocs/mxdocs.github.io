---
layout: post
title:  "WebCC: Monkey Compiler for the Web (Detailed Explanation)"
date:   2015-12-21 14:46:00 -0600
categories: monkey_webcc
---

## Introduction

{: style="color:gray; text-align: center;"}
> As a quick introduction, my name is Anthony Diamond, and I've been programming in [Monkey](http://www.monkey-x.com/Monkey/_index_.php) for nearly three years. I *currently* go by the username **[![Avatar]({{ site.url }}/assets/immutableoctet/avatar.jpg) ImmutableOctet](https://github.com/ImmutableOctet)**, and I'm the developer of the '[regal-modules](https://github.com/Regal-Internet-Brothers/regal-modules#regal-modules)' project.

Those who aren't familiar with Blitz Research Ltd, and their open-source *language*, **Monkey**, can [get more information here](http://en.wikipedia.org/w/index.php?title=Monkey_X). Additionally, Monkey X's official website can be [found here](http://www.monkey-x.com).

This article is an overview of how the WebCC project functions, and what went into making it. This isn't a complete guide, but it does detail certain key parts of the porting process.


# **Overview and Explanation**

Personally, I feel that one of the most attractive things to see when introduced to a programming language is a presentation built in that language, accessible from where you found it. This doesn't have to be anything more than a "Hello world" example, but the fact that you have access to the language immediately is a great way to entice users.

So, what is Monkey-WebCC? WebCC was started as a side project of mine, meant to port Monkey's compiler (TransCC) to JavaScript. The main purpose of this is to allow execution of Monkey code from a webpage. This is especially useful to many Monkey users, who want to run code snippets, examples, or receive help with their projects.

<center>

<p><b><i><a href="http://regal-internet-brothers.github.io/webcc">Try it out yourself</a></i></b></p>
<iframe src="/webcc" style="width: 100%; height: 480px;"></iframe>

</center>

*For a list of relevant repositories, [click here](#source-code-and-setup).*

One of the best parts about the WebCC concept is that the host doesn't have to pay for the compilation time. Not a single byte of your source code or resources is sent. No work is done by an external machine, just plug 'n' play in your browser. Not only that, but we're relying upon the existing codebase for Monkey's compiler.

Right now, one of the less desirable aspects about Monkey, is that it requires a desktop environment to run your software. A good example of this is [Rudy van Etten's Monkey programming blog](http://monkeygameprogramming.blogspot.nl), where compiled examples must be provided alongside code, instead of presenting the program at the user's discretion.

### Browser Compatibility

Though I can't get into exact details for support, most modern (HTML5 compliant) browsers should work with WebCC. There's a few dependencies, so don't be surprised if it's not perfect on your system. That being said, WebCC has been tested with the latest builds of [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new) (Very minor issues), [Google Chrome](https://www.google.com/chrome/browser/desktop), and the latest [experimental builds of *Opera*](http://www.opera.com/developer).

### == *Experience Disclaimer* ==

I'd like to get this out of the way now: I'm not a *new* programmer. I've programmed in several languages over the course of the last ~seven years, but I had ***very little experience with JavaScript prior to this project***. So, if there's a better way to do something in WebCC / '[regal.virtualos](https://github.com/Regal-Internet-Brothers/virtualos)', by all means make a pull request. Though, I should bring up that the global namespace was used for a reason.

*This article was written over the course of a week, and may have permalinks to outdated source code.*

<hr>

## How It's Done

Let me preface this portion of the article by saying:

I refuse to modify the ['trans' modules](https://github.com/blitz-research/monkey/tree/develop/modules/trans). This needs to be as minimal as possible, and provide behavior as consistent to the desktop as I can get it. The bulk of the compiler's codebase (Including reflection) should not care about WebCC. Similarly, this is an exercise in JavaScript, so Monkey shouldn't be powering the backend. Any Monkey-based frontend portions we can get away with are fine, but the intent is to use JavaScript where it's ideal.

Now that we've gotten the idea out of the way, you might be thinking:

> Wait, isn't Monkey a '*transpiler*'? Shouldn't TransCC be able to bootstrap itself into JavaScript, and run in a browser?

The short answer is: Yes and no. -- Though the compiler itself is primarily portable, there are a few dependencies that stop this from happening.

### Dependencies: The First Hurdle

The dependency that's the most limiting is the ['os' module](http://regal-internet-brothers.github.io/monkey/docs/Modules_os.html). This module covers behavior available from most Unix-like operating systems. Because of this dependency on Unix-like environments, this module couldn't be represented well on several of Monkey's targets. The official answer from BRL (Blitz Research) was to inevitably split and extend 'os' by breaking it into the '[brl.filesystem](http://regal-internet-brothers.github.io/monkey/docs/Modules_brl.filesystem.html)', '[brl.filepath](http://regal-internet-brothers.github.io/monkey/docs/Modules_brl.filepath.html)', and '[brl.process](http://regal-internet-brothers.github.io/monkey/docs/Modules_brl.process.html)' submodules.

To summarize their roles, and how they relate to 'os':

* '[brl.filepath](http://regal-internet-brothers.github.io/monkey/docs/Modules_brl.filepath.html)', in particular, isn't note worthy to this article, as it covers the portable portions of 'os'.
* '[brl.filesystem](http://regal-internet-brothers.github.io/monkey/docs/Modules_brl.filesystem.html)' covers the majority of '*os*', handling file operations and path semantics.
* '[brl.process](http://regal-internet-brothers.github.io/monkey/docs/Modules_brl.process.html)' is in charge of three major things, directory behavior (User-level path transformation), runtime details (Arguments, application-path, environment variables, etc), and finally, *execution behavior*.

Looking at that list, it's easy enough to see that the first thing we need is a comprehensive file-system. Luckily, HTML5 has us covered!

Well, sort of... HTML5 has made great strides in the storage mechanics of browsers, sporting both session and local storage for websites. This is done natively with 'sessionStorage' and 'localStorage', which are effectively maps (Dictionaries) that handle strings exclusively. The string aspect is a bit of a deterrent, but otherwise, storage is pretty straight forward. With this in mind, two of the biggest hurdles seem to be file-encoding and path semantics.

### The Ground Floor

Now that we know *where* we're going to store the files, we need to figure out how to deal with the demands of TransCC. One of the biggest problems to tackle is source-file downloads. This is still something that isn't 100% optimal, and likely won't be.

The idea here is that any call expecting a file needs to retrieve one; calls to commands like '[FileType](http://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#FileType)' and '[FileSize](http://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#FileSize)' need to clearly behave the way they're expected to. You can't return 0 on something that needs a size, and you can't act like a file exists when we don't have it yet.

Not only do we need to uphold this behavior, but everything needs to be ***synchronous*** (The elephant in the room). We can't simply use modern AJAX as it's intended, we have to work around it. Thankfully, the well supported 'XMLHttpRequest' extension has our back. Using that extension as a synchronous HTTP requester isn't recommended, but it's the only way to meet my current criteria.

Access is controlled through several abstraction layers, so if a day comes when ahead-of-time file requests are necessary, we'll be ready for it. The gist of it is that referencing a file is always safe, as long as the file exists on the remote host, or is a custom entry. If a file doesn't already exist in the *virtual* file-system, it needs to be requested, but if we already have the file, there's no need to re-download it.

The most recent versions of WebCC (And '[regal.virtualos](https://www.github.com/Regal-Internet-Brothers/virtualos)') take this a step further. Basically, content is cached locally, and kept between compilations. Each time the compiler is run, requests are made to the host. These requests are used to determine the validity of the local cache. If the files are outdated, the host will say so.

This is done either through Unix standard file-times, or by host-defined "entity tags". Both options are considered standard, and support a wide variety of servers. With that in mind, it should definitely be noted that second-time requests are practically non-existent with WebCC. Previously understood requests are not attempted again, unless done manually, forcefully, or the page has been refreshed.

Understanding these ideas is crucial to improving the user's experience, and though the setup still has its hiccups, we can still trim the fat wherever possible.

### Storing our Files

As I stated in the last segment, we can download files from an HTTP server. The next step is to figure out *how* to store it. Because we're using synchronous HTTP, the output is unfortunately limited to binary-string responses. Knowing that we are only able to retrieve strings, we need to ensure that we always get the right format. This is simple enough, since Monkey source is UTF8, and any extra files we'll need to get will play nicely with "text/plain" as our MIME type, and our custom character-set as "x-user-defined".

This is where I'd say we move on, but I decided to go the extra mile. WebCC's file-system is powered by my '[regal.virtualos](https://www.github.com/Regal-Internet-Brothers/virtualos)' module, which supports multiple encoding strategies, including binary strings, Base64, and raw 'ArrayBuffer' storage.

However, due to HTML5's local storage limitations, binary strings are used currently. As I stated, Base64 *could* be used here, but binary-strings seem to be more effective. Unfortunately, if persistent cache (Local storage) is used, 'ArrayBuffers' aren't an option.

That module already has its own abstraction layer, so as far as external resource-views go, we're solid. Raw buffers can be used when using object-based storage, but since this isn't the topic, I'm not going to dwell on it.

<hr>

### Setting up the Web Compiler - Part 1: Fooling the Source

Before we can do anything else, we need to introduce an interceptive module. I stated that 'trans' uses 'os', and *there's no changing that*. What we can change is how 'os' is implemented; the source behind it. In my case, I wanted to keep this hack clean, so I personally modified 'os' to import '[regal.virtualos](https://github.com/Regal-Internet-Brothers/virtualos)', my replacement module. I made some simple preprocessor checks for the target, and imported that module for HTML5 builds, instead.

Now, something to note about this approach is that it's only necessary when hacking this the way I am. You could easily change the target-checks, and implement "[os/native](https://github.com/blitz-research/monkey/tree/develop/modules/os/native)/os.*js*" yourself, but you won't be able to extend 'os'.

Because I wanted full control, I went with a redirect. Here's where you could modify 'trans' as well, importing your personal 'os' variant. As I said previously, I chose against this.

### Setting up the Web Compiler - Part 2: Remote File Structure

With our storage scheme and module-override(s) out of the way, there's something specific to TransCC we need to do. TransCC uses '[LoadDir](https://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#LoadDir)' in several cases, which unlike standard source imports, doesn't have a nice way of working with HTTP. My solution for this was to make a "virtual directory generator", to produce relevant file locations and meta-data. These entries are marked using a function called '[__os_createFileLink](https://github.com/Regal-Internet-Brothers/virtualos/blob/79749e63ee53898871ba8248b9cecdc8940a7893/native/os.js#L899)' internally, which produces empty-file symbols. If an application performs an operation on one of these files, or the content is otherwise necessary, a request will be made to the remote host over HTTP. This gives us compliance with '[LoadDir](https://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#LoadDir)', where file-system chronology may be necessary.

To make a long story short, I was able to achieve this by making a tool that maps out a portion of the server's local file structure. It then generates a very basic text-based format describing the elements. The source for this tool can be found using the [repository list](#source-code-and-setup).

Next, we need to parse and retrieve the generated file. To do this, I'm stepping out of JavaScript, and into Monkey itself. Because this isn't a core part of '[regal.virtualos](https://www.github.com/Regal-Internet-Brothers/virtualos)', I'm not going to limit myself to JS.

With Monkey, external code can be executed or referenced, but passing data the other way isn't standard. Monkey generates JavaScript, but the naming schemes used are translator dependent, and based on each element's context. If you want to pass data back to Monkey safely, you need to initiate the exchange from Monkey. There's some exceptions, but that's the gist of it.

When I originally started this project, my intention was to get default TransCC to run with effectively no modifications. This is the step that tripped me up, as I couldn't simply build a parser in JavaScript without making everything disjointed. Not to mention, dependent on environmental behavior.

The path I chose was to replace and modify the "driver" layer of integration. Though this does segregate WebCC further, this meant I didn't have to care about what WebCC did before it reached out to other modules. This also meant I could freely modify components local to WebCC's Monkey codebase, like target-builders. Thankfully, this is still separate from the official 'trans' module(s).

### Path Semantics

Before we move on, I'd like to illustrate the concept behind the virtual file-system's path scheme.

*To contrast just how safe the current path resolution system is, here's **what it looked like on my first attempt**:*
<center>
<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">I decided to get <a href="https://twitter.com/hashtag/MonkeyX?src=hash">#MonkeyX</a>&#39;s compiler working in HTML5. Despite fixing I/O earlier, I think I made it worse. <a href="https://t.co/mwMicFcCFv">pic.twitter.com/mwMicFcCFv</a></p>&mdash; Anthony Diamond (@immutableoctet) <a href="https://twitter.com/immutableoctet/status/670214725016248324">November 27, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

Like a normal 'os' implementation, '[virtualos](https://www.github.com/Regal-Internet-Brothers/virtualos)' allows for both *'real'* and managed paths.

Managed paths simply make assumptions about their parent context. *'Real'* paths are global positions relative to the location on the host. For example, the managed path "data/user.monkey" assumes the current directory as a prefix, making it convertible. If the user calls '[ChangeDir](http://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#CurrentDir)', the prefix to managed paths will change. In other words, "data/user.monkey" becomes "**directory_here/data/user.monkey**".

*'Real'* paths take this concept to their natural conclusion for the user. Assuming WebCC is held in a sub-directory on the host called "webcc", a *'real'* path would append that to the beginning of the path. As an example, "directory_here/data/user.monkey" becomes "**/webcc/directory_here/data/user.monkey**". This is the final local path, and that's what's used to store elements in the file-system. This might seem like a lot of work, but it ensures unique representation, and safe interoperability with existing storage entries.

The only question remains, how hard is it to use this? The answer is: Not at all. An interface function (Like those described in '[os](http://regal-internet-brothers.github.io/monkey/docs/Modules_os.html)') expects a managed path, like "data/user.monkey". Those are then able to call '[RealPath](http://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#RealPath)', which converts the path only if it isn't already a *'real'* path. This means a *'real'* path is perfectly valid for the caller to use, and safety is ensured. These functions can then call any internal routines necessary, which only deal with *'real'* paths.

A normal access of a text file can simply be:

> LoadString --> RealPath --> Abstraction Layer --> File

With little overhead during the operation. There's some small quirks to this, like mimicking operating systems' support for "..", but that's the idea behind it.

### Setting up our Environment

The first step to getting this running is creating a *"data"* folder. In our case, we've moved on to a WebCC-specific "driver", so the main file will be called "webcc.monkey". Since we're using "webcc.monkey" as our build-file, "[webcc.data](https://github.com/Regal-Internet-Brothers/webcc-monkey/tree/master/webcc.data)" is going to be our *"data"* folder. Simple enough.

Next, we need to populate [this folder](https://github.com/Regal-Internet-Brothers/webcc-monkey/tree/master/webcc.data) with the usual files of a Monkey installation. We need a "modules" sub-folder, holding the usual suspects: 'brl', 'mojo', 'opengl', etc. -- The only module we won't include the original source for (Excluding native code) is 'os'. Instead, we'll copy (Or sym-link) [the module we're currently writing](https://github.com/Regal-Internet-Brothers/virtualos), and call it "os".

**Below is a disclaimer covering the details of redistributing Monkey's source code**, and how to go about it. If you're interested in WebCC's distribution, please read the disclaimer. If you're not interested, skip it.

<center><h4><b>MODULE REDISTRIBUTION DISCLAIMER</b></h4></center>

<hr>


**If you intend to follow the same path I used, make sure to remove all NATIVE source associated with Mojo ('mojo').** This means ANY source in "modules/mojo/native", **excluding JS (JavaScript) files**. In general, you should remove all *native code* that isn't JavaScript (JS). Though, some of this is open source, source files that aren't JavaScript won't be relevant to web browsers.

**Open Source Monkey code** that is already licensed is fine, but you must follow the appropriate licenses. In my case, I am redistributing [Monkey's license](https://github.com/blitz-research/monkey/blob/develop/README.TXT).

Mojo is open source, but the only parts that are legal to redistribute are the JavaScript (JS), C++ (***GLFW specifically***), and **MONKEY** code. Targets (Not including Mojo and Mojo 2) don't have this restriction. -- In addition: **The Mojo 2 module ('mojo2') is 100% commercial *at this time*, and should not be redistributed in any form. For Mojo 2, this includes Monkey source files.**

To put it simply, if it's in the **[official Monkey repository](https://github.com/blitz-research/monkey)**, then you're free to redistribute it. DO NOT redistribute copyrighted, or otherwise non-distributable software. This includes hosting it publicly on a website, or public git repository.

> I am not a lawyer. This advice is based on my personal knowledge of Monkey's source distribution. WebCC is provided as-is, and does not hold myself, nor The Regal Internet Brothers, legally responsible. This article does not condone license violations.


<hr>
<br>


With the modules sorted out, we add "VERSIONS.TXT". "VERSIONS.TXT" is a small change-log shipped with Monkey. Funny enough, TransCC (And by extension, WebCC) looks for this file. This is parsed to know what version number to append to build-folders. This isn't required by any means, but I'm including it for the sake of completeness. It's a pretty funny way of doing it, though.

Next we have our "bin" folder. Now, in our interception-module, we'll actually have to make this the application-directory. The compiler expects this, and handles the path accordingly. This is also [why good path semantics is necessary](#path-semantics). I'm not going to go too much into this, but it's basically a weird edge-case we need to support.

Moving on to the content of "bin", we only need one file. [This is our configuration file](https://github.com/Regal-Internet-Brothers/webcc-monkey/blob/master/webcc.data/bin/config.web.txt). The name of this file depends on what you make '[HostOS](http://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#HostOS)' return from your [interception-module](https://github.com/Regal-Internet-Brothers/virtualos). For this project, I'm making the host return "web". This is also what the 'HOST' preprocessor-variable will be in browser-compiled Monkey code. This file needs to contain an assignment of the 'MODPATH' variable, and a fake path for 'HTML_PLAYER'. 'HTML_PLAYER' should hold a string you'll use to identify program execution later. If you're unsure about 'HTML_PLAYER', just leave it as-is. *Every other variable is useless here.*

Finally, we have our "targets" folder. The only targets relevant are HTML5/JS based. The disclaimer above applies only to targets that are commercial in some way. Monkey's default targets aren't commercial by themselves, but you should still use the [official GitHub repository](https://github.com/blitz-research/monkey) as a reference. For now, we'll leave the copied target(s) as-is (["html5" target](https://github.com/blitz-research/monkey/tree/develop/targets/html5)).

Our final step is to build my ["Virtual Directory Generator"](https://github.com/ImmutableOctet/monkey-tools/blob/master/Virtual_Directory_Generator/Virtual_Directory_Generator.monkey), and use it in our *"webcc.data"* folder. Remove any unwanted or irrelevant parts. The [final file](https://github.com/Regal-Internet-Brothers/webcc-monkey/blob/master/webcc.data/webcc_filesystem.txt) should only contain descriptions for the "bin", "targets", and "modules" folders, barring minor tweaks. This file should be kept in your *"data"* folder (*"webcc.data"*, etc), and named whatever you like. We'll need to remember this name for later.

With the environment set up, we can start plugging into the compiler. The next segment briefly covers how I plugged everything in.

### Setting up the Web Compiler - Part 3: Building an Interface

<center>
<p>Early WebCC running without Sandboxing</p>
<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">It just makes me tingle all over. <a href="https://t.co/PhJCn2CL9X">https://t.co/PhJCn2CL9X</a> - It finally works, and it&#39;s pretty fast so far. <a href="https://twitter.com/hashtag/MonkeyX?src=hash">#MonkeyX</a> <a href="https://t.co/2JlJUIUzWP">pic.twitter.com/2JlJUIUzWP</a></p>&mdash; Anthony Diamond (@immutableoctet) <a href="https://twitter.com/immutableoctet/status/670986091718180865">November 29, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

<hr>

I should reiterate this now: *This is not a step by step guide.* I'm going to glance over this part, so we can keep moving. You can see the outcome in the **[source code](#source-code-and-setup)**. Some notable steps I'm not covering are how I handle specifics to WebCC's codebase. Things like how I handle the behavior of '[Execute](http://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#Execute)', or how '[regal.virtualos](https://github.com/Regal-Internet-Brothers/virtualos)' retains its state between frames/documents.

I also won't go into detail about modifying TransCC to work with '[regal.virtualos](https://github.com/Regal-Internet-Brothers/virtualos)'. If you're interested, [click here](https://github.com/Regal-Internet-Brothers/webcc-monkey/blob/ec181e196ba4f74001fc9ecb54e388bb8024a454/builders/jshtml5.monkey#L14). These are details that can be observed at length through WebCC's source code, and they would take too long to describe. Even then, explaining it would just be me talking about a lot of hacks most people don't want to know about.

For questions or comments about how I got this working, you can message me on [Twitter](https://twitter.com/immutableoctet), or make an issue on [GitHub](https://github.com/Regal-Internet-Brothers/webcc-monkey).

<hr>

The following is a brief overview of how to set up TransCC on-demand in a browser. The first step is to create a custom target. ***This target will be used to build our web-compiler.*** This is very straight forward in Monkey.

In my particular case, I created a [JavaScript-only target](https://github.com/Regal-Internet-Brothers/jstool-target-monkey), and modified it from there. This was perfect for WebCC. To keep this moving, I'm not covering how to make a target. Installation is very straight forward, simply move the folder into your "targets" folder, and make sure your IDE refreshes its target-list. The WebCC-specific target can be [found below](#source-code-and-setup). I basically made an empty target, then filled it with relevant code to execute the compiler.

**If you're looking to do something like this from scratch, I recommend grabbing '[jstool](https://github.com/Regal-Internet-Brothers/jstool-target-monkey)'. This simplifies the bootstrapping process.**


With our target set up, we add a 'button' and 'textarea' to our template's HTML file. For those interested in this, be sure to copy the relevant parts of the target-template's content if you want to make a custom target.

Our 'textarea' will have this (Or similar) as our content:

> Function Main(); Print("Hello world."); End

We give it an ID, and move on.

We make a function called 'runCompiler', and have it do the following:

* Get a handle to our 'textarea'.

* Make a file-entry by calling an extension defined in our interceptive 'os' module (Native). The new file's name and contents are used to represent our 'textarea' (User-defined Monkey source).

* Execute our Monkey program (Compiler). We'll use the HTML5 target (Copied previously) to build our file. This can be either a "release" build, or a "debug" one.

In the case of '[jstool](https://github.com/Regal-Internet-Brothers/jstool-target-monkey)' and co., we use:

> executeMonkey('-target=Html5_Game', '-config=Debug', '-run', '"PATH_HERE"');

Our 'executeMonkey' function ties into '[virtualos](https://github.com/Regal-Internet-Brothers/virtualos)' if available. In other words, it only passes '[AppArgs](https://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#AppArgs)' if they can be accessed to begin with.

Next, we add the following to our 'button' tag, so it triggers the compiler:

> onclick='runCompiler();'

The gist of our next step is that we need to create an 'iframe' using DOM, and move the compiler output into it. We also make our interceptive 'os' module able to share the bulk of its context with an 'iframe'. This is done by using '[parent](https://developer.mozilla.org/en-US/docs/Web/API/Window/parent)', and sharing the values of the same variable names.

The compiled codebase has our custom 'os' module because we copied/sym-linked it previously, and we modified the target to use it. The next section glances over why and how we do this, but it's basically an import in the *"data"* folder's target.

If you're interested in how I hacked this together, here's a list of areas that are relevant (Permalinks; **may not represent the [latest source](#source-code-and-setup)**):

* '[runCompiler](https://github.com/Regal-Internet-Brothers/webcc_frontend-target-monkey/blob/5094088fd701601ce1f00be711aa52fe94e0b837/template/MonkeyGame.html#L176)'
* ["webcc/load.js" and '__exec'](https://github.com/Regal-Internet-Brothers/webcc_frontend-target-monkey/blob/5094088fd701601ce1f00be711aa52fe94e0b837/template/webcc/load.js#L94) - Relevant part of 'virtualos'; '**[Execute](https://github.com/Regal-Internet-Brothers/virtualos/blob/81ff4ede278ebaf15be0a91e78ca469e5813749d/native/os.js#L1485)**'.
* [__os_createFileEntry](https://github.com/Regal-Internet-Brothers/virtualos/blob/81ff4ede278ebaf15be0a91e78ca469e5813749d/native/os.js#L899)'s implementation.
* [How WebCC's HTML/JS builder was modified](https://github.com/Regal-Internet-Brothers/webcc-monkey/blob/ec181e196ba4f74001fc9ecb54e388bb8024a454/builders/jshtml5.monkey#L14).

### Setting up the Web Compiler - Part 4: Managing Resources

<center>
<p>WebCC running two Sandboxed Instances of a Monkey program</p>
<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">The &quot;Champagne&quot; demo running in two instances compiled in-browser using <a href="https://twitter.com/hashtag/MonkeyX?src=hash">#MonkeyX</a> &quot;WebCC&quot; (Working title). <a href="https://t.co/RRnaFmiJ1r">pic.twitter.com/RRnaFmiJ1r</a></p>&mdash; Anthony Diamond (@immutableoctet) <a href="https://twitter.com/immutableoctet/status/673535719902601216">December 6, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

With our execution sandboxed, we now need to get resources working. This is pretty straight forward; the main thing we need to do is modify the HTML5/JS target(s) we copied, so that uses of 'XMLHttpRequest' use calls to the 'os' APIs (Including extensions where necessary). There's also cases where elements' src' properties are set. These also need to be modified. You can find my changes to the HTML5 target [here](https://github.com/Regal-Internet-Brothers/webcc-monkey/tree/master/webcc.data/targets/html5), and my changes to Mojo [here](https://github.com/Regal-Internet-Brothers/webcc-monkey/tree/master/webcc.data/modules/mojo/native).

In the case of "remote paths" where a file's data is needed from a remote host, you can use one of several options provided by today's browsers. I personally use a 'resource-based' approach, where the URI of something is generated, and cached internally. For details, [click here](https://github.com/Regal-Internet-Brothers/virtualos/blob/cbb105e3481507ff228e333b03dd004ebaa40ffe/native/os.js#L1115) (Permalink).

As a side note, since we embed the output into our 'iframe', the *"data"* folder's HTML5 target should not load its version of "main.js".

### The Default Interface (Template)

I briefly went over the template we use, earlier. That's our frontend, and it's a separate part of WebCC. The frontend covers the user-interface and plugs into the *[components we've built](#source-code-and-setup)*. In WebCC's case, the frontend is a proof-of-concept. It doesn't have a proper text-area for writing code, and it's certainly not pleasing to the eyes.

WebCC's target can be [found here](https://github.com/Regal-Internet-Brothers/webcc_frontend-target-monkey). That target includes the page and source for the demo [found above](#overview-and-explanation), as well as the required files to use it as a target. With WebCC's frontend, you can add Monkey source files and resources using the "File System" manager, found on the side. If "Multiple Sessions" is checked, resources will be saved locally. Monkey source files are not currently saved between sessions.

Despite having its own target, WebCC is independent of a frontend. The compiler can be executed at the caller's discretion. This isn't perfect, but you can supply appropriate application-arguments, and execute the compiler on a normal web page. Just keep the execution environment in mind, as running WebCC will surely pause your webpage otherwise.

Using either [WebCC's target](https://github.com/Regal-Internet-Brothers/webcc_frontend-target-monkey), or '[jstool](https://github.com/Regal-Internet-Brothers/jstool-target-monkey)', you can execute the compiler with a few function calls.

<hr>
<p></p>

# **Conclusion**

With all of these steps followed, our final product should run. Obviously, this wasn't a comprehensive guide, but I hope someone found this interesting.

I wasn't able to go into as much detail as I wanted, but this article should hopefully convey the goals I had when making this project. This isn't an official solution, nor is it a serious product. This was a side project of mine, and I'm honestly just glad I got it working. Feedback and pull requests are welcome.

Below you'll find a list of repositories, and how they're put together. Additionally, you can find the most recent [generated version here](https://github.com/Regal-Internet-Brothers/Regal-Internet-Brothers.github.io/tree/master/webcc).

## Source Code and Setup

[WebCC](http://regal-internet-brothers.github.io/webcc) is a conglomeration of several repositories, each holding a relevant piece of the project. Below is a list of repositories containing each component necessary to build WebCC, using any reasonably up-to-date version of [Monkey X](http://www.monkey-x.com/Account/signup.php). For a slightly more detailed explanation, read on.

* '[webcc-monkey](https://github.com/Regal-Internet-Brothers/webcc-monkey)': This contains a modified version of the original '[transcc](https://github.com/blitz-research/monkey/tree/develop/src/transcc)' tool, stripped down for web compilation.
* '[webcc_frontend-target-monkey](https://github.com/Regal-Internet-Brothers/webcc_frontend-target-monkey)': A target containing a proof-of-concept HTML/JS frontend for WebCC. (Used to build the project)
* '[regal.virtualos](https://github.com/Regal-Internet-Brothers/virtualos)': This is where the magic happens; the module responsible for the virtual file-system.

* [The "Virtual Directory Generator" Tool](https://github.com/ImmutableOctet/monkey-tools/blob/master/Virtual_Directory_Generator/Virtual_Directory_Generator.monkey): This is used to map out a directory for '[LoadDir](https://regal-internet-brothers.github.io/monkey/docs/Modules_os.html#LoadDir) compatibility.

The **[most recent build](http://regal-internet-brothers.github.io/webcc)** generated for this website can be [found here](https://github.com/Regal-Internet-Brothers/Regal-Internet-Brothers.github.io/tree/master/webcc).

<hr>

Setting this up is pretty straight forward. Simply download or clone [the "driver" code](https://github.com/Regal-Internet-Brothers/webcc-monkey), and place it where you want.

**The 'os' module provided with the "driver" is a sub-module.** If you intend to use WebCC's sandboxed HTML5 target (Web target), you need the 'os' module. In this particular case, you will need to download or clone '[virtualos](https://github.com/Regal-Internet-Brothers/virtualos)', and make a copy of it named "os". This copy should be placed in the "webcc.data/modules" directory. The next step requires 'virtualos' as well, so you will need two copies (Or use a sym-link, if available).

Next, either substitute [this import in 'trans'](https://github.com/blitz-research/monkey/blob/a254ac3682a453a0a03172fb55a0b9afbce6a0a1/modules/trans/trans.monkey#L17) with an import to '[virtualos](https://github.com/Regal-Internet-Brothers/virtualos).os'. You can install it as either 'regal.virtualos' ("regal" parent folder in your module-directory), or simply 'virtualos', if you want to place it locally. [Here's an example](https://gist.github.com/ImmutableOctet/5311d90fe8360a77cbd5). Alternatively, [you can do what I did](https://gist.github.com/ImmutableOctet/3191d9a0b6cee2103c8d), and override 'os', so it imports 'virtualos' when using HTML5.

The next step is to download or clone [the frontend-target](https://github.com/Regal-Internet-Brothers/webcc_frontend-target-monkey), and place it in your Monkey installation's "targets" folder. With this done, you can freely build and modify WebCC.

WebCC and its components have been released under two licenses:

* Monkey's license (zLib / libpng + proprietary): Used for Monkey-derived software. (Only open source components were used)
* The MIT license: Used for independent software, such as '[virtualos](https://github.com/Regal-Internet-Brothers/virtualos)'.

These are not restrictive licenses. Credit for my particular software is not necessary, but it's appreciated.

If you're looking to add more modules, you may need to add extra entries into [this file](https://github.com/Regal-Internet-Brothers/webcc-monkey/blob/master/webcc.data/webcc_filesystem.txt). If you wish to generate more entries, you can use [this tool](https://github.com/ImmutableOctet/monkey-tools/blob/master/Virtual_Directory_Generator/Virtual_Directory_Generator.monkey). The file provided with that repository contains what is effectively the minimum entries required (Excluding the extra target).


Thank you for reading.

**[![Avatar]({{ site.url }}/assets/immutableoctet/avatar.jpg) ImmutableOctet](https://github.com/ImmutableOctet)** (Anthony Diamond)
