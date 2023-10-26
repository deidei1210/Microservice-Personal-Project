<template>
  <div class="map-weather-container">
    <!-- 用于显示地图 -->
    <div class="map">
      <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom=true @click="handleMapClick">

        <!-- 给特殊地点加上一些标注和说明 -->
        <bm-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :dragging="false"
          @click="handleMarkerClick(marker, index)">
          <bm-label :content="marker.content" :labelStyle="{ color: 'red', fontSize: '15px' }"
            :offset="{ width: -35, height: 30 }"></bm-label>
        </bm-marker>
        <!-- 地图类型切换 -->
        <!-- <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type> -->

        <div class="zoom-controls">
          <button @click="zoomIn">放大</button>
          <button @click="zoomOut">缩小</button>
        </div>
        <!-- 显示当前用户点击的地点的经纬度 -->
        <div class="showAddress">
          <div>纬度：{{ clickLat }}</div>
          <div>经度：{{ clickLng }}</div>
          <div>地址：{{ clickAddress }}</div>
        </div>

        <!-- 步行路线 -->
        <bm-walking v-if="planRoute" :start="startPosition" :end="endPosition" location="上海" :auto-viewport="true"
          :selectFirstResult="true" :panel="true"></bm-walking>
        <!-- 公交线路查询 -->
        <!-- <bm-bus keyword="123路公交车" :auto-viewport="true" location="上海"></bm-bus> -->
      </baidu-map>
      <!-- 用于显示右边的信息框 -->
      <div class="info">
        <!-- 用于显示天气 -->
        <div class="weather-container" v-if="weatherData">
          <!-- 显示天气部分的title -->
          <div class="weather-header">
            <p style="font-size: 24px; font-weight: bold; border-bottom: 1px solid #ccc">
              {{ weatherData.lives[0].city }}实时天气☁️
              <span style="color: #d4d3d3; font-size: 16px; font-weight: normal">
                {{ weatherData.lives[0].reporttime }}
              </span>
            </p>
          </div>
          <!-- 天气的具体信息+出行建议 -->
          <div class="weather-details-container">
            <!-- 显示天气的具体信息 -->
            <div class="weather-details">
              <p>温度🌡️：{{ weatherData.lives[0].temperature }}°C</p>
              <p>天气☁️：{{ weatherData.lives[0].weather }}</p>
              <p>湿度💧：{{ weatherData.lives[0].humidity }}%</p>
              <p>风向🌬：{{ weatherData.lives[0].winddirection }}风</p>
              <p>风力💨：{{ weatherData.lives[0].windpower }}级</p>
            </div>
            <!-- 显示具体的出行建议 -->
            <div>
              <!-- title -->
              <div style="font-size: 18px; font-weight: bold;">出行智能小助手🤖️</div>
              <div class="weather-dialog-box">
                <div class="dialog-content">{{ dialogBox }}</div>
              </div>
              <!-- 添加按钮 -->
              <button id="dress-advice-btn" @click="getDressAdvice">穿衣建议</button>
              <button id="travel-advice-btn" @click="getTravelAdvice">出行建议</button>
              <button id="weather-summary-btn" @click="getWeatherSummary">天气概述</button>
              <!-- 对话框 -->
            </div>
          </div>
          <!-- 由于诗句的api一天内是有限额的，所以这边暂且注释掉，到时候演示和提交代码的时候别忘了放开注释 -->
          <div class="poem">{{ poem.content }} ———— {{ poem.author }}《{{poem.source}}》</div>
          <!-- <div class="poem">"黄河远上白云间，一片孤城万仞山。" ———— 白居易《登黄鹤楼》</div> -->

          <!-- 显示一周的天气走向 -->
          <div>
            <div ref="weatherChart" style="width: 600px; height: 400px;margin-left:20px;margin-top: 20px;"></div>
          </div>
        </div>
        <!-- 对景点的简介 -->
        <div class="brief-introduction">
          <!-- 显示wiki部分的title -->
          <div class="weather-header">
            <p style="font-size: 24px; font-weight: bold; border-bottom: 1px solid #ccc">
              景点简介📖
              <span style="color: #aaa; font-size: 16px; font-weight: normal">
                下面是对“{{ searchPlace }}"的简介
              </span>
            </p>
          </div>

          <!-- 显示搜索结果 -->
          <div class="briefintro-searchresult">
            <div v-html="briefIntro"></div>
          </div>

        </div>
        <!-- 用于显示维基百科查询结果 -->
        <div class="wiki-search">
          <!-- 显示wiki部分的title -->
          <div class="weather-header">
            <p style="font-size: 24px; font-weight: bold; border-bottom: 1px solid #ccc">
              景点wiki百科🔍
              <span style="color: #aaa; font-size: 16px; font-weight: normal">
                下面是对“{{ searchPlace }}"的搜索结果
              </span>
            </p>
          </div>

          <!-- 显示搜索结果 -->
          <div class="searchresult">
            <div v-for="page in WikiPage" :key="page.title">
              <div class="page-item">
                <img v-if="page.thumbnail && page.thumbnail.source" :src="page.thumbnail.source" :alt="page.title" />
                <div class="page-content">
                  <a :href="page.url" target="_blank" style="color:rgb(221, 110, 132);font-weight: bold;">{{ page.title
                  }}</a>
                  <p style="font-size: small;">{{ page.extract }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!-- 地图导航 -->
      <div class="guide-container info">
        <!-- 显示wiki部分的title -->
        <div class="weather-header">
          <p style="font-size: 24px; font-weight: bold; border-bottom: 1px solid #ccc">
            路线规划🚗
          </p>
        </div>
        <div class="route-details">
          <div style="display:inline-block;">当前选中地址：{{ clickAddress }}</div>
          <button @click="setStartPlace" style="display:inline-block;margin-left:10px;">设置为起点</button>
          <button @click="setEndPlace" style="display:inline-block;margin-left:10px;">设置为终点</button>
          <div style="margin-top:8px;">起点：<span v-if="startPlace">{{ startPlace }}</span>
            <span v-else>未选择起点</span>
          </div>
          <div style="margin-top:8px;">终点：<span v-if="endPlace">{{ endPlace }}</span>
            <span v-else>未选择终点</span>
          </div>
          <div style="margin-top:8px;">
            <button @click="PlanRoute">开始规划</button>
            <button @click="StopPlanRoute" style="margin-left:10px;">重新设置</button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script  defer="true">
/* eslint-disable */
import {
  BaiduMap,
  BmWalking,
  BmInfoWindow,
  BmBoundary,
  BmScale,
  BmMarker,
  BmLabel,
  BmLocalSearch,
  BmCircle,
  BmBus
} from "vue-baidu-map-3x";
import { ref, onMounted } from "vue";
import axios from "axios";
// import { Configuration, OpenAIApi } from "openai"; // 根据实际情况调整库的导入路径
import OpenAI from "openai";
import Qs from 'qs';
import * as echarts from 'echarts';

export default {
  components: {
    BaiduMap,
    BmWalking,
    BmInfoWindow,
    BmBoundary,
    BmScale,
    BmMarker,
    BmLabel,
    BmLocalSearch,
    BmCircle,
    BmBus,
    echarts
  },

  data() {
    return {
      center: { lat: 31.23, lng: 121.474 },
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
      dialogBox: "点击下面的按钮以获得智能小助手建议～",
      WikiPage: [], // 新添加的空数组
      searchPlace: "上海",
      briefIntro: "<p>暂时没有对该地点的简介哦～</p>",
      poem: "",

      //点击获取点击地点的经度和纬度
      clickLat: 31.23,
      clickLng: 121.474,
      clickAddress: "上海市杨浦区四平路1239号",

      //设置搜索范围
      nearby: {
        center: {
          lng: 121.474,
          lat: 31.23
        },
        radius: 10000
      },
      placeKeyword: "",
      startPlace: "",
      startPosition: null,

      endPlace: "",
      endPosition: null,

      planRoute: false,
      weatherWeek: null,
    };
  },
  watch: {
    weatherData(newData) {
      console.log(newData);
      // 在这里执行你希望在 weatherData 更新后立即执行的逻辑
      // console.log(this.weatherData);
    },
  },
  created() {
    this.getWeatherData();
    // if(this.weatherData!=null)
    this.getWeatherPoem();
    this.getWeekWeather();
  },

  mounted() {
    this.mapInstance = this.$refs.map ? this.$refs.map.getMap() : null;
    // this.getWeatherData();
    this.searchWiki("上海")
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

          this.clickLat = lat;
          this.clickLng = lng;
          this.clickAddress = address;

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

    //设置为起点
    setStartPlace() {
      this.startPlace = this.clickAddress
      this.startPosition = { lat: this.clickLat, lng: this.clickLng }
    },

    //设置为终点
    setEndPlace() {
      this.endPlace = this.clickAddress
      this.endPosition = { lat: this.clickLat, lng: this.clickLng }

    },
    PlanRoute() {
      if (this.startPlace != "" && this.endPlace != "")
        this.planRoute = true
      else {
        // 弹窗提醒用户设置起点和终点
        alert("请设置起点和终点");
      }
    },
    StopPlanRoute() {
      this.planRoute = false
      this.startPlace = ""
      this.endPlace = ""
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

    //调用天气诗句api
    getWeatherPoem() {

      axios({
        method: 'post',
        url: 'https://apis.tianapi.com/tianqishiju/index',
        data: Qs.stringify({ key: '1e12d5d1fb06599d02ef546b73e2c360', tqtype: 2 }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(res => {
        // this.tianapi_data = res.data
        console.log(res.data)
        this.poem = res.data.result
      }
      )
    },

    //得到一周的天气
    getWeekWeather() {
      axios({
        method: 'post',
        url: 'https://apis.tianapi.com/tianqi/index',
        data: Qs.stringify({ key: '1e12d5d1fb06599d02ef546b73e2c360', city: '101020100', type: '7' }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(res => {
        this.weatherWeek = res.data.result.list.map(item => ({
          week: item.week,
          date: item.date,
          lowest: parseFloat(item.lowest),
          highest: parseFloat(item.highest),
          weather: item.weather,
          sunrise: item.sunrise,
          sunset: item.sunset,
        }));
        console.log(this.weatherWeek)
        setTimeout(() => {
          this.drawChart();
        }, 200);
      });
    },
    drawChart() {
      const highestArr = this.weatherWeek.map(item => item.highest);
      const lowestArr = this.weatherWeek.map(item => item.lowest);
      const sunriseArr = this.weatherWeek.map(item => item.sunrise);
      const sunsetArr = this.weatherWeek.map(item => item.sunset);
      const weatherArr = this.weatherWeek.map(item => item.weather);
      const weekArr = this.weatherWeek.map(item => item.week);

      const chartDom = this.$refs.weatherChart;
      const myChart = echarts.init(chartDom);

      var option;
      option = {
        title: {
          text: '一周天气预报☁️',
          textStyle: {
            color: '#fff',
          },
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            color: 'black',
          },
          formatter: function (params) {
            var tooltipContent = '';
            var dataIndex = params[0].dataIndex;

            tooltipContent += '日期：' + weekArr[dataIndex] + '<br>';
            tooltipContent += '最高气温：' + highestArr[dataIndex] + '℃<br>';
            tooltipContent += '最低气温：' + lowestArr[dataIndex] + '℃<br>';
            tooltipContent += '日出时间：' + sunriseArr[dataIndex] + '<br>';
            tooltipContent += '日落时间：' + sunsetArr[dataIndex] + '<br>';
            tooltipContent += '天气状况：' + weatherArr[dataIndex] + '<br>';

            return tooltipContent;
          }
        },
        legend: {
          data: ['highest-temperature', 'lowest-temperature'],
          textStyle: {
            color: '#fff',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: weekArr,
          axisLabel: {
            textStyle: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff',
            },
          },
        },
        series: [
          {
            name: 'highest-temperature',
            type: 'line',
            data: highestArr,
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }],
              label: {
                show: true,
                color: '#fff',
                fontSize: 12,
              }
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            },
            lineStyle: {
              color: '#ef8183', // 设置折线颜色为红色
              width: 4 // 设置折线线宽为3
            },
            itemStyle:{
              color: '#ef8183' // 设置折线颜色为红色
            }
          },
          {
            name: 'lowest-temperature',
            type: 'line',
            data: lowestArr,
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ],
              label: {
                show: true,
                color: '#fff',
                fontSize: 12,
              }
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            },
            lineStyle: {
              color: '#699ed4', // 设置折线颜色为红色
              width: 4 // 设置折线线宽为3
            },
            itemStyle:{
              color: '#699ed4' // 设置折线颜色为红色
            }
          },
          {
            name: 'weather',
            type: 'scatter',
            data: weatherArr,
            symbolSize: 10,
            itemStyle: {
              color: '#fff',
            },
            tooltip: {
              formatter: function (params) {
                return '天气状况：' + params.value;
              }
            }
          }
        ],
      };

      myChart.setOption(option);
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
        const pages = response.data.query.pages;
        const wikiPages = [];
        for (let pageId in pages) {
          const page = pages[pageId];
          const wikiPage = {
            title: page.title,
            thumbnail: page.thumbnail,
            extract: page.extract,
            url: ""
          };
          // 将title拼接成访问中文维基百科的链接
          wikiPage.url = "http://zh.wikipedia.org/wiki/" + encodeURIComponent(page.title);
          wikiPages.push(wikiPage);
        }
        this.WikiPage = wikiPages;
        console.log(this.WikiPage);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    //得到景点介绍
    getBriefIntro(place) {
      axios({
        method: 'post',
        url: 'https://apis.tianapi.com/scenic/index',
        data: Qs.stringify({ key: '1e12d5d1fb06599d02ef546b73e2c360', word: place }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).then((res) => {
        if (res.data.code == 200)
          this.briefIntro = res.data.result.list[0].content;
        else {
          this.briefIntro = "<p>暂时没有对该地点的简介哦～</p>"
        }
        console.log(res.data)
        console.log(res)
      });
    },
    handleMarkerClick(marker, index) {
      // const details = marker.name; // 假设标记对象中有一个属性 name 存储地点名称
      console.log("点击了" + index);
      const details = this.markers[index].content;
      console.log(details);
      this.searchPlace = details;
      //调用Wiki的接口
      var href = this.searchWiki(details);
      //调用景点介绍的接口
      this.getBriefIntro(details)
      //调用GPT接口
      // this.initGPT3(details);
    },

    //点击穿衣按钮之后获取穿衣建议
    getDressAdvice() {
      const details =
        "已知今天上海的天气数据如下所示：" +
        "湿度：" +
        this.weatherData.lives[0].humidity +
        "，温度：" +
        this.weatherData.lives[0].temperature +
        "，天气：" +
        this.weatherData.lives[0].weather +
        "，风力：" +
        this.weatherData.lives[0].windpower +
        "，请问可以给出穿衣建议吗？比如说今天适合穿什么样的衣服？比如如果温度高于25度就适合穿短袖，如果温度在17到25之间左右就可以穿衬衫等等（用可爱俏皮的语句直接生成一段话，50到80字左右，不要列出一点一点的，也不要太长）";
      console.log(details);
      this.initGPT3(details, 1);
      this.showResponse();
    },
    //点击出行按钮之后获取出行建议
    getTravelAdvice() {
      const details =
        "已知今天上海的天气数据如下所示：" +
        "湿度：" +
        this.weatherData.lives[0].humidity +
        "，温度：" +
        this.weatherData.lives[0].temperature +
        "，天气：" +
        this.weatherData.lives[0].weather +
        "，风力：" +
        this.weatherData.lives[0].windpower +
        "，请问可以给出出行建议吗？就根据我给你的上海目前的天气信息给出，比如说如果今天下雨就建议打车或者地铁，如果今天天晴就建议骑自行车或者走路，如果风大就尽量不要骑车等等。（用可爱俏皮的语句直接生成一段话，50到80字左右，不要列出一点一点的，也不要太长）";
      console.log(details);
      this.initGPT3(details, 1);
      this.showResponse();
    },
    //点击天气概述按钮之后获取天气概述
    getWeatherSummary() {
      const details =
        "已知今天上海的天气数据如下所示：" +
        "湿度：" +
        this.weatherData.lives[0].humidity +
        "，温度：" +
        this.weatherData.lives[0].temperature +
        "，天气：" +
        this.weatherData.lives[0].weather +
        "，风力：" +
        this.weatherData.lives[0].windpower +
        "，请你用可爱俏皮的语句，同时写一首唐诗来描述今天的天气，这首诗需要包含今天的天气特点以及人们的活动，景色等等";
      console.log(details);
      this.initGPT3(details, 1);
      this.showResponse();
    },
    showResponse() {
      // 将回复显示在对话框中
      this.dialogBox = "正在生成中......";
    },

    async initGPT3(details, choice) {
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
            content: `你好，${details}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      console.log(chatCompletion);
      console.log(chatCompletion.choices[0].message.content);
      // 说明此时是在生成智能出行小助手
      if (choice == 1) {
        //显示在消息框内
        this.dialogBox = chatCompletion.choices[0].message.content;
      }
      else {

      }
    },

  }
};
</script>

<style>
.map-weather-container {
  /* display: grid; */
  /* grid-template-columns: 1fr 1fr; */
  /* 将屏幕分为两列 */
  width: 100%;
}

.map {
  /* position: relative; */
  /* grid-column: 1 / 2; */
  /* 将map容器放在第一列 */
  display: flex;
  width: 100%;
  height: 950px;
}

.zoom-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9999;
}

.info {
  /* grid-column: 2 / 3; */
  position: absolute;
  right: 4px;
  width: 750px;
  overflow: auto;
  max-height: 950px;
  /* 设置最大高度，根据需要进行调整 */
}

.weather-container {
  /* position: absolute; */
  /* display: flex; */
  /* 将weather-container容器放在第二列 */
  width: 96%;
  height: 783px;
  top: 10px;
  left: 10px;
  z-index: 9999;
  background-color: #04131b9e;
  /* 设置背景颜色为浅蓝色 */
  border-radius: 10px;
  /* 设置圆角边框半径为10px */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.233);
  /* 设置阴影效果 */
  /* 添加其他样式 */
  color: #fff;
}

.weather-header {
  margin-left: 28px;
  margin-right: 28px;
}

.weather-details {
  grid-column: 1 / 2;
  /* 将details容器放在第一列 */
  margin-left: 28px;
}

.weather-details-container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  /* 将屏幕分为四份，第一列占据一个份额，第二列占据三个份额 */
}

.weather-dialog-box {
  width: 94%;
  height: 110px;
  margin-top: 10px;
  background-color: whitesmoke;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* 设置阴影效果 */
  padding: 10px;
  overflow: auto;
  max-height: 100px;
  /* 设置最大高度，超过该高度将显示滚动条 */
}

.dialog-content {
  white-space: pre-wrap;
  color: rgb(34, 33, 33);
  /* 处理换行符等空白字符 */
}

.wiki-search {
  width: 96%;
  height: 360px;
  margin-top: 20px;
  top: 10px;
  left: 10px;
  z-index: 9999;
  background-color: #04131b9e;
  /* 设置背景颜色为浅蓝色 */
  border-radius: 10px;
  /* 设置圆角边框半径为10px */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.233);
  /* 设置阴影效果 */
  /* 添加其他样式 */
  color: #fff;

}

.searchresult {
  max-height: 300px;
  /* 设置最大高度 */
  overflow: auto;
  /* 当内容超出高度时显示滚动条 */
  margin: 0px 20px 0px 20px;
}

.page-item {
  display: flex;
  margin-top: 10px;
}

.page-item img {
  width: 100px;
  height: 100px;
  margin-right: 10px;
}

.page-content {
  flex: 1;
}

.showAddress {
  background-color: #fff;
  position: absolute;
  top: 50px;
  left: 10px;
  z-index: 9999;
  /* height:100px; */
  /* width: 400px; */
}

.guide-container {
  width: 400px;
  height: 260px;
  margin-top: 20px;
  top: 550px;
  left: 10px;
  z-index: 9999;
  background-color: #04131b9e;
  /* 设置背景颜色为浅蓝色 */
  border-radius: 10px;
  /* 设置圆角边框半径为10px */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.233);
  /* 设置阴影效果 */
  /* 添加其他样式 */
  color: #fff;
}

.route-details {
  margin-left: 20px;
}

.brief-introduction {
  width: 96%;
  height: 283px;
  margin-top: 20px;
  top: 10px;
  left: 10px;
  z-index: 9999;
  background-color: #04131b9e;
  /* 设置背景颜色为浅蓝色 */
  border-radius: 10px;
  /* 设置圆角边框半径为10px */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.233);
  /* 设置阴影效果 */
  /* 添加其他样式 */
  color: #fff;
}

.briefintro-searchresult {
  max-height: 200px;
  /* 设置最大高度 */
  overflow: auto;
  /* 当内容超出高度时显示滚动条 */
  margin: 0px 20px 0px 20px;

}

.poem {
  margin-left: 23px;
  font-weight: bold;
  color: rgb(199, 229, 88);
}
</style>