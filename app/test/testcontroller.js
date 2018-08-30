/**
 * Created by pujjr on 2017/7/26.
 */

angular.module('main', ['toaster', 'ngAnimate','cgBusy'])
    .controller('myController',
    function($scope, toaster,$http) {
    $scope.pop = function(){
        alert("pop");
        toaster.pop('success', "title", "text");
    };
    $scope.loading = $http({
        method: 'GET',
        url: 'http://www.runoob.com/angularjs/angularjs-http.html'
    }).then(function successCallback(response) {
        // 请求成功执行代码
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
});

/*angular.module('com.testapp.controller',['toaster'])
    .controller('testcontroller',['$scope','$rootScope','$state','toaster',
        function($scope,$rootScope,$state,toaster){
            $scope.jumToAdd = function(){
                // alert("ttttttt");
                toaster.pop('info', '操作提醒', '新增失败');

                // toastr.success("祝贺你成功了");
                // toaster.pop(1, 2, 3, 4, 'trustedHtml', "33", 11);
                $state.go("/start/test");
            };

           /!* $scope.$on('$stateChangeStart',function(evt,toState,toParams,fromState,fromParams){
                console.log("装填qqihip");
                evt.preventDefault();
            });*!/

        }]);*/
