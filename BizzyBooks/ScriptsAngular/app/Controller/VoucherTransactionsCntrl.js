﻿myApp.controller('VoucherTransactionsCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter) {


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

            $state.go('Customer.Payment', { voId: id });
        }
        if (voType == 'General Invoice') {

            $state.go('Customer.GeneralInvoice', { voId: id });
        }
        if (voType == 'Sales Invoice') {
            if (localStorage.usertype == "UO") {
                $state.go('Customer.GeneralInvoice', { voId: id });
            } else {
                $state.go('Customer.SalesInvoice', { voId: id });
            }

           
        }
        if (voType == 'Receipt') {

            $state.go('Customer.Receipt', { voId: id });
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
        if (voType == 'Journal Entry') {

            $state.go('Customer.JournalEntry', { voId: id });
        }
        if (voType == 'Contra Entry') {
            $state.go('Customer.ContraEntry', { voId: id });
        }
        if (voType == 'Purchase Settelment') {

            $state.go('Customer.PurchaseInvoiceSattlement', { voId: id });
        }
        if (voType == 'Sales Settelment') {

            $state.go('Customer.SalesInvoiceSattlement', { voId: id });
        }


    }

    // $scope.role = localStorage["usertype"];
    if (localStorage["usertype"] == 'O') {
        var type = ["Purchase Settelment","Sales Settelment","Badla Voucher"]
        $http.post(config.login + "voucherTransactions" + "?compCode=" + localStorage.CompanyId + "&role=" + localStorage.usertype, type).then(function (response) {
                   $scope.voucherTransaction = response.data;
               })
    } else {
        var type = ["Sales Invoice"]
        $http.post(config.login + "voucherTransactions" + "?compCode=" + localStorage.CompanyId + "&role=" + localStorage.usertype, type).then(function (response) {
              
                   $scope.voucherTransaction = response.data;
               })
    }


    $scope.checkSatate = function () {
        if (data.state == "deleted") {
            return true;
        }
    }
   
}]);