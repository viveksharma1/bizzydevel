
var RoleCheck = "";
myApp.controller('LoginCntrl', ['$state', '$http', '$rootScope', '$scope', 'config', 'UserService', 'authService', 'localStorageService', 'SweetAlert', function ($state, $http, $scope, $rootScope, config, UserService, authService, localStorageService, SweetAlert) {
    if (localStorage.reload == "true") {
        localStorage.reload = false;
        window.location.reload();
    }

    $scope.showCaptcha = false;
    var authData = {};
    $scope.username = null;
    $scope.password = null;
    $scope.login = function () {
        if ($scope.showCaptcha) {
            var res=ValidCaptcha();
            if (res == 1) { authData.usertype = "O"; $scope.loggedin(authData); }
            else if (res == -1) { authData.usertype = "UO"; $scope.loggedin(authData); }
            else { showErrorToast("Login Failed"); resetLogin(); }
        } else {
            $scope.username = $('#usernamedetail').val();
            $scope.password = $('#userpassword').val();
            var data = {
                "email": $scope.username,
                "password": $scope.password
            };
            $http.post(config.login + "login", data).success(function (data, status) {
                console.log(data.message);
             
                if (data.message == "User Not Found") {
                    $('#InvalidModal').modal('show');
                }
                else {
                    authData={
                                token_inner: data.id,
                                token: data.token,
                                userid:data.user.id,
                                username: data.user.username,
                                role: data.user.role,
                                usertype: "O",
                                companies: data.user.companies
                            };
                    $scope.role = data.user.role;
                    if ($scope.role === "2") { //O
                        $scope.loggedin(authData);
                    } else { //UO
                        $('#InvalidModal').modal('show');
                    }
                    
                }
            });
        }
    };
    $scope.errorpopup = function () {
        if ($scope.role && $scope.role != "2") {
            $scope.showCaptcha = true;
            $('#CaptchaDiv').show();
            Captcha();
        }
    }
    function resetLogin() {
        $scope.username = null;
        $scope.password = null;
        localStorageService.remove('authorizationData');
        authData = {},
        $scope.showCaptcha = false;
        $('#CaptchaDiv').hide();
    }
    $scope.loggedin = function (authData) {
        localStorageService.set('authorizationData', authData);
        localStorage.usertype = authData.usertype;
        authService.fillAuthData();
        $state.go('Customer.HomePage');
        

    }
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
        $scope.mainCaptcha = code;
    }

    function ValidCaptcha() {
        var mainCaptcha_Value = removeSpaces($scope.mainCaptcha);
        var inputCaptcha_Value = removeSpaces(document.getElementById('txtInput').value);
        return mainCaptcha_Value == inputCaptcha_Value?1:reverseString(mainCaptcha_Value) == inputCaptcha_Value?-1:0;
    }
    function reverseString(str) {
        return str.split("").reverse().join("");
    }
    function removeSpaces (string) {
        return string.split(' ').join('');
    }

    //var date = new Date();
    //localStorage.fromDate = moment().subtract(30, 'days').format('MM/DD/YYYY');
    //localStorage.toDate = moment().format('MM/DD/YYYY'); moment()
}]);










