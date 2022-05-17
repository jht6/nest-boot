FROM node:12
ADD dist.tar.gz /app
WORKDIR /app
RUN npm install --registry=https://registry.npmmirror.com
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
CMD ["npm", "run", "start:prod"]
