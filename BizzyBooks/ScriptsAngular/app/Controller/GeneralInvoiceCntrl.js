myApp.controller('GeneralInvoiceCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $('#InvoiceDate').datepicker();

    $('#DueDate').datepicker();
    $('#actualDate').datepicker();
    $('#IssueDate').datepicker();
    $('#RemovalDate').datepicker();
   

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
        if ($scope.account.selected && $scope.account.selected.rate) {
            $scope.accountAmount = Number($scope.totalAmountINR) * Number($scope.account.selected.rate) / 100;
        }
    });
  
    $("#billNo").focusout(function () {

        var billNo = $scope.billNo;

        if (billNo != undefined) {
            $http.get(config.api + "voucherTransactions" + "/count" + "?where[no]=" + $scope.billNo).then(function (response) {
                $timeout(function () {
                    var data = response.data;
                    if (response.data.count > 0) {
                        showErrorToast("Bill no already exists");
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
            console.log(response.data)
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
        try {
            var res = date.split("/");
            console.log(res);
            var month = res[1];
            var days = res[0]
            var year = res[2]
            var date = month + '/' + days + '/' + year;
            return date;
        } catch (e) {
            return;
        }
    }


    $scope.AddInventory = function () {
        $('#AddInventoryModal').modal('show');
    }

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


    $scope.getSupplier();


    // get invoice data

    $scope.getInvoiceData = function (id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                  .then(function (response) {
                  
                      $scope.salesAccount = { selected: { accountName: response.data.invoiceData.ledgerAccount } };
                      $scope.supplier = { selected: { company: response.data.invoiceData.customerAccount } };
                      $scope.email = { selected: { company: response.data.email } };
                      $scope.totalAmount = response.data.amount
                      $scope.billDate = response.data.date
                      $scope.billNo = response.data.vochNo
                      $scope.narration = response.data.remark
                      $scope.totalAmount = response.data.amount
                     
                      $scope.removalDate = response.data.invoiceData.removalDate
                      $scope.itemTable = response.data.invoiceData.billData
                      $scope.issueDate = $filter('date')(response.data.invoiceData.issueDate, 'dd/MM/yyyy');
                      $scope.billDate = $filter('date')(response.data.date, 'dd/MM/yyyy');


                  });

    }


    if ($stateParams.voId) {
       
        $scope.getInvoiceData($stateParams.voId);
      
    }

    $http.get(config.api + "Inventories?filter[where][visible]=false").then(function (response) {
        $scope.ItemList = response.data;
        $scope.filterList = $scope.ItemList;
    });
    //model for change remarks
    //$scope.spnStatus = {};
    //$scope.txtRemarks = {};


    $scope.pcslengthmtr = {};
    $scope.grossweight = {};
    $scope.netweight = {};
    $scope.length = {};
    $scope.width = {};
    $scope.thickness = {};
    $scope.finish = {};
    $scope.grade = {};
    $scope.location = {};
    $scope.lotweight = {};
    $scope.incomingdate = {};
    $scope.coilsheetno = {};
    $scope.subcategory = {};

    $scope.clearFilter = function () {
        $scope.pcslengthmtr = {};
        $scope.grossweight = {};
        $scope.netweight = {};
        $scope.length = {};
        $scope.width = {};
        $scope.thickness = {};
        $scope.finish = {};
        $scope.grade = {};
        $scope.location = {};
        $scope.lotweight = {};
        $scope.incomingdate = {};
        $scope.coilsheetno = {};
        $scope.subcategory = {};
        $scope.filterList = $scope.ItemList;
    }
    $scope.applyFilter = function () {
        var qry = "Inventories?filter[where][visible]=false";
        if ($scope.subcategory.selected)
            qry = qry + "&filter[where][SUBCATEGORY]=" + $scope.subcategory.selected.SUBCATEGORY;
        if ($scope.coilsheetno.selected)
            qry = qry + "&filter[where][COILSHEETNO]=" + $scope.coilsheetno.selected.COILSHEETNO;
        if ($scope.incomingdate.selected)
            qry = qry + "&filter[where][INCOMINGDATE]=" + $scope.incomingdate.selected.INCOMINGDATE;
        if ($scope.lotweight.selected)
            qry = qry + "&filter[where][LotWeight]=" + $scope.lotweight.selected.LotWeight;
        if ($scope.location.selected)
            qry = qry + "&filter[where][LOCATION]=" + $scope.location.selected.LOCATION;
        if ($scope.grade.selected)
            qry = qry + "&filter[where][GRADE]=" + $scope.grade.selected.GRADE;
        if ($scope.finish.selected)
            qry = qry + "&filter[where][FINISH]=" + $scope.finish.selected.FINISH;
        if ($scope.thickness.selected)
            qry = qry + "&filter[where][THICKNESS]=" + $scope.thickness.selected.THICKNESS;
        if ($scope.width.selected)
            qry = qry + "&filter[where][WIDTH]=" + $scope.width.selected.WIDTH;
        if ($scope.length.selected)
            qry = qry + "&filter[where][LENGTH]=" + $scope.length.selected.LENGTH;
        if ($scope.netweight.selected)
            qry = qry + "&filter[where][NETWEIGHT]=" + $scope.netweight.selected.NETWEIGHT;
        if ($scope.grossweight.selected)
            qry = qry + "&filter[where][GROSSWT]=" + $scope.grossweight.selected.GROSSWT;
        if ($scope.pcslengthmtr.selected)
            qry = qry + "&filter[where][PCS/LENGTHINMTRS]=" + $scope.pcslengthmtr.selected.PCS / LENGTHINMTRS;

        $http.get(config.api + qry).then(function (response) {
            $scope.filterList = response.data;
            //console.log($scope.ItemList);
            //$scope.ItemCount = response.data.length;
        });
    }
   
    //select line item

    function sumItemTable(data) {
       
        var totalQty = 0;
        var totalAmount = 0;
        var totalItem = data.length;
        var totalweight = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].itemQty && data[i].itemAmount) {
                totalQty += Number(data[i].itemQty);
                totalAmount += Number(data[i].itemAmount);
                totalweight += Number(data[i].itemQty);
            }
        }
        $scope.totalQty = totalQty.toFixed(2);
        $scope.totalAmount = totalAmount.toFixed(2);
        $scope.totalItem = totalAmount.totalItem;
        $scope.totalweight = totalweight.toFixed(2);

    }

    $scope.applyRate = function (rate) {
        if (rate == 0) {
            $scope.itemRate = '';
        }
        if ($scope.itemCart.length > 0) {
          
            for (var i = 0; i < $scope.itemCart.length; i++) {
                $scope.itemCart[i].itemRate = rate
                $scope.itemCart[i].itemAmount = rate * Number($scope.itemCart[i].NETWEIGHT)

            }
            $scope.filterList = $scope.itemCart;
            sumItemTable($scope.filterList);
        }
        else {
            showSuccessToast("Please Select Item");
        }
       

    }

   
    $scope.itemCart = [];
    $scope.itemTable = [];
    $scope.selectAllLineItem = function (selectAllItem,allItemData) {
        if (selectAllItem == true) {
            $scope.itemCart = allItemData;
            $scope.selectItem = true;
            sumItemTable($scope.itemCart);
           
        }
        if (selectAllItem == false) {
            $scope.selectItem = false;
            $scope.itemCart = '';
            sumItemTable($scope.itemCart);
           
        }

    }
    $scope.selectLineItem = function (selectItem,id,itemData) {
        if (selectItem == true) {
            $scope.itemCart.push(itemData);
            sumItemTable($scope.itemCart);
            console.log($scope.itemCart);
        }
        if (selectItem == false) {
            for (var i = 0; i < $scope.itemCart.length; i++) {
                if($scope.itemCart[i].id == id )
                    $scope.itemCart.splice(i, 1)

            }
            sumItemTable($scope.itemCart);
           
        }
        console.log($scope.itemCart);

    }
    $scope.showItemCart = function () {
        $scope.filterList = $scope.itemCart;
        sumItemTable($scope.itemCart);
    }

    $scope.addItemToInvoice = function () {
        $scope.itemTable = $scope.itemCart
        sumItemTable($scope.itemTable);
        $('#AddInventoryModal').modal('hide');
        console.log($scope.itemTable);
    }
    $scope.removeItemTable = function (index) {
        $scope.itemTable.splice(index, 1);
        sumItemTable($scope.itemTable);
    }

    // save bill 


    $scope.saveInvoice = function () {
        if ($scope.supplier.selected == undefined || $scope.supplier.selected == null) {
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

       
        if ($scope.totalAccountAmount) {
            $scope.salesAmount = parseFloat($scope.totalAmountINR.toFixed(2)) + parseFloat($scope.totalAccountAmount);
        }
        else {
            $scope.salesAmount = parseFloat($scope.totalAmountINR.toFixed(2));
        }

        var data = {
            compCode: localStorage.CompanyId,
            type: "General Invoice",
            role: localStorage['usertype'],
            date: dateFormat($scope.billDate),
            duedate: dateFormat($scope.billDueDate),
            amount: $scope.totalAmount,
            vochNo: $scope.billNo,
            state: "OPEN",
            customerName: $scope.supplier.selected.company,
            email: $scope.supplier.selected.email,
            remark: $scope.narration,
            invoiceData: {
                invoiceSubType: $scope.invoiceType,
                customerType: $scope.customerType,
                issueDate: dateFormat($scope.issueDate),
                removalDate: dateFormat($scope.removalDate),
                customerAccount: $scope.supplier.selected.company,
                ledgerAccount: $scope.salesAccount.selected.accountName,
                saleAmount: $scope.totalAmount,
                remarks: $scope.narration,
                billData: $scope.itemTable             
            },
        }


        $http.post(config.login + "saveVoucher"+"?id="+ $stateParams.voId, data).then(function (response) {
            showSuccessToast("Invoice  Save Succesfully");
        });

    };

}]);