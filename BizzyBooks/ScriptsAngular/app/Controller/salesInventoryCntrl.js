myApp.controller('salesInventoryCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', 'DTOptionsBuilder', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter, DTOptionsBuilder) {

    $('#statusDateInventory').datepicker({
        assumeNearbyYear: true,
        autoclose: true,
        todayBtn: true
    });

    $(".my a").click(function (e) {
        e.preventDefault();
    });

 

    $scope.goBack = function () {
        window.history.back();
    }
    $.fn.datepicker.defaults.format = "dd/mm/yyyy";
    $('#SearchFilter').hide();
    //$("#wrapper").addClass("toggled");

    $('#menutoggle').click(function () {
        $('#Datefilter').addClass('Datefilter2');
    })

    $scope.InventoryFilter = function () {
        $('#SearchFilter').toggle();
        $('#balancetable').toggleClass('col-sm-10');
    }


    $scope.UploadOpeningStock = function () {
        $('#UploadOpeningStock').modal('show');
    }

 
   // $scope.statusDate = "statusDate";
    var h = window.innerHeight;


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
        // $event.stopPropagation();
        $select.selected = undefined;
        $select.search = undefined;

        $timeout(function () { $select.activate() }, 200);
    }

    function getTotalsum(data) {
        var NETWEIGHT = 0;
        var BALANCE = 0;
        for (var i = 0; i < data.length; i++) {
            NETWEIGHT += Number(data[i].NETWEIGHT)
            BALANCE += Number(data[i].BALANCE)
        }
        $scope.totalNetWeight = (NETWEIGHT).toFixed(3)
        $scope.totalNetBalance = (BALANCE).toFixed(3)


    }

    $scope.datatable = false
    function getCustomerName(data) {
        for (var i = 0; i < data.length; i++) {
           data[i].customerName = localStorage[data[i].customerId]
        }
        return data
    }
    function getInventory() {
        // $http.get(config.api + "Inventories?filter[where][visible]=true&[filter][where][compCode]=" + localStorage.CompanyId ).then(function (response) {
        $http.get(config.login + "getSalesInventory" + "?compCode=" + localStorage.CompanyId + "&visible=" + true).then(function (response) {
          //  $scope.filterList = response.data;
            $scope.filterList = getCustomerName(response.data)
            getTotalsum(response.data)
            $scope.datatable = true

        });
    }
    getInventory();
    var qryAgg = 'visible=true&compCode=' + localStorage.CompanyId + '&group={"no": "$no","DESCRIPTION":"$DESCRIPTION","GODOWN": "$GODOWN","RRMARKS":"$RRMARKS","NETWEIGHT":"$NETWEIGHT", "BALANCE":"$BALANCE","RG":"$RG"}';
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
    $scope.RG = {};
    $scope.exciseDuty = {};
    $scope.SAD = {};
    $scope.NETWEIGHT = {};
    $scope.BALANCE = {};

    $scope.clearFilter = function () {
        $scope.invoiceno = {};
        $scope.godown = {};
        $scope.description = {};
        $scope.remarks = {};
        $scope.RG = {};
        $scope.exciseDuty = {};
        $scope.SAD = {};
        $scope.NETWEIGHT = {};
        $scope.filterList = $scope.ItemList2;
        getTotalsum($scope.filterList);
    }
    $scope.applyFilter = function () {
        var qry = {
            $match: {
                "visible": true,
                "compCode": localStorage.CompanyId,
                "no": $scope.invoiceno.selected ? $scope.invoiceno.selected._id.no : $scope.invoiceno.selected,
                "GODOWN": $scope.godown.selected ? $scope.godown.selected._id.GODOWN : $scope.godown.selected,
                "DESCRIPTION": $scope.description.selected ? $scope.description.selected._id.DESCRIPTION : $scope.description.selected,
                "RRMARKS": $scope.remarks.selected ? $scope.remarks.selected._id.RRMARKS : $scope.remarks.selected,
                "RG": $scope.RG.selected ? $scope.RG.selected._id.RG : $scope.RG.selected,
                "exciseDuty": $scope.exciseDuty.selected ? $scope.exciseDuty.selected._id.exciseDuty : $scope.exciseDuty.selected,
                "SAD": $scope.SAD.selected ? $scope.SAD.selected._id.SAD : $scope.SAD.selected,
                "NETWEIGHT": $scope.NETWEIGHT.selected ? $scope.NETWEIGHT.selected._id.NETWEIGHT : $scope.NETWEIGHT.selected,
                "BALANCE": $scope.BALANCE.selected ? $scope.BALANCE.selected._id.BALANCE : $scope.BALANCE.selected,
            },
            $unwind: {path:"$salesTransaction",includeArrayIndex: "arrayIndex"},
            salesTransaction: { $exists: true}
        }
        $http.get(config.login + "getSalesInventoryAgg" + "?queryData=" + qry) + "&compCode=" + localStorage.CompanyId + "&visible=" + true).then(function (response) {
            $scope.filterList = response.data;
            getTotalsum(response.data);
            $scope.datatable = true
            //$scope.ItemList2 = response.data;
            //$scope.filterList = $scope.ItemList2;
        });
    }
 
    $scope.itemChecked = [];
   
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
        } else {
            $scope.currentItem.items = item;
            $scope.currentItem.multi = false;
        }

    }
   
    function clearStatusBox() {
        $scope.spnStatus = null;
        $scope.txtRemarks = null;
    }
    
    $scope.closeStatusBox = function () {
        $('#ChangeStatusModal').modal('hide');
        clearStatusBox();
        clearCheckBoxs();
    }


    //Add Remarks...
    $scope.showRemarkBox = function (item, multi) {
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
    $scope.addStatus = function () {
        var query = [];
        if ($scope.currentItem.multi) {
            for (var i = 0; i < $scope.currentItem.items.length; i++) { query.push($scope.currentItem.items[i]._id) }
        } else {
            query.push($scope.currentItem.items._id);
        }
        $scope.currentItem.items.salesTransaction.status = $scope.status
        $scope.currentItem.items.salesTransaction.statusDate = $scope.statusDate
        var salesTransaction = $scope.currentItem.items.salesTransaction
        var data = {
            id: $scope.currentItem.items._id,
            ids: $scope.currentItem.items.salesTransaction.id,
            arrayIndex:$scope.currentItem.items.salesTransaction.arrayIndex,
            salesTransaction: salesTransaction
        }
        console.log($scope.currentItem.items.salesTransaction.id)
        $http.post(config.login + "changeStatus", data).then(function (response) {
            showSuccessToast("Remark Added.");
            $scope.closeRemarkBox();
        }, function (err) {
            showErrorToast("Error while adding remark.");
        });
       
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
   
    $http.get(config.api + "Inventories/count" + "?[where][visible]=true").then(function (response) {

        $scope.count = response.data.count
        console.log($scope.count);
    })
    $scope.uploadFile = function () {
        $scope.inventoryLedger = [];
        $scope.rows = [];
        $scope.ExeclDataRows = [];
        $scope.Key = [];
        $scope.KeyArray = [];
        var KeyName1;
        var count = $scope.count
        var file = $scope.myFile;
        if (!file) {
            $rootScope.$broadcast('event:error', { message: "Please Choose File" });
            return;
        }
        this.parseExcel = function (file) {
            $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                try {
                    var workbook = XLSX.read(data, { type: 'binary' });
                    workbook.SheetNames.forEach(function (sheetName) {
                        // Here is your object
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        for (key in XL_row_object) {
                            var retObj = {};
                            for (var obj in XL_row_object[key]) {

                                var obj1 = obj.replace(" ", "");
                                retObj[obj1] = XL_row_object[key][obj];

                                if (obj1 == "InvoiceNo") {
                                    retObj["no"] = retObj[obj1] = XL_row_object[key][obj];
                                }

                                if (obj1 == "actualDate") {
                                    retObj["actualDate"] = moment(new Date(retObj[obj1] = XL_row_object[key][obj])).format('DD/MM/YYYY');
                                    console.log(retObj["actualDate"])
                                }
                                console.log(retObj[obj1])

                                if (obj1 == "NETWEIGHT") {
                                    retObj[obj1] = Number(XL_row_object[key][obj]);
                                }
                                if (obj1 == "BALANCE") {
                                    retObj[obj1] = Number(XL_row_object[key][obj]);
                                }
                                retObj["type"] = 'OB';
                                retObj["compCode"] = localStorage.CompanyId
                                retObj["currentStatus"] = 'open';
                                retObj["visible"] = true;
                                // retObj["no"] = "Opening Balance";
                                retObj["statusTransaction"] = [{ dt: new Date(), status: 'open', remarks: 'inventory added' }];
                                //retObj["RG"] = count + 1;

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
                            count++
                            $scope.ExeclDataRows.push(retObj);
                            $scope.rows = [];
                            $scope.KeyArray = $scope.Key;
                            $scope.Key = [];
                        }

                    })
                    uploadStockInventory($scope.ExeclDataRows);
                    $scope.myFile = null;
                    $scope.$apply();
                } catch (e) {
                    console.log(e)
                    $rootScope.$broadcast('event:error', { message: "Unsupported file" });
                    $scope.myFile = null;
                    $scope.$apply();

                }

            };
            reader.onerror = function (ex) {

            };

            reader.readAsBinaryString(file);
        };
        var data = this.parseExcel(file);
    };

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('processing', false)
      .withOption('scrollX', true)
        .withOption('scrollY', h - 195)
        .withOption('paging', false)
       .withOption('bInfo', false)
       .withOption('searching', false)
  
}]);