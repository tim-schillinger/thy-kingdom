# Thy Kingdom Come

A daily devotional app. It works offline, needs no account, and makes no calls to other sites.

## Build

    cd app && npm ci --ignore-scripts
    node ../tools/build-hymn-audio.mjs ../sources/librivox   # unpacks the hymn recordings
    npm run build -- --base ./                               # lints, then builds into app/dist
    npm test                                                 # every test the repo keeps

Dependabot proposes updates weekly; .github/workflows/check.yml builds and tests each one, and a merge to main publishes.

The hymn recordings are public domain, from LibriVox (Selections from The Army and Navy Hymnal, volumes 1 and 2).
