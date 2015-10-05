#!/bin/bash

grunt
cp web.js dist/
cp app/scripts/irontec-simplechat.js dist/scripts/irontec-simplechat.js
mkdir -p dist/styles/simplechat
cp app/styles/simplechat/*.css dist/styles/simplechat/
cp bower_components/bootstrap/dist/css/bootstrap.min.css dist/styles/bootstrap.css

exit 0;
