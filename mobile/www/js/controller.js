angular.module('krishiBandhu.controllers', [])

.constant("agriURL", 'http://localhost:3000/')

.controller('AppCtrl', function($scope, $ionicModal, $http, $ionicPopup, agriURL, $ionicLoading, localStorageService, commodityFactory, stateFactory, districtFactory, userDataFactory) {

    $scope.input = {};

    $scope.commodityList = commodityFactory.getCommodityList();

    $scope.stateList = stateFactory.getStateList();
    $scope.selectedStateIndex = 15;
    $scope.districtList = districtFactory.getDistrictListFromStateIndex($scope.selectedStateIndex);
    $scope.selectedDistrict = $scope.districtList[0];



    $scope.default = $scope.commodityList;
    $scope.onValueChanged = function(value) {
        console.log(value);
    }

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


    //initialize the tasks scope with empty array
    $scope.agriData = [];

    $scope.userData = userDataFactory.getUserData();


    $scope.selectedCommodities = [];

    //configure the ionic modal before use
    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModifySelectionModal = function() {
        $scope.setSelectedCommodites();
        $scope.modal.show();
    }
    $scope.closeModifySelectionModal = function() {
        $scope.modal.hide();
    }

    $ionicModal.fromTemplateUrl('commodityList.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.commodityModel = modal;
    });

    $scope.openCommodityModel = function() {

        $scope.commodityModel.show();
    }
    $scope.closeCommodityModel = function() {
        $scope.commodityModel.hide();
    }

    $scope.setSelectedCommodites = function() {
        $scope.selectedCommodities = [];
        $scope.commodityList.forEach(function(commodity) {
            if (commodity.isSelected == true) {
                $scope.selectedCommodities.push(commodity);
            }
        });
        $scope.closeCommodityModel();
    }

    $scope.onSubmissionOfSelection = function() {
        var commodityNameList = [];

        $scope.selectedCommodities.forEach(function(commodity) {
            commodityNameList.push(commodity.value);
        });

        $scope.userData = { 'state': $scope.stateList[$scope.selectedStateIndex].id, 'district': $scope.selectedDistrict.id, 'commodityList': commodityNameList };
        console.log($scope.userData);

        userDataFactory.saveUserData($scope.userData);

        $scope.closeModifySelectionModal();
        $scope.getData();
    }




    $scope.getData = function() {
        $scope.showLoading();
        console.log('------------------------------------');
        console.log('URL:', agriURL + 'getCropWisePrices/' + $scope.userData.state + '/' + $scope.userData.district + '?array=' + $scope.userData.commodityList);
        console.log('------------------------------------');
        $http({
                method: "GET",
                url: agriURL + 'getCropWisePrices/' + $scope.userData.state + '/' + $scope.userData.district + '?array=' + $scope.userData.commodityList
            })
            .success(function(data) {
                $scope.agriData = data;
                console.log($scope.agriData);
                $scope.hideLoading();
            })
            .error(function(error, status) {
                $scope.hideLoading();
                var alertPopup = $ionicPopup.alert({
                    title: '<span><b>Error</b></span>',
                    template: 'Sorry,Error occured while requesting the data!'
                });

            });

    }

    $scope.updateData = function() {


    }

    $scope.showLoading = function() {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };
    $scope.hideLoading = function() {
        $ionicLoading.hide();
    };


});