﻿myApp.controller('SalesInvoiceSattlementCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter) {

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

    $scope.clear = function ($event, $select) {
        $event.stopPropagation();
        $select.selected = null;
        $select.search = undefined;
        $timeout(function () { $select.activate() }, 300);
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

    $scope.isDisabled = false;
    $scope.isDisabled1 = false;
    $scope.selectBox = function (type) {
        if (type == "interest") {
            $scope.isDisabled = false;
            $scope.isDisabled1 = true;

        }
        if (type == "perKg") {
            $scope.isDisabled1 = false;
            $scope.isDisabled = true;
        }
    }

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
    $scope.$on("event:accountReferesh", function (event, args) {
        // Refresh accounts...
        getAccount();
    });
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
            $scope.invoiceNo = $scope.settlementData.invoiceNo
            $scope.customerName = localStorage[$scope.settlementData.customer];
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

        $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
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

        // get count of purchaseSettelment
        $http.post(config.login + "purchaseSettelment/" + $stateParams.voId, $scope.settlementData).then(function (response) {
            if (response.data) {
                $stateParams.voId = response.data.id
                console.log(response.data);
                $rootScope.$broadcast('event:success', { message: "Purchase Settelment Done" });
                $state.go('Customer.PurchaseInvoiceSattlement', { voId: response.data.id });

            }

        });
        console.log($scope.settlementData)
    }
    // calculate interest
    $scope.calculateinterest = function (rate, amount) {
        $scope.settlementData.interestAmount = ((Number(amount) * rate) / 100).toFixed(2);
        $scope.settlementData.totalDedvatAmount = Number($scope.settlementData.vatAmount) > Number($scope.settlementData.interestAmount) ? Number(Number($scope.settlementData.interestAmount).toFixed(2)) : Number(Number($scope.settlementData.vatAmount).toFixed(2))
        $scope.settlementData.totalDedExciseAmount = Number($scope.settlementData.interestAmount) > Number($scope.settlementData.vatAmount) ? ($scope.settlementData.interestAmount - $scope.settlementData.totalDedvatAmount).toFixed(2) : 0
        console.log($scope.totalDedvatAmount);
    }



    $scope.getInvoice = function (invoiceNo) {
        $http.post(config.login + "voucherTransactionsExist/" + $scope.invoiceNo).then(function (response) {
            if (response.data.count > 0) {
                $rootScope.$broadcast('event:success', { message: "Purchase  Sattlement Exist.." });
                $stateParams.voId = response.data.id;
                $state.go('Customer.PurchaseInvoiceSattlement', { voId: response.data.id });
                $state.reload();

            }
            else if (response.data.count == 0) {
                $rootScope.$broadcast('event:progress', { message: "Please wait getting invoice.." });
                $http.get(config.login + "getSalesInvoice/" + invoiceNo).then(function (response) {
                    console.log(response.data)
                    if (response.data.length > 0) {
                        $scope.settlementData = response.data[0];
                        getCount();
                        $scope.settlementData.totalQty = calculateTotalQty($scope.settlementData.totalLineItemData)
                        console.log($scope.settlementData.totalQty)
                        $scope.customerName = localStorage[$scope.settlementData.customer];
                        swal.close();
                    } else if (response.data.status == "Not Found") {
                        $rootScope.$broadcast('event:error', { message: "Invoice No Does not Exist" });

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
                qty += Number(data[i].itemQty);
                excise += Number(data[i].dutyPerUnit);
            }
            if (excise) {
                $scope.settlementData.exciseAmount = (excise * qty).toFixed(2)
            }
            return Number(qty.toFixed(2));
        }
        else {
            return
        }


    }
    $scope.bindSupplierName = function (supplierId) {
        return localStorage["supplierId"];
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
    $scope.bindVatAccountDetail = function (data) {
        console.log(data.balanceType)
        var balanceType = data.balanceType
        if (data.balanceType == 'debit') {
            $scope.supplierType = " (Dr.) "
        } else {
            $scope.supplierType = " (Cr.)"
        }
        var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(url, [localStorage.CompanyId]).then(function (response) {
            if (response.data.openingBalance) {
                $scope.vatAccountBalance = Math.abs(calculateOpenningBalnce(response.data.openingBalance, balanceType))
            } else {
                $scope.vatAccountBalance = 0.00;
            }
        })
    }
    $scope.bindOTaxAccountDetail = function (data) {
        console.log(data.balanceType)
        var balanceType = data.balanceType
        if (data.balanceType == 'debit') {
            $scope.supplierType = " (Dr.) "
        } else {
            $scope.supplierType = " (Cr.)"
        }
        var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(url, [localStorage.CompanyId]).then(function (response) {
            if (response.data.openingBalance) {
                $scope.oTaxBalance = Math.abs(calculateOpenningBalnce(response.data.openingBalance, balanceType))
            } else {
                $scope.oTaxBalance = 0.00;
            }
        })
    }

}]);

myApp.directive('salesInfo', function ($compile, $templateCache) {
    var getTemplate = function () {
        //$templateCache.put('templateId.html', 'This is the content of the template');
        //console.log($templateCache.get("addItem_template.html"));
        return $templateCache.get("salesInfo_template.html");
    }
    return {

        restrict: "A",
        transclude: true,
        template: "<span ng-transclude></span>",
        link: function (scope, element, attrs) {
            var popOverContent;
            if (true) {
                //console.log(itemtype)
                var html = getTemplate();
                popOverContent = $compile(html)(scope);
                var options = {
                    content: popOverContent,
                    placement: "bottom",
                    html: true,
                    title: scope.title,
                };
                $(element).popover(options);
            }
        },
        scope: {
            billdata: '=',
            exciseData: '='

        }


    };
});