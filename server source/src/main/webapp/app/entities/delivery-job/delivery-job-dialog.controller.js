(function() {
    'use strict';

    angular
        .module('deliveryApp')
        .controller('DeliveryJobDialogController', DeliveryJobDialogController);

    DeliveryJobDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'DeliveryJob'];

    function DeliveryJobDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, DeliveryJob) {
        var vm = this;

        vm.deliveryJob = entity;
        vm.clear = clear;
        vm.save = save;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.deliveryJob.id !== null) {
                DeliveryJob.update(vm.deliveryJob, onSaveSuccess, onSaveError);
            } else {
                DeliveryJob.save(vm.deliveryJob, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('deliveryApp:deliveryJobUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
