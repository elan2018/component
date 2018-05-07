## Tree v2.0
> create：2018-04-17 <br>
> update：2018-04-28 <br>
> author: 廖永生

### 更新
1.2018-04-28
* 修正空数据的问题
* 解决初始时，网络请求数据后，不同步更新树的问题

2. 2018-05-02
* 添加快速节点定位显示功能（在原获取节点焦点方法上优化）

### 用法

```
1、树组件标签：<tree></tree>
   <tree
       ref="tree"                          --引用树组件的名称
       v-bind:items="tree.item"            --树组件的数据
       v-bind:ifcheck="true"               --是否显示checkbox
       v-on:select-item="clickSelectItem"  --单击节点方法
       v-bind:tools="toolsList"            --工具条数据
       v-on:toolclick="toolsClick">        --工具条的单击方法
   </tree>
```
```
2、树组件扩展方法：
   this.$refs.tree.getTreeStatus();        --获取树的编辑状态
   this.$refs.tree.renewTreeStatus();      --初始树的编辑状态
   this.$refs.tree.getAllTreeData();       --获取所有节点数据
   this.$refs.tree.getTreeDataById(111);   --根据id获取节点数据
   this.$refs.tree.getItemInfoFocus(11);   --根据id选择节点，并返回当前节点数据
   this.$refs.tree.addSameNode(111,113,'我是同级新增的',false,'0人');  --添加同级数据,addSameNode(当前Id,添加的id,名称,check，信息)
   this.$refs.tree.addChildNode(111,1112,'我是子级新增的',false,'0人'); --添加子级节点,addChildNode(当前Id,添加的id,名称,check，信息)
   this.$refs.tree.removeNode(111111);        --删除当前节点;removeNode(当前Id)
   this.$refs.tree.updateNodeData(112,'我是更新的',true,'10人');     --更新当前节点;updateNodeData(当前Id,名称,check，信息)
```
### 例子
[查看完整的例子](https://github.com/elan2018/component/blob/master/component/tree/tree1.html)
```
<div id="tree" style="margin:3px;padding:5px;">
    <div>
        <label>{{title}}</label>
    </div>
    <div style="width:350px;height:300px;border:1px solid #dddddd;float:left;overflow: auto;">
        <tree
            ref="tree"
            v-bind:items="tree.item"
            v-bind:ifcheck="false"
            v-on:select-item="clickSelectItem"
            v-bind:tools="toolsList"
            v-on:toolclick="toolsClick">
        </tree>
    </div>
    <div style="float:left;margin-left:20px;">
            <button  @click="getStatus">获取树的编辑状态</button><br>
            <button  @click="initStatus">初始树的编辑状态</button><br>
            <button  @click="change">改变树(导入新数据)</button><br>
            <button  @click="selected">选择节点</button><br>
            <button  @click="add">添加同级数据</button><br>
            <button  @click="addChild">添加子级数据</button><br>
            <button  @click="update">修改当前数据</button><br>
            <button  @click="remove">删除当前数据</button><br>
            <label id="info"></label>
    </div>
</div>
<!--注意引用路径 -->
<script src="/js/jquery-3.3.1.min.js"></script>
<script src="/js/vue.js"></script>
<script src="js/tree1.js"></script>
<script src="https://cdn.bootcss.com/vue-resource/1.5.0/vue-resource.min.js"></script>
<script>
    var lys_tree = new Vue({
            el: '#tree',
                data: {
                    tree:
                        {
                            item:
                                []
                        },
                    title: '树形组件',
                    toolsList: [//工具条,src为自定义的样式class名称
                                    {id: 1, info: '复制', src: 'glyphicon-save-file'},
                                    {id: 2, info: '删除', src: 'glyphicon-remove'}
                                ],
                    l_TreeStatus:{
                        changeNum:0
                    }//监听对象
                },
                created:function(){
                   var load = setTimeout(this.loadData,50);//模拟网络请求(延时请求）
                },
                watch:{
                    l_TreeStatus:{
                        handler:function(val){
                            if (this.l_TreeStatus.changeNum>0) {
                                this.$refs.tree.reCreateTree(this.tree.item);//更新树
                            }
                        },
                        deep:true
                    }
                },
                methods: {
                    loadData:function(){
                        console.log('初始加载树，从后端获取数据.......');
                        var item =
                            [
                                {id: 1, name: "公司名称", check: false, pid: 0, layer: 0, info: '', subItem: []},
                                {id: 11, name: "部门1", check: false, pid: 1, layer: 1, info: '10人', subItem: []},
                                {id: 111, name: "子部门1", check: true, pid: 11, layer: 2, info: '5人', subItem: []},
                                {id: 1111, name: "孙子部门1", check: true, pid: 111, layer: 3, info: '5人', subItem: []},
                                {id: 11111, name: "曾孙子部门1", check: true, pid: 1111, layer: 4, info: '5人', subItem: []},
                                {id: 11112, name: "曾孙子部门2", check: true, pid: 1111, layer: 4, info: '5人', subItem: []},
                                {id: 111111, name: "曾孙子部门11", check: true, pid: 11111, layer: 5, info: '5人', subItem: []},
                                {id: 112, name: "子部门2", check: false, pid: 11, layer: 2, info: '10人', subItem: []},
                                {id: 12, name: "部门2", check: true, pid: 1, layer: 1, info: '10人', subItem: []}
                            ];
                        if (this.tree.item.length>0){
                            this.tree.item.splice(0,this.tree.item.length);
                        }
                        for(var i=0;i<item.length;i++){
                            this.tree.item.push(item[i]);
                        }
                        this.l_TreeStatus.changeNum ++;//如果要改变整棵树的数据，需要加这个
    
                    },
                    getStatus:function(){
                        $("#info").html('当前树组件的数据是否被修改：'+this.$refs.tree.getTreeStatus());
                    },
                    initStatus:function(){
                        $("#info").html('初始状态'+this.$refs.tree.renewTreeStatus());
                    },
                    add:function(){
                        this.$refs.tree.addSameNode(111,113,'我是同级新增的',false,'0人');
                    },
                    addChild:function(){
                        this.$refs.tree.addChildNode(111,1112,'我是子级新增的',false,'0人');
                    },
                    selected:function(){
                        this.$refs.tree.getItemInfoFocus(11);
                    },
                    update:function(){
                        this.$refs.tree.updateNodeData(112,'我是更新的',true,'10人');
                    },
                    remove:function () {
                        this.$refs.tree.removeNode(111111);
                    },
                    change: function () {//改变整个树，重新导入数据
                        var item =
                            [
                                {id: 1, name: "aa名称", check: false, pid: 0, layer: 0, info: '20人', subItem: []},
                                {id: 11, name: "bb门1", check: false, pid: 1, layer: 1, info: '10人', subItem: []},
                                {id: 12, name: "bb部门2", check: true, pid: 1, layer: 1, info: '10人', subItem: []}
                            ];
                        if (this.tree.item.length>0){
                            this.tree.item.splice(0,this.tree.item.length);
                        }
                        for(var i=0;i<item.length;i++){
                            this.tree.item.push(item[i]);
                        }
                        this.l_TreeStatus.changeNum++; //改变整棵树的数据，需要加这个
                    },
                    clickSelectItem: function (item) {//单击条目，返回选择条目的本身及其子级,此方法
                        console.log('单击选择，item为返回的数据');
                        console.log(item);
                    },
                    toolsClick: function (id, item) {//点击工具按钮，返回的数据
                        console.log('tools-click:' + id);
                        switch (id) {
                            case 1://添加，根据I的判断功能，功能自定义
                                console.log('添加');
                                break;
                            case 2://删除
                                console.log('删除');
                                break;
                            default:
                                console.log('其他');
                        }
                    }
    
                }
            }
    );
</script>
```
## lazy-load v1.0
> create：2018-05-04 <br>
> author: 廖永生 <br>
> description:延时加载图片，当滚动到图片元素时，才请求加载图片，未加载完成时，可以显示随机颜色或loading图片,删除图片数据后，会显示空白图
### 更新
1.2018-05-04
* 创建
* 开发版

### 用法
``` 
基本(未加载时，显示默认图片）：
<img id="img1" v-lazy-load="'pic.jpg'">
默认随机颜色：
<img id="img1" v-lazy-load:color="'pic.jpg'">

```
### 例子
[查看完整的例子](https://github.com/elan2018/component/blob/dev2.1/component/lazy-load/lazy-load.html)
```
<div id="app" class="container-fluid ">
    <div class="row">

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3">
            <img id="img1" class="lazy" v-lazy-load:color.debug="pic[0]">


            <img id="img2" class="lazy" v-lazy-load:blank="pic[1]">


            <img id="img3" class="lazy" v-lazy-load:blank="pic[2]">

            <img id="img4" class="lazy" v-lazy-load:color="pic[3]">


            <img id="img5" class="lazy" v-lazy-load:color="pic[4]">


            <img id="img6" class="lazy" v-lazy-load:blank="pic[5]">


            <img id="img7" class="lazy" v-lazy-load:color="pic[4]">


            <img id="img8" class="lazy" v-lazy-load:color="pic[5]">
        </div>
    </div>
</div>
<script src="../../js/jquery-3.3.1.min.js"></script>
<script src="../../js/vue.js"></script>
<script src="js/lazy-load.js"></script>
<script>
    let lazy = new Vue({
        el: '#app',
        data: {

            pic: ['../../images/1.jpg', '../../images/2.jpg', '../../images/3.jpg', '../../images/4.jpg', '../../images/5.jpg', '../../images/6.jpg'],

        }
    });

</script>

```