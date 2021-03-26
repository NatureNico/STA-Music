<template>
  <transition enter-active-class="animate__animated animate__bounceInLeft">
    <div class="player" v-if="$root.musicStore.musicID">
      <audio
        v-if="lyric != null"
        :src="`https://music.163.com/song/media/outer/url?id=${$root.musicStore.musicID}.mp3
`"
        autoplay
        @timeupdate="timeUpdate"
        ref="audio"
        @pause="pause"
        @play="play"
        @ended="nextSong"
      ></audio>
      <!-- <ul>
            <li v-for="m in $root.musicStore.musicList" :key="m.id" 
            :style="{color:m.id == $root.musicStore.musicID?'red':''}">{{m.name}}</li>
        </ul> -->
      <div class="playBar" v-if="$root.musicStore.musicID">
        <i ref="randImg"><img :src="$root.musicStore.currentMusic.picUrl+'?imageView=1&type=webp&thumbnail=369x0'" /></i>
        <i @click="isFullPage = true">{{
          $root.musicStore.currentMusic.name
        }}</i>
        <i @click="changePlay">
          <canvas
            height="50"
            ref="processBtn"
            width="50"
          ></canvas>
           <img
              class="iconP"
              :src="
                isPlay
                  ? require('../assets/play3.svg')
                  : require('../assets/pause3.svg')
              "
            />
          <!-- <button>
            <img
              class="iconP"
              :src="
                isPlay
                  ? require('../assets/play3.svg')
                  : require('../assets/pause3.svg')
              "
            />
          </button> -->
        </i>
      </div>
      <div class="fullPage" v-show="isFullPage">
        <div
          class="bgImg"
          :style="{
            background: `url(${$root.musicStore.currentMusic.picUrl+'?imageView=1&type=webp&thumbnail=369x0'})`,
          }"
        >
          <div></div>
        </div>
        <p class="back" @click="isFullPage = false">
          <img src="../assets/return.svg" />
        </p>
        <div class="songname">{{ $root.musicStore.currentMusic.name }}</div>
        <div class="songImg" ref="songImg">
          <img :src="$root.musicStore.currentMusic.picUrl+'?imageView=1&type=webp&thumbnail=369x0'" />
        </div>
        <!-- <div class="lyric" v-show="lyric==null">加载中...</div> -->
        <div class="lyricM" v-if="lyric" v-show="lyric.length <= 0">
          纯音乐，请欣赏
        </div>
        <div class="lyric" v-if="lyric != null" @timeupdate="timeUpdate">
          <ul
            class="lyriclist"
            :style="{
              transform: `translateY(-${moveTop}px)`,
            }"
          >
            <li
              ref="lyricLi"
              v-for="(l, index) in lyric"
              :key="index"
              :class="{ active: curIndex == index }"
            >
              {{ l.lyric }}
            </li>
          </ul>
        </div>
        <div class="progress">
          <span>{{ currentTime | getFormatTime }}</span>

          <div class="proBox">
            <input
              type="range"
              min="0"
              :max="duration"
              :value="currentTime"
              @change="changeTime"
            />
            <i :style="{ width: `${(currentTime / duration) * 70}vw` }"></i>
          </div>
          <span>{{ duration | getFormatTime }}</span>
        </div>
        <div class="controlBar">
          <button @click="changeMode">
            <img
              :src="
                change
                  ? require('../assets/all.svg')
                  : require('../assets/random.svg')
              "
            />
          </button>
          <button @click="prevSong">
            <img src="../assets/back.svg" alt="" />
          </button>
          <button @click="changePlay">
            <img
              :src="
                isPlay
                  ? require('../assets/pause1.svg')
                  : require('../assets/play.svg')
              "
            />
          </button>
          <button @click="nextSong">
            <img src="../assets/after.svg" alt="" />
          </button>
          <button @click="showPlayList = !showPlayList">
            <img src="../assets/list.svg" alt="" />
          </button>
        </div>
      
      <transition enter-active-class="animate__animated animate__bounceInUp" leave-active-class="animate__animated animate__bounceOutDown">
        <div class="playList" v-show="showPlayList">
          <div class="topData">
          <div class="btn" @click="btnChange">×</div>
          <h4>播放列表({{$root.musicStore.musicList.length}})</h4>
          </div>
          <ul>
            <li
              v-for="v in $root.musicStore.musicList"
              :key="v.id"
              :style="{
                color: v.id == $root.musicStore.musicID ? '#f5d93b' : '',
              }"
             
            >
              <span class="songName"  @click="playMusic(v)">{{ v.name }}
                <!-- <span class="artName">-{{v.ar[0].name || v.arctists[0].name}}</span> -->
              </span>
              <i @click="removeSong(v.id)">×</i>
            </li>
          </ul>
        </div>
      </transition>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Play",
  // props:['musicID'],
  data() {
    return {
      // musicID:null
      isPlay: true,
      isFullPage: false,
      duration: 0,
      currentTime: 0,
      showPlayList: false,
      curIndex: 0,
      moveTop: 0,
      lyric: null,
      playMode: "",
      change: true,
    };
  },
  filters: {
    getFormatTime(nowTime) {
      nowTime = nowTime || 0;
      // let h = parseInt(nowTime/3600);
      let m = parseInt((nowTime % 3600) / 60);
      let s = parseInt(nowTime % 60);
      // h = h < 10 ? "0"+h : h;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return m + ":" + s;
    },
  },
  computed: {
    musicIDS() {
      //定义computed musicID 依赖 我们 $root.musicStore.musicID
      let musicID = this.$root.musicStore.musicID;
      return musicID;
    },
  },
  watch: {
    musicIDS(musicID) {
      //侦听musicIDS变化
      //根据musicID获取歌词
      this.$axios
        .get("http://music.kele8.cn/lyric?id=" + musicID)
        .then((data) => {
          console.log('data.data.nolyric',data.data);
          //如果没有时间，则无括号，证明没有歌词
          if (data.data.lrc == undefined ||data.data.lrc.lyric.indexOf('[')==-1 ) {
            this.lyric = [];
            console.log('无歌词')
            return;
          }else{

            let lyricArr = data.data.lrc.lyric.split("\n");
            // newLyric.pop();//取出匹配不到的最后一条
  
            let reg = /\[(\d+):(\d+\.\d+)\](.*)/;
            let newLyric = lyricArr.map((d) => {
              if (reg.test(d)) {
                return {
                  time: parseInt(RegExp.$1) * 60 + parseFloat(RegExp.$2),
                  lyric: RegExp.$3,
                };
              }
            });
            newLyric.pop(); //取出匹配不到的最后一条
            // console.log(newLyric);
            this.lyric = newLyric;
          }
        });
      }
  },
  methods: {
    removeSong(id){
      for(let i = 0 ; i < this.$root.musicStore.musicList.length;i++){
        if(id == this.$root.musicStore.musicList[i].id){
          this.$root.musicStore.musicList.splice(i,1);
          i--;
        }
      }
    },
    btnChange(){
      this.showPlayList = !this.showPlayList;
    },
    playMusic(item) {
      this.$root.musicStore.musicID = item.id;
      this.$root.musicStore.currentMusic = item;
    },

    changeMode() {
      if (this.change == true) {
        this.change = false;
      } else {
        this.change = true;
      }
      console.log("change", this.change);
    },
    changeSong() {
      let currentIndex = 0;
      let musicList = this.$root.musicStore.musicList;

      if (!this.change) {
        return parseInt(musicList.length * Math.random());
      }

      for (let i in musicList) {
        if (musicList[i].id === this.$root.musicStore.musicID) {
          currentIndex = i;
          break;
        }
      }
      return currentIndex;
    },
    prevSong() {
      let currentIndex = this.changeSong();
      let musicList = this.$root.musicStore.musicList;
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = musicList.length - 1;
      }
      //改变当前播放音乐的信息
      this.$root.musicStore.musicID = musicList[currentIndex].id; //改变播放ID
      this.$root.musicStore.currentMusic = musicList[currentIndex]; //改变当前播放音乐的信息
    },
    nextSong() {
      let currentIndex = this.changeSong();
      let musicList = this.$root.musicStore.musicList;
      currentIndex++;
      if (currentIndex > musicList.length - 1) {
        currentIndex = 0;
      }
      //改变当前音乐的信息
      this.$root.musicStore.musicID = musicList[currentIndex].id; //改变播放ID
      this.$root.musicStore.currentMusic = musicList[currentIndex]; //改变当前播放音乐的信息
    },
    pause(event) {
      this.isPlay = true;
      this.changePlay();
      this.timeUpdate(event);
    },
    play(event) {
      this.isPlay = false;
      this.changePlay();
      this.timeUpdate(event);
    },
    changeTime(event) {
      let time = event.target.value;
      this.currentTime = time;
      this.$refs.audio.currentTime = time;
    },
    changePlay() {
      let audio = this.$refs.audio;
      let randImg = this.$refs.randImg;
      let songImg = null;
      if (this.isFullPage) {
        songImg = this.$refs.songImg;
      }
      if (this.isPlay) {
        audio.pause();
        this.isPlay = false;
        randImg.style.animationPlayState = "paused";
        if (this.isFullPage) songImg.style.animationPlayState = "paused";
      } else {
        audio.play();
        this.isPlay = true;
        randImg.style.animationPlayState = "running";
        if (this.isFullPage) songImg.style.animationPlayState = "running";
      }
    },
    timeUpdate(event) {
      let audio = event.target; //获取audio元素
      let currentTime = audio.currentTime; //当前播放时间
      let duration = audio.duration; //获取音频的总时长
      this.currentTime = currentTime;
      this.duration = duration;
      this.drawCircle(currentTime, duration);
      // console.log("this.lyric",this.lyric.length);
      if (this.lyric.length <= 0) {
        // console.log("纯音乐，请欣赏");
      }
      if(this.lyric){
         for (let i = 0; i < this.lyric.length; i++) {
        if (i >= this.lyric.length - 1) {
          this.curIndex = i;
          break;
        }
        if (
          this.lyric[i].time <= currentTime &&
          currentTime < this.lyric[i + 1].time
        ) {
          if (i >= 2) {
            //获取当前播放歌词上一条歌词距离父元素上面的距离
            this.moveTop = this.$refs.lyricLi[i - 2].offsetTop;
          } else {
            this.moveTop = 0;
          }
          this.curIndex = i;
          break;
        }
      }
      }
     
    },
    drawCircle(currentTime, duration) {
      let canvas = this.$refs.processBtn.getContext("2d"); //画布
      canvas.clearRect(0, 0, 50, 50);
      canvas.beginPath();
      canvas.strokeStyle = "#2b2e33";
      canvas.lineWidth = 2;
      canvas.arc(25, 25, 20, 0, 2 * Math.PI);
      canvas.stroke();
      canvas.closePath();

      canvas.beginPath();
      canvas.strokeStyle = "#f5d93b";
      canvas.lineWidth = 2;
      canvas.arc(
        25,
        25,
        20,
        0,
        2 * Math.PI * parseFloat(currentTime / duration)
      );
      canvas.stroke();
      canvas.closePath();

      canvas.beginPath();
      canvas.fillStyle = "rgba(255,0,0,0.5)";
      canvas.font = "12px";
      // canvas.textAlign="center";
      //放入图片
      let img = new Image();

      // img.src = "../assets/play3.svg";
      // if (!this.isPlay) {
        // img.src = "../assets/pause3.svg";
      // }
      img.onload = function () {
        canvas.drawImage(this, 25, 25);
      };
      // canvas.drawImage(img,25,25);
      canvas.closePath();
    },
    pausePlay() {},
  },
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  display: none;
}
.player {
  margin-top: 80px;
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 10;
  audio {
    height: 50px;
  }
  .playBar {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background-color: #000;
    i {
      &:first-of-type {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        animation: randImg 5s linear 0s infinite;
      }
      &:nth-of-type(2) {
        flex: 1;
        text-align: center;
        font-style: normal;
        padding: 0px 10px;
        font-size: 16px;
      }
      &:last-of-type {
        background: transparent;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: relative;
        padding: 0;
        .iconP {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  .fullPage {
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 20;
    background-color: #1e1e1e;
    .bgImg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      opacity: 0.3;
      // background-size: cover;
      filter: blur(10px);
      div {
        position: absolute;
        z-index: 21;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
      }
    }
    .back {
      position: absolute;
      text-align: center;
      display: block;
      width: 10vw;
      height: 10vw;
      top: 10px;
      left: 10px;
      // background-color: #000;
      border-radius: 10px;
      z-index: 22;
      background: url(../assets/return.svg);
    }
    .songname {
      position: absolute;
      color: #f5d93b;
      height: 10vh;
      width: 90vw;
      padding-top: 8px;
      font-size: 18px;
      // font-weight: bold;
      z-index: 50px;
      left: 50%;
      top: 10px;
      transform: translateX(-50%);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 10vw;
      padding-right: 10vw;
    }
    .songImg {
      width: 40vh;
      height: 40vh;
      border-radius: 50%;
      animation: randImg 10s linear 0s infinite;
      overflow: hidden;
      position: absolute;
      left: 50%;
      top: 12%;
      margin-left: -20vh;
      z-index: 22;
    }
    .lyricM{
      font-size:14px;
       z-index: 22;
      position: absolute;
      width: 100%;
      height: 27vh;
      text-align: center;
      overflow: hidden;
      top: 55vh;
      color: #fff;
      line-height: 27vh;
    }
    .lyric {
      font-size:14px;
      z-index: 22;
      position: absolute;
      width: 100%;
      height: 27vh;
      text-align: center;
      overflow: auto;
      top: 55vh;
      color: #fff;
      ul {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        transition: all 0.5s linear;
        li {
          line-height: 28px;
          &.active {
            color: #f5d93b;
            line-height: 30px;
            // text-overflow: ellipsis;
            // white-space: wrap;
          }
        }
      }
    }
    .progress {
      z-index: 22;
      width: 90vw;
      margin: 4vh auto;
      position: absolute;
      bottom: 10vh;
      left: 5vw;
      display: flex;
      justify-content: space-between;
      span{
        position: absolute;
        font-size:8px;
        display:inline-block;
        top:5px;
        &:first-of-type{
          left:0px;
        }
        &:last-of-type{
          right:0px;
        }
      }
      .proBox{
        position: absolute;
        width:70vw;
        left:10vw;
     
        input {
        //去除默认样式
        appearance: none;
        -webkit-appearance: none;
        width: 100%;
        background: transparent;
        &::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          //控制滑头
          width: 10px;
          height: 10px;
          margin-top: -2px;
          border-radius: 50%;
          background: yellow;
        }
        &::-webkit-slider-runnable-track {
          appearance: none;
          -webkit-appearance: none;
          height: 5px;
          border-radius: 3px;
          background: rgba(0, 0, 0, 0.5);
        }
      }
      i {
        position: absolute;
        width: 5px;
        height: 5px;
        left: 0px;
        top: 9px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        background-color: #f5d93b;
      }
      }
      
    }
    .playList {
      position: absolute;
      bottom: 0vh;
      // left: 5vw;
      padding: 10px;
      height: 50vh;
      width: 100vw;
      overflow-y: auto;
      background-color: #333;
      // border-radius: 20px;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      z-index: 23;
      font-size:14px;
      .topData{
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        position: fixed;
        width:100%;
        height:5vh;
        left:0;
        margin-top:-10px;
        background-color: #333;
        h4{
          line-height: 5vh;
        }
        .btn{
          position: absolute;
          right:20px;
          top:5px;
          font-size:24px;
        }
      }
      ul {
        margin-top:5vh;
        li {
          text-align: left;
          padding: 12px 5px;
          border-bottom: 1px solid rgb(65, 59, 59);
          .songName{
            display: inline-block;
            width:86vw;
            .artName{
              font-size:6px;
            }
          }
          i{
            // width:10vw;
            width:5vw;
            text-align: center;
            font-size:18px;
            right:3vw;
            color:#aaa;
          }
        }
      }
    }
  }
  .controlBar {
    width: 100%;
    z-index: 22;
    position: absolute;
    bottom: 0vh;
    display: flex;
    justify-content: space-around;
    padding: 0px 20px 0px 20px;
    button {
      &:first-of-type,
      &:nth-of-type(2),
      &:nth-of-type(3),
      &:nth-of-type(4),
      &:last-of-type {
        margin-left: 15px;
        width: 15vw;
        height: 15vw;
        background: transparent;
        outline: none;
        border: none;
      }
      &:last-of-type {
        margin-right: 15px;
      }
    }
  }
}
@keyframes randImg {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>