#!/bin/bash

# 手动构建docker，直接执行本shell即可

# 确认仓库地址
repo="xx"

echo "构建代码并打包"
npm run build
# 打包，含隐藏文件
tar \
--exclude="node_modules" \
--exclude=".git" \
-czvf dist.tar.gz * .[!.]*


echo "制作docker镜像"
tag=`date '+%Y%m%d_%H%M%S'`
echo "TAG=${tag}"
docker build --platform "linux/amd64" -t $repo:$tag .
docker push $repo:$tag

rm dist.tar.gz