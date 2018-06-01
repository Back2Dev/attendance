#!/bin/bash
#
# Kwik script to cut a release of memberapp
#
# You should be cd'ed to the root of the memberapp. It is assumed that this repo lives in the same
# folder as the memberapp repo.
#
# Syntax: ../releases/scripts/mkrelease.sh https://target-server v1.x.x
#
# TODO: Check working directory
# TODO: Check release doesn't exist already
# TODO: Write this in nodejs
#
# This one should fail (hopefully the android device is not connected)
#meteor --mobile-server $1 run android-device --port 9900

meteor build --server $1 ../releases/$2

scp ../releases/$2/meteor-app.tar.gz triton@192.168.1.4:/home/triton/attendance.$2.tgz
#scp ../releases/$2/android/project/build/outputs/apk/android-armv7-debug.apk triton@192.168.1.4:/home/triton/android-armv7-debug.$2.apk
