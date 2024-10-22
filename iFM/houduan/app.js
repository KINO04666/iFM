const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // 确保导入 path 模块

const app = express();
const PORT = 3000;
const SECRET_KEY = "secretkey"; // JWT密钥

app.use(cors());
app.use(bodyParser.json());

// 设置静态文件目录
app.use('/public', express.static(path.join(__dirname, 'public')));

// 创建MySQL连接池
const db = mysql.createPool({
    host: 'localhost',
    user: 'root', // 你的MySQL用户名
    password: 'yumengqi', // 你的MySQL密码
    database: 'fmApp'
});

// JWT验证中间件
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Authorization header 格式: 'Bearer <token>'
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401); // 未提供令牌，返回未授权

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // 令牌无效，返回禁止访问
        req.user = user; // 将解码后的用户信息附加到请求对象
        next(); // 继续处理请求
    });
};

// 注册接口
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // 检查用户是否已经存在
    const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(checkUserQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ msg: '服务器错误' });
        }

        if (results.length > 0) {
            return res.status(400).json({ msg: '用户已存在' });
        }

        try {
            // 加密密码
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 插入新用户到数据库
            const insertUserQuery = `INSERT INTO users (email, password) VALUES (?, ?)`;
            db.query(insertUserQuery, [email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ msg: '服务器错误' });
                }

                res.status(201).json({ msg: '用户注册成功' });
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            res.status(500).json({ msg: '服务器错误' });
        }
    });
});

// 登录接口
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // 查询用户是否存在
    const findUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(findUserQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).json({ msg: '服务器错误' });
        }

        if (results.length === 0) {
            return res.status(400).json({ msg: '无效的凭据' });
        }

        const user = results[0];

        try {
            // 检查密码是否匹配
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: '无效的凭据' });
            }

            // 创建JWT令牌
            const payload = {
                user: {
                    id: user.id
                }
            };

            // 返回JWT令牌和用户email（或其他你想返回的用户信息）
            jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error('Error signing token:', err);
                    return res.status(500).json({ msg: '服务器错误' });
                }
                // 返回 token 和 email
                res.json({
                    token, 
                    username: user.email // 假设没有 username 字段，用 email 代替
                });
            });
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).json({ msg: '服务器错误' });
        }
    });
});

// 获取文章的API端点
app.get('/articles', (req, res) => {
    const getArticlesQuery = `SELECT * FROM articles ORDER BY created_at DESC`;
    db.query(getArticlesQuery, (err, results) => {
        if (err) {
            console.error('Error fetching articles:', err);
            return res.status(500).json({ msg: '服务器错误' });
        }

        res.json(results);
    });
});

// 获取新闻的API端点
app.get('/news', (req, res) => {
    const getNewsQuery = `SELECT * FROM news ORDER BY created_at DESC`;
    db.query(getNewsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching news:', err);
            return res.status(500).json({ msg: '服务器错误' });
        }

        res.json(results);
    });
});

// 播放量增加API端点
app.post('/articles/:id/play', (req, res) => {
    const articleId = req.params.id;
    const updatePlayCountQuery = `UPDATE articles SET play_count = play_count + 1 WHERE id = ?`;
    
    db.query(updatePlayCountQuery, [articleId], (err, result) => {
        if (err) {
            console.error('Error updating play count:', err);
            return res.status(500).json({ msg: '服务器错误' });
        }
        
        res.json({ msg: '播放量增加成功' });
    });
});

// 点赞API端点
app.post('/articles/:id/like', authenticateToken, (req, res) => {
    const articleId = req.params.id;
    const userId = req.user.user.id; // 从JWT中获取用户ID

    // 检查用户是否已经点赞
    const checkLikeQuery = `SELECT * FROM likes WHERE article_id = ? AND user_id = ?`;
    db.query(checkLikeQuery, [articleId, userId], (err, results) => {
        if (err) {
            console.error('Error checking like:', err);
            return res.status(500).json({ msg: '服务器错误' });
        }

        if (results.length > 0) {
            return res.status(400).json({ msg: '您已经点赞过了' });
        }

        // 插入点赞记录
        const insertLikeQuery = `INSERT INTO likes (article_id, user_id) VALUES (?, ?)`;
        db.query(insertLikeQuery, [articleId, userId], (err, result) => {
            if (err) {
                console.error('Error inserting like:', err);
                return res.status(500).json({ msg: '服务器错误' });
            }

            // 更新文章的like_count
            const updateLikeCountQuery = `UPDATE articles SET like_count = like_count + 1 WHERE id = ?`;
            db.query(updateLikeCountQuery, [articleId], (err, result) => {
                if (err) {
                    console.error('Error updating like count:', err);
                    return res.status(500).json({ msg: '服务器错误' });
                }

                // 获取最新的like_count
                const getLikeCountQuery = `SELECT like_count FROM articles WHERE id = ?`;
                db.query(getLikeCountQuery, [articleId], (err, results) => {
                    if (err) {
                        console.error('Error fetching like count:', err);
                        return res.status(500).json({ msg: '服务器错误' });
                    }

                    const likeCount = results[0].like_count;
                    res.json({ msg: '点赞成功', like_count: likeCount });
                });
            });
        });
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在 http://localhost:${PORT} 运行`);
});
