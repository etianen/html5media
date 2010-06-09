html5media
==========

HTML5 video and audio tags make embedding media into documents as easy as
embedding an image. All it takes is a single `<video>` or `<audio>` tag.
Unfortunately, not all browsers natively support these HTML5 tags.


Enabling video and tags in all major browsers
---------------------------------------------

All it takes is three simple steps to enable HTML5 video and audio tags in all
major browsers!

1.  Download the and unzip the latest html5media build from the
    [html5media download area].

[html5media download area]: http://github.com/etianen/html5media/downloads

2.  Upload the contents of the unpacked `html5media/` folder to your webserver.
    Be sure to keep all the bundled files together in the same folder.

3.  Add the following snippet the to `<head>` of your document:

        <script src="/path/to/your/html5media.min.js"></script>
    
You can see this code in action on the [html5media demo site][].

[html5media demo site]: http://etianen.github.com/html5media/
    "html5media video and audio tag demonstration"

Please read our [Getting Started][] guide for more information.

[Getting Started]: http://wiki.github.com/etianen/html5media/getting-started
    "Getting started with html5media"
    
    
Using HTML5 video and audio
---------------------------

HTML5 allows you to embed video and audio into your document using the following
easy syntax:

    <video src="video.mp4" width="320" height="240" controls preload></video>

    <audio src="audio.mp3" controls preload></audio>
    
Find out more about HTML5 on the [Dive Into HTML5 video page].

[Dive Into HTML5 video page]: http://diveintohtml5.org/video.html

You can ask for help and discuss all aspects of HTML5 media and audio on the
[html5media discussion group][].

[html5media discussion group]: http://groups.google.com/group/html5media
    
    
Help! My file won't play!
--------------------------

It's probably encoded incorrectly. Videos should always be saved as h.264 (mp4),
or Theora (ogv) files. Find out more on our [Video Formats][] page.

[Video Formats]: http://wiki.github.com/etianen/html5media/video-formats
    "Video formats supported by html5media"

Audio files should be saved as mp3, AAC (m4a) or Vorbis (ogg).
    
    
What's in the box?
------------------

The html5media project consists of a single, minified Javascript file that is
used to detect your browser's HTML5 video capabilities. Any video tags that
cannot be played are dynamically replaced with a Flash video player.

The bundled Flash video player is provided by Flowplayer under the GPL3 licence.
You can find out more about Flowplayer on the [Flowplayer website][].

[Flowplayer website]: http://flowplayer.org
    "Flowplayer - Flash Video Player for the Web"
    
    
More information
----------------

The html5media project was developed by Dave Hall. You can get the code from the
[html5media project site][].

[html5media project site]: http://github.com/etianen/html5media
    "Dave Hall's html5media on GitHub"
    
Dave Hall is a freelance web developer, based in Cambridge, UK. You can usually
find him on the Internet in a number of different places:

*   [Website](http://www.etianen.com/ "Dave Hall's homepage")
*   [Blog](http://www.etianen.com/blog/developers/ "Dave Hall's blog")
*   [Twitter](http://twitter.com/etianen "Dave Hall on Twitter")
*   [Google Profile](http://www.google.com/profiles/david.etianen "Dave Hall's Google profile")

