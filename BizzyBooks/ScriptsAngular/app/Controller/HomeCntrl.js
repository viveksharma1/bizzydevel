
var RoleCheck = "";
myApp.controller('HomeCntrl', ['$state', '$http', '$rootScope', '$scope', 'config','authService', function ($state, $http, $scope, $rootScope, config,authService) {
    // showoverlay();
    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $('#fdate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
   
    
   
    $('#tdate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    $scope._fDate = 'fdate';
    $scope._tDate = 'tdate';
    //$scope.fdate = localStorage.fromDate
    //$scope.tdate = localStorage.toDate
    $scope.$on('companylist-change', function (event, args) {

        //// get user companies....
        //// 
        GetCompanyData();

    });
    //function getUserCompanies() {

    //}

    function initiateHome() {
        authService.fillAuthData();
        $scope.userInfo = $rootScope.authentication;
        //if ($scope.CompanyList == undefined) {
        //    if (localStorage.comobj != undefined) {
        //        $scope.CompanyList = JSON.parse(localStorage.comobj); 
        //        if ($scope.CompanyList.length == 0) GetCompanyData();
        //        else {
        //            console.log($scope.CompanyList);
        //            if (localStorage.DefaultCompany) {
        //                setCompany(JSON.parse(localStorage.DefaultCompany));
        //                //$scope.DefaultCompany = JSON.parse(
        //                //.DefaultCompany);//[0];
        //            } else {
        //                //$scope.DefaultCompany = $scope.CompanyList[0];
        //                //localStorage.DefaultCompany = JSON.stringify($scope.DefaultCompany);
        //                setCompany($scope.CompanyList[0]);
        //            }
        //            //$scope.DefaultCompanyName = localStorage.DefaultCompanyName;
        //        }
        //    } else

                GetCompanyData();

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
        function CheckCompayExists(CompanyId) {
            for(var i=0;i<$scope.CompanyList.length;i++) {
                if ($scope.CompanyList[i].CompanyId == CompanyId)
                    return true;
            }
            return false;
        }
    function GetCompanyData() {
        //$scope.reload = true;
        $http.get(config.login + "getUserCompanies/"+$scope.userInfo.userid).success(function (response) {
        //$http.get(config.api + "CompanyMasters?filter[where][IsActive]=1").success(function (response) {
            //$scope.CompanyList = filterCompanyList(response);
            $scope.CompanyList = response;
            console.log($scope.CompanyList);
            localStorage.comobj = JSON.stringify($scope.CompanyList);
            var dCompany = {};
            if (localStorage.DefaultCompany != undefined)
                dCompany = JSON.parse(localStorage.DefaultCompany);
            setCompany(CheckCompayExists(dCompany.CompanyId)? dCompany: $scope.CompanyList[0]);
            

            //setCompany($scope.CompanyList[0]);
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
    //function filterCompanyList(companyList) {
    //    var filtercompany=[];
    //    angular.forEach(companyList, function (item) {
    //        $scope.userInfo.companies.indexOf(item.CompanyId) >= 0 ? filtercompany.push(item) : "";
    //    })
    //    return filtercompany;
    //}
    function setCompany(company) {
        $scope.DefaultCompany = company;
        localStorage.DefaultCompany = JSON.stringify($scope.DefaultCompany);
        localStorage.CompanyId = $scope.DefaultCompany.CompanyId;
        //if ($scope.reload)
            
        
    }
    $scope.changeCompany = function (company) {
        setCompany(company);
        //$state.reload();
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
    $http.get(config.login + "getAccountNameById").then(function (response) {
        $scope.accountData = response.data
        for (var i = 0; i < $scope.accountData.length; i++) {
            localStorage[$scope.accountData[i]._id] = $scope.accountData[i].accountName
        }
    });
    //$scope.usertype = localStorage['usertype'];
    $scope.edit = false;
    $scope.AddCompnay = function () {
        $scope.edit = false;
        $scope.companyInfo = {};
        $('#AddCompnayModal').modal('show');
    }
    $scope.companyInfo = {};
    //moment().format('DD-MMM-YY')
    $scope.closenClear = function () {
        $('#AddCompnayModal').modal('hide');
        $scope.companyInfo = {};
    }
    $scope.editCompany = function (item) {
        $scope.edit = true;
        $scope.companyInfo = item;
        $scope.delcompanyInfo = item;
        $('#AddCompnayModal').modal('show');
    }
    $scope.deleteCompany = function () {
        $scope.delcompanyInfo.IsActive = 0;
        $http.put(config.api + "CompanyMasters", $scope.delcompanyInfo).then(function (response) {
            showSuccessToast("Company Deleted");
            GetCompanyData();
            $scope.closenClear();
        }, function () {
            showSuccessToast("Error! while deleting company");
        });
        
        //$scope.closenClear();
    }
    $scope.saveCompany = function () {
        
        $scope.companyInfo.IsActive = 1;
        //var data = {
        //    CompanyId: 'COM' + moment().format("YYYYMMDDHHmmssSSS"),
        //    CompanyName: $scope.companyInfo.companyName,
        //    companyAddress: $scope.companyInfo.address,
        //    CompanyMobileNo: $scope.companyInfo.contactNo,
        //    TIN_NO: $scope.companyInfo.TIN_NO,
        //    CST_NO: $scope.companyInfo.CST_NO,
        //    PAN_NO: $scope.companyInfo.PAN_NO,
        //    Range: $scope.companyInfo.Range,
        //    Division: $scope.companyInfo.division,
        //    Commisionerate: $scope.companyInfo.commisionerate,
        //    CE_RegionNo: $scope.companyInfo.ceRegionNo,
        //    ECC_Code_NO: $scope.companyInfo.eccCodeNo,
        //    IEC_NO: $scope.companyInfo.iecNo,
        //    ProprietorName: $scope.companyInfo.propName,
        //    IsActive:1

        //}
        if ($scope.edit) {
            $http.put(config.api + "CompanyMasters", $scope.companyInfo).then(function (response) {
                showSuccessToast("Company info updated");
                $scope.closenClear();
            }, function () {
                showSuccessToast("Error! while updating company info");
            });
        } else {
            $scope.companyInfo.CompanyId = 'COM' + moment().format("YYYYMMDDHHmmssSSS");
            var dataAssign={ role: localStorage['usertype'], compCode: $scope.companyInfo.CompanyId };
            $http.post(config.api + "CompanyMasters", $scope.companyInfo).then(function (response) {
                showSuccessToast("Company created");
                $http.post(config.login + "assignCompany", dataAssign).then(function (response) {
                    GetCompanyData();
                });
                $scope.closenClear();
            }, function () {
                showSuccessToast("Error! while creating company");
            });
        }
    }

    $scope.setPeriod = function () {
        var d = new Date(getDate($scope._fDate));
        d.setHours(0, 0, 0, 0);
        $scope.fromDate = d;
        d = new Date(getDate($scope._tDate));
        d.setHours(23, 59, 59, 0);
        $scope.toDate = d;
        localStorage.fromDate = $scope.fromDate;
        localStorage.toDate = $scope.toDate;

        console.log("data in home", $scope.fromDate, $scope.toDate)
        //var _sDate =new  getDate($scope._fDate);
        //var _eDate = getDate($scope._tDate);
        $rootScope.$broadcast('date-changed', { fromDate: $scope.fromDate, toDate: $scope.toDate });
        

   }


    //localStorage.fromDate = moment().subtract(30, 'days').format('MM/DD/YYYY'); 
    //localStorage.toDate = moment().format('MM/DD/YYYY'); moment()
    setDate($scope._fDate, localStorage.fromDate);
    setDate($scope._tDate, localStorage.toDate);

    $scope.fromDate = new Date(localStorage.fromDate);
    $scope.toDate = new Date(localStorage.toDate);
    
}]);


myApp.service('dateService', ['$rootScope',
    function ($rootScope) {
        console.log($rootScope.dateFilter);
        return $rootScope.dateFilter
    }
])











