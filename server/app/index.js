const express = require('express');
const rp = require('request-promise');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
const HtmlTableToJson = require('html-table-to-json');
var scraper = require("./scrap");
const app = express();

var url = 'http://agmarknet.nic.in/agnew/NationalBEnglish/MarketwiseSpecificCommodity4.aspx?%20&state1=';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/getCropWisePrices/:stateId/:districtId', (req, res) => {
    var crops = req.query.array.split(',');
    rp({ url: url + req.params.stateId + '&&district1=' + req.params.districtId }).then(function(html) {
            console.log("Data received");
            var $ = cheerio.load(html);
            const jsonTables = new HtmlTableToJson($('#TABLE1 tbody tr td div').html());
            var data = jsonTables.results;
            res.json(scraper.getScrapedCropWisePrices(data, crops));
        })
        .catch(function(error) {
            console.log("Error occured:", error);
            res.send(error);
        })

});


app.listen(3000);