myApp.controller('accountHistoryCntrl', ['$scope', '$http', '$stateParams', 'config', '$state', 'DTOptionsBuilder', '$filter', '$rootScope', '$timeout', function ($scope, $http, $stateParams, config, $state, DTOptionsBuilder, $filter, $rootScope, $timeout) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $scope.Accountbtn = function () {
        $('#formaccount').modal('show');
    };
    $scope.dtOptions = DTOptionsBuilder.newOptions()
         .withOption('processing', false)
         .withOption('scrolly', 300)
         .withOption('paging', false)
    $scope.userType = localStorage.usertype
    $http.get(config.api + "accounts/" + $stateParams.accountId + "?[filter][where][compCode]=" + localStorage.CompanyId).then(function (response) {
       $scope.accountData = response.data;
       console.log($scope.accountData);
    })
    $('#firstdate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
       
    });
    $('input, select').each(function (i, val) {
        $(this).attr('tabindex', i + 1);
    });
    $scope.tableRowExpanded = false;
    $scope.tableRowIndexCurrExpanded = "";
    $scope.tableRowIndexPrevExpanded = "";
    $scope.storeIdExpanded = "";
    $scope.dayDataCollapse = [false, false, false, false, false, false];
    $scope.ledgerData;
    $scope.dayDataCollapseFn = function () {
        for (var i = 0; $scope.ledgerData.length - 1; i++) {
            $scope.dayDataCollapse.append('true');
        }
    };


    // $scope.dayDataCollapseFn();
    var status;
    var gIndex = 0
    $scope.selectTableRow = function (index, storeId) {
        if ($scope.dayDataCollapse[gIndex] == true) {
            $scope.dayDataCollapse[gIndex] = false;
        }
        if (status == false) {
            $scope.dayDataCollapse[index] = true;
            status = true
        } else {
            $scope.dayDataCollapse[index] = false;
            status = false
        }
       
       
        gIndex = index
       

    };
    $scope.selectTableRow2 = function (index, storeId) {
        if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
        } else {

            if ($scope.tableRowExpanded === false && $scope.tableRowIndexCurrExpanded === "" && $scope.storeIdExpanded === "") {
                $scope.tableRowIndexPrevExpanded = "";
                $scope.tableRowExpanded = true;
                $scope.tableRowIndexCurrExpanded = index;
                $scope.storeIdExpanded = storeId;
                $scope.dayDataCollapse[index] = false;
            } else if ($scope.tableRowExpanded === true) {
                if ($scope.tableRowIndexCurrExpanded === index && $scope.storeIdExpanded === storeId) {
                    $scope.tableRowExpanded = false;
                    $scope.tableRowIndexCurrExpanded = "";
                    $scope.storeIdExpanded = "";
                    $scope.dayDataCollapse[index] = true;
                } else {
                    $scope.tableRowIndexPrevExpanded = $scope.tableRowIndexCurrExpanded;
                    $scope.tableRowIndexCurrExpanded = index;
                    $scope.storeIdExpanded = storeId;
                    $scope.dayDataCollapse[$scope.tableRowIndexPrevExpanded] = true;
                    $scope.dayDataCollapse[$scope.tableRowIndexCurrExpanded] = false;
                }
            }
        }
    };

    $('#lastdate').datepicker({
        format: 'dd/mm/yyyy',
       
        onClose: function () {
            $(this).focusNextInputField();
        },
        autoclose: true,
       
    });

    $scope.obType = $stateParams.obType
    console.log($scope.obType)
    function bindAccountName(data) {
        $scope.ledgerData = data;
        //$scope.dayDataCollapseFn();
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
            $scope.credit = undefined;
        } else {
            $scope.credit = Number(credit)
        }
        if (!debit) {
            $scope.debit = undefined;
          
        } else {
            $scope.debit = Number(debit)
        }
        if (!credit && !debit) {
            $scope.debit = undefined;
            $scope.credit = undefined;

        }
        $scope.totalCredit = credit
        $scope.totalDebit = debit
       
    }


    function getAllCompcode() {
        var companydata = JSON.parse(localStorage.comobj)
        var compcode = [] 
        for (var i = 0; i < companydata.length; i++) {
            compcode.push(companydata[i].CompanyId)
        }
        $scope.compcode = compcode
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
    $scope.oBalance = 0
    function calculateOpenningBalnce(data) {
        var balance = 0;
        $scope.openingBalanceCredit = undefined;
        $scope.openingBalanceDebit = undefined;
        console.log($stateParams.balanceType)
            if ($stateParams.balanceType == 'credit' && data.credit ) {
                balance = Number(data.credit) - Number(data.debit)
                $scope.oBalance = Number(data.credit) - Number(data.debit)
            }
            if ($stateParams.balanceType == 'debit') {
                balance = Number(data.debit) - Number(data.credit)
                $scope.oBalance = Number(data.debit) - Number(data.credit)
            }
           

            if (balance >0) {
                if ($stateParams.balanceType == 'credit') {
                    $scope.openingBalanceCredit = Math.abs(balance);
                    $scope.openingBalanceDebit = undefined;
                }
                else {
                    $scope.openingBalanceDebit = Math.abs(balance);
                    $scope.openingBalanceCredit = undefined;
                }
            }
            else {
                if ($stateParams.balanceType == 'debit') {
                    $scope.openingBalanceCredit = Math.abs(balance);
                    $scope.openingBalanceDebit = undefined;
                }
                else {
                    $scope.openingBalanceDebit = Math.abs(balance);
                    $scope.openingBalanceCredit = undefined;
                }
            }
            if (balance == 0) {
                $scope.openingBalanceDebit = undefined;
                $scope.openingBalanceCredit = undefined;
            }
            var totalClosingBalnce;
            var closingBalance;
            if ($stateParams.balanceType == 'credit') {
                closingBalance = Number($scope.totalCredit) - Number($scope.totalDebit)
            }
            if ($stateParams.balanceType == 'debit') {
               
                closingBalance = Number($scope.totalDebit) - Number($scope.totalCredit)
            }
            totalClosingBalnce = balance + closingBalance;
            console.log("totalClosingBalnce", totalClosingBalnce)
            if (totalClosingBalnce > 0) {
                if ($stateParams.balanceType == 'credit') {
                    $scope.closingBalanceCredit = Math.abs(totalClosingBalnce);
                    $scope.closingBalanceDebit = undefined;
                }
                else {
                    $scope.closingBalanceDebit = Math.abs(totalClosingBalnce);
                    $scope.closingBalanceCredit = undefined
                }
            }
            else {
                if ($stateParams.balanceType == 'debit') {
                    $scope.closingBalanceCredit = Math.abs(totalClosingBalnce);
                    $scope.closingBalanceDebit = undefined
                }
                else {
                    $scope.closingBalanceDebit = Math.abs(totalClosingBalnce);
                    $scope.closingBalanceCredit = undefined
                }
            }
            return balance
    }

   
   
    $scope.$on('date-changed', function (event, args) {
        $scope.fdate = args.fromDate;
        $scope.tDate = args.toDate;
        $http.post(config.login + "getOpeningBalnce/" + $stateParams.accountId + "?date=" + localStorage.fromDate + "&todate=" + localStorage.toDate + "&role=" + localStorage.usertype, [localStorage.CompanyId]).then(function (response) {
            var openingBalance = response.data.openingBalance
            bindAccountName(response.data.ledgerData)
            $scope.openingBalance = calculateOpenningBalnce(openingBalance)
            console.log($scope.openingBalance)          
        });     
    });
        
        $scope.applyDateFilter = function (compCode) {
            var toDate = new Date(localStorage.toDate);
            var fromDate = new Date(localStorage.fromDate)
            $http.post(config.login + "getOpeningBalnce/" + $stateParams.accountId + "?date=" + localStorage.fromDate + "&todate=" + localStorage.toDate + "&role=" + localStorage.usertype, compCode).then(function (response) {
               
                bindAccountName(response.data.ledgerData)
                $scope.openingBalance = calculateOpenningBalnce(response.data.openingBalance)
                           
            });          
        }

        function monthlyLedger(fdate, ldate, compCode) {
           
                    $http.post(config.login + "getOpeningBalnce/" + $stateParams.accountId + "?date=" + fdate + "&todate=" + ldate + "&role=" + localStorage.usertype, compCode).then(function (response) {

                        bindAccountName(response.data.ledgerData)
                      
                       $scope.openingBalance = calculateOpenningBalnce(response.data.openingBalance)
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
            // $scope.applyDateFilter(compCode);
            $http.post(config.login + "ledgerlastentry" + "?accountName=" + $stateParams.accountId + "&role=" + localStorage.usertype, compCode).then(function (response) {
                if (response) {
                    var lastDate = response.data.lastDate
                    var days = response.data.days
                    var firstDate = moment(lastDate).subtract(days, 'd');
                    $scope.toDate1 = lastDate
                    $scope.fromDate1 = new Date(firstDate)
                    monthlyLedger(new Date(firstDate), lastDate, compCode)
                }
            });
            
        }
        else {
            //$scope.applyDateFilter([localStorage.CompanyId]);
            //monthlyLedger(new Date(moment().subtract(1, 'month')), new Date(), [localStorage.CompanyId])
            $http.post(config.login + "ledgerlastentry" + "?accountName=" + $stateParams.accountId + "&role=" + localStorage.usertype, [localStorage.CompanyId]).then(function (response) {
                if (response) {
                    var lastDate = response.data.lastDate
                    var days = response.data.days
                    var firstDate = moment(lastDate).subtract(days, 'd');
                    $scope.toDate1 = lastDate
                    $scope.fromDate1 = new Date(firstDate)
                    monthlyLedger(new Date(firstDate), lastDate, [localStorage.CompanyId])
                }
            });
        }
        //setDate($scope._fDate, moment(new Date()).subtract(1, 'month'));
    //setDate($scope._tDate, new Date());


        $scope.getDetail = function (id, particular, index) {
                $http.get(config.api + "ledgers" + "?[filter][where][voRefId]=" + id).then(function (response) {
                    if (response) {
                        $scope.ledgerData[index].detail = response.data
                        //if ($scope.ledgerData[index].detail[0].voRefId == id) {
                        //    var index = response.data.indexOf(id);
                        //    if (index > -1) {
                        //        $scope.ledgerData[index].detail(index, 1);
                        //    }
                        //}
                        for (var i = 0; i < $scope.ledgerData[index].detail.length; i++) {
                            if (localStorage[$scope.ledgerData[index].detail[i].accountName] == particular) {
                                $scope.ledgerData[index].detail.splice(i, 1);
                                break;
                            }
                        }
                        for (var i = 0; i < $scope.ledgerData[index].detail.length; i++) {
                           
                                $scope.ledgerData[index].detail[i].particulars = localStorage[$scope.ledgerData[index].detail[i].accountName]
                                if ($scope.ledgerData[index].detail[i].credit) {
                                    $scope.ledgerData[index].detail[i].cr = 'Cr'
                                    $scope.ledgerData[index].detail[i].amount = Number($scope.ledgerData[index].detail[i].credit)
                                }
                                if($scope.ledgerData[index].detail[i].debit){
                                    $scope.ledgerData[index].detail[i].cr = 'Dr'
                                    $scope.ledgerData[index].detail[i].amount = Number($scope.ledgerData[index].detail[i].debit)
                                }
                            
                        }
                       
                    }
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

            $state.go('Customer.Payment', { voId: id, noBackTrack: true });
        }
        if (voType == 'General Invoice') {

            $state.go('Customer.GeneralInvoice', { voId: id });
        }
        if (voType == 'Sales Invoice') {
            if (localStorage.usertype == 'O') {
                $state.go('Customer.SalesInvoice', { voId: id });
            } else {
                $state.go('Customer.GeneralInvoice', { voId: id });
            }
            
        }
        if (voType == 'Receipt') {

            $state.go('Customer.Receipt', { voId: id, noBackTrack: true });
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
        if (voType == 'Sales Settelment') {

            $state.go('Customer.SalesInvoiceSattlement', { voId: id });
        }
        if (voType == 'Journal Entry') {
            $state.go('Customer.JournalEntry', { voId: id });
        }
        if (voType == 'Contra Entry') {
            $state.go('Customer.ContraEntry', { voId: id });
        }
        if (voType == 'Badla Voucher') {
            $state.go('Customer.BadlaVoucher', { voId: id });
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
    $('#DatefilterDiv').hide();

    $('#DateFilter').click(function (e) {
        $('#DatefilterDiv').toggle();
    });
   
    $scope._fDate = 'firstdate';
    $scope._tDate = 'lastdate';
    var d = new Date();
    var n = d.getDate();
    
    $scope.setPeriod = function () {
        var d = new Date(getDate($scope._fDate));
        d.setHours(0, 0, 0, 0);
        $scope.fromDate1 = d;
        d = new Date(getDate($scope._tDate));
        d.setHours(0, 0, 0, 0);
        $scope.toDate1 = d;  
        //$rootScope.$broadcast('date-changed', { fromDate: $scope.fromDate, toDate: $scope.toDate });

        monthlyLedger($scope.fromDate1, $scope.toDate1, [localStorage.CompanyId])
        $('#DatefilterDiv').hide();
    }
    
    $('#tdate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    $('#SearchFilterDiv').hide();

    $('.filterClose').click(function () {
        $('#DatefilterDiv').hide();
    });

    $('#SearchFilter').click(function () {
        $('#SearchFilterDiv').show();
    });
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
    $scope.remove = function (id) {
        var ledgerData =  $filter('orderBy')($scope.ledgerData, "date")
           ledgerData.splice(id, 1);
        
           $scope.ledgerData = ledgerData
        bindAccountName($scope.ledgerData)
        var totalClosingBalnce;
        var closingBalance;
        if ($stateParams.balanceType == 'credit') {
            closingBalance = Number($scope.totalCredit) - Number($scope.totalDebit)
        }
        if ($stateParams.balanceType == 'debit') {
            closingBalance = Number($scope.totalDebit) - Number($scope.totalCredit)
        }
        totalClosingBalnce = $scope.oBalance + closingBalance;
        console.log('totalClosingBalnce', totalClosingBalnce)
        console.log('totalClosingBalnce', $scope.oBalance)
        if (totalClosingBalnce > 0) {
            if ($stateParams.balanceType == 'credit') {
                $scope.closingBalanceCredit = Math.abs(totalClosingBalnce);
                $scope.closingBalanceDebit = undefined;
            }
            else {
                $scope.closingBalanceDebit = Math.abs(totalClosingBalnce);
                $scope.closingBalanceCredit = undefined
            }
        }
        else {
            if ($stateParams.balanceType == 'debit') {
                $scope.closingBalanceCredit = Math.abs(totalClosingBalnce);
                $scope.closingBalanceDebit = undefined
            }
            else {
                $scope.closingBalanceDebit = Math.abs(totalClosingBalnce);
                $scope.closingBalanceCredit = undefined
            }
        }
    }
    $scope.reloadData = function () {
        $state.reload()
    }
}]);