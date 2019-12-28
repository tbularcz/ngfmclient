@echo off
npm run build
echo build complete
build\firebase deploy
echo staging complete
