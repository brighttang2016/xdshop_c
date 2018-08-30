'use strict';

/* Controllers */
// signin controllers
angular.module("pu.loanqueryicbc.controllers")
    .controller('LoanQueryIcbcController',function ($scope, $rootScope, $state,$stateParams, toaster, $uibModal,LoanQueryIcbcService,PublicRepayService,SettleService,AlterRepayDateService,RefundService,modal,TaskService,
                                                RemissionService,ExtendPeriodService,OtherFeeService,CollectionService,AlterCustInfoService,InsManageService,TelInterviewService,SmsService,ProductService,SysDictService,
                                                OfferService,ApplyService,SysBranchService,CarDisposeService,SmsSignService,CallCenterServicePlus,$window) {
        $scope.initIcbcLoanQueryList = function(){
            $scope.productList = ProductService.queryAllProductList().$object;
            $scope.repayStatusList = SysDictService.queryDictDataByTypeCode("hkzt").$object;
            $scope.loading = LoanQueryIcbcService.getLoanCustList().then(function(response){
                $scope.loanCustList = response;
                $scope.formateDate($scope.loanCustList);

            });
            $scope.branchList = SysBranchService.getEffectDealerList().$object;
        };
        $scope.formateDate = function(loanCustList){
            // console.log("555555555555555");
            // console.log(loanCustList);
            for(var i = 0;i < loanCustList.length;i++){
                // console.log(i);
                // var tempRow = loanCustList.get(i);
                // console.log(loanCustList[i].installmentDate);
                // console.log(CallCenterServicePlus.dateFormat(new Date(loanCustList.get(i).installmentDate),"yyyy-MM-dd"));
                loanCustList[i].installmentDate = CallCenterServicePlus.dateFormat(new Date(loanCustList[i].installmentDate),"yyyy-MM-dd");
            }
        };


        /**
         * 导入工行账单信息
         */
        $scope.importIcbcBillFile = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'module_loanqueryicbc/tpl/dialog-icbcbill-upload.html',
                controller: 'IcbcBillUploadController',
                backdrop:'static'
            });
            modalInstance.result.then(function (result) {
                // $scope.getUnSendOrderDetailList();
                LoanQueryIcbcService.getLoanCustList().then(function(response){
                    $scope.loanCustList = response;
                });
            }, function (result) {
                console.log("取消");

            });
        };

        $scope.downloadIcbcBillFile = function(){
            $window.location.href =  SERVER_URL.API_PUBLIC_URL + "/loanqueryicbc/downloadIcbcBillFile";
        };

        $scope.queryLoanCustList = function(){
            $rootScope.resetPage();
            $scope.loading = LoanQueryIcbcService.getLoanCustList().then(function(response){
                $scope.loanCustList = response
            });
        };
        $scope.initIcbcLoanDetail = function(){
            $scope.appId = $stateParams.appId;
            $scope.contractNo = $stateParams.contractNo;
            $scope.isPjPay = $stateParams.isPjPay;
            LoanQueryIcbcService.getLoanCustApplyInfo($scope.appId,$scope.contractNo).then(function(response){
                $scope.loanCustApplyInfo = response;
                //核销和未核销的从不同数据源加载数据
                if(response.repayStatus=='hkzt05'){
                    //加载核销数据
                    $scope.writeOffData = LoanQueryIcbcService.getWriteOffInfoByAppId($stateParams.appId).$object;
                }else{
                    //加载应还数据
                    $scope.loanCustNeedRepayInfo = LoanQueryIcbcService.getLoanCustNeedRepayInfo($stateParams.appId).$object;
                }
            });

            LoanQueryIcbcService.getLoanCustRepayPlanList($stateParams.appId).then(function(response){
                $scope.repayPlanList = response;
                $scope.totalCapital=0.00;
                $scope.totalInterest=0.00;
                $scope.repayingCapital=0.00;
                $scope.repayingInterest=0.00;
                $scope.repayingOverdue=0.00;
                $scope.totalRepayOverdueAmount = 0.00;
                for(var i = 0 ; i<$scope.repayPlanList.length;i++){
                    var item = $scope.repayPlanList[i];
                    $scope.totalCapital+= item.repayCapital;
                    $scope.totalInterest+=item.repayInterest;
                    $scope.repayingOverdue = Number($scope.repayingOverdue.toFixed(2)) + Number(item.addupOverdueAmount.toFixed(2));
                    if(item.watingCharge!=null){
                        $scope.repayingCapital+=item.watingCharge.repayCapital;
                        $scope.repayingInterest+=item.watingCharge.repayInterest;
                        $scope.totalRepayOverdueAmount += item.watingCharge.repayOverdueAmount;
                    }
                }
                $scope.totalCapital = $scope.totalCapital.toFixed(2);
                $scope.totalInterest = $scope.totalInterest.toFixed(2);
                $scope.repayingCapital = $scope.repayingCapital.toFixed(2);
                $scope.repayingInterest = $scope.repayingInterest.toFixed(2);
                $scope.repayingOverdue = $scope.repayingOverdue.toFixed(2);
                $scope.totalRepayOverdueAmount = $scope.totalRepayOverdueAmount.toFixed(2);
            });
            //$scope.doInitApplyEdit($stateParams.appId);
            $scope.applyInfo = ApplyService.queryApplyInfoByAppId($scope.appId).$object;
            LoanQueryIcbcService.getLoanCustApplyInfo($scope.appId,$scope.contractNo).then(function(response){
                $scope.baseInfoVo = response;
                $scope.repayPlanIcbcList = response.repayPlanIcbcList;
                for(var i = 0;i < $scope.repayPlanIcbcList.length;i++){
                    var tempPlan = $scope.repayPlanIcbcList[i];
                    tempPlan.valueDate = CallCenterServicePlus.dateFormat(new Date(tempPlan.valueDate),"yyyy-MM-dd");
                    tempPlan.billDate = CallCenterServicePlus.dateFormat(new Date(tempPlan.billDate),"yyyy-MM-dd");
                    tempPlan.closingDate = CallCenterServicePlus.dateFormat(new Date(tempPlan.closingDate),"yyyy-MM-dd");
                }
                $scope.baseInfoVo.insatllmentDate = CallCenterServicePlus.dateFormat(new Date($scope.baseInfoVo.insatllmentDate),"yyyy-MM-dd");

                setTimeout(function(){
                    $rootScope.$emit($rootScope.hasReceiveData,{"msg":"收到后端返回"});
                },1);
            });
            LoanQueryIcbcService.getRunningTaskCntByAppId($scope.appId).then(function(response){
                $scope.runTaskCnt = response.taskCnt;
            });
            LoanQueryIcbcService.getLinkmansinfo($scope.appId).then(function(response){
                $scope.linkmans = response;
                setTimeout(function(){
                    $rootScope.$emit($rootScope.hasReceiveData,{"msg":"收到后端返回"});
                },1);
            })
            $scope.signContractVo = TaskService.querySignInfo($scope.appId).$object;

            $scope.queryFraudInnerResult($stateParams.businessKey);
            //查询申请反欺诈信息
            $scope.queryFraudHisInnerResult($stateParams.businessKey,"lrsqd");
            //查询审核反欺诈信息
            $scope.queryFraudHisInnerResult_ShenHe($stateParams.businessKey,"zlsh");
            //查询审批反欺诈信息
            $scope.queryApproveFraudHisInnerResult($stateParams.businessKey,"zlsp");
        };
        $scope.pageChanged = function(){
            $scope.loading = LoanQueryIcbcService.getLoanCustList().then(function(response){
                $scope.loanCustList = response
            });
        }
        $scope.repayLogPageChanged = function(){
            $scope.repayLogList =LoanQueryIcbcService.getLoanCustRepayLog($stateParams.appId).$object;
        }
        $scope.queryRepayLog = function(){
            $rootScope.resetCache();
            $scope.repayLogList =LoanQueryIcbcService.getLoanCustRepayLog($stateParams.appId).$object;
            $scope.repaySum = LoanQueryIcbcService.getLoanCustRepayLogSum($stateParams.appId).$object;
        };

        $scope.queryChargeLog = function(){
            $scope.chargeLogList = LoanQueryIcbcService.getLoanCustChargeLog($stateParams.appId).$object;
        };

        $scope.querySmssignRecordList = function(){
            $scope.smssignRecordList = SmsSignService.querySmssignRecordList($stateParams.smssignId).$object;
        };
        $scope.querySmssignProcList = function(){
            $scope.smssignProcList = SmsSignService.querySmssignProcList($stateParams.smssignId).$object;
        };
        $scope.queryOtherFeeList = function(){
            $scope.otherFeeList = LoanQueryIcbcService.getOtherFeeList($stateParams.appId).$object;
        };
        $scope.queryRefundLog = function(){
            $scope.refundLogList = LoanQueryIcbcService.getRefundLog($stateParams.appId).$object;
        }
        $scope.doPublicRepay = function(){
            PublicRepayService.addPublicRepayApply($stateParams.appId);
        };
        $scope.doSettle = function(){
            SettleService.addSettleApply($stateParams.appId);
        };
        $scope.doAlterRepayDate = function(){
            AlterRepayDateService.addAlterRepayDateApply($stateParams.appId);
        };
        $scope.doRefund = function(){
            RefundService.addRefundApply($stateParams.appId);
        };
        $scope.doRemission = function(){
            RemissionService.addRemissionApply($stateParams.appId);
        };
        $scope.doExtendPeriod = function(){
            ExtendPeriodService.addExtendPeriodApply($stateParams.appId);
        };
        $scope.doOtherFee = function(){
            OtherFeeService.addOtherFeeApply($stateParams.appId,'SMCS','1111111').then(function(response){
                modal.info("发起流程成功",response);
            });
        };
        $scope.doPartSettle = function(){
            SettleService.addPartSettleApply($stateParams.appId);
        };
        $scope.doOffer = function(){
            OfferService.addOfferApply($stateParams.appId);
        }
        $scope.doPhoneCollection = function(){
            CollectionService.createPhoneCollectionTask($stateParams.appId,"test").then(function(response){
                toaster.pop('success', '操作提醒', '提交任务成功');
            });
        };
        $scope.doRecoverCollectionTask = function(){
            CollectionService.createRecoverCollectionTask($stateParams.appId).then(function(response){
                toaster.pop('success', '操作提醒', '提交任务成功');
            })
        };
        $scope.doAlterTenantInfo = function(){
            AlterCustInfoService.doAlterTenantInfo($stateParams.appId,$scope.applyInfo).then(function(response){
                toaster.pop('success', '操作提醒', '提交变更成功');
                $scope.initLoanDetail();
            })
        };
        $scope.doAlterColesseeInfo = function(){
            if($scope.applyInfo.cloessee.type ==null){
                modal.error("申请单未录入共租人");
                return;
            }
            AlterCustInfoService.doAlterColesseeInfo($stateParams.appId,$scope.applyInfo).then(function(response){
                toaster.pop('success', '操作提醒', '提交变更成功');
                $scope.initLoanDetail();
            })
        };
        $scope.doAlterLinkmanInfo = function(){
            AlterCustInfoService.doAlterLinkmanInfo($stateParams.appId,$scope.applyInfo).then(function(response){
                toaster.pop('success', '操作提醒', '提交变更成功');
                $scope.initLoanDetail();
            })
        };
        $scope.doAlterBankInfo = function(){
            AlterCustInfoService.doAlterBankInfo($stateParams.appId).then(function(response){
                toaster.pop('success', '操作提醒', '提交变更成功');
                $scope.initLoanDetail();
            })
        };
        $scope.doInsuranceContinue = function(){
            InsManageService.createInsuranceContinueTask($stateParams.appId).then(function(response){
                toaster.pop('success', '操作提醒', '发起任务成功');
            })
        };
        $scope.getInsuranceHisList = function(){
            $scope.insHisList = InsManageService.getInsuranceHisList($stateParams.appId).$object;
        };
        $scope.createTelInterviewTask = function(){
            TelInterviewService.createTelInterviewTask($stateParams.appId).then(function(response){
                toaster.pop('success', '操作提醒', '发起任务成功');
            })
        };
        $scope.getTelInterviewHisList = function(){
            $scope.telInterviewHisList = TelInterviewService.getTelInterviewHisList($scope.appId).$object;
        };
        $scope.showTelInterviewDetail = function(item){
            TelInterviewService.showTelInterviewDetail(item);
        };
        $scope.sendSms = function(appId){
            SmsService.sendSms(appId);
        };
        $scope.getImportantCollectionLog = function(){
            $scope.collectionLogCntMap = CollectionService.getCollectionTaskCnt($scope.appId).$object;
            $scope.importanCollectionLogList = CollectionService.getImportanCollectionLogInfo($scope.appId).$object;
        };
        $scope.getCollectionLog = function(taskType){
            if(taskType=='csrwlx02'){//上门催收
                $scope.collectionLogList  = LoanQueryIcbcService.selectCollectionVisitSummaryByAppId($scope.appId).$object;
            }else{
                $scope.collectionLogList = CollectionService.getCollectionLogInfo($scope.appId,taskType).$object;
            }
        };
        $scope.getTelIncomeHisList = function(){
            $scope.telIncomeHisList = TelInterviewService.getTelIncomeLogList($scope.appId).$object;
        }
        //查询客户信息变更记录
        $scope.getAlterInfoLogList = function(){
            $scope.alterInfoLogList = AlterCustInfoService.getAlterInfoLogList($scope.appId).$object;
        }
        //查询客户信息变更明细
        $scope.showAlterCustInfoLogDetail = function(logId){
            AlterCustInfoService.showAlterCustInfoLogDetail(logId);
        }
        //查看正在执行任务信息
        $scope.showRunTaskList = function(){
            LoanQueryIcbcService.showRunTaskList($scope.appId);
        }
        //查询我办理的任务
        $scope.initMyDoTaskList = function(){
            $scope.taskTypeList=[];
            SysDictService.queryDictDataByTypeCode("dhsqlx").then(function(response){
                $scope.taskTypeList = response;
                SysDictService.queryDictDataByTypeCode("csrwlx").then(function(response){
                    $scope.taskTypeList=$scope.taskTypeList.concat(response);
                    SysDictService.queryDictDataByTypeCode("kfrwlx").then(function(response){
                        $scope.taskTypeList=$scope.taskTypeList.concat(response);
                        SysDictService.queryDictDataByTypeCode("darwlx").then(function(response){
                            $scope.taskTypeList=$scope.taskTypeList.concat(response);
                        })
                    })
                })
            });
            $scope.loading =  LoanQueryIcbcService.getMyDoTaskList().then(function(response){
                $scope.myDoTaskList = response;
            })
            //$scope.myDoTaskList = LoanQueryIcbcService.getMyDoTaskList().$object;
        };
        $scope.queryMyDoTaskList = function(){
            $scope.loading =  LoanQueryIcbcService.getMyDoTaskList().then(function(response){
                $scope.myDoTaskList = response;
            })
        }
        //查询所有贷后办理的任务
        $scope.initAllApplyTaskList = function(){
            $scope.taskTypeList=[];
            SysDictService.queryDictDataByTypeCode("dhsqlx").then(function(response){
                $scope.taskTypeList = response;
                SysDictService.queryDictDataByTypeCode("csrwlx").then(function(response){
                    $scope.taskTypeList=$scope.taskTypeList.concat(response);
                    SysDictService.queryDictDataByTypeCode("darwlx").then(function(response){
                        $scope.taskTypeList=$scope.taskTypeList.concat(response);
                    })
                })
            });
           $scope.loading = LoanQueryIcbcService.getAllLoanApplyTaskList().then(function(response){
               $scope.taskList = response;
           });
        };
        $scope.queryAllApplyTaskList = function(){
            $scope.loading = LoanQueryIcbcService.getAllLoanApplyTaskList().then(function(response){
                $scope.taskList = response ;
            });
        };
        $scope.openInsuranceClaims = function(item){
            window.open("#/app/insurancemanage/claims/"+item.appId+"/"+item.insuranceId+"/"+item.insuranceType+'?hiddenAsideFolded=true',
                '保险续保',
                'height='+$scope.screenHeight*0.8+',width='+$scope.screentWidth*0.8+',top='+$scope.screenHeight*0.1+',left='+$scope.screentWidth*0.1+',toolbar=no,menubar=no,, resizable=no,location=no, status=no');
        };
        $scope.openInsuranceClaimsHis = function(insuranceId){
            InsManageService.showInsuranceClaimsHis(insuranceId);
        };
        $scope.queryRepayQueueList = function(){
            $scope.repayQueueList = LoanQueryIcbcService.getRepayQueueByAppId($stateParams.appId).$object;
        }

        $scope.showMyDoApplyDetail = function(appId){
            window.open("#/app/loanquery/loaninfo/detail/"+appId+'?hiddenAsideFolded=true', "贷后详情", "height="+$scope.screenHeight+",width="+$scope.screenWidth+", toolbar =no, menubar=no,   location=no, status=no");
        };
        $scope.doAlterSignInfo = function(){
            AlterCustInfoService.doAlterSignInfo($stateParams.appId,$scope.signContractVo,$scope.applyInfo).then(function(response){
                toaster.pop('success', '操作提醒', '提交变更成功');
                $scope.initLoanDetail();
            })
        };


        $scope.applyNewCollectionTask = function(taskType){
            var appId = $scope.appId;
            var taskId = $scope.taskId;
            var modalInstance = $uibModal.open({
                animation: false,
                backdrop: 'static',
                size: 'lg',
                templateUrl: 'module_collectionpublic/tpl/dialog-collection-add.html',
                controller: function ($scope, RestApi, SettleService, ToolsService, modal, LoanQueryIcbcService,UnitInfoService,VisitCollectionService) {
                    $scope.appId = appId;
                    $scope.repayInfo = {};
                    $scope.baseInfoVo1 = {};
                    $scope.baseInfoVo1 = LoanQueryIcbcService.getLoanCustApplyInfo($scope.appId,$scope.contractNo).$object;
                    VisitCollectionService.getCustomerInfoAll($scope.appId).then(function(response){
                        $scope.repayInfo = response;
                        var totalMoneyStr = ($scope.repayInfo.remainCapital + $scope.repayInfo.interest) + "" ;
                        $scope.totalMoney =  totalMoneyStr.substring(0,totalMoneyStr.indexOf(".") + 3);
                    });

                    $scope.taskType = taskType;
                    $scope.taskId = taskId;
                    $scope.applyVo = {};
                    $scope.editable = true;
                    if(taskType=='csrwlx02'){
                        $scope.taskName = '上门催收';
                        $scope.visitReasonList = SysDictService.queryDictDataByTypeCode("smcsyy").$object;

                    }
                    if(taskType =='csrwlx03'){
                        $scope.taskName = '委外催收';
                        $scope.outReasonList =  SysDictService.queryDictDataByTypeCode("wycsyy").$object;
                        $scope.outUnitList = UnitInfoService.getUnitInfoList(true,'csdwlx01').$object;
                    }
                    if(taskType =='csrwlx04'){
                        $scope.taskName = '委外收车';
                        $scope.recoverReasonList = SysDictService.queryDictDataByTypeCode("wwscyy").$object;
                        $scope.recoverUnitList = UnitInfoService.getUnitInfoList(true,'csdwlx02').$object;
                    }
                    if(taskType =='csrwlx05'){
                        $scope.taskName = '车辆退回';
                        $scope.backReasonList = SysDictService.queryDictDataByTypeCode("clthyy").$object;
                    }
                    if(taskType =='csrwlx06'){
                        $scope.taskName = '资产处置';
                        $scope.disposeReasonList = SysDictService.queryDictDataByTypeCode("zcczyy").$object;
                        $scope.disposeUnitList = UnitInfoService.getUnitInfoList(true,'csdwlx02').$object;
                    }
                    if(taskType =='csrwlx07'){
                        $scope.taskName = '诉讼';
                        $scope.lawsuitReasonList = SysDictService.queryDictDataByTypeCode("ssyy").$object;
                        $scope.lawsuitUnitList = UnitInfoService.getUnitInfoList(true,'csdwlx03').$object;
                    }
                    $scope.ok = function () {
                        modal.confirm("操作提醒", "确认提交任务？").then(function () {
                            if(taskType =='csrwlx04'){
                                $scope.loading = CollectionService.applyNewRecoverCollectionTaskDirect($scope.appId, $scope.applyVo).then(function () {
                                    modalInstance.close();
                                })
                            }else if(taskType =='csrwlx07'){
                                $scope.loading = CollectionService.applyNewLawsuitCollectionTaskDirect($scope.appId, $scope.applyVo).then(function () {
                                    modalInstance.close();
                                })
                            }

                        })
                    };
                    $scope.cancel = function () {
                        modalInstance.dismiss('cancel');
                    };
                }
            });
            modalInstance.result.then(function (response) {
                toaster.pop('success', '操作提醒', "提交任务成功");
            })
        };

        $scope.applyLawsuitDirect = function(appId){

        };
        //车辆处置入账
        $scope.applyCarDispose = function(){
            CarDisposeService.applyCarDispose($stateParams.appId);
        }

        $scope.addIncomingTel = function(appId){
            TelInterviewService.addTelIncomeInfo(appId,'contract').then(function(){
                toaster.pop('success', '操作提醒', '保存来电记录成功 ');
            })
        }
        $scope.addsmsSignRecord = function(){
            var smssignId= $stateParams.smssignId;
            SmsSignService.addsmssignRecord(smssignId).then(function(){
                toaster.pop('success', '操作提醒', '保存签约备注成功 ');
                // $scope.querySmssignRecordList(0);
            })
        }

        $scope.createCollectionPthoneTask = function(appId){
            LoanQueryIcbcService.getNowOverday(appId).then(function(response){
                alert(response);
                LoanQueryIcbcService.createCollectionPthoneTask(appId);
            })
        }

        $scope.finishCollectionPhoneTask = function(appId){
            LoanQueryIcbcService.finishCollectionPhoneTask(appId);
        }

        $scope.batchCompleteArchiveTask = function(){
            $scope.loading = LoanQueryIcbcService.batchCompleteArchiveTask().then(function(response){
                toaster.pop('success', '操作提醒', '操作成功 ');
            });
        }

        $scope.pjPay = function(){
            LoanQueryIcbcService.pjPay($scope.contractNo).then(function(response){
                for(var i = 0;i < response.length ;i++){
                    var currIcbcBill = response[i];
                    if(currIcbcBill.isPjPay){
                        $scope.isPjPay = true;
                        toaster.pop('success', '操作提醒', '操作成功 ');
                        break;
                    }
                }
                if(!$scope.isPjPay){
                    toaster.pop('success', '操作提醒', '操作失败 ');
                }
            });
        };
        $scope.$watch("isPjPay",function(n,o){
           if(n) {
               $scope.isPjPayDesc = "已代偿";
           }else{
               $scope.isPjPayDesc = "标记为代偿";
           }
        });
        $scope.switchApply = function(){
            var appId = $scope.appId+"-1";
            ApplyService.queryApplyInfoByAppId(appId).then(function(response){
               if(response.id != null && response.id != 'null') {
                   // $state.go("app.loanquery.loaninfo.detail",{"appId":appId});
                   LoanQueryIcbcService.queryOfferBatchDetail(appId);
               }else {
                   toaster.pop('error', '操作提醒', '无关联申请单 ');
               }
            });
        };

    })
;