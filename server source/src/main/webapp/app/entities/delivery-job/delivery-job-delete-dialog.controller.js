(function() {
    'use strict';

    angular
        .module('deliveryApp')
        .controller('DeliveryJobDeleteController',DeliveryJobDeleteController);

    DeliveryJobDeleteController.$inject = ['$uibModalInstance', 'entity', 'DeliveryJob'];

    function DeliveryJobDeleteController($uibModalInstance, entity, DeliveryJob) {
        var vm = this;

        vm.deliveryJob = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            DeliveryJob.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
