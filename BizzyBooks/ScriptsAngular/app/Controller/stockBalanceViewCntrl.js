myApp.controller('stockBalanceViewCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter) {


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

    $scope.GRNDetail = function (data) {
        $scope.itemData = data;


        console.log(data);
        console.log(data.id);
        $('#GRNDetailDiv').slideDown();

        $scope.billNo = data.no;
        $scope.billId = data.invId;
        $scope.NetWeight = data.NETWEIGHT;
        $scope.itemAmount1 = Number(data.AMOUNTINR);
        $scope.itemAmountinINR = $filter('currency')($scope.itemAmount1, '₹', 2)
        $scope.costPerMTinINR = $filter('currency')($scope.itemAmount1 / data.NETWEIGHT, '₹', 2)

        $http.get(config.api + "voucherTransactions/" + $scope.billId).then(function (response) {
            console.log(response.data)
            var billdata = response.data.transactionData
            $scope.billData = billdata.manualLineItem[0].totalDutyAmt;
            console.log($scope.billData)
            $scope.totalDutyAmt = billdata.manualLineItem[0].totalDutyAmt;
            $scope.totalBillAmount = billdata.amount;
            $scope.totalCustom = (Number($scope.totalDutyAmt) * Number(data.TOTALAMOUNT) * Number(billdata.ExchangeRate)) / Number($scope.totalBillAmount) * Number(data.NETWEIGHT);

        });
        $http.get(config.api + "voucherTransactions" + "?[filter][where][type]=EXPENSE" + "&[filter][where][refNo]=" + $scope.billNo + "&[filter][where][role]=" + "O").then(function (response) {
            $scope.expenseData = []
            $scope.expenseData = response.data;
            console.log(response.data)
            for (var i = 0; i < $scope.expenseData.length;i++){
                $scope.expenseData[i].refNo = localStorage[$scope.expenseData[i].transactionData.supliersId]
            }
            $scope.supliersName1 = localStorage[response.data[0].transactionData.supliersId]
            $scope.amount1 = $scope.expenseData.amount;
            $scope.date1 = $scope.expenseData.date;
            console.log($scope.expenseData)

            var total = 0;
            for (var i = 0; i < $scope.expenseData.length; i++) {
                var product = Number($scope.expenseData[i]);
                total += Number($scope.expenseData[i].amount);
            }
            $scope.tatalExpense = Math.round(total);
            $scope.totalCostPerMT = ($scope.tatalExpense + $scope.itemAmount1) / $scope.NetWeight
        })

        $http.get(config.api + "ledgers" + "?[filter][where][refNo]=" + $scope.billNo + "&[filter][where][type]=Direct Expense").then(function (response) {

            $scope.taxData = response.data;
            console.log(response.data)
            $scope.supliersName1 = response.data.supliersName;
            $scope.amount1 = response.data.amount;
            $scope.date1 = response.data.date;
            console.log($scope.expenseData)

        })
    }

}]);