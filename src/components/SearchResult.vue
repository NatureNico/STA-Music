<template>
  <div class="result">
      <div class="best" v-if="searchArtist[0]" v-show="keywords==searchArtist[0].name">最佳匹配</div>
    <div
      class="box"
      v-if="searchArtist[0]"
      v-show="keywords == searchArtist[0].name"
    >
      <router-link
        v-if="searchArtist[0]"
        :to="`/arctists/${searchArtist[0].id}`"
      >
        <div class="artist">
          <img :src="searchArtist[0].picUrl" alt="" />
          <p>
            歌手:<span>{{ searchArtist[0].name }}</span>
          </p>
          <span class="run"></span>
        </div>
      </router-link>
    </div>
     <ul class="tabs">
      <li :class="{active:way=='SearchSong'}" @click="toggleTab('SearchSong')">歌曲</li>
      <li :class="{active:way=='SearchArtist'}" @click="toggleTab('SearchArtist')">歌手</li>
      <li :class="{active:way=='SearchAlbum'}" @click="toggleTab('SearchAlbum')">专辑</li>
    </ul>
    <component :is="way" :keywords="keywords" keep-alive></component>
    <!-- <div>搜索结果:{{ keywords }}</div> -->
  
   
    <!-- <Loading v-if="showLoading"></Loading>
    <p class="loadmore" @click="loadMore">{{tipText}}</p> -->
  </div>
</template>
<script>
import SongItem from "@/components/SongItem";
import Loading from "@/components/Loading";
import SearchSong from "@/components/SearchSong"
import SearchArtist from "@/components/SearchArtist"
import SearchAlbum from "@/components/SearchAlbum"
export default {
  name: "SearchResult",
  props: ["keywords"],
  data() {
    return {
      result: [],
      page: 1,
      showLoading: true, //是否显示loading组件
      searchSong: [],
      searchArtist: [],
      tipText:"加载更多",
      way:'SearchSong'
    };
  },
  created() {
    //根据关键字获取搜索结果
    this.result = [];
    console.log("created---");
    this.loadSearch();
  },
  components: {
    SongItem,
    Loading,
    SearchSong,
    SearchArtist,
    SearchAlbum
  },
  methods: {
    toggleTab(tab){
      this.way = tab;
      
    },
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
              console.log("歌曲",songData)
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
      //搜索歌手
      this.$axios
        .get("/search?keywords=" + this.keywords + "&type=100")
        .then((data) => {
          console.log("歌手", data);
          data.data.result.artists.map((d) => {
            (d.artists = {
              picUrl: d.picUrl,
              id: d.id,
              alia: d.alia,
              name: d.name,
              trans: d.trans,
            }),
              this.searchArtist.push(d);
            // console.log("搜索歌手结果：", d);
            return d;
          });
        });
      //搜索专辑
      this.$axios
        .get("/search?keywords=" + this.keywords + "&type=10")
        .then((data) => {
          console.log("专辑", data);
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
  },
};
</script>

<style lang="less" scoped>
.result {
  background-color: #1a1a1a;
  margin-top: 15px;
  text-align: left;
  color: #f5d93b;
  font-size: 15px;
    .tabs{
    width:100%;
    display: flex;
    justify-content: left;
    color:#fff;
    margin-top:20px;
    margin-bottom:10px;
    font-size: 12px;
    li{
      margin:0px 10px 0px 10px;
      &.active{
        font-weight: bold;
        padding-bottom:2px;
        border-bottom:3px solid rgba(238, 235, 40,0.7);
        border-radius: 1.5px;
      }
    }
  }
  .best {
    margin-top: 10px;
    font-size: 12px;
    color: #aaa;
  }
  .box {
    position: relative;
    width: 100%;
    height: 60px;
    margin-bottom:10px;
    a {
      position: absolute;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      text-decoration: none;
    }
    .artist {
      margin-top: 10px;
      width: 100%;
      height: 60px;
      position: relative;
      display: flex;
      justify-content: space-between;
      img {
        width: 50px;
        height: 50px;
        margin-top: 5px;
        margin-right: 20px;
        flex: 0.2;
      }
      p {
        display: inline-block;
        margin-top: 20px;
        color: #fff;
        flex: 0.794;
        span {
          margin-left: 10px;
          color: #f5d93b;
        }
      }
      .run {
        flex: 0.06;
        display: block;
        width: 8px;
        height: 13px;
        margin-top: 23px;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyNiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI5YjliIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTIuOTM5IDIzLjkzOUwxMy44NzkgMTMgMi45MzkgMi4wNjEiLz48L3N2Zz4=);
        background-repeat: no-repeat;
      }
    }
  }

  p.loadmore {
    background-color: #1a1a1a;
    margin-top: 15px;
    // background-color: wheat;
    color: #f5d93b;
    text-align: center;
    padding-bottom: 15px;
    font-size:14px;
  }
}
</style>