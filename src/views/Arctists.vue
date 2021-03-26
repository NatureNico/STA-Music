<template>
  <div class="full" v-if="artistsDetail">
    <div class="artImg" v-if="artistsDetail">
      <img :src="artistsDetail.picUrl" alt="" />
      <h1 class="name">{{ artistsDetail.name }}</h1>
    </div>
    <h1 class="title">歌手简介</h1>
    <div class="more">
      <div class="briefDesc">
        {{ artistsDetail.briefDesc }}
      </div>
    </div>
    <!-- <div class="click" @click="isOpen=!isOpen">{{tip}}</div> -->
    <h1 class="title">热门单曲</h1>
    <ul class="playsong" v-if="songs.length > 0">
      <li class="playsongItem" v-for="(s, index) in songs" :key="s.id">
        <SongItem :item="s" @add-list="addMusicList(songs)">{{
          index + 1
        }}</SongItem>
      </li>
    </ul>
    <Loading v-if="isLoading"></Loading>
    <div class="loadingmore" @click="load">{{tipText}}</div>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import SongItem from "@/components/SongItem";
export default {
  components: {
    Loading,
    SongItem,
  },
  data() {
    return {
      arctistID: null,
      artistsDetail: null,
      artistSong: [],
      isOpen: false,
      tip: "展开",
      songs: [],
      page: 1,
      isLoading: true,
      tipText: "加载更多",
    };
  },
  created() {
    this.findArctist();
    this.open();
  },
  methods: {
    findArctist() {
      this.arctistID = this.$route.params.id;

      this.$axios
        .get("/artists/desc?id=" + this.arctistID)
        .then((artistData) => {
          // console.log("歌手详情------", artistData);
          this.artistsDetail = artistData.data.artist;
          this.artistSong = artistData.data.hotSongs;
          // console.log("artistSong", this.artistSong);
          let trackIDS = this.artistSong.slice(
            (this.page - 1) * 20,
            20 * this.page
          );
          // console.log("track", trackIDS);
          let ids = trackIDS.map((d) => {
            return d.id;
          });
          return ids.join(",");
        })
        .then((ids) => {
          //获取歌曲详情
          this.$axios
            .get("http://music.kele8.cn/song/detail?ids=" + ids)
            .then((songData) => {
              this.isLoading = false;
              songData.data.songs.map((d) => {
                (d.song = {
                  artists: d.ar,
                }),
                  (d.picUrl = d.al.picUrl);
                this.songs.push(d);
                return d;
              });
            });
        });
    },
    open() {
      // for(let i = 0 ; i < this.artistsDetail.briefDesc.length ; i++){
      //   let domHeight = this.artistsDetail.briefDesc[i].offsetHeight;
      //   this.$set(this.artistsDetail.briefDesc[i],'domHeight',domHeight);
      // }
      if (this.isOpen) {
        this.tip = "收起";
      } else {
        this.tip = "展开";
      }
    },
    addMusicList(songs) {
      let newArr = this.$root.musicStore.musicList;
      songs.map((d) => {
        let find = false;
        for (let n of newArr) {
          if (n.id == d.id) {
            find = true;
            break;
          }
        }
        if (!find) newArr.push(d);
      });
      this.$root.musicStore.musicList = newArr;
    },
     load() {
    let allpage = this.artistSong.length;
    if (allpage / (this.page + 1) < 20) {
      this.tipText = "已无更多歌曲信息";
    }
    this.page++;
    if (this.page >= 10) {
      return false;
    }
    this.isLoading = true;
    this.findArctist();
  },
  },
 
};
</script>

<style lang="less" scoped>
.full {
  width: 100%;
  padding-bottom:2vh;
  .artImg {
    position: relative;
    width: 100%;
    height: 293px;
    background: rgba(0, 0, 0, 0.7);
    overflow: hidden;
    img {
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
      opacity: 0.7;
      background: url(../assets/photo.jpg) no-repeat;
      background-size: cover;
    }
    h1 {
      position: absolute;
      left: 20px;
      top: 80%;
      font-size: 20px;
    }
  }
  .title {
    color: #f5d93b;
    text-align: left;
    font-size: 16px;
    padding: 10px;
        // text-align: left;
        // padding:5px 10px;
        // width:100%;
        // height:30px;
        // background: rgb(68, 63, 63);
        // font-size:12px;
  }
  .more {
    width: 100%px;
    // height: 18vh;
    .briefDesc {
      padding: 12px;
      color: #ccc;
      font-size: 14px;
      text-align: left;
      text-indent: 2em;
      line-height:24px;
    }
  }
  .playsong {
    padding-left: 10px;
    padding-right: 10px;
    .playsongItem {
      &:first-of-type,
      &:nth-of-type(2),
      &:nth-of-type(3) {
        font-weight: bold;
        color: #f5d93b;
      }
    }
  }
  .loadingmore {
    margin-top: 15px;
    background-color: #1a1a1a;
    color: #f5d93b;
    z-index: 10;
    padding-bottom: 15px;
    font-size: 14px;
  }
}
</style>