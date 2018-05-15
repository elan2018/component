let Dolphin_Mask_Loading ={};
Dolphin_Mask_Loading.install=function(Vue,options){
    // // 1. 添加全局方法或属性
    // Vue.myGlobalMethod = function () {
    //     // 逻辑...
    // };
    // // 2. 添加全局资源
    // Vue.directive('my-directive', {
    //     bind:function(el, binding, vnode, oldVnode) {
    //         // 逻辑...
    //     }
    //
    // });
    // // 3. 注入组件
    // Vue.mixin({
    //     created: function () {
    //         // 逻辑...
    //     }
    //
    // });
    // // 4. 添加实例方法
    // Vue.prototype.$myMethod = function (methodOptions) {
    //     // 逻辑...
    // };
    let opt = {
        defaultElement:'body'   // 默认显示位置

    };
    for(let property in options){
        opt[property] = options[property];  // 使用 options 的配置
    }
    let covered = document.body;
    Vue.prototype.$mask_loading=(ele)=>{

        if(ele){//元素ID
            opt.defaultElement = ele;
            covered = document.getElementById(opt.defaultElement);
        }
        let toastTpl = Vue.extend({
            template:
                    '<div  style="position:absolute;display:none;" @click.stop="clickme">'+
                            '<div style="background:rgba(0,0,0,0.3);position: absolute;top:0;left:0;z-index: 999;width:100%;height:100%;opacity: 0.3;" ></div>'+
                            '<div id="load" @click.stop="clickme" style="position:relative;z-index: 9999;">' +
                                '<div id="animation" class="circle-loader">\n' +
            '    <div class="circle-line">\n' +
            '        <div class="circle circle-blue"></div>\n' +
            '        <div class="circle circle-blue"></div>\n' +
            '        <div class="circle circle-blue"></div>\n' +
            '    </div>\n' +
            '    <div class="circle-line">\n' +
            '        <div class="circle circle-yellow"></div>\n' +
            '        <div class="circle circle-yellow"></div>\n' +
            '        <div class="circle circle-yellow"></div>\n' +
            '    </div>\n' +
            '    <div class="circle-line">\n' +
            '        <div class="circle circle-red"></div>\n' +
            '        <div class="circle circle-red"></div>\n' +
            '        <div class="circle circle-red"></div>\n' +
            '    </div>\n' +
            '    <div class="circle-line">\n' +
            '        <div class="circle circle-green"></div>\n' +
            '        <div class="circle circle-green"></div>\n' +
            '        <div class="circle circle-green"></div>\n' +
            '    </div>\n' +
            '</div>' +
                            '</div>'+
                    '</div>',
            methods:{
                clickme:function(){
                    console.log('clickme');
                }
            }
        });
        let cover = new toastTpl().$mount().$el;
        let load = cover.querySelector("#load");

        cover.id="cover"+opt.defaultElement;
        covered.appendChild(cover);
        let top =covered.getBoundingClientRect().top;
        let left = covered.getBoundingClientRect().left;
        let width = covered.getBoundingClientRect().width;
        let height = covered.getBoundingClientRect().height;

        cover.style.width=width +"px";
        cover.style.height=height+"px";
        cover.style.top = top +"px";
        cover.style.left = left +"px";
        cover.style.display = "block";
        if (height>400 && width>500){
            load.style.width =width+"px";
            load.style.height = height+"px";
            load.style.backgroundSize="100px 140px";
           // load.style.background="url(loading1.gif) no-repeat center ";
        }else if(width>400){
            load.style.width =width+"px";
            load.style.height = height+"px";
            if (height>50) {
                load.style.backgroundSize="48px 48px";
            }else{
                load.style.backgroundSize=""+(height-5)+"px "+(height-5)+"px";
            }
           // load.style.background="url(load1.gif) no-repeat center ";
        }else{
            load.style.width =width+"px";
            load.style.height=height+"px";
            load.querySelector("#animation").style.display="none";
            load.style.backgroundSize=""+(width-5)+"px "+(width-5)/50*10+"px";
            load.style.background="url(load3.gif) no-repeat center ";
        }
    };
    Vue.prototype.$mask_loading_close=()=>{
        let cover = document.getElementById("cover"+opt.defaultElement);
        if (cover) {
            covered.removeChild(cover);
        }
    }
};