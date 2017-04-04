myApp.controller('BalanceInventoryViewInfoCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {


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
        $http.get(config.api + "transactions/" + $scope.Item.invId +"?filter[fields][actualDate] =true&filter[fields][supliersName]=true&filter[fields][id]=true").then(function (response) {
            $scope.billDetail = response.data;
            console.log($scope.billData);
        });
        $scope.GRNDetail($scope.Item);

    });
   
    $scope.GRNDetail = function(data){
        $scope.itemData = data;


        console.log(data);
        console.log(data.id);
        $('#GRNDetailDiv').slideDown();

        $scope.billNo = data.no;
        $scope.NetWeight = data.NETWEIGHT;
        $scope.itemAmount1 = data.TOTALAMOUNTUSD * data.exchangeRate;
        $scope.itemAmountinINR = $filter('currency')($scope.itemAmount1, '₹', 2)
        $scope.costPerMTinINR = $filter('currency')($scope.itemAmount1 / data.NETWEIGHT, '₹', 2)

        $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.billNo).then(function (response) {
            console.log(response.data)
            $scope.billData = response.data[0].manualLineItem[0].totalDutyAmt;
            console.log($scope.billData)

            $scope.totalDutyAmt = response.data[0].manualLineItem[0].totalDutyAmt;
            $scope.totalBillAmount = response.data[0].amount;
            $scope.totalCustom = (Number($scope.totalDutyAmt) * Number(data.TOTALAMOUNTUSD) * Number(data.exchangeRate)) / Number($scope.totalBillAmount) * Number(data.NETWEIGHT);

        });
        $http.get(config.api + "transactions" + "?[filter][where][ordertype]=EXPENSE" + "&[where][refNo]=" + $scope.billNo).then(function (response) {

            $scope.expenseData = response.data;
            console.log(response.data)
            $scope.supliersName1 = response.data.supliersName;
            $scope.amount1 = response.data.amount;
            $scope.date1 = response.data.date;
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