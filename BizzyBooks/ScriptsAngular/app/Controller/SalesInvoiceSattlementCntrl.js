myApp.controller('SalesInvoiceSattlementCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $scope.goBack = function () {
        window.history.back();
    }
    $('#InvoiceDate').datepicker();

    $scope.settlementData = {};
    // add new account 
    $scope.add = function (type, value) {
        $('#formaccount').modal('show');
        $scope.myValue = { accountName: value };
        $scope.getSupplier();
    }
    // edit account
    $scope.Accountbtn = function (id, type) {
        if (type) {
            console.log(id);
            $('#formaccount').modal('show');
            if (id != undefined) {
                $http.get(config.api + "accounts/" + id).then(function (response) {
                    console.log(response);
                    $scope.myValue = response.data;
                    $scope.isAccount = false
                });
            }
            else {
                $scope.myValue = null;
            }
        }
    };

    //get all account


    function getAccount() {
        $http.get(config.api + "accounts").then(function (response) {
            if (response.data.length > 0) {
                $scope.account = response.data;
            } else {
                showErrorToast("some enternal problem");
            }
        });
    }
    getAccount();
    $scope.otaxAccount = {}
    $scope.vatAccount = {}
    function getCount() {
        $http.get(config.login + "getVoucherTransactionCount/" + "Purchase settlement").then(function (response) {
            if (response) {
                $scope.voRefNo = response.data.count;
                $scope.settlementData.voRefNo = $scope.voRefNo
            }
        });
    }

    if ($stateParams.voId) {
        $http.get(config.api + "voucherTransactions/" + $stateParams.voId).then(function (response) {
            $scope.settlementData = response.data
            console.log($scope.settlementData)
            $scope.supplierName = localStorage[$scope.settlementData.supplier];
            $scope.supplierName = localStorage[$scope.settlementData.supplier];
            $scope.vatAccount.selected = $scope.settlementData.vatAccount
            $scope.vatAccount = { selected: { accountName: localStorage[$scope.settlementData.vatAccount], id: $scope.settlementData.vatAccount } };
            $scope.otaxAccount = { selected: { accountName: localStorage[$scope.settlementData.otaxAccount], id: $scope.settlementData.otaxAccount } };
        });
    }
    else {
        $stateParams.voId = null
        getCount();
    }
    $scope.saveSettlement = function () {
        if ($scope.settlementData.vatPerKg) {
            $scope.settlementData.ledgerDataFirst = { amount: $scope.settlementData.vatAmountPerKg, accountId: $scope.settlementData.supplier }
        }
        else {
            $scope.settlementData.ledgerDataFirst = { amount: $scope.settlementData.interestAmount, accountId: $scope.settlementData.supplier }
        }
        var amount = $scope.settlementData.vatAmount > $scope.settlementData.interestAmount ? $scope.settlementData.vatAmount : $scope.settlementData.interestAmount

        $scope.settlementData.ledgerDataSecond = { amount: $scope.settlementData.totalDedvatAmount, accountId: $scope.vatAccount.selected.id }
        if ($scope.settlementData.totalDedvatAmount) {
            $scope.settlementData.ledgerDataThird = { amount: $scope.settlementData.totalDedExciseAmount, accountId: $scope.otaxAccount.selected.id }

        }
        $scope.settlementData.compCode = localStorage.CompanyId
        $scope.settlementData.invoiceNo = $scope.invoiceNo
        $scope.settlementData.vatAccount = $scope.vatAccount.selected.id
        $scope.settlementData.type = "Purchase settlement"
        $scope.settlementData.otaxAccount = $scope.otaxAccount.selected.id
        delete $scope.settlementData._id;

        $http.post(config.login + "purchaseSettelment/" + $stateParams.voId, $scope.settlementData).then(function (response) {
            if (response.data) {
                $stateParams.voId = response.data.id
                console.log(response.data);
                $state.go('Customer.PurchaseInvoiceSattlement', { voId: response.data.id });

            }

        });
        console.log($scope.settlementData)
    }
    $scope.calculateinterest = function (rate, amount) {
        $scope.settlementData.interestAmount = ((Number(amount) * rate) / 100).toFixed(2);
        $scope.settlementData.totalDedvatAmount = Number($scope.settlementData.vatAmount) > Number($scope.settlementData.interestAmount) ? $scope.settlementData.interestAmount : $scope.settlementData.vatAmount
        $scope.settlementData.totalDedExciseAmount = $scope.settlementData.interestAmount < $scope.settlementData.vatAmount ? 0 : $scope.settlementData.interestAmount - $scope.settlementData.totalDedvatAmount
        console.log($scope.totalDedvatAmount);
    }

    $scope.getInvoice = function (invoiceNo) {
        $http.post(config.login + "voucherTransactionsExist/" + $scope.invoiceNo).then(function (response) {
            if (response.data.count > 0) {

                //showErrorToast("Invoice No  Exist");
                $stateParams.voId = response.data.id

                $state.go('Customer.PurchaseInvoiceSattlement', { voId: response.data.id });
                $state.reload();

            }
            else if (response.data.count == 0) {
                $http.get(config.login + "getInvoiceSett/" + invoiceNo).then(function (response) {
                    console.log(response.data)
                    if (response.data.length > 0) {
                        $scope.settlementData = response.data[0];
                        getCount();
                        $scope.settlementData.totalQty = calculateTotalQty($scope.settlementData.totalLineItemData)
                        console.log($scope.settlementData.totalQty)
                        $scope.supplierName = localStorage[$scope.settlementData.supplier];
                    } else if (response.data.status == "Not Found") {
                        showErrorToast("Invoice No Does not Exist");
                    }
                });
            }
        });

    }
    $scope.vatDedPerkg = function () {
        var dedPerKg = (Number($scope.settlementData.excisePerKg) + Number($scope.settlementData.vatPerKg)) - Number($scope.settlementData.totalDedPerKg)
        console.log(dedPerKg);
        if (Number($scope.settlementData.vatPerKg) > Number(dedPerKg)) {
            $scope.settlementData.totalDedvatAmount = dedPerKg * $scope.settlementData.totalQty
            $scope.settlementData.totalDedExciseAmount = 0;
        }
        if (Number($scope.settlementData.vatPerKg) < Number(dedPerKg)) {
            $scope.settlementData.totalDedvatAmount = $scope.settlementData.vatPerKg * $scope.settlementData.totalQty
            $scope.settlementData.totalDedExciseAmount = Number(dedPerKg) * Number($scope.settlementData.totalQty) - Number($scope.settlementData.totalDedvatAmount)
        }

        //$scope.settlementData.vatAmountPerKg = totalDedvatAmount

    }
    function calculateTotalQty(data) {
        if (data) {
            var qty = 0;
            var excise = 0;
            for (var i = 0; i < data.length; i++) {
                qty += data[i].NETWEIGHT;
                excise += Number(data[i].dutyAmount);
            }
            $scope.settlementData.exciseAmount = excise
            console.log($scope.excise)
            return qty;
        }
        else {
            return
        }


    }
    $scope.bindSupplierName = function (supplierId) {
        return localStorage["supplierId"];
    }


}]);

