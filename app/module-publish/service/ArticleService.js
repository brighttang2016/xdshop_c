/**
 * Created by pujjr on 2017/7/19.
 */

angular.module('com.app.publish.service')
    .service('ArticleService',function(TlmsRestangular) {

        this.getArticle = function(publishId){
            return TlmsRestangular.one("/service/article").one(publishId).get();
        };


    });
