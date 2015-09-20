(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('VorkasseService', VorkasseService);

    VorkasseService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function VorkasseService($http, AppConfig) {
        var service = {
            getVorkasse: getVorkasse,
            getVorkasses: getVorkasses,
            editVorkasse: editVorkasse,
            deleteVorkasse: deleteVorkasse,
        };
        return service;

        ////////////////

        function getVorkasse(transId) {
            var promise = $http.get(AppConfig.apiUrl + '/purchase-agent?id=' + transId).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getVorkasses() {
            var promise = $http.get(AppConfig.apiUrl + '/purchase-agent/').then(function (response) {
                return response.data;
            });
            return promise;
        }

        function editVorkasse(transId, trans) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/purchase-agent/' + transId,
                method: 'PUT',
                data: trans,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function deleteVorkasse(transId) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/purchase-agent/' + transId,
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
    }
})();