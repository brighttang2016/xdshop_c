/**
 * Created by pujjr on 2017/11/22.
 * 库存管理控制层-潽金库存-新增模态框
 */
angular.module('pu.loanqueryicbc.controllers')
    .controller('IcbcBillUploadController',function(modal,toaster,$scope,$state,$uibModal,$uibModalInstance,FileUploader,$rootScope,GpsPubService,$timeout){
        $scope.uploader = new FileUploader({
            url:SERVER_URL.API_SERVER_URL +"/loanqueryicbc/impIcbcBillFile?operater="+$rootScope.account.accountId,
            headers: {
                'Authorization': $rootScope.Authorization
            },
            formData: [{
                operater: $rootScope.account.accountId
            }],
            queueLimit:1
        });

        $scope.initIcbcBillUpload = function(){
            $scope.fileInfo = "";
            $scope.isShowOkBtn = false;
            $scope.isDisabledOkBtn = false;
        };

        $scope.doUpload = function(currFile){
            currFile.upload();
        };

        $scope.uploader.onSuccessItem = function(item, response, status, headers){
            if(response.successResponse == false){
                $scope.setUploadResultMsg("导入失败："+response.message);
                $scope.msgIconClass = "fa  fa-exclamation text-danger";
            }else{
                $scope.setUploadResultMsg("数据处理完成，总记录："+response.totalNum+"，新增记录："+response.insertNum+"，更新记录："+response.updNum);
                $scope.msgIconClass = "fa fa-check text-success";
                // console.log($scope.uploader.queue.length);
            }
            $scope.isDisabledOkBtn = false;
        };

        $scope.uploader.onErrorItem = function(item, response, status, headers){
            $uibModalInstance.dismiss('文件解析异常');
            modal.info("操作结果",response.message);
        };

        $scope.uploader.onProgressItem = function(item, progress){
            item._file.progress = progress;
        };

        $scope.uploader.onAfterAddingAll = function(){

        };

        $scope.uploader.onAfterAddingFile = function(fileItem){
            $scope.fileItem = fileItem;
            fileItem._file.progress = 0;
            fileItem._file.fileSize = Math.round(fileItem._file.size/1024,0) + "kb";
            console.log(fileItem._file);
        };

        $scope.clearFileQueue = function(){
            $scope.uploader.clearQueue();
        };

        $scope.addOk = function () {
            $scope.setUploadResultMsg("");
            var fileQueue = $scope.uploader.queue;
            if(fileQueue.length > 0){
                for(var i = 0;i < fileQueue.length;i++){
                    var currFile = fileQueue[i];
                    currFile.formData = {"userName":"test"};
                    $scope.doUpload(currFile);
                }
                $scope.setUploadResultMsg("数据处理中，请稍后...");
                $scope.isDisabledOkBtn = true;
                $scope.msgIconClass = "fa fa-cog fa-spin fa-1x fa-fw";
            }else{
                $scope.setUploadResultMsg("未选择待上传文件，请选择待上传的文件");
            }
        };

        $scope.addCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.addClose = function () {
            $uibModalInstance.close('close');
        };


        $scope.$watch('uploader.queue.length',function(n,o){
            if(n == 0){
                $scope.isShowOkBtn = false;
            }else{
                $scope.isShowOkBtn = true;
            }
        },true);

        $scope.deletePreUpload = function(fileItem){
            fileItem.remove();
            $scope.setUploadResultMsg("");

        };

        $scope.setUploadResultMsg = function(msg) {
            $scope.uploadResultMsg = msg;
            if(msg == ""){
                $scope.isShowUpdResultMsg = false;
            }else{
                $scope.isShowUpdResultMsg = true;
            }

        };

        $scope.uploader.filters.push({
            name:"icbcBillUploadFilter",
            fn:function(item,options){
                var suffix =   item.name.substring(item.name.lastIndexOf(".") + 1, item.name.length);
                return suffix == 'xls' || suffix == 'xlsx' ? true : false;
            }
        });
    });


