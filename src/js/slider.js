; (function (factory) {
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(void 0);
    } else {
        window.Slider = factory(void 0);
    }

    console[console.info?'info':'log'](
        "project:'simple-slider',\n"+
        "author:'林楠楠的脚趾有点咸',\n"+
        "email:845058952@qq.com"
    );
})(function (undefined) {
    'use strict';

    var $ = Slider,
        eventHandler = { 'toggle': [], 'complete': [] },
        dataType = {},
        core_arr = [],
        datasetRegExp = /^data-(.+)/,//判断属性是否是setdata
        fCamelCase = /-([\da-z])/gi,//
        MINIMUM_INTERVAL = 1000,//允许设置轮播最小时间间隔
        EVENT_TYPE = ['click', 'mouseover', 'dblclick'],//轮播图支持的事件类型
        SLIDER_ITEM_TAG = ['div', 'a', 'p','li'],//支持轮播项的标签类型
        SLIDER_BOX_CLASS = 'ui-slider',//轮播盒子DOM的class
        SLIDER_ITEM_CLASS = 'ui-slider-item',//轮播项DOM的class
        SLIDER_BUT_BOX_CLASS = 'ui-slider-but-list',//按钮盒子的class
        SLIDER_BUT_ITEM_CLASS = 'ui-slider-but-item',//按钮项的class
        SLIDER_ITEM_IMG_CLASS = 'ui-slider-img';//轮播项图片

    //设置各个对象的值用来判断对象的类型
    ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"].forEach(function (name, index) {
        dataType["[object " + name + "]"] = name.toLowerCase();
    });
    //判断数据类型
    function type(obj) {
        return dataType[dataType.toString.call(obj)];
    }


    //轮播图组件构造函数
    function Slider(params) {
        var id = '';
        if ($.type(params) === 'string') {
            id = params;
        } else if ($.type(params) === 'object') {
            id = params['id'];
        }

        this.$id = id;
        this.$basePath = $.basePath,//设置基础路径
        this.$element = document.getElementById(id);
        this.$sliderItem = null;
        this.$index = $.index || 0;
        this.$operate = $.operate || EVENT_TYPE[0];
        this.$autoPlay = $.autoPlay || 0;
        this.$lazyload = true;//默认懒加载,不可修改
        this.$itemLen = 0;
        this.$toggleBut = [];

        _listenerWindowResize.call(this);
        this.init(params);
    }

    Slider.prototype = {
        version: '1.0.0',
        constructor: Slider,
        init: function (params) {
            if (!this.$element) {
                throw new Error('element not found');
            }
            //定义sliderbox的class
            this.$element.className = SLIDER_BOX_CLASS;

            //设置传入参数
            $.merge(this, $.getDataset(this.$element), function (val, name, options) {
                if (this['$' + name] !== undefined)
                    this['$' + name] = val;
                return false;
            });
            $.merge(this, params, function (val, name, options) {
                if (this['$' + name] !== undefined)
                    this['$' + name] = val;
                return false;
            });

            //限定默认事件
            this.$operate = EVENT_TYPE.indexOf(this.$operate) !== -1 ? this.$operate : EVENT_TYPE[0];
            //轮播图生成完毕的事件钩子
            this.on('complete', params.complete);
            //创建DOM,设置初始化轮播图焦点,开启自动轮播
            this.$createTag(params).$toggle().$togglePlay();
        },
        on: function (name, handler) {
            if (eventHandler[name] !== undefined && typeof handler === 'function') {
                eventHandler[name].push(handler);
            }
            return this;
        },
        trigger: function (name, data) {
            var handlers = eventHandler[name];
            if (handlers !== undefined && handlers instanceof Array) {
                for (var i = 0; i < handlers.length; i++) {
                    if (typeof handlers[i] === 'function')
                        handlers[i].apply(this, arguments);
                }
            }
            return this;
        },
        remove: function (name, handler) {
            var handlers = eventHandler[name];
            if (handlers !== undefined && handlers instanceof Array) {
                for (var i = 0; i < handlers.length; i++) {
                    if (handlers[i] === handler)
                        handlers.splice(i, 1);
                }
            }
            return this;
        },
        $createTag: function (params) {
            if (this.$sliderItem && this.$sliderItem.length > 0) return this;
            var _this = this;
                
            if ($.type(params.data) === 'array') {
                this.$element.innerHTML = '';
                this.$sliderItem = _createItemTag.call(this, params.data, function () {
                    _this.$element.appendChild(this);
                });
            } else if (params.data === undefined) {
                var index = 0;
                this.$sliderItem = $.getChildren(this.$element, function () {
                    this.setAttribute('data-index', index++);
                });
            }
            this.$itemLen = this.$sliderItem.length;
            this.$element.appendChild(_createBut.call(this));
            //触发生成完毕事件
            this.trigger('complete');
            return this;
        },
        $toggle:function(){
            this.$index = (this.$index > this.$itemLen - 1 || this.$index < 0) ? 0 : this.$index;
            this.$sliderItem[0].style.marginLeft = -(this.$element.offsetWidth * this.$index) + 'px';
            //加载图片
            _loadImg.call(this,this.$index,function(){
                this.trigger('toggle', this.$index);
            });
            return this;
        },
        $togglePlay: function () {
            if (this.$sliderItem.length === 0) 
                throw new Error('item is 0 in length');

            var _this = this;
            if (this.$autoPlay) {
                //清除上一个定时器
                this.$toggleStop();
                this.$togglePlay.$time = setInterval(function () {
                    //当切换到最后一项时切换
                    _this.$index = _this.$index == _this.$itemLen - 1 ? 0 : ++_this.$index;
                    _this.$sliderItem[0].style.marginLeft = -(_this.$element.offsetWidth * _this.$index) + 'px';
                    _loadImg.call(_this,_this.$index,function(){
                        this.trigger('toggle', this.$index);
                    });
                    
                }, this.$autoPlay > MINIMUM_INTERVAL ? this.$autoPlay : MINIMUM_INTERVAL);
            }

            return this;
        },
        $toggleStop: function () {
            if (this.$togglePlay.$time !== undefined)
                clearInterval(this.$togglePlay.$time);
        }
    };

    //私有方法,监听窗口大小变化,并纠正图片偏移位置
    function _listenerWindowResize() {
        var _this = this;
        window.addEventListener('resize', function (e) {
            _listenerWindowResize.$time && clearTimeout(_listenerWindowResize.$time);
            _listenerWindowResize.$time = setTimeout(function () {
                _this.$index++;
                _this.$toggle();
            }, 200);
        });
    }
    //私有方法，创建图片box
    function _createItemTag(data, callback) {
        if (!data[0]) {
            this.$sliderItem = [];
            return;
        }
        var ele = null,
            resultEle = [],
            src = '',
            tag = '',
            className = '',
            attr = null;

        for (var i = 0; i < data.length; i++) {

            if ($.type(data[i]) === 'string') {
                src = data[i];
                className = '';
                tag = SLIDER_ITEM_TAG[0];
                attr = null;
            } else if ($.type(data[i]) === 'object') {
                src = data[i].src;
                className = data[i].class ? data[i].class : '';
                tag = SLIDER_ITEM_TAG.indexOf(data[i].tag) !== -1 ? data[i].tag : SLIDER_ITEM_TAG[0];
                attr = data[i].attr;
            }

            if (!src) continue;
            //创建item元素,并设置属性
            ele = document.createElement(tag);
            ele.className = SLIDER_ITEM_CLASS;
            ele.setAttribute('data-index', i);
            ele.setAttribute('data-src', src);
            for (var key in attr) {
                ele.setAttribute(key, attr[key]);
            }

            if (className !== '')
                ele.setAttribute('class', ele.getAttribute('class') + ' ' + className);

            resultEle.push(ele);

            if (typeof callback === 'function')
                callback.apply(ele, [data[i], i, data]);
        }

        return resultEle;
    }
    //私有方法,创建img标签
    function _createImgTag(src) {
        //创建图片
        src = this.$basePath ? this.$basePath + src : src;
        var img = document.createElement('img');
        img.className = SLIDER_ITEM_IMG_CLASS;
        img.src = src;
        img.alt = src;
        return img;
    }
    //私有方法,创建but标签
    function _createBut() {
        var _this = this,
            fragment = document.createDocumentFragment(),
            butListEle = document.createElement('div'),
            butItem = null;

        butListEle.className = SLIDER_BUT_BOX_CLASS;

        for (var i = 0; i < this.$itemLen; i++) {
            butItem = document.createElement('div');
            butItem.className = SLIDER_BUT_ITEM_CLASS;
            butItem.setAttribute('data-index', i);

            butItem.addEventListener(this.$operate, function () {
                _this.$index = $.getDataset(this).index;
                _this.$toggle();
            });
            //鼠标移入暂停切换
            butItem.addEventListener('mouseover', function () {
                _this.$toggleStop();
            });
            //鼠标移出开始切换
            butItem.addEventListener('mouseout', function () {
                _this.$togglePlay();
            });

            this.$toggleBut.push(butItem);
            fragment.appendChild(butItem)
        }
        butListEle.appendChild(fragment);
        return butListEle;
    }
    //私有方法,加载图片(懒加载图片)
    function _loadImg(index,callback){
        var _this = this;
        var ele = this.$sliderItem[index];
        var img = ele.getElementsByTagName('img')[0];       
        if(!img){
            img = _createImgTag.call(this,$.getDataset(ele).src);
            ele.appendChild(img);
            img.onload = function(){
                callback.call(_this);
            }
        }else{
            callback.call(this);
        }
        return this;
    }

    $.merge = function (target, options, method) {
        if (!options) {
            options = target;
            target = this;
        }
        options = typeof options === 'object' ? options : {};

        for (var key in options) {
            if (!options.hasOwnProperty(key) || options[key] === undefined) continue;
            if (method && !method.call(target, options[key], key, options)) continue;

            target[key] = options[key];
        }

        return target;
    }

    //定义工具方法
    $.merge({
        type: type,
        getDataset:function(ele){
            if(ele.dataset){
                return ele.dataset;
            }else{
                var attr = ele.attributes,
                    dataset = {},
                    name,
                    matchStr;
                for(var i =0;i<attr.length;i++){
                    matchStr = attr[i].name.match(datasetRegExp);
                    if(matchStr){
                        name = matchStr[1].replace(fCamelCase,function(all,letter){
                            return letter.toUpperCase();
                        });
                        dataset[name] = attr[i].value;
                    }
                }
                return dataset;
            }
        },
        getChildren: function (element, callback) {
            var child = element.childNodes,
                result = [];

            for (var i = 0; i < child.length; i++) {
                if (child[i].nodeType === 1) {
                    result.push(child[i]);
                    if (typeof callback === 'function')
                        callback.apply(child[i], [child[i], i, child]);
                }
            }
            return result;
        }
    });

    return $;
});