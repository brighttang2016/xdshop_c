'use strict';

/**
 * Config for the router
 */
angular.module('publishShowApp')
  .run(
    [ '$rootScope', '$state', '$stateParams',
      function ($rootScope,$state,$stateParams) {
          console.log("*************myApp run 开始****************************");

          //注册路由变更成功处理方法
          $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
              console.log("$stateChangeSuccess");
              console.log(event);
              console.log(toState);
              console.log(toParams);
              console.log(fromState);
              console.log(fromParams);
              console.log($rootScope.vm);
              console.log($rootScope.paginationInfo);
              var data = {};
               data.paginationInfo = $rootScope.paginationInfo;
               data.vm = $rootScope.vm;
               //20180814 add
               var currState = {};
               currState["fromData"] = data;
               currState["fromState"] = fromState.name;
               currState["fromParams"] = fromParams;
               currState["toState"] = toState.name;
               currState["toParams"] = toParams;
               if ($rootScope.stateConvertType != "toback") {
                   $rootScope.stateStack.push(currState);
               }
               $rootScope.stateConvertType = "";
          });

          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
          $rootScope.resetCache = function () {
              $rootScope.paginationInfo = {
                  totalItem: 0,
                  pageSize: 10,
                  curPage: 1,
                  maxSize: 5
              };
              $rootScope.vm = {};
          };
          $rootScope.resetPage = function(){
              $rootScope.paginationInfo = {
                  totalItem: 0,
                  pageSize: 10,
                  curPage: 1,
                  maxSize: 5
              };
          };

          /**
           * 初始化状态历史堆栈 20180814 add
           */
          if($rootScope.stateStack == undefined || $rootScope.stateStack == null || $rootScope.stateStack == '' || $rootScope.stateStack){
              $rootScope.stateStack = [];
          }


          //注册路由变更开始处理方法
          $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
              console.log("stateChangeStart");
          });

          //返回上级路由(采用堆栈冒泡方式)
          $rootScope.back = function () {
              var currState = $rootScope.stateStack.pop();
              var data = currState["fromData"];
              var fromState = currState["fromState"];
              var fromParams = currState["fromParams"];
              var toState = currState["toState"];
              var toParams = currState["toParams"];
              $rootScope.paginationInfo = data.paginationInfo;
              $rootScope.vm = data.vm;
              $rootScope.stateConvertType = "toback";
              //$state.go(previousStateName);
              $state.transitionTo(fromState,fromParams);
          };

        //重置缓存
          $rootScope.resetCache();
          console.log("*************myApp run 结束****************************");
      }
    ]
  )
  .config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
          $urlRouterProvider
              .otherwise('publishshow');
          $stateProvider
              .state('app', {
                  //abstract: true,
                  url: '/app',
                  templateUrl: 'app.html'
              })
              .state('signin',{
                  url:'/signin',
                  templateUrl:'app/module-user/tpl/userLogin.html'
              })
              .state('publishshow',{
                  url:'/publishshow/:openId',
                  templateUrl:'app/module-publish/tpl/publish-show.html',
                  controller:'PublishController'
              })
      }
    ]
  );