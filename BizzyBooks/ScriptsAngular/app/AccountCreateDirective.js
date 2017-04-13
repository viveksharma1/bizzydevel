myApp.directive('createAccount',
    //['$http', 'config',
    function () {

     return {
        restrict: 'EA', //Default in 1.3+
        scope: {value: '=' },
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

                        $scope.accountName = $scope.value.accountName

                        $scope.groupMasters = { selected: { name: $scope.value.Under } };
                        $scope.groupMasters.selected.type = $scope.value.type;
                        $scope.balanceType = $scope.value.balanceType
                        if ($scope.value.rate) {
                            $scope.rate = $scope.value.rate
                        }
                        $scope.credit = $scope.value.credit
                        $scope.debit = $scope.value.debit
                        $scope.openingBalance = $scope.value.openingBalance
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

                if (localStorage['adminrole'] = '3') {
                    var isUo = true
                } if (localStorage['adminrole'] = '2') {
                    var isUo = false
                }

                console.log($scope.groupMasters);
                console.log($scope.checkboxModel.value1);
                if ($scope.isAccount) {
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
                        rate: Number($scope.rate),
                        openingBalance: $scope.openingBalance,
                        balanceType: $scope.balanceType

                    }
                    $http.get(config.api + "accounts?filter[where][accountName]=" + $scope.accountName.toUpperCase()).then(function (response) {
                        console.log(response)
                        if (response.data) {
                            $scope.accId = response.data[0].id;
                           
                            $('#accountAlert').modal('show');
                        }
                        else {
                            $scope.accountCreations();
                        }
                    });
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
                            $http.get(config.login + "getAccountNameById").then(function (response) {
                                $scope.accountData = response.data
                                for (var i = 0; i < $scope.accountData.length; i++) {
                                    localStorage[$scope.accountData[i]._id] = $scope.accountData[i].accountName
                                }
                            });

                            $http.get(config.login + "chartOfAccount/" + localStorage.CompanyId).then(function (response) {
                                $scope.account = response.data;

                            });
                        });
                    }
                   

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