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

    

    $scope.AddLineItem = function (val) {
        $('#AddInventoryModal').modal('show');
        if (val) {
            $scope.clearFilter();
            $scope.itemChecked = [];
            $scope.itemCartChecked = [];
            $scope.itemCart = [];
            sumItemTable($scope.itemChecked);
            calculateCartTotal($scope.itemCart);
            $scope.showItemInventory();
        } else {
            $scope.showItemCart();
        }
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
    var qryAgg = 'visible=true&group={"INCOMINGDATE":"$INCOMINGDATE","SUBCATEGORY": "$SUBCATEGORY","COILSHEETNO":"$COILSHEETNO","LotWeight":"$LotWeight","LOCATION":"$LOCATION","GRADE":"$GRADE","FINISH":"$FINISH","GRADE":"$GRADE","THICKNESS":"$THICKNESS","WIDTH":"$WIDTH","LENGTH":"$LENGTH","NETWEIGHT":"$NETWEIGHT","GROSSWT":"$GROSSWT","GROSSWT":"$GROSSWT","GROSSWT":"$GROSSWT"}';
    $http.get(config.login + "getAggregateInventoriesUO?" + qryAgg).then(function (response) {
        $scope.ItemList = response.data;
        //$scope.filterList2 = $scope.ItemList2;
        //console.log($scope.ItemList);
        //$scope.ItemCount = response.data.length;
    });

    // get invoice data

    $scope.getInvoiceData = function (id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                  .then(function (response) {
                      $scope.paymentLog = response.data.paymentLog;
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

    $http.get(config.api + "Inventories?filter[where][visible]=false&filter[limit]=20").then(function (response) {
        $scope.ItemList2 = response.data;
        $scope.filterList = $scope.ItemList2;
    });

    $scope.copyItemQty = function (val) {
        return parseFloat(val);
    }
    $scope.rateChange = function (item, rate) {
        item.itemAmount = rate * Number(item.itemQty);
        if (!$scope.isCart)
            $scope.applyRate(rate, item);
        //sumItemTable($scope.itemChecked);
    };

    $scope.qtyChange = function (item, qty, oldQty) {
        if (isNaN(qty)) {
            item.itemQty = oldQty;
        }
        if (parseFloat(item.NETWEIGHT) - parseFloat(qty) >= 0) {
            item.itemAmount = qty * Number(item.itemRate);
            if (!$scope.isCart)
                $scope.applyRate(item.itemRate, item);
            //sumItemTable($scope.itemChecked);
        } else {
            //showErrorToast("Qty can not applied changing to old qty " + oldQty);
            if (qty.length > 0)
                item.itemQty = oldQty;
            else
                item.itemAmount = 0;
        }
    };
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
        $scope.filterList = $scope.ItemList2;
    }
    $scope.applyFilter = function () {
        var qry = "Inventories?filter[where][visible]=false";
        if ($scope.subcategory.selected)
            qry = qry + "&filter[where][SUBCATEGORY]=" + $scope.subcategory.selected._id.SUBCATEGORY;
        if ($scope.coilsheetno.selected)
            qry = qry + "&filter[where][COILSHEETNO]=" + $scope.coilsheetno.selected._id.COILSHEETNO;
        if ($scope.incomingdate.selected)
            qry = qry + "&filter[where][INCOMINGDATE]=" + $scope.incomingdate.selected._id.INCOMINGDATE;
        if ($scope.lotweight.selected)
            qry = qry + "&filter[where][LotWeight]=" + $scope.lotweight.selected._id.LotWeight;
        if ($scope.location.selected)
            qry = qry + "&filter[where][LOCATION]=" + $scope.location.selected._id.LOCATION;
        if ($scope.grade.selected)
            qry = qry + "&filter[where][GRADE]=" + $scope.grade.selected._id.GRADE;
        if ($scope.finish.selected)
            qry = qry + "&filter[where][FINISH]=" + $scope.finish.selected._id.FINISH;
        if ($scope.thickness.selected)
            qry = qry + "&filter[where][THICKNESS]=" + $scope.thickness.selected._id.THICKNESS;
        if ($scope.width.selected)
            qry = qry + "&filter[where][WIDTH]=" + $scope.width.selected._id.WIDTH;
        if ($scope.length.selected)
            qry = qry + "&filter[where][LENGTH]=" + $scope.length.selected._id.LENGTH;
        if ($scope.netweight.selected)
            qry = qry + "&filter[where][NETWEIGHT]=" + $scope.netweight.selected._id.NETWEIGHT;
        if ($scope.grossweight.selected)
            qry = qry + "&filter[where][GROSSWT]=" + $scope.grossweight.selected._id.GROSSWT;
        if ($scope.pcslengthmtr.selected)
            qry = qry + "&filter[where][PCS/LENGTHINMTRS]=" + $scope.pcslengthmtr.selected._id.PCS/LENGTHINMTRS;

        $http.get(config.api + qry).then(function (response) {
            $scope.filterList = response.data;
            //console.log($scope.ItemList);
            //$scope.ItemCount = response.data.length;
        });
    }
   
    //select line item
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


    $scope.salesAmount = 0;
    function gTotal() {
        if ($scope.totalAmount)
            $scope.salesAmount = parseFloat($scope.listTotalAmount);
        if ($scope.totalAccountAmount)
            $scope.salesAmount += parseFloat($scope.totalAccountAmount);
    }

    function sumItemTable(data) {
        var totalQty = 0;
        var totalAmount = 0;
        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].itemQty)
                    totalQty += Number(data[i].itemQty);

                if (data[i].itemAmount)
                    totalAmount += Number(data[i].itemAmount);
                //else if (!isNaN(data[i].itemQty * data[i].itemRate)) {
                //    totalAmount += data[i].itemQty * data[i].itemRate;
                //}

            }
        }
        $scope.totalQty = totalQty.toFixed(2);
        $scope.totalAmount = totalAmount.toFixed(2);
        $scope.totalItem = data == undefined ? 0 : data.length;
        //$scope.totalweight = totalweight.toFixed(2);
        //gTotal();
    }
    $scope.clearRate = function () {
        $scope.itemRate = null;
        $scope.applyRate('');
    }
    var item = {};
    $scope.newItem = [];
    var newItem;
    var newItem = $scope.newItem;
   
    $scope.applyRate = function (rate, item) {
        if (!$scope.isCart) {
            if ($scope.itemChecked.length > 0) {

                for (var i = 0; i < $scope.itemChecked.length; i++) {
                    if (item) {
                        if ($scope.itemChecked[i].id == item.id) {
                            $scope.itemChecked[i].itemRate = rate
                            $scope.itemChecked[i].itemAmount = item.itemAmount;
                            if (item.itemQty)
                                $scope.itemChecked[i].itemQty = item.itemQty;
                            //$scope.itemChecked[i].select = true;
                            break;
                        }
                    } else {
                        $scope.itemChecked[i].itemRate = rate
                        $scope.itemChecked[i].itemAmount = rate * Number($scope.itemChecked[i].itemQty);
                        $scope.itemChecked[i].select = true;
                    }

                }
                if ($scope.selectAllItem && !item)
                    angular.copy($scope.itemChecked, $scope.filterList);
                sumItemTable($scope.itemChecked);
            }
        }
        else {
            showSuccessToast("Please Select Item");
        }


    }



    $scope.itemChecked = [];
    $scope.itemCartChecked = [];
    $scope.itemCart = [];
    $scope.itemTable = [];
    $scope.selectAllLineItem = function (allItemData) {
        if (!$scope.isCart) {
            if ($scope.selectAllItem) {
                //$scope.itemChecked = [];
                //$scope.itemChecked=allItemData;//.push(allItemData);
                angular.copy(allItemData, $scope.itemChecked);
                sumItemTable($scope.itemChecked);
            } else {
                $scope.itemChecked = [];
                sumItemTable($scope.itemChecked);

            }
            angular.forEach($scope.itemChecked, function (item) {
                item.select = $scope.selectAllItem;
            });
            angular.forEach($scope.filterList, function (item) {
                item.select = $scope.selectAllItem;
            });
            //if ($scope.selectAllItem)
            //    angular.copy($scope.itemChecked, $scope.filterList);
            //else

        } else {
            if ($scope.selectAllItem) {
                //$scope.itemChecked = [];
                //$scope.itemChecked.push(allItemData);
                //$scope.itemChecked = allItemData;
                angular.copy(allItemData, $scope.itemCartChecked);
            } else {
                $scope.itemCartChecked = [];
            }
            angular.forEach($scope.itemCartChecked, function (item) {
                item.select = $scope.selectAllItem;
            });
            angular.forEach($scope.filterList, function (item) {
                item.select = $scope.selectAllItem;
            });
            //if ($scope.selectAllItem)
            //    angular.copy($scope.itemCartChecked, $scope.filterList);

        }



    }
   
    $scope.selectLineItem = function (itemData) {
      
        angular.copy(itemData, item);
        //angular.copy(itemData, $scope.newItem);

        console.log("item",item)
        if (!$scope.isCart) {
            if (itemData.select) {

                $scope.itemChecked.push(item);
                $scope.newItem.push(item);
                sumItemTable($scope.itemChecked);
                console.log($scope.itemChecked);
            } else {
                $scope.selectAllItem = false;
                for (var i = 0; i < $scope.itemChecked.length; i++) {
                    if ($scope.itemChecked[i].id == item.id)
                        $scope.itemChecked.splice(i, 1)

                }
                sumItemTable($scope.itemChecked);
            }
        } else {
            if (itemData.select) {
                $scope.itemCartChecked.push(item);
                console.log($scope.itemCartChecked);
            } else {
                $scope.selectAllItem = false;
                for (var i = 0; i < $scope.itemCartChecked.length; i++) {
                    if ($scope.itemCartChecked[i].id == item.id)
                        $scope.itemCartChecked.splice(i, 1)
                }
            }
        }
    }
    $scope.removeItemTable = function (index) {
        $scope.itemTable.splice(index, 1);
        sumItemListTable($scope.itemTable);
        gTotal();
    }

    $scope.showItemCart = function () {
        setIsCart(true);
        $scope.filterList = $scope.itemCart;
        setCheckValue(false, $scope.filterList);
        //sumItemTable($scope.filterList);
    }
    $scope.showItemInventory = function () {
        setIsCart(false);
        $scope.filterList = $scope.ItemList2;
        setCheckValue(false, $scope.filterList);
        sumItemTable($scope.itemChecked);
    }
    function setCheckValue(val, list) {
        $scope.selectAllItem = val;
        angular.forEach(list, function (item) {
            item.select = val;
        });
    }
    $scope.addToItemCart = function () {
        if (parseFloat($scope.totalAmount) > 0) {
            var itemChecked = $scope.itemChecked;
            var itemCart = $scope.itemCart;
            var found = false;
            for (var i = 0; i < itemChecked.length; i++) {
                for (var j = 0; j < itemCart.length; j++) {
                    if (itemCart[j].id === itemChecked[i].id) {
                        //check item qty can be added 
                        var availQty = parseFloat(itemCart[j].NETWEIGHT) - parseFloat(itemCart[j].itemQty);
                        if (availQty - parseFloat(itemChecked[i].itemQty) < 0)
                            showErrorToast("Only " + availQty + " can be added for Item " + itemChecked[i].DESCRIPTION);
                        itemCart[j].itemQty = parseFloat(itemCart[j].itemQty) + Math.min(availQty, parseFloat(itemChecked[i].itemQty));
                        found = true;
                        break;
                    }
                }
                if (!found)
                    itemCart.push(itemChecked[i]);
            }
            $scope.itemCart = itemCart;
            calculateCartTotal($scope.itemCart);
            $scope.itemChecked = [];
            setCheckValue(false, $scope.filterList);
            sumItemTable($scope.itemChecked);
        } else {
            showErrorToast("Amount can not be 0");
        }
        //$scope.selectItem = false;
    }
    $scope.removeFormCart = function (isAll) {
        if (isAll) {
            $scope.itemCart = [];
            angular.copy($scope.itemCart, $scope.filterList);
        }
        else {
            for (var i = 0; i < $scope.itemCartChecked.length; i++) {
                $scope.itemCart.splice($scope.itemCart.indexOf($scope.itemCartChecked[i]), 1);
            }
        }
        setCheckValue(false, $scope.filterList);
        calculateCartTotal($scope.filterList);
    }

    function calculateCartTotal(data) {
        var totalQty = 0;
        var totalAmount = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].itemQty)
                totalQty += Number(data[i].itemQty);

            if (data[i].itemAmount)
                totalAmount += Number(data[i].itemAmount);
        }
        $scope.cartTotalQty = totalQty.toFixed(2);
        $scope.cartTotalAmount = totalAmount.toFixed(2);
        $scope.cartTotalItem = data.length;

    }
    $scope.addItemToInvoice = function () {
        angular.copy($scope.itemCart, $scope.itemTable);// = ;
        sumItemListTable($scope.itemTable);
        $('#AddInventoryModal').modal('hide');
        console.log($scope.itemTable);
        setCheckValue(false, $scope.filterList);
        gTotal();
    }

    function sumItemListTable(data) {
        var totalQty = 0;
        var totalAmount = 0;
        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].itemAmount)
                    totalAmount += Number(data[i].itemAmount);
            }
        }
        //$scope.totalQty = totalQty.toFixed(2);
        $scope.listTotalAmount = totalAmount.toFixed(2);
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
    $scope.isCart = false;
    function setIsCart(val) {
        $scope.isCart = val;
    }

}]);