(function() {
    'use strict';

    angular
        .module('deliveryApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('delivery-job', {
            parent: 'entity',
            url: '/delivery-job',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'DeliveryJobs'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/delivery-job/delivery-jobs.html',
                    controller: 'DeliveryJobController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('delivery-job-detail', {
            parent: 'delivery-job',
            url: '/delivery-job/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'DeliveryJob'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/delivery-job/delivery-job-detail.html',
                    controller: 'DeliveryJobDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'DeliveryJob', function($stateParams, DeliveryJob) {
                    return DeliveryJob.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'delivery-job',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('delivery-job-detail.edit', {
            parent: 'delivery-job-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/delivery-job/delivery-job-dialog.html',
                    controller: 'DeliveryJobDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['DeliveryJob', function(DeliveryJob) {
                            return DeliveryJob.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('delivery-job.new', {
            parent: 'delivery-job',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/delivery-job/delivery-job-dialog.html',
                    controller: 'DeliveryJobDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                address: null,
                                longitude: null,
                                latitude: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('delivery-job', null, { reload: 'delivery-job' });
                }, function() {
                    $state.go('delivery-job');
                });
            }]
        })
        .state('delivery-job.edit', {
            parent: 'delivery-job',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/delivery-job/delivery-job-dialog.html',
                    controller: 'DeliveryJobDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['DeliveryJob', function(DeliveryJob) {
                            return DeliveryJob.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('delivery-job', null, { reload: 'delivery-job' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('delivery-job.delete', {
            parent: 'delivery-job',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/delivery-job/delivery-job-delete-dialog.html',
                    controller: 'DeliveryJobDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['DeliveryJob', function(DeliveryJob) {
                            return DeliveryJob.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('delivery-job', null, { reload: 'delivery-job' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
