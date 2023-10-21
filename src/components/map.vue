<template>
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
      @click="infoWindowToggle(index)"
    ></bm-marker>

    <bm-info-window
      v-for="(marker, index) in markers"
      :key="index"
      :show="marker.show"
      @close="infoWindowClose(index)"
      @open="infoWindowOpen(index)"
    >
      {{ marker.content }}
    </bm-info-window>
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
  },
  data() {
    return {
      center: { lat: 39.9, lng: 116.4 },
      zoom: 15,

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
          position: { lng: 121.4251, lat: 31.2135 },
          content: "陆家嘴",
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
    // infoWindowClose(index) {
    //   console.log(this.markers[index].show);
    //   console.log(index);
    //   console.log("infoWindowClose");
    //   this.markers[index].show = false;
    // },
    // infoWindowOpen(index) {
    //   console.log(this.markers[index].show);
    //   console.log(index);
    //   console.log("infoWindowOpen");
    //   this.markers[index].show = true;
    // },
    infoWindowToggle(index) {
      this.markers.forEach((marker, idx) => {
        if (idx === index) {
          marker.show = !marker.show; // 切换当前点击 Marker 的 show 值
        } else {
          marker.show = false; // 关闭其他 Marker 的信息窗口
        }
      });
    },
    infoWindowClose(index) {
      this.markers[index].show = false;
    },
    infoWindowOpen(index) {
      this.markers[index].show = true;
    },
  },
};
</script>

<style>
.map {
  width: 70%;
  height: 950px;
}
</style>
