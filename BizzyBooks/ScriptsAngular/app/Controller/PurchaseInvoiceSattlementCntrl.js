myApp.controller('PurchaseInvoiceSattlementCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', 'authService', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter, authService) {

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


    if ($stateParams.voId) {
        $http.get(config.api + "voucherTransactions/" + $stateParams.voId).then(function (response) {
            $scope.settlementData = response.data

        });

    }
    $scope.saveSettlement = function () {
        var amount = $scope.settlementData.vatAmount > $scope.settlementData.interestAmount ? $scope.settlementData.vatAmount : $scope.settlementData.interestAmount
        $scope.settlementData.ledgerDataFirst = { amount: amount, accountId: $scope.settlementData.supplier }
        $scope.settlementData.ledgerDataSecond = { amount: $scope.settlementData.totalDedvatAmount, accountId: $scope.settlementData.selected.id }
        $scope.settlementData.ledgerDataThird = { amount: $scope.settlementData.totalDedExciseAmount, accountId: $scope.otaxAccount.selected.id }
        $scope.settlementData.refNo = 1;
        $scope.settlementData.compCode = localStorage.CompanyId
        $scope.settlementData.invoiceNo = $scope.invoiceNo
        
        $http.post(config.login + "purchaseSettelment", $scope.settlementData).then(function (response) {
            if (response.data) {
                $stateParams.voId = response.data
                $state.go('Customer.PurchaseInvoiceSattlement', { voId: response.data });

            }
            
        });
        console.log($scope.settlementData)     
    }
    $scope.calculateinterest = function (rate,amount) {
        $scope.settlementData.interestAmount = ((Number(amount) * rate) / 100).toFixed(2);
        $scope.settlementData.totalDedvatAmount = Number($scope.settlementData.vatAmount) > Number($scope.settlementData.interestAmount) ? $scope.settlementData.interestAmount : $scope.settlementData.vatAmount
        $scope.settlementData.totalDedExciseAmount = $scope.settlementData.interestAmount < $scope.settlementData.vatAmount ? 0 : $scope.settlementData.interestAmount - $scope.settlementData.totalDedvatAmount
        console.log($scope.totalDedvatAmount);
    }
    
    $scope.getInvoice = function (invoiceNo) {
        $http.get(config.login + "getInvoice/" + invoiceNo).then(function (response) {
            console.log(response.data)
            if (response.data.length > 0) {
                $scope.settlementData = response.data[0];
                $scope.settlementData.totalQty = calculateTotalQty($scope.settlementData.totalLineItemData)
                console.log($scope.settlementData.totalQty)
                $scope.supplierName = localStorage[$scope.settlementData.supplier];
            } else {
                showErrorToast("Invoice No Does not Exist");
            }
        });

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
    $scope.bindSupplierName = function(supplierId) {
        return localStorage["supplierId"];
    }

  
}]);

myApp.directive('billInfo', function ($compile, $templateCache) {
    var getTemplate = function () {
        //$templateCache.put('templateId.html', 'This is the content of the template');
        //console.log($templateCache.get("addItem_template.html"));
        return $templateCache.get("billInfo_template.html");
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