# FM音乐播放器项目

## 项目简介

FM音乐播放器是一个基于Web的音乐播放平台，提供用户注册、登录、浏览音乐列表、播放音乐、点赞功能。该项目采用前后端分离架构，后端使用Node.js和Express框架，前端使用HTML、CSS和JavaScript（jQuery与Bootstrap）。通过JWT（JSON Web Tokens）实现用户认证，确保只有登录用户可以进行点赞操作，并记录每首歌曲的播放量和点赞量。

## 主要功能

1. **用户注册与登录**
   - 用户可以注册新账号并登录。
   - 使用JWT实现安全的用户认证。
   
2. **音乐列表展示**
   - 显示所有可播放的音乐列表，包括歌曲标题、作者、专辑封面等信息。
   
3. **音乐播放**
   - 用户可以点击播放按钮播放音乐。
   - 每次播放将增加对应歌曲的播放量。
   
4. **点赞功能**
   - 登录用户可以对喜欢的歌曲进行点赞。
   - 每个用户只能对每首歌曲点赞一次，防止重复点赞。
   - 点赞数会实时更新显示。

5. **响应式设计**
   - 适配不同设备屏幕尺寸，确保良好的用户体验。

## 技术栈

- **前端**
  - HTML5
  - CSS3 (Bootstrap 4)
  - JavaScript (jQuery)
  
- **后端**
  - Node.js
  - Express.js
  - MySQL (使用mysql2库连接)
  - JWT (jsonwebtoken库)
  - bcryptjs (密码加密)

## 项目结构

```
fmApp/
│
├── public/
│   ├── music/
│   │   ├── song1.mp3
│   │   ├── song2.mp3
│   │   └── song3.mp3
│   ├── img/
│   │   ├── logo.png
│   │   ├── player-background.jpg
│   │   ├── album1.jpg
│   │   ├── album2.jpg
│   │   └── default-album.jpg
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── player2.css
│   │   ├── main.css
│   │   ├── all.css
│   │   ├── player.css
│   └── js/
│       ├── jquery-2.1.0.js
│       ├── bootstrap.min.js
│       ├── script.js
│       ├── player.js
│       ├── player2.js
│       └── login.js
│
├── views/
│   ├── index.html
│   ├── player.html
│   └── news.html
│
├── server.js
├── package.json
└── package-lock.json
```

## 安装与配置

### 前提条件

