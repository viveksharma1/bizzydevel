myApp.controller('SalesInvoiceSattlementCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', 'authService', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter, authService) {

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
            $scope.settlementData.vatPerKg = Number((Number($scope.settlementData.vatAmount) / Number($scope.settlementData.totalQty)).toFixed(2))
           // $scope.settlementData.excisePerKg = Number((Number($scope.settlementData.exciseAmount) / Number($scope.settlementData.totalQty)).toFixed(2))
            $scope.settlementData.totalDedPerKg = ((Number($scope.settlementData.vatAmount) + Number($scope.settlementData.exciseAmount)) / Number($scope.settlementData.totalQty)).toFixed(2)
            $scope.isDisabled1 = false;
            $scope.isDisabled = true;
            calculateDedPerKg();
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
        $http.get(config.login + "getVoucherTransactionCount/" +localStorage.CompanyId + "?type=Sales Settelment").then(function (response) {
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
            getIdByVochNo($scope.invoiceNo)
            $scope.supplierName = localStorage[$scope.settlementData.customer];
         
            $scope.vatAccount.selected = $scope.settlementData.vatAccount
            $scope.vat = $scope.settlementData.vat
            $scope.lessPerkg = $scope.settlementData.lessPerkg
            $scope.vatAccount = { selected: { accountName: localStorage[$scope.settlementData.vatAccount], id: $scope.settlementData.vatAccount } };
            $scope.otaxAccount = { selected: { accountName: localStorage[$scope.settlementData.otaxAccount], id: $scope.settlementData.otaxAccount } };
            calculateDedPerKg()
        });
    }
    else {
        $stateParams.voId = null
        getCount();
       
    }

    function getIdByVochNo(invoiceNo) {
        $http.get(config.login + "getSalesInvoice?invoiceNo=" + invoiceNo).then(function (response) {
            console.log(response.data)
            $scope.invoiceId = response.data[0].id
        });
    }
    $scope.saveSettlement = function () {

        $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
        if ($scope.settlementData.vatPerKg) {
            $scope.settlementData.ledgerDataFirst = { amount: $scope.settlementData.totalLessPerKg, accountId: $scope.settlementData.customer }
        }
        else {
            $scope.settlementData.ledgerDataFirst = { amount: $scope.settlementData.interestAmount, accountId: $scope.settlementData.customer }
        }
        var amount = $scope.settlementData.vatAmount > $scope.settlementData.interestAmount ? $scope.settlementData.vatAmount : $scope.settlementData.interestAmount

        $scope.settlementData.ledgerDataSecond = { amount: $scope.settlementData.totalDedvatAmount, accountId: $scope.vatAccount.selected.id }
        if ($scope.settlementData.totalDedvatAmount) {
            $scope.settlementData.ledgerDataThird = { amount: $scope.settlementData.totalDedExciseAmount, accountId: $scope.otaxAccount.selected.id }

        } 
        $scope.settlementData.compCode = localStorage.CompanyId
        $scope.settlementData.vat = $scope.vat
        $scope.settlementData.lessPerkg = $scope.lessPerkg
        
        $scope.settlementData.invoiceNo = $scope.invoiceNo
        $scope.settlementData.vochNo = $scope.refNo
             $scope.settlementData.vochId = $scope.invoiceId
        //var obj = { vochNo: $scope.voRefNo }
       // $scope.settlementData["vochNo"] = $scope.voRefNo
        $scope.settlementData.vatAccount = $scope.vatAccount.selected.id
        $scope.settlementData.type = "Sales Settelment"
        $scope.settlementData.isUo = "true"
        $scope.settlementData.visible = "true"
        $scope.settlementData.otaxAccount = $scope.otaxAccount.selected.id
        delete $scope.settlementData._id;

        // get count of purchaseSettelment
        $http.post(config.login + "purchaseSettelment/" + $stateParams.voId + "?type=sales", $scope.settlementData).then(function (response) {
            if (response.data) {
                $stateParams.voId = response.data.id
                console.log(response.data);
                $rootScope.$broadcast('event:success', { message: "Sales Settelment Done" });
                $state.go('Customer.SalesInvoiceSattlement', { voId: response.data.id }, { location: 'replace' });

            }

        });
        console.log($scope.settlementData)
    }
    // calculate interest
    $scope.calculateinterest = function (rate, amount) {
        $scope.settlementData.interestAmount = ((Number(amount) * rate) / 100).toFixed(2);
        $scope.settlementData.totalDedvatAmount = Number($scope.settlementData.vatAmount) > Number($scope.settlementData.interestAmount) ? $scope.settlementData.interestAmount : $scope.settlementData.vatAmount
        $scope.settlementData.totalDedExciseAmount = Number($scope.settlementData.interestAmount) > Number($scope.settlementData.vatAmount) ? Number($scope.settlementData.interestAmount) - Number($scope.settlementData.totalDedvatAmount) : 0
        console.log($scope.totalDedvatAmount);
    }



    $scope.getInvoice = function (invoiceNo) {
        var data = { refNo: $scope.invoiceNo }
        $http.post(config.login + "voucherTransactionsExist", data).then(function (response) {
            if (response.data.count > 0){
                $rootScope.$broadcast('event:success', { message: "Purchase  Sattlement Exist.." });
                $stateParams.voId = response.data.id;
                $state.go('Customer.PurchaseInvoiceSattlement', { voId: response.data.id });
                $state.reload();

            }
            else if (response.data.count == 0){
                $rootScope.$broadcast('event:progress', { message: "Please wait getting invoice.." });
                $http.get(config.login + "getSalesInvoice?invoiceNo=" + invoiceNo + "&compCode=" + localStorage.CompanyId).then(function (response) {
                    console.log(response.data)
                    if (response.data.length > 0) {
                        $scope.settlementData = response.data[0];
                        $scope.invoiceId = $scope.settlementData.id
                        console.log($scope.invoiceId)
                     

                        getCount();
                        $scope.settlementData.totalQty = calculateTotalQty($scope.settlementData.totalLineItemData)
                        console.log($scope.settlementData.totalQty)
                        $scope.supplierName = localStorage[$scope.settlementData.customer];
                        swal.close();
                    } else if (response.data.status == "Not Found") {
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
    $scope.vatDedPerkg = function () {
        $scope.settlementData.totalLessPerKg = (Number((Number($scope.settlementData.totalDedPerKg) - Number($scope.settlementData.lessPerKg))) * Number($scope.settlementData.totalQty)).toFixed(2)
        $scope.settlementData.totalDedvatAmount = Number($scope.settlementData.vatAmount) > Number($scope.settlementData.totalLessPerKg) ? $scope.settlementData.totalLessPerKg : $scope.settlementData.vatAmount
        $scope.settlementData.totalDedExciseAmount = Number($scope.settlementData.totalLessPerKg) > Number($scope.settlementData.vatAmount) ? Number($scope.settlementData.totalLessPerKg) - Number($scope.settlementData.totalDedvatAmount) : 0

    }
    function calculateTotalQty(data) {
        if (data) {
            var qty = 0;
            var excise = 0;
            var excisePerKg = 0
            for (var i = 0; i < data.length; i++) {
                qty += Number(data[i].itemQty);
                excise += Number(data[i].dutyPerUnit);
                excisePerKg += Number(data[i].dutyPerUnit) 
            }
            $scope.settlementData.excisePerKg = Number((excisePerKg).toFixed(2))
            $scope.settlementData.exciseAmount = Number((excise * qty).toFixed(2))
            console.log($scope.excise)
            return qty;
        }
        else {
            return
        }
    }

    function calculateDedPerKg() {

         var data = $scope.settlementData.totalLineItemData
         var obj1 = {}
         var obj2 = {}
         var obj3 = {}
         var  vatData = []
         var vatPerKg
         var total = 0;
        for (var i = 0; i < data.length; i++) {
            vatPerKg = (Number(data[i].itemRate) * Number($scope.vat)) / 100;
            vatData.push({ varPerKg: vatPerKg, excisePerKg: data[i].dutyPerUnit, totalPerKg: Number(data[i].dutyPerUnit) + Number(vatPerKg), less: $scope.lessPerkg, total: Number(((Number(data[i].dutyPerUnit) + Number(vatPerKg) - Number($scope.lessPerkg)) * Number(data[i].itemQty)).toFixed(2)) })
            total += Number(vatData[i].total)
        }
        $scope.vatData = vatData
        $scope.settlementData.totalLessPerKg = Number(total)
        $scope.settlementData.totalDedvatAmount = Number($scope.settlementData.vatAmount) > Number($scope.settlementData.totalLessPerKg) ? $scope.settlementData.totalLessPerKg : $scope.settlementData.vatAmount
        $scope.settlementData.totalDedExciseAmount = Number($scope.settlementData.totalLessPerKg) > Number($scope.settlementData.vatAmount) ? Number($scope.settlementData.totalLessPerKg) - Number($scope.settlementData.totalDedvatAmount) : 0
       
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
        //var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
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
      //  var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(data.id).then(function (response) {
            if (response.data) {
                $scope.oTaxBalance = response.data.balance
            } else {
                $scope.oTaxBalance = 0.00;
            }
        })
    }
    // view


   
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
        scope: {
            billdata: '=',
            exciseData: '='

        },

        controller: ['$scope', '$http', '$rootScope', 'config','$timeout', function ($scope, $http, $rootScope, config, $timeout) {
            $(".my a").click(function (e) {
                e.preventDefault();
            });
            function getInvoiceData(id) {
                $http.get(config.api + 'voucherTransactions/' + id)
                          .then(function (response) {
                              $scope.invoiceData = response.data;
                              fillCompanyInfo(response.data.compCode);
                              getSupplierDetail(response.data.invoiceData.customerAccountId);
                              getSupplierDetail2(response.data.invoiceData.consigneeAccountId);
                              $scope.gTotal = $scope.invoiceData.amount;
                              $scope.roundOff = $scope.invoiceData.roundOff;
                          });
            }
            $scope.printInvoice = function (printSectionId) {
                var innerContents = document.getElementById(printSectionId).innerHTML;
                var popupWinindow = window.open('', '_blank', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                var strScript = '<script type="text/javascript">window.onload=function() {document.getElementById("table").style.whiteSpace = "nowrap"; window.print(); window.close(); };</script>'
                popupWinindow.document.write('<html><head></head><body">' + innerContents + '</body></html>');
                popupWinindow.document.write(strScript);
                popupWinindow.document.close(); // necessary for IE >= 10
            }
            //$scope.totalExciseAmount = 0;
            //$scope.totalSADAmount = 0;

            $scope.$watch('billdata', function () {
                console.log($scope.billdata)
                getInvoiceData($scope.billdata);
            });
           
            function fillCompanyInfo(companyId) {
                $http.get(config.api + "CompanyMasters/?filter[where][CompanyId]=" + companyId).then(function (response) {
                    $scope.company = response.data[0];

                });
            }

            function getSupplierDetail(id) {
                $http.get(config.api + "accounts" + "?filter[where][id]=" + id).then(function (response) {
                    $scope.supliersDetail = response.data[0];
                    console.log(response.data)
                });
            }
            function getSupplierDetail2(id) {
                $http.get(config.api + "accounts" + "?filter[where][id]=" + id).then(function (response) {
                    $scope.supliersDetail2 = response.data[0];
                    console.log(response.data)
                });
            }
          
            $scope.$watch('invoiceData.invoiceData.billData', function () {
                var totalQty = 0;
                var totalAmount = 0;
                var totalExciseAmount = 0;
                var totalSADAmount = 0;
                if ($scope.invoiceData && $scope.invoiceData.invoiceData && $scope.invoiceData.invoiceData.billData) {
                    $scope.invoiceData.invoiceData.billData.forEach(function (item) {
                        totalQty += Number(item.itemQty);
                        totalAmount += Number(item.itemAmount);
                        totalExciseAmount += Number(item.exciseDuty / item.NETWEIGHT);
                        totalSADAmount += Number(item.SAD / item.NETWEIGHT);
                    });
                }
                $scope.totalQty = totalQty;
                $scope.totalAmount = totalAmount;
                $scope.totalExciseAmount = Number(totalExciseAmount.toFixed(2));
                $scope.totalSADAmount = Number(totalSADAmount.toFixed(2));
            }, true);
        }],
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
        }
       

    };
});