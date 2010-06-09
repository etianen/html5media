html5media
==========

HTML5 video and audio tags make embedding media into documents as easy as
embedding an image. All it takes is a single `<video>` or `<audio>` tag.
Unfortunately, not all browsers natively support these HTML5 tags.


Enabling video and tags in all major browsers
---------------------------------------------

To enable HTML5 video and audio tags in all major browsers, simply paste the
following code into the `<head>` of your document:

    <script src="http://html5media.googlecode.com/svn/trunk/src/html5media.min.js"></script>
    
This will allow you to embed video and audio into your document using the
following easy syntax:

    <video src="video.mp4" width="320" height="240" controls preload></video>

    <audio src="audio.mp3" controls preload></audio>
    
You can see this code in action on the [html5media demo page][].

    [html5media demo page]: http://etianen.github.com/html5media/

Please read our [Getting Started][] guide for more information.

    [Getting Started]: http://wiki.github.com/etianen/html5media/getting-started
    
    
Help! My video won't play!
--------------------------

It's probably encoded incorrectly. Videos should always be saved as h.264 (mp4),
or Theora (ogv) files. Find out more on our [Video Formats][] page.

    [Video Formats]: http://wiki.github.com/etianen/html5media/video-formats
    
    
What's in the box?
------------------

The html5media project consists of a single, minified Javascript file that is
used to detect your browser's HTML5 video capabilities. Any video tags that
cannot be played are dynamically replaced with a Flash video player.

The bundled Flash video player is provided by Flowplayer under the GPL3 licence.
You can find out more about Flowplayer on the [Flowplayer website][].

    [Flowplayer website]: http://flowplayer.org
    
    
More information
----------------

The html5media project was developed by Dave Hall, and you can get the code from
the [GitHub project page][].

    [GitHub project page]: http://github.com/etianen/html5media
    
Dave Hall is a freelance web developer, based in Cambridge, UK. You can usually
find him on the Internet in a number of different places:

*   [Homepage] (http://www.etianen.com/)
*   [Blog] (http://www.etianen.com/blog/developers/)
*   [Twitter] (http://twitter.com/etianen)
*   [Google Profile] (http://www.google.com/profiles/david.etianen)

