<template>
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
        @click="infoWindowOpen(index)"
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
  BmLabel
} from "vue-baidu-map-3x";
import { ref, onMounted } from "vue";
export default {
  components: {
    BaiduMap,
    BmWalking,
    BmInfoWindow,
    BmBoundary,
    BmScale,
    BmMarker,
    BmLabel
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
          position: { lng: 121.4830, lat: 31.2342},
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
          position: { lng: 121.4449, lat: 31.2110 },
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
          position: { lng: 121.4900, lat: 31.2711 },
          content: "甜爱路",
          show: false,
        },
        {
          position: { lng: 121.4880, lat: 31.2696 },
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
    };
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
  },
};
</script>

<style>
.map {
  
  width: 70%;
  height: 950px;
}
.zoom-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9999;
}
</style>
