
var RoleCheck = "";
myApp.controller('HomeCntrl', ['$state', '$http', '$rootScope', '$scope', 'config','authService', function ($state, $http, $scope, $rootScope, config,authService) {
    // showoverlay();
    $(".my a").click(function (e) {
        e.preventDefault();
    });
    function initiateHome() {
        $scope.userInfo = $rootScope.authentication;
        //if ($scope.CompanyList == undefined) {
            if (localStorage.comobj != undefined) {
                $scope.CompanyList = JSON.parse(localStorage.comobj);
                if ($scope.CompanyList.length == 0) GetCompanyData();
                else {
                    console.log($scope.CompanyList);
                    if (localStorage.DefaultCompany) {
                        setCompany(JSON.parse(localStorage.DefaultCompany));
                        //$scope.DefaultCompany = JSON.parse(
                        //.DefaultCompany);//[0];
                    } else {
                        //$scope.DefaultCompany = $scope.CompanyList[0];
                        //localStorage.DefaultCompany = JSON.stringify($scope.DefaultCompany);
                        setCompany($scope.CompanyList[0]);
                    }
                    //$scope.DefaultCompanyName = localStorage.DefaultCompanyName;
                }
            } else GetCompanyData();

        //}
    }
    //if ($rootScope.reload) {
    //    $state.reload();
    //    $rootScope.reload = false;
    //}
    //if (localStorage.reload=="true") {
    //    localStorage.reload = false;
    //    window.location.reload();
    //} else {
        initiateHome();
    //}
    
    function GetCompanyData() {
        //$scope.reload = true;
        $http.get(config.api + "CompanyMasters").success(function (response) {
            $scope.CompanyList = filterCompanyList(response);
            //$scope.CompanyList = response;
            
            console.log($scope.CompanyList)
            localStorage.comobj = JSON.stringify($scope.CompanyList);
            setCompany($scope.CompanyList[0]);
            //$scope.DefaultCompany = $scope.CompanyList[0];
            //localStorage.DefaultCompany = JSON.stringify($scope.DefaultCompany);
            //localStorage.DefaultCompanyName = response[0].CompanyName;
            //localStorage.CompanyId = response[0].CompanyId;
            //$scope.DefualtVATTIN_NO = response[0].VAT_TIN_NO;
            //localStorage.VAT_TIN_NO = response[0].VAT_TIN_NO;
            //$scope.CST_TIN_NO = response[0].CST_TIN_NO;
            //localStorage.CST_TIN_NO = response[0].CST_TIN_NO;
            //localStorage.ChangeCompanyName = undefined;
            //localStorage.VAT_TIN_NO = undefined;
        })
        //if (Role == "3") {
        //    var url = config.api + "CompanyMasters";
            

        //}
        //else {
        //    var url = config.api + "CompanyMasters"; //+ Role;
        //    $http.get(url).success(function (response) {
        //        $scope.CompanyList = response;
        //        localStorage.comobj = JSON.stringify(response);
        //        $scope.DefaultCompanyName = response[0].CompanyName;
        //        localStorage.DefaultCompanyName = response[0].CompanyName;
        //        localStorage.CompanyId = response[0].CompanyId;
        //        $scope.DefualtVATTIN_NO = response[0].VAT_TIN_NO;
        //        localStorage.VAT_TIN_NO = response[0].VAT_TIN_NO;
        //        $scope.CST_TIN_NO = response[0].CST_TIN_NO;
        //        localStorage.CST_TIN_NO = response[0].CST_TIN_NO;
        //        localStorage.ChangeCompanyName = undefined;
        //        //localStorage.VAT_TIN_NO = undefined;
        //    })

        //}
    }
    function filterCompanyList(companyList) {
        var filtercompany=[];
        angular.forEach(companyList, function (item) {
            $scope.userInfo.companies.indexOf(item.CompanyId) >= 0 ? filtercompany.push(item) : "";
        })
        return filtercompany;
    }
    function setCompany(company) {
        $scope.DefaultCompany = company;
        localStorage.DefaultCompany = JSON.stringify($scope.DefaultCompany);
        localStorage.CompanyId = $scope.DefaultCompany.CompanyId;
        //if ($scope.reload)
            
        
    }
    $scope.changeCompany = function (company) {
        setCompany(company);
        $state.reload();
    }
    $scope.logout = function () {
        $http.get(config.login + 'logout' + "?token1=" + localStorage["tokenNo"])
                      .success(function (data) {
                          console.log(data)
                          //if (data == "logout") {
                          authService.logOut();
                          //$state.reload();
                          //$state.go('login', {}, { reload: true });
                          localStorage.reload = true;
                          $state.go('login');
                          //}
                      });

    }

    //$scope.usertype = localStorage['usertype'];

    $scope.AddCompnay = function () {
        $('#AddCompnayModal').modal('show');
    }


}]);










