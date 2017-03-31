myApp.controller('SupplierdetailCntrl', ['$scope', '$http', '$timeout', 'myService', '$rootScope', '$stateParams','$state', 'config','DTOptionsBuilder', 'DTDefaultOptions', function ($scope, $http, $timeout,myService, $rootScope, $stateParams, $state, config ,DTOptionsBuilder,DTDefaultOptions) {

    $scope.dataSource = {
        "chart": {
            "caption": "Column Chart Built in Angular!",
            "captionFontSize": "30",
            // more chart properties - explained later
        },
        "data": [{
            "label": "CornflowerBlue",
            "value": "42"
        }, //more chart data
        ]
    };

     $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data = [300, 500, 100];
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



    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.supplierDetailclose = function () {
        $('.FlexPopup').slideUp();
    }

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


    $scope.menutoggle = function () {
        $("#wrapper").toggleClass("toggled");
    };

  

    $scope.menuUp = function (e) {
        $(".statusBody").slideToggle("slow", function () {
            // Animation complete.
        })

        $('#menuUp i').toggleClass("fa-chevron-down fa-chevron-up")
        e.preventDefault();
    };



    $scope.NewCustomerCreate = function () {
        $('#NewCustomerCreateModal').modal('show');
       
    }


    //$scope.transaction = [];
    $scope.supCode = $stateParams.supCode;
    //get ledger data 
    
    $scope.currentDate = moment().format();
    $scope.currentDate1 = moment().format();
   
    $scope.ledgerView = function () {

      
        $http.get(config.api + "ledgers" + "?filter[where][supCode]=" + $scope.supCode).then(function (response) {
            $scope.ledgerData = response.data;
            $scope.credit = 0;
            $scope.debit = 0;
            for (var i = 0; i < $scope.ledgerData.length; i++) {
                $scope.credit += Number($scope.ledgerData[i].credit);
                $scope.debit += Number($scope.ledgerData[i].debit);
            }
        });
    }
    
    // get transaction for particular supplier
   

    
    $scope.suppliers = [];
    console.log($stateParams.contactId);
    $http.get(config.api + "groupMasters").then(function (response) {
        $scope.groupMaster = response.data
        console.log($scope.account);
    });

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
   
    $scope.supplierscount = [];
    $http.get(config.login + "getSupplier" + "?supCode=" + $scope.supCode).then(function (response) {
        $scope.suppliers = response.data;
       console.log(response);
        
   
   $scope.email= $scope.suppliers[0].email,
   $scope.company =$scope.suppliers[0].company,
   $scope.phone = $scope.suppliers[0].phone,
   $scope.mobile = $scope.suppliers[0].mobile,
  
   
         $scope.street =  $scope.suppliers[0].billingAddress[0].street ,
         $scope.city = $scope.suppliers[0].billingAddress[0].city,
         $scope.state = $scope.suppliers[0].billingAddress[0].state,
         $scope.postalCode =  $scope.suppliers[0].billingAddress[0].postalCode,
    
  
         $scope.street1 =   $scope.suppliers[0].shippingAddress[0].street,
         $scope.city1 = $scope.suppliers[0].shippingAddress[0].city,
         $scope.state1 = $scope.suppliers[0].shippingAddress[0].state,
         $scope.postalCode1 =   $scope.suppliers[0].shippingAddress[0].postalCode,
   
  
         $scope.taxRegNo =   $scope.suppliers[0].taxInfo[0].taxRegNo,
         $scope.cstReg =  $scope.suppliers[0].taxInfo[0].cstRegNo,
         $scope.panNo = $scope.suppliers[0].taxInfo[0].panNo,
          $scope.Range = $scope.suppliers[0].taxInfo[0].range
   $scope.division = $scope.suppliers[0].taxInfo[0].division
   $scope.address = $scope.suppliers[0].taxInfo[0].address
   $scope.commisionerate = $scope.suppliers[0].taxInfo[0].commisionerate
   $scope.ceRegionNo = $scope.suppliers[0].taxInfo[0].ceRegionNo
   $scope.eccCodeNo = $scope.suppliers[0].taxInfo[0].eccCodeNo
   $scope.iecNo = $scope.suppliers[0].taxInfo[0].iecNo
   $scope.groupMasters = { selected: { name: $scope.suppliers[0].account.group } };


   
       
      
         $scope.openingBalance = $scope.suppliers[0].openingBalance,
        $scope.notes = $scope.suppliers[0].notes
   




    });

   //update Supplier

    $scope.updateSupplier = function () {

        var data = {

         
            company: $scope.company,
            phone: $scope.phone,
            mobile: $scope.mobile,
            email:$scope.email,
          
         
            billingAddress: [
              {
                  street: $scope.street,
                  city: $scope.city,
                  state: $scope.state,
                  postalCode: $scope.postalCode,
                  country: $scope.country
              }
            ],
            shippingAddress: [
              {

                  street: $scope.street1,
                  city: $scope.city1,
                  state: $scope.state1,
                  postalCode: $scope.postalCode1,
                  country: $scope.country1
              }
            ],
            taxInfo: [
              {
                  taxRegNo: $scope.taxRegNo,
                  cstRegNo: $scope.cstRegNo,
                  panNo: $scope.panNo,
                  range: $scope.Range,
                  division: $scope.division,
                  address: $scope.address,
                  commisionerate: $scope.commisionerate,
                  ceRegionNo: $scope.ceRegionNo,
                  eccCodeNo: $scope.eccCodeNo,
                  iecNo: $scope.iecNo


              }
            ],
            paymentInfo: [
              {                 
                  openingBalance: $scope.openingBalance
              }
            ],
            notes: $scope.notes,
            account: {              
                group: $scope.groupMasters.selected.name
                             
        }

        }

        var url = config.api + "suppliers/" + $scope.supCode;
        $http.put(url, data).success(function (response) {
        })

    };


    //PDF VIEW

   
    $scope.ledgerview = function () {

        $scope.ledgerData = [];
      
        $http.get(config.api + "ledgers" + "?filter[where][supliersName]=" + $scope.company).then(function (response) {

            $scope.ledgerData = response.data;
            console.log($scope.ledgerData.length);
            console.log(response.data);
            $scope.credit = 0;
            $scope.debit = 0;
            for (var i = 0; i < $scope.ledgerData.length; i++) {

                $scope.credit += Number($scope.ledgerData[i].credit);
                $scope.debit += Number($scope.ledgerData[i].debit);
            }
            console.log($scope.credit);

        });
      
        
        $('#ledgerdiv').slideDown();
    }
    $scope.admin = localStorage['adminrole'];
    $scope.view = function (data, type) {
        $scope.orderType = type
        if ($scope.orderType == "ENQUIRY")
        {
            $('#GRNDetailDiv').slideDown();

            $scope.EnqNo = data;

            $http.get(config.api + "transactions" + "?filter[where][no]=" + $scope.EnqNo).then(function (response) {
                $scope.itemDetail = response.data[0].itemDetail;
                $scope.suppliersName = response.data[0].supliersName;
                $scope.date = response.data[0].date;
                $scope.no = response.data[0].no;
            });
        }
        if ($scope.orderType == "PO") {

            $('#poView').slideDown();
            $scope.poNo = data
            var data = {
                no: $scope.poNo
            };

            $http.post(config.api + "transactions" + "/getPo", data, { headers: { 'tokan': localStorage['token'] } }).then(function (response) {

                $scope.data = response.data.code
                $scope.suppliersName = $scope.data.supliersName;
                $scope.email = $scope.data.email;
                $scope.date = $scope.data.date;
                $scope.billDueDate = $scope.data.billDueDate;
                $scope.no = $scope.data.no;
                $scope.amount = $scope.data.amount;
                $scope.adminAmount = $scope.data.adminAmount;
                $scope.itemDetail = [];
                $scope.itemDetail = $scope.data.itemDetail;
                $scope.exchangeRate = $scope.data.exchangeRate;
                var total = 0;
                for (var i = 0; i < $scope.itemDetail.length; i++) {
                    var product = Number($scope.itemDetail[i]);
                    total += Number($scope.itemDetail[i].netweight);
                }
                $scope.totalweight = total;
            })

            $http.get(config.api + "suppliers" + "?filter[where][supCode]=" + $scope.supCode).then(function (response) {
                $scope.suppliersAdd = response.data;
                $scope.suppliersdata1 = $scope.suppliersAdd[0].billingAddress[0].street
                $scope.taxRegNo = $scope.suppliersAdd[0].taxInfo[0].taxRegNo
              
            });
        }
    }

    // pagination starts here
   
    $http.get(config.api + "transactions" + "?filter[where][supCode]=" + $scope.supCode + "&filter[limit]=10&filter[skip]=0").then(function (response) {


        $scope.InventoryList = response.data;
    });
    var url = config.api + "transactions/count" + "?[where][supCode] =" + $scope.supCode;

    $http.get(url).then(function (response) {

        $scope.TotalCount = response.data.count;
       
    });



    //-----------------------Pagination start for Employee List
    $scope.itemsPerPage = 10;
    $scope.currentPage = 0;
    $scope.startPageNo = 0;
    $scope.EndPageNo = 0;
    $scope.range = function () {
        var rangeSize = 4;


        var totaldetail = $scope.TotalCount;

        var DynamicPage = Math.round(totaldetail / $scope.itemsPerPage)

        if (DynamicPage == 0) {
            rangeSize = 1;
        } else if (DynamicPage > 7) {
            rangeSize = 10;
        }
        else {
            rangeSize = DynamicPage
        }


        //Math.floor()

        var ps = [];

        var start;

        start = $scope.currentPage;

        //$scope.startPageNo =  $scope.currentPage + 1;
        $scope.EndPageNo = $scope.itemsPerPage * ($scope.currentPage + 1);
        $scope.startPageNo = $scope.EndPageNo - ($scope.itemsPerPage - 1)

        if (start > $scope.pageCount() - rangeSize) {
            start = $scope.pageCount() - rangeSize + 1;
        }
        for (var i = start; i < start + rangeSize; i++) {
            ps.push(i);
        }
        return ps;
    };

    $scope.nextPage = function () {


        console.log($scope.currentPage)
        if ($scope.currentPage == 0) {

            $scope.currentPage++
            $scope.setPage($scope.currentPage);

        }
        else {
            $scope.currentPage++
            $scope.setPage($scope.currentPage);
        }
    };


    $scope.DisableNextPage = function () {

        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";

    };


    $scope.prevPage = function () {

        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.setPage($scope.currentPage--);
        }
    };

    $scope.DisablePrevPage = function () {

        return $scope.currentPage === 0 ? "disabled" : "";

    };


    $scope.pageCount = function () {
        return Math.ceil($scope.TotalCount / $scope.itemsPerPage) - 1;
    };



    $scope.DisableNextPage = function () {

        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";

    };


    $scope.setPage = function (n) {

        $scope.currentPage = n;

        $scope.EndPageNo = $scope.itemsPerPage * ($scope.currentPage);
        $scope.startPageNo = $scope.EndPageNo - ($scope.itemsPerPage - 1);

        var DispLength;

        Skip = $scope.EndPageNo;
        DispLength = $scope.itemsPerPage;
        var empUrl = config.api + "transactions" + "?filter[where][email]=" + $stateParams.contactId + "&filter[limit]=" + DispLength + "&filter[skip]=" + Skip;
        
        $http.get(empUrl).then(function (response) {
            $scope.InventoryList = response.data;

            if (response.data.length > 0) {
                var url = config.api + "transactions/count" + "?[where][supCode] =" + $stateParams.supCode;

                $http.get(url).then(function (response) {
                    $scope.TotalCount = response.data.count;
                });
            }
            else {
                $scope.TotalCount = 0;
                $('#nodataimageview').show();
            }

            $scope.range();
        });
       
    };
    $scope.generatePDF = function () {   
        var draw = kendo.drawing;
        draw.drawDOM($("#upperdivId"), {
            margin: "2cm",
            scale: 0.8,
            paperSize: "A4",
        })
        .then(function (root) {
            return draw.exportPDF(root);
        })
        .done(function (data) {
            kendo.saveAs({
                dataURI: data,
                fileName: "ledger.pdf"
            });

        });
      
    }
    $scope.ClassForStatus = function (Status) {
        $scope.newbalance = Status;
        if ($scope.newbalance == '0') {
            $scope.bal = "PAID";
            return ;
        }
        else {
            $scope.bal = $scope.newbalance;
            return;
        }
    }


    

}]);