class SyncMappingConfig {
    constructor() {
        this.syncMappingCollection = [];
    }
    addAttribute(processing, name, regex) {
        //let regex = "";
        //regexString.length > 1 ? regex = '/' + regexString + '/' : "";
        let SyncMapping = { processing: processing, name: name, regex: regex }
        this.syncMappingCollection.push(SyncMapping);
    }
    displayCollection() {
        console.log(this.syncMappingCollection);
    }
    sortCollection() {
        let newArray = [...this.syncMappingCollection];
        newArray.sort((a, b) => parseInt(a.processing) - parseInt(b.processing));
        console.log(this.syncMappingCollection);
        console.log(newArray);
    }
}

async function getSyncMapping(mappingFile) {
    return new Promise((resolve, reject) => {
        syncMapping = new SyncMappingConfig();
        Object.entries(mappingFile['pipeline']['task'][3]['column-mapping']).forEach((key) => {
            key.forEach((subkey) => {
                if (subkey['$'] != undefined) {
                    syncMapping.addAttribute(subkey['$'].processed, subkey['$'].name, subkey['$'].originalname);
                }
            });
        });
        resolve(syncMapping);
        if (syncMapping == null) {
            reject();
        }
    })
}

module.exports = getSyncMapping;