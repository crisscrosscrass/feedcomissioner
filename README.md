# FeedCommissioner

Its a project about reading, validating and reporting shop feeds.

# Features
- URL Import
- File Upload
- Decompression Zip/7z
- Streaming
- XML Parser
- JSON Parser
- File Storage
- File Splitter
- Log Reader

# Technologies
* NodeJS
* EJS
* Docker
* Kubernetes

## Setup
To run this project, install it locally using npm:

* NodeJS
```
$ cd ../feedcommissioner/src
$ npm install
$ npm start
```
* Docker
```
$ cd ../feedcommissioner
$ docker build -t feedcommissioner-app .
$ docker run --name feedcommissioner-app-container -d -p 8060:8060 feedcommissioner-app
```