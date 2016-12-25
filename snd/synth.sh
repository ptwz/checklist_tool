#!/bin/sh
word=`echo $1 | tr A-Z a-z`
echo $word
say --progress -v Alex -o "$word".aiff "$word"
lame "$word.aiff" "$word.mp3"
