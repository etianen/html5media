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
    
    // Tagnames for the different types of media tag.
    var VIDEO_TAG = "video";
    var AUDIO_TAG = "audio";
    
    // If no video tag is supported, go ahead and enable all HTML5 elements.
    if (!document.createElement(VIDEO_TAG).canPlayType) {
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
        each([VIDEO_TAG, AUDIO_TAG], function(tag) {
            each(document.getElementsByTagName(tag), function(media) {
                var requiresFallback = true;
                // Test if the media tag is supported.
                if (media.canPlayType) {
                    // If the media has a src attribute, and can play it, then all is good.
                    if (media.src && media.canPlayType(guessFormat(tag, media.src))) {
                        requiresFallback = false;
                    } else {
                        // Check for source child attributes.
                        each(media.getElementsByTagName("source"), function(source) {
                            if (media.canPlayType(guessFormat(tag, source.src, source.type))) {
                                requiresFallback = false;
                            }
                        });
                    }
                }
                // If cannot play media, create the fallback.
                if (requiresFallback) {
                    html5media.createFallback(tag, media);
                }
            });
        });
    }
    
    /**
     * The locations of the flowplayer and flowplayer controls SWF files.
     * 
     * Override this if they are not located in the same folder as the 
     */
    var scriptRoot = "";
    each(document.getElementsByTagName("script"), function(script) {
        var src = script.src;
        if (src.match(/html5media(\.min|)\.js\s*$/g)) {
            scriptRoot = src.split("/").slice(0, -1).join("/") + "/";
        }
    });
    html5media.flowplayerSwf = scriptRoot + "flowplayer.swf";
    html5media.flowplayerAudioSwf = scriptRoot + "flowplayer.audio.swf";
    html5media.flowplayerControlsSwf = scriptRoot + "flowplayer.controls.swf";
    
    /**
     * Known media formats. Used to change the assumed format to a different
     * format, such as Theora, if desired.
     */
    var THEORA_FORMAT = html5media.THEORA_FORMAT = 'video/ogg; codecs="theora, vorbis"';
    var H264_FORMAT = html5media.H264_FORMAT = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    var VORBIS_FORMAT = html5media.VORBIS_FORMAT = 'audio/ogg; codecs="vorbis"';
    var M4A_FORMAT = html5media.M4A_FORMAT = 'audio/x-m4a;';
    var MP3_FORMAT = html5media.MP3_FORMAT = 'audio/mpeg3;';
    var WAV_FORMAT = html5media.WAV_FORMAT = 'audio/wav; codecs="1"';
    
    /**
     * The video format to assume if it cannot be determined what format a media
     * file is.
     */
    var assumedFormats = html5media.assumedFormats = {
        video: H264_FORMAT,
        audio: MP3_FORMAT
    }
    
    /**
     * Formats that the fallback Flash player is able to understand.
     */
    var fallbackFormats = html5media.fallbackFormats = [html5media.H264_FORMAT, html5media.M4A_FORMAT, html5media.MP3_FORMAT];
    
    /**
     * Known file extensions that can be used to guess media formats in the
     * absence of other information.
     */
    var fileExtensions = html5media.fileExtensions = {
        video: {
            "ogg": THEORA_FORMAT,
            "ogv": THEORA_FORMAT,
            "avi": H264_FORMAT,
            "mp4": H264_FORMAT,
            "mkv": H264_FORMAT,
            "h264": H264_FORMAT,
            "264": H264_FORMAT,
            "avc": H264_FORMAT,
            "m4v": H264_FORMAT,
            "3gp": H264_FORMAT,
            "3gpp": H264_FORMAT,
            "3g2": H264_FORMAT
        },
        audio: {
            "ogg": VORBIS_FORMAT,
            "oga": VORBIS_FORMAT,
            "aac": M4A_FORMAT,
            "m4a": M4A_FORMAT,
            "mp3": MP3_FORMAT,
            "wav": WAV_FORMAT
        }
    }
    
    // Trys to determine the format of a given video file.
    function guessFormat(tag, src, type) {
        return type || fileExtensions[tag][src.split(".").slice(-1)[0]] || assumedFormats[tag];
    }
    
    // Detects presence of HTML5 attributes.
    function hasAttr(element, attr) {
        var val = element.getAttribute(attr);
        return val == true || typeof val == "string";
    }
    
    // Adds the domain name to the given URL. If this is not done, then
    // Flowplayer gets very confused.
    var baseUrl = window.location.protocol + "//" + window.location.host;
    function addDomain(url) {
        if (url.substr(0, 1) == "/") {
            return baseUrl + url;
        }
        return url;
    }
    
    // Calculates the given dimension of the given element.
    function getDimension(element, dimension, fallback) {
        // Attempt to use it's attribute value.
        var result = element.getAttribute(dimension);
        if (result) {
            return result + "px";
        }
        // Attempt to use it's computed style.
        if (element.currentStyle) {
            var style = element.currentStyle[dimension];
        } else if (window.getComputedStyle) {
            var style = document.defaultView.getComputedStyle(element, null).getPropertyValue(dimension);
        } else {
            return fallback;
        }
        if (style == "auto") {
            return fallback; 
        }
        return style;
    }
    
    // Extracts the mimetype from a format string.
    function getMimeType(format) {
        return format.match(/\s*([\w-]+\/[\w-]+);|\s/)[1];
    }
    
    // Checks whether the two formats are equivalent.
    function formatMatches(format1, format2) {
        return (getMimeType(format1) == getMimeType(format2));
    }
    
    /**
     * Default callback for creating a fallback for html5 media tags.
     * 
     * This implementation creates flowplayer instances, but this can
     * theoretically be used to support all different types of flash player.
     */
    html5media.createFallback = function(tag, element) {
        var hasControls = hasAttr(element, "controls");
        // Standardize the src and poster.
        var poster = addDomain(element.getAttribute("poster") || "");
        var src = element.getAttribute("src");
        var format;
        if (!src) {
            // Find a compatible fallback file.
            each(element.getElementsByTagName("source"), function(source) {
                var srcValue = source.getAttribute("src");
                if (srcValue && !src) {
                    each(fallbackFormats, function(fallbackFormat) {
                        format = guessFormat(tag, srcValue, source.getAttribute("type"));
                        if (formatMatches(format, fallbackFormat)) {
                            src = srcValue;
                        }
                    });
                }
            });
        } else {
            format = guessFormat(tag, src);
        }
        src = addDomain(src || "");
        // Create the replacement element div.
        var replacement = document.createElement("span");
        replacement.id = element.id;
        replacement.className = element.className;
        replacement.title = element.title;
        replacement.style.display = "block";
        replacement.style.width = getDimension(element, "width", "300px");
        replacement.style.height = getDimension(element, "height", "24px");
        // Replace the element with the div.
        element.parentNode.replaceChild(replacement, element);
        var preload = (element.getAttribute("preload") || "").toLowerCase();
        // Activate flowplayer.
        var flowplayerControls = null;
        var playlist = [];
        if (poster) {
            playlist.push({url: poster});
        }
        if (src) {
            playlist.push({
                url: src,
                autoPlay: hasAttr(element, "autoplay"),
                autoBuffering: hasAttr(element, "autobuffer") || (hasAttr(element, "preload") && (preload == "" || preload == "auto")),
                onBeforeFinish: function() {
                    return !hasAttr(element, "loop");
                }
            });
        }
        // Determine which plugins should be loaded.
        var plugins = {
            controls: hasControls && {
                url: html5media.flowplayerControlsSwf,
                fullscreen: false,
                autoHide: tag == VIDEO_TAG && "always" || "never"
            } || null
        };
        if (formatMatches(format, MP3_FORMAT)) {
            // Load the audio plugin.
            plugins["audio"] = {
                    url: html5media.flowplayerAudioSwf
            }
            // HACK: The Flowplayer audio plugin requires that the controls plugin is present.
            if (!hasControls) {
                plugins["controls"] = {
                    url: html5media.flowplayerControlsSwf,
                    display: "none"
                }
            }
            // HACK: The Flowplayer audio plugin will autoplay clips and never stop if autobuffering is enabled.
            playlist.slice(-1)[0]["autoBuffering"] = false;
        }
        // Load the Flowplayer.
        flowplayer(replacement, html5media.flowplayerSwf, {
            play: null,
            playlist: playlist,
            clip: {
                scaling: "fit",
                fadeInSpeed: 0,
                fadeOutSpeed: 0
            },
            plugins: plugins
        });
    }

    // Automatically execute the html5media function on page load.
    if (window.jQuery) {
        // The jQuery build of html5media is smaller and uses the latest jQuery code.
        jQuery(html5media);
    } else if (window.DomReady) {
        // The standalone build of html5media uses the bundled DomReady library.
        DomReady.ready(html5media);
    }
    
    // Expose html5media to the global object.
    window.html5media = html5media;
    
})(this, document);