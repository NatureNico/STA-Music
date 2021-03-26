<template>
   <div>
       <h4>找到{{albumNum}}张专辑</h4>
        <ul v-if="searchAlbum">
      <li v-for="(album, index) in searchAlbum" :key="index">
        <AlbumItem :item="album" :keywords="keywords"></AlbumItem>
      </li>
    </ul>
   </div>
</template>

<script>
import AlbumItem from "@/components/AlbumItem"
export default {
  name:"SearchAlbum",
  props:["keywords"],
  components:{
    AlbumItem
  },
  data(){
    return {
      searchAlbum:[],
      page:1,
      showLoading:true,
      tipText:"加载更多",
      albumNum:0
    }
  },
  created(){
    this.loadSearch();
  },
  methods:{
     loadSearch() {
       //搜索专辑
      this.$axios
        .get("/search?keywords=" + this.keywords + "&type=10")
        .then((data) => {
          console.log("专辑", data);
          this.albumNum = data.data.result.albums.length;
          data.data.result.albums.map(d=>{
              d.albums = {
                  picUrl:d.picUrl,
                  id:d.id,
                  name:d.name,
                  artist:d.artist.name
              },
              this.searchAlbum.push(d);
            //   console.log("searchAlbum",d)
              return d;
          })
        });
     },

  }
}
</script>

<style lang="less" scoped>
h4{
    color:#ccc;
    font-size:6px;
}
ul{
  padding-bottom:20px;
}
</style>