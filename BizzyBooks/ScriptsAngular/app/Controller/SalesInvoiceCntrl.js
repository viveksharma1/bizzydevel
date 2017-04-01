myApp.controller('SalesInvoiceCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state','config', function ($scope, $http, $timeout, $rootScope, $state,config) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $('#DueDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    $('#InvoiceDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $('#actualDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $('#IssueDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $('#RemovalDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $scope.goBack = function () {
        window.history.back();
    }

    $("#myPopover").popover({
        //  title: '<h3 class="custom-title"><span class="glyphicon glyphicon-info-sign"></span> Popover Info</h3>',
        content: "<table style='width:100%'><tr><th>Date</th><th>Amount Applied</th><th>Payment No.</th></tr><tr><td><a href=''>17/03/2017</a></td><td>Rs500.00</td><td>58</td></tr><tr><td><a href=''>17/03/2017</a></td><td>Rs500.00</td><td>58</td></tr></table>",
        html: true
    })


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

    $scope.AddLineItem = function () {
        $('#AddLineItemModal').modal('show');
    }


    $('.btnhover button').click(function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active');
    })

    $scope.salesAccount = {};

    //Initialization
    $scope.supplier = {};
    $scope.account = {}
    $scope.totalAmountINR = 0;
    $scope.invoiceType = "Tax";
    $scope.customerType = "Consignee";
    $scope.$watch('supplier.selected', function () {
        if ($scope.supplier.selected) {
            if ($scope.supplier.selected.billingAddress.length > 0) {
                $scope.shippingAddress = $scope.supplier.selected.billingAddress[0].street
            }
            if ($scope.supplier.selected.email) {
                $scope.email = $scope.supplier.selected.email

            }

        }
    });
    //$scope.$watch('accounts.selected', function () {
    //    $scope.accountAmount = null;
    //    if ($scope.accounts.selected.rate) {
    //        $scope.accountAmount = Number($scope.totalAmountINR) * Number($scope.accounts.selected.rate) / 100;
    //    }
    //});

    $scope.$watch('account.selected', function () {
        $scope.accountAmount = null;
        if ($scope.account.selected && $scope.account.selected.rate ) {
            $scope.accountAmount = Number($scope.totalAmountINR) * Number($scope.account.selected.rate) / 100;
        }
    });
    $scope.billNoValid = false;
    $("#billNo").focusout(function () {

        var billNo = $scope.billNo;

        if (billNo != undefined) {
            $http.get(config.api + "transactions" + "/count" + "?where[no]=" + $scope.billNo).then(function (response) {
                $timeout(function () {
                    var data = response.data;
                    if (response.data.count > 0) {
                        showErrorToast("Bill no already exists");
                    } else {
                        $scope.billNoValid = true;
                    }
                    
                });
            });
        }
    })

    $scope.paymentTerm = function () {
        $scope.billDueDate = moment($scope.billDate, "DD/MM/YYYY").add($scope.paymentDays, 'days').format('DD/MM/YYYY');
    }


    $scope.getSupplier = function () {
        $scope.supliers = []
        $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
            $scope.supliers = response.data;
        });
    }
    $scope.getSupplierDetail = function (supplierName) {
        $scope.supliersDetail = []
        $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId + "&filter[where][company]=" + supplierName).then(function (response) {
            $scope.supliersDetail = response.data;
            console.log(response.data)
            $scope.shippingAddress = $scope.supliersDetail[0].billingAddress[0].street;
            $scope.email = $scope.supliersDetail[0].email;
        });
    }

    $http.get(config.api + "accounts").then(function (response) {
        $scope.salesAccounts = response.data;

    });
    $http.get(config.api + "accounts").then(function (response) {
        $scope.accounts = response.data
        console.log($scope.accounts);
    });

    $scope.setInvoiceType = function (type) {
        $scope.invoiceType = type;
        console.log($scope.invoiceType)
    }
    $scope.setCustomerType = function (type) {
        $scope.customerType = type;
        console.log($scope.customerType)
    }
    $scope.accountTable = [];
    $scope.addAccount = function () {
        if ($scope.account.selected == undefined) {
            showErrorToast("please select account");
            return;
        }
        if (isNaN($scope.accountAmount) || $scope.accountAmount == null) {
            showErrorToast("please enter amount");
            return;
        }
        var accountData = {
            accountName: $scope.account.selected.accountName,
            description: $scope.accountDescription,
            amount: $scope.accountAmount
        }

        if ($scope.edit1 == true) {
            $scope.accountTable[$scope.index] = accountData;
        } else {
            $scope.accountTable.push(accountData);
        }
        $scope.edit1 = false;

       accountTableSum();
    }
    $scope.editAccountTable = function (data, index) {
        $scope.idSelected = index;
        $scope.index = index;
        $scope.edit1 = true;
        $scope.account = { selected: { accountName: data.accountName } };
        $scope.accountDescription = data.description
        $scope.amount = data.amount

    }
    $scope.removeAccountTable = function (index) {
        $scope.accountTable.splice(index, 1);
        accountTableSum();
    }
    function accountTableSum() {
        var amount = 0;
        for (var i = 0; i < $scope.accountTable.length; i++) {
            amount += Number($scope.accountTable[i].amount);
        }
        $scope.totalAccountAmount = Number(amount);
    }

    $scope.refreshAccountTable = function ($select) {
        var search = $select.search,
          list = angular.copy($select.items),
          FLAG = -1;
        list = list.filter(function (item) {
            return item.id !== FLAG;
        });
        if (!search) {
            //use the predefined list
            $select.items = list;
        }
        else {
            //manually add user input and set selection
            var userInputItem = {
                id: FLAG,
                name: search
            };
            $select.items = [userInputItem].concat(list);
            // $scope.account.push({ accountName: $scope.accounts.selected.accountName });

        }
    }
    function dateFormat(date) {
        try{
            var res = date.split("/");
            console.log(res);
            var month = res[1];
            var days = res[0]
            var year = res[2]
            var date = month + '/' + days + '/' + year;
            return date;
        }catch(e){
            return;
        }
    }
    $scope.saveInvoice = function () {
        if ($scope.supplier.selected == undefined || $scope.supplier.selected==null) {
            showErrorToast("Please select customer");
            return;
        }
        if ($scope.salesAccount.selected == undefined || $scope.salesAccount.selected == null) {
            showErrorToast("Please select account");
            return;
        }
        

        
        if (!$scope.billDate) {
            showErrorToast("Invoice date is not valid");
            return;
        }
        if (!$scope.billDueDate) {
            showErrorToast("Invoice due date is not valid");
            return;
        }

        if (!$scope.billNoValid) {
            showErrorToast("Bill no is not valid");
            return;
        }
        if ($scope.totalAccountAmount) {
            $scope.salesAmount = parseFloat($scope.totalAmountINR.toFixed(2)) + parseFloat($scope.totalAccountAmount);
        }
        else {
            $scope.salesAmount = parseFloat($scope.totalAmountINR.toFixed(2));
        }
        
        var data = {
            compCode: localStorage.CompanyId,
            type: "Sales Invoice",
            role: localStorage['usertype'],
            date: dateFormat($scope.billDate),
            duedate: dateFormat($scope.billDueDate),
            amount: $scope.salesAmount,
            vochNo: $scope.billNo,
            state: "PAID",
            customerName: $scope.supplier.selected.company,
            email: $scope.supplier.selected.email,
            remark: $scope.narration,
            invoiceData: {
                invoiceSubType: $scope.invoiceType,
                customerType:$scope.customerType,
                issueDate: dateFormat($scope.issueDate),
                removalDate:dateFormat($scope.removalDate),
                customerAccount: $scope.supplier.selected.company,
                ledgerAccount: $scope.salesAccount.selected.accountName,
                saleAmount:$scope.salesAmount,
                remarks: $scope.narration,
                billData: $scope.paidData,
                accountlineItem: $scope.accountTable
            },
        }


        $http.post(config.login + "saveVoucher", data).then(function (response) {
            showSuccessToast("Bill Save Succesfully");
        });

    };
    
    $scope.getSupplier();
}]);