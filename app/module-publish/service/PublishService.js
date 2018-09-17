/**
 * Created by pujjr on 2017/7/19.
 */

angular.module('com.app.publish.service')
    .service('PublishService',function(TlmsRestangular) {

        this.initPublish = function(){
            return TlmsRestangular.one("/service/publish/init").get();
        };

        this.getPublishList = function () {
            // console.log("getPublishList");
            return TlmsRestangular.all("/service/publish/list").getList();
        };
        this.getPublish = function (id) {
            return TlmsRestangular.one("/service/publish").one(id).get();
        };

        this.savePublish = function (publish) {
            // console.log(publish);
            return TlmsRestangular.all("/service/publish/save").post(publish);
        };

        this.openPublish = function (publish) {
            // console.log(publish);
            return TlmsRestangular.all("/service/publish/open").post(publish);
        };

        this.commitUserInfo = function (publish) {
            return TlmsRestangular.all("/service/publish/list").getList();
        };

        this.queryPublishResource = function(typeCode,publishId){
            return TlmsRestangular.one("/service/publishResource").one(typeCode).one(publishId).get();
        };

        this.getSubUserList = function(publishId,openId){
            return TlmsRestangular.all("/service/subuser/").all(publishId).all(openId).getList();
        };
         this.getFetchUserList= function(){
            return TlmsRestangular.all("/service/fetchuser/").getList();
        };

        this.getPosterOssUrl = function(publishId,openId){
            return TlmsRestangular.one("/service/usershare/").one(publishId).one(openId).get();
        };

        this.generalFirstSharePic = function(publishId){
            console.log(publishId);
            return TlmsRestangular.one("/service/publish/generalFirstSharePic").one(publishId).get();
        };

        //获取对应姓名、手机号信息
        this.getUserInfo = function(publishId,openId){
            return TlmsRestangular.one("/service/user/share/").one(publishId).one(openId).get();
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
