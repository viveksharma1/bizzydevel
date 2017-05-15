myApp.controller('BalanceSheetCntrl', ['$scope', '$http', '$timeout', '$stateParams', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $stateParams, $rootScope, $state, config) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $scope.goBack = function () {
        window.history.back();
    }
    function getAggregateLineItems(data) {
        return Enumerable.From(data).GroupBy("$.ancestor[0]", null, function (key, g) {
            var data1 = { ancestor: "$.ancestor" }
            console.log(g)
            var i = 0
            return {
                account: key,
                amount: g.Sum("$.amount| 0"),
                ancestor: g.source[i].ancestor,
                balanceType: g.source[i].balanceType
            }
            i++;
        })
       .ToArray();
    }
    function getTotal(data) {
        var sum = 0
        for (var i = 0 ; i < data.length; i++) {
            sum += Number(data[i].amount);
        }
        return sum

    }
    function getCompcode() {
        var allCompCode = JSON.parse(localStorage.comobj);
        var compCode = []
        for (var i = 0; i < allCompCode.length; i++) {
            compCode.push(allCompCode[i].CompanyId)
        }
        return compCode
    }
    var allcompCode = getCompcode();
    $http.post(config.login + 'getBalanceSheet', allcompCode).then(function (response) {
        console.log(response)
        $scope.reportDataCr = [];
        $scope.reportDataDr = [];
        var data = getAggregateLineItems(response.data)
        for (var i = 0 ; i < data.length; i++) {
            if (data[i].balanceType == 'credit') {
                $scope.reportDataCr.push(data[i])
            }
            if (data[i].balanceType == 'debit') {
                $scope.reportDataDr.push(data[i])
            }
        }
        $scope.totalCredit =  getTotal($scope.reportDataCr)
        $scope.totalDebit = getTotal($scope.reportDataDr)
    });
   
     
}]);