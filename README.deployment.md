<!-- @format -->

# Deployment Guide

## Environment Variables for Netlify

Để deploy lên Netlify, bạn cần thiết lập environment variables trong Netlify dashboard:

### Required Environment Variables:

1. **VITE_API_URL_SERVER**
   - Description: URL của backend API server
   - Example: `https://your-api-server.herokuapp.com`
   - **Quan trọng**: Không bao gồm dấu `/` ở cuối

### Cách thiết lập trên Netlify:

1. Vào Netlify dashboard
2. Chọn site của bạn
3. Vào **Site settings** > **Environment variables**
4. Click **Add a variable**
5. Thêm:
   - **Key**: `VITE_API_URL_SERVER`
   - **Value**: URL backend API của bạn (ví dụ: `https://your-api-server.com`)

### Files đã được tạo để fix lỗi:

- `netlify.toml` - Cấu hình Netlify chính
- `public/_headers` - Force MIME type cho JS files
- `src/config/env.ts` - Quản lý environment variables
- `src/component/ApiStatus.tsx` - Hiển thị trạng thái API connection

### Lưu ý:

- Nếu không có backend API, app vẫn sẽ hoạt động nhưng sẽ hiển thị warning
- Màn hình trắng trước đây do thiếu environment variables
- Bây giờ app có error handling tốt hơn

## Deploy Steps:

1. Set environment variables trên Netlify
2. Push code lên Git
3. Netlify sẽ tự động build và deploy
4. Check console browser để đảm bảo không có error
