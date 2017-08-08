angular.module('krishiBandhu.controllers', [])

.constant("agriURL", 'https://krishibandhu.herokuapp.com/')

.controller('AppCtrl', function($timeout, $scope, $http, agriURL, commodityFactory, stateFactory, districtFactory, userDataFactory, usSpinnerService) {

    $scope.pageLoaded = false;
    $scope.input = {};

    $scope.commodityList = commodityFactory.getCommodityList();

    $scope.stateList = stateFactory.getStateList();
    $scope.selectedStateIndex = 15;
    $scope.districtList = districtFactory.getDistrictListFromStateIndex($scope.selectedStateIndex);
    $scope.selectedDistrict = $scope.districtList[1];
    $scope.selectedCommodities = ["Alasande Gram"];
    $scope.selected = ["Alasande Gram"];



    $scope.onStateSelectionChanged = function(stateIndex) {
        //var index = $scope.stateList.indexOf(state);
        console.log('State changed', stateIndex);
        $scope.selectedStateIndex = stateIndex;
        $scope.districtList = districtFactory.getDistrictListFromStateIndex(stateIndex);
        $scope.selectedDistrict = $scope.districtList[0];
    }

    $scope.onDistrictSelectionChanged = function(distrct) {
        console.log('District changed', distrct);
        $scope.selectedDistrict = distrct;
    }

    $scope.onCommoditySelected = function(commoditySelected) {
        $scope.selectedCommodities = commoditySelected;
    }


    //initialize the tasks scope with empty array
    $scope.agriData = [];

    var internalStorageData = userDataFactory.getUserData();

    console.log(internalStorageData);

    if (internalStorageData != 0) {
        $scope.userData = internalStorageData;
        $scope.selectedStateIndex = stateFactory.getStateIndex($scope.userData.state);
        $scope.selectedDistrict = $scope.userData.district;
        $scope.selectedCommodities = $scope.userData.commodityList;
        $scope.selected = $scope.userData.commodityList;
    } else {
        $scope.userData = { 'state': $scope.stateList[$scope.selectedStateIndex], 'district': $scope.selectedDistrict, 'commodityList': $scope.selectedCommodities };
    }

    $scope.onSubmissionOfSelection = function() {

        $scope.userData = { 'state': $scope.stateList[$scope.selectedStateIndex], 'district': $scope.selectedDistrict, 'commodityList': $scope.selectedCommodities };
        console.log($scope.userData);

        userDataFactory.saveUserData($scope.userData);

        $scope.getData();
    }

    $scope.getData = function() {
        usSpinnerService.spin('spinner-1');
        console.log('------------------------------------');
        console.log(agriURL + 'getCropWisePricesDataForWeb/' + $scope.userData.state.id + '/' + $scope.userData.district.id + '?array=' + $scope.userData.commodityList);
        console.log('------------------------------------');
        $http({
            method: "GET",
            url: agriURL + 'getCropWisePricesDataForWeb/' + $scope.userData.state.id + '/' + $scope.userData.district.id + '?array=' + $scope.userData.commodityList
        }).then(function(success) {
            $scope.agriData = success.data;
            console.log($scope.agriData);
            usSpinnerService.stop('spinner-1');
            $scope.pageLoaded = true;
        }, function(error) {
            console.log(error);
            usSpinnerService.stop('spinner-1');
            $scope.pageLoaded = false;
        });
    }
    $scope.init = function() {
        console.log("initialize");
        usSpinnerService.spin('spinner-2');
        $scope.getData();

    }


    //$scope.getData();


});