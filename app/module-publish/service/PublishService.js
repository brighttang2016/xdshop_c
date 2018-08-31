/**
 * Created by pujjr on 2017/7/19.
 */

angular.module('com.app.publish.service')
    .service('PublishService',function(TlmsRestangular) {
        this.getPublishList = function () {
            console.log("getPublishList");
            return TlmsRestangular.all("/service/publish/list").getList();
        };

        this.addPublish = function (publish) {
            console.log(publish);
            return TlmsRestangular.all("/service/publish/save").post(publish);
        };

        this.commitUserInfo = function (publish) {
            return TlmsRestangular.all("/service/publish/list").getList();
        };

        /*return {
            "getPublishList":getPublishList,
            "addPublish":addPublish
        };*/
        /*var getPublishList = function(){

        };
        return {
            'getPublishList':getPublishList
        }*/
    });
