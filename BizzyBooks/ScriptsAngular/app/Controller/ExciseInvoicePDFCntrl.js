myApp.controller('ExciseInvoicePDFCntrl', ['$scope', '$http', '$timeout', '$stateParams', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $stateParams, $rootScope, $state, config) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $scope.goBack = function () {
        window.history.back();
    }
    function getInvoiceData(id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                  .then(function (response) {
                      $scope.invoiceData = response.data;
                      getSupplierDetail(response.data.invoiceData.customerAccount);
                      getSupplierDetail2(response.data.invoiceData.consigneeAccount);
                      $scope.gTotal = Math.round($scope.invoiceData.amount);
                      $scope.roundOff = $scope.gTotal - Number($scope.invoiceData.amount);
                  });
    }
    if ($stateParams.voId) {
        getInvoiceData($stateParams.voId);
    }
    $http.get(config.api + "CompanyMasters/?filter[where][CompanyId]=" + localStorage.CompanyId).then(function (response) {
        $scope.company = response.data[0];

    });

    function getSupplierDetail(supplierName) {
        $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId + "&filter[where][company]=" + supplierName).then(function (response) {
            $scope.supliersDetail = response.data[0];
            console.log(response.data)
        });
    }
    function getSupplierDetail2(supplierName) {
        $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId + "&filter[where][company]=" + supplierName).then(function (response) {
            $scope.supliersDetail2 = response.data[0];
            console.log(response.data)
        });
    }
    $scope.$watch('invoiceData.invoiceData.billData', function () {
        var totalQty = 0;
        var totalAmount = 0;
        if ($scope.invoiceData && $scope.invoiceData.invoiceData && $scope.invoiceData.invoiceData.billData) {
            $scope.invoiceData.invoiceData.billData.forEach(function (item) {
                totalQty += Number(item.itemQty);
                totalAmount += Number(item.itemAmount);
            });
        }
        $scope.totalQty = totalQty;
        $scope.totalAmount = totalAmount;
    }, true);
}]);