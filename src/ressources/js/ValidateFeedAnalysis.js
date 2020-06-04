class ValidateFeedAnalysis {
    constructor(validatedElements) {
        this.validatedElements = validatedElements;
        this.headerValues = this.validatedElements.FEEDTABLE.headerValues;
        this.lineCounter = validatedElements.FEEDTABLE.products;
        this.mappingValidate();
    }
    setNotFound(key) {
        this.validatedElements[key].found = false;
        this.removeProperty(key, "columnName");
        this.removeProperty(key, "duplicatesUnique");
        this.removeProperty(key, "columnIndex");
        this.removeProperty(key, "emptyCells");
        this.removeProperty(key, "filledCells");
        this.removeProperty(key, "percentFilledCells");
        this.removeProperty(key, "amountOfDuplicates");
        this.removeProperty(key, "percentOfDuplicates");
        this.removeProperty(key, "totalCells");
        this.removeProperty(key, "regex");
    }
    roundDigits(calc100) {
        return +(Math.round(calc100 + "e+2") + "e-2");
    }
    setFound(key, name) {
        let index = this.getColumnIndexFromArray(name);
        this.validatedElements[key].found = true;
        this.validatedElements[key].columnName = name;
        this.validatedElements[key].columnIndex = index;
        this.validatedElements[key].totalCells = this.lineCounter;
        this.validatedElements[key].filledCells = this.lineCounter - this.validatedElements.FEEDTABLE.emptyCellsContent[index];
        let calc100 = Math.abs(100 - ((this.validatedElements.FEEDTABLE.emptyCellsContent[index] / (this.lineCounter)) * 100));
        this.validatedElements[key].percentFilledCells = this.roundDigits(calc100);
    }
    getColumnIndexFromArray(name) {
        for (let i = 0; this.headerValues.length; i++) {
            if (this.headerValues[i] == name) {
                return i;
            }
        }
    }
    removeProperty(key, attribute) {
        if (this.validatedElements[key].hasOwnProperty(attribute)) {
            return delete this.validatedElements[key][attribute];
        }
    }
    mappingValidate() {
        Object.keys(this.validatedElements).forEach((key) => {
            if (this.validatedElements[key].hasOwnProperty('found')) {
                if (document.getElementById(key) != null) {
                    let value = document.getElementById(key).value;
                    if (value == "not found") {
                        this.setNotFound(key);
                    } else {
                        this.setFound(key, value);
                    }
                }
            }
        });
        // console.log(this.validatedElements);
        // new FeedAnalysis(response.detectedFile.validatedElements);
        // new PreviewItems(maxSamples, response.detectedFile.validatedElements);
        // new ValidateAndPreview(maxSamples, false, this.validatedElements);
        new FeedAnalysis(this.validatedElements);
        new PreviewItems(maxSamples, this.validatedElements);
        namingFeedAnalysis(this.validatedElements);
        return globalValidatedElements = this.validatedElements;
    }
}