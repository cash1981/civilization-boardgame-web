#!/bin/bash

grunt
cp web.js dist/
cp bower_components/angular-bootstrap-simple-chat/src/scripts/index.js dist/scripts/irontec-simplechat.js
mkdir -p dist/styles/simplechat
cp bower_components/angular-bootstrap-simple-chat/src/css/style.css dist/styles/simplechat/
cp bower_components/angular-bootstrap-simple-chat/src/css/themes.css dist/styles/simplechat/
cp bower_components/bootstrap/dist/css/bootstrap.min.css dist/styles/

exit 0;
