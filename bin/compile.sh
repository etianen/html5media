#! /bin/bash
cat ../src/flowplayer.js > ../src/jquery.html5media.min.js
cat ./header.js >> ../src/jquery.html5media.min.js
java -jar compiler.jar --js ../src/jquery.html5media.js >> ../src/jquery.html5media.min.js
