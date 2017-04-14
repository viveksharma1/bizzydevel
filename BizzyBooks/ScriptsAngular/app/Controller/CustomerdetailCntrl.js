myApp.controller('CustomerdetailCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', '$stateParams', function ($scope, $http, $timeout, $rootScope, $state, config, $stateParams) {


    var CustomerId = localStorage.CustomerId;
    $scope.CompanyList = JSON.parse(localStorage.comobj);
    $scope.CustomerName = localStorage.customerName;
    $scope.DefaultCompany = localStorage.DefaultCompany;
    $(".my a").click(function (e) {
        e.preventDefault();
    });


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


    $scope.customer = [];
    $scope.EditViewPopUp = function () {
        var url = config.api + "customers/" + $stateParams.cusCode;
        $http.get(url).success(function (response) {
            $scope.customer = response;
            console.log($scope.customer);
            $scope.company = response.company;        
            $scope.email = response.email;
            $scope.street = response.billingAddress[0].street;
            $scope.city = response.billingAddress[0].city;
            $scope.state = response.billingAddress[0].state;
            $scope.country = response.billingAddress[0].country;
            $scope.postalcode = response.billingAddress[0].postalcode;
            $scope.street1 = response.shippingAddress[0].street;
            $scope.city1 = response.shippingAddress[0].city;
            $scope.state1 = response.shippingAddress[0].state;
            $scope.country1 = response.shippingAddress[0].country;
            $scope.postalcode1 = response.shippingAddress[0].postalcode;
            $scope.notes = response.notes;
          
            $scope.openingBalance = response.paymentInfo[0].openingBalance;
         
            $scope.taxRegNo = response.taxInfo[0].taxRegNo;
            $scope.cstRegNo = response.taxInfo[0].cstRegNo;
            $scope.panNo = response.taxInfo[0].panNo;
          
            $scope.mobile = response.mobile;
            $scope.phone = response.phone;
            $scope.range = response.taxInfo[0].range
            $scope.division = response.taxInfo[0].division
            $scope.address = response.taxInfo[0].address
            $scope.commisionerate = response.taxInfo[0].commisionerate
            $scope.ceRegionNo = response.taxInfo[0].ceRegionNo
            $scope.eccCodeNo = response.taxInfo[0].eccCodeNo
            $scope.iecNo = response.taxInfo[0].iecNo
            $scope.groupMasters = { selected: { name: response.account.group } };

      
           
          

        })
        $('#NewCustomerCreateModal').modal('show');

    }
    $scope.UpdateCustomerInfo = function () {
        var data = {

           
            email: $scope.email,
            company: $scope.company,
            phone: $scope.phone,
            mobile: $scope.mobile,
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
                  range: $scope.range,
                division: $scope.division,
            address: $scope.address,
            commisionerate: $scope.commisionerate,
            ceRegionNo: $scope.ceRegionNo, 
            eccCodeNo: $scope.eccCodeNo,
            iecNo: $scope.iecNo,


              }
            ],
            paymentInfo: [
              {
                  paymentMethod: $scope.paymentMethod,
                  terms: $scope.terms,
                  deliveryMethod: $scope.deliveryMethod,
                  openingBalance: $scope.openingBalance,
                  asOf: $scope.asOf



              }
            ],
            notes: $scope.notes,
            account: {
                group: $scope.groupMaster.selected.name,

            }
           

        }

        var url = config.api + "customers/" + $stateParams.cusCode;
        $http.put(url, data).success(function (response) {
            $scope.CustomerName = response.firstName;

        })
        $('#NewCustomerCreateModal').modal('hide');

    }




}]);