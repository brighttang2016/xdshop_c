/**
 * Created by pujjr on 2017/7/19.
 */

angular.module('com.app.publish.service')
    .service('CkeditorService',function(TlmsRestangular) {

        this.updateCkeditor = function(ckEditorId,updateHtml){

            if(CKEDITOR.instances[ckEditorId]){//如果CKEDITOR已经创建存在则执行destroy
                CKEDITOR.instances[ckEditorId].destroy();
            }
            CKEDITOR.replace(ckEditorId);
            CKEDITOR.instances[ckEditorId].setData(updateHtml);
        };

        /**
         * CKEditor初始化
         * @param ckEditorId ckEditor Id
         * @param initHtml 初始HTMl
         * @param height 高度
         */
        this.initCkeditor = function(ckEditorId,initHtml,height){

            if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
                CKEDITOR.tools.enableHtml5Elements( document );

            CKEDITOR.config.height = 350;
            CKEDITOR.config.width = 'auto';

            var wysiwygareaAvailable = this.isWysiwygareaAvailable();
            isBBCodeBuiltIn = !!CKEDITOR.plugins.get( 'bbcode' );

            var editorElement = CKEDITOR.document.getById(ckEditorId);
            // editorElement.setData("<div style=\"border:1px solid red\">66666666666666</div>");
            editorElement.setHtml(initHtml);
          /*  editorElement.setHtml(
                '<div style="border:1px solid red">66666666666666</div>\n\n' +
                'I\'m an instance of [url=https://ckeditor.com]CKEditor[/url].'
            );
            */
            /*if ( isBBCodeBuiltIn ) {
                editorElement.setData(
                    '<div style="border:1px solid red">66666666666666</div>\n\n' +
                    'I\'m an instance of [url=https://ckeditor.com]CKEditor[/url].'
                );
            }*/

            // Depending on the wysiwygare plugin availability initialize classic or inline publishRule.
            if ( wysiwygareaAvailable ) {
                CKEDITOR.replace(ckEditorId);
            } else {
                editorElement.setAttribute( 'contenteditable', 'true' );
                CKEDITOR.inline(ckEditorId);

                // TODO we can consider displaying some info box that
                // without wysiwygarea the classic publishRule may not work.
            }

        };

        this.isWysiwygareaAvailable= function(){
            if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
                return true;
            }
            return !!CKEDITOR.plugins.get( 'wysiwygarea' );
        };
    });
