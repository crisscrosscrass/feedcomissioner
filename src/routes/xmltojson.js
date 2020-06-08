const fs = require('fs');
const path = require('path');
const convertXmlToJson = require('../modules/convertXmlToJson');
const getXMLHeadersFromFile = require('../modules/getHeaderFromXML');
const convertBigXmlToJson = require('../modules/convertBigXmlToJson');
const convertBigXMLToCSV = require('../modules/convertBigXMLToCSV');
const detectXMLNodes = require('../modules/detectXMLNodes');

// fileName = "ladenzeile_2020-05-28_09-03-35.xml"
// fileName = "ladenzeile.xml"
fileName = "RS_COMPONENTS_ES_IT-RS_Components_ES_Product_Feed-shopping.xml"
dest = "" + path.dirname(__dirname) + '\\feeds\\';
try {
    convertXmlToJson(dest, fileName, function(fileName) {
        console.log('done XML > JSON, new file: ', fileName);
    });
} catch (error) {
    if (error.code == "ERR_STRING_TOO_LONG") {
        console.log("Feed too big");
        // convertBigXmlToJson(dest, fileName, function(fileName) {
        //     console.log('done XML > JSON, new file: ', fileName);
        // });

        // XML TO JSON
        // var writer = fs.createWriteStream(dest + "copy.json");
        // writer.write('{"SHOP": \n {"SHOPITEM": [\n');
        // var XmlStream = require('xml-stream');
        // var stream = fs.createReadStream(dest + fileName);
        // stream.setEncoding('utf8');
        // var xml = new XmlStream(stream);
        // xml.preserve('id', true);
        // xml.collect('subitem');
        // xml.on('endElement: entry', function(item) {
        //     //console.log(item);
        //     writer.write(JSON.stringify(item) + ',\n');
        // });
        // xml.on('end', () => writer.write(']\n}\n}'));

        // XML TO CSV
        // var header = ['program_name', 'program_url', 'catalog_name', 'last_updated', 'id', 'title', 'description', 'link', 'impression_url', 'image_link', 'mobile_link', 'availability', 'price', 'product_type', 'brand', 'gtin', 'mpn', 'identifier_exists', 'condition', 'adult', 'multipack', 'is_bundle', 'age_group', 'gender', 'shipping_weight', 'shipping_length', 'shipping_width', 'shipping_height', 'shipping', 'material', 'custom_label_4'];
        async function bigXMLToCSV() {
            elementNode = await detectXMLNodes(dest, fileName);
            if (elementNode != "unknown") {
                console.log(elementNode)
                var elementNode = 'entry';
                var header = await getXMLHeadersFromFile(dest + fileName);
                var file = await convertBigXMLToCSV(dest, fileName, header, elementNode);
                console.log(file);
            } else {
                console.log("can't detect item node!");
            }
        }
        bigXMLToCSV();

    } else {
        console.log(error.code);
    }
}