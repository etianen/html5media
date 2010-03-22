/*
 * HTML 5 media compatibility layer.
 * 
 * Copyright 2010 Dave Hall <dave@etianen.com>.
 * 
 * This script is part of the html5media project. The html5media project enables
 * HTML5 video and audio tags in all major browsers.
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


(function(window, document, undefined) {
    
    // Executes the given callback in the context of each array item.
    function each(items, callback) {
        var itemsArray = [];
        for (var n = 0; n < items.length; n++) {
            itemsArray.push(items[n]);
        }
        for (var n = 0; n < itemsArray.length; n++) {
            callback(itemsArray[n]);
        }
    }
    
    // If no video tag is supported, go ahead and enable all HTML5 elements.
    if (!document.createElement("video").canPlayType) {
        each(["abbr", "article", "aside", "audio", "canvas", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "menu", "meter", "nav", "output", "progress", "section", "summary", "time", "video", "source"], function(name){
            document.createElement(name);
        });
    }
    
    /**
     * Replaces all video tags with flowplayer video player if the browser does
     * not support either the video tag the h.264 codex.
     * 
     * This is run automatically on document ready, but can be run manually
     * again after dynamically creating HTML5 video tags.
     */
    function html5media() {
        each(document.getElementsByTagName("video"), function(video) {
            var requiresFallback = true;
            // Test if the video tag is supported.
            if (video.canPlayType) {
                // If the video has a src attribute, and can play it, then all is good.
                if (video.src && video.canPlayType(guessFormat(video.src))) {
                    requiresFallback = false;
                } else {
                    // Check for source child attributes.
                    each(video.getElementsByTagName("source"), function(source) {
                        if (video.canPlayType(guessFormat(source.src, source.type))) {
                            requiresFallback = false;
                        }
                    });
                }
            }
            // If cannot play video, create the fallback.
            if (requiresFallback) {
                html5media.createVideoFallback(video);
            }
        });
    }
    
    /**
     * The locations of the flowplayer and flowplayer controls SWF files.
     * 
     * Override this if they are not located in the same folder as the 
     */
    // HACK: This could be done much easier with a selector, but there is a bug in IE6 that doesn't allow dots in attribute selectors.
    var scriptRoot = "";
    each(document.getElementsByTagName("script"), function(script) {
        var src = script.src;
        if (src.substr(src.length - 17) == "html5media.min.js") {
            scriptRoot = src.split("/").slice(0, -1).join("/") + "/";
        }
    });
    html5media.flowplayerSwf = scriptRoot + "flowplayer.swf";
    html5media.flowplayerControlsSwf = scriptRoot + "flowplayer.controls.swf";
    
    /**
     * Known media formats. Used to change the assumed format to a different
     * format, such as Theora, if desired.
     */
    html5media.THEORA_FORMAT = 'video/ogg; codecs="theora, vorbis"';
    html5media.H264_FORMAT = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    html5media.VORBIS_FORMAT = 'audio/ogg; codecs="vorbis"';
    html5media.M4A_FORMAT = 'audio/x-m4a;';
    html5media.MP3_FORMAT = 'audio/mpeg3;';
    html5media.WAV_FORMAT = 'audio/wav; codecs="1"';
    
    /**
     * The video format to assume if it cannot be determined what format a media
     * file is.
     */
    html5media.assumedFormats = {
        "video": html5media.H264_FORMAT,
        "audio": html5media.MP3_FORMAT
    }
    
    /**
     * Known file extensions that can be used to guess media formats in the
     * absence of other information.
     */
    html5media.fileExtensions = {
        "video": {
            "ogg": html5media.THEORA_FORMAT,
            "ogv": html5media.THEORA_FORMAT,
            "avi": html5media.H264_FORMAT,
            "mp4": html5media.H264_FORMAT,
            "mkv": html5media.H264_FORMAT,
            "h264": html5media.H264_FORMAT,
            "264": html5media.H264_FORMAT,
            "avc": html5media.H264_FORMAT,
            "m4v": html5media.H264_FORMAT,
            "3gp": html5media.H264_FORMAT,
            "3gpp": html5media.H264_FORMAT,
            "3g2": html5media.H264_FORMAT
        },
        "audio": {
            "ogg": html5media.VORBIS_FORMAT,
            "oga": html5media.VORBIS_FORMAT,
            "aac": html5media.M4A_FORMAT,
            "m4a": html5media.M4A_FORMAT,
            "mp3": html5media.MP3_FORMAT,
            "wav": html5media.WAV_FORMAT
        }
    }
    
    // Trys to determine the format of a given video file.
    function guessFormat(src, type) {
        // If a type is explicitly given, then use this.
        if (type) {
            return type;
        }
        // Try to guess based on file extension.
        return html5media.fileExtensions["video"][src.split(".").slice(-1)[0]] || html5media.assumedFormats["video"];
    }
    
    // Detects presence of HTML5 attributes.
    function hasAttr(element, attr) {
        var val = element.getAttribute(attr);
        return val == true || typeof val == "string";
    }
    
    /**
     * Default callback for creating a fallback for html5 video tags.
     * 
     * This implementation creates flowplayer instances, but this can
     * theoretically be used to support all different types of flash player.
     */
    html5media.createVideoFallback = function(video) {
        // Standardize the src and poster.
        var baseUrl = window.location.protocol + "//" + window.location.host;
        function addDomain(url) {
            if (url.substr(0, 1) == "/") {
                return baseUrl + url;
            }
            return url;
        }
        var poster = addDomain(video.getAttribute("poster") || "");
        var src = video.getAttribute("src");
        if (!src) {
            // Find a h.264 file.
            each(video.getElementsByTagName("source"), function(source) {
                if (guessFormat(source.getAttribute("src"), source.getAttribute("type")).substr(0, 9) == "video/mp4") {
                    src = source.getAttribute("src");
                }
            });
        }
        src = addDomain(src || "");
        // Create the replacement video div.
        var replacement = document.createElement("span");
        replacement.id = video.id;
        replacement.className = video.className;
        replacement.title = video.title;
        replacement.style.display = "block";
        replacement.style.width = video.getAttribute("width") + 'px';
        replacement.style.height = video.getAttribute("height") + 'px';
        // Replace the video with the div.
        video.parentNode.replaceChild(replacement, video);
        var preload = (video.getAttribute("preload") || "").toLowerCase();
        // Activate flowplayer.
        var flowplayerControls = null;
        if (hasAttr(video, "controls")) {
            flowplayerControls = {
                url: html5media.flowplayerControlsSwf,
                fullscreen: false,
                autoHide: "always"
            }
        }
        var playlist = [];
        if (poster) {
            playlist.push({url: poster});
        }
        if (src) {
            playlist.push({
                url: src,
                autoPlay: hasAttr(video, "autoplay"),
                autoBuffering: hasAttr(video, "autobuffer") || (hasAttr(video, "preload") && (preload == "" || preload == "auto")),
                onBeforeFinish: function() {
                    return !hasAttr(video, "loop");
                }
            });
        }
        flowplayer(replacement, html5media.flowplayerSwf, {
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
        });
    }

    // Automatically execute the html5media function on page load.
    DomReady.ready(html5media)
    
    // Expose html5media to the global object.
    window.html5media = html5media;
    
})(this, document);