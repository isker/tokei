#!/usr/bin/env bash
# Script for building your rust projects
# $1 {path} = Path to cross executable
CROSS=$1
# $1 {string} = <Target Triple>
TARGET_TRIPLE=$2
# $3 {boolean} = Whether or not building for release or not.
RELEASE_BUILD=$3

if [-z "$CROSS" ]; then
    echo "No cross binary provided"
    exit 1
fi

if [-z "$TARGET_TRIPLE" ]; then
    echo "No target triple provided"
    exit 1
fi

if [-z "$RELEASE_BUILD" ]; then
    $CROSS build --target $TARGET_TRIPLE
    $CROSS build --target $TARGET_TRIPLE --all-features
else
    $CROSS build --target $TARGET_TRIPLE --all-features --release
fi
