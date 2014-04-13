HTML5 video made easy
=====================

All it takes is a single line of code to make HTML5 video and audio tags work
in all major browsers.


How to enable video and audio tags in all major browsers
--------------------------------------------------------

To make HTML5 video and audio tags work in all major browsers, simply add the
following line of code somewhere in the `<head>` of your document.

```html
<script src="http://api.html5media.info/1.1.8/html5media.min.js"></script>
```
    
That's it! There is no second step!

    
How to embed video
------------------

You can embed video into your page using the following code.

```html
<video src="video.mp4" width="320" height="200" controls preload></video>
```

For more information and troubleshooting, please visit the [video wiki page].

[video wiki page]: https://github.com/etianen/html5media/wiki/embedding-video
    
    
How to embed audio
------------------

You can embed audio into your page using the following code.

```html
<audio src="audio.mp3" controls preload></audio>
```

For more information and troubleshooting, please visit the [audio wiki page].

[audio wiki page]: https://github.com/etianen/html5media/wiki/embedding-audio
    
    
Why use html5media?
-------------------

HTML5 video and audio tags were designed to make embedding a video as easy as
embedding an image. They were also designed to give users a faster experience
by doing away with browser plugins such as Adobe Flash.

Unfortunately, older browsers don't support HTML5 video and audio tags, and
even modern browsers don't support a consistent set of video codecs, making
embedding a video rather difficult.

The html5media project makes embedding video or audio as easy as it was meant
to be. It's a fire-and-forget solution, and doesn't require installing any
files on your server. Unlike many other HTML5 video players, it allows people
to use the video controls supplied by their own web browser. It's one of the
smallest, fastest solutions available, and as browser technology improves it
will become even faster.
    
    
More information
----------------

The html5media project is open source and can be found on GitHub. You can find
out more information on the [html5media wiki], or the main [html5media project page].

[html5media wiki]: https://github.com/etianen/html5media/wiki
[html5media project page]: https://github.com/etianen/html5media


About the author
----------------

Dave Hall is a freelance web developer, based in Cambridge, UK. You can usually
find him on the Internet in a number of different places:

*   [Website](http://www.etianen.com/ "Dave Hall's homepage")
*   [Blog](http://www.etianen.com/blog/developers/ "Dave Hall's blog")
*   [Twitter](http://twitter.com/etianen "Dave Hall on Twitter")
*   [Google Profile](http://www.google.com/profiles/david.etianen "Dave Hall's Google profile")


Extra credits
-------------

The html5media project bundles together a number of excellent open-source and
creative-commons projects. They are listed below.

*   [Flowplayer - Flash Video Player for the Web](http://flowplayer.org/ "Flowplayer - Flash Video Player for the Web")
*   [Domready - The smallest subset possible from jQuery to support DOM ready event](http://code.google.com/p/domready/ "Domready - The smallest subset possible from jQuery to support DOM ready event")
*   [Sintel - the Durian Open Movie Project](http://www.sintel.org/ "Sintel - the Durian Open Movie Project")
