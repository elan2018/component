let DOLPHIN_HTTP_TEMPLATE={};
DOLPHIN_HTTP_TEMPLATE.install=function(Vue,options){

    //获取返回的头部信息
    function getHeaderTokenInfo(data,request,param) {
        checkData(data);

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
    Vue.prototype.getHelpInfo=(data,infos)=>{
        checkData(data);
        if(data.info==undefined){
            return ""
        }
        if (Object.prototype.toString.call(infos) === '[object Array]') {
            for(let i=0;i<data.info.length;i++ ){
                infos.push(data.info[i]);
            }

        }else{
            console.warn('参数不是一个有效的数组！')
        }
    };
    //获取返回的头部信息
    Vue.prototype.$getHeaderTokenInfo=(data,request,param)=>{
        return getHeaderTokenInfo(data,request, param);
    };
    //初始post请求，向服务器申请post请求
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
                param = getHeaderTokenInfo(data,request,param);
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