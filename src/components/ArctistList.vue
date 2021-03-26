<template>
  <div class="art">
    <router-link :to="`/arctists/${item.id}`">
      <div class="box">
        <div class="icon">
          <img class="iconPic" :src="item.picUrl+'?imageView=1&type=webp&thumbnail=369x0'" alt="" />
        </div>
      </div>
    </router-link>
    <router-link :to="`/arctists/${item.id}`">
      <p>{{ item.name }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "ArtistList",
  props: ["item"],
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.art {
  padding: 10px;
  height: 100px;
  position: relative;
  a {
    position: absolute;
    left: 0px;
    padding: 0px 20px;
    text-decoration: none;
    .box {
      position: absolute;
      top:50%;
       transform: translateY(-50%);
      width: 70px;
      height: 70px;
      overflow: hidden;
      border-radius: 50%;
      .icon {
        position: absolute;
        width: 90px;
        height: 90px;
        top: 0px;
        left: -10px;
        overflow: hidden;
        .iconPic {
          position: absolute;
          display: block;
          top: 0px;
          left: 0px;
          width: 120px;
        }
      }
    }
  }
  a {
    position: absolute;
    top: 0px;
    width: 50vw;
    height: 90px;
    text-decoration: none;
    p {
      position: absolute;
      width: 50vw;
      left: 110px;
      top: 50%;
      transform: translateY(-50%);
      color: #fff;
      text-align: left;
      font-size: 14px;
    }
  }
}
</style>