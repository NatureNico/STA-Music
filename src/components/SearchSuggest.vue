<template>
  <div class="suggest">
    <div>搜索：{{ keywords }}</div>
    <ul>
      <template v-if="suggestList.artists">
        <li
          class="artists"
          v-for="v in suggestList.artists"
          :key="v.id"
          @click="$emit('change', v.name)"
        >
          <img class="artistsImg" :src="v.picUrl+'?imageView=1&type=webp&thumbnail=369x0'" />
          <span>歌手:{{ v.name }}</span>
          <!-- <router-link :to="`search/${v.id}`">{{v.id}}</router-link> -->
        </li>
      </template>
      <template v-if="suggestList.albums">
        <li
          class="albums"
          v-for="v in suggestList.albums"
          :key="v.id"
          @click="$emit('change', v.name)"
        >
          专辑:{{ v.name }}
        </li>
      </template>
      <template v-if="suggestList.songs">
        <li
          class="songs"
          v-for="v in suggestList.songs"
          :key="v.id"
          @click="$emit('change', v.name)"
        >
          歌曲:{{ v.name }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SearchSuggest",
  props: ["keywords"],
  data() {
    return {
      suggestList: {},
    };
  },
  created() {
    this.loadSuggest(this.keywords);
  },
  watch: {
    keywords(val) {
      // orders: song 音乐  artists 艺术家  albums 专辑
      // this.$axios.get('/search/suggest?keywords='+val+'&type=mobile').then(data=>{
      //     console.log(data);
      //     this.suggestList=[];//清空原数组
      //     let result = data.data.result;
      //     this.suggestList = result;
      //     let orders = result.order;
      //     for(var key in orders){
      //         // console.log(data.data.result[orders[key]]);
      //         this.suggestList = this.suggestList.concat(data.data.result[orders[key]]);//合并成数组并接收
      //         // for(var i in result[orders[key]]){
      //         //     this.suggestList.push(result[orders[key]][i]);
      //         // }
      //     }
      //     console.log('result==>',this.suggestList);
      // })
      this.loadSuggest(val);
      console.log("this.suggestList", this.suggestList);
    },
  },
  methods: {
    loadSuggest(val) {
      this.$axios
        .get("/search/suggest?keywords=" + val + "&type=mobile")
        .then((data) => {
          this.suggestList = []; //清空原数组
          // let result = data.data.result;
          let result = data.data.result.allMatch;
          this.suggestList = result;
          // console.log("搜索接口",data)
        });
    },
  },
};
</script>

<style lang="less" scoped>
.suggest {
  // background-color: rgba(0,0,0,0.2);
  background-color: #1a1a1a;
  text-align: left;
  padding: 20px;
  padding-top: 15px;
  height: 50px;
  line-height: 50px;
  width: 100%;
  opacity: 0.8;
  div {
    color: #f5d93b;
    // border:1px solid #f8f9fa;
    background-color: #1a1a1a;
  }
  ul {
    background-color: #1a1a1a;
    li.albums,
    li.songs {
      height: 50px;
      line-height: 50px;
      // border-bottom:1px solid #f8f9fa;
      color: #fff;
      font-size: 15px;
    }
    li.artists {
      // padding:10px;
      height:60px;
      position: relative;
      line-height: 60px;
      .artistsImg {
        margin-top: 5px;
        margin-left: 5px;
        width: 50px;
        height: 50px;
        margin-right: 10px;
        line-height: 80px;
      }
      span{
          position: absolute;
          top:0px;
      }
    }
  }
}
</style>