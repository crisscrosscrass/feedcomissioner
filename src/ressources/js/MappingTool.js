class MappingSettingTool {
    constructor(validatedElements) {
        this.validatedElements = validatedElements;
        this.mappingSetting = document.getElementById("MappingSetting");
        this.headerValues = validatedElements['FEEDTABLE'].headerValues;
        this.lineCounter = validatedElements.FEEDTABLE.products;
        this.init();
    }
    init() {
        this.mappingSetting.style.display = 'block';
        this.mappingSetting.innerHTML = "<h6>Mapping Setting </h6>";
        this.addAllValidatedElements();
        this.setSelectOptions();
        this.addButton('SettingValidate', 'Validate');
        this.addButton('SettingClose', 'Close');
        this.validateButton = document.getElementById("SettingValidate").onclick = () => this.mappingValidate();
        this.closeButton = document.getElementById("SettingClose").onclick = () => this.closeMappingSettingTool();
    }
    addAllValidatedElements() {
        Object.keys(this.validatedElements).forEach((key) => {
            if (this.validatedElements[key].hasOwnProperty('found')) {
                this.mappingSetting.innerHTML += key;
                this.addSelectAndOptions(key);
                this.mappingSetting.innerHTML += '<br/>';
            }
        });
    }
    setSelectOptions() {
        Object.keys(this.validatedElements).forEach((key) => {
            if (this.validatedElements[key].hasOwnProperty('found')) {
                if (this.validatedElements[key].hasOwnProperty('columnName')) {
                    this.selectElement(key, this.validatedElements[key].columnName);
                } else {
                    this.selectElement(key, "not found");
                }
            }
        });
    }
    selectElement(id, valueToSelect) {
        let element = document.getElementById(id);
        return element.value = valueToSelect;
    }
    addSelectAndOptions(name) {
        var select = document.createElement("SELECT");
        select.setAttribute("id", name);
        for (var j = 0; j < this.headerValues.length; j++) {
            let option = document.createElement("option");
            option.setAttribute("id", j);
            option.value = this.headerValues[j];
            option.innerHTML = this.headerValues[j];
            select.appendChild(option);
        }
        let option = document.createElement("option");
        option.setAttribute("id", this.headerValues.length + 1);
        option.value = "not found";
        option.innerHTML = "not found";
        select.appendChild(option);
        return this.mappingSetting.appendChild(select);
    }
    getOptions() {
        var option = document.createElement("option");
        option.setAttribute("id", j);
        option.value = j;
        option.innerHTML = HeaderArray[j];
        option.appendChild(select);
    }
    addButton(id, content) {
        let button = document.createElement("BUTTON");
        button.setAttribute("id", id);
        button.value = content;
        button.innerHTML = content;
        return this.mappingSetting.appendChild(button);
    }
    mappingValidate() {
        Object.keys(this.validatedElements).forEach((key) => {
            if (this.validatedElements[key].hasOwnProperty('found')) {
                let value = document.getElementById(key).value;
                console.log(value);
                if (value == "not found") {
                    this.setNotFound(key);
                } else {
                    this.setFound(key, value);
                }
            }
        });
        // console.log(this.validatedElements);
        // new FeedAnalysis(response.detectedFile.validatedElements);
        // new PreviewItems(maxSamples, response.detectedFile.validatedElements);
        // new ValidateAndPreview(maxSamples, false, this.validatedElements);
        new FeedAnalysis(this.validatedElements);
        new PreviewItems(maxSamples, this.validatedElements);
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
        console.log(index);
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
            console.log("remove " + attribute);
            return delete this.validatedElements[key][attribute];
        }
    }
    closeMappingSettingTool() {
        this.mappingSetting.style.display = 'none';
        $("#MappingWrapper").hide();
    }
}