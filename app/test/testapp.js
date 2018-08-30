/**
 * Created by pujjr on 2017/7/11.
 */
var app = angular.module('testApp',[
    'ui.router',
    'toaster',
    'ngAnimate',
    // 'cgBusy',
    'com.testapp.controller'
]) .config(
    [ '$stateProvider', '$urlRouterProvider',
        function ($stateProvider,   $urlRouterProvider) {
            $stateProvider
                .state('start', {
                    //abstract: true,
                    url: '/start',
                    template: '12345'
                })
                .state('/start/test', {
                    //abstract: true,
                    url: '/test',
                    template: '89898'
                })
        }
    ]
).run(
    [ '$rootScope', '$state', '$stateParams',
        function ($rootScope,$state,$stateParams) {
            console.log("*************myApp run 开始****************************");

            //注册路由变更成功处理方法
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                console.log("$stateChangeSuccess");
                console.log(event);
                console.log(toState);
                console.log(toParams);
                console.log(fromState);
                console.log(fromParams);
            });
            console.log("*************myApp run 借宿****************************");
        }
    ]
);






