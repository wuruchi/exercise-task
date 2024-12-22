# Exercise-task

## Description

This repository stores the implementation of a technical exercise.

The project contains two sub-projects:

- `itunes-proxy-api`: Expresss API.
- `itunes-proxy-ui`: VueJS UI that consumes the API.

The file `task-2.js` contains commentary on an example file.

## How to test

Make sure to use `node@20`.

### Testing itunes-proxy-api

Run
```bash
cd itunes-proxy-api
npm install
npm run test
```

### Testing itunes-proxy-ui

Run
```bash
cd itunes-proxy-ui
npm install
npm run test
```
## How to run

You can manually run each project on a different terminal console, or run:

```bash
npm start
```

This command uses `docker-compose` to start the containers defined in the file `docker-compose.yml`. Make sure `docker` is up and running.
