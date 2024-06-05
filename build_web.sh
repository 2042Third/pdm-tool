#!/usr/bin/env zsh

# Check if the directory exists
if [ ! -d "../web_notes/" ]; then
    echo "The directory '../web_notes/' does not exist."
    exit 1
fi

ng build --localize --base-href ./www/ &&
rm -r ../web_notes/www &&
cp -R ./www ../web_notes/www &&
cd ../web_notes || return &&
sh pack.sh &&
cd ../pdm-tool || return &&
cp ../web_notes.war ./web_notes.war
