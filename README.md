# reader

A news reader

- reddit
- hackernews
- [news api](https://newsapi.org/) [not started]
  - not free probably
  - [pygooglenews](https://github.com/kotartemiy/pygooglenews)

## Usage

```command
npm install && npm run dev
```

## Features

- [x] reddit
  - [x] add subreddit
  - [x] view comments
    - [x] expand comments
  - [x] view article
    - [x] use mozilla readability - currently broken
    - [x] view images
  - [ ] remember scroll position; make issue
  - [ ] remember subreddit; make issue
  - [ ] remember list of subreddits; make issue
  - [x] mark as read on scroll
  - [ ] mark as read on click
  - [ ] load more on scroll to bottom
    - [ ] detect scroll to bottom
- [x] hackernews
  - [x] view top
    - [x] new
    - [x] jobs
    - [x] ask
    - [x] show
    - [x] best
  - [x] view comments
    - [x] expand comments
  - [x] view article
    - [x] use mozilla readability

## Sites that don't work with readability

- bloomberg
- reuters
- wsj

## License

AGPL-3.0
