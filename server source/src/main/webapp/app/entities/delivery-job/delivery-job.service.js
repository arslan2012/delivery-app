(function() {
    'use strict';
    angular
        .module('deliveryApp')
        .factory('DeliveryJob', DeliveryJob);

    DeliveryJob.$inject = ['$resource'];

    function DeliveryJob ($resource) {
        var resourceUrl =  'api/delivery-jobs/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
