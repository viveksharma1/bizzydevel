myApp.controller('StockBalanceInventoryCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        window.history.back();
    }

    $scope.clear = function ($event, $select) {
        $event.stopPropagation();
        //to allow empty field, in order to force a selection remove the following line
        $select.selected = undefined;
        //reset search query
        $select.search = undefined;
        //focus and open dropdown
        $select.activate();
    }
    $http.get(config.api + "Inventories?filter[where][visible]=true").then(function (response) {
        $scope.ItemList = response.data;
        $scope.filterList = $scope.ItemList;
        //console.log($scope.ItemList);
        //$scope.ItemCount = response.data.length;
    });

    $scope.remarks = {};
    $scope.godown = {};
    $scope.description = {};
    $scope.invoiceno = {};

    $scope.clearFilter=function(){
        $scope.remarks = {};
        $scope.godown = {};
        $scope.description = {};
        $scope.invoiceno = {};
        $scope.filterList = $scope.ItemList;
    }
    $scope.applyFilter = function () {
        var qry = "Inventories?filter[where][visible]=true";
        if ($scope.invoiceno.selected)
            qry = qry + "&filter[where][no]=" + $scope.invoiceno.selected.no;
        if ($scope.godown.selected)
            qry = qry + "&filter[where][GODOWN]=" + $scope.godown.selected.GODOWN;
        if ($scope.description.selected)
            qry = qry + "&filter[where][DESCRIPTION]=" + $scope.description.selected.DESCRIPTION;
        if ($scope.remarks.selected)
            qry = qry + "&filter[where][RRMARKS]=" + $scope.remarks.selected.RRMARKS;

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
            ajustmentWt: $scope.adjustmentWt,
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