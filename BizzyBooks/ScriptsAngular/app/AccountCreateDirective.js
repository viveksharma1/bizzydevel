myApp.directive('createAccount',
    //['$http', 'config',
    function () {

        return {
            restrict: 'EA', //Default in 1.3+
            scope: { value: '=' },
            templateUrl: 'CreateAccount.html',
            transclude: true,
            replace: true,
            controller: ['$scope', '$http', '$rootScope', 'config','$timeout', function ($scope, $http, $rootScope, config, $timeout) {
                $(".my a").click(function (e) {
                    e.preventDefault();
                });
                $scope.groupMasters = {};
                $scope.accounts = {};
                $scope.city = { selected: { city: null } };
                $scope.state = { selected: { city: null } };
               
                $scope.checkboxModel = {
                    value1: false

                };
                $scope.close = function() {
                    $scope.accountId = null

                }
               

                $http.get(config.api + "groupMasters").then(function (response) {
                    $scope.groupMaster = response.data;

                });
                $scope.clear = function ($event, $select) {
                    $event.stopPropagation();
                    $select.selected = null;
                    $select.search = undefined;

                    $timeout(function () { $select.activate() }, 300);
                }
                $scope.getcity = function (id) {
                    var url = "https://www.whizapi.com/api/v2/util/ui/in/indian-city-by-state?stateid=" + id + "&project-app-key=4w9ik1xjvmcg1tn3koke4rk5";
                    $http.get(url).then(function (response) {
                        $scope.cityData = response.data.Data
                    });
                }
                $scope.getcity(3);
                var url = "https://www.whizapi.com/api/v2/util/ui/in/indian-states-list?project-app-key=4w9ik1xjvmcg1tn3koke4rk5"
                $http.get(url).then(function (response) {
                    $scope.stateData = response.data.Data
                    console.log($scope.stateData)
                });
                $scope.same = function () {
                    if ($scope.sameAs == true) {
                        $scope.street1 =  $scope.street
                        $scope.city1 =  $scope.city.selected.city
                        $scope.state1 =  $scope.state.selected.Name
                        $scope.postalCode1 = $scope.postalCode
                        $scope.country1 = $scope.country
                    }
                }
                function clearScope() {
                    $scope.taxRegNo = null
                    $scope.cs$scopetRegNo = null
                    $scope.exRegNo = null
                    $scope.pantaxRegNoNo = null
                    $scope.Range = null
                    $scope.division = null
                    $scope.address = null
                    $scope.commisionerate = null
                    $scope.ceRegionNo = null
                    $scope.eccCodeNo = null
                    $scope.iecNo = null
                    $scope.street1 = null
                    $scope.city1 = null
                    $scope.state1 = null
                    $scope.postalCode1 = null
                    $scope.country1 = null
                    $scope.street = null
                   
                    $scope.postalCode = null
                    $scope.country = null
                    $scope.accountName = null
                   
                    $scope.groupMasters = {}
                    $scope.balance = null
                    $scope.rate = null
                    $scope.openingBalance = null
                    $scope.balanceType = null
                    $scope.propName = null
                    $scope.email = null
                    $scope.phone = null
                    $scope.mobile = null
                  
                  
                    $scope.street1 = null
                    $scope.city1 = null
                    $scope.state1 = null
                   
                    $scope.accountId = null
                    
                }
                $scope.createAccountBtn = function () {
                    $scope.isDisabled = false;
                    $scope.isAccount = true;
                    $scope.isGroup = false;
                    return false;
                }
                $scope.isAccount = true;

                $scope.$watch('value', function () {
                    console.log($scope.value);
                    if ($scope.value) {
                        if ($scope.value.id == undefined) {
                            console.log($scope.value.id)
                            $scope.accountId = null;
                            clearScope();
                           
                        } else if ($scope.value.id) {
                            $scope.accountId = $scope.value.id
                            $http.get(config.login + "getAccountOpeningBalnce/" + localStorage.CompanyId + "?accountId=" + $scope.accountId + "&role=" + localStorage.usertype).then(function (response) {
                                $scope.openingBalance = Number(response.data.balance);

                            });
                            console.log($scope.value);

                            $scope.accountName = $scope.value.accountName;

                            $scope.groupMasters = { selected: { name: $scope.value.Under } };
                            $scope.groupMasters.selected.type = $scope.value.type;
                            $scope.balanceType = $scope.value.balanceType;
                            $scope.email = $scope.value.email;
                            

                            $scope.phone = $scope.value.phone;
                            $scope.mobile = $scope.value.mobile;
                            if ($scope.value.billingAddress && $scope.value.billingAddress.length > 0) {
                                $scope.street = $scope.value.billingAddress[0].street;
                                //$scope.city = $scope.value.billingAddress[0].city;
                                //$scope.state = $scope.value.billingAddress[0].state;
                                $scope.city = { selected: { city: $scope.value.billingAddress[0].city } };
                                $scope.state = { selected: { Name: $scope.value.billingAddress[0].state } };
                                $scope.postalCode = $scope.value.billingAddress[0].postalCode;
                                $scope.country = $scope.value.billingAddress[0].country;
                            }
                            if ($scope.value.shippingAddress && $scope.value.shippingAddress.length > 0) {

                                $scope.street1 = $scope.value.shippingAddress[0].street;
                                $scope.city1 = $scope.value.shippingAddress[0].city;
                                $scope.state1 = $scope.value.shippingAddress[0].state;
                                $scope.postalCode1 = $scope.value.shippingAddress[0].postalCode;
                                $scope.country1 = $scope.value.shippingAddress[0].country;
                            }
                            if ($scope.value.taxInfo) {
                                $scope.taxRegNo = $scope.value.taxInfo.taxRegNo;
                                $scope.cstReg = $scope.value.taxInfo.cstRegNo;
                                $scope.panNo = $scope.value.taxInfo.panNo;
                                $scope.Range = $scope.value.taxInfo.range;
                                $scope.division = $scope.value.taxInfo.division;
                                $scope.address = $scope.value.taxInfo.address;
                                $scope.commisionerate = $scope.value.taxInfo.commisionerate;
                                $scope.ceRegionNo = $scope.value.taxInfo.ceRegionNo;
                                $scope.eccCodeNo = $scope.value.taxInfo.eccCodeNo;
                                $scope.iecNo = $scope.value.taxInfo.iecNo;
                            }
                            if ($scope.value.rate) {
                                $scope.rate = $scope.value.rate;
                            }
                            $scope.credit = $scope.value.credit;
                            $scope.debit = $scope.value.debit;
                            
                        }
                    }
                    else {
                        $scope.accountId = null
                        clearScope();
                    }
                });
                $scope.$watch('groupMasters.selected', function () {
                    if ($scope.groupMasters.selected)
                        $scope.balanceType = $scope.groupMasters.selected.balanceType;
                });
                $scope.createGroupBtn = function () {

                    $scope.isDisabled = true;
                    $scope.isAccount = false
                    $scope.isGroup = true
                    return false;
                }
                $scope.createAccount = function () {
                    $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
                    //if (localStorage.['adminrole'] = '3') {
                    //    var isUo = true
                    //} if (localStorage['adminrole'] = '2') {
                    //    var isUo = false
                    //}
                    var isUo = localStorage.usertype == 'UO' ? true : false;
                    console.log($scope.groupMasters);
                    console.log($scope.checkboxModel.value1);
                   
                    if ($scope.isAccount) {
                        var OBalance
                        console.log($scope.OBalance)
                        if (!$scope.OBalance){
                            var OBalance = false
                        }
                         else{
                            OBalance = true
                          }
                        var accountData = {
                            compCode: [localStorage.CompanyId],
                            accountName:    $scope.accountName.toUpperCase(),
                            Under:          $scope.groupMasters.selected.name,
                            type:           $scope.groupMasters.selected.type,
                            balance:        $scope.balance,
                            rate:           $scope.rate,
                            isUo:           isUo,
                            isActive:       true,
                     openingBalanceVisible: OBalance,
                            rate:           Number($scope.rate),
                            openingBalance: $scope.openingBalance,
                            balanceType:    $scope.balanceType,
                            propName:       $scope.propName,
                            email:          $scope.email,
                            phone:          $scope.phone,
                            mobile:         $scope.mobile,
                           
                            billingAddress: [
                        {
                            street:     $scope.street,
                            city:       $scope.city.selected.city,
                            state:      $scope.state.selected.Name,
                            postalCode: $scope.postalCode,
                            country:    $scope.country
                        }
                            ],
                            shippingAddress: [
                              {

                                  street:    $scope.street1,
                                  city:      $scope.city1,
                                  state:     $scope.state1,
                                 postalCode: $scope.postalCode1,
                                  country:   $scope.country1
                              }
                            ],
                            taxInfo:
                              {
                                  taxRegNo:   $scope.taxRegNo,
                                  cstRegNo:   $scope.cs$scopetRegNo,
                                  exRegNo:    $scope.exRegNo,
                                  panNo:      $scope.pantaxRegNoNo,
                                  range:      $scope.Range,
                                  division:   $scope.division,
                                  address:    $scope.address,
                              commisionerate: $scope.commisionerate,
                                  ceRegionNo: $scope.ceRegionNo,
                                  eccCodeNo:  $scope.eccCodeNo,
                                  iecNo:      $scope.iecNo,


                              },
                            notes: $scope.notes,

                        }
                       
                        $scope.updateExistingAccount = function () {
                            var accountData = {
                                compCode: localStorage.CompanyId,
                            }
                            $http.post(config.login + "updateAccount/" + $scope.accId, accountData).then(function (response) {
                                $rootScope.$broadcast('event:accountReferesh', {});
                                
                                $('#formaccount').modal('hide');
                            });

                        }
                        $scope.accountCreations = function () {
                            

                            $http.post(config.login + "createAccount?id=" + $scope.accountId, accountData).then(function (response) {
                                if (response.data.id) {
                                    
                                    $scope.accountId = response.data.id
                                    console.log(response.data)
                                    $http.post(config.login + "openingBalanceLedgerEntry/" + localStorage.CompanyId + "?accountId=" + $scope.accountId + "&role=" + localStorage.usertype, accountData).then(function (response) {
                                        $http.get(config.login + "getAccountNameById").then(function (response) {
                                            $scope.accountData = response.data
                                            $rootScope.$broadcast('event:success', { message: "Account Created Succesfully" });
                                            $rootScope.$broadcast('event:accountReferesh', {});
                                           
                                            for (var i = 0; i < $scope.accountData.length; i++) {
                                                localStorage[$scope.accountData[i]._id] = $scope.accountData[i].accountName
                                            }
                                            $('#formaccount').modal('hide');
                                        });

                                    });
                                }
                             });
                            
                        }
                        $scope.accountCreations();
                       
                        clearScope();
                    }
                    if ($scope.isGroup) {
                        var groupData = {
                            compCode: localStorage.CompanyId,
                            name: $scope.accountName.toUpperCase(),
                            type: $scope.groupMasters.selected.name,
                            balanceType: $scope.balanceType
                        }

                        $http.post(config.login + "createGroup", groupData).then(function (response) {
                            $http.get(config.api + "groupMasters").then(function (response) {
                                $scope.groupMaster = response.data;
                            });
                        });
                    }
                }

            }],

            link: function (scope, element, attrs) {

            }
        };
    }
//]
);