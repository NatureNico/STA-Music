<template>
    <div class="full" v-if="albumDetail">
        <div class="albumImg">
            <img :src="albumDetail.picUrl+'?imageView=1&type=webp&thumbnail=369x0'" alt="">
        </div>
        <div class="detail">

        <div class="albumname">歌手：{{albumDetail.artist.name}}</div>
        <div class="time">时间：{{albumDetail.publishTime | formatTime}}</div>
        </div>
        <h1 class="title">专辑介绍</h1>
        <div class="text">{{albumDetail.description}}</div>
        <h1 class="title">专辑歌曲</h1>
        <ul class="song">
            <li v-for="(s,index) in songs" :key="s.id">
                <SongItem :item="s" @add-list="addMusicList(songs)">{{index+1}}</SongItem>
            </li>
        </ul>
    </div>
</template>

<script>
import SongItem from "@/components/SongItem";
export default {
    name:"Album",
    components:{
        SongItem
    },
    data(){
        return {
            albumID:null,
            albumDetail:null,
            albumSong:[],
            page:1,
            isLoading:true,
            tipText:"加载更多",
            songs:[]
        }
    },
    filters:{
        formatTime(date){
            var formatDate = new Date(date);
            let year = formatDate.getFullYear();
            let month = formatDate.getMonth()+1;
            let day = formatDate.getDate();
            return year + "-" + month + "-" + day;
        }
    },
    created(){
        this.findAlbum();
    },
    methods:{
        findAlbum(){
            this.albumID = this.$route.params.id;
            this.$axios.get("/album?id="+this.albumID).then(data=>{
                console.log("albumData",data);
                this.albumDetail = data.data.album;
                this.albumSong = data.data.songs;
                let trackIDS = this.albumSong.slice(
                    (this.page - 1 ) * 20,
                    20 * this.page
                );
                let ids = trackIDS.map(d=>{
                    return d.id;
                });
                return ids.join(",");
            }).then(ids=>{
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
            })
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
    }
}
</script>

<style lang="less" scoped>
.full{
    position: relative;
    .albumImg{
        width:100%;
        height:360px;
        img{
            opacity: 0.8;
        }
    }
    .detail{
        padding:10px;
        background: rgba(0,0,0,0.4);
            position: absolute;
            top:290px;
            font-size:18px;
            left:1vw;
            border-radius: 14px;
            font-size:14px;
        color:#f5d93b;
        text-align: left;
        .albumname{
            // opacity: 0.9;
        }
        .time{
            // opacity: 0.4;
        }
    }
    .title{
        text-align: left;
        padding:5px 10px;
        width:100%;
        height:30px;
        background: rgb(68, 63, 63);
        font-size:12px;
        // border-top-left-radius: 10px;
        // border-top-right-radius: 10px;
    }
    .text{
        padding:10px 10px 20px 10px;
        color:#ccc;
        font-size:14px;
        text-align: left;
        text-indent: 1em;
        line-height:24px;
    }
    .song{
        padding:10px 10px 20px 10px;
    }
}
</style>