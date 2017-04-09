(function() {
    'use strict';

    angular
        .module('deliveryApp')
        .controller('DeliveryJobDetailController', DeliveryJobDetailController);

    DeliveryJobDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'DeliveryJob'];

    function DeliveryJobDetailController($scope, $rootScope, $stateParams, previousState, entity, DeliveryJob) {
        var vm = this;

        vm.deliveryJob = entity;
        vm.jsonString = JSON.stringify(vm.deliveryJob);
        console.log(vm.jsonString);
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('deliveryApp:deliveryJobUpdate', function(event, result) {
            vm.deliveryJob = result;
            vm.jsonString = JSON.stringify(vm.deliveryJob);
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
