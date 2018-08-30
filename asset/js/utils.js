/**
 * Created by pujjr on 2017/5/9.
 */
/**
 * 设置cookie值
 * @param name cookie键名
 * @param value cookie键对应值
 * @param expire cookie超时时间
 */
function setCookie(name,value,expire){
    console.log("setCookie,"+"name:"+name+",value:"+value+",expire:"+expire);
    var timeNow = new Date();
    var expireTime = new Date();
    expireTime.setTime(expire);
    //document.cookie=name+"="+value+";expires="+expireTime.toGMTString();
    //console.log("expire:"+expire+",expireTime:"+expireTime);
    //document.cookie=name+"="+value+";expires="+expireTime;
    //document.cookie="expireTime="+expire+";expires="+expireTime;

    //document.cookie=name+"="+value+";expireTime:"+new Date();
    document.cookie=name+"="+value+";expires="+expireTime.toGMTString();
    //document.cookie=name+"="+value+";expires="+expireTime.toTimeString();
    console.log(document.cookie);
}

/**
 * 获取cookie值
 * @param name
 * @returns {*}
 */
function getCookie(name){
    //alert("utils.js->getCookie");
    //console.log("utils.js->getCookie");
    //console.log(name);
    var start = 0;
    var end = 0;
    var value = null;
    if(document.cookie.length > 0){
        /*start =  document.cookie.indexOf(name+"=");
         console.log("0123456".substring());
         if(start != -1){
         console.log("start:"+start);
         end = document.cookie.indexOf(";",start + name.length + 1);
         console.log("end:"+end);
         if(end != -1)
         value = document.cookie.substring(start + name.length+1,end);
         else
         value = document.cookie.substring((start + name.length + 1,document.cookie.length));
         console.log(name+":"+value);
         }*/
        var pairs = document.cookie.split(";");
        //console.log("pairs:"+pairs);
        for(var i = 0;i < pairs.length;i++){
            var pair = pairs[i];
            //console.log(i+":"+pair);
            var keyValue = pair.split("=");
            //console.log("keyValue[0]:"+keyValue[0]);
            if(name == keyValue[0].trim()){
                value = keyValue[1];
                //console.log(name+":"+value);
            }
        }
    }
    return value;
}

function printCookie(){
    //console.log("document.cookie:"+document.cookie);
}


