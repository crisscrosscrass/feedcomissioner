# FeedCommissioner

Its a project about reading, validating and reporting shop feeds.
* [Demo](https://feedcomissioner.herokuapp.com/)
*This Demo is hosted by heroku, keep in mind that there is not much space for validation big files*

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

### Reference Documentation
For further reference, please consider the following sections:

* [Node.js®](https://nodejs.org/en/)
* [EJS - Embedded JavaScript templating.](https://ejs.co/)
* [Docker](https://www.docker.com/)
* [Kubernetes](https://kubernetes.io/)