function getTableHeaderNamesAndPositions(headerValues) {
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

function getValidatedElements(syncMapping, tableHeaderInfo, headerValues) {
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
                // console.log(syncMapping.syncMappingCollection[i].name, regex.test(headerValues[j]), headerValues[j], headerValues.length);
                // if (syncMapping.syncMappingCollection[i].name == "AVAILABILITY" ||
                //     syncMapping.syncMappingCollection[i].name == "IMAGE URL" ||
                //     syncMapping.syncMappingCollection[i].name == "TOP CATEGORY") {
                //     console.log(headerValues);
                // }
                if (regex.test(headerValues[j])) {
                    validatedElements[syncMapping.syncMappingCollection[i].name] = {
                        found: true,
                        columnName: headerValues[j],
                        regex: syncMapping.syncMappingCollection[i].regex,
                        name: syncMapping.syncMappingCollection[i].name,
                        columnIndex: getColumnIndexViaHeaderName(tableHeaderInfo, headerValues[j])
                    };
                    headerValues.splice(j, 1);
                    // console.log(syncMapping.syncMappingCollection[i].name);
                    // console.log(headerValues, headerValues.length);
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
            attributes: originHeaderValues.length,
            tableHeaderInfo: tableHeaderInfo
        }
        //console.log(validatedElements);
    return validatedElements;
}

function getColumnIndexViaHeaderName(tableHeaderInfo, searchedColumn) {
    for (let prop in tableHeaderInfo) {
        if (tableHeaderInfo[prop].header == searchedColumn) {
            return tableHeaderInfo[prop].position;
        }
    }
    return false;
}

async function validateAllAttributesViaFeed(syncMapping, headerFile, headerValues) {
    return new Promise((resolve, rejected) => {
        let tableHeaderInfo = getTableHeaderNamesAndPositions(headerValues);

        console.log('headerValues before getElements:');
        console.log(headerValues, headerValues.length);
        // get found = true/false, columnName, columnIndex for each
        let validatedElements = getValidatedElements(syncMapping, tableHeaderInfo, headerValues);
        //console.log('headerValues after getElements:');
        //console.log(headerValues, headerValues.length);
        resolve(validatedElements)
    })
}


module.exports = validateAllAttributesViaFeed