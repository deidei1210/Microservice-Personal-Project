<template>
  <div class="map-weather-container">
    <!-- 用于显示地图 -->
    <div class="map">
      <baidu-map
        class="map"
        :center="{ lng: 121.474, lat: 31.23 }"
        :zoom="zoom"
        @click="handleMapClick"
      >
        <!-- 给特殊地点加上一些标注和说明 -->
        <bm-marker
          v-for="(marker, index) in markers"
          :key="index"
          :position="marker.position"
          :dragging="false"
          @click="handleMarkerClick(marker, index)"
        >
          <bm-label
            :content="marker.content"
            :labelStyle="{ color: 'red', fontSize: '15px' }"
            :offset="{ width: -35, height: 30 }"
          ></bm-label>
        </bm-marker>

        <div class="zoom-controls">
          <button @click="zoomIn">放大</button>
          <button @click="zoomOut">缩小</button>
        </div>
      </baidu-map>
    </div>

    <!-- 用于显示天气 -->
    <div class="weather-container" v-if="weatherData">
      <div class="weather-header">
        <p style="font-size: 24px; font-weight: bold; border-bottom: 1px solid #ccc">
          {{ weatherData.lives[0].city }}实时天气
          <span style="color: #aaa; font-size: 16px; font-weight: normal">
            {{ weatherData.lives[0].reporttime }}
          </span>
        </p>
      </div>
      <div class="weather-details">
        <p>温度🌡️：{{ weatherData.lives[0].temperature }}°C</p>
        <p>天气☁️：{{ weatherData.lives[0].weather }}</p>
        <p>湿度💧：{{ weatherData.lives[0].humidity }}%</p>
        <p>风向🌬：{{ weatherData.lives[0].winddirection }}风</p>
        <p>风力💨：{{ weatherData.lives[0].windpower }}级</p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BaiduMap,
  BmWalking,
  BmInfoWindow,
  BmBoundary,
  BmScale,
  BmMarker,
  BmLabel,
} from "vue-baidu-map-3x";
import { ref, onMounted } from "vue";
import axios from "axios";
// import { Configuration, OpenAIApi } from "openai"; // 根据实际情况调整库的导入路径
import OpenAI from "openai";
export default {
  components: {
    BaiduMap,
    BmWalking,
    BmInfoWindow,
    BmBoundary,
    BmScale,
    BmMarker,
    BmLabel,
  },
  data() {
    return {
      center: { lat: 39.9, lng: 116.4 },
      zoom: 15,
      //一些景点坐标点
      markers: [
        {
          position: { lng: 121.4912, lat: 31.2438 },
          content: "南京东路",
          show: false,
        },
        {
          position: { lng: 121.4811, lat: 31.2346 },
          content: "人民广场",
          show: false,
        },
        {
          position: { lng: 121.5073, lat: 31.2437 },
          content: "陆家嘴",
          show: false,
        },
        {
          position: { lng: 121.4972, lat: 31.2429 },
          content: "外滩",
          show: false,
        },
        {
          position: { lng: 121.4972, lat: 31.2489 },
          content: "外白渡桥",
          show: false,
        },
        {
          position: { lng: 121.4896, lat: 31.2482 },
          content: "乍浦路桥",
          show: false,
        },
        {
          position: { lng: 121.4943, lat: 31.2343 },
          content: "豫园",
          show: false,
        },
        {
          position: { lng: 121.483, lat: 31.2342 },
          content: "上海博物馆",
          show: false,
        },
        {
          position: { lng: 121.4746, lat: 31.2266 },
          content: "淮海中路",
          show: false,
        },
        {
          position: { lng: 121.5083, lat: 31.2469 },
          content: "东方明珠",
          show: false,
        },
        {
          position: { lng: 121.4526, lat: 31.2292 },
          content: "静安寺",
          show: false,
        },
        {
          position: { lng: 121.4449, lat: 31.211 },
          content: "武康大楼",
          show: false,
        },
        {
          position: { lng: 121.4455, lat: 31.2102 },
          content: "宋庆龄故居",
          show: false,
        },
        {
          position: { lng: 121.4427, lat: 31.2015 },
          content: "徐家汇",
          show: false,
        },
        {
          position: { lng: 121.4759, lat: 31.2139 },
          content: "田子坊",
          show: false,
        },
        {
          position: { lng: 121.4812, lat: 31.2229 },
          content: "中共一大会址",
          show: false,
        },
        {
          position: { lng: 121.5076, lat: 31.2132 },
          content: "南浦大桥",
          show: false,
        },
        {
          position: { lng: 121.4691, lat: 31.2424 },
          content: "上海自然博物馆",
          show: false,
        },
        {
          position: { lng: 121.4761, lat: 31.2199 },
          content: "思南公馆",
          show: false,
        },
        {
          position: { lng: 121.4761, lat: 31.2199 },
          content: "四川北路",
          show: false,
        },
        {
          position: { lng: 121.4761, lat: 31.2199 },
          content: "思南公馆",
          show: false,
        },
        {
          position: { lng: 121.4899, lat: 31.2776 },
          content: "鲁迅公园",
          show: false,
        },
        {
          position: { lng: 121.4908, lat: 31.2581 },
          content: "四川北路",
          show: false,
        },
        {
          position: { lng: 121.5055, lat: 31.2529 },
          content: "北外滩",
          show: false,
        },
        {
          position: { lng: 121.5331, lat: 31.2561 },
          content: "杨浦滨江",
          show: false,
        },
        {
          position: { lng: 121.49, lat: 31.2711 },
          content: "甜爱路",
          show: false,
        },
        {
          position: { lng: 121.488, lat: 31.2696 },
          content: "多伦路文化名人街",
          show: false,
        },
        {
          position: { lng: 121.5088, lat: 31.2888 },
          content: "同济大学",
          show: false,
        },
        {
          position: { lng: 121.5055, lat: 31.2529 },
          content: "北外滩",
          show: false,
        },
        {
          position: { lng: 121.5055, lat: 31.2529 },
          content: "北外滩",
          show: false,
        },
        {
          position: { lng: 121.5055, lat: 31.2529 },
          content: "北外滩",
          show: false,
        },
        {
          position: { lng: 121.5055, lat: 31.2529 },
          content: "北外滩",
          show: false,
        },
        {
          position: { lng: 121.5055, lat: 31.2529 },
          content: "北外滩",
          show: false,
        },
      ],
      weatherData: null, //存储天气数据
      city: "310000", //上海
      selectedMarkerIndex: -1, // 记录选中的标记索引
    };
  },
  created() {
    this.getWeatherData();
    // this.searchWiki("上海");
    console.log(this.weatherData);
    // this.initGPT3();
  },
  mounted() {
    this.mapInstance = this.$refs.map ? this.$refs.map.getMap() : null;
    this.getWeatherData();
  },
  methods: {
    //通过点击地图上的点获得该点具体的地点名称
    handleMapClick(event) {
      const point = new BMap.Point(event.point.lng, event.point.lat);
      const geoc = new BMap.Geocoder();

      // 调用百度地图 API 的逆地理编码方法获取地名
      geoc.getLocation(point, (result) => {
        if (result) {
          const address = result.address; // 地名
          const lng = result.point.lng; // 经度
          const lat = result.point.lat; // 纬度

          // 处理获取到的地名、经纬度数据
          console.log("地名:", address);
          console.log("经度:", lng);
          console.log("纬度:", lat);
        }
      });
    },
    //放大地图
    zoomIn() {
      this.zoom += 1; // 放大地图缩放级别
      // this.$refs.baiduMap.setZoom(this.zoom); // 调用 setZoom 方法更新地图缩放级别
    },
    //缩小地图
    zoomOut() {
      this.zoom -= 1; // 缩小地图缩放级别
      // this.$refs.baiduMap.setZoom(this.zoom); // 调用 setZoom 方法更新地图缩放级别
    },
    //调用天气api，已经可以调取成功
    getWeatherData() {
      const key = "	3f6157ccb2e4ec191a030932e211ffaa"; // 将 `your key` 替换成你的高德开发者key
      const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${this.city}`;
      console.log("获取天气");
      axios
        .get(url)
        .then((response) => {
          if (response.status === 200) {
            this.weatherData = response.data;
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    //调用Wiki百科API
    async searchWiki(keyword) {
      try {
        const response = await axios.get("https://zh.wikipedia.org/w/api.php", {
          params: {
            format: "json",
            action: "query",
            generator: "search",
            gsrnamespace: 0,
            gsrlimit: 5,
            prop: "pageimages|extracts",
            pilimit: "max",
            exintro: true,
            explaintext: true,
            exsentences: 1,
            exlimit: "max",
            origin: "*",
            gsrsearch: keyword,
          },
        });
        console.log(response.data.query.pages);
        // var href="http://en.wikipedia.org/wiki/"+encodeURIComponent(response.data.query.pages[0].title)
        // console.log(href)
      } catch (error) {
        console.error("Error:", error);
      }
    },
    handleMarkerClick(marker, index) {
      // const details = marker.name; // 假设标记对象中有一个属性 name 存储地点名称
      console.log("点击了" + index);
      const details = this.markers[index].content;
      console.log(details);
      //调用Wiki的接口
      var href = this.searchWiki(details);
      //调用GPT接口
      this.initGPT3(details);
    },
    async initGPT3(details) {
      const API_KEY = "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"; //输入API Key
      const openai = new OpenAI({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true,
      });
      console.log("正在生成介绍" + details + "的信息");
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `你好，请问可以给我介绍一下上海的 ${details} 吗？用200个字概括！`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      console.log(chatCompletion);
      console.log(chatCompletion.choices[0].message.content);
    },
  },
};
</script>

<style>
.map-weather-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 将屏幕分为两列 */
}
.map {
  /* position: relative; */
  grid-column: 1 / 2; /* 将map容器放在第一列 */
  display: flex;
  width: 97%;
  height: 950px;
}
.zoom-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9999;
}
.weather-container {
  /* position: absolute; */
  /* display: flex; */
  grid-column: 2 / 3; /* 将weather-container容器放在第二列 */
  width: 96%;
  height: 283px;
  top: 10px;
  left: 10px;
  z-index: 9999;
  background-color: #b0e2ff; /* 设置背景颜色为浅蓝色 */
  border-radius: 10px; /* 设置圆角边框半径为10px */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 设置阴影效果 */
  /* 添加其他样式 */
}
.weather-header{
  margin-left: 28px;
  margin-right: 28px;
}
.weather-details {
  margin-left: 28px;
}
</style>