class FeedAnalysis {
    constructor(validatedElements) {
        this.writelocation = document.getElementById("check");
        //schalter === true ? writelocation = document.getElementById("check2") : "";
        this.validatedElements = validatedElements;
        this.tableLines = validatedElements.FEEDTABLE.products;
        this.maxtableColumns = validatedElements.FEEDTABLE.attributes;
        this.init();
    }
    init() {
        this.underlineHeader();
        this.analyzeOverview();
        this.analyzeMandatory();
        this.analyzeOther();
        this.analyzeDuplicateOverview();
    }
    underlineHeader() {
        this.writelocation.innerHTML = '<h2 id="underlineHeader"><strong style="font-size: 30px;font-family: Raleway;">Feed Analysis </strong></h2>';
    }
    createBadge(header, content, location) {
        let span = document.createElement("SPAN");
        span.setAttribute("id", "analyzeProducts");
        span.innerHTML += header + ' <h1 style="margin: 0;">' + content + '</h1>';
        location.appendChild(span);
    }
    createConditionalBadge(header, key, content, location, css = false) {
        var span = document.createElement("SPAN");
        span.setAttribute("id", "analyzeProducts");

        if (!css) {
            if (key.found && content <= 0) {
                span.setAttribute("class", "notFound");
                span.innerHTML += header + ' <h1 style="margin: 0;">' + "&#8275;" + '</h1>'; // ⁓
            } else if (!key.found || content <= 0) {
                span.setAttribute("class", "noDeal");
                span.innerHTML += header + ' <h1 style="margin: 0;">' + "&#10008;" + '</h1>'; // ✘
            } else {
                span.innerHTML += header + ' <h1 style="margin: 0;">' + "&#10004;" + '</h1>'; // ✔
                span.setAttribute("title", "Column: " + key.columnName);
            }
        } else {
            span.setAttribute("class", "noDeal");
            span.innerHTML += header + ' <h1 style="margin: 0;">' + content + '</h1>';
        }
        location.appendChild(span);
    }
    createTableHeader(content, colspan, classname, location) {
        let th = document.createElement("TH");
        th.innerHTML += content;
        th.setAttribute("colspan", colspan);
        th.setAttribute("class", classname);
        location.appendChild(th);
    }
    createTableCellContent(content, classname, location) {
        let td = document.createElement("TD");
        td.innerHTML += content;
        td.setAttribute("class", classname);
        location.appendChild(td);
    }
    createTableCellPercentContent(key, location, css) {
        var td = document.createElement("TD");
        if (key.found) {
            td.innerHTML += "<strong>" + key.percentFilledCells + " % </strong>" + "<br> (" + key.filledCells + "/" + key.totalCells + ") ";
        } else {
            td.innerHTML += ""
        }
        var tester = key.percentFilledCells;
        if (key.found == false) {
            css ? td.setAttribute("class", "missingwithNumber") : td.setAttribute("class", "missing");
        } else if (tester <= Number(0)) {
            td.setAttribute("class", "missingEmpty");
        } else if (tester <= Number(10)) {
            td.setAttribute("class", "missingwithNumber");
        } else if (tester <= Number(50)) {
            td.setAttribute("class", "missinghalf");
        } else {
            td.setAttribute("class", "data");
        }
        location.appendChild(td);
    }
    createFoundTableCellIcon(found, location, css = false) {
        let td = document.createElement("TD");
        if (found) {
            td.innerHTML += "&#10004;";
            td.setAttribute("class", "found");
        } else {
            td.innerHTML += "&#10008;";
            td.setAttribute("class", "missing");
        }
        if (css) {
            if (found) {
                td.setAttribute("class", "otherfound");
            } else {
                td.setAttribute("class", "othermissing");
            }
        }

        location.appendChild(td);
    }
    createAttributeRow(namingAttributesMandatory, classnameMandatory, namingAttributesImportant, classnameImportant, location) {
        let tableRow = document.createElement("TR");
        tableRow.setAttribute("id", "Header");
        for (let i = 0; i < namingAttributesMandatory.length; i++) {
            this.createTableCellContent('<span style="font-size: 0.7em;">' + this.validatedElements[namingAttributesMandatory[i]].name + '</span>', classnameMandatory, tableRow)
        }
        for (let i = 0; i < namingAttributesImportant.length; i++) {
            this.createTableCellContent('<span style="font-size: 0.7em;">' + this.validatedElements[namingAttributesImportant[i]].name + '</span>', classnameImportant, tableRow)
        }
        location.appendChild(tableRow);
    }
    createFoundIconRow(namingAttributesMandatory, namingAttributesImportant, location, css = false) {
        // if found, CHECK-ICON
        let tableRow = document.createElement("TR");
        tableRow.setAttribute("id", "Value");
        for (let i = 0; i < namingAttributesMandatory.length; i++) {
            this.createFoundTableCellIcon(this.validatedElements[namingAttributesMandatory[i]].found, tableRow, css);
        }
        for (let i = 0; i < namingAttributesImportant.length; i++) {
            this.createFoundTableCellIcon(this.validatedElements[namingAttributesImportant[i]].found, tableRow, css);
        }
        location.appendChild(tableRow);
    }
    createColumnNamesRow(namingAttributesMandatory, namingAttributesImportant, location, css = false) {
        var tr = document.createElement("TR");
        tr.setAttribute("id", "Value");
        for (let i = 0; i < namingAttributesMandatory.length; i++) {
            if (this.validatedElements[namingAttributesMandatory[i]].found) {
                this.createTableCellContent('' + this.validatedElements[namingAttributesMandatory[i]].columnName + '', ' ', tr);
            } else {
                css ? this.createTableCellContent(" ", "", tr) : this.createTableCellContent(" ", "missing", tr);
            }
        }
        for (let i = 0; i < namingAttributesImportant.length; i++) {
            if (this.validatedElements[namingAttributesImportant[i]].found) {
                this.createTableCellContent("" + this.validatedElements[namingAttributesImportant[i]].columnName + "", " ", tr);
            } else {
                css ? this.createTableCellContent(" ", "", tr) : this.createTableCellContent(" ", "missing", tr);
            }
        }
        location.appendChild(tr);
    }
    createColumnPercentRow(namingAttributesMandatory, namingAttributesImportant, location, css = false) {
        let tr = document.createElement("TR");
        tr.setAttribute("id", "Value");
        for (let i = 0; i < namingAttributesMandatory.length; i++) {
            this.createTableCellPercentContent(this.validatedElements[namingAttributesMandatory[i]], tr, css);
        }
        for (let i = 0; i < namingAttributesImportant.length; i++) {
            this.createTableCellPercentContent(this.validatedElements[namingAttributesImportant[i]], tr, css);
        }
        location.appendChild(tr);
    }
    analyzeOverview() {
        let div = document.createElement("DIV");
        div.setAttribute("id", "analyzeOverview");
        this.writelocation.appendChild(div);
        this.createBadge("Products", this.tableLines, div);
        this.createBadge("Attributes", this.maxtableColumns, div);
        console.log(this.validatedElements);
        this.createConditionalBadge("GTIN", this.validatedElements['EAN'], this.validatedElements['EAN'].emptyCells, div);
        let separator = '<h1 style="font-size: 20px;color: #999999ff;margin-right: 10px;margin-top: 42px;">&#9474;</h1>';
        div.innerHTML += separator;
        this.createConditionalBadge("CPC", this.validatedElements['CPC'], this.validatedElements['CPC'].emptyCells, div);
        this.createConditionalBadge("mCPC", this.validatedElements['MOBILE CPC'], this.validatedElements['MOBILE CPC'].emptyCells, div);
    }
    analyzeMandatory() {
        // add Table
        let div = document.createElement("DIV");
        div.setAttribute("id", "analyzeMandatory");
        this.writelocation.appendChild(div);
        let table = document.createElement("TABLE");
        table.setAttribute("id", "TableWindow");
        div.appendChild(table);
        // add Header to Table
        let tableRow = document.createElement("TR");
        tableRow.setAttribute("id", "Header");
        this.createTableHeader("mandatory feed attributes", "5", "mandatoryfeedattributes", tableRow);
        this.createTableHeader("important feed attributes", "5", "importantfeedattributes", tableRow);
        table.appendChild(tableRow);
        let namingAttributesMandatory = ["SKU", "NAME", "PRICE", "IMAGE URL", "DEEPLINK URL"],
            namingAttributesImportant = ["TOP CATEGORY", "DESCRIPTION", "OLD PRICE", "BRAND", "AVAILABILITY"];
        // add Rows to Table
        this.createAttributeRow(namingAttributesMandatory, "mandatoryfeedattributes", namingAttributesImportant, "importantfeedattributes", table);
        this.createFoundIconRow(namingAttributesMandatory, namingAttributesImportant, table);
        this.createColumnNamesRow(namingAttributesMandatory, namingAttributesImportant, table);
        this.createColumnPercentRow(namingAttributesMandatory, namingAttributesImportant, table)
    }
    analyzeOther() {
        // add Table
        let div = document.createElement("DIV");
        div.setAttribute("id", "analyzeOther");
        this.writelocation.appendChild(div);
        let table = document.createElement("TABLE");
        table.setAttribute("id", "TableWindow");
        div.appendChild(table);
        // add Header to Table
        let tableRow = document.createElement("TR");
        tableRow.setAttribute("id", "Header");
        this.createTableHeader("other feed attributes", "10", "otherfeedattributes", tableRow);
        table.appendChild(tableRow);
        let namingAttributesMandatory = ["CATEGORY", "CATEGORY_2", "COLOR", "MATERIAL", "SIZES"],
            namingAttributesImportant = ["AUX IMAGE URL 1", "SHIPPING COSTS", "GENDER", "BASE PRICE", "ENERGY LABEL"];
        // add Rows to Table
        this.createAttributeRow(namingAttributesMandatory, "otherfeedattributes", namingAttributesImportant, "otherfeedattributes", table);
        this.createFoundIconRow(namingAttributesMandatory, namingAttributesImportant, table, true);
        this.createColumnNamesRow(namingAttributesMandatory, namingAttributesImportant, table, true);
        this.createColumnPercentRow(namingAttributesMandatory, namingAttributesImportant, table, true);
    }
    analyzeDuplicateOverview() {
        let div = document.createElement("DIV");
        div.setAttribute("id", "analyzeDuplicateOverview");
        this.writelocation.appendChild(div);
        this.createConditionalBadge("SKU duplicates", false, this.validatedElements['SKU'].percentOfDuplicates, div, true);
        this.createConditionalBadge("Image duplicates", false, this.validatedElements['IMAGE URL'].percentOfDuplicates, div, true);
        this.createConditionalBadge("DeepURL duplicates", false, this.validatedElements['DEEPLINK URL'].percentOfDuplicates, div, true);
    }
}