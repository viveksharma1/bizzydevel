myApp.controller('ReceivePaymentCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', '$stateParams', 'config', '$filter', function ($scope, $http, $timeout, $rootScope, $state, $stateParams, config, $filter) {

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
        $http.get(config.api + "voucherTransactions/count" + "?[whrer][type]= Receive Payment").then(function (response) {
            $scope.paymentNo = response.data.count + 1;
            console.log(response);
        });
    }
    $scope.getSupplier = function () {
        $http.get(config.api + "suppliers").then(function (response) {
            $scope.partyAccounts = response.data
            console.log($scope.partyAccounts);
        });
    }
    $scope.getAccount = function () {
        $http.get(config.login + "getPaymentAccount").then(function (response) {
            $scope.bankAccounts = response.data
            console.log($scope.bankAccounts);
        });
    }
    $scope.paymentData = [];
    $scope.transaction = []
    
    $scope.getAllBill = function (name) {
        $http.get(config.login + "getVoucherData" + "?customerName=" + name).then(function (response) {
            $scope.paymentData = response.data
            $scope.paidData = $scope.paymentData;
            console.log($scope.transaction);

           
        });
    }

    var savepaymentamount;
    $scope.payBill = function (amount, balance, index, paymentamount, id) {
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
        if (voType == 'Sales Invoice') {

            $state.go('Customer.SalesInvoice', { voId: id });
        }
        if (voType == 'General Invoice') {

            $state.go('Customer.GeneralInvoice', { voId: id });
        }



    }

    $scope.receivePayment = function () {

        var data = {
            compCode: localStorage.CompanyId,
            type: "Receive Payment",
            role: localStorage['usertype'],
            date: $scope.dateFormat($scope.paymentdate),
            amount: $scope.totalPaidAmount,
            vochNo: $scope.paymentNo,
            state: "PAID",
            remark: $scope.paymentRemarks,
            vo_payment: {
                bankAccount: $scope.bankAccount.selected.accountName,
                partyAccount: $scope.partyAccount.selected.company,
                paymentAmount: $scope.totalPaidAmount,
                currency: $scope.currency,
                exchangeRate: $scope.exchangeRate,
                remarks: $scope.customReamarks,
               
                billDetail: $scope.paidData
            },
        }
        $http.post(config.login + 'receivePayment?id='+ $stateParams.voId, data)
                 .then(function (response) {



                 });

    }
    $('#paymentdate').datepicker("setDate", new Date());

    $('#paymentdate').datepicker().on('changeDate', function (ev) {
        $('.datepicker').hide();
    });

    $scope.paidData = [];
    $scope.getPaymentdata = function (id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                    .then(function (response) {
                        console.log(response);


                        $scope.state = response.data.state;
                        $scope.transaction = response.data.vo_payment.billDetail;
                        $scope.paymentData = $scope.transaction;
                      

                        angular.copy($scope.transaction, $scope.paidData);
                        console.log($scope.paidData)
                        $scope.totalPaidAmount = response.data.amount
                        $scope.paymentNo = response.data.vochNo
                        $scope.bankAccount = { selected: { accountName: response.data.vo_payment.bankAccount } };
                        console.log(response.data.vo_payment.bankAccount);
                        $scope.partyAccount = { selected: { company: response.data.vo_payment.partyAccount } };
                        $scope.paymentdate = $filter('date')(response.data.date, 'dd/MM/yyyy');

                    });
    }

    if ($stateParams.voId) {
        $scope.getPaymentdata($stateParams.voId);

        if (!$scope.billDetail) {

            // $('#Outstandingdiv').hide();

        }
    }
    else {
        $scope.$watch('partyAccount.selected', function () {
            if ($scope.partyAccount.selected.company) {
                if (localStorage['usertype'] == '2') {
                   
                    $scope.getAllBill($scope.partyAccount.selected.company);
                }
                else {
                 
                    $scope.getAllBill($scope.partyAccount.selected.company);

                }
            }

        });
    }







}]);