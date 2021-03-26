<template>
  <div>
    <div v-if="songList" class="cover">
      <img class="bgImg" :src="songList.coverImgUrl" alt="" />
      <div class="left">
        <div class="coverImg">
          <img  :src="songList.coverImgUrl" alt="" />
          <span>{{ songList.playCount | formatNum }}万</span>
          <i class="icon">歌单</i>
        </div>
        
      </div>
      <div class="right">
        <h3>{{ songList.name }}</h3>
        <div class="userdata">
           <div class="photo">
            <img :src="songList.creator.avatarUrl" alt="" />
          </div>
          <p>{{ songList.creator.nickname }}</p>
        </div>
      </div>
    </div>
    <div class="songlist">歌曲列表</div>
    <ul class="playsong" v-if="songs.length > 0">
      <li class="playsongItem" v-for="(s, index) in songs" :key="s.id">
        <SongItem :item="s" @add-list="addMusicList(songs)">{{ index + 1 }}</SongItem>
      </li>
    </ul>
    <Loading v-if="isLoading"></Loading>
    <div class="loadingmore" @click="loadMore">{{tipText}}</div>
     <div class="comment">
       <h5 v-if="hotcomments.length!=0">精彩评论({{hotcomments.length}})</h5>
        <ul class="commentlist">
         <li v-for="c in hotcomments" :key="c.id">
            <CommentItem :item="c"></CommentItem>
         </li>
       </ul>
       <h5 v-if="comments.length!=0">最新评论({{comments.length}})</h5>
       <ul class="commentlist">
         <li v-for="c in comments" :key="c.id">
            <CommentItem :item="c"></CommentItem>
         </li>
       </ul>
      
     </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";
