let Dolphin_Loading ={
    create:function(options){
        let mask_loading = {};

        mask_loading.opt = {
            defaultElement:['body'],   // 默认显示位置
            animationId:0,
            debug:false

        };
        for(let property in options){
            mask_loading.opt[property] = options[property];  // 使用 options 的配置
        }

        mask_loading.coverName="cover_";
        mask_loading.loading=(ele,animation_Id)=>{
            if(mask_loading.opt['debug']) {
                console.log('创建...', ele);
            }
            let covered = document.body;
            let cur="body";
            if(ele){//需要遮罩的元素ID
                mask_loading.opt.defaultElement.push(ele);
                cur = ele;
                covered = document.getElementById(cur);
            }
            let top =covered.getBoundingClientRect().top;
            let left = covered.getBoundingClientRect().left;
            let width = covered.getBoundingClientRect().width;
            let height = covered.getBoundingClientRect().height;
            let scrollTop =document.documentElement.scrollTop;
            let scrollLeft = document.documentElement.scrollLeft;
            let animationId=mask_loading.opt['animationId'];
            if (animation_Id){
                animationId=animation_Id;
            }
            if (animationId==0) {
                if (height > 400 && width > 500) {
                    animationId=1;
                } else if (width > 200) {
                    animationId=2;
                } else if (width > 100){
                    animationId=3;
                }else{
                    animationId=4;
                }
            }
            let mask = new mask_face(
                {
                    propsData:{
                        aniId:animationId
                    }
                }).$mount().$el;
            let load = mask.querySelector("#load");
            let animation = mask.querySelector("#animation");
            if (animationId==1){
                animation.style.marginLeft=((width-150)/2)+"px";
                animation.style.marginTop="0px";
                animation.style.width="150px";
                animation.style.height="150px";

            }else if(animationId==2){
                animation.style.marginLeft=((width-150)/2)+"px";
                animation.style.marginTop=((height-150)/2+0)+"px";
                animation.style.width="150px";
                animation.style.height="150px";

            }else if (animationId==3){
                animation.style.marginLeft=((width-50)/2)+"px";
                animation.style.marginTop=((height-50)/2+0)+"px";
                animation.style.width="50px";
                animation.style.height="50px";
            }else{
                animation.style.marginLeft=((width-60)/2)+"px";
                animation.style.marginTop=((height-20)/2+0)+"px";
                animation.style.width="60px";
                animation.style.height="20px";
            }
            mask.id=mask_loading.coverName+cur;
            document.body.appendChild(mask);
            mask.style.width=width +"px";
            mask.style.height=height+"px";
            mask.style.top = (top +scrollTop)+"px";
            mask.style.left = (left + scrollLeft)+"px";
            mask.style.display = "block";
            load.style.width =width+"px";
            load.style.height = height+"px";

        };
        mask_loading.loading_close=(ele)=>{

            let cover = document.getElementById(mask_loading.coverName+ele);
            if (cover) {
                document.body.removeChild(cover);
            }
        };

        return mask_loading;
    }
};
let mask_face = Vue.extend({
    props:['aniId'],
    template:
    '<div class="mask_parent" @click.stop="clickme">'+
    '   <div class="mask" ></div>'+
    '   <div class="mask_ani_layer"  id="load"  @click.stop="clickme" >' +
    '       <load-ani id="animation"  :name="aniId"></load-ani>' +
    '   </div>'+
    '</div>',
    methods:{
        clickme:function(){
            console.log('请稍等............');
        }
    }
});

