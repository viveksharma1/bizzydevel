myApp.controller('accountHistoryCntrl', ['$scope', '$http', '$stateParams', 'config', '$state', function ($scope, $http, $stateParams, config, $state) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $scope.Accountbtn = function () {
        $('#formaccount').modal('show');
    };
    $scope.userType = localStorage.usertype
    $http.get(config.api + "accounts/" + $stateParams.accountId + "?[filter][where][compCode]=" + localStorage.CompanyId).then(function (response) {
       $scope.accountData = response.data;
       console.log($scope.accountData);
    })
    function bindAccountName(data) {
        $scope.ledgerData = data;
        var credit = 0;
        var debit = 0;
        for (var i = 0; i < $scope.ledgerData.length; i++) {
            var remarks;
            if ($scope.ledgerData[i].remarks) {
                var remarks = $scope.ledgerData[i].remarks
            }
            else {
                remarks = '';
            }
            $scope.ledgerData[i].accountName = localStorage[$scope.ledgerData[i].accountName]
            $scope.ledgerData[i].particulars = localStorage[$scope.ledgerData[i].particular] + remarks
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
        $scope.credit = Math.abs(credit.toFixed(2))
        $scope.debit = Math.abs(debit.toFixed(2))
        console.log($scope.credit);
        console.log($scope.debit);
       
    }


    //$http.get(config.login + "getStartingBalance/" + $stateParams.accountId + "?compCode=" + localStorage.CompanyId).then(function (response) {
    //    $scope.accountInfo = response.data;
    //    console.log( "accountData",$scope.accountInfo)

    //});
    function getAllCompcode() {
        var companydata = JSON.parse(localStorage.comobj)
        var compcode = [] 
        for (var i = 0; i < companydata.length; i++) {
            compcode.push(companydata[i].CompanyId)
        }
        $scope.compcode = compcode
    }
    function getLedgerData() {
        var query = '';
        if (localStorage.usertype == 'UO') {
           query = "&filter[where][isUo]=" + true + "&filter[where][visible]=" + true
        }
        if (localStorage.usertype == 'O') {
            query = "&filter[where][isUo]=" + false
        }
        $http.get(config.api + "ledgers/" + "?filter[where][accountName]=" + $stateParams.accountId + query + "&filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {


            $scope.ledgerData = response.data;
            var credit = 0;
            var debit = 0;
            for (var i = 0; i < $scope.ledgerData.length; i++) {

                $scope.ledgerData[i].accountName = localStorage[$scope.ledgerData[i].accountName]
                $scope.ledgerData[i].particulars = localStorage[$scope.ledgerData[i].particular]


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
            $scope.credit = credit.toFixed(2)
            $scope.debit = debit.toFixed(2)
            
        });
    }
    getAllCompcode();
    $scope.dateFormat = function (date) {
        var res = date.split("/");
        console.log(res);
        var month = res[1];
        var days = res[0]
        var year = res[2]
        var date = month + '/' + days + '/' + year;
        return date;
    }
    "calculate opening Balance "

    function calculateOpenningBalnce(data) {
        var balance;
            console.log($scope.accountData);
            console.log(data)
            if ($scope.accountData.balanceType == 'credit' && data.credit ) {
                balance = data.credit - data.debit
            } else if ($scope.accountData.balanceType == 'debit' && data.debit) {
                balance = data.debit - data.credit
            }
            console.log(balance)
            return balance
    }
        $scope.$on('date-changed', function (event, args) {
            $scope.fdate = args.fromDate;
            $scope.tDate = args.toDate;
           
        $scope.closingBalance = Math.abs($stateParams.closingBalance)
        console.log($scope.closingBalance);
        //var toDate = $scope.dateFormat($scope.tDate)
        //var fromDate = $scope.dateFormat($scope.fdate)
        //localStorage.toDate = toDate
        //localStorage.fromDate = fromDate;
        $http.get(config.login + "getOpeningBalnce/" + $stateParams.accountId + "?compCode=" + localStorage.CompanyId + "&date=" + fromDate + "&todate=" + toDate).then(function (response) {
            console.log(response)
            $scope.openingBalance = calculateOpenningBalnce(response.data.openingBalance)
            console.log('opening balance',$scope.openingBalance)
            bindAccountName(response.data.ledgerData)
            $http.get(config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + toDate + "&accountName=" + $stateParams.accountId).then(function (response) {
                var closingBalance = response.data.openingBalance
                $http.get(config.api + "accounts/" + $stateParams.accountId + "?[filter][where][compCode]=" + localStorage.CompanyId).then(function (response) {
                    $scope.accountData = response.data;
                    $scope.closingBalance = calculateOpenningBalnce(closingBalance);
                    console.log($scope.closingBalance);
            });
            });
           
        });
        });
        
        $scope.applyDateFilter = function () {
            var toDate = new Date(localStorage.toDate);
            var fromDate = new Date(localStorage.fromDate)
            $scope.closingBalance = Math.abs($stateParams.closingBalance)
            $http.get(config.login + "getOpeningBalnce/" + $stateParams.accountId + "?compCode=" + localStorage.CompanyId + "&date=" + fromDate + "&todate=" + toDate).then(function (response) {
                console.log(response)
                $scope.openingBalance = calculateOpenningBalnce(response.data.openingBalance)
                console.log($scope.openingBalance)
                bindAccountName(response.data.ledgerData)
            });
            $http.get(config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + toDate + "&accountName=" + $stateParams.accountId).then(function (response) {
                 var closingBalance = response.data.openingBalance
                $http.get(config.api + "accounts/" + $stateParams.accountId + "?[filter][where][compCode]=" + localStorage.CompanyId).then(function (response) {
                    $scope.accountData = response.data;
                    $scope.closingBalance = calculateOpenningBalnce(closingBalance);
                    console.log("closingBalance", $scope.closingBalance);
                    console.log($scope.closingBalance);
                });
            });
        }
        $scope.applyDateFilter();
    $scope.getAllCompanyLedger = function () {
        $http.get(config.api + "ledgers/" + "?filter[where][accountName]=" + $stateParams.accountId).then(function (response) {
            bindAccountName(response.data)

            console.log($scope.compName)
        });

    }
    $scope.currentDate = moment(localStorage.toDate).format('DD/MM/YYYY')
    $scope.accountId = $stateParams.accountId;
    $scope.accountName = localStorage[$stateParams.accountId]
    console.log($scope.accountName);
   

 
    

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

            $state.go('Customer.Payment', { voId: id });
        }
        if (voType == 'General Invoice') {

            $state.go('Customer.GeneralInvoice', { voId: id });
        }
        if (voType == 'Sales Invoice') {

            $state.go('Customer.SalesInvoice', { voId: id });
        }
        if (voType == 'Receipt') {

            $state.go('Customer.Receipt', { voId: id });
        }
       

        if (voType == 'Badla') {

            $state.go('Customer.BadlaVoucher', { voId: id });
        }
        if (voType == 'Rosemate') {

            $state.go('Customer.RosemateVoucher', { voId: id });
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


    $scope.getAccountName = function (id) {
     
        console.log(localStorage[id])

        return localStorage[id];
    }


   

}]);