- [Node.js](https://nodejs.org/) (v12.x 或更高)
- [MySQL](https://www.mysql.com/) 数据库

### 步骤 1：克隆仓库

```bash
git clone https://github.com/yourusername/fmApp.git
cd fmApp
```

### 步骤 2：安装依赖

```bash
npm install
```

### 步骤 3：配置数据库

1. **创建数据库和表**

   登录MySQL并执行以下SQL语句来创建数据库和必要的表：

   ```sql
   CREATE DATABASE fmApp;

   USE fmApp;

   -- 创建 users 表
   CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- 创建 articles 表
   CREATE TABLE IF NOT EXISTS articles (
       id INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       author VARCHAR(255) NOT NULL,
       audio_path VARCHAR(255) NOT NULL,
       album_art VARCHAR(255),
       play_count INT DEFAULT 0,
       like_count INT DEFAULT 0,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- 创建 likes 表
   CREATE TABLE IF NOT EXISTS likes (
       id INT AUTO_INCREMENT PRIMARY KEY,
       article_id INT NOT NULL,
       user_id INT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       UNIQUE KEY unique_like (article_id, user_id),
       FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );

   -- 创建 news 表（如果需要）
   CREATE TABLE IF NOT EXISTS news (
       id INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       content TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **插入示例数据**

   ```sql
   -- 插入示例用户
   INSERT INTO users (email, password) VALUES 
   ('user1@example.com', '$2a$10$hashedpassword1'),
   ('user2@example.com', '$2a$10$hashedpassword2');

   -- 插入示例文章/歌曲
   INSERT INTO articles (title, author, audio_path, album_art) VALUES 
   ('Song 1', 'Author 1', 'public/music/song1.mp3', 'public/img/album1.jpg'),
   ('Song 2', 'Author 2', 'public/music/song2.mp3', 'public/img/album2.jpg'),
   ('Song 3', 'Author 3', 'public/music/song3.mp3', 'public/img/default-album.jpg');
   ```

   > **注意**：密码需要使用 `bcryptjs` 进行加密。上述插入示例中的密码是加密后的密码，请确保实际插入时使用正确的加密方法。

### 步骤 4：配置后端

1. **编辑 `server.js`**

   确保 `server.js` 中的数据库连接配置正确：

   ```javascript
   const db = mysql.createPool({
       host: 'localhost',
       user: 'root', // 你的MySQL用户名
       password: 'yumengqi', // 你的MySQL密码
       database: 'fmApp'
   });
   ```

2. **启动后端服务器**

   ```bash
   node server.js
   ```

   如果一切正常，您应该会看到：

   ```
   服务器正在 http://localhost:3000 运行
   ```

### 步骤 5：配置前端

1. **打开 `index.html`**

   在浏览器中打开 `views/index.html`，确保主页面能够正确加载并显示音乐列表。

2. **确保静态资源路径正确**

   前端文件中的路径应正确指向 `public` 目录下的资源，例如CSS、JS和音频文件。

## 使用指南

### 用户注册与登录

1. **注册**
   - 打开主页面，点击“注册”链接切换到注册表单。
   - 输入有效的邮箱和密码，点击“注册”按钮。
   - 注册成功后，会提示您登录。

2. **登录**
   - 在主页面，点击“登录”链接切换到登录表单。
   - 输入已注册的邮箱和密码，点击“登录”按钮。
   - 登录成功后，JWT令牌和用户名将存储在 `localStorage` 中，登录表单和遮罩层将隐藏。

### 浏览与播放音乐

1. **浏览音乐列表**
   - 主页面显示所有可播放的音乐列表，包括标题、作者、专辑封面、播放量和点赞量。

2. **播放音乐**
   - 点击“播放”按钮会跳转到播放器页面，开始播放所选音乐。
   - 每次播放时，系统会发送请求增加该歌曲的播放量。

### 点赞音乐

1. **点赞**
   - 登录后，点击音乐列表中的“点赞”按钮。
   - 点赞成功后，点赞数会更新，并且用户无法对同一首歌曲重复点赞。

2. **取消点赞** (如果实现)
   - 如果添加了取消点赞功能，用户可以再次点击“点赞”按钮取消之前的点赞。

## API 文档

### 用户相关

#### 注册

- **URL**: `/register`
- **方法**: `POST`
- **请求体**:

  ```json
  {
      "email": "user@example.com",
      "password": "password123"
  }
  ```

- **响应**:
  - **成功**: `201 Created`

    ```json
    {
        "msg": "用户注册成功"
    }
    ```

  - **失败**: `400 Bad Request` 或 `500 Internal Server Error`

    ```json
    {
        "msg": "用户已存在"
    }
    ```

#### 登录

- **URL**: `/login`
- **方法**: `POST`
- **请求体**:

  ```json
  {
      "email": "user@example.com",
      "password": "password123"
  }
  ```

- **响应**:
  - **成功**: `200 OK`

    ```json
    {
        "token": "jwt_token_here",
        "username": "user@example.com"
    }
    ```

  - **失败**: `400 Bad Request` 或 `500 Internal Server Error`

    ```json
    {
        "msg": "无效的凭据"
    }
    ```

### 音乐相关

#### 获取音乐列表

- **URL**: `/articles`
- **方法**: `GET`
- **响应**:
  - **成功**: `200 OK`

    ```json
    [
        {
            "id": 1,
            "title": "Song 1",
            "author": "Author 1",
            "audio_path": "public/music/song1.mp3",
            "album_art": "public/img/album1.jpg",
            "play_count": 10,
            "like_count": 5,
            "created_at": "2024-04-27T12:34:56Z"
        },
        ...
    ]
    ```

  - **失败**: `500 Internal Server Error`

    ```json
    {
        "msg": "服务器错误"
    }
    ```

#### 增加播放量

- **URL**: `/articles/:id/play`
- **方法**: `POST`
- **URL 参数**:
  - `id`: 音乐/文章的ID

- **响应**:
  - **成功**: `200 OK`

    ```json
    {
        "msg": "播放量增加成功"
    }
    ```

  - **失败**: `500 Internal Server Error`

    ```json
    {
        "msg": "服务器错误"
    }
    ```

#### 点赞音乐

- **URL**: `/articles/:id/like`
- **方法**: `POST`
- **URL 参数**:
  - `id`: 音乐/文章的ID

- **头部**:
  - `Authorization`: `Bearer <JWT_TOKEN>`

- **响应**:
  - **成功**: `200 OK`

    ```json
    {
        "msg": "点赞成功",
        "like_count": 6
    }
    ```

  - **失败**:
    - **重复点赞**: `400 Bad Request`

      ```json
      {
          "msg": "您已经点赞过了"
      }
      ```

    - **未授权**: `401 Unauthorized` 或 `403 Forbidden`

      ```json
      {
          "msg": "未授权"
      }
      ```

    - **服务器错误**: `500 Internal Server Error`

      ```json
      {
          "msg": "服务器错误"
      }
      ```

### 新闻相关

#### 获取新闻列表

- **URL**: `/news`
- **方法**: `GET`
- **响应**:
  - **成功**: `200 OK`

    ```json
    [
        {
            "id": 1,
            "title": "News 1",
            "content": "Content of news 1...",
            "created_at": "2024-04-27T12:34:56Z"
        },
        ...
    ]
    ```

  - **失败**: `500 Internal Server Error`

    ```json
    {
        "msg": "服务器错误"
    }
    ```

## 前端文件说明

### 主页面 (`index.html`)

- **功能**:
  - 显示音乐列表。
  - 提供播放和点赞按钮。
  
- **相关脚本**: `script.js`

### 播放器页面 (`player.html`)

- **功能**:
  - 播放选中的音乐。
  - 显示音乐信息（标题、作者、专辑封面）。
  - 控制播放（播放/暂停、前一曲、下一曲）。
  - 显示播放进度和时间信息。

- **相关脚本**: 内嵌在HTML中的JavaScript

### 登录与注册 (`login.js`)

- **功能**:
  - 用户注册和登录。
  - 存储JWT令牌和用户名。
  - 切换登录和注册表单。

## 使用示例

### 注册用户

1. 打开主页面，点击“注册”链接。
2. 输入邮箱和密码，点击“注册”按钮。
3. 注册成功后，会提示您登录。

### 登录用户

1. 在主页面，点击“登录”链接。
2. 输入已注册的邮箱和密码，点击“登录”按钮。
3. 登录成功后，JWT令牌和用户名将存储在浏览器的 `localStorage` 中，登录表单和遮罩层将隐藏。

### 播放音乐

1. 在主页面中，点击某个音乐项的“播放”按钮。
2. 跳转到播放器页面，音乐开始播放。
3. 播放时，系统会自动增加该音乐的播放量。

### 点赞音乐

1. 在主页面中，点击某个音乐项的“点赞”按钮。
2. 如果成功，点赞数会增加并显示在按钮上。
3. 如果重复点赞，会提示“您已经点赞过了”。

## 常见问题

### 1. 无法连接到后端服务器

**解决方案**:
- 确保后端服务器已启动，并在正确的端口（默认 `3000`）运行。
- 检查前端请求的URL是否正确指向后端服务器。

### 2. 无法播放音乐

**解决方案**:
- 确保音频文件路径正确，并已上传到 `public/music/` 目录。
- 检查浏览器控制台是否有相关错误信息。

### 3. 点赞功能无效

**解决方案**:
- 确保已登录，并JWT令牌已正确存储在 `localStorage` 中。
- 检查后端 `/like` API是否正确处理请求。
- 查看浏览器开发者工具中的网络请求，确保请求已发送并收到正确响应。

## 贡献

欢迎任何形式的贡献！请按照以下步骤进行：

1. Fork 本仓库。
2. 创建您的特性分支 (`git checkout -b feature/YourFeature`)。
3. 提交您的更改 (`git commit -m 'Add some feature'`)。
4. 推送到分支 (`git push origin feature/YourFeature`)。
5. 提交 Pull Request。

## 许可证

该项目使用 [MIT 许可证](LICENSE)。

## 联系方式

如有任何问题或建议，请联系：

- **邮箱**: your.email@example.com
- **GitHub**: [yourusername](https://github.com/yourusername)

---

感谢您使用FM音乐播放器项目！希望它能为您带来良好的音乐体验。
