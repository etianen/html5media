import re

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app


re_redirects = [
    (re.compile(pattern), redirect_pattern)
    for pattern, redirect_pattern
    in (
        ("^/$", "http://html5media.info/"),
        ("^/([^/]+)/html5media.min.js%22$", "http://html5media.info/%s/html5media.min.js"),
    )
]


class RedirectToDemoHandler(webapp.RequestHandler):

    def get(self):
        self.redirect("http://html5media.info/")
        
        
class RedirectToApiHandler(webapp.RequestHandler):

    def get(self, api_version):
        self.redirect("http://api.html5media.info/%s/html5media.min.js" % api_version, permanent=True)


application = webapp.WSGIApplication(
    (
        ("/", RedirectToDemoHandler),
        ("/([^/]+)/html5media.min.js.+", RedirectToApiHandler),
    ),
    debug = False,
)


def main():
    run_wsgi_app(application)


if __name__ == "__main__":
    main()