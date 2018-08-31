/**
 * Created by pujjr on 2017/7/11.
 */
var publishShowApp = angular.module('publishShowApp',[
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
    'com.app.publish'

]);
publishShowApp.config(function($httpProvider) {
    // $httpProvider.interceptors.push('myInterceptor');
    //console.log($httpProvider.defaults.headers.common);
      //扩充http头
     //$httpProvider.defaults.headers.post['token'] = getCookie('token');
     //$httpProvider.defaults.headers.post['expireTime'] = getCookie('expireTime');
});

publishShowApp.config(['$locationProvider',function($locationProvider){
    //$locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');
}]);


publishShowApp.factory('TlmsRestangular',function(Restangular, $state, $rootScope,$uibModal,toaster){
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









