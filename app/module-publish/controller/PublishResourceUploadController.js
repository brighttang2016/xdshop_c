/**
 * Created by pujjr on 2017/11/22.
 * 库存管理控制层-潽金库存-新增模态框
 */
angular.module('com.app.publish.controller')
    .controller('PublishResourceUploadController',function(item,toaster,$scope,$state,$uibModal,$uibModalInstance,FileUploader,$rootScope,$timeout){
        // console.log("文件上传5555555555555555555555");
        // console.log(item);
        //上传成功数
        $scope.successUploadCnt = 0;
        if(item.publishId == undefined){
            item.publishId = "";
        }
        $scope.uploader = new FileUploader({
            url:SERVER_URL.API_SERVER_URL +"/publish/uploadResource?typeCode="+item.typeCode+"&publishId="+item.publishId,
            headers: {
                'Authorization': $rootScope.Authorization
            },
            formData: [{
                typeCode:item.typeCode,
                publishId:item.publishId
            }]/*,
            queueLimit:1*/
        });

        $scope.initResourceUpload = function(){
            $scope.fileInfo = "";
            $scope.isShowOkBtn = false;
            $scope.isDisabledOkBtn = false;
        };

        $scope.doUpload = function(currFile){
            console.log("文件上传：");
            console.log(currFile);
            currFile.upload();
        };

        $scope.uploader.onSuccessItem = function(item, response, status, headers){
            if(response.successResponse == false){
                $scope.setUploadResultMsg("上传失败："+response.message);
                $scope.msgIconClass = "fa  fa-exclamation text-danger";
            }else{
                $scope.successUploadCnt = $scope.successUploadCnt + 1;
            }
            if( $scope.successUploadCnt == $scope.uploader.queue.length){
                $scope.setUploadResultMsg("所有文件数据处理成功");
                $scope.msgIconClass = "fa fa-check text-success";
                $scope.isDisabledOkBtn = false;
                //关闭上传图片弹窗
                $scope.addClose();
            }
        };

        $scope.uploader.onErrorItem = function(item, response, status, headers){
            $uibModalInstance.dismiss('文件解析异常');
            // modal.info("操作结果",response.message);
        };

        $scope.uploader.onProgressItem = function(item, progress){
            item._file.progress = progress;
        };

        $scope.uploader.onAfterAddingAll = function(){
            console.log("********onAfterAddingAll*****************");
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
            var result = {};
            result.typeCode = item.typeCode;
            result.publishId =  item.publishId;
            $uibModalInstance.close(result);
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
                return suffix == 'jpg' || suffix == 'png' || suffix == 'gif' || suffix == '*' ? true : false;
            }
        });
    });


