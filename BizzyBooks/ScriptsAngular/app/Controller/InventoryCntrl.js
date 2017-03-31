
var Id = "";
var recalledBlocked = "";
var TotalCount = "";
var Skip;
myApp.controller('InventoryCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', 'fileUpload','$filter', function ($scope, $http, $timeout, $rootScope, $state, config, fileUpload, $filter) {
    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $scope.goBack = function () {
        window.history.back();
    },
    $scope.popuclose = function () {
        $('#form-popoverPopup').hide();
    },

    $('#PaymentdateAdvance').datepicker("setDate", new Date());

    $('#InventoryFilterDiv').hide();
    $('#InventoryFilter').click(function (e) {
        $('#InventoryFilterDiv').toggle();
    });
    
    $scope.invoiceclose = function () {
        $('.FlexPopup').slideUp();
    },
    $('.Statusfilter > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")
        $('#SearchFilterDiv').show();

    });
    $('.Typefilter > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")
        $('#SearchFilterDiv').show();

    });
    $('.Categoryfilter > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")
        $('#SearchFilterDiv').show();

    });

    //Send Get Request for all Inventory list  Data
    //var url = ""  +config.api+ "Inventories";
    //$http.get(url).then(function (response)
    //{
    //    $scope.InventoryList = response.data;
    //});
   /* var url = config.api + "Inventories?filter[limit]=10&filter[skip]=0";

    $http.get(url).then(function (response) {
        $scope.InventoryList = response.data;

        console.log($scope.InventoryList)
        console.log($scope.response)
    });
""*/
    //get inventory data

    var url = config.api + "Inventories?filter[where][visible]=false";

    $http.get(url).then(function (response) {
        $scope.InventoryList1 = response.data;
        console.log($scope.InventoryList1);
        $scope.TotalCount = response.data.length;
    });

   
    //Create New Inventory and update
    $scope.createNewInventory = function () {

        var dataobj = [];
        if (Id == "") {

            var data = {

                Remarks: $scope.Remarks,
                ContainerNOS: $scope.ContainerNOS,
                ParticularSheets: $scope.ParticularSheets,
                Grade: $scope.grade,
                Finish: $scope.finish,
                Thickness: $scope.Thickness,
                Width: $scope.width,
                Length: $scope.lenght,
                NetWeight: $scope.newweight,
                GrossWeight: $scope.gweight,
                StockCount: $scope.sheetsnos,
                Status: "Open"

            }
            dataobj.push(data)
            if ($scope.ContainerNOS == null) {

                alert("Please Enter Container NOS.")
                return;
            }
            var url = "" + config.api + "balk_Inventories";
            $http.post(url, dataobj).success(function (response) {
                if (response != null) {
                    //var url = "" + config.api + "Inventories";

                    //$http.get(url).then(function (response)
                    //{
                    //    $scope.InventoryList = response.data;
                    //});
                    if (Skip == undefined)
                        Skip = 0
                    var url = "" + config.api + "balk_Inventories?filter[limit]=10&filter[skip]=" + Skip + "";

                    $http.get(url).then(function (response) {
                        $scope.InventoryList = response.data;
                        $scope.TotalCount = response.data.length;
                    });

                    $scope.Remarks = null;
                    $scope.ContainerNOS = null;
                    $scope.ParticularSheets = null;
                    $scope.grade = null;
                    $scope.finish = null;
                    $scope.Thickness = null;
                    $scope.width = null;
                    $scope.lenght = null;
                    $scope.newweight = null;
                    $scope.gweight = null;
                    $scope.sheetsnos = null;
                    Id = "";

                }

            })
        }
        else {

            var data = {
                id: Id,
                Remarks: $scope.Remarks,
                ContainerNOS: $scope.ContainerNOS,
                ParticularSheets: $scope.ParticularSheets,
                Grade: $scope.grade,
                Finish: $scope.finish,
                Thickness: $scope.Thickness,
                Width: $scope.width,
                Length: $scope.lenght,
                NetWeight: $scope.newweight,
                GrossWeight: $scope.gweight,
                StockCount: $scope.sheetsnos,
                Status: "Open"

            }

            dataobj.push(data);
            var url = "" + config.api + "Inventories/" + Id + "";
            $http.put(url, dataobj).success(function (response) {
                if (response != null) {
                    if (Skip == undefined)
                        Skip = 0
                    var url = "" + config.api + "balk_Inventories?filter[limit]=10&filter[skip]=" + Skip + "";

                    $http.get(url).then(function (response) {
                        $scope.InventoryList = response.data;
                        $scope.TotalCount = response.data.length;
                    });

                    $scope.Remarks = null;
                    $scope.ContainerNOS = null;
                    $scope.ParticularSheets = null;
                    $scope.grade = null;
                    $scope.finish = null;
                    $scope.Thickness = null;
                    $scope.width = null;
                    $scope.lenght = null;
                    $scope.newweight = null;
                    $scope.gweight = null;
                    $scope.sheetsnos = null;
                    Id = "";

                }

            })
        }

    };

    $scope.getId = function (id, Remarks, ContainerNOS, ParticularSheets, ParticularSheets, Grade, Finish, Thickness, Width, Length, NetWeight, GrossWeight, SheetsNOS) {
        if (recalledBlocked == "") {
            Id = id;
            $scope.Remarks = Remarks;
            $scope.ContainerNOS = ContainerNOS;
            $scope.ParticularSheets = ParticularSheets;
            $scope.grade = Grade;
            $scope.finish = Finish;
            $scope.Thickness = Thickness;
            $scope.width = Width;
            $scope.lenght = Length;
            $scope.newweight = NetWeight;
            $scope.gweight = GrossWeight;
            $scope.sheetsnos = SheetsNOS;
        }
    }

    $scope.deleteRecord = function (id) {
        recalledBlocked = id;
        var url = "" + config.api + "Inventories/" + id + ""
        $http.delete(url).success(function (response) {
            if (response != null) {
                if (Skip == undefined)
                    Skip = 0;
                var url = "" + config.api + "balk_Inventories?filter[limit]=10&filter[skip]=" + Skip + "";

                $http.get(url).then(function (response) {
                    $scope.InventoryList = response.data;
                    $scope.TotalCount = response.data.length;
                });
                recalledBlocked = "";
                $scope.Remarks = null;
                $scope.ContainerNOS = null;
                $scope.ParticularSheets = null;
                $scope.grade = null;
                $scope.finish = null;
                $scope.Thickness = null;
                $scope.width = null;
                $scope.lenght = null;
                $scope.newweight = null;
                $scope.gweight = null;
                $scope.sheetsnos = null;
            }
        })



    }

    //$scope.uploadFile = function ()
    //{
    //    var file = $scope.myFile;
    //    var uploadUrl = ""+config.login+"ExcelUpload";
    //    fileUpload.uploadFileToUrl(file, uploadUrl);
    //};


    // Excel File Read and Store Key and Value 

    $scope.uploadFile = function () {
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
                        // var i = 0;
                        //retObj[obj.name] = obj.value;
                        for (var obj in XL_row_object[key]) {
                          
                            var obj1 = obj.replace(" ", "");
                           
                           
                            retObj[obj1] = XL_row_object[key][obj];
                           
                            //    //var rowobj = [];
                            var Keyobj = [];
                            var KeyName = obj;
                           
                            KeyName1 = KeyName.replace(" ", "");
                            
                            //     //var Value = XL_row_object[key][obj];

                            //     //rowobj[KeyName] = Value;
                            //    retObj[obj.name] = obj.value;

                            Keyobj[KeyName1] = KeyName1;

                           
                            //     $scope.rows.push(rowobj);
                            //     //$scope.rows.insert(i, rowobj)
                            //     $scope.Key.push(Keyobj);
                            //    // i++;
                            $scope.Key.push(Keyobj);
                        }

                        $scope.ExeclDataRows.push(retObj);
                        $scope.rows = [];
                        $scope.KeyArray = $scope.Key;
                        $scope.Key = [];

                    }




                })
                var ExcelData = $scope.ExeclDataRows

                console.log(ExcelData)
                var url = config.api + "Inventories";

                console.log(ExcelData);

                var data = {

                    Inventory: ExcelData
                }

                $http.post(url, data).success(function (response) {

                    if (response != null) {
                        //  alert("Excel Upload Successfully");
                        if (Skip == undefined)
                            Skip = 0;
                        var url = "" + config.api + "Inventories?filter[limit]=10&filter[skip]=" + Skip + "";

                        $http.get(url).then(function (response) {
                            $scope.InventoryList = response.data;
                            $scope.TotalCount = response.data.length;
                        });
                    }
                })
            };

            reader.onerror = function (ex) {
                console.log(ex);
            };

            reader.readAsBinaryString(file);
        };
        var data = this.parseExcel(file);
    };


    var url = config.api + "Inventories/count";

    $http.get(url).then(function (response) {
        $scope.TotalCount = "20";
    });



    //-----------------------Pagination start for Employee List
    $scope.itemsPerPage = 10;
    $scope.currentPage = 0;
    $scope.startPageNo = 0;
    $scope.EndPageNo = 0;
    $scope.range = function () {
        var rangeSize = 4;


        var totaldetail = $scope.TotalCount;

        var DynamicPage = Math.round(totaldetail / $scope.itemsPerPage)

        if (DynamicPage == 0) {
            rangeSize = 1;
        } else if (DynamicPage > 7) {
            rangeSize = 10;
        }
        else {
            rangeSize = DynamicPage
        }


        //Math.floor()

        var ps = [];

        var start;

        start = $scope.currentPage;

        //$scope.startPageNo =  $scope.currentPage + 1;
        $scope.EndPageNo = $scope.itemsPerPage * ($scope.currentPage + 1);
        $scope.startPageNo = $scope.EndPageNo - ($scope.itemsPerPage - 1)

        if (start > $scope.pageCount() - rangeSize) {
            start = $scope.pageCount() - rangeSize + 1;
        }
        for (var i = start; i < start + rangeSize; i++) {
            ps.push(i);
        }
        return ps;
    };

    $scope.nextPage = function () {


        console.log($scope.currentPage)
        if ($scope.currentPage == 0) {

            $scope.currentPage++
            $scope.setPage($scope.currentPage);

        }
        else {
            $scope.currentPage++
            $scope.setPage($scope.currentPage);
        }
    };


    $scope.DisableNextPage = function () {

        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";

    };


    $scope.prevPage = function () {

        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.setPage($scope.currentPage--);
        }
    };

    $scope.DisablePrevPage = function () {

        return $scope.currentPage === 0 ? "disabled" : "";

    };


    $scope.pageCount = function () {
        return Math.ceil($scope.TotalCount / $scope.itemsPerPage) - 1;
    };
   


    $scope.DisableNextPage = function () {

        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";

    };


    $scope.setPage = function (n) {

        $scope.currentPage = n;

        $scope.EndPageNo = $scope.itemsPerPage * ($scope.currentPage);
        $scope.startPageNo = $scope.EndPageNo - ($scope.itemsPerPage - 1);

        var DispLength;

        Skip = $scope.EndPageNo;
        DispLength = $scope.itemsPerPage;

        //var url = config.api + "balk_Inventories?filter[limit]=10&filter[skip]=0";
        var empUrl = config.api + "Inventories?filter[limit]=" + DispLength + "&filter[skip]=" + Skip;
        //if (EmpFilter.length != 0)
        //{
        //    var empQuery = "EmpFilter=";
        //    $.each(EmpFilter, function (key, value)
        //    {

        //        if (key == EmpFilter.length - 1)
        //        {
        //            empQuery += EmpFilter[key].empId;
        //        }
        //        else
        //        {
        //            empQuery += EmpFilter[key].empId + ',';
        //        }
        //    });

        //    empUrl = empUrl.replace('EmpFilter', empQuery);

        //}
        //else if (ManagerFilter.length != 0)
        //{
        //    var mangerQuery = "ManagerFilter=";
        //    $.each(ManagerFilter, function (key, value)
        //    {

        //        if (key == ManagerFilter.length - 1) {
        //            mangerQuery += ManagerFilter[key].tblEmployeeMaster.empId;
        //        }
        //        else {
        //            mangerQuery += ManagerFilter[key].tblEmployeeMaster.empId + ',';
        //        }
        //    });

        //    empUrl = empUrl.replace('ManagerFilter', mangerQuery);
        //}
        //else if (RoleFilter.length != 0) {
        //    var roleQuery = "RoleFilter=";
        //    $.each(RoleFilter, function (key, value) {

        //        if (key == RoleFilter.length - 1) {
        //            roleQuery += RoleFilter[key].roleId;
        //        }
        //        else {
        //            roleQuery += RoleFilter[key].roleId + ',';
        //        }
        //    });

        //    empUrl = empUrl.replace('RoleFilter', roleQuery);
        //}

        //$('#empListOverlayDiv').show();
        //$('#nodataimageview').hide();
        //$scope.employeeList = "";
        $http.get(empUrl).then(function (response) {
            $scope.InventoryList = response.data;

            if (response.data.length > 0) {
                var url = config.api + "Inventories/count";

                $http.get(url).then(function (response) {
                    $scope.TotalCount = response.data.count;
                });
            }
            else {
                $scope.TotalCount = 0;
                $('#nodataimageview').show();
            }

            $scope.range();
        });
        //CustomerMgmtService.getEmpList(empUrl).then(function (response)
        //{
        //    $('#empListOverlayDiv').hide();
        //    $scope.employeeList = response.data;

        //    if (response.data.length > 0)
        //    {
        //        $scope.TotalCount = response.data[0].totalCount;
        //    }
        //    else
        //    {
        //        $scope.TotalCount = 0;
        //        $('#nodataimageview').show();
        //    }

        //    $scope.range();

        //    // EmployeeList = response.data;
        //},
        //function (error)
        //{
        //    console.log(error.statusText);
        //    $('#empListOverlayDiv').hide();
        //});

    };

  

    // my code starts here


    $scope.GRNDetail = function (data) {
        $scope.itemData = data;


        console.log(data);
        console.log(data.id);
        $('#GRNDetailDiv').slideDown();
      
        $scope.billNo = data.no;
        $scope.NetWeight = data.NETWEIGHT;
        $scope.itemAmount1 = data.TOTALAMOUNTUSD* data.exchangeRate;
        $scope.itemAmountinINR = $filter('currency')($scope.itemAmount1, '₹', 2)
        $scope.costPerMTinINR = $filter('currency')($scope.itemAmount1 / data.NETWEIGHT, '₹', 2)
       
        $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.billNo).then(function (response) {
            console.log(response.data)
            $scope.billData = response.data[0].manualLineItem[0].totalDutyAmt;
            console.log($scope.billData)
           
            $scope.totalDutyAmt = response.data[0].manualLineItem[0].totalDutyAmt;
            $scope.totalBillAmount = response.data[0].amount;
            $scope.totalCustom = (Number($scope.totalDutyAmt) * Number(data.TOTALAMOUNTUSD) * Number(data.exchangeRate)) / Number($scope.totalBillAmount) * Number(data.NETWEIGHT);

        });
        $http.get(config.api + "transactions" + "?[filter][where][ordertype]=EXPENSE" + "&[where][refNo]=" + $scope.billNo).then(function (response) {

            $scope.expenseData = response.data;
            console.log(response.data)
            $scope.supliersName1 = response.data.supliersName;
            $scope.amount1 = response.data.amount;
            $scope.date1 = response.data.date;
            console.log($scope.expenseData)

            var total = 0;
            for (var i = 0; i < $scope.expenseData.length; i++) {
                var product = Number($scope.expenseData[i]);
                total += Number($scope.expenseData[i].amount);
            }
            $scope.tatalExpense = Math.round(total);
            $scope.totalCostPerMT = ($scope.tatalExpense + $scope.itemAmount1) / $scope.NetWeight
        })

        $http.get(config.api + "ledgers" + "?[filter][where][refNo]=" + $scope.billNo + "&[filter][where][type]=Direct Expense").then(function (response) {

            $scope.taxData = response.data;
            console.log(response.data)
            $scope.supliersName1 = response.data.supliersName;
            $scope.amount1 = response.data.amount;
            $scope.date1 = response.data.date;
            console.log($scope.expenseData)

        })
    }
    // get inventory ledger 

    

}]);

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


myApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })

        .success(function (response) {
            var res = response;
            alert(res.message);
        })

        .error(function () {
        });
    }
}]);