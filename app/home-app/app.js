'use strict';
;(function () {


	angular.module('home',  ['home.controllers','home.services','home.directives' , 'ngAnimate', 'ui.router', 'angular-loading-bar'])
	.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', '$httpProvider',
        function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, $httpProvider) {
        cfpLoadingBarProvider.includeSpinner = true;

	    $urlRouterProvider.otherwise('/');

	    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'templates/index.html',
            controller: 'IndexCtrl',
        })
        .state('stockList', {
            url: '/stockList/:status',
            templateUrl: 'templates/stockList.html',
            controller: 'StockListCtrl',
        })
        //deprecated
        // .state('stockSubmit', {
        //     url: '/stock/submit?stockId',
        //     templateUrl: 'templates/stockSubmit.html',
        //     controller: 'StockSubmitCtrl',
        // })
        // .state('stockConfirm', {
        //     url: '/stock/submit/confirm',
        //     templateUrl: 'templates/stockSubmit.html',
        //     controller: 'StockSubmitCtrl',
        // })
        .state('stockDetail', {
            url: '/stock/:stockId',
            templateUrl: 'templates/stockDetail.html',
            controller: 'StockDetailCtrl',
        })
// TODO: Home ProblemDetail
				.state('problemDetail', {
						url: '/problemDetail',
						templateUrl: 'templates/problemDetail.html',
						controller: '',
				})
				.state('problemList', {
						url: '/problemList',
						templateUrl: 'templates/problemList.html',
						controller: '',
				})

		.state('packageClaim',{
			url:'/packageClaim',
			templateUrl:'templates/packageClaim.html',
			controller: 'PackageClaim',
		})

        .state('orderList', {
            url: '/orderList/:status',
            templateUrl: 'templates/orderList.html',
            controller: 'OrderListCtrl',
        })
        .state('orderSubmit', {
            url: '/order/submit/:orderId',
            templateUrl: 'templates/orderSubmit.html',
            controller: 'OrderSubmitCtrl',
        })
        .state('orderDetail', {
            url: '/order/:orderId',
            templateUrl: 'templates/orderDetail.html',
            controller: 'OrderDetailCtrl',
        })

        .state('transSubmit', {
            url: '/trans/submit/:transId',
            templateUrl: 'templates/transSubmit.html',
            controller: 'TransSubmitCtrl',
        })
        .state('transList', {
            url: '/transList/:status',
            templateUrl: 'templates/transList.html',
            controller: 'TransListCtrl',
        })
        .state('transDetail', {
            url: '/trans/:transId',
            templateUrl: 'templates/transDetail.html',
            controller: 'TransDetailCtrl',
        })

        // 代刷页面
        .state('vorkasseSubmit', {
            url: '/vorkasseSubmit',
            templateUrl: 'templates/vorkasseSubmit.html',
            controller: 'VorkasseSubmitCtrl',
        })
        .state('vorkasseDetail', {
            url: '/vorkasseDetail/:id',
            templateUrl: 'templates/vorkasseDetail.html',
            controller: 'VorkasseDetailCtrl',
        })
        .state('vorkasseList', {
            url: '/vorkasseList',
            templateUrl: 'templates/vorkasseList.html',
            controller: 'VorkasseListCtrl',
        })
        .state('addressManage', {
            url: '/profile/addressManage',
            templateUrl: 'templates/profile/addressManage.html',
            controller: 'AddressManageCtrl',
        })
        .state('personalInfo', {
            url: '/profile/personalInfo',
            templateUrl: 'templates/profile/personalInfo.html',
            controller: 'PersonalInfoCtrl',
        })
        .state('changePassword', {
            url: '/profile/changePassword',
            templateUrl: 'templates/profile/changePassword.html',
            controller: 'ChangePassword',
        })
        .state('refill', {
            url: '/financial/refill',
            templateUrl: 'templates/financial/refill.html',
            controller: 'Refill',
        })
        .state('refund', {
            url: '/financial/refund',
            templateUrl: 'templates/financial/refund.html',
            controller: '',
        })
        .state('financialRecord',{
            url: '/financial/record',
            templateUrl: 'templates/financial/finance.html',
            controller: 'FinancialRecordCtrl',
        })
        .state('credits',{
            url: '/manage/credits',
            templateUrl: 'templates/financial/credits.html',
            controller: '',
        })

        .state('notificationList', {
            url: '/message/notification',
            templateUrl: 'templates/notification/notification.html',
            controller: 'NotificationCtrl',
        })
        .state('conversationList', {
            url: '/message/conversation',
            templateUrl: 'templates/notification/notification.html',
            controller: 'NotificationCtrl',
        })
        .state('contact',{
            url: '/contact',
            templateUrl: 'templates/notification/notification.html',
            controller: 'NotificationCtrl',
        })
        .state('conversation',{
            url: '/conversation/:id',
            templateUrl: 'templates/notification/conversation.html',
            controller: 'ConversationCtrl',
        })


               // Error Http Interceptors
        $httpProvider.interceptors.push(function() {
          return {
            'response': function(response) {
                if(response.data.success===false){
                    swal(response.data.message, "", "error");
                    return null;
                }
                return response;
            },
           'responseError': function(response) {
                if (response.status==404) {
                    swal(response.data.message, "", "error");
                    return null;
                }
                else if (response.status==500) {
                    swal("服务器错误", "", "error");
                    return null;
                }
                else if (response.status==401) {
                    // swal("未登录, 请先登录", "", "error");
										swal({
											title: "未登录, 请先登录",
											type: "error",
										}, function() {
											location.href = '/auth/login'
										});
                    return null;
                }else{
                    swal("未知错误", "", "error");
                    return null;
                }
            }

          };
        });

	}])
    .run(['$state', '$injector', function($state, $injector){
        // var isUserInfoRendered = $injector.has('UserInfo');
        // if(isUserInfoRendered===false){
        //     window.location.href = '/auth/login'
        // }
    }]);

    //Default Configuration of App
    angular.module('home').constant('AppConfig', {
        apiUrl: '/api',
    });

})();
