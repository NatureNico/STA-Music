<template>
  <div class="commentitem">
    <div class="top">
      <div class="left">
        <span class="headicon">
          <img :src="item.user.avatarUrl+'?imageView=1&type=webp&thumbnail=369x0'" alt="" />
        </span>
      </div>
      <div class="right">
        <div class="username">{{ item.user.nickname }}</div>
        <div class="newtime">{{ item.time |formatTime }}</div>
      </div>
      <div class="good">
       {{item.likedCount}}<i :class="{'active':isClick==true}" @click="changeColor"></i>
      </div>
    </div>
    <div class="bottom">
      <div class="idea"><span v-if="isTrue" v-show="isTrue">回复<span>@{{item.beReplied[0].user.nickname}}：</span></span>{{ item.content }}</div>
      <div class="beReplied" v-show="isTrue" :style="{'display':isTrue?'block':'none'}">
        <ul>
          <li v-for="(data,index) in item.beReplied" :key="index">
              <p>@{{data.user.nickname}}: {{data.content}}</p>
          </li>
        </ul>
      
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentItem",
  props: ["item"],
  data(){
    return{
      isTrue:true,
      isClick:false
    }
  },
  created() {
    // console.log("Commentitem", this.item);
    this.loadList();
  },
  computed:{

  },
  watch:{
 
  },
  filters:{
    //转换时间
    formatTime(val){
      //当前时间
      var nowDate = new Date();
      //秒 xx秒
      var nowSeconds = nowDate.getSeconds();
      //分 xx分
      var nowMinutes = nowDate.getMinutes();
      //时 xx时
      var nowHours = nowDate.getHours();
      //日
      var nowDays = nowDate.getDate();
      //月
      var nowMonths = nowDate.getMonth() + 1;
      //年
      var nowYears = nowDate.getFullYear();

      //需要转化的时间对象
      var formatDate = new Date(val);
      var seconds = formatDate.getSeconds();
      // var secondsShow = ('0'+ formatDate.getSeconds()).substr(-2);
      var minutes = formatDate.getMinutes();
      //通过截取最后两位数字，如果分钟是个位数，则截取到0，如果分钟为十位数，则不会截取到前面的0
      //就不用使用三目运算进行判断
      var minutesShow = ('0'+ formatDate.getMinutes()).substr(-2);
      var hours = formatDate.getHours();
      var hourShow = ('0'+ formatDate.getHours()).substr(-2);
      var days = formatDate.getDate();
      var months = formatDate.getMonth() + 1;
      var years = formatDate.getFullYear();

      //进行比较
      if(years <= nowYears){
        //今年的数据
        if(years == nowYears){
          //比较月份
          if(months == nowMonths){
            //比较日
            if(days == nowDays){
              //一天以内
              //比较小时
              if(nowHours == hours){
                //一个小时以内
                if(minutes == nowMinutes){
                  //一分钟以内
                  if(seconds == nowSeconds){
                    return '刚刚';
                  }else if(seconds < nowSeconds){
                    return (nowSeconds - seconds) + '秒前';
                  }else{
                    //走到这里逻辑不通，可做其他处理
                    return false;
                  }
                }else if(minutes < nowMinutes){
                  return (nowMinutes - minutes) + '分钟前';
                }else{
                  return false;
                }
              }else if(hours < nowHours){
                //一个小时以内
                if(((nowHours - hours)*60 - minutes + nowMinutes) < 60){
                  return (nowHours - hours)*60 - minutes + nowMinutes + '分钟前';
                }else{
                  return hourShow + ':' + minutesShow;
                }
              }else{
                return false;
              }
            }else if(days < nowDays){
              //昨天的数据
              if((nowDays - days) == 1){
                return '昨天'+ hourShow + ':' + minutesShow;
              }else{
                return months + '月' + days + '日';
              }
            }else{
              return false;
            }
          }else if(months < nowMonths){
            return months + '月' + days + '日';
          }else{
            return false;
          }
        }else{
          return years + '年' + months + '月' + days + '日';
        }
      }else{
        return false;
      }
    }
  },
  methods:{
    changeColor(){
      this.isClick = !this.isClick;
      //如果点赞了，则点赞数加1
      if(this.isClick){
        // console.log("点赞数量",this.item.likedCount);
        this.item.likedCount = Number(this.item.likedCount)+1;
      }else{
        //否则点赞数在点赞后的基础上减1
        this.item.likedCount = Number(this.item.likedCount)-1;
      }
    },
     loadList(){
      if(this.item.beReplied.length>0){
        this.isTrue = true;
      }else{
        this.isTrue = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.commentitem {
//   position: relative;]
  padding:10px;
  margin-left:15px;
  margin-right:15spx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom:1px solid rgb(43, 41, 41); 
  .top {
    // position: relative;
    display: flex;
    justify-content: flex-start;
    .left {
        width:12vw;
    //   position: absolute;
      .headicon {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 30px;
          height: 30px;
        }
      }
    }
    .right {
        // width:90vw;
        // position: absolute;
        // left:20vw;
      .username {
        font-size: 14px;
        color: #ccc;
        text-align: left;
      }
      .newtime{
          font-size:8px;
          color:#aaa;
          text-align: left;
      }
    }
    .good{
      position: absolute;
      right:12vw;
      font-size:12px;
      color:#fed924;
      margin-top:8px;
      i{
        position: absolute;
        top:-2px;
        margin-left:3px;
        display: inline-block;
        width:14px;
        height: 14px;
        background:url(../assets/good.svg);
        background-size: cover;

        &.active{
          position: absolute;
          top:-2px;
          margin-left:3px;
          display: inline-block;
          width:14px;
          height: 14px;
          background: url(../assets/good2.svg);
          background-size: cover;
        }
      }
    }
  }
  .bottom{
    //   position: relative;
    margin-left:10vw;
    margin-bottom:10px;
    .idea{
        font-size:14px;
        text-align: left;
        padding:10px;
        span{
          span{
             color:rgb(203, 212, 72);
            //  margin-right:5px;
          }
         
        }
    }
    .beReplied{
      border:1px solid rgb(37, 36, 36);
      padding:10px 10px;
      margin-right:20px;
      font-size:14px;
      text-align: left;
      border-radius: 10px;
      // color:rgb(183, 189, 101);
      color:rgb(197, 197, 189);
    }
  }
}
</style>