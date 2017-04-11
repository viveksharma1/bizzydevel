myApp.controller('BillCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {

    $scope.manualTotal = 0;
    $scope.CIFTOTAL1 = 0;
    $scope.role = localStorage["userrole"];
    $(document).ready(function () {

        /*! Fades in page on load */
        $('body').css('display', 'none');
        $('body').fadeIn(700);

    });
    $.fn.datepicker.defaults.format = "dd/mm/yyyy";

    //$("tr").click(function () {
    //   $(this).addClass("selected").siblings().removeClass("selected");
    //});

   
    localStorage["type1"] = "BILL"

    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        window.history.back();
    },
     $scope.popuclose = function () {
         $('#form-popoverPopup').hide();
     }

    $(document).on("click", "#upload_prev span", function () {
        res.splice($(this).index(), 1);
        $(this).remove();


    });
    $('#AddCategoryBox').hide();
    $scope.AddCategory = function () {
        $('#AddCategoryBox').show();
    },

    $scope.popuclose = function () {
        $('#AddCategoryBox').hide();
    }

    $('.ProductInformationBox').hide();

    $scope.productInformationbtn = function () {
        $('.ProductInformationBox').show();
        $('.ProductFormDiv').hide();
        $('.productList').show();
        $('.productfooter').hide();
    },

    $scope.ProductFormbtn = function () {
        $('.ProductFormDiv').show();
        $('.productList').hide();
        $('.productfooter').show();
    },

    $scope.Backproductlist = function () {
        $('.ProductFormDiv').hide();
        $('.productList').show();
        $('.productfooter').hide();
    },

    $scope.closeproductInfo = function () {
        $('.ProductInformationBox').hide();

    },
    $scope.totalExpense = function () {
        $('#totalExpense').modal('show');
        $http.get(config.api + "transactions" + "?filter[where][ordertype]=EXPENSE" + "&filter[where][refNo]=" + $scope.billNo).then(function (response) {
            $scope.supplierList = response.data

            console.log($scope.supplierList)

            var total = 0;

            for (var i = 0; i < $scope.supplierList.length; i++) {
                if ($scope.supplierList[i].amount) {
                    total += Number($scope.supplierList[i].amount);
                }
            }
            $scope.totalExpense1 = total;
            console.log($scope.totalExpense1);
        });

    };

    $scope.currencyRate = function () {
        $('#currencyRate').modal('show');


    };
    if (localStorage["userrole"] == '3') {

        $('#fileUpload1').show();
        $('#ItemDetail23').hide();
        $('#ItemDetail2').show();
        $('#ItemDetail3').hide();
        $('#fileUpload').show();
    }
    if (localStorage["userrole"] == '2') {
        $('#ItemDetail3').show();
        $('#fileUpload').hide();
        $('#fileUpload1').hide();
        $('#ItemDetail2').hide();
        $('#ItemDetail23').show();
    }
    $scope.addInventrybtn = function () {
        $('#addInventryModal').modal('show');
    },

   
    $('#asofdate').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    });

    $('.parentaccount > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")


    });

    $('.Incomeaccount > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")


    });

    $('.Expenseaccount > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")


    });


    $scope.addInventry = function () {
        $('#addInventryModal7').modal('show');
    }

    
   
    $scope.paymentTerm = function () {  
        $scope.billDueDate = moment($scope.billDate, "DD/MM/YYYY").add($scope.paymentDays, 'days').format('DD/MM/YYYY');
    }
    
    
    
    $('#billDueDate').datepicker();
    $('#billDate').datepicker();
    $('#customPayementDate').datepicker();
    $('#actualDate').datepicker();
    
   

       
   
   
   
    var files, res;

    document.getElementById("uploadBtn").onchange = function (e) {
        e.preventDefault();

    };
    document.getElementById('uploadBtn').onchange = uploadOnChange;

    // get group data


    $http.get(config.api + "accounts").then(function (response) {
        $scope.purchaseAccount = response.data;

    });
    $scope.purchaseAccounts = {};
    // Bill No validation 
    $("#billNo").focusout(function () {

        $("#EmpCodeDone1").hide();
        $("#EmpCodeFail1").hide();
        $("#EmpCodeLoad1").show();


        var billNo = $scope.billNo;

        if (billNo != undefined) {

            $http.get(config.api + "transactions" + "/count" + "?where[no]=" + $scope.billNo).then(function (response) {
                $timeout(function () {
                    var data = response.data;
                    if (response.data.count > 0) {
                        $("#EmpCodeLoad1").hide();
                        $("#EmpCodeDone1").hide();
                        $("#EmpCodeFail1").show();
                        $('#InvoicePopup').modal('show');
                    }
                    else {
                        $("#EmpCodeLoad1").hide();
                        $("#EmpCodeFail1").hide();
                        $("#EmpCodeDone1").show();
                    }
                });
            });
        }
        else {
            $("#EmpCodeLoad1").hide();
            $("#EmpCodeDone1").hide();
            $("#EmpCodeFail1").show();
        }
    })

    // get weight unit
    $scope.unit = "KG";
    $scope.weightUnit = function (data) {



    }

    var access_key = 'af072eeb3d8671688ff6eaa83c8dbcb8';
    var url = 'http://apilayer.net/api/live?access_key=' + access_key;
    $http.get(url).then(function (response) {
        $scope.data = response.data;
       
        $scope.ExchangeRate = response.data.quotes.USDINR.toFixed(2);
        $scope.ExchangeRateINR = $scope.ExchangeRate
        $scope.ExchangeRateIDR = $scope.ExchangeRate1
    });

    //total sum
    $scope.billtable1 = [];
    $scope.currency1 = function (currency) {
        if (currency == "Rupee") {
            $scope.subtotalnew = $scope.ExchangeRateINR * $scope.subtotalnew1;
            $scope.subtotal = $filter('currency')($scope.subtotalnew, '₹', 2);
        }
        if (currency == "Dollar") {
            $scope.subtotalnew = Math.round($scope.subtotalnew1);
            $scope.subtotal = $filter('currency')($scope.subtotalnew, '$', 2)
        }
    }
    $scope.invoiceType1 = function (invoiceType) {

        
        $scope.invoiceType = invoiceType;
        console.log($scope.invoiceType)
        if (invoiceType == 'Domestic') {
          
            $("#rupee").addClass('active')
            $("#dollar").removeClass('active')
            $("#custom").hide();
            $("#curr").hide();
        }
       else {
            $("#dollar").addClass('active')
            $("#dollar").addClass('active')
            $("#rupee").removeClass('active')
            
            $("#import").addClass('active')
            $("#custom").show()
            $("#curr").show()
        }

    }

    $scope.accountTableSum = function () {
        var amount = 0;  
        for (var i = 0; i < $scope.accountTable.length; i++) {
            amount += Number($scope.accountTable[i].amount);          
        }
        $scope.totalAccountAmount = Number(amount);      
    }

    $scope.excelTableItemSum = function () {
        var total = 0;
        var totalweight = 0;
        for (var i = 0; i < $scope.billtable1.length; i++) {
            var product = Number($scope.billtable1[i]);
            total += Number($scope.billtable1[i].TOTALAMOUNTUSD);
            totalweight += Number($scope.billtable1[i].NETWEIGHT);
        }
        $scope.totalWeight = Number(totalweight);
        console.log($scope.totalWeight);
        $scope.TOTALAMOUNTUSD = Math.round(total);
        $scope.totalAmountINR = Number($scope.TOTALAMOUNTUSD) * Number($scope.ExchangeRateINR);
        console.log($scope.TOTALAMOUNTUSD)

    }


    $scope.manualTableSum = function () {
        var manualTotal = 0;
        var netweight = 0;
        var totalAmountINR = 0;
        for (var i = 0; i < $scope.billtable.length; i++) {
            manualTotal += Number($scope.billtable[i].TOTALAMOUNT);
            netweight += Number($scope.billtable[i].NETWEIGHT);
            totalAmountINR += Number($scope.billtable[i].AMOUNTINR);
        }
        $scope.totalAmountINR = Number(totalAmountINR);
        $scope.manualTotal = Number(manualTotal);
        $scope.netweight = Number(netweight);
    }
    //total sum

    $scope.excelLineItem1 = function () {
        var CIFTOTAL = 0;
        var FOBTOTAL = 0;
        for (var i = 0; i < $scope.billtable1.length; i++) {
            var product = Number($scope.billtable1[i]);
            CIFTOTAL += Number($scope.billtable1[i].CIFTOTALAMOUNT);
            FOBTOTAL += Number($scope.billtable1[i].FOBTALAMOUNT);

        }
        $scope.CIFTOTAL1 = Math.round(CIFTOTAL);
        $scope.FOBTOTAL2 = Math.round(FOBTOTAL);
        console.log($scope.FOBTOTAL2)

    }

    //curency



    $scope.billtable = [];

    $scope.addrow = function () {
        $scope.billtable.push(
             {
                 GODOWN: '',
                 DESCRIPTION: '',
                 RRMARKS: '',
                 NETWEIGHT: '',
                 BASERATE: '',
                 TOTALAMOUNT: '',
                 assesableValue: '',
                 exciseDuty: '',
                 dutyAmount: '',
                 SAD: '',
                 totalDutyAmt: ''

             }
       );
        $scope.manualTableSum();
    };

    $scope.accountTable = [];
    //push new row in account table



    //account table
    $scope.editAccountTable = function (data, index) {
        $scope.idSelectedVote = index;
        $scope.index = index;
        $scope.edit1 = true;
        $scope.accounts = { selected: { accountName: data.accountName } };
       
        $scope.accountAmount = data.amount

    }

    $scope.accounts = {}
    

    $scope.applyRate = function (rate) {
        if (rate) {
            $scope.accountAmount = null;
            $scope.accountAmount = (Number($scope.totalAmountINR) * Number(rate) / 100).toFixed(2);
           
        }
        else
            $scope.accountAmount = '';
    }
 
    $scope.accountTable = [];
    $scope.addAccount = function () {
       
        var accountData = {
            accountName: $scope.accounts.selected.accountName,
            accountId: $scope.accounts.selected.id,
            description: $scope.accountDescription,
            amount: $scope.accountAmount
        }

        if ($scope.edit1 == true) {
            $scope.accountTable[$scope.index] = accountData;
        } else {
            $scope.accountTable.push(accountData);
        }
        $scope.edit1 = false;
        $scope.accountAmount = null;
        $scope.accountTableSum();
    }


    $scope.refreshAccountTable = function ($select) {
        var search = $select.search,
          list = angular.copy($select.items),
          FLAG = -1;
        list = list.filter(function (item) {
            return item.id !== FLAG;
        });
        if (!search) {
            //use the predefined list
            $select.items = list;
        }
        else {
            //manually add user input and set selection
            var userInputItem = {
                id: FLAG,
                name: search
            };
            $select.items = [userInputItem].concat(list);
            // $scope.account.push({ accountName: $scope.accounts.selected.accountName });

        }
    }


    $scope.addtoBill = function (index) {
        $scope.billtable = $scope.polist[index].itemDetail;
        $scope.manualTableSum();
    }

    $scope.clearTable = function (index) {
        $scope.billtable = [];
    }
    $scope.remove = function (index) {
        $scope.billtable.splice(index, 1);
        $scope.manualTableSum();
    }
    
    $scope.remove1 = function (index) {
        $scope.accountTable1.splice(index, 1);
        //$scope.manualTableSum();
    }

    $scope.removeAccountTable = function (index) {
        $scope.accountTable.splice(index, 1);
        $scope.accountTableSum();
    }

    //file upload
    var doc = new jsPDF();
    function uploadOnChange() {
        var filename = this.value;
        var lastIndex = filename.lastIndexOf("\\");
        if (lastIndex >= 0) {
            filename = filename.substring(lastIndex + 1);
        }
        files = $('#uploadBtn')[0].files;
        res = Array.prototype.slice.call(files);
        for (var i = 0; i < files.length; i++) {
            $("#upload_prev").append("<span>" + files[i].name + "&nbsp;&nbsp;<b>X</b></span>");
        }
        var files = $(this).get(0).files;
        if (files.length > 0) {

            var formData = new FormData();

            // loop through all the selected files and add them to the formData object
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // add the files to formData object for the data payload
                formData.append('uploads[]', file, $scope.billNo + file.name + ".pdf");
            }

            $.ajax({
                url: config.login + 'upload?no=' + $scope.billNo,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log('upload successful!\n' + data);
                }
            });
            $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.billNo).then(function (response) {
                $scope.data = response.data;
                $scope.datapath = $scope.data[0].path;
            });
        }
    };


    // get file path 


    $scope.getfile = function (data) {
        $scope.filepath = data
        $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.billNo).then(function (response) {
            $scope.data = response.data;
            $scope.path = $scope.data[0].path;
            $http.get(config.login + 'getfile?path=' + $scope.filepath, { responseType: 'arraybuffer' }).then(function (response) {
                $scope.file = response.data;
                var file = new Blob([$scope.file], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            });
        });
    }

    // delete file

    $scope.deletefile = function (data, index) {
        $scope.datapath.splice(index, 1)
        $http.get(config.login + 'delete?path=' + data + '&no=' + $scope.billNo).then(function (response) {
        });


    }


    $scope.no = $stateParams.billNo
    $scope.role;
    $scope.admin = localStorage['adminrole'];
    $scope.supplier = {};

    console.log($scope.supplier);



    // po count 
    $scope.datapath = [];
    /*
    $http.get(config.api + "transactions" + "/count" + "?where[ordertype]=" + "BILL").then(function (response) {
        $scope.poCount = response.data.count;
        $scope.billNo = 'BIll' + $scope.poCount;
        $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.billNo).then(function (response) {
            if (response.data.length > 0) {
                $scope.datapath = response.data[0].path;
                
            }
        });
    });
    */
    $('#paymentStatus').hide();
    //get suppliers 

    $scope.getSupplier = function () {
        $http.get(config.login + "getSupplierAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.supliers = response.data
            
        });
    }
    //$scope.getSupplier = function () {
    //    $scope.supliers = []
    //    $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
    //        $scope.supliers = response.data;
    //    });
    //}
    $scope.getSupplierDetail = function (supplierName) {
        $scope.supliersDetail = []
        $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId + "&filter[where][company]=" + supplierName).then(function (response) {
            $scope.supliersDetail = response.data;
            console.log(response.data)
            $scope.shippingAddress = $scope.supliersDetail[0].billingAddress[0].street;
            $scope.email = $scope.supliersDetail[0].email;
        });
    }
    
    //get Bill data
    $scope.supplier = {};
    $scope.getSupplier();
    $scope.getBilldata = function (billNo, fields) {       
        $scope.field = fields       
        $http.get(config.api + 'transactions/' + billNo + $scope.field)
                    .then(function (response) {
                        console.log(response);                        
                        $scope.customPaymentInfo = response.datacustomPaymentInfo;
                        if (response.data.itemDetail) {
                            $scope.billtable1 = response.data.itemDetail;
                            $scope.excelTableItemSum();                         
                            $scope.id = response.data.id   
                            $scope.totalAmountINR = response.data.adminAmount
                        }
                        if (response.data.manualLineItem) {
                            $scope.billtable = response.data.manualLineItem;
                            $scope.manualTableSum();                         
                            $scope.id = response.data.id
                            console.log($scope.id);
                            $scope.billData = response.data
                        }
                        if (!response.data.balance) {
                            $('#paymentStatus').show();
                        }

                        if (response.data.accountlineItem) {
                            $scope.accountTableSum();
                        }
                        $scope.paymentDays = response.data.paymentDays
                        $scope.paymentLog = response.data.paymentLog;
                        console.log($scope.paymentLog)
                        $scope.billNo = response.data.no
                        $scope.accountTable = response.data.accountlineItem;
                        $scope.ExchangeRateINR = response.data.ExchangeRate
                        $scope.email = response.data.email
                       

                        $scope.supplier = { selected: { accountName: localStorage[response.data.supliersId], id: response.data.supliersId} };
                        $scope.purchaseAccounts = { selected: { accountName: localStorage[response.data.purchaseAccountId], id: response.data.purchaseAccountId } };
                      
                        $scope.getSupplierDetail(localStorage[response.data.supliersId]);
                        $scope.invoiceType1(response.data.invoiceType);                      
                        $scope.billDate1 = response.data.date
                        $scope.billDate = $filter('date')($scope.billDate1, 'dd/MM/yyyy');
                        $scope.billDueDate1 = response.data.billDueDate
                        $scope.billDueDate = $filter('date')($scope.billDueDate1, 'dd/MM/yyyy');
                        $scope.actualDate = $filter('date')(response.data.actualDate, 'dd/MM/yyyy');
                        $scope.email = response.data.email
                       
                    });
    }

    if ($stateParams.billNo) {
        if (localStorage['usertype'] == '2') {
            $scope.getBilldata($stateParams.billNo, '?filter[fields][itemDetail]=false&filter[fields][adminAmount]=false&filter[fields][adminBalance]=false');
        }
        else
            $scope.getBilldata($stateParams.billNo, '?filter[fields][manualLineItem]=false');
    }

   
    $scope.getNewData = function (type, data) {

        console.log(data);
        if ($scope.newElement == true) {
            $scope.saveItem({ name: data, type: type });
            $scope.bindMasterData(type);
        }
    };

      $scope.saveCustom = function () {

          $scope.billtable[$scope.tableIndex].assesableValue = $scope.assesableValue;
          $scope.billtable[$scope.tableIndex].exciseDuty = $scope.exciseDuty1;
          $scope.billtable[$scope.tableIndex].dutyAmount = $scope.dutyAmount;
          $scope.billtable[$scope.tableIndex].SAD = $scope.SAD1;
          $scope.billtable[$scope.tableIndex].totalDutyAmt = $scope.totalDutyAmt;
          $scope.billtable[$scope.tableIndex].customData = $scope.customDatanew
          // $scope.billtable[$scope.tableIndex].customData = $scope.customDatanew;

          var data = {
              manualLineItem: $scope.billtable,
              billNo: $scope.billNo,
              totalDutyAmt1: $scope.totalDutyAmt13
          };
          
          $http.post(config.login + "saveCustom", data).then(function (response) {
              showSuccessToast("Custom Save Succesfully");

          });
      }
    
      
      $scope.dateFormat = function (date) {
          var res = date.split("/");
          console.log(res);
          var month = res[1];
          var days = res[0]
          var year = res[2]
          var date = month + '/' + days + '/' + year;
          return date;
      }
      $scope.saveBill = function (index) {   
        
          var date = $scope.dateFormat($scope.billDate);
          var billDueDate = $scope.dateFormat($scope.billDueDate);
          var actualDate = $scope.dateFormat($scope.actualDate);
          if ($scope.totalAccountAmount) {
              $scope.purchaseAmount = $scope.totalAmountINR.toFixed(2)
              $scope.totalAmountINR = $scope.totalAmountINR + $scope.totalAccountAmount;
          }
          else {
              $scope.purchaseAmount = $scope.totalAmountINR.toFixed(2)
          }

          
        if ($scope.assesableValue) {
            $scope.billtable[$scope.tableIndex].assesableValue = $scope.assesableValue;
            $scope.billtable[$scope.tableIndex].exciseDuty = $scope.exciseDuty1;
            $scope.billtable[$scope.tableIndex].dutyAmount = $scope.dutyAmount;
            $scope.billtable[$scope.tableIndex].SAD = $scope.SAD1;
            $scope.billtable[$scope.tableIndex].totalDutyAmt = $scope.totalDutyAmt;
            $scope.billtable[$scope.tableIndex].actualDate = $scope.actualDate;
            $scope.billtable[$scope.tableIndex].customData = $scope.customDatanew
            $scope.sumtotalcustomData();
        }
        if ($scope.exciseAssessableValue) {
            for (var i = 0; i < $scope.billtable.length; i++) {
                $scope.billtable[i].assesableValue = $scope.exciseAssessableValue * $scope.billtable[i].NETWEIGHT;
                $scope.billtable[i].exciseDuty = $scope.exciseDutyPerUnit * $scope.billtable[i].NETWEIGHT;
                $scope.billtable[i].dutyAmount = $scope.exciseRate * $scope.billtable[i].NETWEIGHT;
                $scope.billtable[i].SAD = $scope.exciseSAD * $scope.billtable[i].NETWEIGHT;
                $scope.billtable[i].actualDate = $scope.actualDate;
            }
        }
        var data = {
            compCode: localStorage.CompanyId,
            supliersId: $scope.supplier.selected.id,
            email: $scope.supplier.selected.email,
            role: localStorage['adminrole'],
            currency: $scope.currency,
            date: date,
            billDueDate: billDueDate,
            actualDate:actualDate,
            ordertype: "BILL",
            no: Number($scope.billNo),
            status: ["OPEN"],
            paymentDays:$scope.paymentDays,
            itemDetail: $scope.billtable1,
            manualLineItem: $scope.billtable,
            accountlineItem: $scope.accountTable,
            purchaseAccountId: $scope.purchaseAccounts.selected.id,
            adminAmount: $scope.totalAmountINR.toFixed(2),
            adminBalance: $scope.totalAmountINR.toFixed(2),
            purchaseAmount: $scope.purchaseAmount,
            amount: $scope.totalAmountINR.toFixed(2),
            balance: $scope.totalAmountINR.toFixed(2),
            totalWeight: $scope.totalWeight,
            ExchangeRate: $scope.ExchangeRateINR,
            supCode: $scope.supplier.selected.supCode,
            billId: $scope.id,
            invoiceType: $scope.invoiceType,
            customPaymentInfo :{
                   status:"pending",
                   amount: 0,
                   paymentDate:'',
                   bankAccount:'',
                   partyAccount:'',
                   voRefId:''
        }  

        }

        $http.post(config.login + "saveBill", data).then(function (response) {
            showSuccessToast("Bill Save Succesfully");
        });
        /*
                        var data = {
                            compCode: localStorage.CompanyId,
                            supCode: $scope.supplier.selected.supCode,
                            supliersName: $scope.supplier.selected.company,
                            accountName: $scope.supplier.selected.company,
                            email: $scope.supplier.selected.email,
                            date: $scope.billDate,
                            particular: 'Inventory',
                            no: $scope.billNo,
                            debit: 0,
                            credit: $scope.manualTotal.toFixed(2),
                            creditMsc: $scope.TOTALAMOUNTINR.toFixed(2),
                            debitMsc: 0,
                            value: $scope.TOTALAMOUNTINR.toFixed(2),
                            type: 'BILL',
                            lastModified: new Date(),
                            Inventory: {
                                supliersName: $scope.supplier.selected.company,
                                compCode: localStorage.CompanyId,
                                supCode: $scope.supplier.selected.supCode,
                                accountName: 'Inventory',
                                email: $scope.supplier.selected.email,
                                date: $scope.billDate,
                                particular: $scope.supplier.selected.company,
                                no: $scope.billNo,
                                debit: 0,
                                credit: $scope.manualTotal.toFixed(2),
                                creditMsc: $scope.TOTALAMOUNTINR.toFixed(2),
                                debitMsc: 0,
                                value: $scope.TOTALAMOUNTINR.toFixed(2),
                                type: 'Inventory',
                                lastModified: new Date()
                            }
                        }
                        $http.post(config.login + "admintTransactionEdit", data).then(function (response) {
        
                            var url = config.login + "createInventory";
                            var invData = {
                                billNo: $scope.billNo,
                                packingList: $scope.billtable1,
                                visible:false
        
                            }
                            $http.post(url, invData).success(function (response) {
                                console.log(response)
                               
                            });
                        });
        
                    });
                    */
        /*       } else {
                   $scope.excelLineItem();
                   var data = {
                       compCode: localStorage.CompanyId,
                       supliersName: $scope.supplier.selected.company,
                       email: $scope.supplier.selected.email,
                       role: localStorage['adminrole'],
                       currency: $scope.currency,
                       date: $scope.billDate,
                       billDueDate: $scope.billDueDate,
                       ordertype: "BILL",
                       no: $scope.billNo,
                       status: ["OPEN"],
                       itemDetail: $scope.billtable1,
                       manualLineItem: $scope.billtable,
                       accountlineItem: '',
                       adminAmount: $scope.CIFTOTAL1.toFixed(2),
                       AdminBalance: $scope.CIFTOTAL1.toFixed(2),
                       amount: $scope.manualTotal.toFixed(2),
                       balance: $scope.manualTotal.toFixed(2),
                       ExchangeRate: $scope.ExchangeRateINR,
                       supCode: $scope.supplier.selected.supCode
                   }
       
                   $http.post(config.api + "transactions", data).then(function (response) {
                       $('#addInventryModal1').modal('hide')
       
                       if (response.status == "200") {
                           var data = {
                               compCode: localStorage.CompanyId,
                               supCode: $scope.supplier.selected.supCode,
                               supliersName: $scope.supplier.selected.company,
                               accountName: $scope.supplier.selected.company,
                               email: $scope.supplier.selected.email,
                               date: $scope.billDate,
                               particular: 'Inventory',
                               no: $scope.billNo,
                               debit: 0,
                               credit: $scope.manualTotal.toFixed(2),
                               creditMsc: $scope.CIFTOTAL1.toFixed(2),
                               debitMsc: 0,
                               value: $scope.CIFTOTAL1.toFixed(2),
                               type: 'BILL',
                               lastModified: new Date(),
                               Inventory: {
                                   supliersName: $scope.supplier.selected.company,
                                   compCode: localStorage.CompanyId,
                                   supCode: $scope.supplier.selected.supCode,
                                   accountName: 'Inventory',
                                   email: $scope.supplier.selected.email,
                                   date: $scope.billDate,
                                   particular: $scope.supplier.selected.company,
                                   no: $scope.billNo,
                                   debit: 0,
                                   credit: $scope.manualTotal.toFixed(2),
                                   creditMsc: $scope.CIFTOTAL1.toFixed(2),
                                   debitMsc: 0,
                                   value: $scope.CIFTOTAL1.toFixed(2),
                                   type: 'Inventory',
                                   lastModified: new Date()
                               }
                           }
                           $http.post(config.login + "transaction", data).then(function (response) {
       
                               if (localStorage['usertype'] == '2') {
                                   var url = config.login + "createInventory";
                                   var invData = {
                                       billNo: $scope.billNo,
                                       lineItem: $scope.billtable,
                                       visible: true
       
                                   }
                               }
                               if (localStorage['usertype'] == '3') {
                                   var url = config.login + "createInventory";
                                   var invData = {
                                       billNo: $scope.billNo,
                                       packingList: $scope.billtable1,
                                       visible: false
       
                                   }
                               }
                               $http.post(url, invData)
                                          .success(function (data) {
                                              showSuccessToast("Bill Save Succesfully");
                                          });
       
                              
       
                           });
       
       
                       }
                       if (response.status == "200" && $scope.no != null) {
                           var data1 = {
                               status: ["CLOSED"]
                           }
                           $http.post(config.api + "transactions" + "/update" + "?[where][no]=" + $scope.no, data1).then(function (response) {
                           })
                       }
                   });
               }
               */
    };


    $scope.addEnventory = function () {
        var data = {
            Inventory: $scope.billtable,
            inventoryNo: $scope.billNo,
            supliersName: $scope.supplier,
            date: $scope.billDate
        }


        $http.post(config.api + "Inventories", data).then(function (response) {

        })


    }


    $scope.uploadFile = function () {

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

                            var obj3 = obj.replace(" ", "");
                            var obj2 = obj3.replace(" ", "");
                            var obj4 = obj2.replace(" ", "");
                            var obj1 = obj4.replace("/", "");

                            var no = "no"
                            var INOUT = "IN/OUT"

                            var date = "date"
                            var exchangeRate = "exchangeRate"
                            if (obj1 == "NETWEIGHT") {

                                $scope.netweight = Number(XL_row_object[key][obj]);
                            }
                            if (obj1 == "TOTALPRICE") {
                                $scope.totalprice = Number(XL_row_object[key][obj]);
                                retObj["TOTALAMOUNTUSD"] = $scope.netweight * $scope.totalprice;
                                console.log(retObj["TOTALAMOUNTUSD"]);
                            }

                            if (obj1 == "FOBUNITPRICEUSD" || obj1 == "CIFUNITPRICE" || obj1 == "NETWEIGHT" || obj1 == "TOTALPRICE" || obj1 == "LENGTH" || obj1 == "WIDTH" || obj1 == "THICKNESS" || obj1 == "GROSSWT") {
                                retObj[obj1] = Number(XL_row_object[key][obj]);
                            }
                          

                            else {
                                retObj[obj1] = XL_row_object[key][obj];
                            }
                            retObj[no] = $scope.billNo;
                            retObj[date] = $scope.billDate;
                            retObj[exchangeRate] = $scope.ExchangeRateINR
                            retObj[INOUT] = 0
                            retObj["currentStatus"] = 'open';
                            retObj["statusTransaction"] = [{dt:new Date(),status:'open',remarks:'inventory added'}];
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
                $scope.billtable12 = $scope.ExeclDataRows
                //  console.log($scope.billtable12)
                $scope.billtable1 = $scope.ExeclDataRows
                $scope.excelTableItemSum();

            };

            reader.onerror = function (ex) {

            };

            reader.readAsBinaryString(file);
        };
        var data = this.parseExcel(file);



    };


    // Exchange Rate



    //Custom modal added by khushboo 04-03
    $scope.Custombtn = function () {
        $scope.customTable = $scope.billtable;
        $scope.customTable1 = $scope.billtable;
        $('#CustomModalPopup').modal('show');
        $scope.sumtotalcustomData();
    },

    $(document).on("click", ".editable_text", function () {
        var original_text = $(this).text();
        var new_input = $("<input class=\"text_editor\"/>");
        new_input.val(original_text);
        $(this).replaceWith(new_input);
        new_input.focus();
    });

    $(document).on("blur", ".text_editor", function () {
        var new_input = $(this).val();
        var updated_text = $("<span class=\"editable_text\">");
        updated_text.text(new_input);
        $(this).replaceWith(updated_text);
    });

    $scope.checkboxModel = {
        value1: false

    };
    $scope.lineDataQnt = [];
    $scope.count = 0;

    console.log($scope.customTable1)
    // console.log($scope.customTable1[0].NETWEIGHT)
    var totalQnt = 0;
    $scope.idSelectedItem = null;
    $scope.selectLineItem = function (index, rate, netweight) {
        $scope.idSelectedItem = index;
        $scope.tableIndex = index;
        $scope.count++;
        $scope.baseRate1 = Number(rate)
        $scope.exchangeRateBill = Number(68.8);

        /* for (var i = 0; i < $scope.count; i++) {
             console.log($scope.count);

             if (check == "true") {
                 totalQnt += Number($scope.customTable1[index].NETWEIGHT);
                 break;
                 
             } else {
                 totalQnt = Number(totalQnt) - Number($scope.customTable1[index].NETWEIGHT);
                 $scope.count--;
                 break;
                
             }
         }
         */
        $scope.totalQnt = Number(netweight);

        $scope.InsuranceAndFreight = 1
        $scope.customDuty = 0
        $scope.exciseDuty = 12.5
        $scope.eduCess = 2
        $scope.customCecAndEducess = 1
        $scope.SAD = 4

        $scope.baseValue = Number($scope.baseRate1 * $scope.exchangeRateBill * $scope.totalQnt).toFixed(2)
        $scope.baseValue1 = $scope.baseValue.toFixed(2)
        console.log(totalQnt);

    }

    //calculate custom duty

    $scope.calculateCustom = function () {
        $scope.baseRate = $scope.baseRate1
        $scope.baseValue = Number($scope.baseRate1 * $scope.exchangeRateBill * $scope.totalQnt).toFixed(2)
        $scope.arshiyaCharge1 = (Number($scope.arshiyaCharge) * $scope.exchangeRateBill).toFixed(2);
        $scope.InsuranceAndFreight1 = ((Number($scope.baseValue) + Number($scope.arshiyaCharge1)) * Number($scope.InsuranceAndFreight) / 100).toFixed(2);;
        $scope.cifValue = (Number($scope.arshiyaCharge1) + Number($scope.InsuranceAndFreight1) + Number($scope.baseValue)).toFixed(2);;
        $scope.customDuty1 = (Number($scope.cifValue) * Number($scope.customDuty) / 100).toFixed(2);;
        $scope.assesableValue = (Number($scope.cifValue) + Number($scope.customDuty1)).toFixed(2);;
        $scope.exciseDuty1 = (Number($scope.assesableValue) * Number($scope.exciseDuty) / 100).toFixed(2);;
        $scope.eduCess1 = ((Number($scope.customDuty1) + Number($scope.exciseDuty1)) * $scope.eduCess / 100).toFixed(2);;
        $scope.customCecAndEducess1 = ((Number($scope.customDuty1) + Number($scope.exciseDuty1)) * Number($scope.customCecAndEducess) / 100).toFixed(2);;
        $scope.dutyAmount = (Number($scope.customDuty1) + Number($scope.exciseDuty1) + Number($scope.eduCess1) + Number($scope.customCecAndEducess1)).toFixed(2);;
        $scope.SAD1 = (((Number($scope.assesableValue) + Number($scope.exciseDuty1) + Number($scope.eduCess1) + Number($scope.customCecAndEducess1)) * Number($scope.SAD)) / 100).toFixed(2);;
        $scope.totalDutyAmt = (Number($scope.dutyAmount) + Number($scope.SAD1)).toFixed(2);;

        $scope.customDatanew = {
            arshiyaCharge1: $scope.arshiyaCharge1,
            arshiyaCharge: $scope.arshiyaCharge,
            assesableValue: $scope.assesableValue,
            exciseDuty1: $scope.exciseDuty1,
            dutyAmount: $scope.dutyAmount,
            SAD1: $scope.SAD1,
            totalDutyAmt: $scope.totalDutyAmt,
            arshiyaCharge: $scope.arshiyaCharge,
            InsuranceAndFreight: $scope.InsuranceAndFreight,
            InsuranceAndFreight1: $scope.InsuranceAndFreight1,
            cifValue: $scope.cifValue,
            customDuty: $scope.customDuty1,
            customCecAndEducess: $scope.customCecAndEducess,
            eduCess1: $scope.eduCess1,
            exciseDuty: $scope.exciseDuty,
            customDuty: $scope.customDuty,
            eduCess: $scope.eduCess,
            customCecAndEducess1: $scope.customCecAndEducess1,
            SAD: $scope.SAD



        }
    };

    $scope.getCustomData = function (data) {
        $scope.arshiyaCharge1 = data.arshiyaCharge1
        $scope.arshiyaCharge = data.arshiyaCharge
        $scope.assesableValue = data.assesableValue
        $scope.exciseDuty1 = data.exciseDuty1
        $scope.totalDutyAmt = data.totalDutyAmt
        $scope.SAD = data.SAD
        $scope.dutyAmount = data.dutyAmount

        $scope.InsuranceAndFreight1 = data.InsuranceAndFreight1
        $scope.InsuranceAndFreight = data.InsuranceAndFreight
        $scope.cifValue = data.cifValue
        $scope.customDuty1 = data.customDuty1
        $scope.customCecAndEducess = data.customCecAndEducess
        $scope.eduCess1 = data.eduCess1
        $scope.exciseDuty = data.exciseDuty
        $scope.customDuty = data.customDuty
        $scope.eduCess = data.eduCess
        $scope.customCecAndEducess1 = data.customCecAndEducess1
        $scope.SAD1 = data.SAD1



    }

    // save custom data 

    $scope.customPymentStatus = function () {
        if ($stateParams.billNo) {
            if ($scope.customPaymentInfo) {
            if ($scope.customPaymentInfo.status == 'pending') {
                $scope.customStatus = "PENDING"
            }
            if ($scope.customPaymentInfo.status == 'done') {
                $scope.customStatus = "DONE"
                $scope.isDisabled = true;         
            }
                }
        }
        else
            return;
    }
    $scope.paymentAccounts = {}
    $scope.partyAccount = {}
    $scope.customPayement = function () {
        var customPayementDate = $scope.dateFormat($scope.customPayementDate);
        var data = {
            compCode: localStorage.CompanyId,
            type:"Payment",
            date: customPayementDate,
            amount:$scope.customAmount,
            refNo: $scope.billNo,
            state: "PAID",
            remark: $scope.customReamarks,
            vo_payment: {
                bankAccount:$scope.paymentAccounts.selected.accountName,
                partyAccount: $scope.partyAccount.selected.accountName,
                paymentAmount:$scope.customAmount,
                currency:'',
                exchangeRate:0,
                remarks: $scope.customReamarks,
                billDetail:[{}]
            },
            role: localStorage['adminrole']
        }

        $http.post(config.login + "payement", data).then(function (response) {
          

        });

    }
    
    $scope.sumtotalcustomData = function () {
        var total = 0;
        var NETWEIGHT = 0;
        var dutyAmount = 0;
        var SAD = 0;
        var totalDutyAmt = 0;
        for (var i = 0; i < $scope.customTable.length; i++) {

            NETWEIGHT += Number($scope.customTable[i].NETWEIGHT);
            dutyAmount += Number($scope.customTable[i].dutyAmount);
            SAD += Number($scope.customTable[i].SAD);
            totalDutyAmt += Number($scope.customTable[i].totalDutyAmt);
        }
        $scope.NETWEIGHT1 = NETWEIGHT.toFixed(2)
        $scope.dutyAmount1 = dutyAmount.toFixed(2)
        $scope.SAD12 = SAD.toFixed(2)
        $scope.totalDutyAmt13 = totalDutyAmt.toFixed(2)

    };

    $("#line").focusout(function () {

        $scope.addrow();
        $scope.manualTableSum();
    })
    $scope.rateCalculator = []

    $scope.addCurrencyRateLine = function () {

        $scope.rateCalculator.push({ exchangeRate: '', amount: '' })
        $scope.currencyCalculator();

    }

    $scope.currencyCalculator = function () {

        var total = 0;
        var totalRate = 0;
        var totalamount = 0;
        for (var i = 0; i < $scope.rateCalculator.length; i++) {

            totalRate += Number($scope.rateCalculator[i].exchangeRate);
            totalamount += Number($scope.rateCalculator[i].amount);
            total += Number($scope.rateCalculator[i].amount) * Number($scope.rateCalculator[i].exchangeRate);
        }

        $scope.avgRate = Number(total) / Number(totalamount);
    }


    $scope.test = {};
    console.log($scope.test);
    $scope.accountTable1 = [];
    $scope.godown = {}
    $scope.description = {}
    console.log($scope.description);
    $scope.remarks = {}

    $scope.idSelectedVote = null;
   
 
    $scope.edit = function (data, index) {       
        $scope.idSelectedVote = index;      
        $scope.index = index;
        $scope.edit1 = true;
        $scope.godown = { selected: { name: data.GODOWN } };
        $scope.description = { selected: { name: data.DESCRIPTION } };
        $scope.remarks = { selected: { name: data.RRMARKS } };

        $scope.lineItemnetweight = data.NETWEIGHT
        $scope.lineItemBaseRate = data.BASERATE
        $scope.lineItemAmount = data.TOTALAMOUNT



    }


    $scope.addBillLineItem = function () {
        $scope.GODOWN.push({ type: "GODOWN", name: $scope.newitem });
        if ($scope.invoiceType == 'Import') {
            var billdata = {
                GODOWN: $scope.godown.selected.name,
                DESCRIPTION: $scope.description.selected.name,
                RRMARKS: $scope.remarks.selected.name,
                NETWEIGHT: $scope.lineItemnetweight,
                BASERATE: $scope.lineItemBaseRate,
                TOTALAMOUNT: $scope.lineItemnetweight * $scope.lineItemBaseRate,
                AMOUNTINR: $scope.lineItemnetweight * $scope.lineItemBaseRate * $scope.ExchangeRateINR,
                assesableValue: '',
                exciseDuty: '',
                dutyAmount: '',
                SAD: '',
                totalDutyAmt: ''
            }
        }
        if ($scope.invoiceType == 'Domestic') {
            var billdata = {
                GODOWN: $scope.godown.selected.name,
                DESCRIPTION: $scope.description.selected.name,
                RRMARKS: $scope.remarks.selected.name,
                NETWEIGHT: $scope.lineItemnetweight,
                BASERATE: $scope.lineItemBaseRate,
                TOTALAMOUNT: '',
                AMOUNTINR: $scope.lineItemnetweight * $scope.lineItemBaseRate,
                assesableValue: '',
                exciseDuty: '',
                dutyAmount: '',
                SAD: '',
                totalDutyAmt: ''
            }
        }
        if ($scope.edit1 == true) {


            $scope.billtable[$scope.index] = billdata;
        } else {

            $scope.billtable.push(billdata);
            console.log($scope.billtable)

        }
        $scope.manualTableSum();

        $scope.edit1 = false;
    }
   $scope.transformFunction = function(new_value){ //new value is a string
      
        var new_object = { new_value};
        console.log(new_object);
     
        return new_object;
    }
    $scope.saveItem = function (data) {
        $http.post(config.login + "saveItem", data).then(function (response) {

        });
    }
    $scope.refreshResults = function ($select, type) {
        var search = $select.search,
          list = angular.copy($select.items),
          FLAG = -1;
        list = list.filter(function (item) {
            return item.id !== FLAG;
        });
        if (!search) {
            //use the predefined list
            $scope.newElement = false;
            $select.items = list;
        }
        else {
            //manually add user input and set selection
            var userInputItem = {
                id: FLAG,
                name: search
            };
            $scope.newElement = true;
            $select.items =  [userInputItem].concat(list)
            $select.selected =  userInputItem.name

            if (type == "GODOWN") {
                $scope.newitem = $select.selected;

            }
            if (type == "DESCRIPTION") {       
                    $scope.DESCRIPTION.push({ name: $scope.description.selected.name});
                 
               
            }
            if (type == "RRMARKS") {
                $scope.RRMARKS.push({ name: $scope.remarks.selected.name });
            }
            console.log(userInputItem.name)


            console.log($scope.GODOWN)
        }
        
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




    $http.get(config.api + "accounts").then(function (response) {
        $scope.account = response.data
        console.log($scope.account);
    });








    //$scope.DESCRIPTION = [
    //     {
    //            name: "Cold Rolled Stainless Steel Sheet/Plates/ Coil Prime",
    //        },
    //       {
    //          name: "Cold Rolled Stainless Stee Defective Sheet plate Coils Cut",
    //       },
    //       {
    //           name: "Cols Rolled Stainless Steel Baby Coil / Sheet /Plates Cut",
    //       }

    //]
   



    $scope.add = function (type, value) {
        $('#formaccount').modal('show');
        $scope.myValue = { accountName: value };
        $scope.getSupplier();
        

    }
    
    $scope.bindMasterData = function (type) {
        $http.get(config.api + "masters" + "?filter[where][type]=" + type).then(function (response) {
            if (type == 'GODOWN')
                $scope.GODOWN = response.data
            if (type == 'REMARKS')
                $scope.REMARKS = response.data
            if (type == 'DESCRIPTION')
            $scope.DESCRIPTION = response.data

        });
    }

    $http.get(config.api + "masters" + "?filter[where][type]=GODOWN").then(function (response) {
        $scope.GODOWN = response.data
      
    });
    $http.get(config.api + "masters" + "?filter[where][type]=DESCRIPTION").then(function (response) {
        $scope.DESCRIPTION = response.data
      

    });
    $http.get(config.api + "masters" + "?filter[where][type]=REMARKS").then(function (response) {
        $scope.REMARKS = response.data
           
    });


    $(".selectTable tr").click(function () {
        $(this).addClass("highlighted").siblings().removeClass("highlighted");
    });

    $scope.ExciseDutyModalbtn = function () {
        $('#ExciseDutyModal').modal('show');
    }


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

    $scope.PayModalBtn = function (amount) {
        $('#PayModal').modal('show');
        $scope.customAmount = amount;
    }
    $('#paymentdate').datepicker();


    $('.btnhover button').click(function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active');
    });

    $('#InvoiceDate').datepicker();

    $scope.MannualEntrybtn = function () {
        $('#MannualEntryModal').modal('show');
    }
   
    $("#myPopover").popover({
        //  title: '<h3 class="custom-title"><span class="glyphicon glyphicon-info-sign"></span> Popover Info</h3>',
        data:$scope.paymentLog,
        content: "<table style='width:100%'><tr><th>Date</th><th>Amount Applied</th><th>Payment No.</th></tr><tr ng-repeat='data in paymentLog'><td>{{data.date}}</td><td>Rs{{data.amount}}</td><td>{{data.vochNo}}</td></tr><tr></tr></table>",
        html: true
    })

  

}]);

myApp.directive('popOver', function ($compile, $templateCache) {
    var getTemplate = function () {
        $templateCache.put('templateId.html', 'This is the content of the template');
        console.log($templateCache.get("popover_template.html"));
        return $templateCache.get("popover_template.html");
    }
    return {
        restrict: "A",
        transclude: true,
        template: "<span ng-transclude></span>",
        link: function (scope, element, attrs) {
            var popOverContent;
            if (scope.friends) {
                var html = getTemplate();
                popOverContent = $compile(html)(scope);
                var options = {
                    content: popOverContent,
                    placement: "bottom",
                    html: true,
                    title: scope.title
                };
                $(element).popover(options);
            }
        },
        scope: {
            friends: '=',
            title: '@'
        }
    };
});