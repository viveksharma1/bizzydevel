myApp.controller('GeneralInvoiceCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $scope.goBack = function () {
        window.history.back();
    }

    $("#myPopover").popover({
        //  title: '<h3 class="custom-title"><span class="glyphicon glyphicon-info-sign"></span> Popover Info</h3>',
        content: "<table style='width:100%'><tr><th>Date</th><th>Amount Applied</th><th>Payment No.</th></tr><tr><td><a href=''>17/03/2017</a></td><td>Rs500.00</td><td>58</td></tr><tr><td><a href=''>17/03/2017</a></td><td>Rs500.00</td><td>58</td></tr></table>",
        html: true
    })

    $('#DueDate').datepicker();

    $('#InvoiceDate').datepicker();

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


}]);