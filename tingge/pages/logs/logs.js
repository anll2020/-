// logs.js
const util = require('../../utils/util.js')
const app=getApp();
Page({
  data: {
    //所有歌曲信息
   arr:[],
   //存储用户歌曲名字
   title:[],
  nowIndex:app.globalData.score-1,
  // nowIndex:0,
  // count:0,
  isall:''
  },
  onLoad: function (options) {
    //判断是否显示引导页
    wx.getStorage({
      key: 'isshow',
      success: res => {
        this.init()  //调用初始化方法
      },
      fail: function (res) {
        wx.redirectTo({
          url: '/pages/index/index',  //显示引导页
        })
      },
    })
  },
  //初始化数据
  init:function(){
    wx.request({
      url: 'http://192.168.3.181:8080/11.json',
      success:(res)=>{
        //确定当前歌曲的长度
        this.data.title=[]
        for(var i = 0; i<res.data.data[this.data.nowIndex].songname.length; i++){
            this.data.title.push("")
        } 
        // console.log(this.data.title)
        this.setData({
           arr:res.data.data,
           title:this.data.title,
          // count:res.data.data[this.data.nowIndex].songname.length
        })
      }
    })
  },
  
  getitem:function(e){
    //获取点击的字
    // console.log(e.target.id)
    var word=this.data.arr[this.data.nowIndex].keyword[e.target.id];
    // console.log(word)
    // console.log(this.data.title.length)
    //加到title
    // this.data.title.push(word)
    // this.setData({
    //   title:this.data.title
    // })
    // console.log("getitem:",this.data.title);
//判断是否为空
    for(var i=0; i<this.data.title.length; i++){
      if(this.data.title[i]==""){
        this.data.title[i]=word;
        break;
      }
    }
    //判断是否填写完毕
    if(i==this.data.title.length-1){
      this.setData({
        isall:"all"
      })
    }

    // this.data.title.push(word)
    console.log(this.data.title);
    this.setData({
      title:this.data.title
    })

    //比对歌名
    if(this.data.isall=="all"){
         if(this.data.arr[this.data.nowIndex].songname==this.data.title.join("")){
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: '哎呀不错， 进入下一关',
            success:(res)=>{
              if (res.confirm) {
                console.log('用户点击确定')
                //判断歌曲是否结束
                if(this.data.arr.length-1==this.data.nowIndex){
                  wx.redirectTo({
                    url: 'jie/jie',
                  })
                }else{
                  var index =this.data.nowIndex+1//改变索引
                  this.setData({
                    nowIndex:index,
                    isall:''
                  })
                  wx.setNavigationBarTitle({
                    title:'听歌识曲-第' +(this.data.nowIndex+1)+"首"
                  })
                  this.init()
                }
              } 
            }
          })
         }else{
           //猜错了
           wx.showToast({
            title: '答案不对哟',
            icon: 'none',
            duration: 2000
          })
         }
    }
  },

  //清除用户选择
 
  cleartxt:function(e){
   
    console.log(this.data.title)
    var newtitle = this.data.title;

    newtitle[e.target.id]= ""
    this.setData({
      title:newtitle
    })
    
 },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title:'紧急呼叫，我卡在第'+(this.data.nowIndex+1) + "关",
      path:'/pages/logs/logs'
    }
}
})
