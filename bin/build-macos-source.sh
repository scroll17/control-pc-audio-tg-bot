#!/bin/bash

unzip ./bin/nowplaying-cli-main.zip
cd ./nowplaying-cli-main
make
cd ..
mv ./nowplaying-cli-main/nowplaying-cli ./bin/
rm -rf nowplaying-cli-main