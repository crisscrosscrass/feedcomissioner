const path = require('path');
const loadSyncConfig = require('./loadSyncConfig');

module.exports = class FeedValidation {
    constructor(headerValues, syncMapping) {
        this.headerValues = headerValues;
        this.syncMapping = syncMapping;
        this.syncMappingXMLFile = "" + path.dirname(__dirname) + '/ressources/data/SyncMapping_QM.xml';
        this.syncMapping = "";
        this.Init();
    }
    Init() {
        console.log(this.syncMapping)
        this.validateAllAttributesViaTable(this.syncMapping);
    }
    getTableHeaderNamesAndPositions(headerValues) {
        let tableHeaderInfo = {};
        for (let i = 0; i < headerValues.length; i++) {
            let headerValue = headerValues[i];
            tableHeaderInfo['column' + i] = {
                header: headerValue,
                position: i
            }
        }
        return tableHeaderInfo
    }
    getColumnIndexViaHeaderName(tableHeaderInfo, searchedColumn) {
        for (let prop in tableHeaderInfo) {
            if (tableHeaderInfo[prop].header == searchedColumn) {
                return tableHeaderInfo[prop].position;
            }
        }
        return false;
    }
    getValidatedElements(syncMapping, tableHeaderInfo, headerValues) {
        let originHeaderValues = [...headerValues];
        let validatedElements = {};
        let limitSyncMapping = syncMapping.syncMappingCollection.length - 1;
        for (let i = 0; limitSyncMapping; i++) {
            //console.log("Name: " + syncMapping.syncMappingCollection[i].name);
            //console.log("Regex: " + syncMapping.syncMappingCollection[i].regex);
            let regex = new RegExp(syncMapping.syncMappingCollection[i].regex);
            let limitHeaderValues = headerValues.length;
            if (syncMapping.syncMappingCollection[i].regex.length != 0 && regex != undefined) {
                for (var j = 0; limitHeaderValues; j++) {
                    //console.log(regex.test(headerValues[j]))
                    if (regex.test(headerValues[j])) {
                        validatedElements[syncMapping.syncMappingCollection[i].name] = {
                            found: true,
                            columnName: headerValues[j],
                            regex: syncMapping.syncMappingCollection[i].regex,
                            name: syncMapping.syncMappingCollection[i].name,
                            columnIndex: this.getColumnIndexViaHeaderName(tableHeaderInfo, headerValues[j])
                        };
                        headerValues.splice(j, 1);
                        break;
                    } else {
                        validatedElements[syncMapping.syncMappingCollection[i].name] = {
                            found: false,
                            name: syncMapping.syncMappingCollection[i].name,
                            regex: syncMapping.syncMappingCollection[i].regex
                        };
                    }

                    if (j >= limitHeaderValues) {
                        //console.log("Needed to break caused by Promise");
                        break;
                    }
                }
            } else {
                validatedElements[syncMapping.syncMappingCollection[i].name] = {
                    name: syncMapping.syncMappingCollection[i].name,
                    found: false
                };
            }
            // go over the rest and make them all found:false
            if (typeof validatedElements[syncMapping.syncMappingCollection[i].name] === 'undefined') {
                validatedElements[syncMapping.syncMappingCollection[i].name] = {
                    found: false,
                    regex: syncMapping.syncMappingCollection[i].regex,
                    name: syncMapping.syncMappingCollection[i].name
                };
            }

            if (i >= limitSyncMapping) {
                //console.log("Needed to break caused by Promise");
                break;
            }
        }
        validatedElements['FEEDTABLE'] = {
            headerValues: originHeaderValues,
            tableHeaderInfo: tableHeaderInfo
        }
        return validatedElements;
    }
    validateAllAttributesViaTable(syncMapping) {
        let tableHeaderInfo = this.getTableHeaderNamesAndPositions(this.headerValues);
        let headerValues = [];
        for (let prop in tableHeaderInfo) {
            headerValues.push(tableHeaderInfo[prop].header);
        }
        console.log('headerValues before getElements:');
        console.log(headerValues, headerValues.length);
        // get found = true/false, columnName, columnIndex for each
        let validatedElements = this.getValidatedElements(this.syncMapping, tableHeaderInfo, headerValues);
        //console.log('headerValues after getElements:');
        //console.log(headerValues, headerValues.length);
        this.calculateCellValues(validatedElements);
    }
    calculateCellValues(validatedElements) {
        // validatedElements = this.countEmptyCells(validatedElements);
        // validatedElements = this.countDuplicatedContent(validatedElements);
        // console.log('%c validated Elements:', 'background-color: black; color: green; font-weight: bold;');
        //console.table(validatedElements);
        this.callFeedAnalysisServices(validatedElements);
    }
    callFeedAnalysisServices(validatedElements) {
        new FeedbackBuilder(validatedElements);
        new FeedAnalysis(validatedElements);
        new PreviewItems(this.maxSamples, validatedElements);
        return globalValidatedElements = validatedElements;
    }
}