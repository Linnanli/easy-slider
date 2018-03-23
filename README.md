# easy-slider

一个简单的图片轮播插件,支持IE9及以上,压缩后代码 2.5kb左右

## demo 地址

[demo](https://linnanli.github.io/simple-slider/index.html)

### 如何使用

 * 引入脚本和样式

``` html
    <script src="../dist/js/slider.js"></script>
    <link rel="stylesheet" href="../dist/style/slider.css">
```

* 标签定义

``` html
    <div id="slider" class="ui-slider">
        <!--slider 子项必须定义class的值为 'ui-slider-item'-->
        <div class="ui-slider-item" data-src='http://xxx.xxx.xx'></div>
        <div class="ui-slider-item" data-src='http://xxx.xxx.xx'></div>
        <div class="ui-slider-item" data-src='http://xxx.xxx.xx'></div>
    </div>
```

* 初始化插件对象

```javascript
    //传入id名称
    var slider = new Slider('slider');
```

### 插件对象 Slider(params)

* 参数 :

    *  {object|string} params

* 返回值 : 返回Slider的实例化对象

* 用法 :

```javascript
// 实例化Slider类
var slider = new Slider('slider');

```

#### 对象参数选项

* 参数名称 : id
    
    * 类型 : string

    * 详细 :

      传入元素的id名称,用以初始化插件.

* 参数名称 : basePath
    
    * 类型 : string

    * 详细 :

      图片地址的基础路径.

* 参数名称 : index
    
    * 类型 : number

    * 详细 :

      初始化页面时,默认展示指定的子项.

      起始索引值为 0.

* 参数名称 : operate
    
    * 类型 : string

    * 详细 :

      手动切换子项时,触发切换事件的事件名称.
      
      限定只能使用  ['click', 'mouseover', 'dblclick'] 三种事件,默认事件click.

* 参数名称 : autoPlay
    
    * 类型 : number

    * 详细 :
      
      当传入autoPlay大于0时,开启自动切换子项功能.

      自动切换最小时间间隔为 1000毫秒.

* 参数名称 : complete
    
    * 类型 : function

    * 详细 :
      
      当插件初始化完成时,调用complete函数


#### 添加自定义事件

* 方法名 : on(name,callback)

    * 参数 : 
      
      {string} name

      {function} callback 

    * 示例 :
      
```javascript
    var slider = new Slider('slider');
    slider.on('toggle',function(){
        //打印当前子项的索引值
        console.log(this.$index);
    });
```

#### 删除自定义事件

* 方法名 : remove(name)

    * 参数 : 
      
      {string} name

    * 示例 :
      
```javascript
    var slider = new Slider('slider');
    slider.remove('toggle');
```

#### 自定义事件类型

* 事件名称 : toggle

    * 详细 :
      
      当切换到下一个子项并且该项的图片加载完成时触发toggle事件.


##### 问题反馈

有BUG可以反馈给我,下面是我的邮箱.

* 邮箱 : 845058952@qq.com
    




      


