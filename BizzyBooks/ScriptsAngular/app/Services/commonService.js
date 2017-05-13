//myApp.service('commonService', function ($http) {
//    return {
//        getOpeningBalance: function (url, CompanyId) {
//            return $http.post(url, CompanyId, function (response) {
//                console.log(JSON.stringify(response));
//                return response.data;
//            });
//        }
//    };
//});


myApp.factory('commonService', ['$http', '$q', function ($http, $q) {
    var commonServiceFactory = {};
    var _getOpeningBalance = function (url, CompanyId) {
        var deferred = $q.defer();
        return $http.post(url, CompanyId).then(function (results) {
            deferred.resolve(results);
            // promise is returned
            return deferred.promise;
        },
        function (results) {
            // the following line rejects the promise 
            deferred.reject(results);
            // promise is returned
            return deferred.promise;
        })
    };

    var _checkSalesInventory = function (url, invId) {
        var deferred = $q.defer();
        return $http.get(url).then(function (results) {
            deferred.resolve(results);
            // promise is returned
            return deferred.promise;
        },
        function (results) {
            // the following line rejects the promise 
            deferred.reject(results);
            // promise is returned
            return deferred.promise;
        })
    };
    commonServiceFactory.getOpeningBalance = _getOpeningBalance;
    commonServiceFactory.checkSalesInventory = _checkSalesInventory;
    return commonServiceFactory;

    }]);