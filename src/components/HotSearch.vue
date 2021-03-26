<template>
  <div>
    <ul class="hotSearch">
      <li v-for="(hot, index) in hotSearch" :key="index"  @click="$emit('change',hot.first)"><span>{{index+1}}</span>{{ hot.first }}</li>
    </ul>
    <h4>历史记录</h4>
    <ul class="history">
      <li v-for="(data,index) in searchHistory" :key="index">
         <!-- <img src="../assets/clock.svg" alt=""> -->
        <p @click="$emit('change',data.keywords)">{{data.keywords}}</p>
        <i @click="close(index)">×</i>
      </li>
    </ul>

  </div>
</template>
<script>
export default {
  name: "HotSearch",
  props:["keywords"],
  data() {
    return {
      hotSearch: [],
      searchHistory:null
    };
  },
  created() {
    //获取热搜列表
    this.$axios.get("/search/hot").then((data) => {
      this.hotSearch = data.data.result.hots;
      console.log(data);
    });
    this.getHistory(); 
  },
 
  methods:{
    getHistory(){
      this.searchHistory = JSON.parse(localStorage.getItem("result"));
      // console.log("历史记录",this.searchHistory);
    },
    close(index){
      localStorage.removeItem('result');
      this.searchHistory.splice(index,1);
      localStorage.setItem('result',JSON.stringify(this.searchHistory));
    },
  }
};
</script>
<style lang="less" scoped>
.hotSearch {
  // height:100vh;
  margin-top: 15px;
  list-style: none;
  overflow: hidden;
  display:flex;
  justify-content: space-between;
  flex-wrap:wrap;
  li {
    span{
      color:#f5d93b;
      margin-right:8px;
    }
    width:40vw;
    color: #fff;
    float: left;
    font-size: 14px;
    padding: 5px;
    border-radius: 15px;
    margin: 5px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
  h4{
    padding-top:20px;
    text-align: left;
    font-size:12px;
    color:#f5d93b;
  }

  .history{
      margin-top:10px;
      // display: flex;
      // justify-content: space-between;
      // flex-wrap: wrap;
      text-align: left;
      font-size:14px;
      
      li{
        text-align: left;
        display: flex;
        justify-content: space-between;
        padding:5px 10px 5px 10px;
        // border:1px solid  #f5d94b;
        // border-radius: 20px;
        // background: #f5d94b;
        // color:#333;
      
        p{
          line-height: 20px;
          text-align: left;
          img{
              width:20px;
              height:20px;
              margin-right:5px;
          }
        }
        i{
          font-size:20px;
          color:#aaa;
        }
      }
  }
</style>