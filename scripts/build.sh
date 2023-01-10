#!/bin/bash
npm install react-scripts --force
yarn add react
npm run build
tar cvzf build.tar.gz build
mv build.tar.gz /home/test1


