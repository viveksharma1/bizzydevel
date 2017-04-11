myApp.controller('SalesInvoiceCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', '$stateParams', '$filter', 'FileUploader', function ($scope, $http, $timeout, $rootScope, $state, config, $stateParams, $filter, FileUploader) {

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
    //$scope.setAddNewValue = function (select,fun) {
    //    select.adnew = 1;l
    //    select.addNewfn = fun;
    //}
    $scope.add = function (type, value) {
        $('#formaccount').modal('show');
        $scope.myValue = { accountName: value };
        $scope.getSupplier();


    }
    //$scope.buyerAdd = function () {
    //    showSuccessToast("Buyer Add");
    //}
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

    //uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
    //    console.info('onWhenAddingFileFailed', item, filter, options);
    //};
    uploader.onAfterAddingFile = function (fileItem) {
        if ($scope.oldAttachment) {
            fileItem.title = $scope.oldAttachment.title;
            fileItem.cdnPath = $scope.oldAttachment.cdnPath;
            fileItem_onSuccess();
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
    //uploader.onAfterAddingAll = function (addedFileItems) {
    //    console.info('onAfterAddingAll', addedFileItems);
    //};
    //uploader.onBeforeUploadItem = function (item) {
    //    console.info('onBeforeUploadItem', item);
    //};
    //uploader.onProgressItem = function (fileItem, progress) {
    //    console.info('onProgressItem', fileItem, progress);
    //};
    //uploader.onProgressAll = function (progress) {
    //    console.info('onProgressAll', progress);
    //};
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        fileItem.cdnPath = response.container + "/" + response.name;
    };
    //uploader.onErrorItem = function (fileItem, response, status, headers) {
    //    console.info('onErrorItem', fileItem, response, status, headers);
    //};
    //uploader.onCancelItem = function (fileItem, response, status, headers) {
    //    console.info('onCancelItem', fileItem, response, status, headers);
    //};
    //uploader.onCompleteItem = function (fileItem, response, status, headers) {
    //    console.info('onCompleteItem', fileItem, response, status, headers);
    //};
    //uploader.onCompleteAll = function () {
    //    console.info('onCompleteAll');
    //};

    //console.info('uploader', uploader);
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
    $scope.rdi = false;
    //Initialization
    $scope.supplier = {};
    $scope.supplier2 = {};
    $scope.account = {}
    //$scope.totalAmountINR = 0;
    $scope.invoiceType = "Tax";
    $scope.customerType = "Buyer";

    $scope.remarks = {};
    $scope.godown = {};
    $scope.description = {};
    $scope.rgno = {};
    $scope.exciseDuty = {};
    $scope.SAD = {};
    $scope.NETWEIGHT = {};
    $scope.billNoValid = false;
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
    $scope.applyFilter = function () {
        var qry = "Inventories?filter[where][visible]=true";
        if ($scope.godown.selected)
            qry = qry + "&filter[where][GODOWN]=" + $scope.godown.selected._id.GODOWN;
        if ($scope.description.selected)
            qry = qry + "&filter[where][DESCRIPTION]=" + $scope.description.selected._id.DESCRIPTION;
        if ($scope.remarks.selected)
            qry = qry + "&filter[where][RRMARKS]=" + $scope.remarks.selected._id.RRMARKS;
        if ($scope.rgno.selected)
            qry = qry + "&filter[where][rgNo]=" + $scope.rgno.selected._id.rgNo;
        if ($scope.exciseDuty.selected)
            qry = qry + "&filter[where][exciseDuty]=" + $scope.exciseDuty.selected._id.exciseDuty;
        if ($scope.SAD.selected)
            qry = qry + "&filter[where][SAD]=" + $scope.SAD.selected._id.SAD;
        if ($scope.NETWEIGHT.selected)
            qry = qry + "&filter[where][NETWEIGHT]=" + $scope.NETWEIGHT.selected._id.NETWEIGHT;

        $http.get(config.api + qry).then(function (response) {
            $scope.filterList = response.data;
            //console.log($scope.ItemList);
            //$scope.ItemCount = response.data.length;
        });
    }
    getSupplier();
    $http.get(config.api + "Inventories?filter[where][visible]=true&filter[limit]=20").then(function (response) {
        $scope.ItemList2 = response.data;
        $scope.filterList = $scope.ItemList2;
    });

    var qryAgg = 'visible=true&group={"DESCRIPTION":"$DESCRIPTION","GODOWN": "$GODOWN","RRMARKS":"$RRMARKS","rgNo":"$rgNo","exciseDuty":"$exciseDuty","SAD":"$SAD","NETWEIGHT":"$NETWEIGHT"}';
    $http.get(config.login + "getAggregateInventories?" + qryAgg).then(function (response) {
        $scope.ItemList = response.data;
        //$scope.filterList2 = $scope.ItemList2;
        //console.log($scope.ItemList);
        //$scope.ItemCount = response.data.length;
    });
    $scope.oldAttachment = null;
    function bindAttachments(attachments,callback) {
        
        if (attachments) {
            angular.forEach(attachments, function (item) {
                $scope.oldAttachment =item;
                //var file = item;
                //file.file = { name: item.name, type: item.fileType, size: item.fileSize };
                //var files = uploader.isHTML5 ? this.element[0].files : this.element[0];
                //var options = uploader.getOptions();
                //var filters = uploader.getFilters();
                //file.file.isOld = true;
                //if (!this.uploader.isHTML5) this.destroy();
                uploader.addToQueue(item.file);
                //uploader.addToQueue(item);
            });
        }
        if (callback)
            callback();
    }
    $scope.getInvoiceData = function (id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                  .then(function (response) {

                      $scope.invoiceType = response.data.invoiceData.invoiceSubType;
                      //$scope.customerType=customerType:,
                      $scope.salesAccount = { selected: { accountName: response.data.invoiceData.ledgerAccount } };
                      $scope.supplier = { selected: { company: response.data.invoiceData.customerAccount } };
                      $scope.supplier2 = { selected: { company: response.data.invoiceData.consigneeAccount } };
                      //$scope.email = { selected: { company: response.data.email } };
                      $scope.totalAmount = response.data.amount;
                      //$scope.billDate = response.data.date;
                      $scope.billNo = response.data.vochNo;
                      $scope.narration = response.data.remark;
                      $scope.totalAmount = response.data.amount;
                      $scope.intRate = response.data.invoiceData.roi;
                      $scope.modeTransport = response.data.invoiceData.modeTransport;
                      $scope.rdi = response.data.invoiceData.rdi;
                      $scope.itemTable = response.data.invoiceData.billData;
                      angular.copy($scope.itemTable, $scope.itemTableTemp);
                      $scope.accountTable = response.data.invoiceData.accountlineItem;
                      $scope.billIssueDate = $filter('date')(response.data.invoiceData.issueDate, 'dd/MM/yyyy');
                      $scope.billDate = $filter('date')(response.data.date, 'dd/MM/yyyy');
                      $scope.billDueDate = $filter('date')(response.data.duedate, 'dd/MM/yyyy');
                      $scope.billRemovalDate = $filter('date')(response.data.invoiceData.removalDate, 'dd/MM/yyyy');
                      $scope.paymentDays = response.data.invoiceData.paymentDays;
                      getSupplierDetail($scope.supplier.selected.company);
                      getSupplierDetail($scope.supplier2.selected.company, true);
                      
                      sumItemListTable($scope.itemTable);
                      accountTableSum();
                      bindAttachments(response.data.invoiceData.attachements, function () {
                          $scope.oldAttachment = null;
                      });


                  });

    }
    $scope.hasVoId = false;
    if ($stateParams.voId) {
        $scope.hasVoId = true;
        $scope.getInvoiceData($stateParams.voId);
        $scope.billNoValid = true;
    }
    $scope.$watch('supplier.selected', function () {
        if ($scope.supplier.selected) {
            if ($scope.supplier.selected.billingAddress && $scope.supplier.selected.billingAddress.length > 0) {
                $scope.shippingAddress = $scope.supplier.selected.billingAddress[0].street
            }
            if ($scope.supplier.selected.email) {
                $scope.email = $scope.supplier.selected.email

            }

        }
    });
    $scope.$watch('supplier2.selected', function () {
        if ($scope.supplier2.selected) {
            if ($scope.supplier2.selected.billingAddress && $scope.supplier2.selected.billingAddress.length > 0) {
                $scope.shippingAddress2 = $scope.supplier2.selected.billingAddress[0].street
            }
            if ($scope.supplier2.selected.email) {
                $scope.email2 = $scope.supplier2.selected.email

            }

        }
    });

    $scope.$watch('account.selected', function () {
        $scope.accountAmount = null;
        if ($scope.account.selected && $scope.account.selected.rate) {
            $scope.accountAmount = Number($scope.listTotalAmount) * Number($scope.account.selected.rate) / 100;
        }
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
    $scope.clear = function ($event, $select) {
        $event.stopPropagation();
        //to allow empty field, in order to force a selection remove the following line
        $select.selected = undefined;
        //reset search query
        $select.search = undefined;
        //focus and open dropdown
        //$select.activate();
    }
    //$scope.$watch('accounts.selected', function () {
    //    $scope.accountAmount = null;
    //    if ($scope.accounts.selected.rate) {
    //        $scope.accountAmount = Number($scope.totalAmountINR) * Number($scope.accounts.selected.rate) / 100;
    //    }
    //});

    //$scope.$watch('account.selected', function () {
    //    $scope.accountAmount = null;
    //    if ($scope.account.selected && $scope.account.selected.rate ) {
    //        $scope.accountAmount = Number($scope.totalAmountINR) * Number($scope.account.selected.rate) / 100;
    //    }
    //});
    
    $("#billNo").focusout(function () {

        var billNo = $scope.billNo;

        if (billNo != undefined && !$scope.hasVoId) {
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

    $scope.supliers = [];
    $scope.supliers2 = [];

    function getSupplier() {
        
        $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
            $scope.supliers = response.data;
            angular.copy($scope.supliers, $scope.supliers2);
        });
    }
    function getSupplierDetail(supplierName,isConsignee) {
        //$scope.supliersDetail = []
        $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId + "&filter[where][company]=" + supplierName).then(function (response) {
            if (isConsignee) {
                $scope.supliersDetail2 = response.data;
                console.log(response.data)
                $scope.shippingAddress2 = $scope.supliersDetail2[0].billingAddress[0].street;
                $scope.email2 = $scope.supliersDetail2[0].email;
            }else{
                $scope.supliersDetail = response.data;
                console.log(response.data)
                $scope.shippingAddress = $scope.supliersDetail[0].billingAddress[0].street;
                $scope.email = $scope.supliersDetail[0].email;
            }
        });
    }
    $scope.accounts = [];
    $http.get(config.api + "accounts").then(function (response) {
        $scope.salesAccounts = response.data;
        angular.copy($scope.salesAccounts, $scope.accounts);

    });
    //$http.get(config.api + "accounts").then(function (response) {
    //    $scope.accounts = response.data
    //    console.log($scope.accounts);
    //});

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
            account:$scope.account.selected,
            description: $scope.accountDescription,
            amount: $scope.accountAmount
        }

        if ($scope.edit1 == true) {
            $scope.accountTable[$scope.index] = accountData;
        } else {
            $scope.accountTable.push(accountData);
        }
        $scope.edit1 = false;
        clearAccountbox();
       accountTableSum();
    }
    function clearAccountbox() {
        $scope.account = {};
        $scope.accountDescription = null;
        $scope.accountAmount = null;
    }
    $scope.editAccountTable = function (data, index) {
        $scope.idSelected = index;
        $scope.index = index;
        $scope.edit1 = true;
        $scope.account = { selected: data.account};
        $scope.accountDescription = data.description;
        $scope.accountAmount = data.amount;

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
    $scope.applyRate = function (rate,item) {
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
                    if ($scope.itemChecked[i].id == item.id)
                        $scope.itemChecked.splice(i, 1)

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
    $scope.addToItemCart = function () {
        if (parseFloat($scope.totalAmount)>0) {
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
    $scope.itemTableTemp=[];
    $scope.addItemToInvoice = function () {
        angular.copy($scope.itemCart, $scope.itemTable);
        angular.copy($scope.itemTable, $scope.itemTableTemp);
        sumItemListTable($scope.itemTable);
        $('#AddInventoryModal').modal('hide');
        console.log($scope.itemTable);
        setCheckValue(false, $scope.filterList);
        gTotal();
    }
    function updateItemTable() {
        angular.copy($scope.itemTableTemp, $scope.itemTable);
        if ($scope.invoiceType == 'Excise') {
            angular.forEach($scope.itemTable, function (item) {
                if ($scope.rdi) {
                    item.itemAmount = item.itemQty * (item.itemRate + Number(item.exciseDuty/item.NETWEIGHT) + Number(item.SAD/item.NETWEIGHT));
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
    

   function clearInvoice() {
        $scope.billNo = null;
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
        $scope.uploader.clearQueue();
        $scope.billDate = null;
        $scope.paymentDays = null;
        $scope.billDueDate = null;
        $scope.billIssueDate = null;
        $scope.billRemovalDate = null;
        $scope.intRate=null;
        $scope.modeTransport = null;
        $scope.narration = null;
        $scope.accountTable = [];
        $scope.itemTable = [];
        sumItemListTable($scope.itemTable);
        accountTableSum();

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

        var pendingUploads=uploader.getNotUploadedItems();
        if (pendingUploads.length > 0) {
            showErrorToast("Please review attachments some of them are not uploaed to server.");
            return;
        }

        var queue = uploader.queue;
        var attachements = [];
        angular.forEach(queue, function (fileItem) {
            attachements.push({ title: fileItem.title, cdnPath:fileItem.cdnPath,file:fileItem.file})
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
            type: "Sales Invoice",
            role: localStorage['usertype'],
            date: dateFormat($scope.billDate),
            duedate: dateFormat($scope.billDueDate),
            amount: $scope.gTotal,
            roundOff:$scope.roundOff,
            vochNo: $scope.billNo,
            state: "PAID",
            customerName: $scope.supplier.selected.company,
            email: $scope.supplier.selected.email,
            remark: $scope.narration,
            invoiceData: {
                invoiceSubType: $scope.invoiceType,
                customerType:$scope.customerType,
                issueDate: dateFormat($scope.billIssueDate),
                removalDate: dateFormat($scope.billRemovalDate),
                customerAccount: $scope.supplier.selected.company,
                consigneeAccount: $scope.supplier2.selected ? $scope.supplier2.selected.company : $scope.supplier.selected.company,
                rdi:$scope.rdi,
                ledgerAccount: $scope.salesAccount.selected.accountName,
                saleAmount:$scope.salesAmount,
                remarks: $scope.narration,
                paymentDays: $scope.paymentDays,
                modeTransport: $scope.modeTransport,
                roi:$scope.intRate,
                accountlineItem: $scope.accountTable,
                billData: $scope.itemTable,
                attachements:attachements
            },
        }


        $http.post(config.login + "saveVoucher" + "?id=" + $stateParams.voId, data).then(function (response) {
            showSuccessToast("Bill Save Succesfully");
            if (!$scope.hasVoId) clearInvoice();
            else $scope.goBack();
        });

    };
    $scope.isCart=false;
    function setIsCart(val){
        $scope.isCart=val;
    }

    $scope.openTransaction = function (type) {

        if (type == 'Tax Invoice') {

            $state.go('Customer.TaxInvoicePDF', { voId: $stateParams.voId });
        }
        else if (type == 'Excise Invoice') {

            $state.go('Customer.ExciseInvoicePDF', { voId: $stateParams.voId });
        }
        else if (type == 'Delivery Challan') {

            $state.go('Customer.SalesInvoicePDF', { voId: $stateParams.voId });
        }
    };
    
    
}]);