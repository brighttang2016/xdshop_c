/**
 * Created by pujjr on 2017/11/9.
 * 订单加入，模态框控制层
 */
angular.module('com.app.publish.controller')
    .controller('PublishImageModalController', function ($uibModalInstance,item,$scope,$rootScope,PublishService,TlmsRestangular) {
    $scope.item =item;//包含：openId，publishId
    //var branchId = item.branchId;
    //var title = item.title;
    //var applyEdit = item.applyEdit;
    //
    $scope.initPublishImageModal = function(){
        $scope.userInfo = {};
        $scope.showUserInfo();
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
    //显示用户信息、隐藏分享图片
    $scope.showUserInfo = function(){
        $scope.isShowUserInfo = true;
        $scope.isShowSharePic = false;
    };

    //显示分享图片、隐藏用户信息
    $scope.showSharePic = function(){
        $scope.isShowUserInfo = false;
        $scope.isShowSharePic = true;
    }
});
