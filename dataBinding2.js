

function Observer( srcObj ){
  // 映射到 srcObj 同名拦截者数据 
  this.data = {};

  /**
   * [事件处理程序容器]
   * @type {Object}
   * 属性:
   *    {String}(eg: xxx.xx / xxx) : {Function}   
   */
  this.handles = {};
  
  /**
   * [订阅者, 往事件处理容器中添加事件处理程序]
   * @param  {[String]}   label [事件标签]
   * @param  {Function} fn    [事件处理程序]
   * 
   */
  this.$watch = function(label,fn){
    this.handles[label] = fn;
  };


  /**
   * [触发器 值改变后触发, 触发后通过标签容器中查找事件处理程序]
   * @param  {[Strng]} label [事件标签]
   * @param  {[X]} value [传给事件处理程序的参数]
   *
   */
  this.changetrigger = function( label, value){
    //该属性是否已经订阅
    var isSubscribe = false; 
    if(this.handles.hasOwnProperty(label)){
       this.handles[label](value);
    }
  }
  
  /**
   * [setObserver description]
   * @param {[Object]} currentSrcObj    [目前正在遍历的源对象]
   * @param {[Object]} obData    [目前正在遍历的拦截者对象]
   * @param {[Object]}   obRoot    [观察者对象]
   * @param {[Array]} attrParents [
   *                            存着值的在属性中的位置,比如my.age.isEleven = true;
   *                            isEleven 的值存在于 .age.isEleven中attrArray中存着 ['age', 'isEleven']
   *                           ]
   */
  function setObserver(currentSrcObj, currentObData, obRoot, attrParents){
   
    for( attr in currentSrcObj){
      // 因此需要使用即使函数确保正确的值传递
      // 留坑, 我猜测是使用了懒加载: 访问器属性使用的时候, 通过回调函数回去找参数
      (function(attr, currentObData){
        
        //如果属性的值不是对象, 对这个属性设置观察者
        if(typeof currentSrcObj[attr] !== 'object'){         
           Object.defineProperty(currentObData,attr,{
            get : function(){
              console.log("你访问了 " + attr);
              return currentSrcObj[attr];
            },
            set : function(value){
              console.log("你设置了 " + attr + ", 新的值为" + value);
              currentSrcObj[attr] = value;
              // 值发生改变, 触发事件
              attrParents.push(attr);
              obRoot.changetrigger(attrParents.join('.'),value);
            }
          });
        } else {
        //如果属性的值是对象, 对这个对象递归地执行setObserver();
          currentObData[attr] = {};
          var newAttrParents = attrParents.slice(); // 用于得知值的深度
          newAttrParents.push(attr);
          setObserver(currentSrcObj[attr], currentObData[attr],obRoot, newAttrParents);
        }

      })(attr, currentObData);
    
    }
  }
 
  setObserver(srcObj, this.data, this, []);
}

var app1 = new Observer({
  name : 'youngwind',
  age : 25,
  test : {
    testA : 12,
    testB : '大'
  }
});


var app2 =  new Observer({
  university: 'bupt',
  major : 'computer'
});


app1.data.name;               // 你访问了name

app1.$watch('test.testB',function(value){
  console.log('data.test.testB 发生改变, 现在的值是' + value + "咯!");
});

app1.data.age = 100;          // 你设置了age, 新的值为100

app2.data.university;         // 你访问了 university
app2.data.major = 'science';  // 你设置了 major，新的值为 science
app1.data.test.testB='小';

