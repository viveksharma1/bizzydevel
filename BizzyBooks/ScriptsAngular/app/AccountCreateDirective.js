myApp.directive('createAccount',
    //['$http', 'config',
    function () {

        return {
            restrict: 'EA', //Default in 1.3+
            scope: { value: '=' },
            templateUrl: 'CreateAccount.html',
            transclude: true,
            replace: true,
            controller: ['$scope', '$http', 'config', function ($scope, $http, config) {
                $(".my a").click(function (e) {
                    e.preventDefault();
                });
                $scope.groupMasters = {};
                $scope.accounts = {};
                $scope.checkboxModel = {
                    value1: false

                };
                $http.get(config.api + "accounts" + "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
                    $scope.parentAccount = response.data;

                });

                $http.get(config.api + "groupMasters").then(function (response) {
                    $scope.groupMaster = response.data;

                });

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
                        if ($scope.value.accountName) {
                            $scope.accountName = $scope.value.accountName;
                        }
                        if ($scope.value.id) {
                            $scope.accountId = $scope.value.id
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
                                $scope.city = $scope.value.billingAddress[0].city;
                                $scope.state = $scope.value.billingAddress[0].state;
                                $scope.postalCode = $scope.value.billingAddress[0].postalCode;
                            }
                            if ($scope.value.shippingAddress && $scope.value.shippingAddress.length > 0) {

                                $scope.street1 = $scope.value.shippingAddress[0].street;
                                $scope.city1 = $scope.value.shippingAddress[0].city;
                                $scope.state1 = $scope.value.shippingAddress[0].state;
                                $scope.postalCode1 = $scope.value.shippingAddress[0].postalCode;
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
                            $scope.openingBalance = $scope.value.openingBalance;
                        }
                    }
                    else {
                        $scope.accountId = null
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
                            accountName: $scope.accountName.toUpperCase(),
                            Under: $scope.groupMasters.selected.name,
                            type: $scope.groupMasters.selected.type,
                            balance: $scope.balance,
                            credit: 0,
                            debit: 0,
                            rate: $scope.rate,
                            isUo: isUo,
                            openingBalanceVisible: OBalance,
                            rate: Number($scope.rate),
                            openingBalance: $scope.openingBalance,
                            balanceType: $scope.balanceType,
                            propName: $scope.propName,
                            email: $scope.email,
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
                            taxInfo:
                              {
                                  taxRegNo: $scope.taxRegNo,
                                  cstRegNo: $scope.cstRegNo,
                                  exRegNo: $scope.exRegNo,
                                  panNo: $scope.panNo,
                                  range: $scope.Range,
                                  division: $scope.division,
                                  address: $scope.address,
                                  commisionerate: $scope.commisionerate,
                                  ceRegionNo: $scope.ceRegionNo,
                                  eccCodeNo: $scope.eccCodeNo,
                                  iecNo: $scope.iecNo,


                              },
                            notes: $scope.notes,

                        }
                        console.log(accountData)
                        $scope.updateExistingAccount = function () {
                            var accountData = {
                                compCode: localStorage.CompanyId,
                            }
                            $http.post(config.login + "updateAccount/" + $scope.accId, accountData).then(function (response) {
                            });

                        }
                        $scope.accountCreations = function () {
                            

                            $http.post(config.login + "createAccount?id=" + $scope.accountId, accountData).then(function (response) {
                                showSuccessToast("Account Created Succesfully");
                                $http.post(config.login + "openingBalanceLedgerEntry/" + localStorage.CompanyId + "?accountId="+ $scope.accountId, accountData).then(function (response) {
                                    $http.get(config.login + "getAccountNameById").then(function (response) {
                                        $scope.accountData = response.data
                                        for (var i = 0; i < $scope.accountData.length; i++) {
                                            localStorage[$scope.accountData[i]._id] = $scope.accountData[i].accountName
                                        }
                                    });
                                });

                                //$http.get(config.login + "chartOfAccount/" + localStorage.CompanyId).then(function (response) {
                                //    $scope.account = response.data;

                                //});
                            });
                        }
                        $scope.accountCreations();


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