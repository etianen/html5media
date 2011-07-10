#!/usr/bin/env python3
"""
Build script for the html5media project.

This will generate a build directory within the project, containing an example
html file and the minified html5media builds.
"""

import os, shutil, subprocess, re


API_VERSION = "1.1.4"

BIN_ROOT = os.path.dirname(__file__)

PROJECT_ROOT = os.path.abspath(os.path.join(BIN_ROOT, ".."))

SRC_ROOT = os.path.join(PROJECT_ROOT, "src")

LIB_ROOT = os.path.join(PROJECT_ROOT, "lib")

MEDIA_ROOT = os.path.join(SRC_ROOT, "media")

BUILD_ROOT = os.path.join(PROJECT_ROOT, "build")

MEDIA_BUILD_ROOT = os.path.join(BUILD_ROOT, "media")

API_BUILD_ROOT = os.path.join(BUILD_ROOT, "api")

CDN_ROOT = os.path.join(PROJECT_ROOT, "cdn")

CDN_BUILD_ROOT = os.path.join(CDN_ROOT, API_VERSION)

CDN_APP_YAML = os.path.join(CDN_ROOT, "app.yaml")

HTML_ROOT = os.path.join(PROJECT_ROOT, "www")


def compile(filenames, outfile):
    """Compiles the given js files into a single, minified js file."""
    file_list = " ".join('--js "{}"'.format(filename) for filename in filenames)
    compiler_path = os.path.join(BIN_ROOT, "compiler.jar")
    command = 'java -jar {} {} --js_output_file "{}"'.format(compiler_path, file_list, outfile)
    subprocess.call(command, shell=True)


def copy_html(filename, outfile):
    """Copies the given html file, substituting in the production deploy roots."""
    with open(filename, "r", encoding="utf-8") as handle:
        html = handle.read()
    html = html.replace("media/", "http://media.html5media.info/").replace("api/", "http://api.html5media.info/{}/".format(API_VERSION))
    with open(outfile, "w", encoding="utf-8") as handle:
        handle.write(html)


def main():
    # Clean the build root.
    if os.path.exists(BUILD_ROOT):
        shutil.rmtree(BUILD_ROOT)
    # Create the build root.
    os.mkdir(BUILD_ROOT)
    os.mkdir(API_BUILD_ROOT)
    # Create the compiled js files.
    print("Compiling javascript...")
    compile((os.path.join(LIB_ROOT, "flowplayer", "flowplayer.js"),
             os.path.join(LIB_ROOT, "domready", "domready.js"),
             os.path.join(SRC_ROOT, "api", "html5media.js"),),
            os.path.join(API_BUILD_ROOT, "html5media.min.js"))
    # Copy over the Flowplayer resources.
    print("Copying SWF files...")
    shutil.copy(os.path.join(LIB_ROOT, "flowplayer", "flowplayer.swf"),
                os.path.join(API_BUILD_ROOT, "flowplayer.swf"))
    shutil.copy(os.path.join(LIB_ROOT, "flowplayer", "flowplayer.controls.swf"),
                os.path.join(API_BUILD_ROOT, "flowplayer.controls.swf"))
    shutil.copy(os.path.join(LIB_ROOT, "flowplayer.audio", "flowplayer.audio.swf"),
                os.path.join(API_BUILD_ROOT, "flowplayer.audio.swf"))
    # Copy over the license and readme files.
    print("Copying readme files...")
    shutil.copy(os.path.join(PROJECT_ROOT, "LICENSE"),
                os.path.join(API_BUILD_ROOT, "LICENSE"))
    shutil.copy(os.path.join(PROJECT_ROOT, "README.markdown"),
                os.path.join(BUILD_ROOT, "README"))
    # Copy over the demo page.
    print("Copying media files...")
    shutil.copytree(os.path.join(MEDIA_ROOT),
                    os.path.join(MEDIA_BUILD_ROOT))
    shutil.copyfile(os.path.join(SRC_ROOT, "index.html"),
                    os.path.join(BUILD_ROOT, "index.html"))
    shutil.copyfile(os.path.join(SRC_ROOT, "test.html"),
                    os.path.join(BUILD_ROOT, "test.html"))
    # Add the built api files to the CDN.
    print("Updating the CDN...")
    if os.path.exists(CDN_BUILD_ROOT):
        shutil.rmtree(CDN_BUILD_ROOT)
    shutil.copytree(API_BUILD_ROOT,
                    os.path.join(CDN_BUILD_ROOT, API_VERSION))
    # Update the CDN version number.
    with open(CDN_APP_YAML, "r", encoding="utf-8") as handle:
        app_yaml = handle.read()
    app_yaml = re.sub("^version: .+$",
                      "version: {}".format(API_VERSION.replace(".", "-")),
                      app_yaml, 0, re.MULTILINE)
    with open(CDN_APP_YAML, "w", encoding="utf-8") as handle:
        handle.write(app_yaml)
    # Create the demo page.
    print("Creating the demo page...")
    if os.path.exists(HTML_ROOT):
        shutil.rmtree(HTML_ROOT)
    os.mkdir(HTML_ROOT)
    copy_html(os.path.join(BUILD_ROOT, "index.html"),
              os.path.join(HTML_ROOT, "index.html"))
    copy_html(os.path.join(BUILD_ROOT, "test.html"),
              os.path.join(HTML_ROOT, "test.html"))
    # Compile complete!
    print("Compile complete!")


if __name__ == "__main__":
    main()