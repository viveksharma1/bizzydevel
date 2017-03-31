//var CompanyName;
myApp.controller('CustomerPdfViewCntrl', ['$scope', '$http', '$timeout', '$stateParams', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $stateParams, $rootScope, $state, config) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });
    if (localStorage.VAT_TIN_NO == "undefined") {
        $scope.VAT_TIN_NO = localStorage.VAT_TIN_NO;
        $scope.CST_TIN_NO = localStorage.CST_TIN_NO;
    }
    else {
        $scope.VAT_TIN_NO = localStorage.VAT_TIN_NO;
        $scope.CST_TIN_NO = localStorage.CST_TIN_NO;
    }

    if (localStorage.ChangeCompanyName == "undefined") {
        $scope.CompanyName = localStorage.DefaultCompanyName
    }
    else {
        $scope.CompanyName = localStorage.ChangeCompanyName;
    }

    $scope.usertype = localStorage.userType_Role;

    $scope.goBack = function () {
        window.history.back();
    }


    //get po
    var CustomerId = localStorage.InvoiceItem_CId;

    $http.get(config.api + "customerTransactions" + "?filter[where][customerId]=" + CustomerId).success(function (response) {

        $scope.CustomerInvoiceitemList = response[0].productInfo;
        $scope.CustomerName = response[0].customerName;
        var date = response[0].invoiceDate;
        var splitdate = date.substring(0, 10);
        $scope.InvoiceDate = splitdate;
        $scope.TinNo = response[0].tinNo;
        $scope.invoiceNo = response[0].invoiceNo;

    });


    //pdf 


    $scope.generatePDF = function () {

        kendo.drawing.drawDOM($("#upperdivId")).then(function (group) {

            console.log(group);

            console.log(kendo.drawing.pdf.saveAs(group, "PurchaseOrder PDF.pdf"))

            group.options.set("font", "30px Verdana");
        });

        var doc = new jsPDF();
        doc.setFontSize(20);


        var source = $('#upperdivId').html();




        doc.fromHTML(source, 15, 15, {
            'width': 170

        },


        function () {


            var data = new Blob([doc.output()], {
                type: 'application/pdf'
            });

            doc.output('datauri');
            var formData = new FormData();
            formData.append("pdf", data, "myfile.pdf");
            var request = new XMLHttpRequest();
            request.open("POST", 'http://localhost:4000/email'); // Change to your server
            request.send(formData);


        });





    }








    //get suppliers data




}]);