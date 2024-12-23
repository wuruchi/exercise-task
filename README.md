# Exercise-task

## Description

This repository stores the implementation of two technical exercises.

The **first exercise** involves building an API (`itunes-proxy-api`) that consumes the **iTunes API Search endpoint** for a specific scenario and then returns the result in a structured manner. Then, we build a `VueJS` UI (`itunes-proxy-ui`) that consumes the API and shows the information while also providing some extra funcionality.

The **second exercise** involves analyzing a code sample, provide commentary on the quality of the code and try to identify potential sources of exceptions. Then, provide a refactored version. The file `task-2.js` contains the solution for this task.

## How to run

You can manually run each project on a different terminal console, or run:

```bash
npm start
```

This command uses `docker-compose` to start the containers defined in the file `docker-compose.yml`. Make sure `docker` is up and running. Make sure the ports `5000` and `8080` are available.

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
