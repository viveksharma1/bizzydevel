myApp.controller('BalanceInventoryCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', 'DTOptionsBuilder', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter, DTOptionsBuilder) {

    $('[data-toggle="tooltip"]').tooltip();

    $('#SearchFilter').hide();
   

    $('#menutoggle').click(function () {
        $('#Datefilter').addClass('Datefilter2');
    })

    $scope.InventoryFilter = function () {
        $('#SearchFilter').toggle();
        $('#balancetable').toggleClass('col-sm-10');
    }

    $(".my a").click(function (e) {
        e.preventDefault();
    });
    
    $scope.goBack = function () {
        window.history.back();
    }
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
            if (data[i].BALANCE != undefined) {
                BALANCE += Number(data[i].BALANCE)
            }
           
        }
        $scope.totalNetWeight =  NETWEIGHT.toFixed(3)
        $scope.totalNetBalance = (BALANCE).toFixed(3)


    }
    $scope.datatable = false
   
    function getInventory() {
        $http.get(config.login + "getInventory" + "?compCode=" + localStorage.CompanyId + "&visible=" + false).then(function (response) {
            $scope.ItemList2 = response.data;
            $scope.filterList = $scope.ItemList2;
            getTotalsum(response.data);
    
            $scope.datatable = true
         
    
           

        });
    }
    getInventory();
    var qryAgg = 'visible=false&compCode=' + localStorage.CompanyId + '&group={"SUBCATEGORY": "$SUBCATEGORY","COILSHEETNO":"$COILSHEETNO","DATE": "$DATE","LotWeight":"$LotWeight","LOCATION":"$LOCATION","GRADE":"$GRADE","FINISH":"$FINISH","THICKNESS":"$THICKNESS","WIDTH":"$WIDTH","LENGTH":"$LENGTH","NETWEIGHT":"$NETWEIGHT","GROSSWT":"$GROSSWT","PCSLENGTHINMTRS":"PCSLENGTHINMTRS","no":"$no","INCOMINGDATE":"$INCOMINGDATE"}';
    $http.get(config.login + "getAggregateInventories?" + qryAgg).then(function (response) {
        $scope.ItemList = response.data;
        $scope.datatable = true
       
     });
    
    $scope.PCSLENGTHINMTRS = {}
    $scope.no = {};
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
        $scope.PCSLENGTHINMTRS = {};
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
        $scope.no = {};
        $scope.filterList = $scope.ItemList2;
    }
    var WIDTH = []
    var SUBCATEGORY = []
    var COILSHEETNO = []
    var INCOMINGDATE = []
    var LotWeight = []
    var LOCATION = []
    var GRADE = []
    var FINISH = []
    var THICKNESS = []
    var WIDTH = []
    var LENGTH = []
    var NETWEIGHT = []
    var GROSSWT = []
    $scope.addLotWeight = function (item) {
        LotWeight.push(item)

    }
    $scope.removeLotWeight = function (item) {
        var index = LotWeight.indexOf(item);
        if (index > -1) {
            LotWeight.splice(index, 1);
        }
    }
    $scope.addCOILSHEETNO = function (item) {
        COILSHEETNO.push(item)

    }
    $scope.removeCOILSHEETNO = function (item) {
        var index = COILSHEETNO.indexOf(item);
        if (index > -1) {
            COILSHEETNO.splice(index, 1);
        }
    }
    $scope.addWIDTH = function (item) {
        WIDTH.push(item)

    }
    $scope.removeWIDTH = function (item) {
        var index = WIDTH.indexOf(item);
        if (index > -1) {
            WIDTH.splice(index, 1);
        }
    }
    $scope.addTHICKNESS = function (item) {
        THICKNESS.push(item)

    }
    $scope.removeTHICKNESS = function (item) {
        var index = THICKNESS.indexOf(item);
        if (index > -1) {
            THICKNESS.splice(index, 1);
        }
    }
    $scope.addGRADE = function (item) {
        GRADE.push(item)

    }
    $scope.removeGRADE = function (item) {
        var index = GRADE.indexOf(item);
        if (index > -1) {
            GRADE.splice(index, 1);
        }
    }
    $scope.addFINISH = function (item) {
        FINISH.push(item)

    }
    $scope.removeFINISH = function (item) {
        var index = FINISH.indexOf(item);
        if (index > -1) {
            FINISH.splice(index, 1);
        }
    }
    $scope.addNETWEIGHT = function (item) {
        NETWEIGHT.push(item)

    }
    $scope.removeNETWEIGHT = function (item) {
        var index = NETWEIGHT.indexOf(item);
        if (index > -1) {
            NETWEIGHT.splice(index, 1);
        }
    }

    $scope.removeINCOMINGDATE = function (item) {
        var index = INCOMINGDATE.indexOf(item);
        if (index > -1) {
            INCOMINGDATE.splice(index, 1);
        }
    }
    $scope.addINCOMINGDATE = function (item) {
        INCOMINGDATE.push(item)

    }
    $scope.removeGROSSWT = function (item) {
        var index = GROSSWT.indexOf(item);
        if (index > -1) {
            GROSSWT.splice(index, 1);
        }
    }
    $scope.addGROSSWT = function (item) {
        GROSSWT.push(item)

    }
    $scope.removeLENGTH = function (item) {
        var index = LENGTH.indexOf(item);
        if (index > -1) {
            LENGTH.splice(index, 1);
        }
    }
    $scope.addLENGTH = function (item) {
        LENGTH.push(item)

    }
    $scope.removeLOCATION = function (item) {
        var index = LOCATION.indexOf(item);
        if (index > -1) {
            LOCATION.splice(index, 1);
        }
    }
    $scope.addLOCATION = function (item) {
        LOCATION.push(item)

    }
    $scope.removeSUBCATEGORY = function (item) {
        var index = SUBCATEGORY.indexOf(item);
        if (index > -1) {
            SUBCATEGORY.splice(index, 1);
        }
    }
    $scope.addSUBCATEGORY = function (item) {
        SUBCATEGORY.push(item)

    }
   
    $scope.applyFilter = function () {

        var qry = [
              { WIDTH: WIDTH },

            { COILSHEETNO: COILSHEETNO },
            { INCOMINGDATE: INCOMINGDATE },
            { LotWeight: LotWeight },
            { LOCATION: LOCATION },
           { GRADE: GRADE },
           { FINISH: FINISH },
            { THICKNESS: THICKNESS },


            { NETWEIGHT: NETWEIGHT },
            { GROSSWT: GROSSWT },
            { LENGTH: LENGTH },
             { SUBCATEGORY: SUBCATEGORY },

        ]

        $http.post(config.login + "inventoryFilter", qry).then(function (response) {
            $scope.filterList = response.data;
        });
    }
    //$scope.applyFilter = function () {
    //    var qry = "Inventories?filter[where][visible]=false";
    //    if ($scope.subcategory.selected)
    //        qry = qry + "&filter[where][SUBCATEGORY]=" + $scope.subcategory.selected._id.SUBCATEGORY;
    //    if ($scope.coilsheetno.selected)
    //        qry = qry + "&filter[where][COILSHEETNO]=" + $scope.coilsheetno.selected._id.COILSHEETNO;
    //    if ($scope.incomingdate.selected)
    //        qry = qry + "&filter[where][INCOMINGDATE]=" + $scope.incomingdate.selected._id.INCOMINGDATE;
    //    if ($scope.lotweight.selected)
    //        qry = qry + "&filter[where][LotWeight]=" + $scope.lotweight.selected._id.LotWeight;
    //    if ($scope.location.selected)
    //        qry = qry + "&filter[where][LOCATION]=" + $scope.location.selected._id.LOCATION;
    //    if ($scope.grade.selected)
    //        qry = qry + "&filter[where][GRADE]=" + $scope.grade.selected._id.GRADE;
    //    if ($scope.finish.selected)
    //        qry = qry + "&filter[where][FINISH]=" + $scope.finish.selected._id.FINISH;
    //    if ($scope.thickness.selected)
    //        qry = qry + "&filter[where][THICKNESS]=" + $scope.thickness.selected._id.THICKNESS;
    //    if ($scope.width.selected)
    //        qry = qry + "&filter[where][WIDTH]=" + $scope.width.selected._id.WIDTH;
    //    if ($scope.length.selected)
    //        qry = qry + "&filter[where][LENGTH]=" + $scope.length.selected._id.LENGTH;
    //    if ($scope.netweight.selected)
    //        qry = qry + "&filter[where][NETWEIGHT]=" + $scope.netweight.selected._id.NETWEIGHT;
    //    if ($scope.grossweight.selected)
    //        qry = qry + "&filter[where][GROSSWT]=" + $scope.grossweight.selected._id.GROSSWT;
    //    if ($scope.pcslengthmtr.selected)
    //        qry = qry + "&filter[where][PCS/LENGTHINMTRS]=" + $scope.pcslengthmtr.selected._id.PCS / LENGTHINMTRS;

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


    function uploadStockInventory(data) {
        var iData = []
        var inventoryData = [];
        var iData = data
        var splitCount = 0
        var lCount = 0
        var MAX = 0
        var gCount = 0
        var count = Math.round(data.length / 100)
        if (count < 1) {
            gCount = 1
            MAX = data.length
        } else {
           gCount = count
           MAX = 100
        }   
        for (var i = 0; i < gCount; i++) {
                if ((data.length - (splitCount * 100)) < 100) {
                    MAX = data.length - (splitCount * 100)
            }
                for (var j = 0; j < MAX; j++) {
                    inventoryData.push(data[lCount])
                    lCount++;
                       
            }
                splitCount++;
                //console.log(splitCount++)
            console.log("first 1 hundred ", inventoryData)
           
            $http.post(config.login + "uploadInventory", inventoryData).then(function (response) {
               console.log(response)
               $rootScope.$broadcast('event:success', { message: $scope.ExeclDataRows.length + " Opening Stock Uploaded Successfully " });
               getInventory()
            })
            inventoryData = []
        }
        
    }

    $scope.myPagingFunction = function () {
        alert("fdfdfs")
    }
    $scope.uploadFile = function () {
        
        $scope.inventoryLedger = [];
        $scope.rows = [];
        $scope.ExeclDataRows = [];
        $scope.Key = [];
        $scope.KeyArray = [];
        var KeyName1;
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
                try{
                var workbook = XLSX.read(data, { type: 'binary' });
                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    for (key in XL_row_object) {
                        var retObj = {};
                        for (var obj in XL_row_object[key]) {
                      
                            var obj3 = obj.replace(" ", "");
                            var obj2 = obj3.replace(" ", "");
                            var obj4 = obj2.replace(" ", "");
                            var obj1 = obj4.replace("/", "");

                            if (obj1 == "InvoiceNo") {
                                retObj["no"] = retObj[obj1] = XL_row_object[key][obj];
                            }
                            if (obj1 == "INCOMINGDATE") {
                                retObj["DATE"] = moment(new Date(retObj[obj1] = XL_row_object[key][obj])).format('DD/MM/YYYY');
                                console.log(retObj["DATE"])
                            }
                            var INOUT = "IN/OUT"
                            var date = "date"
                            var exchangeRate = "exchangeRate"
                            if (obj1 == "NETWEIGHT") {
                                $scope.netweight = Number(XL_row_object[key][obj]);
                                retObj["BALANCE"] = Number(XL_row_object[key][obj]);
                            }
                            if (obj1 == "TOTALPRICE") {
                                $scope.totalprice = Number(XL_row_object[key][obj]);
                                retObj["TOTALAMOUNTUSD"] = $scope.netweight * $scope.totalprice;
                                console.log(retObj["TOTALAMOUNTUSD"]);
                            }

                            if (obj1 == "FOBUNITPRICEUSD" || obj1 == "CIFUNITPRICE" || obj1 == "NETWEIGHT" || obj1 == "TOTALPRICE" || obj1 == "GROSSWT") {
                                retObj[obj1] = Number(XL_row_object[key][obj]);
                            }


                            else {
                                retObj[obj1] = XL_row_object[key][obj];
                            }
                           
                           
                            retObj[exchangeRate] = $scope.ExchangeRateINR
                            retObj[INOUT] = 0
                            retObj["compCode"] = localStorage.CompanyId
                            retObj["currentStatus"] = 'open';
                            retObj["visible"] = false;
                            retObj["type"] = 'OB';
                            retObj["statusTransaction"] = [{ dt: new Date(), status: 'open', remarks: 'inventory added' }];
                            retObj["assesableValue"] = '0';
                            retObj["exciseDuty"] = '0';
                            retObj["dutyAmount"] = '0';
                            retObj["SAD"] = '0';
                            retObj["totalDutyAmt"] = '0';
                            if ($scope.rate && $scope.weight) {

                                retObj["fobamount"] = Number($scope.rate) * Number($scope.weight);
                            }
                            if ($scope.cifrate && $scope.weight) {
                                retObj["cifamount"] = Number($scope.rate) * Number($scope.weight);

                            }
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
.withOption('scrollX', 100)
.withOption('scrollY', h - 195)
.withOption('paging', false)
.withOption('searching', false)
.withOption('bInfo', false)

.withOption('oLanguage', false);



}]);