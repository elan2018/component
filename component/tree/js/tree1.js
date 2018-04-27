/**
 name:Tree JS
 Ver:1.0
 create:2018-04-16
 update:2018-04-27
 */

Vue.component('item',{
    props:{
        item:{},
        tools:{},
        checkbox:{},
        selValue:{},  //单选的名称
        checked: Boolean,
        value: String
    },
    template:'<div style="position: relative;" v-bind:style="tw(item)" v-bind:id="liItemName + item.id"  v-on:mouseenter="showTool(item.id)" v-on:mouseleave="hideTool(item.id)">'+
        '           <div v-bind:class="initTurnIco(item)"   @click="turn(item)" ></div>'+
        '           <div v-if="checkbox" class="select-input">' +
        '               <input type="checkbox" v-model="item.check" v-on:change="checkClick(item)"/>' +
        '               <div v-bind:class="ifConfirmCheck(item,item.layer)" v-on:click="unConfirmCheckClick(item)">■</div>' +
        '           </div>\n' +
        '           <div v-if="!checkbox" class="select-input">' +
       // '               <div v-bind:class="item.subItem.length>0 ? icon_p_class:icon_c_class" ></div>' +
        '               <input type="radio"  name="tree_select" v-model="selValue.selectId" v-bind:value="item.id"/>' +
        '           </div>\n' +
        '           <div class="info"  v-on:click="selectItem(item)" v-bind:class="selectedStatus(item)">' +
        '               <span v-on:dblclick.stop="editItem" :title="item.name" >{{item.name}}</span>' +
        '               <input type="text" class="edit" style="display:none;" v-bind:style="tw_info(item)" v-model="item.name" v-on:blur="cancelEdit(item)">' +
        '               <div style="padding-left:15px;">{{item.info}}</div>' +
        '               <span id="itemTool" style="display:none;">' +
        '                   <span v-for="tool in tools" class="glyphicon" style="margin:0 10px 0 10px" v-bind:class="tool.src" v-bind:title="tool.info" v-bind:alt="tool.info" v-on:click.stop="doit(tool.id,item)"></span>' +
        '               </span>' +
        '           </div>' +
        '      </div>',
    data:function(){
        return {
            icon_p_class:'icon',
            icon_c_class:'icon_child',
            liItemName:'item',
            selItemId:'',
            timeFn:null,
            sel_item:null,
            sel_info_obj:null,
            sel_item_obj:null,
            item_tab:0

        }
    },

    methods:{
        itemTabId:function(){
          return this.item_tab++;
        },
        tw:function(item){
            var info_w=15;
            if (item.info.length>1){
                info_w = item.info.length*15;
            }
          return {width:(item.name.length*15+info_w+80+this.tools.length*35)+'px'};
        },
        tw_info:function(item){
            return {width:(item.name.length*15+10)+'px'};
        },
        doit:function(id,item){//工具条点击事件
            this.$emit('toolclick',id,item);
        },
        hideTool:function(id) {//隐藏工具条
            var _tar = $(event.target);
             _tar.find('span#itemTool').hide();
        },
        showTool:function(id){//显示工具条
            var _tar = $(event.target);
            _tar.find('span#itemTool').show();
        },
        cancelEdit:function(item){//取消编辑
            $(event.target).prev('span').show();
            $(event.target).hide();

        },
        editItem:function(){//编辑
            clearTimeout(this.timeFn);
            var _tar = $(event.target);
            _tar.hide();
            _tar.siblings('input[type="text"]').show().focus();
        },
        selectedStatus:function(item){//选中节点后，添加选择效果
            if(this.selValue.selectId ==item.id){
                return 'select';
            }
            return '';
        },
        selectItem:function(item){//单击选择事件
            this.selValue.selectName = item.name;
            this.selValue.selectId = item.id;
            //执行延时
            clearTimeout(this.timeFn);
            this.sel_item_obj = $(event.target);
            this.sel_info_obj = $('.info');
            this.sel_item =item;
            this.timeFn = setTimeout(this.doSelectItem, 50);//延时时长设置

        },
        doSelectItem:function(){//实际单击选择处理方法
            if (this.sel_info_obj.hasClass('select')){
                    this.sel_info_obj.removeClass('select');
            }
            this.sel_item_obj.parent().addClass('select');
            this.$emit('click-item',this.sel_item);

        },
        checkClick:function(item){//checkbox的改变事件，

            this.$emit('checkSubItem',item,item.check);
        },
        unConfirmCheckClick:function(item){//半选状态的点击事件，
            if (item.check==false){
                item.check=true;
            }
            this.checkClick(item);
        },
        ifConfirmCheck:function(item,layer){//是否显示半选
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
          }

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
    props: ['items','tools','ifcheck'],
    template: '<div class="tree" >\n' +
    '               <ul style="padding-left:5px;">' +
    '                   <li>' +
    '                       <item :item="myItem" :tools="tools" :checkbox="ifcheck" :selValue="selValue" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem" v-on:click-item="selectItem" v-on:toolclick="toolClick"></item>\n' +
    '                       <ul v-if="myItem.subItem.length>0" >' +
    '                           <li v-for="item2 in myItem.subItem">' +
    '                               <item :item="item2" :tools="tools" :checkbox="ifcheck" :selValue="selValue" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem" v-on:click-item="selectItem" v-on:toolclick="toolClick"></item>\n' +
    '                               <ul v-if="item2.subItem.length>0">' +
    '                                   <li v-for="item3 in item2.subItem">' +
    '                                       <item :item="item3" :tools="tools" :checkbox="ifcheck" :selValue="selValue" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem" v-on:click-item="selectItem" v-on:toolclick="toolClick"></item>\n' +
    '                                       <ul v-if="item3.subItem.length>0">' +
    '                                           <li v-for="item4 in item3.subItem">' +
    '                                                <item :item="item4" :tools="tools" :checkbox="ifcheck" :selValue="selValue" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem" v-on:click-item="selectItem" v-on:toolclick="toolClick"></item>\n' +
    '                                                <ul v-if="item4.subItem.length>0">' +
    '                                                   <li v-for="item5 in item4.subItem">' +
    '                                                       <item :item="item5" :tools="tools" :checkbox="ifcheck" :selValue="selValue" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem" v-on:click-item="selectItem" v-on:toolclick="toolClick"></item>\n' +
    '                                                       <ul v-if="item5.subItem.length>0">' +
    '                                                           <li v-for="item6 in item5.subItem">' +
    '                                                               <item :item="item6" :tools="tools" :checkbox="ifcheck" :selValue="selValue" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem" v-on:click-item="selectItem" v-on:toolclick="toolClick"></item>\n' +
    '                                                               <ul v-if="item6.subItem.length>0">' +
    '                                                                   <li v-for="item7 in item6.subItem">' +
    '                                                                        <item :item="item7" :tools="tools" :checkbox="ifcheck" :selValue="selValue" v-on:turn="showSubItem" v-on:checkSubItem="eachSubItem" v-on:click-item="selectItem"v-on:toolclick="toolClick"></item>\n' +
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
            myItem: [],
            isModify:false,
            init_Status:0,
            infoItemName:'info_item_name',
            selValue:{
                selectName:'',
                selectId:0
            }  //单选的名称
        }
    },
    created:function() {
       this.myItem = this.reve(this.items);
       this.modify =false;
    },
    watch:{
        myItem:{
            handler:function(curVal) {
                if (this.init_Status == 0) {
                    this.init_Status++;
                } else {
                    console.log('修改了树组件.....');
                    this.isModify = true;
                    this.init_Status++;
                }
            },
            deep:true//对象内部的属性监听，也叫深度监听
        }
    },
    methods: {
        getTreeStatus:function(){//获取组件修改状态
            return this.isModify;
        },
        renewTreeStatus:function(){//重置组件初始状态
            this.isModify =false;
            return 'ok';
        },
        toolClick:function(id,item){//工具条单击事件
            this.$emit('toolclick',id,item);
        },
        selectItem:function(item){//单击选择条目事件
           // item.select =true;
          //  console.log('radio');
            this.$emit('select-item',item);
        },
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
            this.renewTreeStatus();
            return item[item.length-1];
        },
        getItemInfoFocus:function(id){
            var item =this.getTreeDataById(id);
            this.selValue.selectName = item.name;
            this.selValue.selectId = item.id;
            return item;
        },
        getTreeDataById:function(id){//根据id查询树节点数据
            var item = this.myItem;
            var result = null;
            result = this.searchSubItem(item,id);
            return result;
        },
        searchSubItem:function(item,id) {//向下遍历查询
            var result=null;
            if (item.id==id){
                return item;
            }
            for (var i=0;i<item.subItem.length;i++) {
               var it =item.subItem[i];
               result = this.searchSubItem(it,id);
               if (result !=null) return result;
            }
            return result;
        },
        getAllTreeData:function(){//获取整个树组件数据
            return this.myItem;
        },
        addSameNode:function(curId,id,name,check,info){//添加同级节点
            var p_item = this.getTreeDataById(curId);
            return this.addChildNode(p_item.pid,id,name,check,info);

        },
        addChildNode:function(curId,id,name,check,info){//添加下级节点
            var item = this.getTreeDataById(curId);
            item.subItem.push({pid:item.id,id:id,name:name,check:check,info:info,layer:item.layer+1,subItem:[]});
            return item;

        },
        updateNodeData:function(curId,name,check,info){//编辑当前节点数据
            var item = this.getTreeDataById(curId);
            item.name = name;
            item.check = check;
            item.info = info;
            return item;
        },
        removeNode:function(id){//删除当前节点，同时子节点
           var item = this.getTreeDataById(id);
           if (item==null) return null;
           var p_item = this.getTreeDataById(item.pid);
           for(var i=0;i<p_item.subItem.length;i++){
               //console.log(i+"="+p_item.subItem[i].id);
               if (p_item.subItem[i].id ==id){
                   p_item.subItem.splice(i,1);
                   return 1;
               }
           }
           return 0;
        },
        reCreateTree:function(item){
            var _item =this.reve(item);
            var treeData = this.getAllTreeData();
            treeData.name = _item.name;
            treeData.id = _item.id;
            treeData.pid = _item.pid;
            treeData.check = _item.check;
            treeData.info = _item.info;
            treeData.layer = _item.layer;
            treeData.subItem = _item.subItem;
        }

    }
});