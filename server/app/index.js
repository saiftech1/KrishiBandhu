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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/getCropWisePricesDataForMobile/:stateId/:districtId', (req, res) => {
    var crops = req.query.array.split(',');
    rp({ url: url + req.params.stateId + '&&district1=' + req.params.districtId }).then(function(html) {
            console.log("Data received");
            var $ = cheerio.load(html);
            const jsonTables = new HtmlTableToJson($('#TABLE1 tbody tr td div').html());
            var data = jsonTables.results;
            res.json(scraper.getScrapedCropWisePriceDataForMobile(data, crops));
        })
        .catch(function(error) {
            console.log("Error occured:", error);
            res.send(error);
        })

});

app.get('/getCropWisePricesDataForWeb/:stateId/:districtId', (req, res) => {
    var crops = req.query.array.split(',');
    rp({ url: url + req.params.stateId + '&&district1=' + req.params.districtId }).then(function(html) {
            console.log("Data received");
            var $ = cheerio.load(html);
            const jsonTables = new HtmlTableToJson($('#TABLE1 tbody tr td div').html());
            var data = jsonTables.results;
            res.json(scraper.getScrapedCropWisePriceDataForWeb(data, crops));
        })
        .catch(function(error) {
            console.log("Error occured:", error);
            res.send(error);
        })

});


app.listen(8000);