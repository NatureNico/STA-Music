<template>
  <div>
    <div v-if="playList" class="banner">更新日期：{{ playList.updateTime | formatDate }}</div>
    <ul class="newsong" v-if="hotSong.length > 0">
      <li class="newsongItem" v-for="(s, index) in hotSong" :key="s.id">
        <SongItem :item="s">{{index + 1}}</SongItem>
      </li>
    </ul>
    <Loading v-if="isLoading"></Loading>
    <div class="loadingmore" @click="loadMore">{{tipText}}</div>
  </div>
</template>
<script>
import SongItem from '@/components/SongItem'
import Loading from '@/components/Loading'
export default {
    name:'Hot',
    data(){
        return {
            hotSong:[],
            playList:null,
            page:1,
            isLoading:true,
            allsongs:[],
            tipText:"加载更多" //加载信息提示
        }
    },
    created(){
      this.loadMusic();
       
    },
    methods:{
        loadMusic(){
            //   let trackIDS = '';
            //获取歌单详情
            this.$axios.get('/playlist/detail?id=3778678').then(data=>{
            // console.log('热歌榜..',data);
            this.allsongs = data.data.playlist.trackIds;
            //把tracksID变成字符串
            let trackIDS = data.data.playlist.trackIds.slice((this.page-1)*20,20*this.page);
            this.playList = data.data.playlist;
            let ids=trackIDS.map(d=>{
                    return d.id;
            })
            return ids.join(",");
        }).then(ids=>{
             //获取歌曲详情
            this.$axios.get('http://music.kele8.cn/song/detail?ids='+ids).then(songData=>{
                this.isLoading = false;
                console.log("热歌",songData);
                songData.data.songs.map(d=>{
                    //处理数据和songItem不一致 转换数据
                    // console.log("热歌pic",d);
                    d.song = {
                        artists:d.ar,
                        // picUrl:d.al.picUrl
                    },
                    d.picUrl = d.al.picUrl;
                    this.hotSong.push(d);//push加入数组
                    // console.log(d);
                    return d;

                })
                // this.HotSong = songDat;//直接赋值
                // console.log("this.hotSong",this.hotSong)
                
            });
        });
        },
        loadMore(){
            let allpage = this.allsongs.length;
            if(allpage /(this.page+1) < 20){
                this.tipText = "已无更多歌曲信息";
            }
            this.page++;
            if(this.page>=10){
                return false;
            }
            this.isLoading = true;
            this.loadMusic();
        }
    },
    components:{
        SongItem,
        Loading
    },
    filters:{
        formatDate(val){
            let date = new Date(val);
            return (date.getMonth()+1)+'月'+date.getDate()+'日';
        }
    }
}
</script>
<style lang="less" scoped>
.banner{
    font-size: 12px;
    padding:10px;
    color:#ccc;
}
.loadingmore {
    margin-top:15px;
     background-color: #1a1a1a;
     color:#f5d93b; 
     z-index: 10;
     padding-bottom:15px;
     font-size: 14px;
}
.newsong{
    padding-left:10px;
    padding-right:10px;
    .newsongItem{
        &:first-of-type,&:nth-of-type(2),&:nth-of-type(3){
            font-weight: bold;
            color:#f5d93b;
        }
    }
}
</style>