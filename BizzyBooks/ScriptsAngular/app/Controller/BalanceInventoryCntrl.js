myApp.controller('BalanceInventoryCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $scope.goBack = function () {
        window.history.back();
    }

    $http.get(config.api + "Inventories?filter[where][visible]=false&filter[limit]=20").then(function (response) {
        $scope.ItemList2 = response.data;
        $scope.filterList = $scope.ItemList2;
    });
    var qryAgg = 'visible=false&group={"SUBCATEGORY": "$SUBCATEGORY","COILSHEETNO":"$COILSHEETNO","INCOMINGDATE": "$INCOMINGDATE","LotWeight":"$LotWeight","LOCATION":"$LOCATION","GRADE":"$GRADE","FINISH":"$FINISH","THICKNESS":"$THICKNESS","WIDTH":"$WIDTH","LENGTH":"$LENGTH","NETWEIGHT":"$NETWEIGHT","GROSSWT":"$GROSSWT","PCS/LENGTHINMTRS":"PCS/LENGTHINMTRS"}';
    $http.get(config.login + "getAggregateInventories?" + qryAgg).then(function (response) {
        $scope.ItemList = response.data;
     });
    
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
        $scope.filterList = $scope.ItemList2;
    }
    $scope.applyFilter = function () {
        var qry = "Inventories?filter[where][visible]=false";
        if ($scope.subcategory.selected)
            qry = qry + "&filter[where][SUBCATEGORY]=" + $scope.subcategory.selected._id.SUBCATEGORY;
        if ($scope.coilsheetno.selected)
            qry = qry + "&filter[where][COILSHEETNO]=" + $scope.coilsheetno.selected._id.COILSHEETNO;
        if ($scope.incomingdate.selected)
            qry = qry + "&filter[where][INCOMINGDATE]=" + $scope.incomingdate.selected._id.INCOMINGDATE;
        if ($scope.lotweight.selected)
            qry = qry + "&filter[where][LotWeight]=" + $scope.lotweight.selected._id.LotWeight;
        if ($scope.location.selected)
            qry = qry + "&filter[where][LOCATION]=" + $scope.location.selected._id.LOCATION;
        if ($scope.grade.selected)
            qry = qry + "&filter[where][GRADE]=" + $scope.grade.selected._id.GRADE;
        if ($scope.finish.selected)
            qry = qry + "&filter[where][FINISH]=" + $scope.finish.selected._id.FINISH;
        if ($scope.thickness.selected)
            qry = qry + "&filter[where][THICKNESS]=" + $scope.thickness.selected._id.THICKNESS;
        if ($scope.width.selected)
            qry = qry + "&filter[where][WIDTH]=" + $scope.width.selected._id.WIDTH;
        if ($scope.length.selected)
            qry = qry + "&filter[where][LENGTH]=" + $scope.length.selected._id.LENGTH;
        if ($scope.netweight.selected)
            qry = qry + "&filter[where][NETWEIGHT]=" + $scope.netweight.selected._id.NETWEIGHT;
        if ($scope.grossweight.selected)
            qry = qry + "&filter[where][GROSSWT]=" + $scope.grossweight.selected._id.GROSSWT;
        if ($scope.pcslengthmtr.selected)
            qry = qry + "&filter[where][PCS/LENGTHINMTRS]=" + $scope.pcslengthmtr.selected._id.PCS / LENGTHINMTRS;

        $http.get(config.api + qry).then(function (response) {
            $scope.filterList = response.data;
            //console.log($scope.ItemList);
            //$scope.ItemCount = response.data.length;
        });
    }
    $scope.itemChecked = [];
    $scope.selectAllLineItem = function (allItemData) {
        if ($scope.selectAll) {
            $scope.itemChecked = allItemData;
        } else {
            $scope.itemChecked = [];
        }
        angular.forEach(allItemData, function (item) {
            item.selected = $scope.selectAll;
        });
    }
    $scope.selectLineItem = function (itemData) {
        var item = {};
        //angular.copy(itemData, item);
        if (itemData.selected) {
            $scope.itemChecked.push(itemData);
            console.log($scope.itemChecked);
        } else {
            $scope.selectAll = false;
            for (var i = 0; i < $scope.itemChecked.length; i++) {
                if ($scope.itemChecked[i].id == itemData.id)
                    $scope.itemChecked.splice(i, 1)

            }
        }
        if ($scope.itemChecked.length == $scope.filterList.length)
            $scope.selectAll = true;
    }

    //view Info
    $scope.viewInfo = function (Item) {
        if (Item != undefined) {
            $state.go('Customer.BalanceInventoryViewInfo', { voId: Item.id });
        }
    }

    $scope.currentItem = {};

    /// Change Status...
    $scope.showStatusBox = function (item, multi) {
        clearStatusBox();
        $('#ChangeStatusModal').modal('show');
        if (multi) {
            $scope.currentItem.items = item;
            $scope.currentItem.multi = true;
        } else {
            $scope.currentItem.items = item;
            $scope.currentItem.multi = false;
        }

    }
    $scope.changeStatus = function () {
        var query = [];
        if ($scope.currentItem.multi) {
            for (var i = 0; i < $scope.currentItem.items.length; i++) { query.push($scope.currentItem.items[i].id) }
        } else {
            query.push($scope.currentItem.items.id);
        }
        var data = {
            ids: query,
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
        //$scope.closeStatusBox();

    }
    function clearStatusBox() {
        $scope.spnStatus = null;
        $scope.txtRemarks = null;
    }
    function clearCheckBoxs() {
        $scope.selectAll = false;
        angular.forEach($scope.filterList, function (item) {
            item.selected = $scope.selectAll;
        });
    }
    $scope.closeStatusBox = function () {
        $('#ChangeStatusModal').modal('hide');
        clearStatusBox();
        clearCheckBoxs();
    }


    //Add Remarks...
    $scope.showRemarkBox = function (item,multi) {
        clearRemarksBox();
        $('#AddRemarksModal').modal('show');
        if (multi) {
            $scope.currentItem.items = item;
            $scope.currentItem.multi = true;
        } else {
            $scope.currentItem.items = item;
            $scope.currentItem.multi = false;
        }

    }
    function clearRemarksBox() {
        $scope.txtAddRemarks = null;
    }
    $scope.closeRemarkBox = function () {
        clearRemarksBox();
        $('#AddRemarksModal').modal('hide');
        clearCheckBoxs();
    }
    $scope.addRemark = function () {
        var query = [];
        if ($scope.currentItem.multi) {
            for (var i = 0; i < $scope.currentItem.items.length; i++) { query.push($scope.currentItem.items[i].id) }
        } else {
            query.push($scope.currentItem.items.id);
        }
        var data = {
            ids: query,
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
        //$scope.closeRemarkBox();
    }

    //Update Adjustment

    function clearAdjustmentBox() {
        $scope.netwt = null;
        $scope.adjustmentWt = null;
        $scope.totalNetWt = null;
    }

    $scope.showAddjustmentBox = function (item,multi) {
        clearAdjustmentBox();
        $('#AddjustmentbtnModal').modal('show');
        if (multi) {
            $scope.currentItem.items = item;
            $scope.currentItem.multi = true;
        } else {
            $scope.currentItem.items = item;
            $scope.currentItem.multi = false;
        }
    }
    $scope.closeAddjustmentBox = function () {
        clearAdjustmentBox();
        $('#AddjustmentbtnModal').modal('hide');
        clearCheckBoxs();
    }
    $scope.updateWt = function () {
        var query = [];
        if ($scope.currentItem.multi) {
            for (var i = 0; i < $scope.currentItem.items.length; i++) { query.push($scope.currentItem.items[i].id) }
        } else {
            query.push($scope.currentItem.items.id);
        }
        var data = {
            ids: query,
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
        //$scope.closeAddjustmentBox();
    }


    //$scope.currentItem = null;

    ///// Change Status...
    //$scope.showStatusBox = function (item) {
    //    $scope.currentItem = item;
    //    clearStatusBox();
    //    $('#ChangeStatusModal').modal('show');
    //}
    //$scope.changeStatus = function () {
    //    var data = {
    //        id: $scope.currentItem.id,
    //        status: $scope.spnStatus,
    //        dt: new Date(),
    //        remarks: $scope.txtRemarks
    //    }
    //    $http.post(config.login + "updateInventoryStatus", data).then(function (response) {
    //        showSuccessToast("Status updated.");
    //        $scope.closeStatusBox();
    //    }, function (err) {
    //        showErrorToast("Error while updating status.");
    //    });
    //    //TODO: remove when api will be working
    //    $scope.closeStatusBox();
    //}
    //function clearStatusBox() {
    //    $scope.spnStatus = null;
    //    $scope.txtRemarks = null;
    //}
    //$scope.closeStatusBox = function () {
    //    clearStatusBox();
    //    $('#ChangeStatusModal').modal('hide');
    //}


    ////Add Remarks...
    //$scope.showRemarkBox = function (item) {
    //    $scope.currentItem = item;
    //    clearRemarksBox();
    //    $('#AddRemarksModal').modal('show');
    //}
    //function clearRemarksBox() {
    //    $scope.txtAddRemarks = null;
    //}
    //$scope.closeRemarkBox = function () {
    //    clearRemarksBox();
    //    $('#AddRemarksModal').modal('hide');
    //}
    //$scope.addRemark = function () {
    //    var data = {
    //        id: $scope.currentItem.id,
    //        remarks: $scope.txtAddRemarks,
    //        dt: new Date()
    //    }
    //    $http.post(config.login + "insertAddRemark", data).then(function (response) {
    //        showSuccessToast("Remark Added.");
    //        $scope.closeRemarkBox();
    //    }, function (err) {
    //        showErrorToast("Error while adding remark.");
    //    });
    //    //TODO: remove when api will be working
    //    $scope.closeRemarkBox();
    //}

    ////Update Adjustment

    //function clearAdjustmentBox() {
    //    $scope.netwt = null;
    //    $scope.adjustmentWt = null;
    //    $scope.totalNetWt = null;
    //}

    //$scope.showAddjustmentBox = function (item) {
    //    $scope.currentItem = item;
    //    clearAdjustmentBox();
    //    $('#AddjustmentbtnModal').modal('show');
    //}
    //$scope.closeAddjustmentBox = function () {
    //    clearAdjustmentBox();
    //    $('#AddjustmentbtnModal').modal('hide');
    //}
    //$scope.updateWt = function () {
    //    var data = {
    //        id: $scope.currentItem.id,
    //        netwt: $scope.netwt,
    //        adjustmentWt: $scope.adjustmentWt,
    //        totalNetWt: $scope.totalNetWt
    //    }
    //    $http.post(config.login + "updateWt", data).then(function (response) {
    //        showSuccessToast("Weigths updated.");
    //        $scope.closeAddjustmentBox();
    //    }, function (err) {
    //        showErrorToast("Error while updating weigths.");
    //    });
    //    //TODO: remove when api will be working
    //    $scope.closeAddjustmentBox();
    //}




}]);