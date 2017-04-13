﻿myApp.controller('MakePaymentCntrl', ['$scope', '$http', '$stateParams', '$timeout', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $stateParams, $timeout, myService, $rootScope, $state, config, $filter) {

    $.fn.datepicker.defaults.format = "dd/mm/yyyy";
    localStorage["type1"] = "PAYMENT"
    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        window.history.back();
    },
     $scope.popuclose = function () {
         $('#form-popoverPopup').hide();
     }

     $('#PaymentdateCheque').datepicker("setDate", new Date());
    $scope.popuclose = function () {
        $('#form-popoverPopup').hide();
    }

    $scope.add = function () {

        $('#form-popoverPopup').show();


    };
    $scope.Accountbtn = function () {
        $('#AccountModal').modal('show');
    };

    $('.parentaccount > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")


    });

    $('.parentaccount li a').click(function () {
        $(this).addClass('select').siblings().removeClass('select');
    });

    $('#asofdate').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    });
    $scope.Accountbtn = function () {
        $('#formaccount').modal('show');
    };


    $scope.add3 = function () {
        $('#formaccount').modal('show');
    };
    $('#SearchFilter').keyup(function () {
        var searchText = $(this).val();
        $('.parentaccount > li a').each(function () {
            var currentLiText = $(this).text().toLowerCase();
            showCurrentLi = currentLiText.indexOf(searchText) !== -1;
            $(this).toggle(showCurrentLi);
        });

    });

    var files, res;

    document.getElementById("uploadBtn").onchange = function (e) {
        e.preventDefault();

    };
    document.getElementById('uploadBtn').onchange = uploadOnChange;

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

    }

    $(document).on("click", "#upload_prev span", function () {
        res.splice($(this).index(), 1);
        $(this).remove();
       

    });

    $scope.no = $stateParams.poNo;
    $scope.bankAccount = {}
    $scope.partyAccount = {}
    $('#paymentdate').datepicker();
    $scope.dateFormat = function (date) {
        var res = date.split("/");
        console.log(res);
        var month = res[1];
        var days = res[0]
        var year = res[2]
        var date = month + '/' + days + '/' + year;
        return date;
    }
    $scope.getVoucherCount = function () {
        $http.get(config.api + "voucherTransactions/count" + "?[whrer][type]=Payment").then(function (response) {
            $scope.paymentNo = response.data.count
           
        });
    }
    $scope.getSupplier = function () {
        $http.get(config.login + "getSupplierAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.partyAccounts = response.data
            
        });
    }
    $scope.getAccount = function () {
        $http.get(config.login + "getPaymentAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.bankAccounts = response.data
            
        });
    }
    $scope.paymentData = [];
    $scope.transaction = []
    $scope.createPaymentData = function (role) {
        if (role == '2') {
            for (var i = 0; i < $scope.transaction.length; i++) {
                $scope.paymentData.push({
                    date: $scope.transaction[i].date, billDueDate: $scope.transaction[i].billDueDate, id: $scope.transaction[i].id, amount: $scope.transaction[i].amount, no: $scope.transaction[i].no
                    , ordertype: $scope.transaction[i].ordertype, balance: $scope.transaction[i].balance
                });
            }

        }
        if (role == '3') {
            for (var i = 0; i < $scope.transaction.length; i++) {
                $scope.paymentData.push({
                    date: $scope.transaction[i].date, billDueDate: $scope.transaction[i].billDueDate, id: $scope.transaction[i].id, amount: $scope.transaction[i].adminAmount, no: $scope.transaction[i].no
                    , ordertype: $scope.transaction[i].ordertype, balance: $scope.transaction[i].adminBalance
                });
            }
        }

        $scope.paidData = $scope.transaction;

       
    }
   
    $scope.getAllBill = function (supliersId, fields) {
       
        $http.get(config.api + "transactions" + "?[filter][where][supliersId]=" + supliersId + fields).then(function (response) {
            if (response.data[0]) {
                $scope.paymentData = [];
                console.log(response);
                angular.copy(response.data, $scope.transaction);              
                $scope.createPaymentData(localStorage['usertype']);
            }
            else {
                $scope.paymentData = [];
                showSuccessToast("No Open Invoice");
            }
        });
    }
    
    var savepaymentamount;
    $scope.payBill = function (amount,balance, index, paymentamount, id) {

        
        if (savepaymentamount == paymentamount) {
            return;
        }
        else {
            if (balance >= paymentamount && paymentamount > 0) {
                if (amount == balance) {
                    var paidAmount = Number(amount - paymentamount);
                }
                else {
                    var paidAmount = Number(balance - paymentamount);
                }
                $scope.paidData[index].balance = paidAmount;
                $scope.paidData[index].amountPaid = paymentamount;
            }
        }
        console.log($scope.paidData)
        var savepaymentamount = paymentamount;
        $scope.paidDataTotal = paidData;
    }

    $scope.getAccount();
    $scope.getSupplier();
    $scope.getVoucherCount();
   
    $scope.openTransaction = function (id, voType) {

        if (voType == 'BILL') {

            $state.go('Customer.Bill', { billNo: id });
        }
        if (voType == 'Expense') {

            $state.go('Customer.Expense', { expenceId: id });
        }
       


    }

    $scope.savePayment = function () {
        
        var data = {
            compCode: localStorage.CompanyId,
            type: "Payment",
            role:localStorage['usertype'],
            date: $scope.dateFormat($scope.paymentdate),
            amount: $scope.totalPaidAmount,
            vochNo: $scope.paymentNo,
            state: "PAID",
            remark: $scope.paymentRemarks,
            vo_payment: {
                bankAccountId: $scope.bankAccount.selected.id,
                partyAccountId: $scope.partyAccount.selected.id,
                paymentAmount: $scope.totalPaidAmount,
                currency: $scope.currency,
                exchangeRate: $scope.exchangeRate,
                remarks: $scope.customReamarks,
                billDetail: $scope.paidData
            },
        }
        $http.post(config.login + 'payment', data)
                 .then(function (response) {



                 });

    }
    $('#paymentdate').datepicker("setDate", new Date());

    $('#paymentdate').datepicker().on('changeDate', function (ev) {
        $('.datepicker').hide();
    });

  
    $scope.getPaymentdata = function (id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                    .then(function (response) {
                        console.log(response);
                      
                       
                        $scope.state = response.data.state;
                        $scope.transaction = response.data.vo_payment.billDetail;
                        $scope.paymentData = $scope.transaction;
                        $scope.totalPaidAmount = response.data.amount
                        $scope.paymentNo = response.data.vochNo
                        $scope.bankAccount = { selected: { accountName: localStorage[response.data.vo_payment.bankAccountId], id: response.data.vo_payment.bankAccountId } };
                        $scope.partyAccount = { selected: { accountName: localStorage[response.data.vo_payment.partyAccount], id: response.data.vo_payment.partyAccount } };
                       
                       
                       
                        $scope.paymentdate = $filter('date')(response.data.date, 'dd/MM/yyyy');
                       
                    });
    }

    if ($stateParams.voId) {        
            $scope.getPaymentdata($stateParams.voId);   
        if (!$scope.billDetail) {
            // $('#Outstandingdiv').hide();
        }
    }

    "get open invoice"
    $scope.getOpenInvoice = function() {      
            if (localStorage['usertype'] == '2') {
                var fields = '&filter[fields][adminAmount]=false&filter[fields][adminBalance]=false&[filter][where][balance][gt]=0'
                $scope.getAllBill($scope.partyAccount.selected.id, fields);
            }
            else {
                var fields = '&filter[fields][amount]=false&filter[fields][balance]=false&[filter][where][adminBalance][gt]=0'
                $scope.getAllBill($scope.partyAccount.selected.id, fields);
            }
       

    }
   
    

   
   



}]);