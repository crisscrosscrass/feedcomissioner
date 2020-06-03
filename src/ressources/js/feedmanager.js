var globalValidatedElements;
class FeedManager {
    constructor(cleaning = false) {
        cleaning ? this.cleanupFeeds() : this.init();
    }
    init() {
        this.downloadFile();
    }
    dynamicAjax(urlServer, data, callback) {
        $.ajax({
            type: "POST",
            url: urlServer,
            asynch: true,
            data: data,
            success: callback,
            complete: function() {},
            error: function() {
                // will fire when timeout is reached
                console.log('connection to the server failed!');
            },
            timeout: 240000
        });
    }
    showInfo(msg) {
        document.getElementById('dynamicLoadingContent').innerHTML = msg;
    }
    downloadFile() {
        this.showInfo("Downloading...");
        this.dynamicAjax('/download_file', $('form').serialize(), (response) => {
            console.log(response);
            $("#AjaxOutput").empty().append(response.detectedFile.message + '<br/>');
            if (response.detectedFile.proceed) {
                this.proceedFile(response.detectedFile.fileName, response.detectedFile.fileType);
            }
        })
    }
    proceedFile(fileName, fileType) {
        console.log('fileName: ', fileName, 'fileType: ', fileType);
        if (fileType == ".gz" || fileType == ".zip") {
            console.log('%cDECOMPRESS', 'background-color: black; color: red; font-weight: bold;');
            this.decompressFile(fileName);
        } else if (fileType == ".xml") {
            console.log('%cXML CONVERT', 'background-color: black; color: green; font-weight: bold;');
            this.convertXMLFileType(fileName);
        } else if (fileType == ".json") {
            console.log('%cJSON CONVERT', 'background-color: black; color: yellow; font-weight: bold;');
            this.convertJSONFileType(fileName);
        } else if (fileType == ".csv" || fileType == ".txt") {
            console.log('%cCSV Analyze', 'background-color: black; color: white; font-weight: bold;');
            this.validateFile(fileName);
        } else {
            console.log('%cDETECT FILETYPE', 'background-color: black; color: purple; font-weight: bold;');
            this.detectFileType(fileName);
        }
    }
    decompressFile(fileName) {
        this.showInfo(`Decompress File: ${fileName}`);
        this.dynamicAjax('/decrompress_file', { fileName: fileName }, (response) => {
            console.log(response);
            $("#AjaxOutput").append(response.detectedFile.message);
            $("#AjaxOutput").append('<a href="' + window.location.href + 'feeds/' + response.detectedFile.fileName + '" target="_blank" class="downloadButton" title="' + response.detectedFile.fileName + '" >Download</a>');
            $("#AjaxOutput").append('<br/>');
            this.proceedFile(response.detectedFile.fileName, response.detectedFile.fileType);
        });
    }
    detectFileType(fileName) {
        this.showInfo("Detect File Type...");
        this.dynamicAjax('/detect_file_type', { fileName: fileName }, (response) => {
            console.log(response);
            $("#AjaxOutput").append(response.detectedFile.message + '<br/>');
            this.proceedFile(response.detectedFile.fileName, response.detectedFile.fileType);
        });
    }
    convertXMLFileType(fileName) {
        this.showInfo("Convert XML File to JSON!");
        this.dynamicAjax('/convert_xml_file', { fileName: fileName }, (response) => {
            console.log(response);
            $("#AjaxOutput").append(response.detectedFile.message);
            $("#AjaxOutput").append('<a href="' + window.location.href + 'feeds/' + response.detectedFile.fileName + '" target="_blank" class="downloadButton" title="' + response.detectedFile.fileName + '" >Download</a>');
            $("#AjaxOutput").append('<br/>');
            this.proceedFile(response.detectedFile.fileName, response.detectedFile.fileType);
        });
    }
    convertJSONFileType(fileName) {
        this.showInfo("Convert JSON File to CSV!");
        this.dynamicAjax('/convert_json_file', { fileName: fileName }, (response) => {
            console.log(response);
            $("#AjaxOutput").append(response.detectedFile.message);
            $("#AjaxOutput").append('<a href="' + window.location.href + 'feeds/' + response.detectedFile.fileName + '" target="_blank" class="downloadButton" title="' + response.detectedFile.fileName + '" >Download</a>');
            $("#AjaxOutput").append('<br/>');
            this.proceedFile(response.detectedFile.fileName, response.detectedFile.fileType);
        });
    }
    validateFile(fileName) {
        this.showInfo("Reading File...");
        this.dynamicAjax('/validate_file', { fileName: fileName }, (response) => {
            console.log(response);
            $("#AjaxOutput").append(response.detectedFile.message);
            // $("#AjaxOutput").append('<a href="path_to_file" class="downloadButton" title="' + response.detectedFile.fileName + '" download="' + window.location.href + 'feeds/' + response.detectedFile.fileName + '">Download</a>');
            $("#AjaxOutput").append('<br/>');
            new FeedAnalysis(response.detectedFile.validatedElements);
            new PreviewItems(maxSamples, response.detectedFile.validatedElements);
            return globalValidatedElements = response.detectedFile.validatedElements;
        });
    }
    cleanupFeeds() {
        this.showInfo("Cleaning Folder Feeds...");
        this.dynamicAjax('/cleaning_feeds', {
            fileName: ""
        }, (response) => {
            console.log(response);
            $("#AjaxOutput").empty().append(response.detectedFile.message);
        });
    }

}