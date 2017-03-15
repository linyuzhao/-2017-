function Observer( srcObj ){
  this.data = {};
  var selfData = this.data;
  for( attr in srcObj){
    
    (function(attr){
       Object.defineProperty(selfData,attr,{
        get : function(){
          console.log("你访问了 " + attr);
          return srcObj[attr];
        },
        set : function(value){
          console.log("你设置了 " + attr + ", 新的值为" + value);
          srcObj[attr] = value;
        }
      });
    })(attr);
   
  }
}

var app1 = new Observer({
  name : 'youngwind',
  age : 25
});


var app2 =  new Observer({
  university: 'bupt',
  major : 'computer'
});

app1.data.name;               //你访问了name
app1.data.age = 100;          // 你设置了age, 新的值为100
app2.data.university;         // 你访问了 university
app2.data.major = 'science';  // 你设置了 major，新的值为 science
