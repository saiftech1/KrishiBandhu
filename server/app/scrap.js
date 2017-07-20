exports.getScrapedCropWiseData = function(data, commodityList) {
    var marketName = '';
    var commodityName = '';
    data[0].forEach(function(x) {
        if (x.Market == '') {
            x.Market = marketName;
        } else {
            marketName = x.Market;
        }
        if (x.Commodity == '') {
            x.Commodity = commodityName;
        } else {
            commodityName = x.Commodity;
        }
    });
    var selectedCommodity = [];
    data[0].forEach(function(y) {

        if (commodityList.indexOf(y.Commodity) != -1) {
            selectedCommodity.push(y);
        }
    });

    var requestedCommodityList = [];

    var marketNameList = [];
    commodityList.forEach(function(commodityName) {
        var tempCommodity = [];
        selectedCommodity.forEach(function(commodity) {
            if (commodityName == commodity.Commodity) {
                tempCommodity.push(commodity);
                marketNameList.push(commodity.Market);
            }
        });

        var marketNames = marketNameList.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        })


        var marketWiseCommodity = [];

        marketNames.forEach(function(marketName) {
            var marketCommodity = [];
            tempCommodity.forEach(function(commodity) {
                if (marketName == commodity.Market) {
                    marketCommodity.push(commodity);
                }
            });
            if (marketCommodity.length > 0) {
                marketWiseCommodity.push({ "marketName": marketName, "marketData": marketCommodity });
            }

        });

        requestedCommodityList.push({ "commodityName": commodityName, "commodityData": marketWiseCommodity });
    });

    return requestedCommodityList;
}