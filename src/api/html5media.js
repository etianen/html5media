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
    
    "use strict";

    // Tagnames for the different types of media tag.
    var VIDEO_TAG = "video";
    var AUDIO_TAG = "audio";
    var userAgent = window.navigator.userAgent.toLowerCase();
    
    // If no video tag is supported, go ahead and enable all HTML5 elements.
    if (!document.createElement(VIDEO_TAG).canPlayType) {
        document.createElement(AUDIO_TAG);
        document.createElement("source");
    }
    
    // Checks whether this is a broken Android implementation.
    var isBrokenAndroid = userAgent.match(/android 2\.[12]/) !== null || userAgent.match(/android 6/) !== null;
    
    // Checks if this is opera.
    var isOpera = userAgent.match(/opera/) !== null;
    
    // Checks whether the given element can play the given format.
    function canPlayFormat(element, format) {
        return element.canPlayType(format) || (isBrokenAndroid && format.search("mp4") > -1);
    }
    
    // Scans over elements with the given tag name, creating fallbacks if required.
    function scanElementsByTagName(tagName) {
        var elements = document.getElementsByTagName(tagName);
        var elementsList = [];
        for (var n = 0; n < elements.length; n++) {
            elementsList.push(elements[n]);
        }
        for (n = 0; n < elementsList.length; n++) {
            var element = elementsList[n];
            var requiresFallback = true;
            // Test if the media tag is supported.
            if (element.canPlayType) {
                // If the media has a src attribute, and can play it, then all is good.
                if (element.src) {
                    if (canPlayFormat(element, guessFormat(tagName, element.src))) {
                        requiresFallback = false;
                    }
                } else {
                    // Check for source child attributes.
                    var sources = element.getElementsByTagName("source"); 
                    for (var m = 0; m < sources.length; m++) {
                        var source = sources[m];
                        if (canPlayFormat(element, guessFormat(tagName, source.src, source.type))) {
                            requiresFallback = false;
                            break;
                        }
                    }
                }
            }
            // If cannot play media, create the fallback.
            if (requiresFallback || html5media.forceFallback(tagName, element)) {
                html5media.createFallback(tagName, element);
            } else {
                // HACK: Enables playback in android phones.
                if (isBrokenAndroid) {
                    element.addEventListener("click", function() {
                        this.play();
                    }, false);
                }
            }
        }
    }
    
    /**
     * Replaces all video tags with flowplayer video player if the browser does
     * not support either the video tag the h.264 codex.
     * 
     * This is run automatically on document ready, but can be run manually
     * again after dynamically creating HTML5 video tags.
     */
    function html5media() {
        scanElementsByTagName("video");
        scanElementsByTagName("audio");
    }
    
    /**
     * Callback to allow conditional forcing of the fallback player.
     * 
     * Return true to force the flash fallback. The default implementation never
     * forces the flash fallback.
     */
    html5media.forceFallback = function(tagName, element) {
        return false;
    };
    
    // Removes the final filename from the given path.
    function dirname(path) {
        return path.split("/").slice(0, -1).join("/") + "/";
    }
    
    /**
     * The locations of the flowplayer and flowplayer controls SWF files.
     * 
     * Override this if they are not located in the same folder as the 
     */
    var scriptRoot = (function() {
        var scripts = document.getElementsByTagName("script");
        for (var n = 0; n < scripts.length; n++) {
            var script = scripts[n];
            if (script.src.match(/html5media(\.min|)\.js/)) {
                return dirname(script.src);
            }
        }
        return "";
    }());
    html5media.flowplayerSwf = scriptRoot + "flowplayer.swf";
    html5media.flowplayerAudioSwf = scriptRoot + "flowplayer.audio.swf";
    html5media.flowplayerControlsSwf = scriptRoot + "flowplayer.controls.swf";
    html5media.expressInstallSwf = scriptRoot + "expressInstall.swf";
    html5media.videoFallbackClass = "html5media-video-fallback";
    html5media.audioFallbackClass = "html5media-audio-fallback";
    
    // Known media formats.
    var THEORA_FORMAT = 'video/ogg; codecs="theora, vorbis"';
    var H264_FORMAT = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    var VORBIS_FORMAT = 'audio/ogg; codecs="vorbis"';
    var WEBM_FORMAT  = 'video/webm;';
    var M4A_FORMAT = 'audio/x-m4a;';
    var MP3_FORMAT = 'audio/mpeg;';
    var WAV_FORMAT = 'audio/wav; codecs="1"';
    
    /**
     * The video format to assume if it cannot be determined what format a media
     * file is.
     */
    var assumedFormats = {
        video: H264_FORMAT,
        audio: MP3_FORMAT
    };
    
    /**
     * Formats that the fallback Flash player is able to understand.
     */
    var fallbackFormats = [H264_FORMAT, M4A_FORMAT, MP3_FORMAT];
    
    /**
     * Known file extensions that can be used to guess media formats in the
     * absence of other information.
     */
    var fileExtensions = {
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
            "3g2": H264_FORMAT,
            "mpg": H264_FORMAT,
            "mpeg": H264_FORMAT,
            "webm": WEBM_FORMAT
        },
        audio: {
            "ogg": VORBIS_FORMAT,
            "oga": VORBIS_FORMAT,
            "aac": M4A_FORMAT,
            "m4a": M4A_FORMAT,
            "mp3": MP3_FORMAT,
            "wav": WAV_FORMAT
        }
    };
    
    // Trys to determine the format of a given video file.
    function guessFormat(tag, src, type) {
        // An explicit type is always best.
        if (type) {
            return type;
        }
        // Try to match based on file extension.
        var extensionMatch = (/\.([a-z1-9]+)(\?|#|\s|$)/i).exec(src);
        if (extensionMatch) {
            var format = fileExtensions[tag][extensionMatch[1]];
            if (format) {
                return format;
            }
        }
        return assumedFormats[tag];
    }
    
    // Detects presence of HTML5 attributes.
    function hasAttr(element, attr) {
        var val = element.getAttribute(attr);
        return !!val || typeof val == "string";
    }
    
    // Standardizes URLs to avoid confusing Flowplayer.
    function fixPath(url) {
        var link = document.createElement("a");
        link.href = url;
        return link.href;
    }
    
    // Calculates the given dimension of the given element.
    function getDimension(element, dimension, fallback) {
        // Attempt to use it's attribute value.
        var result = element.getAttribute(dimension);
        if (result) {
            return result + "px";
        }
        // Attempt to use it's computed style.
        var style;
        if (element.currentStyle) {
            style = element.currentStyle[dimension];
        } else if (window.getComputedStyle) {
            style = document.defaultView.getComputedStyle(element, null).getPropertyValue(dimension);
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
        return format.match(/\s*([\w-]+\/[\w-]+)(;|\s|$)/)[1];
    }
    
    // Checks whether the two formats are equivalent.
    function formatMatches(format1, format2) {
        return (getMimeType(format1) == getMimeType(format2));
    }

    /**
     * Callback for adding custom configuration options to Flowplayer before it
     * launches. This callback is supplied with the tagname of the element being
     * replaced ("video" or "audio"), the element being replaced, and the
     * generated Flowplayer configuration.
     * 
     * This callback should return the updated Flowplayer configuration. By
     * The default implementation leaves the generated configuration intact.
     */
    html5media.configureFlowplayer = function(element, config) {
        return config;
    };
    
    /**
     * Default callback for creating a fallback for html5 media tags.
     * 
     * This implementation creates flowplayer instances, but this can
     * theoretically be used to support all different types of flash player.
     */
    html5media.createFallback = function(tagName, element) {
        var hasControls = hasAttr(element, "controls");
        // Standardize the src and poster.
        var poster = element.getAttribute("poster") || "";
        var src = element.getAttribute("src") || "";
        if (!src) {
            // Find a compatible fallback file.
            var sources = element.getElementsByTagName("source");
            for (var sn = 0; sn < sources.length; sn++) {
                var source = sources[sn];
                var srcValue = source.getAttribute("src");
                if (srcValue) {
                    for (var fn = 0; fn < fallbackFormats.length; fn++) {
                        var fallbackFormat = fallbackFormats[fn];
                        if (formatMatches(fallbackFormat, guessFormat(tagName, srcValue, source.getAttribute("type")))) {
                            src = srcValue;
                            break;
                        }
                    }
                }
                if (src) {
                    break;
                }
            }
        }
        // If there is no src, then fail silently for now.
        if (!src) {
            return;
        }
        // Create the replacement element div.
        var replacement = document.createElement("span");
        replacement.id = element.id;
        replacement.style.cssText = element.style.cssText;
        replacement.className = element.className;
        replacement.title = element.title;
        if (!element.style.display) {
            replacement.style.display = "block";
        }
        replacement.style.width = getDimension(element, "width", "300px");
        if (tagName == "audio") {
            replacement.style.height = getDimension(element, "height", "26px");
            replacement.className = (replacement.className ? replacement.className+" " : "")+html5media.audioFallbackClass;
        } else {
            replacement.style.height = getDimension(element, "height", "200px");
            replacement.className = (replacement.className ? replacement.className+" " : "")+html5media.videoFallbackClass;
        }
        // Replace the element with the div.
        element.parentNode.replaceChild(replacement, element);
        var preload = (element.getAttribute("preload") || "").toLowerCase();
        // Activate flowplayer.
        var playlist = [];
        if (poster) {
            playlist.push({url: fixPath(poster)});
        }
        if (src) {
            playlist.push({
                url: fixPath(src),
                autoPlay: hasAttr(element, "autoplay"),
                autoBuffering: hasAttr(element, "autobuffer") || (hasAttr(element, "preload") && (preload === "" || preload == "auto")),
                onBeforeFinish: function() {
                    return !hasAttr(element, "loop");
                }
            });
        }
        // Determine which plugins should be loaded.
        var plugins = {
            controls: hasControls && {
                url: fixPath(html5media.flowplayerControlsSwf),
                opacity: 0.8,
                backgroundColor: "#181818",
                backgroundGradient: "none",
                fullscreen: tagName == VIDEO_TAG,
                autoHide: tagName == VIDEO_TAG && {
                    fullscreenOnly: false,
                    enabled: true,
                    hideStyle: "fade",
                    mouseOutDelay: 0
                } || {
                    enabled: false
                }
            } || null
        };
        // HACK: Opera cannot autohide controls, for some reason.
        if (isOpera && plugins.controls) {
            plugins.controls.autoHide.enabled = false;
        }
        // Audio-specific config.
        if (tagName == "audio") {
            // Load the audio plugin.
            plugins.audio = {
                url: fixPath(html5media.flowplayerAudioSwf)
            };
            // HACK: The Flowplayer audio plugin requires that the controls plugin is present.
            if (!hasControls) {
                plugins.controls = {
                    url: fixPath(html5media.flowplayerControlsSwf),
                    display: "none"
                };
                replacement.style.height = 0;
            }
            // HACK: Disable autoBuffering, since a flowplayer audio bug can cause uncontrollable autoplaying.
            playlist[playlist.length - 1].autoBuffering = false;
        }
        // Load the Flowplayer.
        var config = {
            play: null,
            playlist: playlist,
            clip: {
                scaling: "fit",
                fadeInSpeed: 0,
                fadeOutSpeed: 0
            },
            canvas: {
                backgroundGradient: "none",
                backgroundColor: "#000000"
            },
            plugins: plugins
        };
        config = html5media.configureFlowplayer(element, config);
        flowplayer(replacement, {
            src: fixPath(html5media.flowplayerSwf),
            expressInstall: fixPath(html5media.expressInstallSwf),
            wmode: "opaque"
        }, config);
    };

    // Automatically execute the html5media function on page load.
    DomReady.ready(html5media);
    
    // Expose html5media to the global object.
    window.html5media = html5media;
    
})(this, document);
