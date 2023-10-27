## Configuration and Deployment Description

### 前端部署

1. **准备环境**：
   - 安装 Node.js,npm,和Nginx。

2. **获取项目源代码**：
   - 您可以从项目的代码仓库克隆前端源代码。使用以下命令：
      ```
      git clone https://github.com/deidei1210/Microservice-Personal-Project
      ```
      获得项目的代码
3. **安装前端依赖项**：
   - 安装前端依赖项：
      ```
      npm install
      ```

4. **构建前端应用**：
   - 使用以下命令构建前端应用：
      ```
      npm run build
      ```
   - 这将生成一个 `dist` 目录，包含已构建好的前端应用。

5. **dist文件复制**：
   - 将前端构建后的文件（位于 `dist` 目录中）部署到 Nginx 服务器中。配置 Nginx 以将前端请求代理到后端。
6. **Nginx部署**
   - 进入nginx.exe所在目录中的conf文件夹
   - 编辑nginx.conf文件
   - 将server配置成以下样式
      ```
      server {
            listen       9999;
            server_name  120.26.0.232;//服务器的ip地址，此时暂时选择本机的公网地址

            location / {
                  root   html/dist; //增加一条dist子路径
                  index  index.html index.htm;
            }

            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                  root   html;
            }
         }
      ```
7. **上线使用**
   在nginx.exe所在目录下运行
   `./nginx`
   此时可以访问以下网址获取项目前端界面
   > http://120.26.0.232:9999/
    
8. **启动服务**
   重启nginx服务
   ```
   sudo service nginx restart
   ```
### 完成部署

通过完成上述步骤，前端 Vue3 项目将成功部署
可以通过访问http://120.26.0.232:9999/ 来查看我的项目（不过由于因为chatGPT的API有使用次数限制，所以可能使用出行智能小助手的时候会因为key到了使用次数的原因无法使用）


---