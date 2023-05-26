#!/bin/bash
ng build --localize --base-href ./www/
rm -r ../web_notes/www
cp -R ./www ../web_notes/www
cd ../web_notes
