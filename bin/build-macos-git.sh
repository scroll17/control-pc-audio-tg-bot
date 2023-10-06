#!/bin/bash

git clone https://github.com/kirtan-shah/nowplaying-cli
cd ./nowplaying-cli
make
cd ..
mv ./nowplaying-cli/nowplaying-cli ./bin/
rm -rf nowplaying-cli