# reader

A news reader

- reddit
- hackernews [not started]
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
    - [x] use mozilla readability
    - [x] view images
  - [ ] remember scroll position; make issue
  - [ ] remember subreddit; make issue
  - [ ] remember list of subreddits; make issue
  - [ ] mark as read on scroll
  - [ ] mark as read on click
  - [ ] load more on scroll to bottom
    - [ ] detect scroll to bottom
- [ ] hackernews
  - [ ] view top
    - [ ] new
    - [ ] jobs
  - [ ] view comments
    - [ ] expand comments
  - [ ] view article
    - [ ] use mozilla readability
    - [ ] view images

## Sites that don't work with readability

- bloomberg

## License

AGPL-3.0
