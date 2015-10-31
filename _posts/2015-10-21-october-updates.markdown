---
layout: post
title:  "regal: Halloween Update 2015 (October updates)"
date:   2015-10-28 05:30:14 -0600
categories: meta
---

The main forum thread for 'regal' can be [found here](http://www.monkey-x.com/Community/posts.php?topic=8506#112545).

**UPDATE (October 31st, 2015)**

* Our Monkey modules officially have a name; "regal". Every module, experimental or stable, will have this as a prefix. Any legacy code assuming global placement can easily be supported for compatibility purposes. For details, [the installation guide](https://github.com/Regal-Internet-Brothers/regal-modules#installation) reflects this now, including legacy support.
* Added experimental SHA1 support to '[hash](https://github.com/Regal-Internet-Brothers/hash)'; requires 'HASH_EXPERIMENTAL' to be enabled with the preprocessor. Still need to make it into a proper generic routine like 'MD5'.
* Added Base64 support to '[hash](https://github.com/Regal-Internet-Brothers/hash)' (Based loosely on [Diddy's implementation](https://github.com/swoolcock/diddy/blob/master/src/diddy/base64.monkey); uses 'Streams', doesn't use a table to map values, etc).
* [b]Small fixes to '[mojoinmojo2](https://github.com/Regal-Internet-Brothers/mojoinmojo2]mojoinmojo2)', and (Threaded) asynchronous image loading was added. As usual, use at your own risk.[/b]
* It hasn't gone anywhere yet, but I've done some tests with '[networking](https://github.com/Regal-Internet-Brothers/networking)', and I was able to make a connection with WebSockets to a host 'NetworkEngine'. Ideally, WebSocket support on the HTML5 side will be added, and support for the protocol and handshake will be an option for 'NetworkEngines'. This is still a little while away, but it's definitely on the road-map.
* As stated last week, full documentation is available for '[networking](https://github.com/Regal-Internet-Brothers/networking)'. Build it yourself, or [view it online here](a http://regal-internet-brothers.github.io/networking).

Other than that, there have been a number of bug fixes. To update everything, ["Update_Submodules_Pull.bat"](https://github.com/Regal-Internet-Brothers/regal-modules/blob/master/Update_Submodules_Pull.bat) should work.
