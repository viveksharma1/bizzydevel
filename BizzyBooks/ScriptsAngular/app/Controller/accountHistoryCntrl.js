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
        var amount1 = ''
        var amount2 = ''
        for (var i = 0; i < $scope.ledgerData.length; i++) {
            var remarks;
            if ($scope.ledgerData[i].remarks) {
                var remarks = $scope.ledgerData[i].remarks
            }
            else {
                remarks = '';
            }
            if ($scope.ledgerData[i].particular1) {
              //  var particular1 = " & " + localStorage[$scope.ledgerData[i].particular1]
                var amount1 =  $scope.ledgerData[i].amount1
                var amount2 = $scope.ledgerData[i].amount2
                $scope.ledgerData[i].particular1 = localStorage[$scope.ledgerData[i].particular1] + ' '  + amount2 
            }
            else {
                particular1 = '';
                 amount1 = '',
                 amount2 = ''
            }
            $scope.ledgerData[i].accountName = localStorage[$scope.ledgerData[i].accountName]
            $scope.ledgerData[i].particulars = localStorage[$scope.ledgerData[i].particular] + remarks + ' ' +  amount1
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
        console.log(data)
        console.log($stateParams.balanceType)
            if ($stateParams.balanceType == 'credit' && data.credit ) {
                balance = Number(data.credit) - Number(data.debit)
            }
            if ($stateParams.balanceType == 'debit') {
                balance = Number(data.debit) - Number(data.credit)
            }
            console.log(balance)
            return balance
    }
    $scope.$on('date-changed', function (event, args) {
        $scope.fdate = args.fromDate;
        $scope.tDate = args.toDate;
        //console.log($scope.closingBalance);
        $http.post(config.login + "getOpeningBalnce/" + $stateParams.accountId + "?date=" + localStorage.fromDate + "&todate=" + localStorage.toDate + "&role=" + localStorage.usertype, [localStorage.CompanyId]).then(function (response) {
            var openingBalance = response.data.openingBalance
            $scope.openingBalance = calculateOpenningBalnce(openingBalance)
            console.log($scope.openingBalance)
            bindAccountName(response.data.ledgerData)
        });
        $http.post(config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + $stateParams.accountId + "&role=" + localStorage.usertype, [localStorage.CompanyId]).then(function (response) {
            var closingBalance = response.data.openingBalanc
            $scope.closingBalance = calculateOpenningBalnce(closingBalance);
            console.log("closingBalance", $scope.closingBalance);
            console.log($scope.closingBalance);

        });
    });
        
        $scope.applyDateFilter = function (compCode) {
            var toDate = new Date(localStorage.toDate);
            var fromDate = new Date(localStorage.fromDate)
            $http.post(config.login + "getOpeningBalnce/" + $stateParams.accountId + "?date=" + localStorage.fromDate + "&todate=" + localStorage.toDate + "&role=" + localStorage.usertype, compCode).then(function (response) {
                console.log(response)
                $scope.openingBalance = calculateOpenningBalnce(response.data.openingBalance)
                console.log($scope.openingBalance)
                bindAccountName(response.data.ledgerData)
            });
            $http.post(config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + $stateParams.accountId + "&role=" + localStorage.usertype, compCode).then(function (response) {
                 var closingBalance = response.data.openingBalance 
                    $scope.closingBalance = calculateOpenningBalnce(closingBalance);
                    console.log("closingBalance", $scope.closingBalance);
                    console.log($scope.closingBalance);        
            });
        }

        var compCode = []
        $scope.company = {};
        if (localStorage.usertype == 'UO') {
            var allCompCode = JSON.parse(localStorage.comobj);
            for (var i = 0; i < allCompCode.length; i++) {
                compCode.push(allCompCode[i].CompanyId)
            }
            $scope.company = { selected: allCompCode }
            console.log(compCode)
            $scope.applyDateFilter(compCode);
        }
        else {
            $scope.applyDateFilter([localStorage.CompanyId]);
        }
       
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
        if (voType == 'Purchase Settelment') {

            $state.go('Customer.PurchaseInvoiceSattlement', { voId: id }); 
        }
        if (voType == 'Journal Entry') {
            $state.go('Customer.JournalEntry', { voId: id });
        }
        if (voType == 'Contra Entry') {
            $state.go('Customer.ContraEntry', { voId: id });
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
    $http.get(config.api + "CompanyMasters").then(function (response) {
        $scope.companyList = response.data;
    });
    $scope.getCompcode = function (companyId) {
        compCode.push(companyId)
        $scope.applyDateFilter(compCode);
        localStorage.selectedCompany = compCode
    }

    $scope.removeCompCode = function (companyId) {
        var index = compCode.indexOf(companyId);
        if (index > -1) {
            compCode.splice(index, 1);
        }
        localStorage.selectedCompany = compCode
        $scope.applyDateFilter(compCode);
    }
   

}]);