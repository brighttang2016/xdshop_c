/**
 * Created by pujjr on 2017/7/26.
 */
angular.module('com.app.publish.controller')
    .controller('PublishController',['$scope','$rootScope','$state','PublishService','$compile','toaster','$stateParams','$uibModal','CookieService',
        function($scope,$rootScope,$state,PublishService,$compile,toaster,$stateParams,$uibModal,CookieService){
        // console.log("11111111111111111111111");
            // console.log($stateParams);
        $scope.publish = {};
        $scope.jumToAdd = function(){
            $state.go("app.publish.add");
        };
        $scope.initPublishShow = function(){
            console.log("初始化发布展示页内容");

            var token = $stateParams.token;
            console.log(token);
        };

        $scope.initPublishList = function(){
            console.log("initPublishList");
            $rootScope.resetPage();
            $scope.loading = PublishService.getPublishList().then(function(response){
                console.log(response);
                $scope.publishList = response
            });
        };

        //新增发布
        $scope.addPublish = function(){
            // $scope.publish.publishRule =  CKEDITOR.instances.publishRule.getData();
            // $scope.publish.scenicDesc =  CKEDITOR.instances.scenicDesc.getData();
            PublishService.addPublish($scope.publish).then(function(response){
                if(response.successResponse == true){
                    toaster.pop('success', '操作提醒', '增加成功');
                    $rootScope.back();
                }else{
                    toaster.pop('error', '操作提醒', '新增失败');
                }
            });
        };
        //预览
        $scope.preViewPublish = function(){

        };


        $scope.getRichText = function(){
            var richText = CKEDITOR.instances.editor1.getData();
            // CKEDITOR.instances.editor1.setData("111111111111");
           console.log("富文本：");
           console.log(richText);
            var mobileIcon=richText;
            var richTextDom = angular.element(mobileIcon);
            var richTextElement = $compile(mobileIcon)($scope);
            console.log(richTextElement);
            console.log(angular.element(document.getElementById("richTextScan")));
            console.log(angular.element("#richTextScan"));

            var  richTextScanDom = angular.element(document.getElementById("richTextScan"));
            console.log(richTextScanDom);
            richTextScanDom.children().remove();
            richTextScanDom.append(richTextDom);

        };

        $scope.queryList = function(){
            console.log("queryList");
            $scope.loading = PublishService.getPublishList().then(function(response){
                console.log(response);
                $scope.publishList = response
            });
        };


/*        $scope.totalItems = 64;
        $scope.currentPage = 4;*/

      /*  $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };*/

        /*$scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
        };*/
/*
        $scope.maxSize = 5;
        $scope.bigTotalItems = 175;
        $scope.bigCurrentPage = 1;
*/
        $scope.publishShare = function(){
            CookieService.setCookie("")
            var item = {};
            item.openId = $stateParams.openId;
            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/module-publish/tpl/publish-image-modal.html',
                controller: 'PublishImageModalController',
                // controllerAs: '$ctrl',
                size: 'lg',
                //appendTo: parentElem,
                backdrop:'static',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (currGpsLinkman) {

            }, function (result) {
                console.log("取消");
            });
        };




    }]);
