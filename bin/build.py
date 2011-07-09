#!/usr/bin/env python3
"""
Build script for the html5media project.

This will generate a build directory within the project, containing an example
html file and the minified html5media builds.
"""


import os, shutil, subprocess


BIN_ROOT = os.path.dirname(__file__)

PROJECT_ROOT = os.path.abspath(os.path.join(BIN_ROOT, ".."))

SRC_ROOT = os.path.join(PROJECT_ROOT, "src")

LIB_ROOT = os.path.join(PROJECT_ROOT, "lib")

BUILD_ROOT = os.path.join(PROJECT_ROOT, "build")

HTML5MEDIA_BUILD_ROOT = os.path.join(BUILD_ROOT, "html5media")


def compile(filenames, outfile):
    """Compiles the given js files into a single, minified js file."""
    file_list = " ".join('--js "{}"'.format(filename) for filename in filenames)
    compiler_path = os.path.join(BIN_ROOT, "compiler.jar")
    command = 'java -jar {} {} --js_output_file "{}"'.format(compiler_path, file_list, outfile)
    subprocess.call(command, shell=True)


def main():
    # Clean the build root.
    if os.path.exists(BUILD_ROOT):
        shutil.rmtree(BUILD_ROOT)
    # Create the build root.
    os.mkdir(BUILD_ROOT)
    os.mkdir(HTML5MEDIA_BUILD_ROOT)
    # Create the compiled js files.
    compile((os.path.join(LIB_ROOT, "flowplayer", "flowplayer.js"),
             os.path.join(LIB_ROOT, "domready", "domready.js"),
             os.path.join(SRC_ROOT, "html5media", "html5media.js"),),
            os.path.join(HTML5MEDIA_BUILD_ROOT, "html5media.min.js"))
    compile((os.path.join(LIB_ROOT, "flowplayer", "flowplayer.js"),
             os.path.join(SRC_ROOT, "html5media", "html5media.js"),),
            os.path.join(HTML5MEDIA_BUILD_ROOT, "jquery.html5media.min.js"))
    # Copy over the Flowplayer resources.
    shutil.copy(os.path.join(LIB_ROOT, "flowplayer", "flowplayer.swf"),
                os.path.join(HTML5MEDIA_BUILD_ROOT, "flowplayer.swf"))
    shutil.copy(os.path.join(LIB_ROOT, "flowplayer", "flowplayer.controls.swf"),
                os.path.join(HTML5MEDIA_BUILD_ROOT, "flowplayer.controls.swf"))
    shutil.copy(os.path.join(LIB_ROOT, "flowplayer.audio", "flowplayer.audio.swf"),
                os.path.join(HTML5MEDIA_BUILD_ROOT, "flowplayer.audio.swf"))
    # Copy over the license and readme files.
    shutil.copy(os.path.join(PROJECT_ROOT, "LICENSE"),
                os.path.join(HTML5MEDIA_BUILD_ROOT, "LICENSE"))
    shutil.copy(os.path.join(PROJECT_ROOT, "README.markdown"),
                os.path.join(BUILD_ROOT, "README"))
    # Copy over the demo page.
    shutil.copytree(os.path.join(SRC_ROOT, "demo"),
                    os.path.join(BUILD_ROOT, "demo"))
    shutil.copy(os.path.join(SRC_ROOT, "index.html"),
                os.path.join(BUILD_ROOT, "index.html"))
    shutil.copy(os.path.join(SRC_ROOT, "test.html"),
                os.path.join(BUILD_ROOT, "test.html"))


if __name__ == "__main__":
    main()