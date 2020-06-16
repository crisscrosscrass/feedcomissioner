class SplitterManager {
    constructor(useDownload = false, useUpload = false, useStored = false) {
        useDownload ? this.downloadFile() : ""
        useUpload ? this.uploadFile() : ""
        useStored ? this.storedFile() : ""
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
    storedFile() {
        this.showInfo("Downloading...");
        let data = {
            fileName: document.getElementById('selectStoredFile').value,
            amountOfBatches: document.getElementById('batchAmount').value
        }
        this.dynamicAjax('splitter/stored_file', data, (response) => {
            console.log(response);
            $("#AjaxOutput").empty().append(response.detectedFile.message + '<br/>');
            this.addDownloadFileButton(response.detectedFile.fileName);
        })
    }
    downloadFile() {
        this.showInfo("Downloading...");
        let data = {
            fileName: document.getElementById('url').value,
            amountOfBatches: document.getElementById('batchAmount').value
        }

        this.dynamicAjax('splitter/download_file', data, (response) => {
            console.log(response);
            $("#AjaxOutput").empty().append(response.detectedFile.message + '<br/>');
            this.addDownloadFileButton(response.detectedFile.fileName);
        })
    }
    uploadFile() {
        var formData = new FormData();
        formData.append('file', $('input[type=file]')[0].files[0]);
        // e.preventDefault();
        $.ajax({
            url: "splitter/upload_file", // Url to which the request is send
            type: "POST", // Type of request to be send, called as method
            data: formData, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false, // The content type used when sending data to the server.
            asynch: true,
            maxFileSize: 400000000,
            cache: false, // To unable request pages to be cached
            processData: false, // To send DOMDocument or non processed data file it is set to false
            success: function(response) {
                $("#AjaxOutput").empty().append(response.detectedFile.message + '<br/>');
            },
            complete: function() {},
            error: function() {
                source.close();
            },
        });
    }
    addDownloadFileButton(fileName) {
        if (fileName != "-") {
            $("#AjaxOutput").append('<a href="files/' + fileName + '" target="_blank" class="downloadButton" title="' + fileName + '" >Download</a>');
        }
    }
}