<template>
  <div>
    <!-- 表单事件submit提交 -->
    <div class="inputBox">
      <form @submit.prevent="change(keywords)">
        <div class="input">
          <i></i>
          <input
            type="text"
            v-model="keywords"
            placeholder="搜索歌曲，歌手，专辑"
            @input="inputing = true"
          />
        </div>
      </form>
      <button class="close" v-show="keywords" @click="closeSearch">
        <span>×</span>
      </button>
    </div>
    <component
      :is="search"
      :keywords="keywords"
      @change="change"
      :searchHistory="searchHistory"
    ></component>
  </div>
</template>
<script>
import HotSearch from "@/components/HotSearch";
import SearchSuggest from "@/components/SearchSuggest";
import SearchResult from "@/components/SearchResult";
// import SearchSong from "@/components/SearchSong";
export default {
  name: "Search",
  data() {
    return {
      search: "HotSearch",
      keywords: "",
      inputing: false, //标记是否文本框正在输入
      searchHistory: null,
    };
  },
  created() {},
  updated() {},
  methods: {
    //点击搜索的结果
    change(val) {
      this.keywords = val;
      this.inputing = false;
      let data = { keywords: this.keywords };
      var list = JSON.parse(localStorage.getItem("result") || "[]");
      // console.log(list);
      //如果搜索记录已经存在
      for (let i = 0; i < list.length; i++) {
        if (list[i].keywords == this.keywords) {
          //先将记录删除掉
          localStorage.removeItem("result");
          //然后删除相同关键字的记录
          list.splice(i, 1);
          //再将此条记录添加在头部
          list.unshift(data);
          //如果关键字不为空，则将数据记录在localstorage
          if (this.keywords != "") {
            localStorage.setItem("result", JSON.stringify(list));
          }
          //跳转组件到搜索结果
          this.search = "SearchResult";
          return;
        }
      }
      //搜索记录不存在，则直接添加
      list.unshift(data);
      //重新保存最新的历史记录
      if (this.keywords != "") {
        localStorage.setItem("result", JSON.stringify(list));
      }
      this.search = "SearchResult";
    },
    closeSearch() {
      this.keywords = "";
      this.search = "HotSearch";
      console.log("this.keywords", this.keywords);
    },
  },
  watch: {
    //切换组件
    keywords(val) {
      if (val == "") {
        this.search = "HotSearch";
      } else if (this.inputing) {
        this.search = "SearchSuggest";
      }
    },
  },
  components: {
    HotSearch,
    SearchSuggest,
    SearchResult,
    // SearchSong
  },
};
</script>
<style lang="less" scoped>
div {
  width: 100%;
  height: auto;
  padding: 0 8px;
  background-color: #1a1a1a;
  .inputBox {
    position: relative;
    .input {
      position: relative;
      width: 100%;
      height: 30px;
      padding: 0px 10px;
      box-sizing: border-box;
      border-radius: 30px;
      background-color: #000;
      display: flex;
      margin-top: 15px;

      i {
        margin-top: 8px;
        display: inline-block;
        width: 13px;
        height: 13px;
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg==);
      }
      input {
        flex: 1;
        background-color: transparent;
        outline: none;
        border: none;
        color: #fff;
        text-indent: 1em;
      }
    }
    .close {
      margin-top: 6px;
      border: none;
      outline: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      text-align: left;
      font-size: 16px;
      line-height: 16px;
      position: absolute;
      z-index: 200;
      right: 15px;
      top: 0px;
      background: rgb(63, 62, 62);
      span {
        // font-weight: bold;
        color: #ddd;
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
