(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderQuick', OrderQuick);

    OrderQuick.$inject = ['$scope', '$stateParams', 'OrderService', 'InfoService', 'LogisticService', '$timeout', '$state', '$window'];

    /* @ngInject */
    function OrderQuick($scope, $stateParams, OrderService, InfoService,LogisticService, $timeout, $state, $window) {
  
        var TIMEOUT_DELAY = 500;
        $scope.serachText = '';
        $scope.isRequested = false;

        $scope.order = null;
        $scope.isWeightPopupShown = false;
        $scope.weightSum = null
        $scope.weight = null;
        $scope.$stateParams = $stateParams;


        $scope.weightAndPack = weightAndPack;
        $scope.weightAndPackConfirm = weightAndPackConfirm;
        $scope.weightAndPackCancle = weightAndPackCancle;
        $scope.printPackListconfirm = printPackListconfirm;
        $scope.printPostListconfirm = printPostListconfirm;
        $scope.editOrder = editOrder;
        $scope.deleteOrder = deleteOrder;
        // $scope.cancleEditOrder = cancleEditOrder;
        $scope.confirmShip = confirmShip;
        activate();

        ////////////////

        function activate() {

            var searchStockTimeout;
            $scope.$watch('serachText', function (newValue, oldValue) {
                if(newValue === oldValue) return;

                if (searchStockTimeout) $timeout.cancel(searchStockTimeout);
                searchStockTimeout = $timeout(function() {
                    search();
                }, TIMEOUT_DELAY); 
            });

        }

        function search () {
            if($scope.serachText){
                OrderService.searchOrderByRef($scope.serachText).then(function(data) {
                    $scope.isRequested = true;
                    $timeout(function () {
                        $scope.order = data;
                        $scope.order.statusStr = InfoService.getOrderStatusMapping(data.order_status);

                        $scope.order.created_at = data.created_at.substring(0, 10);
                        $scope.order.updated_at = data.updated_at.substring(0, 10);

                        $scope.weightSum = getAllItemsWeight(data);
                    })
                    return data;
                }).then(function (data) {
                    InfoService.getWarehouseById(data.package.warehouse_id).then(function (wh){
                        $timeout(function() {
                            $scope.warehouse = wh;
                        })
                    });
                    InfoService.getLogisticPathById(data.logistic_path_id,0).then(function (lp){
                        $timeout(function() {
                            data.logisticPath = lp;
                        })
                    });
                    LogisticService.getLogisticTracks().then(function (lts) {
                        $timeout(function () {
                            $scope.logisticTracks = lts;
                            $scope.ship_status_string = $scope.logisticTracks.filter(function (item) {
                                return item.id == $scope.order.ship_status;
                            })[0].name;
                        })
                    })
                    LogisticService.getLogisticTypes().then(function (lts) {
                        $timeout(function () {
                            $scope.order.package.items.forEach(function (item) {
                                lts.some(function (i) {
                                    if(item.type == i.id){
                                        item.typeName = i.type_name;
                                        return true;
                                    }
                                })
                            })
                        })
                    })
                });
            }
        }
        //确认发货 - 已发货
        function confirmShip () {
            if($scope.order.track_code && $scope.order.track_code_2){
                OrderService.editOrder($scope.order.id, {
                    order_status: 5
                }).then(function() {
                    reload();
                })
            }
            else{
                $scope.isTrackNumEditShown = true;
            }
        }

        function weightAndPack () {
            $scope.isWeightPopupShown = true;
        }

        //确认称重 - 代付款
        function weightAndPackConfirm () {
            if($scope.weight){
                if($scope.order.order_status==1){
                    OrderService.editOrder($scope.order.id, {
                        weight: $scope.weight,
                        order_status: 2,
                    }).then(function() {
                        weightAndPackCancle();
                        reload();
                    })
                }
                else{
                    OrderService.editOrder($scope.order.id, {
                        weight: $scope.weight,
                    }).then(function() {
                        weightAndPackCancle();
                        reload();
                    })
                }
            }
        }

        //打印配货单 - 不该状态 - 引导称重
        function printPackListconfirm () {
            // $window.open($state.href('stateName', {}, {absolute: true}), '_blank');
            $window.localStorage.setItem('printPrepareListData', angular.toJson($scope.order));
            var url = $state.href('printPrepareList');
            var newWindow = $window.open(url,'_blank');
        }
        //打印面单 后 - 代发货
        function printPostListconfirm () {
            if($scope.order_status==3){
                swal({
                    title: "已打印?",
                    text: "若已打印, 请点击确认修改运单状态, 若未打印请点击取消",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    OrderService.editOrder($scope.order.id, {
                        order_status: 4,
                    }).then(function() {
                        reload();
                    })

                    $window.localStorage.setItem('printShipData', angular.toJson($scope.order));
                    var url = $state.href('printShip');
                    var newWindow = $window.open(url,'_blank');
                })
            }
            else{
                    $window.localStorage.setItem('printShipData', angular.toJson($scope.order));
                    var url = $state.href('printShip');
                    var newWindow = $window.open(url,'_blank');
            }
        }
        function weightAndPackCancle () {
            $scope.isWeightPopupShown = false;
            $scope.weight = null;
        }

        function getAllItemsWeight (order) {
            if(angular.isArray(order.items)&&order.items.length>0){
                var weightSum = 0;
                order.items.forEach(function (item) {
                    weightSum = weightSum + item.unit_weight*item.quantity;
                });
                return weightSum;
            }
        }

        function editOrder () {
            //如果填写了跟踪号码 则发货!!!
            if($scope.order.order_status < 5){
                if($scope.order.ship_tracknumber.International || $scope.order.ship_tracknumber.China){
                    $scope.order.order_status = 5;
                }
            }
            OrderService.editOrder($scope.order.id, $scope.order).then(function() {
                reload();
            })
        }
        function deleteOrder () {
            if($scope.order.id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    OrderService.deleteOrder($scope.order.id).then(function(data) {
                        if(data.success===true){
                            swal("删除成功", "", "success");
                            reload();
                        }
                    });
                })
            }
        }
        // function cancleEditOrder () {
        //     $scope.isWeightEditShown = false; 
        //     $scope.isShipStatusEditShown = false;
        //     $scope.isTrackNumEditShown = false;
        // }
        $scope.convertToInt = function(id){
            return parseInt(id, 10);
        };
        $scope.goBack = function(){
            $window.history.back();
        };

        function reload () {
            search();
        }
    }
})();