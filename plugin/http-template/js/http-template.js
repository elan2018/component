let DOLPHIN_HTTP_TEMPLATE={};
DOLPHIN_HTTP_TEMPLATE.install=function(Vue,options){

    //获取返回的头部信息
    function getHeaderTokenInfo(data,request) {
        checkData(data);
        let param ={};
        if (data.code==0) {
            var key = request.getResponseHeader('resubmit_key');
            var resubmit_token = request.getResponseHeader(key);
            var p = "param." + key + "='" + resubmit_token + "'";
            eval(p);
            p="param.resubmit_key='"+key+"'";
            eval(p);
            return param;
        }
        return null;
    }
    //数据返回格式检查
    function checkData(data){
        if (data.code ==undefined){
            console.error('返回的数据格式错误！需要类似这个格式结构：{code:1,data:"数据内容"}');
            return;
        }
        if (data.code==401){
            if (data.data == null || data.data ==undefined){
                window.parent.location.href = "/login";
            }else {
                window.parent.location.href = data.data;
            }
            return;
        }
    }

    //获取返回的相关信息
    function getHelpInfo(data,infos){
        checkData(data);
        if(data.info===undefined){
            return ""
        }
        if (Object.prototype.toString.call(infos) === '[object Array]') {
            for(let i=0;i<data.info.length;i++ ){
                infos.push(data.info[i]);
            }

        }else{
            console.warn('参数不是一个有效的数组！')
        }
    }

    //保存每个初始post URL的header值
    let init_param=[];

    //初始post请求，向服务器申请post请求
    function initPost(path,csrf_token,req_url){
        let path_key =path.replace(new RegExp('/',"gm"),'_');
        if(init_param[path_key]===undefined) {
            let param = {};
            param.path = path;
            param.csrf_token = csrf_token;
            let url = '/init_post';
            if (req_url && req_url.length > 0) {
                url = req_url;
            }
            $.get({
                url: url, async: false, data: param,
                success: function (data, textStatus, request) {
                    init_param[path_key] = getHeaderTokenInfo(data, request);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(XMLHttpRequest.responseJSON);
                    console.error(XMLHttpRequest.status);
                }
            });
        }
    }
    Vue.prototype.$http=(method,url,param,info,successCallback,errorCallback,sync)=>{
        if(arguments[0]===undefined && method===undefined){
            console.error('missing parameter method');
            return;
        }
        if (arguments[1]===undefined && url===undefined) {
            console.error('missing parameter url');
            return;
        }
        method = method.toLowerCase();
        let isInfo=true;
        let isSync = true;
        let isSuccessCallback =true;
        let isErrorCallback = true;
        if(arguments[3]===undefined && info===undefined) isInfo =false;
        if(arguments[4]===undefined && successCallback===undefined) isSuccessCallback = false;
        if(arguments[5]===undefined && errorCallback===undefined) isErrorCallback =false;
        if(arguments[6]===undefined && sync===undefined) isSync =false;
        if(isSync){
            isSync = sync;
        }
        if(method==='get') {
            $.get({
                url: url, async: isSync, data: param,
                success: function (data, textStatus, request) {
                    if(isInfo) getHelpInfo(data,info);
                    if(isSuccessCallback) successCallback(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(XMLHttpRequest.responseJSON);
                    console.error(XMLHttpRequest.status);
                    if(isErrorCallback) errorCallback(XMLHttpRequest.responseJSON);
                }
            });
        }else if(method==='post'){
            initPost(url,param.csrf_token);
            let path_key =url.replace(new RegExp('/',"gm"),'_');
            $.post({
                url: url, async: isSync, data: param,
                headers: init_param[path_key],
                success: function (data, textStatus, request) {
                    init_param[path_key] = getHeaderTokenInfo(data, request);
                    getHelpInfo(data,info);
                    if(isSuccessCallback) successCallback(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(XMLHttpRequest.responseJSON);
                    console.error(XMLHttpRequest.status);
                    if(isErrorCallback) errorCallback(XMLHttpRequest.responseJSON);
                }
            });
        }
    };
};