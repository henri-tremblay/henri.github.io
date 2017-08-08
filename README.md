Blog published at http://blog.tremblay.pro

# Local installation

```
bundle install
bundle exec jekyll server -w
```

## Run htmlproofer

```
bundle exec jekyll build
bundle exec htmlproofer ./_site --only-4xx --check-favicon --check-html
```

# Travis

[![Build Status](https://travis-ci.org/henri-tremblay/henri-tremblay.github.io.svg?branch=master)](https://travis-ci.org/henri-tremblay/henri-tremblay.github.io)

# Developer stuff

[All highlighted languages](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml)
