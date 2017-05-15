myApp.controller('StockBalanceInventoryCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        window.history.back();
    }

    $scope.UploadOpeningStock = function () {
        $('#UploadOpeningStock').modal('show');
    }

    //$scope.clear = function ($event, $select) {
    //    $event.stopPropagation();
    //    //to allow empty field, in order to force a selection remove the following line
    //    $select.selected = undefined;
    //    //reset search query
    //    $select.search = undefined;
    //    //focus and open dropdown
    //    $select.activate();
    //}
    $scope.clear = function ($event, $select) {
        $event.stopPropagation();
        $select.selected = undefined;
        $select.search = undefined;

        $timeout(function () { $select.activate() }, 200);
    }
    $http.get(config.api + "Inventories?filter[where][visible]=true&filter[limit]=20").then(function (response) {
        $scope.ItemList2 = response.data;
        $scope.filterList = $scope.ItemList2;
        //console.log($scope.ItemList);
        //$scope.ItemCount = response.data.length;
    });
    var qryAgg = 'visible=true&group={"no": "$no","DESCRIPTION":"$DESCRIPTION","GODOWN": "$GODOWN","RRMARKS":"$RRMARKS"}';
    $http.get(config.login + "getAggregateInventories?" + qryAgg).then(function (response) {
        $scope.ItemList = response.data;
        //$scope.filterList2 = $scope.ItemList2;
        //console.log($scope.ItemList);
        //$scope.ItemCount = response.data.length;
    });
    $scope.invoiceno = {};
    $scope.godown = {};
    $scope.description = {};
    $scope.remarks = {};
    $scope.rgno = {};
    $scope.exciseDuty = {};
    $scope.SAD = {};
    $scope.NETWEIGHT = {};

    $scope.clearFilter=function(){
        $scope.invoiceno = {};
        $scope.godown = {};
        $scope.description = {};
        $scope.remarks = {};
        $scope.rgno = {};
        $scope.exciseDuty = {};
        $scope.SAD = {};
        $scope.NETWEIGHT = {};
        $scope.filterList = $scope.ItemList2;
    }
    $scope.applyFilter = function () {
        var qry = {
            "where": {
                "visible": true,
                "no":$scope.invoiceno.selected ? $scope.invoiceno.selected._id.no : $scope.invoiceno.selected,
                "GODOWN": $scope.godown.selected ? $scope.godown.selected._id.GODOWN : $scope.godown.selected,
                "DESCRIPTION": $scope.description.selected ? $scope.description.selected._id.DESCRIPTION : $scope.description.selected,
                "RRMARKS": $scope.remarks.selected ? $scope.remarks.selected._id.RRMARKS : $scope.remarks.selected,
                "rgNo": $scope.rgno.selected ? $scope.rgno.selected._id.rgNo : $scope.rgno.selected,
                "exciseDuty": $scope.exciseDuty.selected ? $scope.exciseDuty.selected._id.exciseDuty : $scope.exciseDuty.selected,
                "SAD": $scope.SAD.selected ? $scope.SAD.selected._id.SAD : $scope.SAD.selected,
                "NETWEIGHT": $scope.NETWEIGHT.selected ? $scope.NETWEIGHT.selected._id.NETWEIGHT : $scope.NETWEIGHT.selected,
            }
        }
        $http.get(config.api + "Inventories?filter=" + encodeURIComponent(JSON.stringify(qry))).then(function (response) {
            $scope.filterList = response.data;
            //$scope.ItemList2 = response.data;
            //$scope.filterList = $scope.ItemList2;
        });
    }
    //$scope.applyFilter = function () {
    //    var qry = "Inventories?filter[where][visible]=true";
    //    if ($scope.invoiceno.selected)
    //        qry = qry + "&filter[where][no]=" + $scope.invoiceno.selected._id.no;
    //    if ($scope.godown.selected)
    //        qry = qry + "&filter[where][GODOWN]=" + $scope.godown.selected._id.GODOWN;
    //    if ($scope.description.selected)
    //        qry = qry + "&filter[where][DESCRIPTION]=" + $scope.description.selected._id.DESCRIPTION;
    //    if ($scope.remarks.selected)
    //        qry = qry + "&filter[where][RRMARKS]=" + $scope.remarks.selected._id.RRMARKS;

    //    $http.get(config.api + qry).then(function (response) {
    //        $scope.filterList = response.data;
    //        //console.log($scope.ItemList);
    //        //$scope.ItemCount = response.data.length;
    //    });
    //}
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
        if($scope.itemChecked.length==$scope.filterList.length)
            $scope.selectAll = true;
    }
    //view Info
    $scope.viewInfo = function (Item) {
        if (Item != undefined) {
            $state.go('Customer.stockBalanceView', { voId: Item.id });
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
        } else
        {
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
       // $scope.closeAddjustmentBox();
    }


    $('.filenameDiv').hide();
    $('.attechmentDescription').hide();
    $('.Attechmentdetail').click(function () {
        $('.filenameDiv').show();
        $("#type").append($("#uploadBtn").val());

    });

    $('#removeattachment').click(function () {
        $('.filenameDiv').hide();
    });

    $(":file").filestyle({ buttonName: "btn-sm btn-info" });

    // stock upload
    function uploadStockInventory(data) {
        $http.post(config.api + "Inventories", data).then(function (response) {
            console.log(response)
            $scope.saving = false
        })
    }
    $scope.uploadFile = function () {
        $scope.saving = true
        $scope.inventoryLedger = [];
        $scope.rows = [];
        $scope.ExeclDataRows = [];
        $scope.Key = [];
        $scope.KeyArray = [];
        var KeyName1;
        var file = $scope.myFile;
        this.parseExcel = function (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });
                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    for (key in XL_row_object) {
                        var retObj = {};
                        for (var obj in XL_row_object[key]) {

                            var obj1 = obj.replace(" ", "");
                            retObj[obj1] = XL_row_object[key][obj];

                            retObj["currentStatus"] = 'open';
                            retObj["visible"] = true;
                            retObj["no"] = "Opening Balance";
                            retObj["statusTransaction"] = [{ dt: new Date(), status: 'open', remarks: 'inventory added' }];
                            //retObj["assesableValue"] = '0';
                           // retObj["exciseDuty"] = '0';
                            //retObj["dutyAmount"] = '0';
                            //retObj["SAD"] = '0';
                            //retObj["totalDutyAmt"] = '0';
                           
                           
                            var Keyobj = [];
                            var KeyName = obj;
                            Keyobj[KeyName1] = KeyName;
                            $scope.Key.push(Keyobj);
                        }
                        $scope.ExeclDataRows.push(retObj);
                        $scope.rows = [];
                        $scope.KeyArray = $scope.Key;
                        $scope.Key = [];
                    }
                })
                uploadStockInventory($scope.ExeclDataRows);

            };
            reader.onerror = function (ex) {

            };

            reader.readAsBinaryString(file);
        };
        var data = this.parseExcel(file);
    };


}]);