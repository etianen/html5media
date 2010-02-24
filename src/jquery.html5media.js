/*
 * HTML 5 media compatibility layer.
 * 
 * Copyright 2010 Dave Hall <david@etianen.com>.
 * 
 * This script is part of the html5media project. The html5media project enables
 * HTML5 video tags in all major browsers.
 * 
 * The html5media project is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * 
 * The html5media project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General
 * Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with html5media.  If not, see<http://www.gnu.org/licenses/>.
 * 
 * Developed by Dave Hall.
 * 
 * <http://www.etianen.com/>
 */


(function($) {
    
    // Tests for MPEG-4 support in the browser.
    var testVideoElement = document.createElement("video");
    var videoSupported = Boolean(testVideoElement.canPlayType && testVideoElement.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'));
    
    // Determine resource file paths.
    // HACK: This could be done much easier with a selector, but there is a bug in IE6 that doesn't allow dots in attribute selectors.
    var scriptRoot = "";
    $("script").each(function() {
        var src = $(this).attr("src");
        if (src.substr(-20) == "jquery.html5media.js" || src.substr(-24) == "jquery.html5media.min.js") {
            scriptRoot = src.split("/").slice(0, -1).join("/") + "/";
        }
    });
    var flowplayerSwf = scriptRoot + "flowplayer.swf";
    
    // Pull in flowplayer javascript, if required.
    if (!videoSupported && !$.fn.flowplayer) {
        document.write('<script src="' + scriptRoot + 'flowplayer.js"></script>');
    }
    
    /*
     * Replaces all video tags with flowplayer video player if the browser does
     * not support either the video tag the h.264 codex.
     * 
     * This is run automatically on document ready, but can be run manually
     * again after dynamically creating HTML5 video tags.
     */
    $.html5media = function() {
        if (!videoSupported) {
            $("video").each($.html5media.createFallback);
        }
    }
    
    /*
     * Default callback for creating a fallback for html5 video tags.
     * 
     * This implementation creates flowplayer instances, but this can
     * theoretically be used to support all different types of flash player.
     */
    $.html5media.createFallback = function() {
        var video = $(this);
        // Detects presence of HTML5 attributes.
        function hasAttr(element, attr) {
            var val = element.attr(attr);
            return val == true || typeof val == "string";
        }
        // Standardize the src and poster.
        var baseUrl = window.location.protocol + "//" + window.location.host;
        function addDomain(url) {
            if (url.substr(0, 1) == "/") {
                return baseUrl + url;
            }
            return url;
        }
        var poster = addDomain(video.attr("poster"));
        var src = addDomain(video.attr("src"));
        // Add in the replacement video div.
        var width = video.attr("width");
        var height = video.attr("height");
        var replacement = $("<div/>", {
            width: width,
            height: height,
            "class": video.attr("class"),
            id: video.attr("id"),
            title: video.attr("title")
        });
        video.replaceWith(replacement);
        // Activate flowplayer.
        var flowplayerControls = null;
        if (hasAttr(video, "controls")) {
            flowplayerControls = {
                fullscreen: false,
                autoHide: "always"
            }
        }
        var playlist = [{
            url: src,
            autoPlay: hasAttr(video, "autoplay"),
            autoBuffering: hasAttr(video, "autobuffer"),
            onBeforeFinish: function() {
                return !hasAttr(video, "loop");
            }
        }];
        if (poster) {
            playlist.splice(0, 0, {url: poster});
        }
        replacement.flowplayer(flowplayerSwf, {
            onBeforeUnload: function() {
                return false;
            },
            play: null,
            playlist: playlist,
            clip: {
                scaling: "fit",
                fadeInSpeed: 0,
                fadeOutSpeed: 0
            },
            plugins: {
                controls: flowplayerControls
            }
        }).flowplayer(0).load();
    }

    // Automatically execute the html5media function on page load.
    $($.html5media);
    
})(jQuery);