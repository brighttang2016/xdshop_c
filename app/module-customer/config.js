/**
 * Created by pujjr on 2017/7/19.
 */



angular.module('com.app.customer',[
    'com.app.customer.directive',
    'com.app.customer.controller',
    'com.app.customer.service'
]);

angular.module('com.app.customer.directive',[]);
angular.module('com.app.customer.controller',[]);
angular.module('com.app.customer.service',[]);

angular.module('myApp')
    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider.state('app.customer',{
            url:'/customer',
            abstract:true/*,
            template: '<div ui-view class="fade-in-up"></div>'*/
        }).state('app.customer.list',{
            url:'/list',
            templateUrl:'app/module-customer/tpl/customer-list.html',
            controller:'CustomerController'
        })
    });

