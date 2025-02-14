# Sử dụng Node.js phiên bản mới nhất làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Biến môi trường để chạy dev mode
ENV NODE_ENV=development
ENV PORT=3000

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng Next.js ở chế độ development
CMD ["npm", "run", "dev"]
