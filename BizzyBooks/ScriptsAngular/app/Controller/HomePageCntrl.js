myApp.controller('HomePageCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $rootScope, $state, config, $filter) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });
    var ctx = document.getElementById("myChart");
    var ctx1 = document.getElementById("myChart2");
    var ctx2 = document.getElementById("myChart3");
    var ctx3 = document.getElementById("myChart4");
    $scope.namechange = function () {
        $('#namechangeModal').modal('show');
    }
    $scope.userActivityLog = []
    $('#fdate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    var label = []
    var amount = []
    var label2 = []
    var amount2 = []
    var label3 = []
    var amount3 = []
    var label4 = []
    var amount4 = []
    $('#tdate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    function filterActivity(data) {
        var obj = {};
        var activity = data

        for (var i = 0; i < data.length; i++) {
           // obj = { fromNow: moment(data[i].date).startOf('hour').fromNow() }
            activity[i].fromNow = moment(data[i].date).startOf('hour').fromNow() 
        }
        return activity
    }
    $scope.userActivityLog = [];
    $http.get(config.api + "userActivities").then(function (response) {
        if (response.data.length > 0) {
           $scope.userActivityLog = filterActivity(response.data)
           // $scope.userActivityLog = response.data
           
        }
       
    });
   
   
   
    function parseData() {
        var data = $scope.report  
        for (var i = 0; i < data.length; i++) {
            label.push(data[i]._id.accountName)
            amount.push(Number(data[i].total,2))
        }
    }
    function parseData4() {
        var data = $scope.report4
        for (var i = 0; i < data.length; i++) {
            label4.push(data[i]._id.accountName)
            amount4.push(data[i].total)
        }
    }
    function getAggregateLineItems(data) {
        return Enumerable.From(data).GroupBy("$.month", null, function (key, g) {
            return {
                month: key,
                sum: g.Sum("$.total| 0")
            }
        })
       .ToArray();
    }
    
    function parseMonthData() {
        var data = $scope.report2
        for (var i = 0; i < data.length; i++) {
            var arr = data[i]._id.accountName.split("-");
            var months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            console.log("The current month is " + months[parseInt(arr[1], 10)])

            $scope.report2[i].month = months[parseInt(arr[1], 10)]
        }
        var t = getAggregateLineItems($scope.report2)
        console.log(t)
        for (var i = 0; i < t.length; i++) {    
            label2.push(t[i].month)
            amount2.push(Number(t[i].sum, 2))
        }
    }
    function parseMonthData1() {
        var data = $scope.report3
        for (var i = 0; i < data.length; i++) {
            var arr = data[i]._id.accountName.split("-");
            var months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            $scope.report3[i].month = months[parseInt(arr[1], 10)]
        }
        var t = getAggregateLineItems($scope.report3)
        console.log(t)
        for (var i = 0; i < t.length; i++) {
            label3.push(t[i].month)
            amount3.push(Number(t[i].sum, 2))
        }
    }
     
    var data = {
        datasets: [{
            data: amount,
            label: "",
            backgroundColor: [
                'rgba(255, 29, 13, 0.7)',
                'rgba(177, 196, 69, 0.7)',
                'rgba(53, 90, 216  , 0.7)',
                'rgba(37, 218, 135, 0.7)',
                'rgba(117, 136, 171  , 0.7)',
                'rgba(106, 46, 203  , 0.7)'
            ],
            borderColor: [
                 'rgba(0, 0, 86, 0.1)'
            ],
            hoverBackgroundColor: [
                 'rgba( 5, 153, 55, 0.1)'
           ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: label
    };
    var data2 = {
        datasets: [{
            data: amount2,
            label: "",
            backgroundColor: [
                 'rgba(165, 119, 250, 0.7)',
                 'rgba(177, 196, 69, 0.7)',
                 'rgba(53, 90, 216  , 0.7)',
                 'rgba(37, 218, 135, 0.7)',
                 'rgba(147, 136, 171  , 0.7)',
                 'rgba(106, 46, 203  , 0.7)'
            ],
            borderColor: [
                 'rgba(0, 0, 86, 0.1)'
            ],
            hoverBackgroundColor: [
                 'rgba( 5, 153, 55, 0.1)'
            ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: label2
    };
    var data3 = {
        datasets: [{
            data: amount3,
            label: "Amount",
          
            borderColor: [
                 'rgba(255, 29, 13, 0.3)'
            ],
            hoverBackgroundColor: [
                 'rgba( 5, 153, 55, 0.1)'
            ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: label3
    };
    var data4 = {
        datasets: [{
            data: amount4,
            backgroundColor: [
                'rgba(236, 216, 44, 0.7)',
                'rgba(92, 113, 227, 0.7)',
                'rgba(236, 16, 44  , 0.7)',
                'rgba(24, 27, 240, 0.7)',
                'rgba(17, 136, 171  , 0.7)',
                'rgba(106, 46, 203  , 0.7)'
            ],
           
            
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: label4
    };
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: data,

    });
   
    
    var myChart2 = new Chart(ctx1, {
        type: 'line',
        data: data2,

    });
    var myChart3 = new Chart(ctx2, {
        type: 'line',
        data: data3,

    });
    var myChart4 = new Chart(ctx3, {
        type: 'doughnut',
        data: data4,

    });

    function addData(chart, label, data) {
        
        chart.update();
       
    }
    $http.get(config.login + "getreport").then(function (response) {
        if (response.data.length > 0) {
            $scope.report = response.data
            console.log(response.data)
            parseData();
           
            addData(myChart, label, amount)
        }
        else {
            showSuccessToast("some internal problem");
        }
        $http.get(config.login + "getreport2").then(function (response) {
            if (response.data.length > 0) {
                $scope.report2 = response.data
                console.log(response.data)
                parseMonthData();
               
                addData(myChart2, label2, amount2)

            }
            else {
                showSuccessToast("some internal problem");
            }
        });
    });
    $http.get(config.login + "getreport3").then(function (response) {
        if (response.data.length > 0) {
            $scope.report3 = response.data
            console.log(response.data)
            parseMonthData1();

            addData(myChart3, label2, amount2)

        }
        else {
            showSuccessToast("some internal problem");
        }
    });
    $http.get(config.login + "getreport4").then(function (response) {
        if (response.data.length > 0) {
            $scope.report4 = response.data
            console.log(response.data)
            parseData4();

            addData(myChart4, label4, amount4)

        }
        else {
            showSuccessToast("some internal problem");
        }
    });

    // voucher transction 
    if (localStorage["usertype"] == 'O') {
        var type = ["Purchase Settelment", "Sales Settelment"]
        $http.post(config.login + "voucherTransactions" + "?compCode=" + localStorage.CompanyId + "&role=" + localStorage.usertype, type).then(function (response) {
            $scope.voucherTransaction = response.data;
        })
    } else {
        var type = ["Sales Invoice"]
        $http.post(config.login + "voucherTransactions" + "?compCode=" + localStorage.CompanyId + "&role=" + localStorage.usertype, type).then(function (response) {

            $scope.voucherTransaction = response.data;
        })
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

    var urlToChangeStream = config.api + "userActivities/change-stream?_format=event-stream";
    var src = new EventSource(urlToChangeStream);
    src.addEventListener('data', function (msg) {
        var d = JSON.parse(msg.data);
        console.log(d)
        if (d) {
            d.data.fromNow = moment(d.data.date).startOf('hour').fromNow()
            $scope.userActivityLog.push(d.data)
            $scope.$apply();
        }
      console.log(d.data);
    })
}]);
