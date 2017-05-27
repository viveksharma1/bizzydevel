myApp.controller('CustomerCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $rootScope, $state, config) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.menuUp = function (e) {
        $(".statusBody").slideToggle("slow", function () {
            // Animation complete.
        })

        $('#menuUp i').toggleClass("fa-chevron-down fa-chevron-up")
        e.preventDefault();
    };
    $scope.getInvoice = function () {
        $http.get(config.login + 'getInvoiceData/' + localStorage.CompanyId + '?role=' + localStorage["usertype"]).then(function (response) {
            $scope.invoiceData = response.data;
            console.log(response.data);
            for (var i = 0; i < $scope.invoiceData.length; i++) {
                $scope.invoiceData[i].customer = localStorage[$scope.invoiceData[i].customer];

            }
            console.log($scope.InventoryList)
            $(".loader").hide()
        });
    }

   
    $scope.totalCustomerbtn = function () {

        $scope.getCustomer();

        $('#overdueInvoiceTable').hide();
        $('#paidInvoiceTable').hide();
        $('#example').show();
        $('#openInvoiceTable').hide();
    }



   $scope.overDueInvoicebtn = function (status) {

       $('#overdueInvoiceTable').show();
       $('#paidInvoiceTable').hide();
       $('#example').hide();
       $('#openInvoiceTable').hide();
   }

   $scope.paidInvoicebtn = function () {

       $scope.getInvoice();
       $('#overdueInvoiceTable').hide();
       $('#paidInvoiceTable').show();
       $('#example').hide();
       $('#openInvoiceTable').hide();

   }
   
   $scope.openInvoicebtn = function (status) {
       $scope.getInvoice();
       $('#overdueInvoiceTable').hide();
       $('#paidInvoiceTable').hide();
       $('#example').hide();
       $('#openInvoiceTable').show();
       

   }

   
   $scope.openInvoicebtn();
  
   $('#overdueInvoiceTable').hide();
   $('#paidInvoiceTable').hide();

  


   if ($rootScope.$previousState.controller == "SalesInvoiceCntrl") {
       $scope.openInvoicebtn();
   } 

 
   

    console.log($scope.customer);


    $('#NewCustomerCreate').click(function () {
        $('#NewCustomerCreateModal').modal('show');

    });

    var url = config.api + "customers";
    $scope.loading = true;
    $http.get(url).success(function (data) {

        $scope.customerlist = data;
        $scope.loading = false;
    })

    
    $scope.UpdateCustomerInfo = function (id, Name) {
        localStorage.CustomerId = id;
        localStorage.customerName = Name;

    }

    $scope.GetId_Customer = function (id) {
        localStorage.CustomerId_Invoice = id;


    }

    $scope.groupMasters = {};
    $scope.createAccount = function () {
        var accountData = {
            compCode: localStorage.CompanyId,
            accountName: $scope.company.toUpperCase(),
            Under: $scope.groupMasters.selected.name,
            type: $scope.groupMasters.selected.type,
            balance: $scope.balance,
            credit: 0,
            debit: 0,
            openingBalance: $scope.openingBalance,
            balanceType: $scope.groupMasters.selected.balanceType
        }

        $http.post(config.login + "createAccount", accountData).then(function (response) {
        });
    }

    $http.get(config.api + "groupMasters").then(function (response) {
        $scope.groupMaster = response.data
        console.log($scope.account);
    });
  


    //get customer data
   
   

   

    // get invoice data 
   
    //get customer data

    $scope.getCustomer = function () {
        $http.get(config.login + 'getPartytAccount/' + localStorage.CompanyId).then(function (response) {
            $scope.customerData = response.data;
            console.log(response.data);
        });
    }



    $('.btnhover button').click(function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active');
    });

    $('.filenameDiv').hide();
    $('.attechmentDescription').hide();
    $('.Attechmentdetail').click(function () {
        $('.filenameDiv').show();
        $("#name").append($("#NameInput").val());
        $("#type").append($("#uploadBtn").val());

    });

    $('#removeattachment').click(function () {
        $('.filenameDiv').hide();
    });

    $(":file").filestyle({ buttonName: "btn-sm btn-info" });

}]);