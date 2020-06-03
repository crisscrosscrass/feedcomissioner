function setMaxSampleItems(number) {
    maxSamples = number;
    return maxSamples;
}

function createAndAdjustSampleItems(maxSamples) {
    var InputSampleField = document.getElementById('InputSampleAmount');
    maxSamples = setMaxSampleItems(InputSampleField.value);
    // createSampleItems(maxSamples)
    //new SampleItems(maxSamples);
    new PreviewItems(maxSamples, globalValidatedElements);
}
var maxSamples = 10;
class PreviewItems {
    constructor(maxSamples, validatedElements) {
        this.writelocation = document.getElementById("check");
        this.maxSamples = maxSamples;
        this.tableLines = validatedElements.FEEDTABLE.sampleItems.length;
        this.validatedElements = validatedElements;
        if (this.maxSamples <= 0) {
            this.maxSamples = 1;
        }
        if (this.maxSamples >= 50) {
            this.maxSamples = 50;
        }
        this.UL = document.createElement("UL");
        this.loadedPromises = [];
        this.imageSKUs = [];
        this.imageURLs = [];

        if (validatedElements != null || validatedElements != undefined) {
            this.Init();
        }
    }
    Init() {
        this.createSamples();
        Promise.all(this.loadedPromises).then((values) => {
                //console.log('%c Images loading done :', 'background-color: black; color: green; font-weight: bold;');
                this.imageSKUs.length > 0 ? this.createDialog(this.imageSKUs, this.imageURLs) : "";
            })
            .catch(err => {
                console.log('catch', err);
            });
    }
    dataOnLoad(sku, url) {
        var image = new Image();
        image.src = url;
        return new Promise(function(resolve, reject) {
            image.onload = () => {
                let imageMegaPixel = image.width * image.height / 1000000;
                let imageLoaded = {
                    imageMegaPixel: imageMegaPixel,
                    url: image.src,
                    sku: sku
                }
                return resolve(imageLoaded);
            }
            image.onerror = reject;
        }).then((imageLoaded) => {
            if (imageLoaded.imageMegaPixel > 12) {
                // console.log('%c Found Image bigger than 12 MegaPixel', 'background-color: black; color: red; font-weight: bold;');
                this.imageSKUs.push(imageLoaded.sku);
                this.imageURLs.push(imageLoaded.url);
            }
        });
    }
    createHeadline(writelocation, maxSamples) {
        writelocation.innerHTML += "";
        if (document.getElementById("PreviewProductSpace") != undefined) {
            document.getElementById("PreviewProductSpace").remove();
        }
        var DIV = document.createElement("DIV");
        DIV.setAttribute("id", "PreviewProductSpace");
        writelocation.append(DIV);
        writelocation = document.getElementById("PreviewProductSpace");
        writelocation.innerHTML = "";
        writelocation.innerHTML += '<h2 id="underlineHeader"><strong style="font-size: 18px;font-family: Raleway;">preview products from feed</strong>' +
            '&nbsp;<input id="InputSampleAmount" type="number" min="1" max="50">' +
            '&nbsp;<img src="/images/refreshButton.png" onclick="createAndAdjustSampleItems(' + maxSamples + ')" class="refreshButton">' +
            '</h2><br>';
        var InputSampleField = document.getElementById('InputSampleAmount');
        InputSampleField.value = maxSamples;

        this.UL.setAttribute("id", "Samples");
        this.UL.setAttribute("class", "products");
        writelocation.appendChild(this.UL);
    }
    getRandomNumbers(maxSamples) {
        let randomNumbers = [];
        let initialAttempts = 0;
        if (maxSamples > this.tableLines) {
            //create incremental fill array by tableRows - header
            let maxNumber = this.tableLines;
            randomNumbers = new Array(maxNumber).join().split(',').map(function(item, index) { return ++index });
        } else {
            while (randomNumbers.length < maxSamples) {
                var randomNumber = Math.floor((Math.random() * this.tableLines) + 1);
                if (randomNumber == 0) {
                    randomNumber = 1;
                }
                if (!randomNumbers.includes(randomNumber)) {
                    randomNumbers.push(randomNumber);
                } else {
                    //console.log("same Random Number!")
                    ++initialAttempts;
                    if (initialAttempts > 3) {
                        //console.log("Need to break!")
                        break;
                    }
                }
            }
        }
        return randomNumbers;
    }
    getItemDetails(name, randomNumber) {
        let FeedLocation = this.validatedElements.FEEDTABLE.sampleItems;
        let ItemDetails = ""
        let index = this.validatedElements[name].columnIndex;
        if (index != undefined) {
            if (FeedLocation[randomNumber] != undefined && ItemDetails != null) {
                if (FeedLocation[randomNumber][index] != null || FeedLocation[randomNumber][index] != undefined) {
                    ItemDetails = FeedLocation[randomNumber][index];
                    if (name == "NAME" && name.length > 100) {
                        ItemDetails = ItemDetails.substr(0, 100) + "\u2026";
                        return ItemDetails;
                    }
                    if (name == "IMAGE URL") {
                        //replace Ampersand to fix some Image Display Issues
                        ItemDetails = ItemDetails.replace(/\&amp\;/gi, "&");
                        return ItemDetails;
                    }
                    return ItemDetails;
                } else {
                    return ItemDetails;
                }
            } else {
                return ItemDetails;
            }
        }

    }
    async waitForImage(imageObject, imageURL) {
        let imagePromise;
        try {
            imagePromise = await fetch(imageURL, {
                    mode: 'no-cors'
                })
                .then(() => {
                    return imageObject.src = imageURL;
                })
                .catch(() => { imageObject.src = ""; });
        } catch (error) {
            console.log(error);
        }
        return imagePromise;
    }
    createWaitingImage(LI, randomSKU, randomImage, auxImage = false) {
        var aImage = document.createElement("IMG");
        if (randomImage != "" && randomImage != undefined && randomImage != null) {
            aImage.setAttribute("src", "/images/loading.gif");
            this.waitForImage(aImage, randomImage);
            this.loadedPromises.push(this.dataOnLoad(randomSKU, randomImage));
        } else {
            aImage.setAttribute("src", "");
        }
        aImage.setAttribute("width", "100px");
        aImage.setAttribute("height", "100px");
        if (auxImage) {
            aImage.style.display = "none";
            if (randomImage != "" && randomImage != undefined && randomImage != null) {
                LI.childNodes[0].addEventListener("mouseenter", function(event) {
                    aImage.style.display = "inherit";
                }, false);
                LI.childNodes[0].addEventListener("mouseleave", function(event) {
                    aImage.style.display = "none";;
                }, false);
            }
        }
        return aImage;
    }
    appendParagraph(LI, content, itemDetails) {
        if (itemDetails != undefined) {
            var aParagraph = document.createElement("P");
            aParagraph.innerHTML += content;
            LI.appendChild(aParagraph);
        }
    }
    load(number) {
        var randomImage = this.getItemDetails("IMAGE URL", number);
        var randomName = this.getItemDetails("NAME", number);
        var img = new Image;
        img.onload = function() {
            new ModalWindow(randomImage, randomName, img.width, img.height);
        };
        img.src = randomImage;
    }
    createItemSample(randomNumber) {
        // var allNames = ["SKU", "Name", "Price", "Description", "Image", "DeepURL", "Top_Category", "Category", "Category_2", "Old_Price", "Base_Price", "Gender", "Brand", "Sizes", "Color", "CPC", "Material", "ShippingCost", "DeliveryTime", "AuxImage", "EnergyLabel", "mCPC", "GTIN"];
        var randomImage = this.getItemDetails("IMAGE URL", randomNumber);
        var randomDeepURL = this.getItemDetails("DEEPLINK URL", randomNumber);
        var randomName = this.getItemDetails("NAME", randomNumber);
        var randomPrice = this.getItemDetails("PRICE", randomNumber);
        var randomOld_price = this.getItemDetails("OLD PRICE", randomNumber);
        var randomShippingCost = this.getItemDetails("SHIPPING COSTS", randomNumber);
        var randomDeliveryTime = this.getItemDetails("AVAILABILITY", randomNumber);
        var randomColor = this.getItemDetails("COLOR", randomNumber);
        var randomSKU = this.getItemDetails("SKU", randomNumber);
        var randomAuxImage = this.getItemDetails("AUX IMAGE URL 1", randomNumber);
        var randomDescription = this.getItemDetails("DESCRIPTION", randomNumber);
        // console.log(randomNumber);
        // console.log(randomImage, randomDeepURL, randomName, randomPrice, randomOld_price);


        var LI = document.createElement("LI");
        if (randomDescription != "" && randomDescription != undefined && randomDescription != null) {
            LI.setAttribute("title", "Description: " + randomDescription);
        }
        var aLink = document.createElement("A");
        aLink.setAttribute("href", randomDeepURL);
        aLink.setAttribute("target", "_blank");
        aLink.setAttribute('class', 'removeAmp');
        var aImage = this.createWaitingImage(LI, randomSKU, randomImage);
        aImage.onclick = () => this.load(randomNumber);
        LI.appendChild(aImage);
        var auxImage = this.createWaitingImage(LI, randomSKU, randomAuxImage, true);
        LI.appendChild(auxImage);
        var aTitle = document.createElement("H4");
        aTitle.innerHTML += randomName;
        LI.appendChild(aLink);
        aLink.appendChild(aTitle);
        var p = document.createElement("p");
        p.innerHTML += " Price: " + randomPrice;
        if (randomOld_price != undefined) {
            if (randomOld_price.length > 0) {
                p.setAttribute("class", "red");
            }
            if (Math.floor(randomOld_price) <= Math.floor(randomPrice)) {
                p.setAttribute("class", "nothing");
            }
        }
        LI.appendChild(p);
        this.appendParagraph(LI, " Old_Price: ", randomOld_price);
        this.appendParagraph(LI, "ShippingCost: ", randomShippingCost);
        this.appendParagraph(LI, "Delivery Time: ", randomDeliveryTime);
        this.appendParagraph(LI, "Color: ", randomColor);
        this.appendParagraph(LI, "SKU: ", randomSKU);
        return this.UL.appendChild(LI);
    }
    createSamples() {
        this.createHeadline(this.writelocation, this.maxSamples);
        let randomNumbers = this.getRandomNumbers(this.maxSamples);
        for (let q = 0; q < maxSamples; q++) {
            var randomNumber = randomNumbers[q];
            this.createItemSample(randomNumber);
        }
    }
    createDialog(failedImagesSKU, failedImagesURL) {
        var aParagraph = document.createElement("P");
        aParagraph.setAttribute("id", "FailedImages");
        aParagraph.innerHTML = "";
        for (let i = 0; i < failedImagesSKU.length; i++) {
            aParagraph.innerHTML += `SKU: ${failedImagesSKU[i]} | ImageURL: ${failedImagesURL[i]} <br>`;
        }
        this.writelocation.appendChild(aParagraph);
        $("#FailedImages").dialog({
            title: "Images bigger than 12MegaPixel:",
            autoOpen: true,
            height: "auto",
            width: 800,
            show: {
                effect: "pulsate",
                duration: 1000
            },
            position: { my: 'left top', at: 'left+0 top+50' },
            hide: {
                effect: "fold",
                duration: 1000
            }
        }).css("background", "rgba(255,214,214,1)");
    }

}
class ModalWindow {
    constructor(img, content, width, height) {
        this.img = img;
        this.content = content;
        this.width = width;
        this.height = height;
        this.modal = document.getElementById('myModal');
        this.modalImg = document.getElementById("img01");
        this.modalImg.ondblclick = () => this.zoomInOrOut();
        this.dimensionsText = document.getElementById("dimensions");
        this.captionText = document.getElementById("caption");
        this.zommInButton = document.getElementById("zoomInButton").onclick = () => this.zoomIn();
        this.zommOutButton = document.getElementById("zoomOutButton").onclick = () => this.zoomOut();
        this.fullscreenImageModalButton = document.getElementById("fullscreenImageModal").onclick = () => this.fullScreenModal();
        this.closeModalButton = document.getElementById("closeModal").onclick = () => this.closeModalWindow();
        this.closeModalBackgroundButton = document.getElementById("modalFullScreenClose").onclick = () => this.closeModalWindow();
        this.showModal();
    }
    showModal() {
        this.modalImg.src = this.img;
        this.modalImg.setAttribute("title", "Dimensions: " + this.width + " x " + this.height);
        this.dimensionsText.innerHTML = "Dimensions: " + this.width + " x " + this.height;
        this.captionText.innerHTML = this.content;
        this.modalImg.width = this.width;
        this.modalImg.height = this.height;
        this.modalImg.style.width = '50%';
        this.modalImg.style.height = 'auto';
        this.modal.style.display = "block";
        this.disableScrolling();
    }
    closeModalWindow() {
        this.modalImg.style.removeProperty('left');
        this.modalImg.style.removeProperty('top');
        this.modal.style.display = "none";
        this.enableScrolling();
    }
    fullScreenModal() {
        this.modalImg.style.width = '100%';
    }
    zoomIn() {
        this.modalImg.style.width = parseInt(this.modalImg.style.width.replace("%", "")) + 5 + "%";
    }
    zoomOut() {
        this.modalImg.style.width = parseInt(this.modalImg.style.width.replace("%", "")) - 5 + "%";
    }
    zoomInOrOut() {
        let zoomFaktor = parseInt(this.modalImg.style.width.replace("%", ""));
        zoomFaktor == 100 ? this.modalImg.style.width = '50%' : this.modalImg.style.width = '100%';
    }
    disableScrolling() {
        document.getElementsByTagName('body')[0].classList.add('noscroll');
    }
    enableScrolling() {
        document.getElementsByTagName('body')[0].classList.remove('noscroll');
    }
}