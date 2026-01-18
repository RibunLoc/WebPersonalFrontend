# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Bulk upload assets to DigitalOcean Spaces

Để đồng bộ các tệp ảnh/video sẵn có trong thư mục dự án lên DigitalOcean Spaces mà không cần phục vụ từ server riêng, bạn có thể dùng script CLI `upload-to-spaces`:

1. Thiết lập biến môi trường `SPACES_API_BASE` trỏ đến endpoint backend trả về presigned URL, ví dụ: `export SPACES_API_BASE="https://your-api.example.com/api"`.
2. Chạy lệnh:

   ```bash
   npm run upload:spaces -- [thu_muc_nguon] [tep_manifest]
   ```

   - `thu_muc_nguon` mặc định là `public`.
   - `tep_manifest` mặc định là `src/generated/spaces-manifest.json` (CLI sẽ tạo thư mục này nếu chưa tồn tại).

Script sẽ đệ quy quét thư mục, tạo presigned URL cho từng tệp hình ảnh/video, tải chúng lên Spaces, sau đó xuất manifest giúp bạn cập nhật lại đường dẫn trong ứng dụng.

### Cách React tự sử dụng file từ Spaces

Trong code, các thành phần dùng helper `resolveAssetUrl()` để ánh xạ đường dẫn gốc (ví dụ `/avatar.jpg`, `Project/bg-Octaltask.png`) sang URL công khai tương ứng trong DigitalOcean Spaces. Sau khi script sinh `src/generated/spaces-manifest.json`, chỉ cần rebuild lại ứng dụng, toàn bộ ảnh/video sẽ tự động lấy từ Spaces mà không phải phục vụ trực tiếp qua server của bạn.
