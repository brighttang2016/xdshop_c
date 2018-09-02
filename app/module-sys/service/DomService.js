/**
 * Created by pujjr on 2017/9/21.
 */
angular.module('com.tlms.sys.service')
    .service('DomService',function(){
        /**
         * 清空原有子节点信息，并追加富文本
         * @param id
         * @param richText
         */
        this.appendRichText = function(id,richText){
            var richTextDom = angular.element(richText);
            var  richTextScanDom = angular.element(document.getElementById(id));
            richTextScanDom.children().remove();
            richTextScanDom.append(richTextDom);
        };

    });