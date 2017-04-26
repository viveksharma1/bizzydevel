myApp.controller('VoucherTransactionsCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $('#FromDate').datepicker();
    $('#ToDate').datepicker()

    $scope.openTransaction = function (id, voType) {

        if (voType == 'Purchase Invoice') {

            $state.go('Customer.Bill', { billNo: id });
        }
        if (voType == 'Expense') {

            $state.go('Customer.Expense', { expenceId: id });
        }
        if (voType == 'Payment') {

            $state.go('Customer.MakePayment', { voId: id });
        }
        if (voType == 'General Invoice') {

            $state.go('Customer.GeneralInvoice', { voId: id });
        }
        if (voType == 'Sales Invoice') {

            $state.go('Customer.SalesInvoice', { voId: id });
        }
        if (voType == 'Receive Payment') {

            $state.go('Customer.ReceivePayment', { voId: id });
        }

        if (voType == 'EXPENSE') {

            $state.go('Customer.Expense', { expenceId: id });
        }

        if (voType == 'PURCHASE INVOICE') {

            $state.go('Customer.Bill', { billNo: id });
        }
        

        if (voType == 'Badla Voucher') {

            $state.go('Customer.BadlaVoucher', { voId: id });
        }
        if (voType == 'Rosemate') {

            $state.go('Customer.RosemateVoucher', { voId: id });
        }


    }


    $http.get(config.api + 'voucherTransactions?filter[fields][date] =true&filter[fields][type] =true&filter[fields][amount] =true&filter[fields][vochNo] =true&filter[fields][id] =true')
                .then(function (response) {
                    $scope.voucherTransaction = response.data;
                })
}]);