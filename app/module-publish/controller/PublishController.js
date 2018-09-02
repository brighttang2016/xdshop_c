/**
 * Created by pujjr on 2017/7/26.
 */
angular.module('com.app.publish.controller')
    .controller('PublishController',['$scope','$rootScope','$state','PublishService','$compile','toaster','$stateParams','$uibModal','CookieService','$window','CkeditorService','$timeout',
        function($scope,$rootScope,$state,PublishService,$compile,toaster,$stateParams,$uibModal,CookieService,$window,CkeditorService,$timeout){
        // console.log("11111111111111111111111");
        // console.log($stateParams);
       /* CKEDITOR.replace( 'scenicDesc' );
        CKEDITOR.replace( 'publishRule');*/
        $scope.publish = {};
        $scope.publish.id = $stateParams.id;
        $scope.currItem = {};
        //新增发布，初始化
        $scope.initPublishAdd = function(){
            PublishService.initPublish().then(function(response){
                console.log(response);
                $scope.publish = response.data;
            });
        };


        $scope.updateCkeditor = function(ckEditorId,updateHtml){

            if(CKEDITOR.instances[ckEditorId]){//如果CKEDITOR已经创建存在则执行destroy
                CKEDITOR.instances[ckEditorId].destroy();
            }
            CKEDITOR.replace(ckEditorId);
            CKEDITOR.instances[ckEditorId].setData(updateHtml);
        };
        //编辑发布，初始化
        $scope.initPublishEdit = function(){
            // console.log("5555555555555555555");
            // console.log( $scope.publish);
            // $scope.publish.id = $stateParams.id;

            // CKEDITOR.instances.publishRule.setData("<div style='border:1px solid red'>11111111</div>");
            // CkeditorService.initXdshopCkeditor("publishRule","请录入规则",300);
            PublishService.getPublish($stateParams.id).then(function(response){
                console.log("5555555555555555555");
                console.log(response);
                $scope.publish = response.data;
                //可以实现更新
                console.log(CKEDITOR.instances);
                console.log(CKEDITOR.instances.publishRule);
                var test = 'publishRule';
                console.log(CKEDITOR.instances[test]);

                CkeditorService.updateCkeditor('publishRule',$scope.publish.publishRule);
                CkeditorService.updateCkeditor('scenicDesc',$scope.publish.scenicDesc);
                /*if(CKEDITOR.instances.publishRule){//如果CKEDITOR已经创建存在则执行destroy
                    CKEDITOR.instances.publishRule.destroy();
                }
                CKEDITOR.replace( 'publishRule');
                CKEDITOR.instances.publishRule.setData( $scope.publish.publishRule);

                if(CKEDITOR.instances.scenicDesc){//如果CKEDITOR已经创建存在则执行destroy
                    CKEDITOR.instances.scenicDesc.destroy();
                }
                CKEDITOR.replace( 'scenicDesc');
                CKEDITOR.instances.scenicDesc.setData( $scope.publish.scenicDesc);*/

              /*  var editorElement = CKEDITOR.document.getById( 'publishRule' );
                editorElement.setHtml($scope.publish.publishRule);*/

                /*console.log(CKEDITOR.instances.publishRule ); //①
                if(CKEDITOR.instances.publishRule){//如果CKEDITOR已经创建存在则执行destroy
                    CKEDITOR.instances.publishRule.destroy();
                }

                console.log(CKEDITOR.instances.publishRule);  //②
                var ckeditor=CKEDITOR.replace("<div style='border:1px solid red'>1111</div>");//保持始终创建新的CKEDITOR
                console.log(CKEDITOR.instances.publishRule);  //③
                CKEDITOR.replace( 'publishRule');
*/
              /*  $timeout(function(){
                    console.log("66666666666666666666666666666");
                    CkeditorService.updateXdshopCkeditor("publishRule","66666666666666666666666");
                },2000)*/

                // CKEDITOR.instances.publishRule.setData($scope.publish.publishRule);
                // CKEDITOR.instances.scenicDesc.setData($scope.publish.scenicDesc);
                /*CKEDITOR.instances.publishRule.destroy();
                CKEDITOR.instances.scenicDesc.destroy();
                var publishRuleElement = CKEDITOR.document.getById( 'publishRule' );
                var scenicDescElement = CKEDITOR.document.getById( 'scenicDesc' );
                publishRuleElement.setHtml($scope.publish.publishRule);
                scenicDescElement.setHtml($scope.publish.scenicDesc);
                CKEDITOR.document.getById( 'editor' );

                CKEDITOR.instances.publishRule.updateElement();
                CKEDITOR.instances.scenicDesc.updateElement();*/




                //查询图片资源
                var typeCode = "01";
                PublishService.queryPublishResource(typeCode,$scope.publish.id).then(function(response){
                    // console.log("获取资源");
                    // console.log(response);
                    $scope.publishResourceList = response.data;
                },function(response){

                });
            },function(response){

            });
        };

        $scope.jumToAdd = function(){
            $state.go("app.publish.add");
        };

        $scope.publishEdit = function(item){
            $state.transitionTo("app.publish.edit",{"id":item.id});
        };

        $scope.initPublishShow = function(){
            console.log("初始化发布展示页内容");
            console.log($stateParams);
            //获取参数
            var openId = $stateParams.openId;
            var Authorization = $stateParams.Authorization;
            var publishId = $stateParams.publishId;
            //true：预览模式；false：非预览模式
            $scope.isPreview = CookieService.getCookie("isPreview");
            // console.log(8888888888888888888888888888888888888);
            CookieService.setCookie('Authorization',Authorization);

            /**
             * 获取活动介绍代码
             */

            /**
             * 获取景区介绍代码
             */

        };

        //初始化发布列表
        $scope.initPublishList = function(){
            // console.log("initPublishList");
            $rootScope.resetPage();
            $scope.loading = PublishService.getPublishList().then(function(response){
                // console.log(response);
                $scope.publishList = response;
            });
        };

        //保存发布
        $scope.savePublish = function(){
            // console.log("11111111111111111111111111111111111111");
            // console.log($scope.publish);
            $scope.publish.publishRule =  CKEDITOR.instances.publishRule.getData();
            $scope.publish.scenicDesc =  CKEDITOR.instances.scenicDesc.getData();
            $scope.loading = PublishService.savePublish($scope.publish).then(function(response){
                if(response.successResponse == true){
                    toaster.pop('success', '操作提醒', '增加成功');
                    // $rootScope.back();
                }else{
                    toaster.pop('error', '操作提醒', '新增失败');
                }
            });
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
        //获取分享图片
        $scope.publishShare = function(){
            // CookieService.setCookie("")
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

        /**
         * 上传资源
         */
        $scope.uploadResource = function(typeCode){
            var item = {};
            var  publish = $scope.publish;
            console.log($scope.publish);
            item.typeCode = typeCode;
            item.publishId = $scope.publish.id;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/module-publish/tpl/publish-resource-upload.html',
                controller: 'PublishResourceUploadController',
                backdrop:'static',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                //根据typeCode和publishId，刷新所上传的图片
                // console.log("555555555555555555555555555555上传完成");
                // console.log(result);
                PublishService.queryPublishResource(result.typeCode,result.publishId).then(function(response){
                    console.log(response);
                    $scope.publishResourceList = response.data;
                });
            }, function (result) {
                console.log("取消");
            });
        };

        $scope.getItemUrl = function(url){
            toaster.pop('success', '操作提醒', 'URL地址已复制到粘贴板');
            console.log(url);
            $scope.currItem.url = url;
            var clipboard = new ClipboardJS('.btn');

            clipboard.on('success', function(e) {
                // console.info('Action:', e.action);
                // console.info('Text:', e.text);
                // console.info('Trigger:', e.trigger);

                e.clearSelection();
            });
            clipboard.on('error', function(e) {
                // console.error('Action:', e.action);
                // console.error('Trigger:', e.trigger);
            });
        };
        //发布活动编辑页面，预览发布
        $scope.preViewPublish = function(){
            var stateParams = {};
            stateParams.openId = "";
            stateParams.Authorization = CookieService.getCookie("Authorization");
            // $state.transitionTo('publishshow',stateParams);
            //本机预览测试
            var publishShowUrl = "http://localhost:9020/xdshop_c/dist/index_publish.html?_ijt=ojcbtgbgkgtu5q1ln6mstttpnv#/publishshow/oXmQ_1ddd8Yq4C_oAhq_OiMG181c/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjoiYWRtaW4iLCJpYXQiOjE1MzU4MTcxNTF9.hmszfiLDY8MZKbjYtJ_clhYlVRp75Ovt0q48wQGpsXI/1d9e7251baf793b9";
            window.open(publishShowUrl);
        };

    }]);
