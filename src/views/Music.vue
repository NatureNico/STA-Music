<template>
  <div>
    <!-- <h4>热门歌手</h4> -->
    <ul class="artlist" v-if="artList.length > 0">
      <ArctistList v-for="s in artList" :key="s.id" :item="s"></ArctistList>
    </ul>
    <Loading v-if="showLoading"></Loading>
    <div class="loadingmore" @click="loadMore">{{tipText}}</div>
  </div>
</template>

<script>
import ArctistList from "@/components/ArctistList";
import Loading from "@/components/Loading";
export default {
  name: "Music",
  components: {
    ArctistList,
    Loading
  },
  data() {
    return {
      artList: [],
      page:1,
      showLoading:true,
      tipText:"加载更多"
    };
  },
  created() {
    this.load();
  },
  methods: {
     load(){
       let offset = (this.page - 1) *20;
        this.$axios
      .get("/top/artists?offset="+offset+"&limit=20")
      .then((data) => {
        this.artList = this.artList.concat(data.data.artists);
        // console.log("this.artList",this.artList);
        this.showLoading = false;
        // console.log("热门", this.artList);
      })
      .catch((err) => {
        console.log(err);
      });
    },
    loadMore(){
      this.page++;
      if(this.page >= 5){
        this.tipText="已无更多歌手信息"
      }
      this.showLoading = true;
      this.load();
    }
  },
};
</script>

<style lang="less" scoped>
div {
  h4 {
    padding: 10px;
    font-size: 14px;
  }
  .artlist {
    margin-top:10px;
    text-decoration: none;
  }
  .loadingmore{
   background-color: #1a1a1a;
    margin-top: 10px;
    color: #f5d93b;
    text-align: center;
    font-size:14px;
    padding-bottom:15px;
  }
}
</style>