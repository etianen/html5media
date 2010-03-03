#! /bin/bash
#java -jar compiler.jar --js ../src/flowplayer.js --js ../src/domready.js --js ../src/html5media.js > ../src/html5media.min.js
cat ../src/flowplayer.js ../src/domready.js ../src/html5media.js > ../src/html5media.min.js