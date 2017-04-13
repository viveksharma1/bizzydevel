
var RoleCheck = "";
myApp.controller('LoginCntrl', ['$state', '$http', '$rootScope', '$scope', 'config', 'UserService', function ($state, $http, $scope, $rootScope, config, UserService) {
    // showoverlay();

    
    if ($scope.CompanyList == undefined)
    {
        if (localStorage.comobj != undefined)
        {
            $scope.CompanyList = JSON.parse(localStorage.comobj)

            console.log($scope.CompanyList)
            $scope.DefaultCompanyName = localStorage.DefaultCompanyName;
        }
       
    }

    //if (localStorage.accessToken != undefined)
      //  $http.defaults.headers.common['Authorization'] = localStorage.accessToken;


    $(function () {
        //     showoverlay();
        $('#Move').on('click', function () {
            //   showoverlay();
            var usernamedetail = $('#usernamedetail').val();
            var userpassword = $('#userpassword').val();
            //  showoverlay();
            //fiewjfilewjfewjlfewrdjewi powkoew ropewkp
            var data = {
                "email": usernamedetail,
                "password": userpassword
            };
            //comment by vivek
            //comment by vivek
            //comment by vivek
            RoleCheck = "";
            // $scope.loading = true;
            $http.post(config.login + "login", data).success(function (data, status) {
                console.log(data.message);
                var userData = data;
                localStorage["tokenNo"] = data.res1.id;
                localStorage["userrole"] = data.res1.user.role;
                console.log(localStorage["userrole"]);
                localStorage["username"] = data.res1.user.username;

                $scope.username = localStorage["username"]

               // $http.defaults.headers.common['Authorization'] = data.res1.id;
                localStorage.accessToken = data.res1.id;
                RoleCheck = data.res1.user.role;
                GetCompanyData(RoleCheck)
                localStorage.userType_Role = data.res1.user.role;
                $rootScope.tok = data.token;
                localStorage['usertype'] = data.res1.user.role;
                $scope.usertype = localStorage['usertype'];
                localStorage['adminrole'] = data.res1.user.role;
                localStorage['token'] = data.token;
                // console.log($rootScope.tok);

                if (userData.message == "User Not Found") {
                   $('#InvalidModal').modal('show');
                   window.alert("invalid user and password"); 

                }
                else {
                    $http.get(config.login + "getAccountNameById").then(function (response) {
                        $scope.accountData = response.data
                        for (var i = 0; i < $scope.accountData.length; i++) {
                            localStorage[$scope.accountData[i]._id] = $scope.accountData[i].accountName
                        }
                    });
                    if (RoleCheck == "3")
                    {

                        var mainCaptcha_Value = document.getElementById('mainCaptcha').value;
                        var txtInput_Value = document.getElementById('txtInput').value;
                        if (mainCaptcha_Value != undefined)
                            var WithoutSpace = mainCaptcha_Value.split(' ').join('');
                        if (txtInput_Value == "") {
                            $('#InvalidModal').modal('show');
                        }

                        if (WithoutSpace == txtInput_Value) {
                            //.loading = false;
                            var type = "user";
                            $scope.usertype = type;
                            $rootScope.loggedin(usernamedetail);
                        }
                        else {
                            if (mainCaptcha_Value != undefined) {
                                //$scope.loading = false;
                                var type = RoleCheck;
                                $scope.usertype = type;
                                $rootScope.loggedin(usernamedetail);
                            }

                        }

                    }
                    else {
                        //$scope.loading = false;
                        $rootScope.loggedin(usernamedetail);
                    }


                }

            });

            /*
            if (usernamedetail == "") {
                return;

            }
            else if (userpassword == "") {
                return;

            }
            else {
                $rootScope.loggedin(usernamedetail);
            } */
            // hideoverlay();
        });
        //   hideoverlay();
    });

    //$('#Invalidbtn').click(function () {
    //    $('#InvalidModal').modal('show');
    //});

    $('#okbtn').click(function () {
        if (RoleCheck == "3")
            $('#CaptchaDiv').show();
        Captcha();
    })

    function Captcha() {
        var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
           'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
               '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
        var i;
        for (i = 0; i < 6; i++) {
            var a = alpha[Math.floor(Math.random() * alpha.length)];
            var b = alpha[Math.floor(Math.random() * alpha.length)];
            var c = alpha[Math.floor(Math.random() * alpha.length)];
            var d = alpha[Math.floor(Math.random() * alpha.length)];
            var e = alpha[Math.floor(Math.random() * alpha.length)];
            var f = alpha[Math.floor(Math.random() * alpha.length)];
            var g = alpha[Math.floor(Math.random() * alpha.length)];
        }
        var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
        document.getElementById("mainCaptcha").innerHTML = code
        document.getElementById("mainCaptcha").value = code
    }

    $scope.ValidCaptcha = function () {
        var mainCaptcha_Value = removeSpaces(document.getElementById('mainCaptcha').value);
        var txtInput_Value = removeSpaces(document.getElementById('txtInput').value);
        if (mainCaptcha_Value == txtInput_Value) {
            return true;
        }
        else {
            return false;
        }
    }
    $scope.removeSpaces = function (string) {
        return string.split(' ').join('');
    }



    function GetCompanyData(Role) {
        if (Role == "3") {
            var url = config.api + "CompanyMasters";
            $http.get(url).success(function (response) {
                $scope.CompanyList = response;

                console.log($scope.CompanyList)
                localStorage.comobj = JSON.stringify(response);
                $scope.DefaultCompanyName = response[0].CompanyName;
                localStorage.DefaultCompanyName = response[0].CompanyName;
                localStorage.CompanyId = response[0].CompanyId;
                $scope.DefualtVATTIN_NO = response[0].VAT_TIN_NO;
                localStorage.VAT_TIN_NO = response[0].VAT_TIN_NO;
                $scope.CST_TIN_NO = response[0].CST_TIN_NO;
                localStorage.CST_TIN_NO = response[0].CST_TIN_NO;
                localStorage.ChangeCompanyName = undefined;
                //localStorage.VAT_TIN_NO = undefined;
            })

        }
        else {
            var url = config.api + "CompanyMasters"; //+ Role;
            $http.get(url).success(function (response) {
                $scope.CompanyList = response;
                localStorage.comobj = JSON.stringify(response);
                $scope.DefaultCompanyName = response[0].CompanyName;
                localStorage.DefaultCompanyName = response[0].CompanyName;
                localStorage.CompanyId = response[0].CompanyId;
                $scope.DefualtVATTIN_NO = response[0].VAT_TIN_NO;
                localStorage.VAT_TIN_NO = response[0].VAT_TIN_NO;
                $scope.CST_TIN_NO = response[0].CST_TIN_NO;
                localStorage.CST_TIN_NO = response[0].CST_TIN_NO;
                localStorage.ChangeCompanyName = undefined;
                //localStorage.VAT_TIN_NO = undefined;
            })

        }
    }
    $scope.idSelectedVote = null;
    $scope.BindCompanyName = function (CompanyName, CompanyId, VAT_TIN_NO, CST_TIN_NO,index) {

        $scope.idSelectedVote = index;
        $scope.DefaultCompanyName = CompanyName;
        localStorage.DefaultCompanyName = CompanyName;
        localStorage.CompanyId = CompanyId;
        localStorage.ChangeCompanyName = CompanyName;
        localStorage.VAT_TIN_NO = VAT_TIN_NO;
        localStorage.CST_TIN_NO = CST_TIN_NO;

        $state.reload();

    }


    $scope.logout = function () {

        $http.get(config.login + 'logout' + "?token1=" + localStorage["tokenNo"])
                      .success(function (data) {
                          console.log(data)
                          if (data == "logout") {
                              $state.go('login');
                          }
                      });



    }
    $scope.usertype = localStorage['usertype'];
    $scope.namechange = function () {
        $('#namechangeModal').modal('show');
    }

    $scope.AddCompnay = function () {
        $('#AddCompnayModal').modal('show');
    }
}]);