Vue.directive('mask-load', {
    bind: function (el, binding, vnode) {
        if (binding.modifiers.debug==true) {
            console.log('bind');
        }

    },
    inserted: function (el, binding, vnode) {
        if (binding.modifiers.debug==true) {
            console.log('inserted',el);
        }

        let val = binding.value;

        function defaultCallBack(){
            console.log('没有添加回调方法！参考:{callback:method}');
        }
        let opt ={
            callback:defaultCallBack,
            request:{},
            self:true,
            maskArea:{},
            animationId:0
        };
        for(let property in val){
            opt[property] = val[property];  // 使用 options 的配置
        }
        let mask_load = Dolphin_Loading.create({animationId:opt['animationId'],maskArea:opt['maskArea'],debug:binding.modifiers.debug});
        if (binding.modifiers.debug==true) {
            console.log('初始URL：', opt['request'].url);
            console.log('初始参数：', opt['request'].data);
        }
        function req(option,dataArea){//请求方法
            let closeMask=function () {

            };
            if (dataArea){
                closeMask=function () {
                    mask_load.loading_close(el.id);
                    if (dataArea) {
                        for (let n in dataArea) {
                            mask_load.loading_close(dataArea[n].name);
                        }
                    }
                }
            }
            if(option['request']) {
                let request =option['request'];
                if (request.url==undefined){
                    console.error('无效的URL!');
                    if (opt['self']) {
                        mask_load.loading_close(el.id);
                    }
                    closeMask();
                    return;
                }
                let method;
                if (request.method) {
                    method = request.method;
                    let ajax_call={
                        url: option['request'].url, data: option['request'].data,
                        success: function (result,textStatus,request) {
                            if (binding.modifiers.debug==true) {
                                console.log('ajax请求完成');
                            }
                            if (opt['self']) {
                                mask_load.loading_close(el.id);
                            }
                            closeMask();
                            if (result.code==undefined || result.message==undefined || result.data==undefined){
                                console.warn('数据返回格式错误！',result);
                            }
                            if(method=='post'){
                                option['callback'](result,request);
                            }else {
                                option['callback'](result);
                            }
                        },
                        error:function(XMLHttpRequest, textStatus, errorThrown){
                            console.error(XMLHttpRequest.status);
                            console.error(XMLHttpRequest.readyState);
                            console.error(textStatus);
                            closeMask();
                        }
                    };
                    switch (method){
                        case 'get':
                            $.get(ajax_call);
                            break;
                        case 'post':
                            $.post(ajax_call);
                            break;
                    }
                }
            }else{
                closeMask();
            }
        }
        let event = binding.arg;el.removeEventListener(event,function () {

        });
        el.addEventListener(event,function(){
            if (!el.id) {
                el.id="_id_"+Math.floor(Math.random()*100000);
            }
            if (opt['self']) {
                mask_load.loading(el.id,opt['animationId']);
            }
            let dataArea;
            if (opt['maskArea']){
                dataArea = opt['maskArea'];
                for(let n in dataArea) {
                    mask_load.loading(dataArea[n].name,dataArea[n].animationId);
                }

            }
            if (binding.modifiers.debug==true) {
                console.log('执行URL：', opt['request'].url);
                console.log('执行参数：', opt['request'].data);
            }
            req(opt,dataArea);

        });

    },
    update: function (el, binding, vnode, oldVnode) {
        if (binding.modifiers.debug==true) {
            console.log('update',el);
        }
        

    },
    componentUpdated: function (el, binding, vnode) {
        if (binding.modifiers.debug==true) {
            console.log('componentUpdated',el);
        }


    },
    unbind: function (el, binding, vnode) {
        if (binding.modifiers.debug==true) {
            console.log('unbind');
        }

    }
});

Vue.component('load-ani',Vue.extend({
    props:['name'],
    template:
            '<div>' +
            '   <div class="circle-loader" v-if="name == 1">' +
            '       <div class="circle-line">\n' +
            '           <div class="circle circle-blue"></div>\n' +
            '           <div class="circle circle-blue"></div>\n' +
            '           <div class="circle circle-blue"></div>\n' +
            '       </div>\n' +
            '       <div class="circle-line">\n' +
            '           <div class="circle circle-yellow"></div>\n' +
            '           <div class="circle circle-yellow"></div>\n' +
            '           <div class="circle circle-yellow"></div>\n' +
            '       </div>\n' +
            '       <div class="circle-line">\n' +
            '           <div class="circle circle-red"></div>\n' +
            '           <div class="circle circle-red"></div>\n' +
            '           <div class="circle circle-red"></div>\n' +
            '       </div>\n' +
            '       <div class="circle-line">\n' +
            '           <div class="circle circle-green"></div>\n' +
            '           <div class="circle circle-green"></div>\n' +
            '           <div class="circle circle-green"></div>\n' +
            '       </div>\n' +
            '   </div>' +
            '   <div id="vagueLayer" style="" v-if="name ==2">\n' +
            '       <div id="vagueload">\n' +
            '           <p>loading</p>\n' +
            '       </div>\n' +
            '       <div id="vague">\n' +
            '           <div id="vague1"></div>\n' +
            '           <div id="vague2"></div>\n' +
            '           <div id="vague3"></div>\n' +
            '           <div id="vague4"></div>\n' +
            '           <div id="vague5"></div>\n' +
            '           <div id="vague6"></div>\n' +
            '       </div>' +
            '   </div>' +
            '   <div class="loader3"  v-if="name ==3">\n' +
            '       <span></span>\n' +
            '       <span></span>' +
            '   </div>' +
            '   <div class="loader1"  v-if="name ==4">'+
            '       <span></span>'+
            '       <span></span>'+
            '       <span></span>'+
            '</div>' +
            '</div>'
}));