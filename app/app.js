/**
 * Created by pujjr on 2017/7/11.
 */
var app = angular.module('myApp',[
    'ngLocale',
    'templates',
    'ui.router',
    'ngAnimate',
    'toaster',
     'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.router.state.events',
    'ui.bootstrap.modal',
    'ui.bootstrap',
    'ui.load',
    //'ui.jq',//延迟加载jquery构件
    'ui.validate',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'ncy-angular-breadcrumb',
    'ngWebSocket',
    'restangular',
    'cgBusy',
    'com.tang.intercepter',
    'com.tang.controller.MyController1',
    'com.tang.service.XhrService',
    'com.tang.controller.MyController2',
    'com.tang.controller.LoginController',
    'com.tang.directive.LoginDirective',
    //'com.tang.appController',
    'com.tang.controller.RouterController',
    'com.tang.controller.ToasterController',
    'com.app.user',
    'com.app.callcenter',
    'com.tlms.sys.service',
    'com.tlms.sys.controller',
    'com.app.process',
    'com.app.block',
    'com.app.uibootstrap',
    'com.app.websocket',
    'com.app.publish'

]);
app.config(function($httpProvider) {
    $httpProvider.interceptors.push('myInterceptor');
    //console.log($httpProvider.defaults.headers.common);
      //扩充http头
     //$httpProvider.defaults.headers.post['token'] = getCookie('token');
     //$httpProvider.defaults.headers.post['expireTime'] = getCookie('expireTime');
});

app.config(['$locationProvider',function($locationProvider){
    //$locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');
}]);
/*
app.config(function(RestangularProvider){
    RestangularProvider.setRequestInterceptor(function(elem,operation,what){
        console.log("setRequestInterceptor");
        console.log(elem);
        console.log(operation);
        console.log(what);
        elem.time = "200810405234";
    });
});*/

app.factory('TlmsRestangular',function(Restangular, $state, $rootScope,$uibModal,toaster){
    return Restangular.withConfig(function(configurer){
        configurer.setBaseUrl(TLMS_URL);
        configurer.setFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {
            var page = {};
            if (operation == 'getList') {
                page.pageSize = params.pageSize || $rootScope.paginationInfo.pageSize;
                page.curPage = params.curPage || $rootScope.paginationInfo.curPage;
            };
            angular.extend($rootScope.vm,page);
            angular.extend($rootScope.vm, params);
            var newHeaders = {
                'Authorization': $rootScope.Authorization
            };
            angular.extend(newHeaders,headers);
            return {
                headers: newHeaders,
                params:$rootScope.vm
            };
        });
        configurer.setErrorInterceptor(function (response, deferred, responseHandler) {
            // var AuthService = $injector.get('AuthService');
            if (response.status == 401) {
                /*  if (AuthService.isAuth()) {
                      AuthService.reLogin();
                  } else {
                      // modal.error("未授权操作，请重新登陆");
                      $state.go('access.signin');
                  }*/

            }else if(response.status ==404){

            }
            else {
                // modal.error("查询数据错误，请重试！");
            }
            ;
        });
        configurer.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
            if (data.successResponse == false) {
                // modal.error(data.message);
                toaster.pop('error','操作失败：',data.message,10000000000);
                return deferred.reject();
            } else {
                if (operation == 'getList') {
                    if (angular.isArray(data)) {
                        return data;
                    } else {
                        //如果为getList操作返回的不是Array对象则为翻页数据需特殊处理
                        $rootScope.paginationInfo.totalItem = data.totalItem;
                        return data.data;
                    }
                } else {
                    return data;
                }
            }
        });
    });
});

app.factory('PujjrPushRestangular',function(Restangular){
    return Restangular.withConfig(function(configurer){
        configurer.setBaseUrl(PUJJR_PUSH_URL);
    });
});

app.factory('myInterceptor',function($q,CookieService,$state,$rootScope){
    var interceptor = {
        'request':function(config){
            //console.log("request");
            //console.log(config);
            /**
             * 发送请求时，请求消息头headers是json对象
             */
            config.headers['token'] =CookieService.getCookie('token');
            config.headers['expireTime'] =CookieService.getCookie('expireTime');
            return config;
        },
        'response':function(config){
            //console.log('response');
            /*console.log(config);
            console.log(config.headers['token']);
            console.log(config.headers("token"));*/
            /**
             *接收请求时，接收消息头headers是函数
             */
            if(config.status == '200'){

            }else{

            }
            var token = config.headers('token')+'';
            var expireTime = config.headers('expireTime')+'';
            //console.log('token:'+token);
            //console.log('expireTime:'+expireTime);
            //console.log(token == 'null');
            if(token != null && token != undefined && token != '' && token != 'null'){
                CookieService.setCookie('token',token);
            }
            if(expireTime != null && expireTime != undefined && expireTime != '' && token != 'null'){
                CookieService.setCookie('expireTime',expireTime);
            }
            return config;
        }
    };
    return interceptor;

});

app.run(['$rootScope',function($rootScope){
    console.log("run***********************");
    /**
     * 状态改变监听
     */
    $rootScope.previousState;
    $rootScope.currentState;
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
        console.log('Previous state:'+$rootScope.previousState);
        console.log('Current state:'+$rootScope.currentState);
    });
}]);


app.config(['WebsocketServiceProvider',function(WebsocketServiceProvider){
    WebsocketServiceProvider.setWebSocketUrl(SERVER_URL.PJ_WS_URI);
}]);

app.config(['MessagePushServiceProvider',function(MessagePushServiceProvider){
    MessagePushServiceProvider.setWebSocketUrl(SERVER_URL.PJ_PUSH_URI);
}]);





