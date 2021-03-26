<template>
  <div class="songitem">
    <!-- 插槽 -->
    <div class="num"><slot></slot></div>
    <div class="left">
      <!-- <h3>{{ item.name | highLight(keywords)}}</h3> -->
      <h3 v-html="$options.filters.highLight(item.name, keywords)" :style="{color: item.id == $root.musicStore.musicID ? '#f5d93b' : ''}"></h3>
      <p>
        <template v-if="item.song">
          {{ item.song.artists[0].name }}
        </template>
        <template v-if="item.artists">
          {{ item.artists[0].name }}
        </template>
        - {{ item.name }}
      </p>
    </div>
    <span class="playbtn" @click="play(item)" v-show="!(item.id == $root.musicStore.musicID)"></span>
    <span class="playbtnChange" v-show="item.id == $root.musicStore.musicID"><PlayMusic></PlayMusic></span>
  </div>
</template>

<script>
import PlayMusic from "../components/PlayMusic";
export default {
  name: "SongItem",
  props: ["item", "keywords"],
  created() {

  },
  components:{
    PlayMusic
  },
  filters: {
    //调用$options.filters.highLight()
    //val 里面如果又keywords的值 替换成html
    highLight(val, keywords) {
      if(typeof keywords == 'undefined'){
        return val;
      }
      let reg = new RegExp(keywords, "g");//根据关键字创建一个正则对象
      if (reg.test(val)) {
        //把val里面的关键字keywords替换分成span+keywords的方式
        return val.replace(reg, '<span style="color:yellow">' + keywords + '</span>');
      }
      return val;//没有在val找到关键字就直接返回
      // return '<span>'+val+'</span>'+keywords;
    },
  },
  methods:{
    play(item){
      // this.$emit('play',item.id);//组件传值的方式 触发父组件的play并传递音乐ID
      //换一种方式 
      //在子组件通过this.$root.musicStore 访问Vue实例里面的数据
      this.$root.musicStore.musicID = item.id;
      this.$root.musicStore.currentMusic = item;
      let newArr = this.$root.musicStore.musicList;
      let find = false;
      for(let n of newArr){
        if(n.id == item.id){
          find = true;
        }
      }
      if(!find) this.$root.musicStore.musicList.push(item);//如果当前音乐在播放列表里面不存在的时候加入 播放列表
      // this.$root.musicStore.musicList.unshift(item);//把当前歌曲放在播放列表开头
      //把当前歌曲列表全部加入播放歌单列表
      this.$emit('add-list');
    }
  }
};
</script>

<style lang="less" scoped>
// scoped局部的样式
.songitem {
  width:100%;
  background-color:#1a1a1a ;
  text-align: left;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #aaa;
  padding: 10px 0px;
  .num{
    font-size:16px;
    margin-right:10px;
  }
  .left {
    flex: 1;
    h3 {
      font-size:14px;
      color: #fff;
    }
    p {
      font-size: 8px;
      color: #aaa;
    }
  }
  .playbtn {
    width: 22px;
    height: 22px;
    background: url(../assets/icon2.png) no-repeat -24px 0px;
    background-size: 166px 97px;
  }
}
.highLight {
  color: #f5d93b;
}
</style>