<template>
  <div class="box">
    <div class="top"  v-show="$route.meta.showNav">STA MUSIC</div>
    <ul class="topnav" v-show="$route.meta.showNav">
      <li>
        <router-link to="/recommend">推荐音乐</router-link>
      </li>
      <li>
        <router-link to="/music">热门歌手</router-link>
      </li>
      <li>
        <router-link to="/hot">热歌榜</router-link>
      </li>
      <li>
        <router-link to="/search">搜索</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .top {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
    width: 100%;
    height: 60px;
    background-color: #f5d93b;
    z-index: 10;
    text-indent: 20vw;
    // font-weight: bold;
    color: #000;
    font-size:22px;
    &::before{
      content:"";
      display: block;
      background: url(../assets/music.svg);
      width:40px;
      height:40px;
      // position: absolute;
      // z-index: 50;
      background-size: cover;
      margin-right:10px;
    }
  }
  .topnav {
    z-index: 10;
    position: fixed;
    top:0px;
    width:100%;
    margin-top: 60px;
    border-bottom: 1px solid #ccc;
    display: flex;
    background-color: #1a1a1a;
    font-size:15px;
    li {
      flex: 1;
      text-align: center;
      line-height: 40px;
      a {
        color: #fff;
        display: inline-block;
        text-decoration: none;
        &.router-link-exact-active {
          color: #f5d93b;
          border-bottom: 2px solid #f5d93b;
        }
      }
    }
  }
}
</style>