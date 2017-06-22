myApp.controller('stockBalanceViewCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });
    var ctx = document.getElementById("myChart");

    $scope.goBack = function () {
        window.history.back();
    }

    $('#InvoiceDate').datepicker();

    $('#ActualDate').datepicker();

    //if ($rootScope.Item != undefined) {

    // $scope.Item = $rootScope.Item;
    $scope.Item;
    var label = []
    var amount = []
    var data = {
        datasets: [{
            data: amount,
            label: "Sale Qty",
          
            borderColor: [
                 'rgba(37, 131, 238  , 0.1)'
            ],
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
            }
           
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: label
    };
   
    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,

    });
    function getAggregateLineItems(data) {
        return Enumerable.From(data).GroupBy("$.date", null, function (key, g) {
            return {
                date: key,
                saleQty: g.Sum("$.saleQty| 0")
            }
        })
       .ToArray();
    }
    function getTotalSales(data) {
        if (data != undefined) {
            if (data.length > 0) {
                var total = 0
                for (var i = 0 ; i < data.length; i++) {
                    total += Number(data[i].saleQty)

                }
                var agData = getAggregateLineItems(data)
                for (var i = 0 ; i < agData.length; i++) {
                    label.push($filter('date')(agData[i].date, 'medium'))
                    amount.push(Number(agData[i].saleQty, 2))

                }

                $scope.totalSales = Number(total.toFixed(2))
            }
        } else {
            return;
        }
    }
    // sum account table in expense

    function getAccountDetail(data) {
        var accountSum = 0;
        var itemTableSum = 0
        var tds = 0;
        if (data.accountTable.length > 0){
            var accountData = data.accountTable
           for (var i = 0; i < accountData.length; i++) {
               accountSum += Number(accountData[i].amount);
            }
        }
       
        if (data.itemTable.length > 0){
            var itemTable = data.itemTable
            for (var i = 0; i < itemTable.length; i++) {
                itemTableSum += Number(itemTable[i].amount);
            }
        }
        if (data.tdsamount) {
            var tds = Number(data.tdsamount)
        }
       
        return Number(accountSum + itemTableSum);
    }
     

    function bindExpense(data) {
        var expense = [];
        var totalExpense = 0
        var totalExpenseAmount = 0
        for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj["accountName"] = localStorage[data[i].transactionData.supliersId]
            obj["amount"] = getAccountDetail(data[i].transactionData)
            expense.push(obj)
            obj["perKg"] = Number(expense[i].amount / $scope.NetWeight);
            totalExpense += expense[i].perKg;
            totalExpenseAmount += expense[i].amount;
        }
        $scope.totalExpense = Number(totalExpense)
        $scope.totalExpenseAmount = Number(totalExpenseAmount)
        return expense;
    }
     
    $scope.GRNDetail = function (data) {
        $scope.itemData = data;
        $scope.costPerKg = 0
        $scope.billNo = data.no;
        $scope.billId = data.invId;
        $scope.NetWeight = Number(data.NETWEIGHT);
        $scope.itemAmount1 = Number(data.AMOUNTINR);
        $scope.itemAmountinINR = $filter('currency')($scope.itemAmount1, '₹', 2)
        $scope.costPerMTinINR = $scope.itemAmount1 / data.NETWEIGHT
        $http.get(config.api + "voucherTransactions/" + $scope.billId).then(function (response) {
            var billdata = response.data.transactionData
            $scope.billData = billdata.manualLineItem[0].totalDutyAmt;
            $scope.totalDutyAmt = billdata.manualLineItem[0].totalDutyAmt;
            $scope.totalBillAmount = billdata.amount;
            $scope.totalCustom = ((Number($scope.totalDutyAmt) * (Number(data.TOTALAMOUNT) * Number(billdata.ExchangeRate))) / (Number($scope.totalBillAmount) * Number(data.NETWEIGHT))).toFixed(2);
            $scope.totalCustomPerItem = Number($scope.totalDutyAmt)
            $scope.costPerKg = $scope.costPerKg + Number($scope.totalCustom)

        });
        $http.get(config.api + "voucherTransactions" + "?[filter][where][type]=EXPENSE" + "&[filter][where][refNo]=" + $scope.billNo + "&[filter][where][role]=" + "O").then(function (response) {
            $scope.expenseData = bindExpense(response.data)
          //  totalExpense(response.data)
            $scope.costPerKg = $scope.costPerKg + $scope.totalExpense + Number($scope.costPerMTinINR);
        })
    }

    $http.get(config.api + "Inventories/" + $stateParams.voId).then(function (response) {
        $scope.Item = response.data;
        getTotalSales($scope.Item.salesTransaction)
       
        console.log($scope.Item);
        $http.get(config.api + "voucherTransactions/" + $scope.Item.invId).then(function (result) {
            $scope.billDetail = result.data;
            $scope.supplierName = localStorage[$scope.billDetail.transactionData.supliersId]
            $scope.actualDate = $scope.billDetail.transactionData.actualDate
        });
      
        $scope.GRNDetail($scope.Item);
        

       addData(myChart, label, amount)
    });

    //function totalExpense() {


    //}
}]);