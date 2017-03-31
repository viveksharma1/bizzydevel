myApp.controller('ReceivePaymentCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', '$stateParams','config', function ($scope, $http, $timeout, $rootScope, $state, $stateParams, config) {


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






    //get suppliers 


    $scope.accounts = {};
    //$scope.accountName1 = $scope.accounts.selected.accountName;


    $scope.$watch('accounts.selected', function () {
        if ($scope.accounts.selected.accountName != undefined) {

            $http.get(config.api + 'accounts' + '?filter[where][accountName]=' + $scope.accounts.selected.accountName).then(function (response) {
                $scope.accountBalance = response.data;
                $scope.accountbBalance = $scope.accountBalance[0].credit - $scope.accountBalance[0].debit;


            });


        }

    });

    $http.get(config.api + "suppliers").then(function (response) {
        $scope.supliers = response.data;
    });
    console.log($stateParams.suppliers)
    if ($stateParams.poNo != null) {
        $scope.supplier = { selected: { company: $stateParams.suppliers } };
    }





    $http.get(config.api + 'customerTransaction' + '?filter[where][no]=' + $scope.no)
    .success(function (data) {

        if (data.length > 0) {
            $scope.bill = data;
            $scope.amount = data[0].amount;


            $scope.email = data[0].email;

            if (data[0].balance == null) {


                $scope.bill[0].balance = data[0].amount;
                $scope.balance = data[0].amount;

                console.log($scope.balance)
            }
            else {
                $scope.balance = data[0].balance;
            }

            if ($scope.balance == 0) {
                $scope.status = "PAID";
            }


        }






    });




    // Make payement 

    $scope.makePayment = function () {


        var paymentAmount = $("#abc").val();

        if (!paymentAmount) {

            $('#ammountAlert').modal('show');
        }
        else {


            if ($scope.accounts.selected == undefined) {

                $('#accountAlert').modal('show');
            }
            else {

                $("#addInventryModal1").modal("show");

                $scope.paidAmount = Number(paymentAmount);
                $scope.newAmount = Number($scope.balance - paymentAmount);


                if ($scope.newAmount != '0') {
                    var data = {
                        amount: $scope.amount,
                        status: ['OPEN'],
                        balance: $scope.newAmount
                    }
                    $http.post(config.api + 'transactions' + '/update' + '?[where][no]=' + $scope.no, data).success(function (data) {

                    });
                }
                else {

                    var data = {
                        amount: $scope.amount,
                        status: ['CLOSED'],
                        balance: $scope.newAmount
                    }
                    $http.post(config.api + 'transactions' + '/update' + '?[where][no]=' + $scope.no, data).success(function (data) {

                    });

                }


                var date = $("#PaymentdateCheque").val()

                $scope.No = "REF " + $scope.no
                var data1 = {
                    compCode: localStorage.CompanyId,
                    supliersName: $scope.supplier.selected.company,
                    email: $scope.email,
                    ordertype: "PAYMENT",
                    date: date,
                    no: $scope.No,
                    balance: $scope.newAmount,

                    amount: $scope.paidAmount



                }

                var data2 = {
                    compCode: localStorage.CompanyId,
                    supliersName: $scope.supplier.selected.company,
                    accountName: $scope.accounts.selected.accountName,
                    email: $scope.email,
                    date: date,
                    no: $scope.no,
                    particular: $scope.supplier.selected.company,
                    credit: 0,
                    type: 'Payment',
                    debit: $scope.paidAmount.toFixed(2),
                    value: $scope.paidAmount.toFixed(2),
                    Inventory: {
                        compCode: localStorage.CompanyId,
                        supliersName: $scope.supplier.selected.company,
                        accountName: $scope.supplier.selected.company,
                        email: $scope.email,
                        date: date,
                        no: $scope.no,
                        particular: $scope.accounts.selected.accountName,
                        credit: 0,
                        type: 'Bill Payment',
                        debit: $scope.paidAmount.toFixed(2),
                        value: $scope.paidAmount.toFixed(2),
                    }
                }



                $http.post(config.login + "transaction", data2).then(function (response) {

                });






                $http.post(config.api + 'transactions', data1)
                      .success(function (data) {
                          $("#addInventryModal1").modal("hide");
                      });
            }
        }
    }



    $http.get(config.api + "accounts" + "?[filter][where][type]=" + "Bank").then(function (response) {
        $scope.account = response.data;
    })

    //create Account

    $scope.createAccount = function () {

        var accountData = {
            compCode: localStorage.CompanyId,
            accountName: $scope.accountName,
            category: '',
            group: $scope.accountgroup,
            type: $scope.accountType,
            balance: $scope.balance,
            credit: 0,
            debit: 0
        }


        $http.post(config.api + "accounts", accountData).then(function (response) {
        });

    }



}]);