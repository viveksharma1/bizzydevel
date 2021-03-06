﻿

var Id = "";
var recalledBlocked = "";
var TotalCount = "";
var Skip;



myApp.controller('SupplierCntrl', ['$scope', '$http', '$timeout', '$stateParams','$rootScope', 'commonService', '$state', 'config', '$location', 'DTOptionsBuilder', 'DTDefaultOptions', function ($scope, $http, $timeout,$stateParams, $rootScope, commonService, $state, config, $location, DTOptionsBuilder, DTDefaultOptions) {
    $(".loader").show()
    $('#addInventryModal').modal('hide');
    $('#nodataimageview').hide();
    $scope.changestatus = "OPEN"
    $scope.changestatus1 = "OPEN";
    $scope.changestatus2 = "OPEN";

    $scope.compCode = localStorage.CompanyId;

    $scope.moreEmployeebtn = function (data) {

        $scope.enq = data;
        $('#moreEmployeeModal').modal('show');
       
    }

    if (localStorage.VAT_TIN_NO == "undefined") {
        $scope.VAT_TIN_NO = localStorage.VAT_TIN_NO;
        $scope.CST_TIN_NO = localStorage.CST_TIN_NO;
    }
    else {
        $scope.VAT_TIN_NO = localStorage.VAT_TIN_NO;
        $scope.CST_TIN_NO = localStorage.CST_TIN_NO;
    }

    if (localStorage.ChangeCompanyName == "undefined") {
        $scope.CompanyName = localStorage.DefaultCompanyName
    }
    else {
        $scope.CompanyName = localStorage.ChangeCompanyName;
    }

    $scope.admin = localStorage['adminrole'];


    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $scope.goBack = function () {
        window.history.back();
    }

    $scope.supplierclose = function () {
        // $scope.InventoryList = [];
        $('.FlexPopup').slideUp();
    }
    $(".sk-wave").show()
    $scope.admin = localStorage['adminrole'];
    $scope.Role = localStorage['adminrole'];

    //get purchase invoice  data
    $scope.getPurchaseInvoice = function () {
        $http.get(config.login + 'getTransactionData/'+ localStorage.CompanyId + '?role=' + localStorage["usertype"] + "&type=Purchase Invoice").then(function (response) {
            $scope.purchaseInvoiceTable = response.data;
            var totalAmount = 0
            for (var i = 0; i < $scope.purchaseInvoiceTable.length; i++) {
                $scope.purchaseInvoiceTable[i].supplier = localStorage[$scope.purchaseInvoiceTable[i].supplier];
                totalAmount += $scope.purchaseInvoiceTable[i].amount
            }
            $scope.totalBill = totalAmount
        });
    }  
    //get expense data
    $scope.getExpense = function () {
        $http.get(config.login + 'getTransactionDataExpense/' + localStorage.CompanyId + '?role=' + localStorage["usertype"] + "&type=EXPENSE").then(function (response) {
            $scope.expenseTable = response.data;
            var totalAmount = 0
            $scope.expenseCount = $scope.expenseTable.length
                for (var i = 0; i < $scope.expenseTable.length; i++) {
                    $scope.expenseTable[i].supplier = localStorage[$scope.expenseTable[i].supplier];
                    totalAmount += $scope.expenseTable[i].amount
                }
                $scope.totalExpense = totalAmount
            });  
    }
    //get supplier data
    $scope.getSupplier = function () {
        $http.get(config.login + "getSupplierAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.supplierList = response.data
        });
    }
    $scope.getPurchaseInvoice();
    $scope.getSupplier();
    $scope.getExpense();
    $scope.isPaid = function (amount) {
        if (amount == '0') {
            return "isPaid"
        }

    }
    $scope.SuppliersTablebtn = function () {
        $(".loader").show()
        $scope.url3 = "getSupplierAccount"
        $scope.globalUrl4 = "suppliers/count"
        $scope.InventoryList = [];
        $scope.getSupplier();
        $('#example').show();
        $('#PurchaseOrderTable').hide();
        $('#EnquiryTable').hide();
        $('#OpenBill').hide();
        $('#PaidBillTable').hide();
    },



    $scope.OpenBillTable = function () {
        $scope.getPurchaseInvoice()
        $('#OpenBill').show();
        $('#PurchaseOrderTable').hide();
        $('#EnquiryTable').hide();
        $('#PaidBillTable').hide();
        $('#example').hide();
    },

    $scope.PaidBillbtn = function () {
        $('#PaidBillTable').show();
        $('#OpenBill').hide();
        $('#PurchaseOrderTable').hide();
        $('#EnquiryTable').hide();
        $('#example').hide();

    },
     
    $scope.EnquiryTablebtn = function (status) {
        $scope.InventoryList = [];
        $(".loader").show()
        $scope.newStatus = "&filter[where][status]=" + status;
        $scope.newStatus1 = "&[where][status]=" + status;
        $('#PaidBillTable').hide();
        $('#OpenBill').hide();
        $('#PurchaseOrderTable').hide();
        $('#EnquiryTable').show();
        $('#example').hide();


    }


  
    $scope.ExpenseTable = function (status) {
        $scope.getExpense()
        $('#example').hide();
        $('#PurchaseOrderTable').show();
        $('#EnquiryTable').hide();
        $('#OpenBill').hide();
        $('#PaidBillTable').hide();

    };
    $scope.menuUp = function (e) {
        $(".statusBody").slideToggle("slow", function () {
            // Animation complete.
        })

        $('#menuUp i').toggleClass("fa-chevron-down fa-chevron-up")
        e.preventDefault();
    };


    $('#NewCustomerCreate').click(function () {
        $('#NewCustomerCreateModal').modal('show');
        $scope.getAccountMaster();
        $scope.getGroupMaster();
    });

    $scope.add = function (type, value) {
        $('#formaccount').modal('show');
        $scope.myValue = null;
        $scope.getSupplier();


    }


    //get suppliers coun
   
    $scope.GRNDetail = function (data) {
        $('#GRNDetailDiv').slideDown();
        $scope.EnqNo = data;
       
    }




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

        var ps = [];
        var start;
        start = $scope.currentPage;
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

    $scope.prevPage = function () {

        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.setPage($scope.currentPage--);
        }
    };
    $scope.prevPage1 = function () {

        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.setPage1($scope.currentPage--);
        }
    };

    $scope.DisablePrevPage = function () {

        return $scope.currentPage === 0 ? "disabled" : "";

    };


    $scope.pageCount = function () {
        return Math.ceil($scope.TotalCount / $scope.itemsPerPage) - 1;
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

    $scope.nextPage1 = function () {
        console.log($scope.currentPage)
        if ($scope.currentPage == 0) {
            $scope.currentPage++
            $scope.setPage1($scope.currentPage);
        }
        else {
            $scope.currentPage++
            $scope.setPage($scope.currentPage);
        }
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
        var empUrl = config.api + $scope.url2 + "&filter[where][compCode]=" + localStorage.CompanyId +"&filter[limit]=" + DispLength + "&filter[skip]=" + Skip;
        $http.get(empUrl).then(function (response) {
            $scope.InventoryList = response.data;
            console.log(response);
            for (var i = 0; i < $scope.InventoryList.length; i++) {
                $scope.InventoryList[i].supliersId = localStorage[$scope.InventoryList[i].supliersId];

            }

            $(".loader").hide()
            if (response.data.length > 0) {
               
                var compFilter = "&where[compCode]=" + localStorage.CompanyId
                var url = config.api + $scope.globalUrl + compFilter;
                $http.get(url).then(function (response) {
                    $scope.TotalCount = response.data.count;
                });
            }
            else {
                $scope.TotalCount = 0;
            }
            $scope.range();
        });
    }

    ///////////// for supplier

    $scope.setPage1 = function (n) {
        $scope.currentPage = n;
        $scope.EndPageNo = $scope.itemsPerPage * ($scope.currentPage);
        $scope.startPageNo = $scope.EndPageNo - ($scope.itemsPerPage - 1);
        var DispLength;
        Skip = $scope.EndPageNo;
        DispLength = $scope.itemsPerPage;
        var empUrl = config.api + $scope.url2 + "?filter[where][compCode]=" + localStorage.CompanyId +"&filter[limit]=" + DispLength + "&filter[skip]=" + Skip;
        $http.get(empUrl).then(function (response) {
            $scope.InventoryList = response.data;
            $(".loader").hide()
            if (response.data.length > 0) {
                var compFilter = "&where[compCode]=" + localStorage.CompanyId
                var url = config.api + $scope.globalUrl + compFilter;
               
                $http.get(url).then(function (response) {
                    $scope.TotalCount = response.data.count;
                });
            }
            else {
                $scope.TotalCount = 0;
            }
            $scope.range();
        });
    }



    $('#OpenBill').show();
    $('#example').hide();
    $('#PurchaseOrderTable').hide();
    $scope.OpenBillTable('OPEN');
    $('#PaidBillTable').hide();
    $('#EnquiryTable').hide();
    $scope.addInventrybtn = function (data) {

        $scope.inventorylist = data
        $scope.billtable1 = data.itemDetail
        $scope.billNo1 = data.no
        $scope.supplier1 = data.supliersName
        $scope.billDate1 = data.date
        $('#addInventryModal').modal('show');
    }
    if ($rootScope.$previousState.controller == "SupplierCntrl") {

        $('#OpenBill').show();
        $('#example').hide();
        $('#PurchaseOrderTable').hide();
        $scope.OpenBillTable('OPEN');
        $('#PaidBillTable').hide();
        $('#EnquiryTable').hide();
    }
    if ($rootScope.$previousState.controller == "ExpenseCntrl") {
       
        $scope.InventoryList = [];
        $(".sk-wave").show()
        $scope.ExpenseTable();
        $('#PurchaseOrderTable').show();
        $('#example').hide();
        $scope.InventoryList = [];
        $('#OpenBill').hide();
        $('#PaidBillTable').hide();
        $('#EnquiryTable').hide();
    }

    if (localStorage["type1"] == "ENQUIRY") {
        $scope.EnquiryTablebtn('OPEN');
        $('#example').hide();
        $('#PurchaseOrderTable').hide();
        $('#OpenBill').hide();
        $('#PaidBillTable').hide();
        $('#EnquiryTable').show();
    }


    if ($rootScope.$previousState.controller == "BillCntrl") {
        $('#OpenBill').show();
        $('#example').hide();
        $('#PurchaseOrderTable').hide();
        $scope.OpenBillTable('OPEN');
        $('#PaidBillTable').hide();
        $('#EnquiryTable').hide();
    }

    if ($rootScope.$previousState.controller == "PaymentCntrl") {
        $scope.OpenBillTable('OPEN');
        $('#example').hide();
        $('#PurchaseOrderTable').hide();
        $('#OpenBill').show();
        $('#PaidBillTable').hide();
        $('#EnquiryTable').hide();
    }


    // Exel upload

    //get account Data

    $scope.groupMasters = {};
    $scope.getAccountMaster = function () {
        $http.get(config.api + "accounts" + "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
            $scope.parentAccount = response.data;

        });
    }
    // get groupMaster Data 

        $scope.getGroupMaster = function () {
            $http.get(config.api + "groupMasters").then(function (response) {
                $scope.groupMaster = response.data;
            });
        }

    //delete voucher
        $scope.deleteVoucherModal = function (id) {
            $scope.voId = id
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this Invoice !",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete",
                cancelButtonText: "Cancel",
                closeOnConfirm: false,
                closeOnCancel: true
            },
               function (isConfirm) {
                   if (isConfirm) {
                       $scope.deleteVoucher();
                      
              } 
});
        }
        $scope.deleteVoucher = function () {
            $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
            $http.get(config.login + "deleteVoucher/" + $scope.voId).then(function (response) {
                console.log(response);
                if (response.data == "Voucher Deleted") {
                    $rootScope.$broadcast('event:success', { message: "Invoice Deleted Succesfully" });
                    $state.reload();
                }
                else {
                    $rootScope.$broadcast('event:error', { message: response.data });
                }
                return response.data
            });
        }
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

                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                    for (key in XL_row_object) {
                        var retObj = {};

                        for (var obj in XL_row_object[key]) {

                            var obj1 = obj.replace(" ", "");


                            retObj[obj1] = XL_row_object[key][obj];


                            var Keyobj = [];
                            var KeyName = obj;

                            KeyName1 = KeyName.replace(" ", "");


                            Keyobj[KeyName1] = KeyName1;


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

    $('.btnhover button').click(function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active');
    });

    $('.filenameDiv').hide();
    $('.attechmentDescription').hide();
    $('.Attechmentdetail').click(function () {
        $('.filenameDiv').show();
        $("#name").append($("#NameInput").val());
        $("#type").append($("#uploadBtn").val());

    });

    $('#removeattachment').click(function () {
        $('.filenameDiv').hide();
    });

    $(":file").filestyle({ buttonName: "btn-sm btn-info" });

}]);
