myApp.controller('BalanceInventoryCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $scope.goBack = function () {
        window.history.back();
    }








    $http.get(config.api + "Inventories?filter[where][visible]=false").then(function (response) {
        $scope.ItemList = response.data;
        $scope.filterList = $scope.ItemList;
    });
    //model for change remarks
    //$scope.spnStatus = {};
    //$scope.txtRemarks = {};


    $scope.pcslengthmtr = {};
    $scope.grossweight = {};
    $scope.netweight = {};
    $scope.length = {};
    $scope.width = {};
    $scope.thickness = {};
    $scope.finish = {};
    $scope.grade = {};
    $scope.location = {};
    $scope.lotweight = {};
    $scope.incomingdate = {};
    $scope.coilsheetno = {};
    $scope.subcategory = {};

    $scope.clearFilter = function () {
        $scope.pcslengthmtr = {};
        $scope.grossweight = {};
        $scope.netweight = {};
        $scope.length = {};
        $scope.width = {};
        $scope.thickness = {};
        $scope.finish = {};
        $scope.grade = {};
        $scope.location = {};
        $scope.lotweight = {};
        $scope.incomingdate = {};
        $scope.coilsheetno = {};
        $scope.subcategory = {};
        $scope.filterList = $scope.ItemList;
    }
    $scope.applyFilter = function () {
        var qry = "Inventories?filter[where][visible]=false";
        if ($scope.subcategory.selected)
            qry = qry + "&filter[where][SUBCATEGORY]=" + $scope.subcategory.selected.SUBCATEGORY;
        if ($scope.coilsheetno.selected)
            qry = qry + "&filter[where][COILSHEETNO]=" + $scope.coilsheetno.selected.COILSHEETNO;
        if ($scope.incomingdate.selected)
            qry = qry + "&filter[where][INCOMINGDATE]=" + $scope.incomingdate.selected.INCOMINGDATE;
        if ($scope.lotweight.selected)
            qry = qry + "&filter[where][LotWeight]=" + $scope.lotweight.selected.LotWeight;
        if ($scope.location.selected)
            qry = qry + "&filter[where][LOCATION]=" + $scope.location.selected.LOCATION;
        if ($scope.grade.selected)
            qry = qry + "&filter[where][GRADE]=" + $scope.grade.selected.GRADE;
        if ($scope.finish.selected)
            qry = qry + "&filter[where][FINISH]=" + $scope.finish.selected.FINISH;
        if ($scope.thickness.selected)
            qry = qry + "&filter[where][THICKNESS]=" + $scope.thickness.selected.THICKNESS;
        if ($scope.width.selected)
            qry = qry + "&filter[where][WIDTH]=" + $scope.width.selected.WIDTH;
        if ($scope.length.selected)
            qry = qry + "&filter[where][LENGTH]=" + $scope.length.selected.LENGTH;
        if ($scope.netweight.selected)
            qry = qry + "&filter[where][NETWEIGHT]=" + $scope.netweight.selected.NETWEIGHT;
        if ($scope.grossweight.selected)
            qry = qry + "&filter[where][GROSSWT]=" + $scope.grossweight.selected.GROSSWT;
        if ($scope.pcslengthmtr.selected)
            qry = qry + "&filter[where][PCS/LENGTHINMTRS]=" + $scope.pcslengthmtr.selected.PCS / LENGTHINMTRS;

        $http.get(config.api + qry).then(function (response) {
            $scope.filterList = response.data;
            //console.log($scope.ItemList);
            //$scope.ItemCount = response.data.length;
        });
    }

    //view Info
    $scope.viewInfo = function (Item) {
        if (Item != undefined) {
            $state.go('Customer.BalanceInventoryViewInfo', { voId: Item.id });
        }
    }
    $scope.currentItem = null;

    /// Change Status...
    $scope.showStatusBox = function (item) {
        $scope.currentItem = item;
        clearStatusBox();
        $('#ChangeStatusModal').modal('show');
    }
    $scope.changeStatus = function () {
        var data = {
            id: $scope.currentItem.id,
            status: $scope.spnStatus,
            dt: new Date(),
            remarks: $scope.txtRemarks
        }
        $http.post(config.login + "updateInventoryStatus", data).then(function (response) {
            showSuccessToast("Status updated.");
            $scope.closeStatusBox();
        }, function (err) {
            showErrorToast("Error while updating status.");
        });
        //TODO: remove when api will be working
        $scope.closeStatusBox();
    }
    function clearStatusBox() {
        $scope.spnStatus = null;
        $scope.txtRemarks = null;
    }
    $scope.closeStatusBox = function () {
        clearStatusBox();
        $('#ChangeStatusModal').modal('hide');
    }


    //Add Remarks...
    $scope.showRemarkBox = function (item) {
        $scope.currentItem = item;
        clearRemarksBox();
        $('#AddRemarksModal').modal('show');
    }
    function clearRemarksBox() {
        $scope.txtAddRemarks = null;
    }
    $scope.closeRemarkBox = function () {
        clearRemarksBox();
        $('#AddRemarksModal').modal('hide');
    }
    $scope.addRemark = function () {
        var data = {
            id: $scope.currentItem.id,
            remarks: $scope.txtAddRemarks,
            dt: new Date()
        }
        $http.post(config.login + "insertAddRemark", data).then(function (response) {
            showSuccessToast("Remark Added.");
            $scope.closeRemarkBox();
        }, function (err) {
            showErrorToast("Error while adding remark.");
        });
        //TODO: remove when api will be working
        $scope.closeRemarkBox();
    }

    //Update Adjustment

    function clearAdjustmentBox() {
        $scope.netwt = null;
        $scope.adjustmentWt = null;
        $scope.totalNetWt = null;
    }

    $scope.showAddjustmentBox = function (item) {
        $scope.currentItem = item;
        clearAdjustmentBox();
        $('#AddjustmentbtnModal').modal('show');
    }
    $scope.closeAddjustmentBox = function () {
        clearAdjustmentBox();
        $('#AddjustmentbtnModal').modal('hide');
    }
    $scope.updateWt = function () {
        var data = {
            id: $scope.currentItem.id,
            netwt: $scope.netwt,
            adjustmentWt: $scope.adjustmentWt,
            totalNetWt: $scope.totalNetWt
        }
        $http.post(config.login + "updateWt", data).then(function (response) {
            showSuccessToast("Weigths updated.");
            $scope.closeAddjustmentBox();
        }, function (err) {
            showErrorToast("Error while updating weigths.");
        });
        //TODO: remove when api will be working
        $scope.closeAddjustmentBox();
    }




}]);