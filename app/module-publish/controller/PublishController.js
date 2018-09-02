/**
 * Created by pujjr on 2017/7/26.
 */
angular.module('com.app.publish.controller')
    .controller('PublishController',['$scope','$rootScope','$state','PublishService','$compile','toaster','$stateParams','$uibModal','CookieService','$window','CkeditorService','$timeout','ArticleService','DomService',
        function($scope,$rootScope,$state,PublishService,$compile,toaster,$stateParams,$uibModal,CookieService,$window,CkeditorService,$timeout,ArticleService,DomService){
        // console.log("11111111111111111111111");
        // console.log($stateParams);
       /* CKEDITOR.replace( 'scenicDesc' );
        CKEDITOR.replace( 'publishRule');*/
        $scope.publish = {};
        $scope.article = {};
        $scope.publish.id = $stateParams.id;
        $scope.currItem = {};
        //新增发布，初始化
        $scope.initPublishAdd = function(){
            PublishService.initPublish().then(function(response){
                console.log(response);
                $scope.publish = response.data;
            });
        };

        //编辑发布，初始化
        $scope.initPublishEdit = function(){
            ArticleService.getArticle($stateParams.id).then(function(response){
                $scope.article = response.data;
            });

            PublishService.getPublish($stateParams.id).then(function(response){
                $scope.publish = response.data;
                //编辑器赋值
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
        //打开关闭openFlag
        $scope.openPublish = function(item){
            if(item.openFlag){
                item.openFlag = false;
            }else{
                item.openFlag = true;
            }
            PublishService.savePublish(item).then(function(response){
                if(response.successResponse == true){
                    toaster.pop('success', '操作提醒', '操作成功');
                }else{
                    toaster.pop('error', '操作提醒', '操作失败');
                }
            });
        };

        //初始化发布展示页内容
        $scope.initPublishShow = function(){
            //获取参数
            var openId = $stateParams.openId;
            var Authorization = $stateParams.Authorization;
            var publishId = $stateParams.publishId;
            //true：预览模式；false：非预览模式
            $scope.isPreview = CookieService.getCookie("isPreview");
            CookieService.setCookie('Authorization',Authorization);
            /**
             * 获取发布信息
             */
            PublishService.getPublish(publishId).then(function(response){
                $scope.publish = response.data;
                $scope.starArray = [];
                //星级处理
                var starNum =  $scope.publish.starNum;
                //小数判定
                var patrn = /^\d+(\.\d+){1}$/;
                //总星数
                var starTotal = 0;
                if(patrn.test(starNum)){
                    //小数
                    starTotal = Math.ceil(starNum);
                    for(var i = 0;i < starTotal - 1;i ++){
                        $scope.starArray.push({"starType":"fa-star"});
                    }
                    $scope.starArray.push({"starType":"fa-star-half-full"});
                }else{
                    //整数
                    starTotal = starNum;
                    for(var i = 0;i < starTotal;i ++){
                        $scope.starArray.push({"starType":"fa-star"});
                    }
                }
                DomService.appendRichText('publishRule',$scope.publish.publishRule);
                DomService.appendRichText('scenicDesc',$scope.publish.scenicDesc);
            });
        };

        //初始化发布列表
        $scope.initPublishList = function(){
            $rootScope.resetPage();
            $scope.loading = PublishService.getPublishList().then(function(response){
                $scope.publishList = response;
            });
        };

        //保存发布
        $scope.savePublish = function(){
            $scope.publish.publishRule =  CKEDITOR.instances.publishRule.getData();
            $scope.publish.scenicDesc =  CKEDITOR.instances.scenicDesc.getData();
            $scope.article.publishId = $scope.publish.id;
            $scope.publish.article =  $scope.article;
            $scope.loading = PublishService.savePublish($scope.publish).then(function(response){
                if(response.successResponse == true){
                    toaster.pop('success', '操作提醒', '增加成功');
                    $rootScope.back();
                }else{
                    toaster.pop('error', '操作提醒', '新增失败');
                }
            });
        };


       /* $scope.getRichText = function(){
            var richText = CKEDITOR.instances.editor1.getData();
            var mobileIcon=richText;
            var richTextDom = angular.element(mobileIcon);
            var richTextElement = $compile(mobileIcon)($scope);

            var  richTextScanDom = angular.element(document.getElementById("richTextScan"));
            richTextScanDom.children().remove();
            richTextScanDom.append(richTextDom);

        };*/

        $scope.queryList = function(){
            console.log("queryList");
            $scope.loading = PublishService.getPublishList().then(function(response){
                console.log(response);
                $scope.publishList = response
            });
        };

        //获取分享图片给好友
        $scope.publishShare = function(){
            var item = {};
            item.openId = $stateParams.openId;
            item.publishId = $stateParams.publishId;
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
                PublishService.queryPublishResource(result.typeCode,result.publishId).then(function(response){
                    // console.log(response);
                    $scope.publishResourceList = response.data;
                });
            }, function (result) {
                // console.log("取消");
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
        $scope.preViewPublish = function(publishId){
            var stateParams = {};
            stateParams.openId = "";
            stateParams.Authorization = CookieService.getCookie("Authorization");
            // $state.transitionTo('publishshow',stateParams);
            //本机预览测试
            var publishShowUrl = "http://localhost:9020/xdshop_c/dist/index_publish.html?_ijt=ojcbtgbgkgtu5q1ln6mstttpnv#/publishshow/oXmQ_1ddd8Yq4C_oAhq_OiMG181c/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjoiYWRtaW4iLCJpYXQiOjE1MzU4MTcxNTF9.hmszfiLDY8MZKbjYtJ_clhYlVRp75Ovt0q48wQGpsXI/"+publishId;
            window.open(publishShowUrl);
        };

    }]);
