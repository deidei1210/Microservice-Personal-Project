const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  configureWebpack: {
    resolve: {
      alias: {
        'echarts$': 'echarts/dist/echarts.js'
      }
    }
  }
})
