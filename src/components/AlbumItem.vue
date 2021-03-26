<template>
    <div
      class="box"
      v-if="item"
    >
      <router-link
        v-if="item"
        :to="`/albums/${item.id}`"
      >
        <div class="albums">
          <img :src="item.picUrl+'?imageView=1&type=webp&thumbnail=369x0'" alt="" />
          <p>
            <span :style="{color:item.name == keywords? '#f5d93b':'#fff'}">{{ item.name }}</span>
            <span class="artname">{{item.artist.name}}</span>
          </p>
          <span class="run"></span>
        </div>
      </router-link>
    </div>
</template>

<script>
export default {
    name:"AlbumItem",
    props:["item","keywords"]
}
</script>

<style lang="less" scoped>
 .box {
    position: relative;
    width: 100%;
    height: 60px;
    margin-bottom:10px;
    a {
      position: absolute;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      text-decoration: none;
    }
    .albums {
      margin-top: 10px;
      width: 100%;
      height: 60px;
      position: relative;
      display: flex;
      justify-content: space-between;
      img {
        width: 50px;
        height: 50px;
        margin-top: 5px;
        margin-right: 20px;
        flex: 0.2;
      }
      p {
        display: inline-block;
        margin-top: 20px;
        color: #fff;
        flex: 0.794;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        span {
          margin-left: 10px;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width:60vw;
        }
        .artname{
            font-size:6px;
            color:#aaa;
        }
      }
      .run {
        flex: 0.06;
        display: block;
        width: 8px;
        height: 13px;
        margin-top: 23px;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyNiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI5YjliIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTIuOTM5IDIzLjkzOUwxMy44NzkgMTMgMi45MzkgMi4wNjEiLz48L3N2Zz4=);
        background-repeat: no-repeat;
      }
    }
}
</style>