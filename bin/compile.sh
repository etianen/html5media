#! /bin/bash
java -jar compiler.jar --js ../src/flowplayer.js --js ../src/domready.js --js ../src/html5media.js > ../src/html5media.min.js
java -jar compiler.jar --js ../src/flowplayer.js --js ../src/domready.js --js ../src/html5media.js --js ../src/jquery.html5media.js > ../src/jquery.html5media.min.js