import SongItem from "@/components/SongItem";
import CommentItem from '@/components/CommentItem';
export default {
  components: {
    Loading,
    SongItem,
    CommentItem
  },
  data() {
    return {
      listID: null,
      songList: null,
      songs: [],
      page: 1,
      isLoading: true,
      comments:[],
      hotcomments:[],
      allsongs:[],
      tipText:"加载更多" //加载信息提示
    };
  },
  created() {
    this.loadMusic();
    this.loadComment();
  },
  filters: {
    formatNum(val) {
      return (val / 10000).toFixed(2);
    },
  },
  methods: {
    loadMusic() {
      this.listID = this.$route.params.id;
      //获取歌单详情
      this.$axios
        .get("/playlist/detail?id=" + this.listID)
        .then((data) => {
          // console.log("歌单信息",data);
          this.allsongs = data.data.playlist.trackIds;
          // console.log("this.allsongs",this.allsongs)
          let trackIDS = data.data.playlist.trackIds.slice(
            (this.page - 1) * 20,
            20 * this.page
          );
          this.songList = data.data.playlist;
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
    loadMore() {
      let allpage = this.allsongs.length;
      if(allpage /(this.page+1) < 20){
        this.tipText = "已无更多歌曲信息";
      }
      this.page++;
      if (this.page >= 10) {
        return false;
      }
      this.isLoading = true;
      this.loadMusic();
    },
    loadComment() {
      this.$axios.get("/comment/playlist/detail?id="+this.listID).then((data) => {
        // console.log("歌单评论...", data);
        this.comments = data.data.comments;
        this.hotcomments = data.data.hotComments;
      });
    },
    addMusicList(songs){
      let newArr = this.$root.musicStore.musicList;
      songs.map(d=>{
        let find = false;
        for(let n of newArr){
          if(n.id == d.id){
            find = true;
            break;
          }
        }
        if(!find) newArr.push(d);
      });
      this.$root.musicStore.musicList = newArr;
    }
  },
};
</script>

<style lang="less" scoped>
.cover {
  width: 100%;
  height: 30vh;
  position: relative;
  background-color: rgba(75, 40, 40, 0.1);
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  .bgImg {
    position: absolute;
    top: 0px;
    left: 0px;
    opacity: 0.3;
    filter: blur(10px);
  }
  .left {
    width: 45vw;
    position: absolute;
    .coverImg {
      width: 126px;
      height: 126px;
      position: absolute;
      top: 30px;
      left: 10px;
      span {
          position: absolute;
          right:5px;
          top:5px;
          font-size:12px;
          color:#fff;
          background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMiAyMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjIgMTYuNzc3YzAgMS4yMzMtMS4xMjEgMi4yMzMtMi41MDYgMi4yMzMtMS4zODQgMC0yLjUwNi0xLTIuNTA2LTIuMjMzdi0yLjU1M2MwLTEuMjM0IDEuMTIyLTIuMjMzIDIuNTA2LTIuMjMzLjE3NCAwIC4zNDMuMDE3LjUwNi4wNDZ2LTEuMzdoLS4wMzNjLjAxNy0uMjIuMDMzLS40NDEuMDMzLS42NjZhOCA4IDAgMCAwLTE2IDBjMCAuMjI1LjAxNi40NDYuMDM0LjY2Nkg0djEuMzdjLjE2My0uMDI5LjMzMy0uMDQ2LjUwNS0uMDQ2IDEuMzg0IDAgMi41MDYuOTk5IDIuNTA2IDIuMjMzdjIuNTUzYzAgMS4yMzMtMS4xMjIgMi4yMzMtMi41MDYgMi4yMzNTMiAxOC4wMTEgMiAxNi43Nzd2LTIuNTUzYzAtLjI1OC4wNTktLjUwMS4xNDgtLjczQS45ODIuOTgyIDAgMCAxIDIgMTMuMDAxdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMHMxMCA0LjQ3NyAxMCAxMGMwIC4wOS0uMDA5LjE3OC0uMDE0LjI2Ni4wMDIuMDI0LjAxNC4wNDQuMDE0LjA2N3YyYS45ODguOTg4IDAgMCAxLS4zNi43NTNjLjIyNC4zMzQuMzYuNzIuMzYgMS4xMzh2Mi41NTIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2ZmZiIgZD0iTTIwIDE2Ljc3N2MwIDEuMjMzLTEuMTIxIDIuMjMzLTIuNTA2IDIuMjMzLTEuMzg0IDAtMi41MDYtMS0yLjUwNi0yLjIzM3YtMi41NTNjMC0xLjIzNCAxLjEyMi0yLjIzMyAyLjUwNi0yLjIzMy4xNzQgMCAuMzQzLjAxNy41MDYuMDQ2di0xLjM3aC0uMDMzYy4wMTctLjIyLjAzMy0uNDQxLjAzMy0uNjY2YTggOCAwIDAgMC0xNiAwYzAgLjIyNS4wMTYuNDQ2LjAzNC42NjZIMnYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzUzAgMTguMDExIDAgMTYuNzc3di0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43M0EuOTgyLjk4MiAwIDAgMSAwIDEzLjAwMXYtMi42NjdjMC0uMDIzLjAxMi0uMDQzLjAxMy0uMDY3LS4wMDQtLjA4OC0uMDEzLS4xNzYtLjAxMy0uMjY2IDAtNS41MjMgNC40NzctMTAgMTAtMTBzMTAgNC40NzcgMTAgMTBjMCAuMDktLjAwOS4xNzgtLjAxNC4yNjYuMDAyLjAyNC4wMTQuMDQ0LjAxNC4wNjd2MmEuOTg4Ljk4OCAwIDAgMS0uMzYuNzUzYy4yMjQuMzM0LjM2LjcyLjM2IDEuMTM4djIuNTUyIi8+PC9zdmc+);
          background-repeat: no-repeat;
          text-shadow: 0px 0px 2px #000;
          padding-left:18px;
      }
      .icon{
        position: absolute;
        left:0px;
        top:10px;
        font-size:10px;
        height:17px;
        text-align: center;
        padding:0 5px;
        background:rgb(251, 255, 2,0.8);
        border-top-right-radius: 17px;
        border-bottom-right-radius: 17px;
        color:#000;
        font-style:normal;
      }
    }

    
  }
  .right {
    width: 50vw;
    position: absolute;
    right: 20px;
    top: 30px;
    height:126px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    h3 {
      width:100%;
      // position: absolute;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      text-align: left;
    }
    .userdata{
      width:100%;
      height:50px;
      display: flex;
      justify-content: start;
      .photo {
        // position: absolute;
        // top: 50px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 30px;
          height: 30px;
        }
      }
      p {
        // position: absolute;
        // top: 55px;
        display: inline-block;
        font-size: 14px;
        left: 40px;
        color: #ccc;
        line-height: 30px;
        text-indent: 3vw;
      }
    }
    
  }
}
.songlist{
  text-align: left;
  padding:5px 10px;
  width:100%;
  height:30px;
  background: rgb(68, 63, 63);
  font-size:12px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  // margin-top:-5px;
}
.playsong {
  padding-left: 10px;
  padding-right: 10px;
  .playsongItem{
       &:first-of-type,&:nth-of-type(2),&:nth-of-type(3){
            font-weight: bold;
            color:#f5d93b;
        }
  }
}
.loadingmore {
  margin-top: 15px;
  background-color: #1a1a1a;
  color: #f5d93b;
  z-index: 10;
  padding-bottom: 15px;
  font-size:14px;
}
.comment{
  h5{
    text-align: left;
    padding:10px;
    color:#f5d93b;
    font-size: 14px;
  }
}
</style>