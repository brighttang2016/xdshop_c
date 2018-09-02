/**
 * Created by pujjr on 2017/7/19.
 */



angular.module('com.app.publish',[
    'com.app.publish.directive',
    'com.app.publish.controller',
    'com.app.publish.service'
]);

angular.module('com.app.publish.directive',[]);
angular.module('com.app.publish.controller',[]);
angular.module('com.app.publish.service',[]);

angular.module('myApp')
    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider.state('app.publish',{
            url:'/publish',
            abstract:true/*,
            template: '<div ui-view class="fade-in-up"></div>'*/
        }).state('app.publish.list',{
            url:'/list',
            templateUrl:'app/module-publish/tpl/publish-list.html'
        }).state('app.publish.add',{
                url:'/add',
                templateUrl:'app/module-publish/tpl/publish-add.html',
                controller:'PublishController'
        }).state('app.publish.edit',{
            url:'/edit/:id',
            templateUrl:'app/module-publish/tpl/publish-edit.html',
            controller:'PublishController'
        })
    });


angular.module('publishShowApp')
    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider.state('publishshow.publish',{
            url:'/publish',
            abstract:true/*,
            template: '<div ui-view class="fade-in-up"></div>'*/
        }).state('publishshow.publish.add',{
            url:'/add',
            templateUrl:'app/module-publish/tpl/publish-add.html',
            controller:'PublishController'
        })
    });

