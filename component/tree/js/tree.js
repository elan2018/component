Vue.component('helptools',{
    props:['tools','item'],
    template:'<div><img v-for="tool in tools" v-bind:src="tool.src" v-bind:alt="tool.info" v-on:click="doit(tool.id,item)"></div>',
    data:function(){
        return {
            img:''
        }
    },
    methods:{
        doit:function(id,item){

            this.$emit('toolsdo',id,item);
        }
    }
});
Vue.component('tree', {
    props: ['items','tools','initTree'],
    template: '<ul class="tree">\n' +
    '        <li v-for="(item,index) in myItem" v-bind:id="item.id" >\n' +
    '           <div v-bind:class="showSubItemIcon(item.subItem)" @click="turn" ></div>\n' +
    '           <div class="select-input"><input type="checkbox"  v-on:click="selectItem(item)" v-bind:checked="item.check"/></div>\n' +
    '           <div class="info">{{item.name}}<div style="padding-left:15px;">{{item.info}}</div></div>\n' +
    '           <helptools class="tools" v-bind:tools="tools" v-bind:item="item" v-on:toolsdo="doInfo"></helptools>\n' +
    '           <ul v-bind:style="showItem(item.subItem)">\n' +
    '                   <li v-for="(subItem,subIndex) in item.subItem" v-bind:id="subItem.id" >\n' +
    '                       <div v-bind:class="showSubItemIcon(subItem.subItem)" @click="turn" ></div>\n' +
    '                       <div class="select-input"><input type="checkbox" v-on:click="selectItem(subItem)" v-bind:checked="subItem.check"/></div>\n' +
    '                       <div class="info">{{subItem.name}}<div style="padding-left:15px;">{{subItem.info}}</div></div>\n' +
    '                       <helptools class="tools" v-bind:tools="tools" v-bind:item="subItem" v-on:toolsdo="doInfo"></helptools>\n' +
    '                       <tree  v-bind:items="subItem.subItem" v-bind:initTree="false" v-bind:tools="tools" v-on:selects="checkMe" v-on:dome="toolsclick"></tree>\n' +
    '                   </li>\n' +
    '            </ul>' +
    '        </li>\n' +
    '    </ul>',
    data:function(){
        return {
            child_display:true,
            item_turn_class:'turn-open',
            myItem:[]
        }
    },
    created:function() {
        if (this.initTree != false) {

            this.myItem = this.reve(this.items);
        }else{
            this.myItem = this.items;
        }
        console.log(this.myItem);
    },
    methods: {
        doInfo:function(id,item){
            this.$emit('dome',id,item);
        },
        toolsclick:function(id,item){
            this.$emit('dome',id,item);
        },
        checkMe:function(item){
            this.$emit('selects',item);
        },
        reve:function(item){
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
        changeData:function(item,ch1,pid){
            ch1.push({id:item.id,name:item.name,pid:item.pid,layer:item.layer,check:item.check,subItem:[]});
            if (item.subItem == undefined || item.subItem.length==0) return ;
            var subItem = item.subItem;
            for(var i=0;i<subItem.length;i++){
                var it = subItem[i];
                ch1.push({id:it.id,name:it.name,check:it.check,pid:pid,layer:it.layer,info:it.info,subItem:[]});
                if (it.subItem.length>0) {
                    var sub = it.subItem.slice();
                    for (var j = 0; j < sub.length; j++) {
                        this.changeData(sub[j], ch1,sub[j].pid);
                    }
                }
            }

        },
        turn:function(event){//层级展开、收缩
            var item = $(event.target);
            if (item.hasClass('turn-close')==false){
                item.addClass('turn-close');
                item.siblings('ul').slideUp(300);

            }else{
                item.removeClass('turn-close');
                item.addClass('turn-open');
                item.siblings('ul').slideDown(300);
            }
        },
        selectItem:function(item){//点击check
            var _tar = event.target;
            var it= $(_tar);

            if (_tar.checked){
                this.eachSubItem(item,true);
                //   it.parent().siblings('ul').find('input[type="checkbox"]').prop('checked',true);

            }else{
                this.eachSubItem(item,false);
                //   it.parent().siblings('ul').find('input[type="checkbox"]').prop('checked',false);

            }
            var returnItem =[];
            this.changeData(item,returnItem,item.pid);
            this.$emit('selects',returnItem);

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
        eachParentItem:function(item,t){//向上遍历check

        },
        showItem:function(item){//初始，是否有子级并显示子级
            if (item == undefined) return {display:'none'};
            if (item.length>0){
                if (this.child_display){
                    return {display:'block'};
                }
            }
            return {display:'none'};
        },
        showSubItemIcon:function(item){//初始，是否有子级并显示子级图标
            if (item==undefined) return 'turn';
            if (item.length>0){
                if (this.child_display){
                    return 'turn-open';
                }else{
                    return 'turn-close';
                }
            }
            return 'turn';
        }
    }
});