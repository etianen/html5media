/**
 * HTML 5 media compatibility layer.
 * 
 * Allows the use of video tags within all browsers to play videos encoded in
 * the MPEG-4 and h.264 formats.
 * 
 * Developed by Dave Hall <david@etianen.com>
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
    
    /**
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
    
    /**
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
        // Create a placeholder poster.
        var poster = video.attr("poster");
        if (poster) {
            replacement.html($("<img>").attr("src", poster).attr("width", width).attr("height", height));
        }
        // Activate flowplayer.
        var flowplayerControls = null;
        if (hasAttr(video, "controls")) {
            flowplayerControls = {
                fullscreen: false,
                autoHide: "always"
            }
        }
        var playlist = [{
            url: video.attr("src"),
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
            plugins: {
                controls: flowplayerControls
            }
        }).flowplayer(0).load();
    }

    // Automatically execute the html5media function on page load.
    $($.html5media);
    
})(jQuery);