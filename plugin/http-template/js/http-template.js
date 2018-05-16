let DOLPHIN_HTTP_TEMPLATE={};
DOLPHIN_HTTP_TEMPLATE.install=function(Vue,options){
    function getHeaderTokenInfo(request,param) {
        var key = request.getResponseHeader('resubmit_key');
        var resubmit_token = request.getResponseHeader(key);
        console.log(key, resubmit_token);
        var p = "param." + key + "='" + resubmit_token + "'";
        eval(p);
        p="param.resubmit_key='"+key+"'";
        eval(p);
        return param;
    }
    Vue.prototype.$getHeaderTokenInfo=(request,param)=>{
        return getHeaderTokenInfo(request,param);
    };
    Vue.prototype.$postInit=(path,csrf_token,req_url)=>{
        let param ={};
        param.path=path;
        param.csrf_token=csrf_token;
        let url='/init_post';
        if(req_url && req_url.length>0){

            url=req_url;
        }
        $.get({url:url,async:false,data:param,
            success:function (data,textStatus,request) {
                if(data.code==0) {
                    param = getHeaderTokenInfo(request,param);
                }else{
                    console.error(data);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown) {
                console.error(XMLHttpRequest.status);
                console.error(XMLHttpRequest.readyState);
                console.error(textStatus);
            }
        });
        return param;
    };
};