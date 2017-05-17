myApp.controller('BalanceInventoryViewInfoCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $scope.goBack = function () {
        window.history.back();
    }

    $('#InvoiceDate').datepicker();

    $('#ActualDate').datepicker();

    //if ($rootScope.Item != undefined) {

   // $scope.Item = $rootScope.Item;
   
    $http.get(config.api + "Inventories/" + $stateParams.voId).then(function (response) {
        $scope.Item = response.data;
        console.log($scope.Item);
        $http.get(config.api + "voucherTransactions/" + $scope.Item.invId).then(function (result) {
            $scope.billDetail = result.data;
            console.log($scope.billData);
            $scope.supplierName = localStorage[$scope.billDetail.transactionData.supliersId]
        });
        $scope.GRNDetail($scope.Item);

    });

    function getAccountDetail(data) {
        var accountSum = 0;
        var itemTableSum = 0
        var tds = 0;
        if (data.accountTable.length > 0) {
            var accountData = data.accountTable
            for (var i = 0; i < accountData.length; i++) {
                accountSum += Number(accountData[i].amount);
            }
        }
        if (data.itemTable.length > 0) {
            var itemTable = data.itemTable
            for (var i = 0; i < itemTable.length; i++) {
                itemTableSum += Number(itemTable[i].amount);
            }
        }
        if (data.tdsamount) {
            var tds = Number(tdsamount)
        }

        return Number(accountSum + itemTableSum + tds);
    }


    function bindExpense(data) {
        var expense = [];
        var totalExpense = 0
        for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj["accountName"] = localStorage[data[i].transactionData.supliersId]
            obj["amount"] = getAccountDetail(data[i].transactionData)
            expense.push(obj)
            obj["perKg"] = Number(expense[i].amount / $scope.NetWeight);
            totalExpense += expense[i].perKg;
        }
        if (data[0].role == "O") {
            $scope.totalExpenseO = Number(totalExpense)
        }
        if (data[0].role == "UO") {
            $scope.totalExpenseUo = Number(totalExpense)
        }
        return expense;
    }

    $scope.GRNDetail = function(data){
        $scope.itemData = data;
        $scope.billNo = data.no;
        $scope.costPerKg = 0
        $scope.billId = data.invId;
        $scope.NetWeight = Number((data.NETWEIGHT).toFixed(2));
        $scope.itemAmount1 = Number((data.TOTALAMOUNTUSD * data.exchangeRate).toFixed(2));
        $scope.itemAmountinINR = $filter('currency')($scope.itemAmount1, '₹', 2)
        $scope.costPerMTinINR = $filter('currency')($scope.itemAmount1 / Number(data.NETWEIGHT.toFixed(2)), '₹', 2)
        $http.get(config.api + "voucherTransactions/" + $scope.billId).then(function (response) {
            console.log(response.data)
            var billdata = response.data.transactionData
            $scope.billData = billdata.manualLineItem[0].totalDutyAmt;
            console.log($scope.billData)
            $scope.totalDutyAmt = billdata.manualLineItem[0].totalDutyAmt;
            $scope.totalBillAmount = billdata.amount;
            $scope.totalCustom = ((Number($scope.totalDutyAmt) * (Number(data.TOTALAMOUNTUSD) * Number(billdata.ExchangeRate))) / (Number($scope.totalBillAmount) * Number(data.NETWEIGHT))).toFixed(2);
            $scope.costPerKg = $scope.costPerKg + Number($scope.totalCustom)

        });
        $http.get(config.api + "voucherTransactions" + "?[filter][where][type]=EXPENSE" + "&[filter][where][refNo]=" + $scope.billNo + "&[filter][where][role]=" + "O").then(function (response) {
            $scope.expenseDataO = bindExpense(response.data)
            $scope.costPerKg = $scope.costPerKg + $scope.totalExpenseO;
        })
        $http.get(config.api + "voucherTransactions" + "?[filter][where][type]=EXPENSE" + "&[filter][where][refNo]=" + $scope.billNo + "&[filter][where][role]=" + "UO").then(function (response) {
            $scope.expenseDataUo = bindExpense(response.data)
            $scope.costPerKg = $scope.costPerKg + $scope.totalExpenseUo;
        })

       
    }
   
}]);