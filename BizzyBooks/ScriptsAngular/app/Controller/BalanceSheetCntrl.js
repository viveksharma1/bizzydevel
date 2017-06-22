myApp.controller('BalanceSheetCntrl', ['$scope', '$http', '$timeout', '$stateParams', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $stateParams, $rootScope, $state, config) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $scope.goBack = function () {
        window.history.back();
    }
    var key;
    function getAggregateLineItems(data) {
        return Enumerable.From(data).GroupBy("$.ancestor", null, function (key, g) {
            var data1 = { ancestor: "$.ancestor" }
            console.log(g)
            console.log(key)
            var i = 0
            return {
                account: key,
                amount: g.Sum("$.amount| 0"),
                ancestor: [],
                trackid: g.source[i].trackid,
                arrayIndex:g.source[i].arrayIndex,
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
    //var allcompCode = getCompcode();
    //$http.post(config.login + 'getBalanceSheet', allcompCode).then(function (response) {
    //    console.log(response)
    //    $scope.reportDataCr = [];
    //    $scope.reportDataDr = [];
    //    var data = getAggregateLineItems(response.data)
    //    for (var i = 0 ; i < data.length; i++) {
    //        if (data[i].balanceType == 'credit') {
    //            $scope.reportDataCr.push(data[i])
    //        }
    //        if (data[i].balanceType == 'debit') {
    //            $scope.reportDataDr.push(data[i])
    //        }
    //    }
    //    $scope.totalCredit =  getTotal($scope.reportDataCr)
    //    $scope.totalDebit = getTotal($scope.reportDataDr)
    //});
   

    function getSheet(data,i){
        return Enumerable.From(data).GroupBy("$.ancestor[1]", null, function (key, g) {
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

    function checkArray(data,item){
        for (var i = 0; i < data.length; i++) {
            if(item == data[i])
                return true;
        }
        return false;
       
    }
    $scope.getSheet = function (data, i) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[j].ancestor.length; j++) {
                var data = getSheet(data, data[j].ancestor[j])
                console.log(data)
                var data_array = $scope.reportDataCr
                var data_array1 = $scope.reportDataCr
                for (var i = 0; i < data_array.length; i++) {
                    for (var j = 0; j < data.length; j++) {
                        if (checkArray(data[j].ancestor, data_array[i].account)) {
                            data_array1[i].child = data[j]
                        }
                    }
                }

            }
        }
       // var data = getSheet(data, i)
       
        return data_array1
    }
    var allcompCode = getCompcode();

    function treeData(data) {
        var j = 1
        for (var i = 0 ; j < data.length; i++) {
            for (var j = j + i; j < data.length; j++) {
                if (data[i].trackid == data[j].trackid) {
                    if (data[i].arrayIndex > data[j].arrayIndex) {
                        data[j].ancestor.push(data[i])
                    }
                    else {
                        data[i].ancestor.push(data[j])
                    }

                }
            }
        }
        return data;
    }
    $http.post(config.login + 'getBalanceSheet', allcompCode).then(function (response) {
        console.log(response)
        $scope.reportDataCr = [];
        $scope.reportDataDr = [];
        var data = getAggregateLineItems(response.data)
        console.log("data", data)

       var data1 =  treeData(data);
      //  var report = $scope.getSheet(response.data)
       console.log("tree", data1)
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