myApp.controller('accountHistoryCntrl', ['$scope', '$http', '$stateParams', 'config', '$state', function ($scope, $http, $stateParams, config, $state) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $scope.Accountbtn = function () {
        $('#formaccount').modal('show');
    };
    $scope.currentDate = moment().format();
    $scope.accountName = $stateParams.accountName;
    $scope.accountName
    console.log($scope.accountName);
    $http.get(config.api + "accounts" + "?filter[where][accountName]=" + $scope.accountName + "&[where][compCode]=" + localStorage.CompanyId).then(function (response) {

        $scope.accountData = response.data[0];
        console.log($scope.accountData);


    })
    if (localStorage["userrole"] == '3') {
        var query = "&filter[where][isUo]=" + true + "&filter[where][visible]=" + true
    }
    if (localStorage["userrole"] == '2') {
        var query = "&filter[where][isUo]=" + false
    }
    $http.get(config.api + "ledgers" + "?filter[where][accountName]=" + $scope.accountName + query).then(function (response) {
        $scope.ledgerData = response.data;
        var credit = 0;
        var debit = 0;
        for (var i = 0; i < $scope.ledgerData.length; i++) {
            if ($scope.ledgerData[i].credit) {
                credit += Number($scope.ledgerData[i].credit);
            }
            if ($scope.ledgerData[i].debit) {
                debit += Number($scope.ledgerData[i].debit);
            }
        }
        if (!credit) {
            $scope.credit = '';
        }
        if (!debit) {
            $scope.debit = '';
        }
        $scope.credit = credit
        $scope.debit = debit
        console.log($scope.credit);
        console.log($scope.debit);
        if ($scope.accountData.openingBalance > 0) {
            $scope.creditOpening = $scope.accountData.openingBalance
        }
        if ($scope.accountData.openingBalance < 0) {
            $scope.debitOpening = $scope.accountData.openingBalance
        }
        if ($scope.accountData.balanceType == 'credit') {
            $scope.ledgerBalance = $scope.credit - $scope.debit
        }
        if ($scope.accountData.balanceType == 'debit') {
            $scope.ledgerBalance = $scope.debit - $scope.credit
        }
    });

    //pdf

    $scope.generatePDF = function () {

        var draw = kendo.drawing;

        draw.drawDOM($("#upperdivId"), {
            margin: "2cm",
            scale: 0.8,
            paperSize: "A4",

        })
        .then(function (root) {
            return draw.exportPDF(root);
        })
        .done(function (data) {
            kendo.saveAs({
                dataURI: data,
                fileName: "ledger.pdf"
            });
        });
    }


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


    }

    $('.btnhover button').click(function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active');
    });

    $('#HideLedger').hide();
    $('.Ledgercheck').hide();
    $scope.LedgercheckOn = function () {
        $('.Ledgercheck').toggleClass("Ledgercheck LedgercheckShow");
        $('#HideLedger').show();

    }

    $scope.LedgercheckOff = function () {
        window.location.reload();
    }

}]);