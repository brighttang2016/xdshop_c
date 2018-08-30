'use strict';

/**
 * Config for the router
 */
angular.module('myApp')
    .config(
    ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                //贷款综合查询
                .state('app.loanqueryicbc',{
                    abstract:true,
                    url:'/loanqueryicbc',
                    template: '<div ui-view=""></div>'
                })
                //查询贷款客户列表
                .state('app.loanqueryicbc.list',{
                    url:'/list',
                    templateUrl:'module_loanqueryicbc/tpl/loanquery-list.html',
                    controller:'LoanQueryIcbcController'
                })
                //查询贷款客户详细信息
                .state('app.loanqueryicbc.loaninfo',{
                    abstract:true,
                    url:'/loaninfo',
                    template: '<div ui-view=""></div>',
                    controller:'ApplyController'
                })
                //查询贷款客户详细信息
                .state('app.loanqueryicbc.loaninfo.detail',{
                    url:'/detail/:appId/:contractNo/:isPjPay',
                    templateUrl:'module_loanqueryicbc/tpl/loanquery-detail.html',
                    controller:'LoanQueryIcbcController'
                })
                //查询贷款客户基本信息
                .state('app.loanqueryicbc.loaninfo.detailinfo',{
                    url:'detailinfo/detail/:appId/:smssignId',
                    templateUrl:'module_loanquery/tpl/loanquery-detail-info.html',
                    controller:'LoanQueryIcbcController'
                })
                //查询我办理的任务
                .state('app.loanqueryicbc.mydotask',{
                    url:'/mydotask',
                    templateUrl:'module_loanquery/tpl/mydotask-list.html',
                    controller:'LoanQueryIcbcController'
                })
                //查询所有贷后所有流程
                .state('app.loanqueryicbc.alltask',{
                    url:'/alltask',
                    templateUrl:'module_loanquery/tpl/allapplytask-list.html',
                    controller:'LoanQueryIcbcController'
                })

        }
    ]
);