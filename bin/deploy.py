#!/usr/bin/env python3
"""
Deploy script for the html5media project.

This needs to be run after the build to push the new version of the app onto the relevant CDNs.
"""

import subprocess, os

from build import MEDIA_BUILD_ROOT, API_BUILD_ROOT, HTML_ROOT, CDN_ROOT


CDN_ASSETS_ROOT = os.path.join(CDN_ROOT, "www")

MEDIA_DEPLOY_ROOT = os.environ["HTML5MEDIA_MEDIA_DEPLOY_ROOT"]

HTML_DEPLOY_ROOT = os.environ["HTML5MEDIA_HTML_DEPLOY_ROOT"]

CDN_DEPLOY_ROOT = os.environ["HTML5MEDIA_CDN_DEPLOY_ROOT"]

CDN_EMAIL = os.environ["HTML5MEDIA_CDN_EMAIL"]

CDN_PASSWORD = os.environ["HTML5MEDIA_CDN_PASSWORD"]


def main():
    # Upload the media files.
    print("Uploading media files...")
    subprocess.call("rsync -r --exclude=.DS_Store {}/ {}".format(MEDIA_BUILD_ROOT, MEDIA_DEPLOY_ROOT), shell=True)
    # Uploading the HTML files.
    print("Uploading html files...")
    subprocess.call("rsync -r {}/*.html {}".format(HTML_ROOT, HTML_DEPLOY_ROOT), shell=True)
    # Deploy the SSL CDN.
    print("Deploying SSL CDN...")
    print("echo {} | appcfg.py update {} --email={} --passin".format(CDN_PASSWORD, CDN_ROOT, CDN_EMAIL))
    subprocess.call("echo {} | appcfg.py update {} --email={} --passin".format(CDN_PASSWORD, CDN_ROOT, CDN_EMAIL), shell=True)
    # Deploy the non-ssl CDN.
    print("Deploying standard CDN...")
    subprocess.call("rsync -r --exclude=.DS_Store {}/ {}".format(CDN_ASSETS_ROOT, CDN_DEPLOY_ROOT), shell=True)
    
    
if __name__ == "__main__":
    main()