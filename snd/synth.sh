#!/bin/sh
word=`echo "$1" | tr A-Z a-z`
echo -- $word
if [ "$word" != "." ] ; then
	say --progress -v Alex -o "$word".aiff -- "$word"
else
	sox -n -r 22000 -c 1 "$word".aiff trim 0.0 0.2
fi
lame "$word.aiff" "$word.mp3"
