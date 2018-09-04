/**
 * Created by pujjr on 2017/7/26.
 */
angular.module('com.app.customer.controller')
    .controller('CustomerController',function($scope,$rootScope,$state,$compile,toaster,$stateParams,$uibModal,CookieService,$window,CustomerService){

        $scope.getPublishList = function(){
            $scope.loading =  CustomerService.getPublishUserList().then(function(response){
                $scope.publishUserList =response;
            });
        };

        //领取
        $scope.fetch = function(item){
            CustomerService.fetch(item.publishId,item.openId).then(function(response){
                if(response.successResponse == true){
                    toaster.pop('success', '操作提醒', '操作成功');
                    $scope.getPublishList();
                }else{
                    toaster.pop('error', '操作提醒', '操作失败');
                }
            });
        };

        //取消领取
        $scope.unfetch = function(item){
            CustomerService.unfetch(item.publishId,item.openId).then(function(response){
                if(response.successResponse == true){
                    toaster.pop('success', '操作提醒', '操作成功');
                    $scope.getPublishList();
                }else{
                    toaster.pop('error', '操作提醒', '操作失败');
                }
            });
        };



    });
