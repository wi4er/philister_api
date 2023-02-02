#!/bin/sh

version="0.0.3"

docker buildx create --name mbuilder
docker buildx build --push -t wi4er/philister:$version --platform linux/arm64,linux/amd64 .