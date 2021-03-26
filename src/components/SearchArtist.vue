<template>
  <div>
    <h4>找到{{artistsNum}}个歌手</h4>
     <ul v-if="searchArtist">
        <li v-for="(artist, index) in searchArtist" :key="index">
          <ArctistItem :item="artist" :keywords="keywords"></ArctistItem>
        </li>
      </ul>
  </div>
      
</template>

<script>
import ArctistItem from "@/components/ArctistItem"
export default {
  name:"SearchArtist",
  props:["keywords"],
  components:{
    ArctistItem
  },
  data(){
    return {
      searchArtist:[],
      page:1,
      showLoading:true,
      tipText:"加载更多",
      artistsNum:0
    }
  },
  created(){
    this.loadSearch();
  },
  methods:{
     loadSearch() {
       //搜索歌手
      this.$axios
        .get("/search?keywords=" + this.keywords + "&type=100")
        .then((data) => {
          console.log("歌手", data);
          this.artistsNum = data.data.result.artists.length;
          data.data.result.artists.map((d) => {
            (d.artists = {
              picUrl: d.picUrl,
              id: d.id,
              alia: d.alia,
              name: d.name,
              trans: d.trans,
            }),
              this.searchArtist.push(d);
            // console.log("searchArtist", d);
            return d;
          });
        });
     },

  }
}
</script>

<style lang="less" scoped>
h4{
  color:#ccc;
  font-size: 6px;
}
ul{
  padding-bottom:20px;
}
</style>