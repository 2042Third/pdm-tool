#!/bin/bash

# run the docker file after building the web app
docker build -t web_notes . && docker run -p 8080:8080 web_notes

