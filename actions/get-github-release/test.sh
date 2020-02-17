#!/usr/bin/env bash

set -e

INPUT_REPO=mdbook \
INPUT_MATCHES=apple \
INPUT_OWNER=rust-lang \
INPUT_TOKEN=$GITHUB_API_KEY \
node index.js
/tmp/mdbook -h

rm /tmp/mdbook
