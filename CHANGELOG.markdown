html5media changelog
====================

1.2.2
-----

*   Video fallbacks can now be `display: inline` if the style is already assigned them.
*   Audio fallbacks can now have a custom `height` assigned via CSS.


1.2.1
-----

*   Fixing NPM release.


1.2.0
-----

*   Added `videoFallbackClass` and `audioFallbackClass` settings.


1.1.8
-----

*   Absolute URL resolution now supports protocol-relative URLs.


1.1.7
-----

*   Fixing autodetection of URLs with query strings.


1.1.6
-----

*   Fixing path for expressInstall.swf for older Flash players.
*   Copying over CSS styles to replacement element.


1.1.5
-----

*   Tweaked fallback player styling to better match native players.
*   Added in html5media.forceFallback callback.


1.1.4
-----

*   Created a html5media CDN for easy deployment.
*   Upgraded to Flowplayer 3.2.7.
*   Upgraded to Flowplayer.audio 3.2.2.


1.1.3
-----

*   Added support for Google Android OS.
*   Added in some additional recognised file extensions.
*   Upgraded to Flowplayer 3.2.5.
*   Upgraded to Flowplayer.audio 3.2.1.


1.1.2
-----

*   Allowed source type attributes to omit the semicolon.


1.1.1
-----

*   Added convenient callback for customizing Flowplayer.
*   Added ability to append cache-busting parameters to script tag.


1.1
---

*   Fixed issue where Safari would play mp3 files using the Flowplayer fallback.
*   Flowplayer now runs with wmode opaque by default.
*   Updated Flowplayer binaries.
*   Improved build process.
