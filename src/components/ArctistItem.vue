<template>
    <div
      class="box"
      v-if="item"
    >
      <router-link
        v-if="item"
        :to="`/arctists/${item.id}`"
      >
        <div class="artist">
          <img :src="item.picUrl" alt="" />
          <p>
            <span :style="{color:item.name == keywords? '#f5d93b':'#fff'}">{{ item.name }}</span>
          </p>
          <span class="run"></span>
        </div>
      </router-link>
    </div>
</template>

<script>
export default {
    name:"ArctistItem",
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
    .artist {
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
        background: url(../assets/photo.jpg);
        background-size: cover;
      }
      p {
        display: inline-block;
        margin-top: 20px;
        color: #fff;
        flex: 0.794;
        span {
          margin-left: 10px;
          color: #fff;
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