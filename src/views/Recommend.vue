<template>
    <div>
        <BorderTitle>推荐歌单</BorderTitle>
        <ul class="songlist" v-if="songList.length>0">
            <ListItem v-for="sl in songList" :key="sl.id" :item="sl"></ListItem>
        </ul>
        <Loading v-if="songList.length == 0"></Loading>

        <BorderTitle>最新音乐</BorderTitle>
        <ul class="newsong" v-if="newSong.length>0">
           <li v-for="s in newSong" :key="s.id">
               <SongItem :item="s" @add-list="addMusicList(newSong)"></SongItem>
           </li>
        </ul>
        <Loading v-if="newSong.length == 0"></Loading>
    </div>
</template>
<script>
import BorderTitle from '@/components/BorderTitle'
import ListItem from '@/components/ListItem'
import SongItem from '@/components/SongItem'
import Loading from '@/components/Loading'
export default {
    name:'Recommend',
    components:{
        BorderTitle,
        ListItem,
        SongItem,
        Loading
    },
    data(){
        return {
            songList:[],
            newSong:[]
        }
    },
    created(){
        this.$axios.get('/personalized?limit=9').then(data=>{
            this.songList = data.data.result;
        }).catch(err=>{
            console.log(err);
        });
        this.$axios.get('/personalized/newsong?limit=20').then(data=>{
            this.newSong = data.data.result;
        });
    },
    methods:{
        //  play(musicID){
        //      //触发父组件的play事件
        //     this.$emit('play',musicID);
        // }
        addMusicList(newSong){
            // this.$root.musicStore.musicList=this.$root.musicStore.musicList.concat(newSong);
            let newArr = this.$root.musicStore.musicList;//取出原来的播放列表
            newSong.map(d=>{ //处理每一天newSong里面的音乐
                let find = false;
                for(let n of newArr){
                    if(n.id == d.id){
                        //找到当前音乐 在原歌单里面存在
                        find = true;
                        break;
                    }
                }
                if(!find) newArr.push(d);
            });
            this.$root.musicStore.musicList = newArr;
            // console.log("recommend",this.$root.musicStore.musicList);
        }
    }
}
</script>
<style lang="less" scoped>
    .songlist{
        display: flex;
        flex-wrap: wrap;
        li{
            width:33%;
        }
    }
    .newsong{
        padding:10px 10px;
    }
</style>