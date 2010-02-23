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
    
    // Creates a flowplayer in the container element.
    function createFlowplayer(container, src, poster, controls, autoplay, autobuffer, loop) {
        // Create a placeholder poster, if required.
        if (poster && $("img", container).length == 0) {
            container.append($("<img>", {
                src: poster,
                width: container.width(),
                height: container.height()
            }));
        }
        // Activate flowplayer.
        var flowplayerControls = null;
        if (controls) {
            flowplayerControls = {
                fullscreen: false,
                autoHide: "always"
            }
        }
        var playlist = [{
            url: src,
            autoPlay: autoplay,
            autoBuffering: autobuffer,
            onBeforeFinish: function() {
                return !loop;
            }
        }];
        if (poster) {
            playlist.splice(0, 0, {url: poster});
        }
        container.flowplayer(flowplayerSwf, {
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
    
    // Detects whether an attribute exists on the given element.
    function hasAttr(element, attr) {
        var val = element.attr(attr);
        return val == true || typeof val == "string";
    }
    
    // If no video support, pull in flowplayer.
    if (!videoSupported && !$.fn.flowplayer) {
        document.write('<script src="' + scriptRoot + 'flowplayer.js"></script>');
        // Replace all video tags with flowplayers on document load.
        $(function() {
            $("video").each(function() {
                if (!videoSupported) {
                    var video = $(this);
                    // Add in the replacement video div.
                    var replacement = $("<div/>", {
                        width: video.attr("width"),
                        height: video.attr("height"),
                        "class": video.attr("class"),
                        id: video.attr("id"),
                        title: video.attr("title")
                    });
                    video.replaceWith(replacement);
                    createFlowplayer(replacement, video.attr("src"), video.attr("poster"), hasAttr(video, "controls"), hasAttr(video, "autoplay"), hasAttr(video, "autobuffer"), hasAttr(video, "loop"));
                }
            });
        });
    }
    
    /**
     * A jQuery function for dynamically creating videos from links.
     * 
     * Call this on an <a> tag to create a <video> tag using it's href. If the
     * tag contains an image, then the image will be used as the poster for the
     * video.
     * 
     * You may also pass in 'src', 'poster', 'controls', 'autoplay',
     * 'autobuffer',  'loop', 'width' and 'height' arguments to customize the
     * video tag.
     */
    $.fn.video = function(settings) {
        // Create the video players.
        this.each(function() {
            var element = $(this);
            var className = element.attr("class");
            var id = element.attr("id");
            // Parse the settings.
            var config = {
                src: element.attr("href"),
                poster: $("img", element).attr("src") || "",
                controls: false,
                autoplay: false,
                autobuffer: false,
                loop: false,
                width: element.width(),
                height: element.height()
            };
            if (settings) {
                $.extend(config, settings);
            }
            if (videoSupported) {
                // Use a HTML 5 video tag.
                var video = $("<video/>").attr("id", id).attr("class", className).attr("src", config.src).attr("poster", config.poster).attr("width", config.width).attr("height", config.height);
                if (config.controls) {
                    video.attr("controls", "controls");
                }
                if (config.autoplay) {
                    video.attr("autoplay", "autoplay")
                }
                if (config.autobuffer) {
                    video.attr("autobuffer", "autobuffer");
                }
                if (config.loop) {
                    video.attr("loop", "loop");
                }
                element.replaceWith(video);
            } else {
                var container = $("<div/>").attr("id", id).attr("class", className).width(config.width).height(config.height);
                element.replaceWith(container);
                createFlowplayer(container, config.src, config.poster, config.controls, config.autoplay, config.autobuffer, config.loop);
            }
        });
    }
    
})(jQuery);