# Thy Kingdom Come

A daily devotional app. It works offline, needs no account, and makes no calls to other sites.

## Build

    cd app && npm ci
    node ../tools/build-hymn-audio.mjs ../sources/librivox   # unpacks the hymn recordings
    npx vite build --base ./

The hymn recordings are public domain, from LibriVox (Selections from The Army and Navy Hymnal, volumes 1 and 2).
