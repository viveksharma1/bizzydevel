﻿myApp.controller('BillCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', 'authService', 'FileUploader', 'DTOptionsBuilder', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter, authService, FileUploader, DTOptionsBuilder) {
    $scope.manualTotal = 0;
    $scope.CIFTOTAL1 = 0;
    $scope.commonService = commonService
    $scope.role = localStorage["usertype"];
    $(function () {
        $("body").tooltip({
            selector: '[data-toggle="tooltip"]',
            container: 'body'
        });
    })
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('processing', false)
       .withOption('scrollX', 450)
        .withOption('scrollY', 370)
        .withOption('paging', false)

    $.fn.datepicker.defaults.format = "dd/mm/yyyy";
    var type = $stateParams.type;
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
    $scope.currencyRate = function () {
        $('#currencyRate').modal('show');
    };
    if (localStorage.usertype == 'UO') {
        $('#fileUpload1').show();
        $('#ItemDetail23').hide();
        $('#ItemDetail2').show();
        $('#ItemDetail3').hide();
        $('#fileUpload').show();
    }
    if (localStorage.usertype == 'O') {
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
        var days = 0;
        if ($scope.paymentDays)
            days = $scope.paymentDays;
        var billDate = getDate($scope.billDate);
        if (billDate)
            setDate($scope.billDueDate, moment(billDate).add(days, 'days'));
    }
   
   
    $('#billDueDate').datepicker({
        assumeNearbyYear: true,
        todayBtn: true
       
      
       
    
    });
    $('#billDate').datepicker({
        assumeNearbyYear: true,
        todayBtn: true
        

    });
    $('#customPayementDate').datepicker({ assumeNearbyYear: true });
    $('#actualDate').datepicker({ assumeNearbyYear: true });
   

    var files, res;
    $scope.billDate = "billDate";
    setDate($scope.billDate, new Date());
    if ($stateParams.billDate != null) {
        setDate($scope.billDate, $stateParams.billDate);
    }

    $scope.purchaseAccounts = {};
    $scope.unit = "KG";
    $scope.weightUnit = function (data) {
    }
    $scope.exchangeRate = function () {
        var access_key = 'af072eeb3d8671688ff6eaa83c8dbcb8';
        var url = 'http://apilayer.net/api/live?access_key=' + access_key;
        $http.get(url).then(function (response) {
            $scope.data = response.data;
            $scope.ExchangeRate = response.data.quotes.USDINR.toFixed(2);
            $scope.ExchangeRateINR = Number($scope.ExchangeRate)
            $scope.ExchangeRateIDR = $scope.ExchangeRate1
        });
    }
    //total sum
    $scope.billtable1 = [];
    $scope.isUpdate = true
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
    $scope.invoiceType = 'Import'
    $("#import").addClass('active')
    $("#dollar").addClass('active')
    $("#kg").addClass('active')
    $scope.domesticExcise = true
    $scope.invoiceType1 = function (invoiceType) {
        $scope.invoiceType = invoiceType;
        if (invoiceType == 'Domestic') {
            $("#rupee").addClass('active')
            $("#dollar").removeClass('active')
            $("#custom").hide();
            $("#Domestic").addClass('active')
            $("#curr").hide();
            $("#import").removeClass('active');
            $scope.domesticExcise = false
        }
        else {
            $("#dollar").addClass('active')
            $("#dollar").addClass('active')
            $("#rupee").removeClass('active')
            $("#import").addClass('active')
            $("#custom").show()
            $("#curr").show()
            $("#Domestic").removeClass('active');
            $scope.domesticExcise = true
           
        }
    }
    // bind file 
    $scope.oldAttachment = null;
    function bindAttachments(attachments, callback) {
        if (attachments) {
            angular.forEach(attachments, function (item) {
                $scope.oldAttachment = item;

                item.file.isOld = true;
                uploader.addToQueue(item.file);

            });
        }
        if (callback)
            callback();
    }
    $scope.accountTableSum = function () {
        var amount = 0;
        for (var i = 0; i < $scope.accountTable.length; i++) {
            amount += Number($scope.accountTable[i].amount);
        }
        $scope.totalAccountAmount = Number(amount.toFixed(2));
        var amt = Math.round($scope.totalAccountAmount)
        var totalamt = Number($scope.totalAccountAmount + $scope.totalAmountINR).toFixed(2)
        $scope.gTotal = Math.round($scope.totalAccountAmount) + Math.round($scope.totalAmountINR)
        $scope.roundOff = ($scope.gTotal - Number(totalamt)).toFixed(2);
        return amt
    }
    $scope.excelTableItemSum = function () {
        var total = 0;
        var totalweight = 0
        var manualtotal = 0;
        for (var i = 0; i < $scope.billtable1.length; i++) {
            var product = Number($scope.billtable1[i]);
            manualtotal += Number($scope.billtable1[i].TOTALAMOUNTINR);
            total += Number($scope.billtable1[i].TOTALAMOUNTUSD);
            totalweight += Number($scope.billtable1[i].NETWEIGHT);
        }
       
        $scope.totalWeight = Number(totalweight)
       
        if ($scope.invoiceType == 'Domestic') {
            $scope.totalAmountINR = Math.round(manualtotal);
        }
        else {
            $scope.TOTALAMOUNTUSD = Math.round(total);
            if ($scope.ExchangeRateINR) {
                $scope.totalAmountINR = Number((Number($scope.TOTALAMOUNTUSD) * Number($scope.ExchangeRateINR)))
            }
        }
        return $scope.totalAmountINR
    }
   

    $scope.manualTableSum = function () {
        var manualTotal = 0;
        var netweight = 0;
        var totalAmountINR = 0
        var AMOUNTPERITEM = 0;
        var totalSad = 0;
        var totalExcise = 0;
        for (var i = 0; i < $scope.billtable.length; i++) {
            manualTotal += Number($scope.billtable[i].TOTALAMOUNT);
            netweight += Number($scope.billtable[i].NETWEIGHT);
            totalAmountINR += Number($scope.billtable[i].AMOUNTINR.toFixed(2));
           // AMOUNTPERITEM += Number($scope.billtable[i].AMOUNTPERITEM.toFixed(2));
            totalSad += Number(Number($scope.billtable[i].SAD).toFixed(2));
            totalExcise += Number(Number($scope.billtable[i].dutyAmount).toFixed(2));
        }
        $scope.totalAmountINR = Number(totalAmountINR.toFixed(2));
        $scope.totalSad = Number(totalSad.toFixed(2));
        $scope.totalExcise = Number(totalExcise.toFixed(2));
        $scope.manualTotalINR = Number(totalAmountINR)
        $scope.manualTotalperItem = Number(AMOUNTPERITEM)
        $scope.manualTotal = Number(manualTotal.toFixed(2));
        $scope.netweight = Number(netweight);
        var amt = Math.round($scope.totalAmountINR)   
        return amt
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
    //account table
    $scope.selectedAccIndex = null;
    $scope.editAccountTable = function (data, index) {
        if (index === $scope.selectedAccIndex) {
            $scope.selectedAccIndex = null;
            $scope.accounts = null;
            $scope.accountAmount = null;
        } else {
            $scope.selectedAccIndex = index;
            $scope.accounts = { selected: data };
            $scope.accountAmount = data.amount;
        }
    }
    $scope.accounts = {}
    $scope.applyRate = function (rate) {
        if (rate) {
            $scope.accountAmount = null;
            $scope.accountAmount = (($scope.accountTableSum() + $scope.manualTableSum()) * Number(rate) / 100).toFixed(2);
        }
        else
            $scope.accountAmount = '';
    }
    $scope.accountTable = [];
    $scope.addAccount = function () {
        if ($scope.accounts == null || $scope.accounts.selected == null  ) {
            showErrorToast("please select account");
            return;
        }
        if (isNaN($scope.accountAmount) || $scope.accountAmount == null) {
            showErrorToast("please enter amount");
            return;
        }
        var accountData = {
            accountName: $scope.accounts.selected.accountName,
            accountId: $scope.accounts.selected.id,
            description: $scope.accountDescription,
            amount: $scope.accountAmount
        }
        if ($scope.selectedAccIndex != null) {
            $scope.accountTable[$scope.selectedAccIndex] = accountData;
        } else {
            $scope.accountTable.push(accountData);
        }
        $scope.accountAmount = null;
        $scope.selectedAccIndex = null
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
            $select.items = list;
        }
        else {
            var userInputItem = {
                id: FLAG,
                name: search
            };
            $select.items = [userInputItem].concat(list);
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
        $scope.RG = Number($scope.RG) - 1

        for (var i = 0; i < $scope.billtable.length; i++) {
            $scope.billtable[i].RG = $scope.rgCount + i + 1
        }
    }
    $scope.remove1 = function (index) {
        $scope.accountTable1.splice(index, 1);
    }

    $scope.removeAccountTable = function (index) {
        $scope.accountTable.splice(index, 1);
        $scope.accountTableSum();
        $scope.selectedAccIndex = null;
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
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                formData.append('uploads[]', file, $scope.billNo + file.name + ".pdf");
            }
            $.ajax({
                url: config.login + 'upload?no=' + $scope.billNo,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
       
                }
            });
            $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.billNo).then(function (response) {
                $scope.data = response.data;
                $scope.datapath = $scope.data[0].path;
            });
        }
    };

    // delete file
    $scope.deletefile = function (data, index) {
        $scope.datapath.splice(index, 1)
        $http.get(config.login + 'delete?path=' + data + '&no=' + $scope.billNo).then(function (response) {
        });
    }
    $scope.no = $stateParams.billNo
    $scope.role;
    $scope.admin = localStorage['usertype'];
    $scope.supplier = {};
    $('#paymentStatus').hide();
    $scope.getSupplier = function () {
        $http.get(config.login + "getSupplierAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.supliers = response.data
        });
    }
    $scope.getPurchaseAccount = function () {
        $http.get(config.login + "getpurchaseAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.purchaseAccount = response.data
        });
    }
    $scope.getExpenseAccount = function () {
        $http.get(config.login + "getExpenseAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.expenseAccount = response.data
        });
    }
    $scope.$on("event:accountReferesh", function (event, args) {
        // Refresh accounts...
        $scope.getSupplier();
        $scope.getPurchaseAccount();
        $scope.getExpenseAccount();
    });
    $scope.getSupplier();
    $scope.getPurchaseAccount();
    $scope.getExpenseAccount();
    $scope.getSupplierDetail = function (id) {
        $scope.supliersDetail = []
        $http.get(config.api + "accounts/" + id).then(function (response) {
            $scope.supliersDetail = response.data;
            console.log(response.data)

            $scope.bindSupplierDetail(response.data)
            $scope.email = $scope.supliersDetail.email;
           
            $scope.shippingAddress = $scope.supliersDetail.billingAddress?$scope.supliersDetail.billingAddress[0].street:null;
            if ($scope.supliersDetail.phone != undefined) {
                $scope.mobile = $scope.supliersDetail.mobile == undefined ? $scope.supliersDetail.phone : $scope.supliersDetail.mobile + "," + $scope.supliersDetail.phone
            }
        });
    }
    $scope.getPartyDetail = function (id) {
        $http.get(config.api + "accounts/" + id).then(function (response) {
           
            
            $scope.bindPurchaseLedgerDetail(response.data)
            
        });
    }

    //get Bill data
    $scope.supplier = {};
    function  checkSalesInventory(invId){ 
        var url = config.login + "checkSalesInventory/" + invId
        commonService.checkSalesInventory(url).then(function (response) {
            if (response.data.status == "can not update") {
                console.log("checkSalesInventory", response.data.status)
                $rootScope.$broadcast('event:error', { message: response.data.status });       
            }              
        })
    }
    $scope.getBilldata = function (billNo, fields) {
        $scope.field = fields
        $http.get(config.api + 'voucherTransactions/' + billNo)
                    .then(function (response) {
                       
                        var billData = response.data.transactionData;
                        console.log(response)
                        checkSalesTransction(billNo)
                        $scope.customPaymentInfo = billData.customPaymentInfo;
                        $scope.accountTable = billData.accountlineItem;
                        if (billData.itemDetail && localStorage["usertype"] == 'UO') {
                            $scope.billtable1 = billData.itemDetail; 
                            $scope.excelTableItemSum();
                            $scope.id = billData.id
                            $scope.totalAmountINR = $scope.excelTableItemSum() + $scope.accountTableSum();
                            $scope.customBalance = Number(response.data.customBalance)
                            $scope.dutyAmount1 = Number(response.data.customAmount)
                        }
                        if (billData.manualLineItem && localStorage["usertype"] == 'O') {
                            $scope.billtable = billData.manualLineItem;
                            $scope.totalAmountINR = $scope.manualTableSum() + $scope.accountTableSum();
                            $scope.id = billData.id
                            $scope.billData = billData
                            $scope.customBalance = Number(response.data.customBalance)
                            $scope.dutyAmount1 = Number(response.data.customAmount)
                        }
                        if (!response.data.balance) {
                            $('#paymentStatus').show();
                        }
                        if (response.data.accountlineItem) {
                            $scope.accountTableSum();
                        }
                        if (response.data.paymentLog) {
                            $scope.receiptCount = response.data.paymentLog.length;
                            $scope.receipts = response.data.paymentLog;
                        } else {
                            $scope.receiptCount = null;
                            $scope.receipts = [];
                        }
                        if (response.data.customPaymentLog) {
                            $scope.customCount = response.data.customPaymentLog.length;
                            $scope.custom = response.data.customPaymentLog;
                        } else {
                            $scope.customCount = null;
                            $scope.custom = [];
                        }
                       // $scope.customBalance = response.data.customBalance
                        $scope.paymentDays = billData.paymentDays
                        $scope.paymentLog = { data: "dfdgd" };
                        $scope.billNo = billData.no
                        $scope.ExchangeRateINR = Number(billData.ExchangeRate)
                        $scope.email = billData.email
                        $scope.supplier = { selected: { accountName: localStorage[billData.supliersId], id: billData.supliersId } };
                        $scope.purchaseAccounts = { selected: { accountName: localStorage[billData.purchaseAccountId], id: billData.purchaseAccountId } };
                        $scope.getSupplierDetail(billData.supliersId);
                        $scope.getPartyDetail(billData.purchaseAccountId)
                        $scope.invoiceType1(billData.invoiceType);
                        setDate($scope.billDate, billData.billDate);
                        setDate($scope.billDueDate, billData.billDueDate);
                        setDate($scope.actualDate, billData.actualDate);
                        $scope.attachements = billData.attachements;
                        $scope.narration = response.data.narration
                        bindAttachments(billData.attachements, function () {
                            $scope.oldAttachment = null;
                        });
                        $('#invoiceExist').modal('hide');
                      
                    });
              }
    $scope.deleteBtn = false
    if ($stateParams.billNo) {
        $scope.deleteBtn = true
        $scope.isShow = true
        if (localStorage['usertype'] == 'O') {
            $scope.getBilldata($stateParams.billNo, '?filter[fields][itemDetail]=false&filter[fields][adminAmount]=false&filter[fields][adminBalance]=false');
        }
        else
            $scope.getBilldata($stateParams.billNo, '?filter[fields][manualLineItem]=false');
    }
    else {
        $scope.exchangeRate();
    }


    function checkSalesTransction(invId) {
        $http.get(config.login + "checkSalesTransaction" + "?invId=" + invId)
                    .then(function (response) {
                        if (response.data.status == 'can not update') {
                          $scope.isUpdate = false
                        }
                        else {
                            $scope.isUpdate = true
                        }

         });
    }
    $scope.getNewData = function (type, data, e) {
        $scope.saveItem({ name: data, type: type });
        if ($(e.target).closest('.popover').length) {
            $('.popover').each(function () {
                $(this.previousSibling).popover('hide');
            });
        }
    };
    $scope.ticCustom = function (data) {
        if (data) {
            return "fa fa-check"
        }
        return
    }
    $scope.saveCustom = function () {
        if ($scope.assesableValue) {
            $scope.billtable[$scope.tableIndex].assesableValue = $scope.assesableValue;
            $scope.billtable[$scope.tableIndex].exciseDuty = $scope.exciseDuty1;
            $scope.billtable[$scope.tableIndex].dutyAmount = $scope.dutyAmount;
            $scope.billtable[$scope.tableIndex].SAD = $scope.SAD1;
            $scope.billtable[$scope.tableIndex].totalDutyAmt = $scope.totalDutyAmt;
           // $scope.billtable[$scope.tableIndex].actualDate = moment(getDate($scope.actualDate)).format("DD/MM/YYYY");
            $scope.billtable[$scope.tableIndex].customData = $scope.customDatanew
            $scope.billtable[$scope.tableIndex].purchaseRate = (Number($scope.assesableValue) / Number($scope.billtable[$scope.tableIndex].NETWEIGHT)).toFixed(2);
            $scope.billtable[$scope.tableIndex].dutyPerUnit = (Number($scope.exciseDuty1) / Number($scope.billtable[$scope.tableIndex].NETWEIGHT)).toFixed(2);
            $scope.billtable[$scope.tableIndex].sadPerUnit = (Number($scope.SAD1) / Number($scope.billtable[$scope.tableIndex].NETWEIGHT)).toFixed(2);
            $scope.sumtotalcustomData();
            //$rootScope.$broadcast('event:success', { message: "Custom Saved " });
            $scope.clearCustomField()

        }
        }
    
    $scope.dateFormat = function (date) {
        var res = date.split("/");
        var month = res[1];
        var days = res[0]
        var year = res[2]
        var date = month + '/' + days + '/' + year;
        return date;
    }
    //var urlToChangeStream = "" + config.api + "voucherTransactions/change-stream?_format=event-stream";
    //var src = new EventSource(urlToChangeStream);
    //src.addEventListener('data', function (msg) {
    //    var d = JSON.parse(msg.data);
    //   console.log(d)
    //    if (d) {
    //        var username = authService.getAuthentication().username
    //        var activityType;
    //        if (d.type == 'create') {
    //            var activityType = "voucherTransaction" + " " + d.data.vochNo + " " + "Created"

    //       } else if(d.type == 'update'){
    //           var activityType = "voucherTransaction" + " " + d.data.vochNo + " " + "updated"
    //        }
    //        var logData = {
    //            username: username,
    //           date: moment().format('MMMM Do YYYY, h:mm:ss a'),
    //           activityType:activityType,
    //           vochNo:''

    //        }
    //        $http.post(config.login + "userActivityLog", logData).then(function (response) {
    //           return;
    //       });

    //   }
    // console.log(d.data);
    //})
    // save bill 
    $scope.saving = false;
    
        $scope.saveBill = function (reload) {
            var billDate = getDate($scope.billDate);
            var billDueDate = getDate($scope.billDueDate);
            var actualDate = getDate($scope.actualDate)
            var date = getDate($scope.actualDate)
            if ($scope.isUpdate == false) {
                  $rootScope.$broadcast('event:error', { message: "Can't Update " });
                  return;
                }
            if ($scope.receiptCount > 0) {
                $rootScope.$broadcast('event:error', { message: "Can't Update" });
                return;
            }
            if ($scope.billNo == undefined) {
                $rootScope.$broadcast('event:error', { message: "Please type Invoice No" });
                return;
            }
            if ($scope.billtable.length == 0 && $scope.billtable1.length == 0) {
                $rootScope.$broadcast('event:error', { message: "Please Select Item" });
                return;
            }
            if ($scope.supplier.selected == undefined || $scope.supplier.selected == null) {
                $rootScope.$broadcast('event:error', { message: "Please select supplier" });
                return;
            }
            if ($scope.purchaseAccounts.selected == undefined || $scope.purchaseAccounts.selected == null) {
                $rootScope.$broadcast('event:error', { message: "Please select Purchase ledger Account" });
                return;
            }

            if (!date) {
                $rootScope.$broadcast('event:error', { message: "Invoice date is not valid" });
                return;
            }
            if (!billDueDate) {
                $rootScope.$broadcast('event:error', { message: "Invoice due date is not valid" });
                return;
            }
            if (!actualDate) {
                $rootScope.$broadcast('event:error', { message: "Invoice actual date is not valid" });
                return;
            }
            $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
            var queue = uploader.queue;
            var attachements = [];
            angular.forEach(queue, function (fileItem) {
                attachements.push({ title: fileItem.title, cdnPath: fileItem.cdnPath, file: fileItem.file })
            });
            var purchaseAmount;

            if (authService.userHasPermission('usertype:O')) {
                var amount = Number($scope.totalAccountAmount) +$scope.manualTableSum();
                purchaseAmount = $scope.totalAmountINR
                var totalAmountINR = 0
               var amountInDollar = $scope.manualTotal
              var   balanceInDollar = $scope.manualTotal
                var adminAmountInDollar = 0
                var adminBalanceInDollar = 0
            }
            if (authService.userHasPermission('usertype:UO')) {
                purchaseAmount = $scope.excelTableItemSum();
                var totalAmountINR = $scope.totalAccountAmount + $scope.totalAmountINR;
               var  adminAmountInDollar = $scope.TOTALAMOUNTUSD
               var  adminBalanceInDollar = $scope.TOTALAMOUNTUSD
                var amount = 0;
                var amountInDollar = 0
                var balanceInDollar = 0
            }
            
            //if ($scope.exciseAssessableValue) {
            //    for (var i = 0; i < $scope.billtable.length; i++) {
            //        $scope.billtable[i].assesableValue = $scope.exciseAssessableValue * $scope.billtable[i].NETWEIGHT;
            //        $scope.billtable[i].exciseDuty = $scope.exciseDutyPerUnit * $scope.billtable[i].NETWEIGHT;
            //        $scope.billtable[i].dutyAmount = $scope.exciseRate * $scope.billtable[i].NETWEIGHT;
            //        $scope.billtable[i].SAD = $scope.exciseSAD * $scope.billtable[i].NETWEIGHT;
            //        $scope.billtable[i].actualDate = moment(getDate($scope.actualDate)).format("DD/MM/YYYY");
            //    }
            //}
            if (authService.userHasPermission('usertype:O')) {
                isUo = false
                visible = true
                // paymentNo = $scope.paymentNo
            }
            if (authService.userHasPermission('usertype:UO')) {
                isUo = true
                visible = true
                // paymentNo = "UO" + $scope.paymentNo
            }
            var data = {
                type: type,
                state: "OPEN",
                date: date,
                billDate:billDate,
                amount: Number($scope.totalAmountINR.toFixed(2)),
                compCode: localStorage.CompanyId,
                role: localStorage['usertype'],
                no: $scope.billNo,
                vochNo: $scope.billNo,
                isUo: isUo,
                visible: visible,
                username: authService.getAuthentication().username,
                narration: $scope.narration,
                customAmount: Number($scope.dutyAmount1),
                customBalance:Number($scope.dutyAmount1),
                transactionData: {
                    roundOff: $scope.roundOff,
                    compCode: localStorage.CompanyId,
                    supliersId: $scope.supplier.selected.id,
                    email: $scope.email,
                    role: localStorage['usertype'],
                    currency: $scope.currency,
                    date: date,
                    billDate:billDate,
                    billDueDate: billDueDate,
                    actualDate: actualDate,
                    ordertype: "BILL",
                    no: $scope.billNo,
                    status: ["OPEN"],
                    paymentDays: $scope.paymentDays,
                    itemDetail: $scope.billtable1,
                    manualLineItem: $scope.billtable,
                    accountlineItem: $scope.accountTable,
                    purchaseAccountId: $scope.purchaseAccounts.selected.id,
                    adminAmount: Number($scope.totalAmountINR.toFixed(2)),
                    adminBalance: Number($scope.totalAmountINR.toFixed(2)),
                    purchaseAmount: Number(purchaseAmount),
                    amount: Number(amount),
                    balance: Number(amount),
                    amountInDollar: amountInDollar,
                    balanceInDollar: balanceInDollar,
                    adminAmountInDollar: adminAmountInDollar,
                    adminBalanceInDollar: adminBalanceInDollar,
                    
                   

                    totalWeight: $scope.totalWeight,
                    ExchangeRate: $scope.ExchangeRateINR,
                    supCode: $scope.supplier.selected.supCode,
                    billId: $scope.id,
                    invoiceType: $scope.invoiceType,
                    attachements: attachements,
                    customPaymentInfo: {
                        status: "pending",
                        amount: 0,
                        paymentDate: '',
                        bankAccount: '',
                        partyAccount: '',
                        voRefId: ''
                    }
                }
            }
            $http.post("https://api.keen.io/3.0/projects/592786ff90b3659264952080/events/EVENT_COLLECTION?api_key=68E5FFBBE11B658F42D2DCC6B0DAA360E49B385A4968803E62262B67D57FAD566083E9CFF7C0330BCA4825895644BCB4F9DBFD0350461A9E6251D31AD380D1640F7A79C638D723794E5E3E5EFC118925B221F78DE0BE81BFA596D65AF89BA6FB", data).then(function (response) {
            });
            var url = config.login + "checkSalesInventory/" + $stateParams.billNo
            commonService.checkSalesInventory(url).then(function (response) {
                if (response.data.status == "can not update") {
                    console.log("checkSalesInventory", response.data.status)
                    $rootScope.$broadcast('event:error', { message: response.data.status });
                } else {
                    $http.post(config.login + "saveBillTest/" + $stateParams.billNo, data).then(function (response) {
                        if (response.status == 200) {
                            $scope.saving = false;  
                            $rootScope.$broadcast('event:success', { message: "Purchase Invoice Created" });
                            if (reload == 'true') {
                                $state.go('Customer.Bill', { billNo: null, billDate: billDate }, { location: 'replace' }, { reload: true });
                            } else {
                                $stateParams.billNo = response.data
                                $state.go('Customer.Bill', { billNo: response.data }, { location: 'replace' });
                            }
                             

                        }
                        else {
                            $rootScope.$broadcast('event:error', { message: "Error while creating invoice" });
                        }
                    });
                }
            })
          
        };
    

    //manual line item entry 
        $scope.manualIndex = null;
        $scope.manualEntry = function () {
            var data = {
            CONTNO:              $scope.CONTNO,
            INCOMINGDATE   :     $scope.INCOMINGDATE,
            LotWeight      :     $scope. LotWeight,
            LOCATION       :     $scope.LOCATION,
            SUBCATEGORY    :     $scope.SUBCATEGORY,
            COILSHEETNO    :     $scope.COILSHEETNO,
            GRADE          :     $scope.GRADE,
            FINISH         :     $scope.FINISH,
            THICKNESS     :      $scope.THICKNESS,
            WIDTH        :       $scope.WIDTH,
            LENGTH       :       $scope.LENGTH,
            NETWEIGHT    :       $scope.NETWEIGHT,
            GROSSWT       :      $scope.GROSSWT,
            PCSLENGTHINMTRS:     $scope.PCSLENGTHINMTRS,
            TOTALAMOUNTINR:      Number($scope.TOTALAMOUNTMANUAL)
            
            }
            if ($scope.manualIndex != null) {
                $scope.billtable1[$scope.manualIndex] = data;
                $scope.excelTableItemSum();
            } else {
                $scope.billtable1.push(data);
                $scope.excelTableItemSum();
            }
            $scope.manualIndex = null;
            
        }
    // excel line item upload
    $scope.uploadFile = function () {
        $scope.billtable1 = [];
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
                                    retObj["BALANCE"] = Number(XL_row_object[key][obj]);
                                }
                                if (obj1 == "TOTALPRICE") {
                                    $scope.totalprice = Number(XL_row_object[key][obj]);
                                    retObj["TOTALAMOUNTUSD"] = $scope.netweight * $scope.totalprice;
                                    retObj["TOTALAMOUNTINR"] = Number($scope.netweight * $scope.totalprice * Number($scope.ExchangeRateINR))
                                }

                                if (obj1 == "FOBUNITPRICEUSD" || obj1 == "CIFUNITPRICE" || obj1 == "NETWEIGHT" || obj1 == "TOTALPRICE"  || obj1 == "GROSSWT") {
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
                                retObj["statusTransaction"] = [{ dt: new Date(), status: 'open', remarks: 'inventory added' }];
                                retObj["assesableValue"] = '0';
                                retObj["exciseDuty"] = '0';
                                retObj["dutyAmount"] = '0';
                                retObj["SAD"] = '0';
                                retObj["totalDutyAmt"] = '0';
                                retObj["compCode"] = localStorage.CompanyId
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

                    $scope.billtable1 = $scope.ExeclDataRows
                    $scope.excelTableItemSum();
                    $scope.$apply();
                    $rootScope.$broadcast('event:success', { message: $scope.ExeclDataRows.length +" Line Item Uploaded" });
                } catch (e) {
                    console.log(e)
                    $rootScope.$broadcast('event:error', { message: "Unsupported file" });
                    $scope.myFile = null;
                    $scope.$apply();
                   
                }
                
            };
            reader.onerror = function (ex) {
                alert("unsuported file")
                
            };
            reader.readAsBinaryString(file);
        };
        var data = this.parseExcel(file);
        
     
    };

    //Custom modal added by khushboo 04-03
    $scope.Custombtn = function () {
        $scope.customTable = $scope.billtable;
        $scope.customTable1 = $scope.billtable;
        $('#CustomModalPopup').modal('show');
        $scope.sumtotalcustomData();
        $scope.clearCustomField()
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
    var totalQnt = 0;
    $scope.customIndex = null;
    $scope.selectLineItem = function (index, rate, netweight,customData) {
        $scope.customIndex = index;
        $scope.tableIndex = index;
        $scope.count++;
        $scope.baseRate1 = rate
        $scope.exchangeRateBill = $scope.ExchangeRateINR;
        $scope.totalQnt = Number(netweight);
        $scope.InsuranceAndFreight = 1
        $scope.customDuty = 0
        $scope.exciseDuty = 12.5
        $scope.eduCess = 2
        $scope.customCecAndEducess = 1
        $scope.SAD = 4
        $scope.baseValue = Number($scope.baseRate1 * $scope.exchangeRateBill * $scope.totalQnt).toFixed(2)
        // $scope.baseValue1 = $scope.baseValue.toFixed(2)
        $scope.getCustomData(customData)
    }
    //calculate custom duty


    $scope.clearCustomField = function () {
        $scope.baseRate = null
        $scope.baseValue = null
        $scope.arshiyaCharge1 = null
        $scope.InsuranceAndFreight1 = null
        $scope.cifValue = null
        $scope.customDuty1 = null
        $scope.assesableValue = null
        $scope.exciseDuty1 = null
        $scope.eduCess1 = null
        $scope.customCecAndEducess1 = null
        $scope.dutyAmount = null
        $scope.SAD1 = null
        $scope.totalDutyAmt = null
        $scope.customDatanew = null
        $scope.arshiyaCharge1 = null
        $scope.arshiyaCharge = null
        $scope.assesableValue = null
        $scope.exciseDuty1 = null
        $scope.dutyAmount = null

        $scope.totalDutyAmt = null
        $scope.arshiyaCharge = null
        $scope.InsuranceAndFreight = null
        $scope.InsuranceAndFreight1 = null
        $scope.cifValue = null
        $scope.customDuty1 = null
        $scope.customCecAndEducess = null
        $scope.eduCess1 = null
        $scope.exciseDuty = null
        $scope.customDuty = null
        $scope.eduCess = null
        $scope.customCecAndEducess1 = null,
        $scope.SAD = null
        $scope.baseRate1 = null
        $scope.totalQnt = null,
        $scope.exchangeRateBill = null
    }
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
    $scope.getVoucherCount = function () {
        $http.get(config.api + "voucherTransactions/count" + "?[where][type]=" + "Payment").then(function (response) {
            $scope.paymentNo = response.data.count + 1
        });
    }
    $scope.getVoucherCount();
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
       // var customPayementDate = $scope.dateFormat($scope.customPayementDate);
        var customPayementDate = getDate($scope.customPayementDate);
        var data = {
            compCode: localStorage.CompanyId,
            role: localStorage['usertype'],
            type: "Payment",
            date: customPayementDate,
            amount: $scope.customAmount,
            refNo: $scope.billNo,
            vochNo: $scope.paymentNo,
            state: "PAID",
            remark: $scope.customReamarks,
            visible: true,
            vo_payment: {
                bankAccountId: $scope.paymentAccounts.selected.id,
                partyAccountId: $scope.partyAccount.selected.id,
                paymentAmount: $scope.customAmount,
                currency: 'Rupee',
                exchangeRate: 0,
                remarks: $scope.customReamarks,
                billDetail: [{}]
            },
            role: localStorage['adminrole']
        };
        $http.post(config.login + 'payment?id=null' , data)
                      .then(function (response) {
                          if (response.data.err) {
                              $rootScope.$broadcast('event:error', { message: "Error while creating Payment: " + response.data.err });
                          } else {
                              $rootScope.$broadcast('event:success', { message: "Payment Done." });
                              //SweetAlert.swal("Done", "Receipt Created.", "success")
                              //showSuccessToast("Receipt Created.");
                              $state.go('Customer.Receipt', null, { location: false, reload: true });
                              //showSuccessToast("Payment Received.");
                              //$state.reload();
                          }

                      }, function (err) {
                          console.log(err);
                          //SweetAlert.swal("Error", "Error while creating receiipt", "error");
                          //SweetAlertError();
                          $rootScope.$broadcast('event:error', { message: "Error while creating payment" });
                          //spinner.stop();
                          //res.reject();
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
    $scope.accountTable1 = [];
    $scope.godown = {}
    $scope.description = {}
    $scope.remarks = {}
    $scope.idSelectedVote = null;
    $scope.selectedItemIndex = null;
    $scope.edit = function (data, index) {

        $scope.selectedItemIndex = index;
        $scope.idSelectedVote = index;
        $scope.RG = data.RG
       
        $scope.godown = { selected: { name: data.GODOWN } };
        $scope.description = { selected: { name: data.DESCRIPTION } };
        $scope.remarks = { selected: { name: data.RRMARKS } };
        $scope.lineItemnetweight = data.NETWEIGHT
        $scope.lineItemBaseRate = data.BASERATE
        $scope.lineItemAmount = data.TOTALAMOUNT
        $scope.exciseAssessableValue = data.assesableValue
        $scope.exciseDutyPerUnit = data.exciseDuty / data.NETWEIGHT
        $scope.exciseDutyAmount = data.dutyAmount
        $scope.sadAmount = data.SAD
        $scope.exciseRate = data.exciseRate
        $scope.sadRate = data.sadRate,
        $scope.purchaseRate = data.purchaseRate
        $scope.dutyPerUnit = data.dutyPerUnit
        $scope.sadPerUnit = Number((data.SAD / data.NETWEIGHT).toFixed(2))
    }

    $scope.editItemDetail = function (data, index) {
        $scope.manualIndex = index;
        $scope.CONTNO =      data.CONTNO 
        $scope.INCOMINGDATE = data.INCOMINGDATE
        $scope.LotWeight = data.LotWeight
        $scope.LOCATION = data.LOCATION
        $scope.SUBCATEGORY = data.SUBCATEGORY
        $scope.COILSHEETNO = data.COILSHEETNO
        $scope.GRADE = data.GRADE
        $scope.FINISH = data.FINISH
        $scope.THICKNESS = data.THICKNESS
        $scope.WIDTH = data.WIDTH
        $scope.LENGTH = data.LENGTH
        $scope.NETWEIGHT = data.NETWEIGHT
        $scope.GROSSWT = data.GROSSWT
        $scope.PCSLENGTHINMTRS = data.PCSLENGTHINMTRS
        $scope.TOTALAMOUNTMANUAL = data.TOTALAMOUNTINR

    }
    $scope.exciseCalculate = function () {
        $scope.exciseDutyAmount = Number(((($scope.lineItemnetweight * $scope.lineItemBaseRate) * $scope.exciseRate) / 100).toFixed(2));
        $scope.exciseDutyPerUnit = ($scope.exciseDutyAmount / $scope.lineItemnetweight).toFixed(2);
        $scope.exciseAssessableValue = (Number($scope.lineItemnetweight * $scope.lineItemBaseRate)).toFixed(2);
    }
    $scope.sadCalculate = function () {
        $scope.sadAmount = (($scope.lineItemnetweight * $scope.lineItemBaseRate) * $scope.sadRate) / 100;
        $scope.sadPerUnit = ($scope.sadAmount / $scope.lineItemnetweight).toFixed(2);
    }
    $scope.remarks.selected = { name: '' };
    $scope.godown.selected = { name: '' };
    $scope.getRgNo = function (name) {
        var data = {
            name: name,
            TYPE: $scope.invoiceType
        }
        $http.post(config.login + "getInventoryCount" + "?compCode=" + localStorage.CompanyId ,data).then(function (response) {
            $scope.RG = response.data.count + 1
            console.log(response.data)
            $scope.rgCount = response.data.count + 1
        });
    }
    
    $scope.addBillLineItem = function () {
        var actualdate = moment(getDate($scope.actualDate)).format("DD/MM/YYYY");
        //$scope.GODOWN.push({ type: "GODOWN", name: $scope.newitem });
        if ($scope.invoiceType == 'Import') {
            var billdata = {
                GODOWN: $scope.godown.selected.name,
                RG: $scope.RG,
                DESCRIPTION: $scope.description.selected.name,
                RRMARKS: $scope.remarks.selected.name,
                NETWEIGHT: $scope.lineItemnetweight,
                BALANCE: $scope.lineItemnetweight,
                BASERATE: $scope.lineItemBaseRate,
                TOTALAMOUNT: $scope.lineItemnetweight * $scope.lineItemBaseRate,
               // AMOUNTPERITEM: $scope.lineItemnetweight * $scope.lineItemBaseRate * $scope.ExchangeRateINR,
                AMOUNTINR: $scope.lineItemnetweight * $scope.lineItemBaseRate * $scope.ExchangeRateINR,
                assesableValue: $scope.exciseAssessableValue,
                exciseDuty: '',
                dutyAmount: '',
                SAD: '',
                actualDate: actualdate,
                totalDutyAmt: '',
                purchaseRate: '',
                dutyPerUnit: '',
                sadPerUnit: '',
                TYPE: $scope.invoiceType
            }
        }
        if ($scope.invoiceType == 'Domestic') {
            //var totalamount;
            //if ($scope.exciseChecked && $scope.sadChecked) {
            //    totalamount = Number($scope.lineItemnetweight * $scope.lineItemBaseRate) + Number($scope.exciseDutyAmount) + Number($scope.sadAmount);
            //} else if ($scope.sadChecked) {
            //    totalamount = Number($scope.lineItemnetweight * $scope.lineItemBaseRate) + Number($scope.sadAmount);
            //}
            //else if ($scope.exciseChecked) {
            //    totalamount = Number($scope.lineItemnetweight * $scope.lineItemBaseRate) + Number($scope.exciseDutyAmount);
            //} else {
            //    totalamount = $scope.lineItemnetweight * $scope.lineItemBaseRate;
            //}
            var billdata = {
                RG: $scope.RG,
                GODOWN: $scope.godown.selected.name,
                DESCRIPTION: $scope.description.selected.name,
                RRMARKS: $scope.remarks.selected.name,
                NETWEIGHT: $scope.lineItemnetweight,
                BALANCE: $scope.lineItemnetweight,
                BASERATE: $scope.lineItemBaseRate,
                TOTALAMOUNT: '',
                AMOUNTINR: $scope.lineItemnetweight * $scope.lineItemBaseRate,
                assesableValue: $scope.exciseAssessableValue,
                exciseDuty: $scope.exciseDutyAmount,
                dutyAmount: $scope.exciseDutyAmount,
                SAD: $scope.sadAmount,
                totalDutyAmt: '',
                actualDate: actualdate,
                exciseRate: $scope.exciseRate,
                sadRate: $scope.sadRate,
                purchaseRate: $scope.lineItemBaseRate,
                dutyPerUnit: $scope.exciseDutyPerUnit,
                sadPerUnit: (Number($scope.sadAmount) / Number($scope.lineItemnetweight)).toFixed(2),
                TYPE: $scope.invoiceType
            }
            $scope.manualTableSum();
        }
        if ($scope.selectedItemIndex != null) {
            $scope.billtable[$scope.selectedItemIndex] = billdata;
        } else {
            $scope.billtable.push(billdata);
            $scope.RG = Number($scope.RG) + 1
        }
        $scope.exciseAssessableValue = ''
        $scope.exciseDutyPerUnit = ''
        $scope.exciseRate = ''
        $scope.exciseSAD = ''
        $scope.manualTableSum();
        $scope.selectedItemIndex = null;
    }
    $scope.transformFunction = function (new_value) {
        var new_object = { new_value};
        return new_object;
    }
    $scope.saveItem = function (data) {
        $http.post(config.login + "saveItem", data).then(function (response) {
            $scope.bindMasterData(data.type);
        });
    }
   

    $scope.sad = {}
    $scope.excise = {}
    $scope.exciseLedgerentry = function(){  
        excisetData = {
            accountName: $scope.excise.selected.accountName,
            accountId: $scope.excise.selected.id,
            amount: $scope.totalExcise
        }
        $scope.accountTable.push(excisetData)

    }
     $scope.sadLedgerentry = function(){  
        excisetData = {
            accountName: $scope.sad.selected.accountName,
            accountId: $scope.sad.selected.id,
            amount: $scope.totalSad
        }
        $scope.accountTable.push(excisetData)

    }
   
    $scope.refreshResults = function ($select, type) {
        var search = $select.search,
          list = angular.copy($select.items),
          FLAG = -1;
        list = list.filter(function (item) {
            return item.id !== FLAG;
        });
        if (!search) {
            $select.items = list;
        }
        else {
            var userInputItem = {
                id: FLAG,
                name: search
            };
            $select.items = [userInputItem].concat(list)
            $select.selected = userInputItem.name
        }
    }
    $scope.clear = function ($event, $select) {
        //$event.stopPropagation();
        $select.selected = null;
        $select.search = undefined;

        $timeout(function(){$select.activate()},300);
    }
    $http.get(config.api + "accounts").then(function (response) {
        $scope.account = response.data
    });
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
    //delete item 
    $scope.deleteItem = function (id, type, name, index) {
        var type1
        if (type == "REMARKS") {
            type1 = "[RRMARKS]"
        } else {
            type1 = "["+ type +"]"
        }
        $http.get(config.api + "Inventories/count/" + "?[where]" + type1 + "=" + name).then(function (response) {
            var count = response.data.count
            console.log(response.data);
            if (count == 0) {
                $http.delete(config.api + "masters/" + id).then(function (response) {
                    //$scope.REMARKS = response.data
                });
                if (type == "GODOWN") {
                    // delete $scope.GODOWN[index].name
                    $scope.GODOWN.splice(index, 1);
                } else if (type == "REMARKS") {
                    // delete $scope.REMARKS[index].name
                    $scope.REMARKS.splice(index, 1);
                } else if (type == "DESCRIPTION") {
                    //delete $scope.DESCRIPTION[index].name
                    $scope.DESCRIPTION.splice(index, 1);
                }
            }
            else {
                alert("can not delete")
            }
        });
       
       
    }
    function calculateOpenningBalnce(data, balanceType) {
        var balance;
        if (balanceType == 'credit' && data.credit) {
            balance = Number(data.credit) - Number(data.debit)
        }
        if (balanceType == 'debit') {
            balance = Number(data.debit) - Number(data.credit)
        }
        return balance
    }
    $scope.bindSupplierDetail = function (data) {
        console.log(data.balanceType)
        $scope.shippingAddress = ''
        $scope.email  = ''
        $scope.mobile = ''
        var balanceType = data.balanceType
       
        if (data.balanceType == 'debit') {
            $scope.supplierType = " (Dr.) "
        }else{
            $scope.supplierType = " (Cr.)"
        }
       // var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(data.id).then(function (response) {
            if (response.data) {
                $scope.supplierBalance = response.data.balance
            } else {
                $scope.supplierBalance = 0.00;
            }
        })
        $scope.email = data.email
        if (data.phone != undefined) {
            $scope.mobile = data.mobile == undefined ? data.phone : data.mobile + "," + data.phone
        }
      
        //$scope.mobile = data.mobile + "," + data.phone?
        $scope.shippingAddress = data.billingAddress?data.billingAddress[0].street:null
       
    }
    $scope.bindPurchaseLedgerDetail = function (data) {
        var balanceType = data.balanceType
        if (data.balanceType == 'debit') {
            $scope.purchaseType = " (Dr.) "
        } else {
            $scope.purchaseType = " (Cr.)"
        }
      //  var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(data.id).then(function (response) {
            if (response.data) {
                $scope.purchaseLedgerBalance = response.data.balance
            }
            else {
                $scope.purchaseLedgerBalance = 0.00;
            }
            
        })
    }
    $scope.Accountbtn = function (id, type) {
        $('#formaccount').modal('show');
        if (id != undefined) {
            $http.get(config.api + "accounts/" + id).then(function (response) {
                $scope.myValue = response.data;
                $scope.isAccount = false
            });
        }
        else {
            $scope.myValue = null;
        }
    };
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
    $("tr[id=popover]").popover({ placement: "top", trigger: "hover" });
    $("#myPopover").popover({
        data: $scope.paymentLog,
        content: "<table style='width:100%'><tr><th>Date</th><th>Amount Applied</th><th>Payment No.</th></tr><tr ng-repeat='data in paymentLog'><td>{{data.date}}</td><td>Rs{{data.amount}}</td><td>{{data.vochNo}}</td></tr><tr></tr></table>",
        html: true
    })

    // delete voucher transaction
    $scope.deleteVoucherModal = function () {
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
        $http.get(config.login + "deleteVoucher/" + $stateParams.billNo).then(function (response) {
            if (response.data == "Voucher Deleted") {
                $rootScope.$broadcast('event:success', { message: "Invoice No " + $scope.billNo + " Deleted Succesfully" });
                $stateParams.billNo = null;
                window.history.back();
                $state.reload();
            }
            else {
                $rootScope.$broadcast('event:error', { message: response.data });
            }
        });
    }

    //down load attachment
    $scope.downloadAttachments = function () {
        var zip = new JSZip();
        angular.forEach($scope.attachements, function (item) {
            var path = item.cdnPath.substring(item.cdnPath.lastIndexOf('/') + 1);
            var url = config.login + "getfile?path=" + path;
            var filename = item.file.name.replace(/.*\//g, "");
            zip.file(filename, urlToPromise(url), { binary: true });
        });
        zip.generateAsync({ type: "blob" }, function updateCallback(metadata) {
            var msg = "progression : " + metadata.percent.toFixed(2) + " %";
            if (metadata.currentFile) {
                msg += ", current file = " + metadata.currentFile;
            }
            console.log(msg);
        })
        .then(function callback(blob) {
            // see FileSaver.js
            saveAs(blob, $stateParams.voId + ".zip");
        }, function (e) {
        });

        return false;
    };
    //get existing bill
    $scope.getExistingBill = function (billNo) {
        $http.get(config.login + "isVoucherExist/" + encodeURI(billNo)).then(function (response) {
            if(response.data.id) {
                $scope.existingEnvoiceId = response.data.id
                $('#invoiceExist').modal('show');        
            }
            return;      
        });
    }

    $(":file").filestyle({ buttonName: "btn-sm btn-info" });
    var type = $stateParams.type;
    var uploader = $scope.uploader = new FileUploader({
        url: config.login + "upload"
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS
    uploader.onAfterAddingFile = function (fileItem) {
        if (fileItem.isOld && $scope.oldAttachment) {
            fileItem.title = $scope.oldAttachment.title;
            fileItem.cdnPath = $scope.oldAttachment.cdnPath;
        } else {
            console.info('onAfterAddingFile', fileItem);
            if ($scope.filename) {
                fileItem.title = $scope.filename;
                $scope.filename = null;
            } else {
                uploader.removeFromQueue(fileItem);// = null;
                fileItem = {};
            }
        }

    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        fileItem.cdnPath = response.name;
    };

}]);



myApp.directive('addItem', function ($compile, $templateCache) {
    var getTemplate = function () {
        return $templateCache.get("addItem_template.html");
    }
    return {
        restrict: "A",
        transclude: true,
        template: "<span ng-transclude></span>",
        link: function (scope, element, attrs) {
            var popOverContent;
            if (true) {
                var html = getTemplate();
                popOverContent = $compile(html)(scope);
                var options = {
                    content: popOverContent,
                    placement: "top",
                    html: true,
                    title: scope.title,
                };
                $(element).popover(options);
            }
        },
        scope: {
            itemtype: '=',
            title: '@'
        }
    };
});

//excise
myApp.directive('exciseInfo', function ($compile, $templateCache) {
    var getTemplate = function () {
        return $templateCache.get("exciseInfo_template.html");
    }
    return {
        restrict: "A",
        transclude: true,
        template: "<span ng-transclude></span>",
        link: function (scope, element, attrs) {
            var popOverContent;
            if (true) {
                var html = getTemplate();
                popOverContent = $compile(html)(scope);
                var options = {
                    content: popOverContent,
                    placement: "top",
                    html: true,
                    title: scope.title,
                };
                $(element).popover(options);
            }
        },
        scope: {
            excisedata: '='
        }
    };
});


