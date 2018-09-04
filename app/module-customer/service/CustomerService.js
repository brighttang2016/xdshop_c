/**
 * Created by pujjr on 2017/7/19.
 */

angular.module('com.app.customer.service')
    .service('CustomerService',function(TlmsRestangular) {

        this.getPublishUserList = function () {
            return TlmsRestangular.all("/service/publishUser/list").getList();
        };

        this.fetch = function (publishId,openId) {
            return TlmsRestangular.all("/service/fetch/").all(publishId).all(openId).post();
        };

        this.unfetch = function (publishId,openId) {
            return TlmsRestangular.all("/service/unfetch").all(publishId).all(openId).post();
        };

    });
