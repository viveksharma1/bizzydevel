myApp.controller('SalesInvoiceCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', '$stateParams', '$filter', 'FileUploader', 'commonService', 'SweetAlert', function ($scope, $http, $timeout, $rootScope, $state, config, $stateParams, $filter, FileUploader, commonService, SweetAlert) {
    if ($rootScope.$previousState == $state.current && $stateParams.voId == null) {
        window.history.back();
    }
    $(".my a").click(function (e) {
        e.preventDefault();
    })

    $('#DueDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    $('#InvoiceDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    
    $('#OrderDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $('#actualDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $('#RemovalTime').timepicker(
        { 'scrollDefault': 'now',
        'step':15  });
 
    $('#IssueTime').timepicker({
        'scrollDefault': 'now',
        'step': 15
    });


    $('#IssueDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $('#RemovalDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    $('#orderDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    
    $scope.goBack = function () {
        if ($rootScope.$previousState.name.length == 0 || $rootScope.$previousState == $state.current) {
            window.history.back();
        } else
            $state.go($rootScope.$previousState);
        //window.history.back();
    }
    $scope.add = function (type, value) {
        $('#formaccount').modal('show');
        $scope.myValue = { accountName: value };
    }

    $(":file").filestyle({ buttonName: "btn-sm btn-info" });
    var type = $stateParams.type;
    var uploader = $scope.uploader = new FileUploader({
        url: config.login + "upload"
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS
    uploader.onAfterAddingFile = function (fileItem) {
        if (fileItem.isOld && $scope.oldAttachment) {
            fileItem.title = $scope.oldAttachment.title;
            fileItem.cdnPath = $scope.oldAttachment.cdnPath;
        } else {
            console.info('onAfterAddingFile', fileItem);
            if ($scope.filename) {
                fileItem.title = $scope.filename;
                $scope.filename = null;
            } else {
                uploader.removeFromQueue(fileItem);// = null;
                fileItem = {};
            }
        }
        
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        fileItem.cdnPath = response.name;
    };
    


    $('.btnhover button').click(function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active');
    })

    $scope.salesAccount = {};
    $scope.rdi = false;
    //Initialization
    $scope.supplier = {};
    $scope.supplier2 = {};
    $scope.account = {}
    //$scope.totalAmountINR = 0;
    $scope.invoiceType = "Excise";
    $scope.customerType = "Consignee";

    $scope.oldAttachment = null;
    function bindAttachments(attachments, callback) {
        if (attachments) {
            angular.forEach(attachments, function (item) {
                $scope.oldAttachment = item;
    
                item.file.isOld = true;
                uploader.addToQueue(item.file);
               
            });
        }
        if (callback)
            callback();
    }
    $scope.setInvoiceType = function (type) {
        $scope.invoiceType = type;
        console.log($scope.invoiceType);
        updateItemTable();
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
            //accountName: $scope.account.selected.accountName,
            account: $scope.account.selected,
            description: $scope.accountDescription,
            amount: $scope.accountAmount
        }

        if ($scope.selectedAccIndex != null) {
            $scope.accountTable[$scope.selectedAccIndex] = accountData;
        } else {
            $scope.accountTable.push(accountData);
        }
        $scope.selectedAccIndex = null;
        clearAccountbox();
        accountTableSum();
    }
    function clearAccountbox() {
        $scope.account = {};
        //$scope.accountDescription = null;
        $scope.accountAmount = null;
    }
    $scope.selectedAccIndex = null;
    $scope.editAccountTable = function (data, index) {
        if ($scope.selectedAccIndex === index) {
            $scope.selectedAccIndex = null;
            clearAccountbox();
        } else {
            $scope.selectedAccIndex = index;
            $scope.account = { selected: data.account };
            $scope.accountAmount = data.amount;
        }
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
        gTotal();
        //$scope.sales
    }

    //$scope.refreshAccountTable = function ($select) {
    //    var search = $select.search,
    //      list = angular.copy($select.items),
    //      FLAG = -1;
    //    list = list.filter(function (item) {
    //        return item.id !== FLAG;
    //    });
    //    if (!search) {
    //        //use the predefined list
    //        $select.items = list;
    //    }
    //    else {
    //        //manually add user input and set selection
    //        var userInputItem = {
    //            id: FLAG,
    //            name: search
    //        };
    //        $select.items = [userInputItem].concat(list);
    //        // $scope.account.push({ accountName: $scope.accounts.selected.accountName });

    //    }
    //}

    $scope.clear = function ($event, $select) { ///ui select clear.
        $event.stopPropagation();
        //to allow empty field, in order to force a selection remove the following line
        $select.selected = undefined;
        //reset search query
        $select.search = undefined;
        //focus and open dropdown
        $timeout(function () {
            $select.activate();
        }, 200);
    }
    $scope.supplierSelected = function (data) {
        if ($scope.supplier.selected) {
            if ($scope.supplier.selected.billingAddress && $scope.supplier.selected.billingAddress.length > 0) {
                $scope.shippingAddress = $scope.supplier.selected.billingAddress[0].street
            }
            if ($scope.supplier.selected.email) {
                $scope.email = $scope.supplier.selected.email
            }
            if ($scope.supplier.selected.phone) {
                $scope.contactNo = $scope.supplier.selected.phone;
            }
            $scope.buyerType = data.balanceType == 'debit' ? " (Dr.) " : " (Cr.)";
            var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
            commonService.getOpeningBalance(url, [localStorage.CompanyId]).then(function (response) {
                if (response.data.openingBalance) {
                    $scope.buyerBalance = Math.abs(calculateOpenningBalnce(response.data.openingBalance, data.balanceType))
                } else {
                    $scope.buyerBalance = 0.00;
                }
            });
        }
    };
    $scope.supplier2Selected = function (data) {
        if ($scope.supplier2.selected) {
            if ($scope.supplier2.selected.billingAddress && $scope.supplier2.selected.billingAddress.length > 0) {
                $scope.shippingAddress2 = $scope.supplier2.selected.billingAddress[0].street
            }
            if ($scope.supplier2.selected.email) {
                $scope.email2 = $scope.supplier2.selected.email
            }
            if ($scope.supplier2.selected.phone) {
                $scope.contactNo2 = $scope.supplier2.selected.phone;
            }
            $scope.consigneeType = data.balanceType == 'debit' ? " (Dr.) " : " (Cr.)";
            var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
            commonService.getOpeningBalance(url, [localStorage.CompanyId]).then(function (response) {
                if (response.data.openingBalance) {
                    $scope.consigneeBalance = Math.abs(calculateOpenningBalnce(response.data.openingBalance, data.balanceType))
                } else {
                    $scope.consigneeBalance = 0.00;
                }
            });
        }
    };
    $scope.taxAccountSelected = function () {
        $scope.accountAmount = null;
        if ($scope.account.selected && $scope.account.selected.rate) {
            $scope.accountAmount = Number(((Number($scope.totalAccountAmount ? $scope.totalAccountAmount : 0) + Number($scope.listTotalAmount ? $scope.listTotalAmount : 0)) * Number($scope.account.selected.rate) / 100).toFixed(2));
        }
    }
    $scope.getInvoiceData = function (id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                  .then(function (response) {
                      $scope.invoiceType = response.data.invoiceData.invoiceSubType;
                      $scope.salesAccount = {
                          selected: {
                              accountName:
                                  localStorage[response.data.invoiceData.ledgerAccountId], id: response.data.invoiceData.ledgerAccountId
                          }
                      };
                      $scope.supplier = { selected: { accountName: localStorage[response.data.invoiceData.customerAccountId], id: response.data.invoiceData.customerAccountId } };
                      $scope.supplier2 = { selected: { accountName: localStorage[response.data.invoiceData.consigneeAccountId], id: response.data.invoiceData.consigneeAccountId } };
                      $scope.totalAmount = response.data.amount;
                      $scope.billNo = response.data.vochNo;
                      $scope.comInvoiceNo = response.data.comInvoiceNo;
                      $scope.exciseInvoiceNo = response.data.exciseInvoiceNo;
                      $scope.orderNo = response.data.invoiceData.orderNo;
                      setDate($scope.orderDate, response.data.invoiceData.orderDate);
                      $scope.termsDelivery = response.data.invoiceData.termsDelivery;
                      $scope.narration = response.data.remark;
                      $scope.totalAmount = response.data.amount;
                      $scope.intRate = response.data.invoiceData.roi;
                      $scope.modeTransport = response.data.invoiceData.modeTransport;
                      $scope.vehicleNo = response.data.invoiceData.vehicleNo;
                      $scope.rdi = response.data.invoiceData.rdi;
                      $scope.itemTable = response.data.invoiceData.billData;
                      angular.copy($scope.itemTable, $scope.itemTableTemp);
                      $scope.accountTable = response.data.invoiceData.accountlineItem;
                      setDate($scope.billDate, response.data.date);
                      setDate($scope.billDueDate, response.data.duedate);
                      setDate($scope.billIssueDate, response.data.invoiceData.issueDate, $scope.billIssueTime);// $filter('date')(response.data.invoiceData.issueDate, 'dd/MM/yyyy');
                      setDate($scope.billRemovalDate, response.data.invoiceData.removalDate, $scope.billRemovalTime);// $filter('date')(response.data.invoiceData.issueDate, 'dd/MM/yyyy');
                      $scope.paymentDays = response.data.invoiceData.paymentDays;
                      getSupplierDetail(response.data.invoiceData.customerAccountId);
                      getSupplierDetail(response.data.invoiceData.consigneeAccountId, true);
                      if (response.data.paymentLog) {
                          $scope.receiptCount = response.data.paymentLog.length;
                          $scope.receipts = response.data.paymentLog;
                      } else {
                          $scope.receiptCount = null;
                          $scope.receipts = [];
                      }

                      sumItemListTable($scope.itemTable);
                      accountTableSum();


                      $scope.attachements = response.data.invoiceData.attachements;
                      bindAttachments(response.data.invoiceData.attachements, function () {
                          $scope.oldAttachment = null;
                      });


                  });

    }
    $scope.remarks = {};
    $scope.godown = {};
    $scope.description = {};
    $scope.rgno = {};
    $scope.exciseDuty = {};
    $scope.SAD = {};
    $scope.NETWEIGHT = {};
    $scope.billNoValid = false;
    $scope.comInvoiceNoValid = true;
    $scope.exciseInvoiceNoValid = true;
    $scope.clearFilter = function () {
        $scope.godown = {};
        $scope.description = {};
        $scope.remarks = {};
        $scope.rgno = {};
        $scope.exciseDuty = {};
        $scope.SAD = {};
        $scope.NETWEIGHT = {};
        $scope.filterList = $scope.ItemList2;
    }
    $scope.hasVoId = false;
    if ($stateParams.voId) {
        $scope.hasVoId = true;
        $scope.getInvoiceData($stateParams.voId);
        $scope.billNoValid = true;
        $scope.comInvoiceNoValid = true;
        $scope.exciseInvoiceNoValid = true;
    }
    $scope.applyFilter = function () {
        var qry = {
            "where": {
                "visible":true,
                "GODOWN": $scope.godown.selected ? $scope.godown.selected._id.GODOWN : $scope.godown.selected,
                "DESCRIPTION": $scope.description.selected ? $scope.description.selected._id.DESCRIPTION : $scope.description.selected,
                "RRMARKS": $scope.remarks.selected ? $scope.remarks.selected._id.RRMARKS : $scope.remarks.selected,
                "rgNo": $scope.rgno.selected ? $scope.rgno.selected._id.rgNo : $scope.rgno.selected,
                "exciseDuty": $scope.exciseDuty.selected ? $scope.exciseDuty.selected._id.exciseDuty : $scope.exciseDuty.selected,
                "SAD": $scope.SAD.selected ? $scope.SAD.selected._id.SAD : $scope.SAD.selected,
                "NETWEIGHT": $scope.NETWEIGHT.selected ? $scope.NETWEIGHT.selected._id.NETWEIGHT : $scope.NETWEIGHT.selected,
            }
        }
        $http.get(config.api + "Inventories?filter="+encodeURIComponent(JSON.stringify( qry))).then(function (response) {
            $scope.filterList = response.data;
            //$scope.ItemList2 = response.data;
            //$scope.filterList = $scope.ItemList2;
        });
    }
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

    $http.get(config.api + "Inventories?filter[where][visible]=true&filter[limit]=20").then(function (response) {
        $scope.ItemList2 = response.data;
        $scope.filterList = $scope.ItemList2;
    });

    var qryAgg = 'visible=true&group={"DESCRIPTION":"$DESCRIPTION","GODOWN": "$GODOWN","RRMARKS":"$RRMARKS","rgNo":"$rgNo","exciseDuty":"$exciseDuty","SAD":"$SAD","NETWEIGHT":"$NETWEIGHT"}';
    $http.get(config.login + "getAggregateInventories?" + qryAgg).then(function (response) {
        $scope.ItemList = response.data; // items to bind in filter ui select.
    });
    
    $scope.$watch('rdi', function () {
        updateItemTable();
    });
    $scope.copyItemQty = function (val) {
        return parseFloat(val);
    }
    $scope.rateChange = function (item,rate) {
        item.itemAmount = rate * Number(item.itemQty);
        if (!$scope.isCart)
            $scope.applyRate(rate, item);
        else
            calculateCartTotal($scope.itemCart);
            //sumItemTable($scope.itemChecked);
    };

    $scope.qtyChange = function (item, qty, oldQty) {
        if (isNaN(qty)) {
            item.itemQty = oldQty;
        }
        if (parseFloat(item.BALANCE) - parseFloat(qty) >= 0) { //Replaced NETWEIGHT with balance.
            item.itemAmount = qty * Number(item.itemRate);
            if (!$scope.isCart)
                $scope.applyRate(item.itemRate, item);
            //sumItemTable($scope.itemChecked);
            else  //calculate total in cart.
                calculateCartTotal($scope.itemCart);
            
        } else {
            //showErrorToast("Qty can not applied changing to old qty " + oldQty);
            if (qty.length > 0)
                item.itemQty = oldQty;
            else
                item.itemAmount = 0;
        }
    };
    
    

    $scope.paymentTerm = function () {
        var days=0;
        if ($scope.paymentDays)
            days = $scope.paymentDays;
        var billDate = getDate($scope.billDate);
        if (billDate)
            setDate($scope.billDueDate, moment(billDate).add(days, 'days'));
    }

    $scope.supliers = [];
    $scope.supliers2 = [];

    $scope.getSupplier = function () {
        $http.get(config.login + "getPartytAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.supliers = response.data
            angular.copy($scope.supliers, $scope.supliers2);
            //console.log($scope.partyAccounts);
        });
    }
    
    function getSupplierDetail(id,isConsignee) {
        //$scope.supliersDetail = []
        $http.get(config.api + "accounts" + "?filter[where][id]=" + id).then(function (response) {
            if (isConsignee) {
                $scope.supliersDetail2 = response.data;
                console.log(response.data);
                $scope.shippingAddress2 = response.data[0].shippingAddress[0].street;
                $scope.email2 = response.data[0].email;
            }else{
                $scope.supliersDetail = response.data;
                console.log(response.data);
                $scope.shippingAddress = response.data[0].shippingAddress[0].street;
                $scope.email = response.data[0].email;
            }
        });
    }
    $scope.accounts = [];
    function getSalesAccounts() {
        $http.get(config.login + "getSaleAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.salesAccounts = response.data;
            angular.copy($scope.salesAccounts, $scope.accounts);

        });
    }
    function getTaxAccounts() {
        $http.get(config.api + "accounts").then(function (response) {
            $scope.taxAccounts = response.data
            console.log($scope.account);
        });
    }
    $scope.getSupplier();
    getSalesAccounts();
    getTaxAccounts();
    
    
       
    $scope.salesAmount=0;
    function gTotal() {
        if ($scope.totalAmount)
            $scope.salesAmount =parseFloat($scope.listTotalAmount);
        if ($scope.totalAccountAmount)
            $scope.salesAmount += parseFloat($scope.totalAccountAmount);

        $scope.gTotal = Math.round($scope.salesAmount);
        $scope.roundOff = ($scope.gTotal - Number($scope.salesAmount)).toFixed(2);
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
        $scope.totalItem = data==undefined ? 0: data.length;
        //$scope.totalweight = totalweight.toFixed(2);
        //gTotal();
    }
    $scope.clearRate = function () {
        $scope.itemRate = null;
        $scope.applyRate('');
    }
    $scope.applyRate = function (rate, item) {
        var copy = false;
        if(!$scope.isCart){
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
                        updateItem($scope.itemChecked[i]);

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
    function updateItem(itemData,remove) {
        angular.forEach($scope.filterList, function (item) {
            if (item.id === itemData.id) {
                if (remove) {
                    item.select = false;
                    item.itemRate = null;
                    item.itemAmount = null;
                }
                else angular.copy(itemData, item);
            }
        });
        
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
            }else{
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
            }else{
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
        var item = {};
        angular.copy(itemData, item);
        if (!$scope.isCart) {
            if (itemData.select) {

                $scope.itemChecked.push(item);
                sumItemTable($scope.itemChecked);
                console.log($scope.itemChecked);
            }else{
                $scope.selectAllItem = false;
                for (var i = 0; i < $scope.itemChecked.length; i++) {
                    if ($scope.itemChecked[i].id == item.id) {
                        updateItem($scope.itemChecked[i], true);
                        $scope.itemChecked.splice(i, 1);
                    }
                }
                sumItemTable($scope.itemChecked);
            }
        } else {
            if (itemData.select) {
                $scope.itemCartChecked.push(item);
                console.log($scope.itemCartChecked);
            }else{
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
    function setCheckValue(val,list) {
        $scope.selectAllItem = val;
        angular.forEach(list, function (item) {
            item.select = val;
        });
    }
    //update local inventory on add or remove from cart.....
    function checkAddedItemsInInventory(itemCart) {
        var ret = false;
        var aggregateCart = Enumerable.From(itemCart).GroupBy("$.id", null, function (key, g) {
            return {
                id: key,
                balance: g.Max("$.BALANCE"), //NETWEIGHT replaced with balance
                sum: g.Sum("$.itemQty| 0")
            }
        })
       .ToArray();
        console.log(aggregateCart);
        //alert(JSON.stringify(result));
        var result2 = Enumerable.From(aggregateCart).Where("x=>x['sum']>x['balance']").ToArray();
        if (result2.length == 0)
            ret = true;
        return ret;
    }




    $scope.addToItemCart = function () {
        if (parseFloat($scope.totalAmount)>0) {
            var itemChecked = $scope.itemChecked;
            var itemCart=[];
            angular.copy($scope.itemCart,itemCart);
            var found = false;
            for (var i = 0; i < itemChecked.length; i++) {
                //for (var j = 0; j < itemCart.length; j++) {
                //    if (itemCart[j].id === itemChecked[i].id) {
                //        //check item qty can be added 
                //        var availQty = parseFloat(itemCart[j].NETWEIGHT) - parseFloat(itemCart[j].itemQty);
                //        if (availQty - parseFloat(itemChecked[i].itemQty) < 0)
                //            showErrorToast("Only " + availQty + " can be added for Item " + itemChecked[i].DESCRIPTION);
                //        itemCart[j].itemQty = parseFloat(itemCart[j].itemQty) + Math.min(availQty, parseFloat(itemChecked[i].itemQty));
                //        found = true;
                //        break;
                //    }



                //}
                //if (!found)
                //update itemlist2 with new qty..... 
                //
                itemCart.push(itemChecked[i]);
            }
            if (checkAddedItemsInInventory(itemCart)) {

                $scope.itemCart = itemCart;

                calculateCartTotal($scope.itemCart);
                $scope.itemChecked = [];
                setCheckValue(false, $scope.filterList);
                sumItemTable($scope.itemChecked);
                showSuccessToast("Added to cart");
            } else {
                showStickyErrorToast("Items can not be added to cart as not enought quantity left for some items");
            }

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
    $scope.itemTableTemp=[];
    $scope.addItemToInvoice = function () {
        if (checkAddedItemsInInventory($scope.itemCart)) {
            angular.copy($scope.itemCart, $scope.itemTable);
            angular.copy($scope.itemTable, $scope.itemTableTemp);
            sumItemListTable($scope.itemTable);
            $('#AddInventoryModal').modal('hide');
            console.log($scope.itemTable);
            setCheckValue(false, $scope.filterList);
            gTotal();
            updateItemTable();
        } else {
            showErrorToast("Error! Aggregate SaleQty is greater the net weight for some items");
        }
    }
    function updateItemTable() {
        angular.copy($scope.itemTableTemp, $scope.itemTable);
        if ($scope.invoiceType == 'Excise') {
            angular.forEach($scope.itemTable, function (item) {
                if ($scope.rdi ) {
                    item.itemAmount = item.itemQty * (item.itemRate + Number(item.exciseDuty?item.exciseDuty:0/item.NETWEIGHT) + Number(item.SAD?item.SAD:0/item.NETWEIGHT));
                }
            });
        } else if ($scope.invoiceType == 'Non Excise') {
            angular.forEach($scope.itemTable, function (item) {
                item.itemAmount = item.itemQty * item.itemRate;
                item.SAD = 0.0;
                item.exciseDuty = 0.0;
            });
        }
        sumItemListTable($scope.itemTable);
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
    
    $scope.isCart=false;
    function setIsCart(val){
        $scope.isCart=val;
    }

    $scope.openTransaction = function (type) {

        if (type == 'Tax Invoice') {

            $state.go('Customer.TaxInvoicePDF', { voId: $stateParams.voId, noBackTrack: true });
        }
        else if (type == 'Excise Invoice') {

            $state.go('Customer.ExciseInvoicePDF', { voId: $stateParams.voId, noBackTrack: true });
        }
        else if (type == 'Delivery Challan') {

            $state.go('Customer.SalesInvoicePDF', { voId: $stateParams.voId, noBackTrack: true });
        }
    };

    $scope.Accountbtn = function (id, type) { //open account in edit mode.
        if (type) {
            console.log(id);
            $('#formaccount').modal('show');
            if (id != undefined) {
                $http.get(config.api + "accounts/" + id).then(function (response) {
                    console.log(response);
                    $scope.myValue = response.data;
                    $scope.isAccount = false
                });
            }
            else {
                $scope.myValue = null;
            }
        }
    };
    

    //if (!JSZip.support.blob) {
    //    showError("This demo works only with a recent browser !");
    //    return;
    //}
    $scope.downloadAttachments=function(){
        var zip = new JSZip();
        angular.forEach($scope.attachements, function (item) {
            var path = item.cdnPath.substring(item.cdnPath.lastIndexOf('/') + 1);
            var url = config.login+ "getfile?path=" + path;
            var filename = item.file.name.replace(/.*\//g, "");
            zip.file(filename, urlToPromise(url), { binary: true });
        });
        zip.generateAsync({ type: "blob" }, function updateCallback(metadata) {
            var msg = "progression : " + metadata.percent.toFixed(2) + " %";
            if (metadata.currentFile) {
                msg += ", current file = " + metadata.currentFile;
            }
            console.log(msg);
        })
        .then(function callback(blob) {
            // see FileSaver.js
            saveAs(blob, $stateParams.voId+".zip");
        }, function (e) {
        });

        return false;
    };
    function clearInvoice() {
        $scope.billNo = null;
        $scope.comInvoiceNo = null;
        $scope.exciseInvoiceNo = null;
        $scope.salesAccount = null;
        $scope.rdi = false;
        $scope.supplier = null;
        $scope.supplier2 = null;
        $scope.shippingAddress = null;
        $scope.shippingAddress2 = null;
        $scope.email = null;
        $scope.email2 = null;
        $scope.contactNo = null;
        $scope.contactNo2 = null;
        $scope.account = null;
        $scope.invoiceType = "Tax";
        $scope.customerType = "Buyer";
        $scope.billNoValid = false;
        $scope.comInvoiceNoValid = true;
        $scope.exciseInvoiceNoValid = true;
        $scope.uploader.clearQueue();
        //$scope.billDate = null;
        setDate($scope.billDate, new Date());
        $scope.paymentDays = null;
        setDate($scope.billDueDate, '')
        // = null;
        setDate($scope.billIssueDate, '', $scope.billIssueTime)
        setDate($scope.billRemovalDate, '', $scope.billRemovalTime)
        //$scope.billIssueDate = null;
        //$scope.billRemovalDate = null;
        $scope.intRate = null;
        $scope.modeTransport = null;
        $scope.vehicleNo = null;
        $scope.narration = null;
        $scope.orderNo = null;
        setDate($scope.orderDate, '');
        $scope.termsDelivery = null;

        $scope.accountTable = [];
        $scope.itemTable = [];
        sumItemListTable($scope.itemTable);
        accountTableSum();

    }
    $scope.deleteInvoice = function () {
        $rootScope.$broadcast("event:progress", { message: "Please wait while processing.." });
        var data = {
            compCode: localStorage.CompanyId,
            type: type,
            role: localStorage['usertype']
        }
        $http.post(config.login + 'deleteSalesInvoice?id=' + $stateParams.voId, data)
                            .then(function (response) {
                                if (response.data.err) {
                                    //showErrorToast("Invoice could not be deleted as " + response.data.err);
                                    $rootScope.$broadcast('event:error', { message: "Invoice could not be deleted as " + response.data.err });
                                    return;
                                }
                                $rootScope.$broadcast('event:success', { message: "Invoice Deleted" });
                                //showSuccessToast("Invoice deleted.");
                                $scope.goBack();// $state.reload();
                            }, function (err) {

                            });
    }

    function getAggregateLineItems() {
        return Enumerable.From($scope.itemTable).GroupBy("$.id", null, function (key, g) {
            return {
                id: key,
                balance: g.Max("$.BALANCE"),
                sum: g.Sum("$.itemQty| 0")
            }
        })
       .ToArray();
    }


    $scope.saveInvoice = function () {
        var billDate = getDate($scope.billDate);
        var billIssueDateTime = getDate($scope.billIssueDate, $scope.billIssueTime);
        var billRemovalDateTime = getDate($scope.billRemovalDate, $scope.billRemovalTime);
        var billDueDate = getDate($scope.billDueDate);
        var orderDate = getDate($scope.orderDate);
        if ($scope.supplier2.selected == undefined || $scope.supplier2.selected == null) {
            showErrorToast("Please select consignee");
            return;
        }
        if ($scope.salesAccount.selected == undefined || $scope.salesAccount.selected == null) {
            showErrorToast("Please select account");
            return;
        }

        if (!billDate) {
            showErrorToast("Invoice date is not valid");
            return;
        }
        if (!billDueDate) {
            showErrorToast("Invoice due date is not valid");
            return;
        }

        if (!$scope.billNoValid) {
            showErrorToast("Bill no is not valid");
            return;
        }

        var pendingUploads = uploader.getNotUploadedItems();
        if (pendingUploads.length > 0) {
            showErrorToast("Please review attachments some of them are not uploaed to server.");
            return;
        }

        $rootScope.$broadcast("event:progress", { message: "Please wait while processing.." });
        var queue = uploader.queue;
        var attachements = [];
        angular.forEach(queue, function (fileItem) {
            attachements.push({ title: fileItem.title, cdnPath: fileItem.cdnPath, file: fileItem.file })
        });
        //validate attachments..
        //if not uploaded upload all and if not succeded then alert save without attachments.
        //

        //if ($scope.totalAccountAmount) {
        //    $scope.salesAmount = parseFloat($scope.totalAmountINR.toFixed(2)) + parseFloat($scope.totalAccountAmount);
        //}
        //else {
        //    $scope.salesAmount = parseFloat($scope.totalAmountINR.toFixed(2));
        //}

        var data = {
            compCode: localStorage.CompanyId,
            type: type,
            role: localStorage.usertype,
            date: billDate,
            duedate: billDueDate,
            amount: $scope.gTotal,
            roundOff: $scope.roundOff,
            vochNo: $scope.billNo,
            comInvoiceNo: $scope.comInvoiceNo,
            exciseInvoiceNo: $scope.exciseInvoiceNo,
            state: "OPEN",
            customerId: $scope.supplier2.selected.id,
            balance: $scope.gTotal,
            roi: $scope.intRate == undefined ? 0 : $scope.intRate,
            paymentDays: $scope.paymentDays == undefined ? 0 : $scope.paymentDays,
            //email: $scope.suppliers2.selected.email,
            remark: $scope.narration,
            aggLineItems:getAggregateLineItems(),
            invoiceData: {
                orderNo: $scope.orderNo,
                orderDate: orderDate,
                termsDelivery: $scope.termsDelivery,
                invoiceSubType: $scope.invoiceType,
                customerType: $scope.customerType,
                issueDate: billIssueDateTime,
                removalDate: billRemovalDateTime,
                customerAccountId: $scope.supplier.selected ? $scope.supplier.selected.id : $scope.supplier2.selected.id,
                consigneeAccountId: $scope.supplier2.selected.id,// ? $scope.supplier2.selected.company : $scope.supplier.selected.company,
                rdi: $scope.rdi,
                ledgerAccountId: $scope.salesAccount.selected.id,
                saleAmount: $scope.salesAmount,
                remarks: $scope.narration,
                paymentDays: $scope.paymentDays == undefined ? 0 : $scope.paymentDays,
                modeTransport: $scope.modeTransport,
                vehicleNo: $scope.vehicleNo,
                roi: $scope.intRate == undefined ? 0 : $scope.intRate,
                accountlineItem: $scope.accountTable,
                billData: $scope.itemTable,
                attachements: attachements
            },
        }


        $http.post(config.login + "salesInvoiceVoucher" + "?id=" + $stateParams.voId, data).then(function (response) {
            if (response.data.err) {
                $rootScope.$broadcast('event:error', { message: "Error while creating invoice: "+response.data.err });
            } else {
                $rootScope.$broadcast('event:success', { message: "Invoice Created" });
                if (!$scope.hasVoId) {
                    $state.go("Customer.SalesInvoice", { voId: response.data.id }, {location:true});
                } else {
                    $state.reload();
                }
            }
            //$state.go("Customer.SalesInvoice/" + response.data.id);

            //if (!$scope.hasVoId) clearInvoice();
            //else $scope.goBack();
        }, function (err) {
            $rootScope.$broadcast('event:error', { message: "Error while creating invoice" });
        });

    };
    $scope.$on("event:accountReferesh", function (event, args) {
        // Refresh accounts...
        $scope.getSupplier();
        getSalesAccounts();
        getTaxAccounts()
    });
    $("#billNo").focusout(function () {
        var billNo = $scope.billNo;
        if (billNo != undefined && !$scope.hasVoId) {
            $http.get(config.login + "isVoucherExist/" + billNo).then(function (response) {
                if(response.data.id) {
                    //$scope.existingEnvoiceId = response.data.id
                    SweetAlert.swal({
                        title: "Do you want to reload?",
                        text: "This Invoice No is allready exist.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: true
                    },
                       function () {
                           //reload
                           $state.go("Customer.SalesInvoice",{voId:response.data.id});
                           //ui-sref="Customer.Bill({voId:response.data.id})"
                       });      
                }
                else {
                    $scope.billNoValid = true;
                }     
            });
            //$http.get(config.api + "voucherTransactions" + "/count?[where][type]=" + type + "&[where][vochNo]=" + $scope.billNo).then(function (response) {
            //    $timeout(function () {
            //        var data = response.data;
            //        if (response.data.count > 0) {
            //            SweetAlert.swal({
            //                title: "Do you want to reload?",
            //                text: "This Invoice No is allready exist.",
            //                type: "warning",
            //                showCancelButton: true,
            //                confirmButtonColor: "#DD6B55",
            //                confirmButtonText: "Yes",
            //                closeOnConfirm: false
            //            },
            //            function () {
            //                //reload
            //                $state.go("")
            //                ui-sref="Customer.Bill({billNo:existingEnvoiceId})"
            //            });

            //            //showErrorToast("Delivery Challan No already exists");
            //        } else {
            //            $scope.billNoValid = true;
            //        }

            //    });
            //});
        }
    })
    $("#exciseInvoiceNo").focusout(function () {
        var billNo = $scope.billNo;
        if (billNo != undefined && !$scope.hasVoId) {
            $http.get(config.api + "voucherTransactions" + "/count?[where][type]=" + type + "&[where][exciseInvoiceNo]=" + $scope.exciseInvoiceNo).then(function (response) {
                $timeout(function () {
                    var data = response.data;
                    if (response.data.count > 0) {
                        showErrorToast("Excise Invoice No already exists");
                    } else {
                        $scope.exciseInvoiceNoValid = true;
                    }

                });
            });
        }
    })
    $("#comInvoiceNo").focusout(function () {
        var billNo = $scope.billNo;
        if (billNo != undefined && !$scope.hasVoId) {
            $http.get(config.api + "voucherTransactions" + "/count?[where][type]=" + type + "&[where][comInvoiceNo]=" + $scope.comInvoiceNo).then(function (response) {
                $timeout(function () {
                    var data = response.data;
                    if (response.data.count > 0) {
                        showErrorToast("Commercial Invoice no already exists");
                    } else {
                        $scope.comInvoiceNoValid = true;
                    }

                });
            });
        }
    })
    $scope.bindSalesAccountDetail = function (data) {
        $scope.salesAccountType = data.balanceType == 'debit' ? " (Dr.) " : " (Cr.)";
        var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(url, [localStorage.CompanyId]).then(function (response) {
            if (response.data.openingBalance) {
                $scope.salesAccountBalance = Math.abs(calculateOpenningBalnce(response.data.openingBalance, data.balanceType))
            } else {
                $scope.salesAccountBalance = 0.00;
            }
        });
        //$scope.email = data.email
        //$scope.shippingAddress = data.billingAddress[0].street
    }
    //$scope.openReceipt = function (id) {
    //    if (id)
    //        $state.go('Customer.Receipt', { voId: id }, { location: false });
    //    else
    //        $state.go('Customer.Receipt', null, { location: false });
    //}
    
}]);