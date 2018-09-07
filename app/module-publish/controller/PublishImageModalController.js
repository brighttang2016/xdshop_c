/**
 * Created by pujjr on 2017/11/9.
 * 订单加入，模态框控制层
 */
angular.module('com.app.publish.controller')
    .controller('PublishImageModalController', function ($uibModalInstance,item,$scope,$rootScope,PublishService,TlmsRestangular,UtilsService) {
    $scope.item =item;//包含：openId，publishId,isFinish,publishd对象，openId
    //var branchId = item.branchId;
    //var title = item.title;
    //var applyEdit = item.applyEdit;
    console.log($scope.item);

    //图片弹窗初始化
    $scope.initPublishImageModal = function(){
        $scope.userInfo = {};
        // $scope.showUserInfo();

        /**
         * 如果已完成任务，则显示门票兑换信息
         */
        if(item.isFinish){
            $scope.showTicketInfo();
            /**
             * 查询publish 信息
             */
            PublishService.getPublish(item.publishId).then(function(response){
                console.log(response);
                $scope.publish = response.data;
                try{
                    //门票兑换凭证中，显示活动开始、结束时间
                    $scope.publish.timeBegin = UtilsService.dateFormat(new Date($scope.publish.timeBegin),'yyyy-MM-dd');
                    $scope.publish.timeEnd = UtilsService.dateFormat(new Date($scope.publish.timeEnd),'yyyy-MM-dd');
                }catch(e){
                }
            });

            /**
             * 查询user信息
             */
            PublishService.getUserInfo(item.openId).then(function(response){
                $scope.user = response.data;
            });
            return;
        }

        /**
         * 判断是否已生成分享海报
         * 如果已生成：直接显示对应图片
         * 如果未生成，录入姓名、手机号
         */
        PublishService.getPosterOssUrl($scope.item.publishId,$scope.item.openId).then(function(response){
            // console.log("99999999999999999999");
            // console.log(response);
            // console.log(response.data);
            if(response.data == '' ||  response.data == undefined||response == "" || response==undefined){
                $scope.showUserInfo();
            }else{
                $scope.sharePicUrl = response.data;
                $scope.showSharePic();
            }
        });

    };
    $scope.addOk = function () {
        $uibModalInstance.close($scope.currGpsLinkman);
    };

    $scope.addCancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.commitUserInfo = function(){
        $scope.userInfo.openId = $scope.item.openId;
        $scope.userInfo.publishId = $scope.item.publishId;
        $scope.loading = TlmsRestangular.all("/service/publish/share").post($scope.userInfo).then(function(response){
            console.log(response);
            $scope.sharePicUrl = response.data;
            $scope.showSharePic();
        });

    };
    //显示用户信息、隐藏分享图片与门票信息
    $scope.showUserInfo = function(){
        $scope.isShowUserInfo = true;
        $scope.isShowSharePic = false;
        $scope.isShowTicketInfo = false;
    };

    //显示分享图片、隐藏用户信息与门票信息
    $scope.showSharePic = function(){
        $scope.isShowUserInfo = false;
        $scope.isShowSharePic = true;
        $scope.isShowTicketInfo = false;
    };

    //显示门票信息、隐藏分享图片、隐藏用户信息
    $scope.showTicketInfo = function(){
        $scope.isShowUserInfo = false;
        $scope.isShowSharePic = false;
        $scope.isShowTicketInfo = true;
    }


});
