<template>
    <div>
       <ul v-if="searchSong">
      <li v-for="(song, index) in searchSong" :key="index">
        <SongItem :item="song" :keywords="keywords"></SongItem>
      </li>
    </ul>
      <Loading v-if="showLoading"></Loading>
    <p class="loadmore" @click="loadMore">{{tipText}}</p>
    </div>
</template>

<script>
import SongItem from "@/components/SongItem";
import Loading from "@/components/Loading";
export default {
    name:"SearchSong",
    props:["keywords"],
    components:{
        SongItem,
        Loading,
    },
    data(){
        return {
            result:[],
            page:1,
            showLoading:true,
            searchSong:[],
            tipText:"加载更多"
        }
    },
    created(){
        //根据关键字获取搜索结果
        this.result=[];
        this.loadSearch();
    },
    methods:{
         loadSearch() {
      //?keywords=海阔天空&limit=30&offset=60
      //limit 每页显示多少条 offset 偏移量 (page-1)*30
      //根据关键字显示搜索结果
      let offset = (this.page - 1) * 30;
      this.$axios
        .get("/search?keywords=" + this.keywords + "&type=1&offset=" + offset)
        .then((data) => {
          // this.result = data.data.result.songs;
          this.result = this.result.concat(data.data.result.songs);
          console.log("this.result.id", this.result);
          this.showLoading = false;
          let ids = this.result.map((d) => {
            // console.log(d.id);
            return d.id;
          });
          return ids;
        })
        .then((ids) => {
          //获取歌曲详情，把歌曲的歌手和图片传进去
          this.$axios
            .get("http://music.kele8.cn/song/detail?ids=" + ids)
            .then((songData) => {
              songData.data.songs.map((d) => {
                (d.song = {
                  artists: d.ar,
                }),
                  (d.picUrl = d.al.picUrl);
                this.searchSong.push(d);
                // console.log("搜索歌曲结果",d);
                // console.log("result",this.result)
                return d;
              });
            });
        });
      },
     loadMore() {
      // let allpage = this.result.length;
      // if(allpage / (this.page+1)<20){
      //   this.tipText = "已无更多歌曲信息";
      // }
      this.page++;
      this.showLoading = true;
      this.loadSearch();
    },
    }
}
</script>

<style lang="less" scoped>
   p.loadmore {
    background-color: #1a1a1a;
    margin-top: 15px;
    // background-color: wheat;
    color: #f5d93b;
    text-align: center;
    padding-bottom: 15px;
    font-size:14px;
  }
</style>