angular.module('pu.loanqueryicbc.services')
    .service("LoanQueryIcbcService",function($window,RestApi,$uibModal,PanelService,
                                             $rootScope, $state,$stateParams, toaster,LoanQueryService,PublicRepayService,SettleService,AlterRepayDateService,RefundService,modal,TaskService,
                                             RemissionService,ExtendPeriodService,OtherFeeService,CollectionService,AlterCustInfoService,InsManageService,TelInterviewService,SmsService,ProductService,SysDictService,
                                             OfferService,ApplyService,SysBranchService,CarDisposeService,SmsSignService,QueryService){
        this.getLoanCustList = function(){
            return RestApi.all("/loanqueryicbc/getIcbcLoanCustList").getList();
        };
        this.getLoanCustApplyInfo=function(appId,contractNo){
            return RestApi.one("/loanqueryicbc/getIcbcLoanCustApplyInfo",appId).one(contractNo).get();
        };
        this.getLoanCustNeedRepayInfo = function(appId){
            return RestApi.one("/loanquery/getLoanCustNeedRepayInfo",appId).get();
        };
        this.getLoanCustRepayPlanList = function(appId){
            return RestApi.all("/repay/select/list").all(appId).all(0).getList();
        };
        this.getLoanCustRepayLog = function(appId){
            return RestApi.all("/loanquery/getLoanCustRepayLog").all(appId).getList();
        };
        this.getLoanCustChargeLog = function(appId){
            return RestApi.all("/loanquery/getLoanCustChargeLog").all(appId).getList();
        };
        this.getTaskByTaskId = function(taskId,workflowKey){
            return RestApi.all("/loanquery/getTaskByTaskId").one(taskId,workflowKey).get();
        };
        this.getAfterCurrentPeriodRemainPeroidList = function(appId){
            return RestApi.all("/loanquery/getAfterCurrentPeriodRemainPeroidList").all(appId).getList();
        };
        this.getCurrentPeriodRepayPlan = function(appId){
            return RestApi.one("/loanquery/getCurrentPeriodRepayPlan",appId).get();
        };
        this.getOtherFeeList = function(appId){
            return RestApi.all("/loanquery/getOtherFeeList").all(appId).getList();
        };
        this.getRunningTaskCntByAppId = function(appId){
            return RestApi.one("loanquery/getRunningTaskCntByAppId",appId).get();
        };
        this.getRunningTaskByAppId = function(appId){
            return RestApi.all("loanquery/getRunningTaskByAppId").all(appId).getList();
        };
        this.showRunTaskList = function (appId) {
            var modalInstance = $uibModal.open({
                animation: false,
                backdrop: false,
                size: 'lg',
                templateUrl: 'module_loanquery/tpl/dialog-runtask-list.html',
                controller: function ($scope, RestApi, LoanQueryService) {
                    $scope.appId = appId;
                    $scope.runTaskList = LoanQueryService.getRunningTaskByAppId($scope.appId).$object;
                    $scope.cancel = function () {
                        modalInstance.dismiss('cancel');
                    };
                }
            });
        };
        this.getMyDoTaskList = function(){
            return RestApi.all("/loanquery/getMyDoTaskList").getList();
        }
        this.getAllLoanApplyTaskList = function(){
            return RestApi.all("/loanquery/getAllLoanApplyTaskList").getList();
        }
        this.getRepayQueueByAppId = function(appId){
            return RestApi.all("/loanquery/getRepayQueueByAppId").all(appId).getList();
        }
        this.getLinkmansinfo = function(appId){
            return RestApi.all("/apply/linkmans").all(appId).getList();
        };
        this.getRepayInfo = function(appId){
            return RestApi.one("/apply/getRepayInfo",appId).get();
        };

        this.getLoanCustRepayLogSum = function(appId){
            return RestApi.one("loanquery/getLoanCustRepayLogSum",appId).get();
        }

        this.getBeforeClosingDate = function(appId,radix,passHoliday){
            return RestApi.all("/loanquery/getBeforeClosingDate").one(appId,radix).get();
        };
        //查询核销信息
        this.getWriteOffInfoByAppId = function(appId){
            return RestApi.one("/loanquery/writeoffinfo",appId).get();
        }

        //批量结束预筛查归档任务
        this.batchCompleteArchiveTask = function(){
            return RestApi.all("/loanquery/batchCompleteArchiveTask").post();
        }
        //根据appId获取上门催收派单记录
        this.selectCollectionVisitSummaryByAppId = function(appId){
            return RestApi.all("/visitCollection/selectCollectionVisitSummaryByAppId").all(appId).getList();
        };
        //标记为潽金代偿
        this.pjPay = function(contractNo){
            return RestApi.all("/loanqueryicbc/pjPay").all(contractNo).post();
        };
        //下载工行账单文件
        this.downloadIcbcBillFile = function(contractNo){
            return RestApi.one("/loanqueryicbc/downloadIcbcBillFile").get();
        };

        this.queryOfferBatchDetail = function(item){
            $stateParams.appId = item;
            var panelInstance = PanelService.open({
                panelSize:  { width: '80%', height: '80%'},
                footerToolbar:[
                    {item:"<button type='button' class='btn btn-danger btn-sm'   ng-click='close()'>关闭</button>"}
                ],
                headerTitle:'关联业务',
                templateUrl:'module_loanqueryicbc/tpl/loanquery-detail-switch.html',
               /* controller:'LoanQueryController',
                resolve: {
                    item: function () {
                        return {"panelInstance":panelInstance};
                    }
                }*/
               // controller:'LoanQueryController'
               controller:function($scope,ChargeService,RestApiDirect){

                    $scope.close=function(){
                        panelInstance.close();
                    };

                   $scope.initList = function(){
                       ProductService.queryAllProductList().then(function (response) {
                           $(function () {
                               $('.selectpicker').selectpicker('refresh');
                               $('.selectpicker').selectpicker('render');
                           });
                           $scope.productList = response;
                       });
                       $scope.repayStatusList = SysDictService.queryDictDataByTypeCode("hkzt").$object;
                       $scope.loading = LoanQueryService.getLoanCustList().then(function(response){
                           $scope.loanCustList = response;
                       });
                       $scope.branchList = SysBranchService.getEffectDealerList().$object;
                   };
                   $scope.queryLoanCustList = function(){
                       $rootScope.resetPage();
                       $scope.loading = LoanQueryService.getLoanCustList().then(function(response){
                           $scope.loanCustList = response
                       });
                   }
                   $scope.initLoanDetail = function(){
                       $scope.appId = $stateParams.appId;
                       // $stateParams.appId = $stateParams.appId+"-1";
                       LoanQueryService.getLoanCustApplyInfo($stateParams.appId).then(function(response){
                           $scope.loanCustApplyInfo = response;
                           //核销和未核销的从不同数据源加载数据
                           if(response.repayStatus=='hkzt05'){
                               //加载核销数据
                               $scope.writeOffData = LoanQueryService.getWriteOffInfoByAppId($stateParams.appId).$object;
                           }else{
                               //加载应还数据
                               $scope.loanCustNeedRepayInfo = LoanQueryService.getLoanCustNeedRepayInfo($stateParams.appId).$object;
                           }
                       });

                       LoanQueryService.getLoanCustRepayPlanList($stateParams.appId).then(function(response){
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
                       LoanQueryService.getLoanCustApplyInfo($scope.appId).then(function(response){
                           $scope.baseInfoVo = response;
                           setTimeout(function(){
                               $rootScope.$emit($rootScope.hasReceiveData,{"msg":"收到后端返回"});
                           },1);
                       })
                       LoanQueryService.getRunningTaskCntByAppId($scope.appId).then(function(response){
                           $scope.runTaskCnt = response.taskCnt;
                       });
                       LoanQueryService.getLinkmansinfo($scope.appId).then(function(response){
                           $scope.linkmans = response;
                           setTimeout(function(){
                               $rootScope.$emit($rootScope.hasReceiveData,{"msg":"收到后端返回"});
                           },1);
                       })
                       $scope.signContractVo = TaskService.querySignInfo($scope.appId).$object;
/*
                       QueryService.queryFraudInnerResult($stateParams.businessKey);
                       //查询申请反欺诈信息
                       $scope.queryFraudHisInnerResult($stateParams.businessKey,"lrsqd");
                       //查询审核反欺诈信息
                       $scope.queryFraudHisInnerResult_ShenHe($stateParams.businessKey,"zlsh");
                       //查询审批反欺诈信息
                       $scope.queryApproveFraudHisInnerResult($stateParams.businessKey,"zlsp");*/
                   };
                   $scope.pageChanged = function(){
                       $scope.loading = LoanQueryService.getLoanCustList().then(function(response){
                           $scope.loanCustList = response
                       });
                   }
                   $scope.repayLogPageChanged = function(){
                       $scope.repayLogList =LoanQueryService.getLoanCustRepayLog($stateParams.appId).$object;
                   }
                   $scope.queryRepayLog = function(){
                       $rootScope.resetCache();
                       $scope.repayLogList =LoanQueryService.getLoanCustRepayLog($stateParams.appId).$object;
                       $scope.repaySum = LoanQueryService.getLoanCustRepayLogSum($stateParams.appId).$object;
                   };

                   $scope.queryChargeLog = function(){
                       $scope.chargeLogList = LoanQueryService.getLoanCustChargeLog($stateParams.appId).$object;
                   };

                   $scope.querySmssignRecordList = function(){
                       $scope.smssignRecordList = SmsSignService.querySmssignRecordList($stateParams.smssignId).$object;
                   };
                   $scope.querySmssignProcList = function(){
                       $scope.smssignProcList = SmsSignService.querySmssignProcList($stateParams.smssignId).$object;
                   };
                   $scope.queryOtherFeeList = function(){
                       $scope.otherFeeList = LoanQueryService.getOtherFeeList($stateParams.appId).$object;
                   };
                   $scope.queryRefundLog = function(){
                       $scope.refundLogList = LoanQueryService.getRefundLog($stateParams.appId).$object;
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
                       AlterCustInfoService.doAlterTenantInfo($stateParams.appId,$scope.applyInfo,$scope.baseInfoVo).then(function(response){
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
                           $scope.collectionLogList  = LoanQueryService.selectCollectionVisitSummaryByAppId($scope.appId).$object;
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
                       LoanQueryService.showRunTaskList($scope.appId);
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
                       $scope.loading =  LoanQueryService.getMyDoTaskList().then(function(response){
                           $scope.myDoTaskList = response;
                       })
                       //$scope.myDoTaskList = LoanQueryService.getMyDoTaskList().$object;
                   };
                   $scope.queryMyDoTaskList = function(){
                       $scope.loading =  LoanQueryService.getMyDoTaskList().then(function(response){
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
                       $scope.loading = LoanQueryService.getAllLoanApplyTaskList().then(function(response){
                           $scope.taskList = response;
                       });
                   };
                   $scope.queryAllApplyTaskList = function(){
                       $scope.loading = LoanQueryService.getAllLoanApplyTaskList().then(function(response){
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
                       $scope.repayQueueList = LoanQueryService.getRepayQueueByAppId($stateParams.appId).$object;
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
                           controller: function ($scope, RestApi, SettleService, ToolsService, modal, LoanQueryService,UnitInfoService,VisitCollectionService) {
                               $scope.appId = appId;
                               $scope.repayInfo = {};
                               $scope.baseInfoVo1 = {};
                               $scope.baseInfoVo1 = LoanQueryService.getLoanCustApplyInfo($scope.appId).$object;
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
                       LoanQueryService.getNowOverday(appId).then(function(response){
                           alert(response);
                           LoanQueryService.createCollectionPthoneTask(appId);
                       })
                   }

                   $scope.finishCollectionPhoneTask = function(appId){
                       LoanQueryService.finishCollectionPhoneTask(appId);
                   }

                   $scope.batchCompleteArchiveTask = function(){
                       $scope.loading = LoanQueryService.batchCompleteArchiveTask().then(function(response){
                           toaster.pop('success', '操作提醒', '操作成功 ');
                       });
                   }



                }
            });
        };

    });
