<template>
  <div class="map">
    <baidu-map class="map" :center="{ lng: 116.404, lat: 39.915 }" :zoom="15">
    </baidu-map>
  </div>
  <div>你好！</div>
</template>

<script>
/* eslint-disable */
import { BaiduMap } from "vue-baidu-map-3x";
import { ref, onMounted } from "vue";

export default {
  components: {
    BaiduMap,
  },
};

const center = ref({ lng: 0, lat: 0 });
const zoom = ref(3);

const handler = ({ BMap, map }) => {
  console.log(BMap, map);
  center.value.lng = 116.404;
  center.value.lat = 39.915;
  zoom.value = 15;
};
</script>

<style>
.map {
  width: 100%;
  height: 300px;
}
</style>
