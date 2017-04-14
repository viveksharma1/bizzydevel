

var Id = "";
var recalledBlocked = "";
var TotalCount = "";
var Skip;



myApp.controller('SupplierCntrl', ['$scope', '$http', '$timeout', '$stateParams','$rootScope', 'myService', '$state', 'config', '$location', 'DTOptionsBuilder', 'DTDefaultOptions', function ($scope, $http, $timeout,$stateParams, $rootScope, myService, $state, config, $location, DTOptionsBuilder, DTDefaultOptions) {
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
        $http.get(config.api + "transactions" + "?filter[where][ordertype]=ENQUIRY" + "&filter[where][no]=" + $scope.enq).then(function (response) {
            $scope.supplierList = response.data[0].sentSupplier;

            console.log($scope.supplierList)


        });
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

    $scope.paginationTable = function (url2, globalUrl) {
        $scope.url2 = url2;
        $scope.globalUrl = globalUrl;

        $http.get(config.api + $scope.url2 + "&filter[where][compCode]=" + localStorage.CompanyId + "&filter[limit]=10&filter[skip]=0").then(function (response) {
            $scope.InventoryList = response.data;
            console.log(response);
            for (var i = 0; i < $scope.InventoryList.length; i++) {
                $scope.InventoryList[i].supliersId = localStorage[$scope.InventoryList[i].supliersId];

            }
           
            console.log($scope.InventoryList)
            $(".loader").hide()


        });
        var compFilter = "&where[compCode]=" + localStorage.CompanyId
        var url = config.api + $scope.globalUrl + compFilter;

        $http.get(url).then(function (response) {
            $scope.TotalCount = response.data.count;
        });



        //-----------------------Pagination start for Employee List




    }

    //suppliers peginations

    $scope.pagination1 = function (url2, globalUrl) {
        $scope.url2 = url2;
        $scope.globalUrl = globalUrl;
        $http.get(config.api + $scope.url2 + "?filter[where][compCode]=" + localStorage.CompanyId + "&filter[limit]=10&filter[skip]=0").then(function (response) {
            $scope.InventoryList = response.data;
            $(".loader").hide()
        });
        var compFilter = "&where[compCode]=" + localStorage.CompanyId
        var url = config.api + $scope.globalUrl + compFilter;
       
        $http.get(url).then(function (response) {
            $scope.TotalCount = response.data.count;
        });
    }

    //pagination for suppliers




    //order table


    $scope.order = function (data) {

        $scope.orderData = data;



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



    $scope.OpenBillTable = function (status) {

        $(".loader").show()
        $scope.InventoryList = [];
        $scope.newStatus = "&filter[where][status]=" + status;
        $scope.newStatus1 = "&[where][status]=" + status;

        $scope.url2 = "transactions?filter[where][ordertype]=BILL" + $scope.newStatus
        $scope.globalUrl = "transactions/count?where[ordertype]=BILL" + $scope.newStatus1;
        $scope.paginationTable($scope.url2, $scope.globalUrl)



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

        $scope.url2 = "transactions?filter[where][ordertype]=ENQUIRY"  +$scope.newStatus
        $scope.globalUrl = "transactions/count?where[ordertype]=ENQUIRY" + $scope.newStatus1;

        $scope.paginationTable($scope.url2, $scope.globalUrl)
       
        

        $('#PaidBillTable').hide();
        $('#OpenBill').hide();
        $('#PurchaseOrderTable').hide();
        $('#EnquiryTable').show();
        $('#example').hide();


    }


  
    $scope.PurchaseOrderTable = function (status) {
        
        $scope.newStatus = "&filter[where][status]=" + status;
        $scope.newStatus1 = "&[where][status]=" + status;
        $scope.InventoryList = [];
        $(".loader").show()
        $scope.url2 = "transactions?filter[where][ordertype]=PO" + $scope.newStatus
        $scope.globalUrl = "transactions/count?where[ordertype]=PO" + $scope.newStatus1;

        $scope.paginationTable($scope.url2, $scope.globalUrl);







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


    //get suppliers count

    $scope.getSupplier = function () {
        $http.get(config.login + "getSupplierAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.InventoryList = response.data

        });
    }
  
    $http.get(config.login + "getSupplierCount/" + localStorage.CompanyId).then(function (response) {
        $scope.suppliersCount = response.data.count;
        console.log(response.data);
    });

    //get bill count
    $http.get(config.api + "transactions" + "/count" +  "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
        $scope.billCount = response.data;
    });

    // Get enquiry count

    $http.get(config.api + "transactions" + "/count" + "?where[ordertype]=" + "ENQUIRY" + "&[where][status]=" + "OPEN" + "&where[compCode]=" + localStorage.CompanyId).then(function (response) {

        $scope.enquiryCount = response.data;
    });

    //get purchase order count 

    $http.get(config.api + "transactions" + "/count" + "?where[ordertype]=" + "PO" + "&[where][status]=" + "OPEN" + "&where[compCode]=" + localStorage.CompanyId).then(function (response) {

        $scope.purchaseCount = response.data;
    });

    //get supplier

    $http.get(config.api + "suppliers").then(function (response) {

        // $scope.suppliers = [];
        $scope.suppliers = response.data;

    });

    //get PO
    $http.get(config.api + "transactions" + "?filter[where][ordertype]=PO" + "&where[compCode]=" + localStorage.CompanyId).then(function (response) {

        // $scope.purchaseOrder = [];
        $scope.purchaseOrder = response.data;


    });

    //get bill

    $http.get(config.api + "transactions" + "?filter[where][ordertype]=" + "BILL" + "&where[compCode]=" + localStorage.CompanyId).then(function (response) {
        // $scope.enquiries = [];

        $scope.bill = response.data;


    });

    //get enquiry

    $http.get(config.api + "transactions" + "?filter[where][ordertype]=" + "ENQUIRY" + "&filter[where][status]=" + "OPEN" + "&where[compCode]=" + localStorage.CompanyId).then(function (response) {

        // $scope.enquiries = response.data;

    });

    $scope.viewPo = function (data) {
        $location.path('#/Customer/PdfView' + data);
    }




    //PDF VIEW


    $scope.GRNDetail = function (data) {
        $('#GRNDetailDiv').slideDown();
        $scope.EnqNo = data;
        $http.get(config.api + "transactions" + "?filter[where][no]=" + $scope.EnqNo).then(function (response) {
            $scope.itemDetail = response.data[0].itemDetail;
            $scope.suppliersName = response.data[0].supliersName;
            $scope.date = response.data[0].date;
            $scope.no = response.data[0].no;
        });
    }


    $scope.poView = function (data) {
        $('#poView').slideDown();
        $scope.poNo = data
        var data = {
            no: $scope.poNo
        };

        $http.post(config.api + "transactions" + "/getPo", data, { headers: { 'tokan': localStorage['token'] } }).then(function (response) {

            $scope.data = response.data.code
            $scope.suppliersName = $scope.data.supliersName;
            $scope.email = $scope.data.email;
            $scope.date = $scope.data.date;
            $scope.billDueDate = $scope.data.billDueDate;
            $scope.no = $scope.data.no;
            $scope.amount = $scope.data.amount;

            $scope.adminAmount = $scope.data.adminAmount;
            $scope.itemDetail = [];
            $scope.itemDetail = $scope.data.itemDetail;
            $scope.exchangeRate = $scope.data.exchangeRate;

            var total = 0
            $scope.fobtotal = 0;
            $scope.ciftotal = 0;
            for (var i = 0; i < $scope.itemDetail.length; i++) {
                var product = Number($scope.itemDetail[i]);
                total += Number($scope.itemDetail[i].netweight);
                $scope.fobtotal += Number($scope.itemDetail[i].fob);
                $scope.ciftotal += Number($scope.itemDetail[i].cif);
            }
            $scope.totalweight = total;
        })

        $http.get(config.api + "suppliers" + "?filter[where][company]=" + $scope.suppliersName).then(function (response) {


            $scope.suppliersAdd = response.data;
            $scope.suppliersdata1 = $scope.suppliersAdd[0].billingAddress[0].street
            $scope.taxRegNo = $scope.suppliersAdd[0].taxInfo[0].taxRegNo
        });
    }



    //bill view


    $scope.billView = function (data) {
        $('#billView').slideDown();
        $scope.poNo = data
        var data = {
            no: $scope.poNo
        };

        $http.post(config.api + "transactions" + "/getPo", data, { headers: { 'tokan': localStorage['token'] } }).then(function (response) {

            $scope.data = response.data.code
            $scope.suppliersName = $scope.data.supliersName;
            $scope.email = $scope.data.email;
            $scope.date = $scope.data.date;
            $scope.billDueDate = $scope.data.billDueDate;
            $scope.no = $scope.data.no;
            $scope.amount = $scope.data.amount;

            $scope.adminAmount = $scope.data.amount;
            $scope.itemDetail = [];
            $scope.itemDetail = $scope.data.itemDetail;
            $scope.exchangeRate = $scope.data.exchangeRate;

            var total = 0
            $scope.fobtotal = 0;
            $scope.ciftotal = 0;
            for (var i = 0; i < $scope.itemDetail.length; i++) {
                var product = Number($scope.itemDetail[i]);
                total += Number($scope.itemDetail[i].netweight);
                $scope.fobtotal += Number($scope.itemDetail[i].fob);
                $scope.ciftotal += Number($scope.itemDetail[i].cif);
            }
            $scope.totalweight = total;
        })

        $http.get(config.api + "suppliers" + "?filter[where][company]=" + $scope.suppliersName).then(function (response) {


            $scope.suppliersAdd = response.data;
            $scope.suppliersdata1 = $scope.suppliersAdd[0].billingAddress[0].street
            $scope.taxRegNo = $scope.suppliersAdd[0].taxInfo[0].taxRegNo
        });
    }

    // HTML to PDF file by Harpal Singh
    $scope.generatePDF = function () {
        kendo.drawing.drawDOM($("#upperdivId")).then(function (group) {
            kendo.drawing.pdf.saveAs(group, "Converted PDF.pdf");
        });
    }

    //get total PO Amount

    $http.post(config.api + "transactions" + "/totalpoAmount", { headers: { 'tokan': localStorage['token'] } }).then(function (response) {
        $scope.totalpoAmount = response.data;
    });






    //get suppliers data 

    $http.get(config.api + "suppliers").then(function (response) {
        $(".sk-wave").hide()
        // $scope.suppliers = [];
        $scope.suppliers = response.data;

    });
    $scope.createAccount = function () {
        var accountData = {
            compCode: localStorage.CompanyId,
            accountName: $scope.company.toUpperCase(),
            Under: $scope.groupMasters.selected.name,
            type: $scope.groupMasters.selected.type,
            balance: $scope.balance,
            credit: 0,
            debit: 0,        
            openingBalance: $scope.openingBalance,
            balanceType: $scope.groupMasters.selected.balanceType
        }

        $http.post(config.login + "createAccount", accountData).then(function (response) {
        });
    }


    //create New Suppliers

    $scope.createNewSupplier = function () {
        
        var data = {
            compCode:localStorage.CompanyId,
            email: $scope.email,
            company: $scope.company.toUpperCase(),
            phone: $scope.phone,
            mobile: $scope.mobile,
           
            openingBalance: $scope.openingBalance,
           
          
            billingAddress: [
              {
                  street: $scope.street,
                  city: $scope.city,
                  state: $scope.state,
                  postalCode: $scope.postalCode,
                  country: $scope.country
              }
            ],
            shippingAddress: [
              {

                  street: $scope.street1,
                  city: $scope.city1,
                  state: $scope.state1,
                  postalCode: $scope.postalCode1,
                  country: $scope.country1
              }
            ],
            taxInfo: [
              {
                  taxRegNo: $scope.taxRegNo,
                  cstRegNo: $scope.cstRegNo,
                  panNo: $scope.panNo,
                  range: $scope.Range,
                  division: $scope.division,
                  address: $scope.address,
                  commisionerate: $scope.commisionerate,
                  ceRegionNo: $scope.ceRegionNo,
                  eccCodeNo: $scope.eccCodeNo,
                  iecNo: $scope.iecNo,


              }
            ],
            
            notes: $scope.notes,
            compCode: localStorage.CompanyId,
            account: {
                group: $scope.groupMasters.selected.name,

            }
            
            


        }
       
       
        if (!data.company == '') {        
            $http.post(config.login + "createSupplier", data).then(function (response) {
                if (response.status == "200") {
                    showSuccessToast("Supplier Save Succesfully");
                    $scope.createAccount();
                    $scope.email = null,
           $scope.company = null,
           $scope.phone = null,
           $scope.mobile = null,
           $scope.fax = null,


                 $scope.street = null,
                 $scope.city = null,
                 $scope.state = null,
                 $scope.postalCode = null,


                 $scope.street1 = null,
                 $scope.city1 = null,
                 $scope.state1 = null,
                 $scope.postalCode1 = null,


                 $scope.taxRegNo = null,
                 $scope.cstReg = null,
                 $scope.panNo = null,



                 $scope.paymentMethod = null,
                 $scope.terme = null,
                 $scope.deliveryMethod = null,
                 $scope.openingBalance = null,
                 $scope.asOf = null,
                 $scope.notes = null

                }
            });
           
        } else {

            showWarningToast("Please Fill Required Field");
        }



    };

    // Pagination

    // var url = config.api + globalUrl + "&filter[limit]=10&filter[skip]=0";



    //pagination starts here

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



    $scope.addInventrybtn = function (data) {

        $scope.inventorylist = data
        $scope.billtable1 = data.itemDetail
        $scope.billNo1 = data.no
        $scope.supplier1 = data.supliersName
        $scope.billDate1 = data.date
        $('#addInventryModal').modal('show');
    }


    $scope.addEnventory = function () {
        var data = {
            Inventory: $scope.billtable1,
            inventoryNo: $scope.billNo1,
            supliersName: $scope.supplier1,
            date: $scope.billDate1
        }
        $http.post(config.api + "Inventories", data).then(function (response) {
        })
    }
    //geting sent supplier count



    if (localStorage["type1"] == "PO") {
       
        $scope.InventoryList = [];
        $(".sk-wave").show()
        $scope.PurchaseOrderTable('OPEN');
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


    if (localStorage["type1"] == "BILL") {
        $('#OpenBill').show();
        $('#example').hide();
        $('#PurchaseOrderTable').hide();
        $scope.OpenBillTable('OPEN');
        $('#PaidBillTable').hide();
        $('#EnquiryTable').hide();
    }

    if (localStorage["type1"] == "PAYMENT") {
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
