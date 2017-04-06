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
                if ($scope.value) {
                    $scope.accountName = $scope.value;
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
                        compCode: localStorage.CompanyId,
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

                    $http.post(config.login + "createAccount", accountData).then(function (response) {

                        $http.get(config.login + "chartOfAccount").then(function (response) {
                            $scope.account = response.data;
                        });
                    });

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