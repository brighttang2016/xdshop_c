/**
 * Created by pujjr on 2017/11/9.
 * 订单加入，模态框控制层
 */
angular.module('com.app.publish.controller')
    .controller('PublishImageModalController', function ($uibModalInstance,item,$scope,$rootScope,PublishService) {
    $scope.item =item;
    //var branchId = item.branchId;
    //var title = item.title;
    //var applyEdit = item.applyEdit;
    //
    $scope.initPublishImageModal = function(){
        $scope.userInfo = {};
    };
    $scope.addOk = function () {
        $uibModalInstance.close($scope.currGpsLinkman);
    };

    $scope.addCancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.commitMobile = function(){
        $scope.userInfo.openId = $scope.item.openId;

    }
});
