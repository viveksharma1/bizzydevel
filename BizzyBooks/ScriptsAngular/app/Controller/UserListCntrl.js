myApp.controller('UserListCntrl', ['$scope', 'config','$http', '$timeout','authService', '$rootScope', '$state', function ($scope,config, $http, $timeout,authService, $rootScope, $state) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.UserEdit = function () {
        $('#UserEditModal').modal('show');
    }

    $('#CompanySelect').select2();
    $('#RoleSelect').select2();


    $('.jsonbox').hide();
    $scope.ShowJson = function () {
        $('.jsonbox').show();
        $('.codebox').hide();
    },
    $scope.BackJson = function () {
        $('.jsonbox').hide();
        $('.codebox').show();
    }

     var json = {};

    $scope.obj = { data: json, options: { mode: 'tree' } };

    $scope.onLoad = function (instance) {
        instance.expandAll();
    };
    $scope.changeData = function () {
        $scope.obj.data = { foo: 'bar' };
    };
    $scope.changeOptions = function () {
        $scope.obj.options.mode = $scope.obj.options.mode == 'tree' ? 'code' : 'tree';
    };

    //other
    $scope.pretty = function (obj) {
        return angular.toJson(obj, true);
    }
    $scope.roles = [];
    createRoles();
    function createRoles() {
        authService.fillAuthData();
        $scope.userInfo = $rootScope.authentication;
        switch($scope.userInfo.role){
            case '1':
                $scope.roles = [
        { "roleId": "2", "roleName": "Official" },
        { "roleId": "1", "roleName": "UO Manager" }
                ];
                break;
            //case '2':
            //    $scope.roles = [
            //        { "roleId": "2", "roleName": "Official" }
            //    ];
            //    break;
            case '3':
                $scope.roles = [
                    { "roleId": "2", "roleName": "Official" },
                    { "roleId": "1", "roleName": "UO Manager" },
                    { "roleId": "3", "roleName": "UO Admin" }
                ];
                break;
    
        }
    
    }
    
    //var userInfo=authService.Authentication();
    //var authData = localStorageService.get('authorizationData');
    $http.get(config.api + 'Users?filter[where][status]=1&access_token=' + authService.innerToken())
                .then(function (response) {
                    $scope.userList=filterList(response.data);

                });
    $http.get(config.api + "CompanyMasters?filter[where][IsActive]=1").then(function (response) {
        $scope.companyList = response.data;
    });
    
    function filterList(data) {
        var userList = [];
        angular.forEach(data, function (user) {
            if(!($scope.userInfo.role=='1' && user.role=='3'))
                userList.push(user)
        })
        return userList;
        
    }
    $scope.newUser = function () {
        $scope.editMode = "new";
        $scope.user = {};
        $scope.company = { selected: []};
        $scope.role = { selected: undefined };
        $scope.obj = { data: authService.getPermissionJson(), options: { mode: 'tree' } }; ///logged ub user permission.
        $('#UserEditModal').modal('show');
    }
    //$scope.company.selected = null;
    $scope.editUser = function (user) {
        $scope.editMode = "edit";
        $scope.user = user;
        //$scope.company.selected = $scope.companyList;
        $scope.company = { selected: getCompanies(user.companies) };
        $scope.role={selected: getRole(user.role)};//.selected = { "roleId": "2", "roleName": "Official" };
        $scope.obj = { data: user.permission, options: { mode: 'tree' } };
        $('#UserEditModal').modal('show');

    }
    //function validateInputs() {
    //    if ($scope.user.username == undefined) {
    //        showErrorToast("Please enter username");
    //        return;
    //    }
    //    if ($scope.user.password === $scope.rePassword) {
    //        showErrorToast("Passwords are not same");
    //        return;
    //    }
    //    if ($scope.user.password) {
    //        showErrorToast("Passwords can not be empty");
    //    }
    //    if ($scope.user.password) {
    //        showErrorToast("Passwords can not be empty");
    //    }

    //    if ($scope.role.selected) {
    //        showErrorToast("Please select a role");
    //        return;
    //    }
    //}
    $scope.updateUser = function (del) {
        if ($scope.user.username == undefined || $scope.user.username == "") {
            showErrorToast("Please enter username");
            return;
        }
        if ($scope.user.email == undefined || $scope.user.email == "") {
            showErrorToast("Please enter email");
            return
        }
        if ($scope.editMode == "new") {
            if ($scope.user.password == undefined || $scope.user.password == "") {
                showErrorToast("Passwords can not be empty");
                return;
            }
            if ($scope.user.password != $scope.rePassword) {
                showErrorToast("Passwords are not same");
                return;
            }
            
        }

        if ($scope.role.selected == undefined || $scope.role.selected == null) {
            showErrorToast("Please select a role");
            return;
        }
        if ($scope.editMode == "edit") {
            var user = $scope.user;
            user.companies = getCompanyIds($scope.company.selected);
            user.role = $scope.role.selected.roleId;
            user.permission = $scope.obj.data;
            if (del)
                user.status = "0";
            $http.put(config.api + 'Users?access_token=' + authService.innerToken(), user)
                    .then(function (response) {
                        $('#UserEditModal').modal('hide');
                        $state.reload();
                    }, function (data) {
                        if (data.data.error.message)
                            showErrorToast(data.data.error.message);
                        else
                            showErrorToast("Error while updating user");
                    });

        } else {
            var user = $scope.user;
            user.companies = getCompanyIds($scope.company.selected);
            user.role = $scope.role.selected.roleId;
            user.admin = {};
            user.emailVerified = true;
            user.status = "1";
            user.permission = $scope.obj.data;
            $http.post(config.api + 'Users?access_token=' + authService.innerToken(), user)
                    .then(function (response) {
                        $('#UserEditModal').modal('hide');
                        $state.reload();
                    }, function (data) {
                        if (data.data.error.message)
                            showErrorToast(data.data.error.message);
                        else
                            showErrorToast("Error while creating user");
                    });
        }
    }
    function getCompanyIds(companies) {
        var ids = [];
        if (companies) {
            angular.forEach(companies, function (item) {
                ids.push(item.CompanyId);
            })
        }
        return ids;
    }
    function getCompanies(companies) {
        var filtercompany = [];
        if (companies) {
            angular.forEach($scope.companyList, function (item) {
                companies.indexOf(item.CompanyId) >= 0 ? filtercompany.push(item) : "";
            })
        }
        return filtercompany;
    }
    function getRole(roleId) {
        var keepGoing = true;
        var itemRet = undefined;
        if (roleId) {
            angular.forEach($scope.roles, function (item) {
                if (keepGoing) {
                    if (roleId == item.roleId) {
                        keepGoing = false;
                        itemRet = item;
                    }
                }
            });
        }
        return itemRet;
        
    }
    //$scope.SetUpdatedclaims = function () {
    //    $('#btnclaimSave').hide();
      
    //    var email = emailUpdate;
    //    var str = JSON.stringify($scope.obj.data, undefined, 4);
    //    var Str2 = JSON.stringify(JSON.parse(str))
    //    var objClaims = {
    //        type: "settingJson",
    //        value: Str2
    //        //CreatedDate: "",
    //    }
    //    var apiUrl = "api/accounts/user/UpdateClaimsByEmail?email=" + email;

    //    userSettingsService.UpdateUserClaimsDetails(apiUrl, objClaims).then(function (response) {

    //        $('#resetclaimsModal').modal('hide');
    //        if (response.statusText == "OK") {
    //            $('#btnclaimSave').show();
    //            alert("Claims updated successfully.");
    //        }
    //        else {
    //            $('#btnclaimSave').show();
    //            alert("Fatel error found.");
    //        }


    //    });



    //}


    //$scope.GetEmpRolePermission = function () {
    //    var a = {};
    //    $scope.obj = { data: a, options: { mode: 'tree' } };
    //    $('#EmpRoleLoad').show();
    //    var RolePermissionId = $scope.Emprole;

    //    if (RolePermissionId != undefined && RolePermissionId != "") {
    //        var apiUrl = "api/Role?$select=RoleId,Permission&$filter=RoleId eq " + RolePermissionId;

    //        roleSettingsService.getRoleDetails(apiUrl).then(function (response) {

    //            var myJsObj = response.data[0].permission;

    //            var obj = jQuery.parseJSON(myJsObj);
    //            // var str = JSON.stringify(obj, undefined, 4);

    //            $scope.obj = { data: obj, options: { mode: 'tree' } };
    //            $('#EmpRoleLoad').hide();
    //            //$('#resetclaimsModal').modal('show');

    //        });
    //    }
    //}

}]);