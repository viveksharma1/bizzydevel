myApp.controller('BankingCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $rootScope, $state, config) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });

   
  
    

    var start = moment().subtract(29, 'days');
    var end = moment();
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);
  //  $('#reportrange span').html(moment().format('DD-MMM-YY' + ' - ' + 'DD-MMM-YY'));
   // $('#reportrange').daterangepicker(optionSet1, cb);


    //Get the height of the first item
    $('.Tabmask').css({ 'height': $('#panel-1').height() });

    //Calculate the total width - sum of all sub-panels width
    //Width is generated according to the width of #mask * total of sub-panels
    $('.panelbox').width(parseInt($('.Tabmask').width() * $('.panelbox section').length));

    //Set the sub-panel width according to the #mask width (width of #mask and sub-panel must be same)
    $('.panelbox section').width($('.Tabmask').width());

    //Get all the links with rel as panel
    $('a[rel=panel]').click(function () {

        //Get the height of the sub-panel
        var panelheight = $($(this).attr('href')).height();

        //Set class for the selected item
        $('a[rel=panel]').removeClass('selected');
        $(this).addClass('selected');

        //Resize the height
        $('.Tabmask').animate({ 'height': panelheight }, { queue: false, duration: 1000 });

        //Scroll to the correct panel, the panel id is grabbed from the href attribute of the anchor
        $('.Tabmask').scrollTo($(this).attr('href'), 800);

        //Discard the link default behavior
        return false;
    });
    //get bank data 
    $scope.supplier = {};
    console.log($scope.supplier);
    $http.get(config.api + "BankTransactions").then(function (response) {
        $scope.BankData = response.data;
    });

    $scope.supliers = []
    $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
        $scope.supliers = response.data;
    });
    
    //upload bank data
    $scope.uploadFile = function () {
        $scope.rows = [];
        $scope.ExeclDataRows = [];
        $scope.Key = [];
        $scope.KeyArray = [];
        var KeyName1;
        var file = $scope.myFile;
        this.parseExcel = function (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });

                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                    for (key in XL_row_object) {
                        var retObj = {};

                        for (var obj in XL_row_object[key]) {

                            var obj1 = obj.replace(" ", "");

                            retObj[obj1] = XL_row_object[key][obj];
                            var Keyobj = [];
                            var KeyName = obj;
                            Keyobj[KeyName1] = KeyName;
                            $scope.Key.push(Keyobj);
                        }

                        $scope.ExeclDataRows.push(retObj);
                        $scope.rows = [];
                        $scope.KeyArray = $scope.Key;
                        $scope.Key = [];

                    }
                })
                $scope.BankData = $scope.ExeclDataRows

                $http.post(config.login + "postBanktransaction", $scope.BankData).then(function (response) {
                    $http.get(config.api + "BankTransactions").then(function (response) {
                        $scope.BankData = response.data;
                    })
                })
              

            };

            reader.onerror = function (ex) {

            };

            reader.readAsBinaryString(file);
        };
        var data = this.parseExcel(file);
    };

    $scope.openPopup = function (data) {

        $scope.amount1 = data.PaidOut


        $('#openPopup').modal('show');



    }


    $scope.account = {};

    console.log($scope.account);
    //make payment 
    $scope.$watch('supplier.selected', function () {
        $http.get(config.api + "transactions" + "?filter[where][supCode]=" + $scope.supplier.selected.supCode + "&filter[where][status]=OPEN").then(function (response) {
            $http.get(config.api + "accounts" + "?[filter][where][accountName]=" + $scope.supplier.selected.company).then(function (response) {
                console.log(response.data[0].credit);
                $scope.creditAmount = Number(response.data[0].credit);
                $scope.debitAmount = Number(response.data[0].debit);
                $scope.outstandingBalance = $scope.creditAmount - $scope.debitAmount
               
            })
            $scope.billData = response.data;

        });
    });
    //get account data
    
    $http.get(config.api + "accounts" + "?[filter][where][type]=Bank" + "&[filter][fields][accountName]=true").then(function (response) {
        
        $scope.accounts = response.data
        console.log($scope.account);
    })
  
    $scope.makePayment = function (data) {

        var date = new Date();
        $scope.no = data.no
        $scope.amount = data.amount
        $scope.balance = data.balance
        var paymentAmount = $("#abc").val();

        console.log(paymentAmount)

      
           
               
                $scope.paidAmount = Number(paymentAmount);
                $scope.newAmount = Number($scope.balance - paymentAmount);
                if ($scope.newAmount != '0') {
                    var data = {
                        amount: $scope.amount,
                        status: ['OPEN'],
                        balance: $scope.newAmount
                    }
                    $http.post(config.api + 'transactions' + '/update' + '?[where][no]=' + $scope.no, data).success(function (data) {

                    });
                }
                else {
                    var data = {
                        amount: $scope.amount,
                        status: ['CLOSED'],
                        balance: $scope.newAmount
                    }
                    $http.post(config.api + 'transactions' + '/update' + '?[where][no]=' + $scope.no, data).success(function (data) {
                    });
                }
                var date = $("#PaymentdateCheque").val()
                $scope.No = "REF " + $scope.no
                var data1 = {
                    compCode: localStorage.CompanyId,
                    supliersName: $scope.supplier.selected.company,
                    email: $scope.email,
                    ordertype: "PAYMENT",
                    date: date,
                    no: $scope.No,
                    balance: $scope.newAmount,
                    amount: $scope.paidAmount
                }

                var data2 = {
                    compCode: localStorage.CompanyId,
                    supliersName: $scope.supplier.selected.company,
                    accountName: $scope.account.selected.accountName,
                    email: $scope.email,
                    date: date,
                    no: $scope.no,
                    particular: $scope.supplier.selected.company,
                    credit: 0,
                    type: 'Bill Payment',
                    debit: $scope.paidAmount.toFixed(2),
                    value: $scope.paidAmount.toFixed(2),
                    Inventory: {
                        compCode: localStorage.CompanyId,
                        supliersName: $scope.supplier.selected.company,
                        accountName: $scope.supplier.selected.company,
                        email: $scope.email,
                        date: date,
                        no: $scope.no,
                        particular: $scope.account.selected.accountName,
                        credit: 0,
                        type: 'Bill Payment',
                        debit: $scope.paidAmount.toFixed(2),
                        value: $scope.paidAmount.toFixed(2),
                    }
                }
                $http.post(config.login + "transaction", data2).then(function (response) {

                });
                $http.post(config.api + 'transactions', data1)
                      .success(function (data) {
                          $("#addInventryModal1").modal("hide");
                      });
            }
        
    


}]);