'use strict';
myApp.factory('authService', ['$http', 'jwtHelper', 'localStorageService','$rootScope',  function ($http, jwtHelper,localStorageService,$rootScope) {

    var authServiceFactory = {};
    var configJson;
    var _permissionJson = function () {
        if (!configJson) {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _fillUserConfig(authData.token);
            }
        }
        return configJson
    };
    var _innerToken = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            return authData.token_inner;
        }
        return "";
    }
    var _authentication = {
        isAuth: false,
        username: "",
        role: "",
        usertype: "",
        companies: []
    };
    var _fillAuthData = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.username = authData.username;
            _authentication.role = authData.role;
            _authentication.usertype = authData.usertype;
            _authentication.companies = authData.companies
        } else {
            _authentication = {
                isAuth: false,
                username: "",
                role: "",
                usertype: "",
                companies: []
            };
        }
        $rootScope.authentication = _authentication;
    }
    //var _logOut = function () {
    //    localStorageService.remove('authorizationData');
    //    localStorageService.remove('compData');
    //    delete $rootScope.authentication;
    //};
    var _fillUserConfig=function(token){
        try{
            configJson = //$.parseJSON(
                jwtHelper.decodeToken(token).permission
            //)
            ;
        }catch(e){
            
        }
    };
   // Permission Related functions
    var _checkPermissionForView = function (view) {
        if (view.requiresAuthentication || view.requiresAuthentication==undefined) {
            return userHasPermissionForView(view);
        }
        return true;
        
    };
    var userHasPermissionForView = function (view) {
        if (!_isLoggedIn()) {
            return false;
        }

        if (!view.permissions
            //|| !view.permissions.length
            ) {
            return true;
        }

        return _userHasPermission(view.permissions);
    };
    function findProp(obj, prop, defval) {
        if (typeof defval == 'undefined') defval = null;
        prop = prop.split('.');
        for (var i = 0; i < prop.length; i++) {
            if (typeof obj[prop[i]] == 'undefined') {
                //also check in localstorage
                var locValue = localStorage[prop[i]];
                return locValue?locValue:defval;
            }
            obj = obj[prop[i]];
        }
        return obj;
    }
    var _userHasPermission = function (permissions) {
        if (!_isLoggedIn()) {
            return false;
        }
        if (permissions.length > 0) {
            //var perm = elem.attr("permission");
            var match = permissions.split(':');
            var path = match.length > 0 ? match[0] : permissions;
            if (match.length < 2)
                match = "true";
            else
                match = match[1];
            //var obj = {
            //    path: path,
            //    match: match
            //}
            var ret = false;
            var per = _permissionJson();
            if (per == undefined)
                return true;
            var val = findProp(per, path);
            if (val!=undefined && typeof val != "string")
                val = val.toString();
            if (val === match || val==undefined)
                ret = true;
            return ret;
        } else
            return true;
        
    };
    var _getUserPermission = function (permissions,fallback) {
        if (permissions.length > 0) {
            var match = permissions.split(':');
            var path = match.length > 0 ? match[0] : permissions;
            var per = _permissionJson();
            return findProp(per, path, fallback);
        } 
    };
    var _isLoggedIn = function () {
        var ret=false;
        var authData = localStorageService.get('authorizationData');
        if (authData)
            ret = true;
        return ret;
    };
    var _getAuthentication = function () {
        return _authentication;
    };
    var _logOut = function () {
        localStorageService.remove('authorizationData');
        localStorage.removeItem("usertype");
        localStorage.removeItem("CompanyId");
        localStorage.removeItem("comobj");
        localStorage.removeItem("DefaultCompany");//= authData.role;
        _fillAuthData();
        //localStorage.removeItem("CompanyId");
        //localStorageService.remove('compData');
        delete $rootScope.authentication;
    };
 
    authServiceFactory.fillAuthData = _fillAuthData
    authServiceFactory.getAuthentication = _getAuthentication;
    authServiceFactory.checkPermissionForView = _checkPermissionForView;
    authServiceFactory.userHasPermission = _userHasPermission;
    authServiceFactory.getUserPermission = _getUserPermission;
    authServiceFactory.isLoggedIn = _isLoggedIn;
    authServiceFactory.innerToken = _innerToken;
    authServiceFactory.logOut = _logOut;
    return authServiceFactory;
}]);