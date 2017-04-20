myApp.controller('TaxInvoicePDFCntrl', ['$scope', '$http', '$timeout', '$stateParams', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $stateParams, $rootScope, $state, config) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $scope.goBack = function () {
        window.history.back();
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
    
    function getInvoiceData(id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                  .then(function (response) {
                      $scope.invoiceData = response.data;
                      fillCompanyInfo(response.data.compCode);
                      getSupplierDetail(response.data.invoiceData.customerAccountId);
                      $scope.gTotal=$scope.invoiceData.amount;
                      $scope.roundOff = $scope.invoiceData.roundOff;
                  });
    }
    if ($stateParams.voId) {
        getInvoiceData($stateParams.voId);
    }
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