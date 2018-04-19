Vue.component('helptools',{
    template:'<span style="display:none"><img  v-for="tool in tools" v-bind:src="tool.src" v-bind:alt="tool.info" v-on:click="doit(tool.id,item)"></span>',
    data:function(){
        return {
            img:''
        }
    },
    model: {
        prop: 'checked',        // 将输入的特性改为checked
        event: 'change'        // 触发的自定义事件类型为change
    },
    props: {
        tools:{},
        item:{},
        checked: Boolean,
        // this allows using the `value` prop for a different purpose
        value: String
    },
    methods:{
        doit:function(id,item){

            this.$emit('toolsdo',id,item);
        }
    }
});
Vue.component('item',{
    props:{
        item:{},
        checked: Boolean,
        // this allows using the `value` prop for a different purpose
        value: String
    },
    template:'<div>'+
    '           <div v-bind:class="initTurnIco(item)"   @click="turn(item)" ></div>'+
    '           <div class="select-input">' +
    '               <input type="checkbox" v-model="item.check" v-on:change="checkClick(item)"/>' +
    '               <div v-bind:class="ifConfirmCheck(item,item.layer)" >■</div>' +
    '           </div>\n' +
    '           <div class="info" >{{item.name}}' +
    '               <div style="padding-left:15px;">{{item.info}}</div>' +
    '           </div>' +
    '         </div>',
    methods:{
        checkClick:function(item){//checkbox改变事件，

            this.$emit('checkSubItem',item,item.check);
        },
        lookUpCheck:function(item){
            var _class='hide';
            var _check = {
                checkNum:0,
                unCheckNum:0,
                totalNum:0
            };
            for(var i=0;i<item.subItem.length;i++){
                _check.totalNum++;
                if (item.subItem[i].check) {
                    _check.checkNum++;
                }else{
                    _check.unCheckNum ++;
                }
                // if (item.subItem[i].subItem.length>0){
                //     var _sub_check= this.lookUpCheck(item.subItem[i]);
                //     if (_sub_check.checkNum>0){
                //         item.check =true;
                //         // if (_sub_check.checkNum == _sub_check.totalNum){
                //         //
                //         // }
                //     }else{
                //         item.check =false;
                //     }
                // }
            }


            return _check;
        },
        ifConfirmCheck:function(item,layer){//是否显示半选
          var _check = this.lookUpCheck(item);
          if (_check.checkNum==0 && _check.totalNum>0){
              item.check =false;
          }
          if (_check.totalNum>0 && _check.checkNum!=_check.totalNum){
              item.check = false;
          }
          if (_check.checkNum>0 && _check.unCheckNum>0){
              return 'checkUnconfirm';
          }else if(_check.checkNum == _check.totalNum && _check.totalNum>0){
              item.check =true;
              return 'hide';
          }
          return 'hide';
        },
        initTurnIco:function(item){//初始是否显示层级图标
            if (item.subItem.length>0){
                return 'turn-open'
            }else{
                return 'turn';
            }
        },
        turn:function(it){//切换层级展开、收缩
            if (it.subItem.length==0) return;
            var _tar = $(event.target);
            if (_tar.hasClass('turn-close')==false){
                _tar.addClass('turn-close');
                _tar.siblings('ul').slideUp(50);

            }else{
                _tar.removeClass('turn-close');
                _tar.addClass('turn-open');
                _tar.siblings('ul').slideDown(50);

            }
            this.$emit('turn',it);
        }
    }
});
/**
 * 目前最多支持7层
 */
Vue.component('tree', {
    props: ['items'],
    template: '<div class="tree">\n' +
    '               <ul>' +
    '                   <li v-for="item1 in myItem">' +
    '                       <item :item="item1" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem" ></item>\n' +
    '                       <ul v-if="item1.subItem.length>0" >' +
    '                           <li v-for="item2 in item1.subItem">' +
    '                               <item :item="item2" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem"></item>\n' +
    '                               <ul v-if="item2.subItem.length>0">' +
    '                                   <li v-for="item3 in item2.subItem">' +
    '                                       <item :item="item3" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem"></item>\n' +
    '                                       <ul v-if="item3.subItem.length>0">' +
    '                                           <li v-for="item4 in item3.subItem">' +
    '                                                <item :item="item4" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem"></item>\n' +
    '                                                <ul v-if="item4.subItem.length>0">' +
    '                                                   <li v-for="item5 in item4.subItem">' +
    '                                                       <item :item="item5" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem"></item>\n' +
    '                                                       <ul v-if="item5.subItem.length>0">' +
    '                                                           <li v-for="item6 in item5.subItem">' +
    '                                                               <item :item="item6" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem"></item>\n' +
    '                                                               <ul v-if="item6.subItem.length>0">' +
    '                                                                   <li v-for="item7 in item6.subItem">' +
    '                                                                        <item :item="item7" v-on:checkSubItem="eachSubItem"></item>\n' +
    '                                                                   </li>' +
    '                                                               </ul>' +
    '                                                           </li>' +
    '                                                       </ul>' +
    '                                                   </li>' +
    '                                                </ul>' +
    '                                           </li>' +
    '                                       </ul>' +
    '                                   </li>' +
    '                               </ul>' +
    '                           </li>' +
    '                       </ul>' +
    '                   </li>' +
    '               </ul>' +
    '          </div>',
    data:function(){
        return {
            myItem:[],
            childItem:[],
            child:true
        }
    },
    created:function() {
        this.myItem = this.reve(this.items);
    },
    methods: {
        eachSubItem:function(item,t) {//向下遍历check

            item.check =t;
            if(item.subItem.length>0) {
                for (var i=0;i<item.subItem.length;i++) {
                    var it =item.subItem[i];
                    it.check =t;
                    if (it.subItem.length > 0) {
                        this.eachSubItem(it,t);
                    }
                }
            }
        },
        showSubItem:function(item){//关闭或打开子级项目，由子组件事件传递
            var _tar=$(event.target).parent().siblings('ul');
            if (_tar.hasClass('hide')){
                _tar.removeClass('hide')
            }else{
                _tar.addClass('hide');
            }
            console.log(item);
        },
        reve:function(item){//转换原始数据为组件的数据格式
            item.sort(function(x, y){
                return x.layer + x.id > y.layer +y.id ? -1:1;
            });
            var itemC = item;
            var itemOk =[];
            for(var t=0;t<item.length;t++){
                for(var f=1;f<itemC.length;f++){
                    if (item[t].pid==itemC[f].id){
                        itemC[f].subItem.push(item[t]);
                        break;
                    }
                }
            }
            itemOk.push(item[item.length-1]);
            return itemOk;
        },
        test:function(){
            this.child =false;
        }
    }
});