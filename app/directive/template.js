angular.module('com.tang.template',[])
    .run(function($templateCache){
        $templateCache.put('template/myDirective','<a href="http://www.baidu.com">指令替换内容，跳转百度(此内容在templateUrl中)</a>');
        $templateCache.put('template/myDirective4','指令内：输入需要跳转到地址(指令内)(指令内输入，同时同步外部信息【p55页内容】)<input type="text" ng-model="myUrl4"/><a href="{{myLinkText4}}">{{myUrl4}}||{{someUrl}} || {{myLinkText4}}</a> (此内容在templateUrl中)');
    });
