myApp.controller('PurchaseInvoiceSattlementCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', 'authService', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter, authService) {

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
    $scope.selectBox = function(type) {
        if (type == "interest") {
            $('#interest').addClass('active');

            $scope.isDisabled = false;
            $scope.isDisabled1 = true;
            
        }
        if (type == "perKg") {
            $('#perKg').addClass('active');
            $scope.vatPerKg = true
           // $scope.settlementData.vatPerKg = Number((Number($scope.settlementData.vatAmount) / Number($scope.settlementData.totalQty)).toFixed(2))
          //  $scope.settlementData.excisePerKg = Number((Number($scope.settlementData.exciseAmount) / Number($scope.settlementData.totalQty)).toFixed(2))
           // $scope.settlementData.totalDedPerKg = ((Number($scope.settlementData.vatAmount) + Number($scope.settlementData.exciseAmount)) / Number($scope.settlementData.totalQty)).toFixed(2)
            calculateDedPerKg(type);
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
            $scope.invoiceNo =  $scope.settlementData.invoiceNo
            $scope.supplierName = localStorage[$scope.settlementData.supplier];
            $scope.supplierName = localStorage[$scope.settlementData.supplier];
            $scope.vatAccount.selected = $scope.settlementData.vatAccount
            $scope.vat = $scope.settlementData.vat
            $scope.lessPerkg = $scope.settlementData.lessPerkg
            $scope.vatAccount = { selected: { accountName: localStorage[$scope.settlementData.vatAccount], id: $scope.settlementData.vatAccount } };
            $scope.otaxAccount = { selected: { accountName: localStorage[$scope.settlementData.otaxAccount], id: $scope.settlementData.otaxAccount } };
           

            $scope.selectBox(response.data.dedType)
        });
    }
    else {
        $stateParams.voId = null
        getCount();
    }
    $scope.saveSettlement = function () {

        $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
        if ($scope.vatPerKg) {
            $scope.settlementData.ledgerDataFirst = { amount: $scope.settlementData.totalLessPerKg, accountId: $scope.settlementData.supplier }
        }
        else {
            $scope.settlementData.ledgerDataFirst = { amount: $scope.settlementData.interestAmount, accountId: $scope.settlementData.supplier }
        }
        var amount = $scope.settlementData.vatAmount > $scope.settlementData.interestAmount ? $scope.settlementData.vatAmount : $scope.settlementData.interestAmount
       
            $scope.settlementData.ledgerDataSecond = { amount: $scope.settlementData.totalDedvatAmount, accountId: $scope.vatAccount.selected.id }
            if ($scope.settlementData.totalDedvatAmount) {
                $scope.settlementData.ledgerDataThird = { amount: $scope.settlementData.totalDedExciseAmount, accountId: $scope.otaxAccount.selected.id }
                
            }
            $scope.settlementData.vat = $scope.vat
            $scope.settlementData.lessPerkg = $scope.lessPerkg
            $scope.settlementData.compCode = localStorage.CompanyId
            $scope.settlementData.dedType = $scope.dedType
        $scope.settlementData.invoiceNo = $scope.invoiceNo
        $scope.settlementData.vochNo = $scope.invoiceNo
        $scope.settlementData.vatAccount = $scope.vatAccount.selected.id
        $scope.settlementData.type = "Purchase Settelment"
        $scope.settlementData.isUo = "true"
        $scope.settlementData.visible = "true"
        $scope.settlementData.otaxAccount = $scope.otaxAccount.selected.id
        delete $scope.settlementData._id;
        
        // get count of purchaseSettelment
        $http.post(config.login + "purchaseSettelment/" + $stateParams.voId + "?type=purchase", $scope.settlementData).then(function (response) {
            if (response.data) {
                $stateParams.voId = response.data.id
                console.log(response.data);
                $rootScope.$broadcast('event:success', { message: "Purchase Settelment Done" });
                $state.go('Customer.PurchaseInvoiceSattlement', { voId: response.data.id }, { location: 'replace' });

            }
            
        });
        console.log($scope.settlementData)     
    }
    // calculate interest
    $scope.calculateinterest = function (rate,amount) {
        $scope.settlementData.interestAmount = ((Number(amount) * rate) / 100).toFixed(2);
        $scope.settlementData.totalDedvatAmount = Number($scope.settlementData.vatAmount) > Number($scope.settlementData.interestAmount) ? $scope.settlementData.interestAmount : $scope.settlementData.vatAmount
        $scope.settlementData.totalDedExciseAmount = Number($scope.settlementData.interestAmount) > Number($scope.settlementData.vatAmount) ? Number($scope.settlementData.interestAmount) - Number($scope.settlementData.totalDedvatAmount): 0 
        console.log($scope.totalDedvatAmount); 
    }
    
   

    $scope.getInvoice = function (invoiceNo) {
        var data = {refNo:$scope.invoiceNo}
        $http.post(config.login + "voucherTransactionsExist", data).then(function (response) {
            if (response.data.count > 0) {
                $rootScope.$broadcast('event:success', { message: "Purchase  Sattlement Exist.." });
                $stateParams.voId = response.data.id;
                $state.go('Customer.PurchaseInvoiceSattlement', { voId: response.data.id });
                $state.reload();
                
            }
            else if (response.data.count == 0) {
                $rootScope.$broadcast('event:progress', { message: "Please wait getting invoice.." });
                $http.get(config.login + "getInvoiceSett" + "?invoiceNo=" + invoiceNo).then(function (response) {
                    console.log(response.data)
                    if (response.data.length > 0) {
                        $scope.settlementData = response.data[0];
                        getCount();
                        $scope.settlementData.totalQty = calculateTotalQty($scope.settlementData.totalLineItemData)
                        console.log($scope.settlementData.totalQty)
                        $scope.supplierName = localStorage[$scope.settlementData.supplier];
                        swal.close();
                    } else if (response.data.status =="Not Found") {
                        $rootScope.$broadcast('event:error', { message: "Invoice No Does not Exist" });
                       
                    }
                });
            }
        });

    }
    //$scope.vatDedPerkg = function () {
    //    var dedPerKg = (Number($scope.settlementData.excisePerKg) + Number($scope.settlementData.vatPerKg)) - Number($scope.settlementData.totalDedPerKg)
    //    console.log(dedPerKg);
    //    if (Number($scope.settlementData.vatPerKg) > Number(dedPerKg)) {
    //        $scope.settlementData.totalDedvatAmount = dedPerKg * $scope.settlementData.totalQty
    //        $scope.settlementData.totalDedExciseAmount = 0;
    //    }
    //    if (Number($scope.settlementData.vatPerKg) < Number(dedPerKg)) {
    //        $scope.settlementData.totalDedvatAmount = $scope.settlementData.vatPerKg * $scope.settlementData.totalQty
    //        $scope.settlementData.totalDedExciseAmount = Number(dedPerKg) * Number($scope.settlementData.totalQty) - Number($scope.settlementData.totalDedvatAmount)
    //    }
        
        //$scope.settlementData.vatAmountPerKg = totalDedvatAmount
       
    //
    //$scope.vatDedPerkg = function () {
    //    $scope.settlementData.totalLessPerKg = (Number((Number($scope.settlementData.totalDedPerKg) - Number($scope.settlementData.lessPerKg))) * Number($scope.settlementData.totalQty)).toFixed(2)
    //    $scope.settlementData.totalDedvatAmount = Number($scope.settlementData.vatAmount) > Number($scope.settlementData.totalLessPerKg) ? $scope.settlementData.totalLessPerKg : $scope.settlementData.vatAmount
    //    $scope.settlementData.totalDedExciseAmount = Number($scope.settlementData.totalLessPerKg) > Number($scope.settlementData.vatAmount) ?Number($scope.settlementData.totalLessPerKg) - Number($scope.settlementData.totalDedvatAmount): 0

    //}
    function calculateTotalQty(data) {
        if (data) {
            var qty = 0;
            var excise = 0;
            var AMOUNTINR = 0 
            for (var i = 0; i < data.length; i++) {
                qty += data[i].NETWEIGHT;
                excise += Number(data[i].dutyAmount);
                AMOUNTINR += Number(data[i].AMOUNTINR);
            }
            $scope.settlementData.exciseAmount = excise
            $scope.settlementData.totalAmount = AMOUNTINR
            console.log($scope.excise)
            return qty;
        }
        else {
            return
        }
      

    }
    function calculateDedPerKg(type) {
        $scope.dedType = type
        var data = $scope.settlementData.totalLineItemData
        var obj1 = {}
        var obj2 = {}
        var obj3 = {}
        var vatData = []
        var vatPerKg
        var total = 0;
        for (var i = 0; i < data.length; i++) {
            vatPerKg = (Number(data[i].BASERATE) * Number($scope.vat)) / 100;
            vatData.push({ varPerKg: vatPerKg, excisePerKg: data[i].dutyPerUnit, totalPerKg: Number(data[i].dutyPerUnit) + Number(vatPerKg), less: $scope.lessPerkg, total: Number(((Number(data[i].dutyPerUnit) + Number(vatPerKg) - Number($scope.lessPerkg)) * Number(NETWEIGHT.toFixed(2))).toFixed(2)) })
            total += Number(vatData[i].total)
        }
        $scope.vatData = vatData
        $scope.settlementData.totalLessPerKg = Number(total)
        $scope.settlementData.totalDedvatAmount = Number($scope.settlementData.vatAmount) > Number($scope.settlementData.totalLessPerKg) ? $scope.settlementData.totalLessPerKg : $scope.settlementData.vatAmount
        $scope.settlementData.totalDedExciseAmount = Number($scope.settlementData.totalLessPerKg) > Number($scope.settlementData.vatAmount) ? Number($scope.settlementData.totalLessPerKg) - Number($scope.settlementData.totalDedvatAmount) : 0

    }
    $scope.bindSupplierName = function(supplierId) {
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
       // var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(data.id).then(function (response) {
            if (response.data) {
                $scope.vatAccountBalance = response.data.balance
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
       // var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(data.id).then(function (response) {
            if (response.data) {
                $scope.oTaxBalance = response.data.balance
            } else {
                $scope.oTaxBalance = 0.00;
            }
        })
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