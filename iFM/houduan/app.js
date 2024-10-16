const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;
const SECRET_KEY = "secretkey"; // JWT密钥

app.use(cors());
app.use(bodyParser.json());

// 创建MySQL连接池
const db = mysql.createPool({
    host: 'localhost',
    user: 'root', // 你的MySQL用户名
    password: 'yumengqi', // 你的MySQL密码
    database: 'fmApp'
});

// 注册接口
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // 检查用户是否已经存在
    const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(checkUserQuery, [email], async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            return res.status(400).json({ msg: '用户已存在' });
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 插入新用户到数据库
        const insertUserQuery = `INSERT INTO users (email, password) VALUES (?, ?)`;
        db.query(insertUserQuery, [email, hashedPassword], (err, result) => {
            if (err) throw err;

            res.status(201).json({ msg: '用户注册成功' });
        });
    });
});

// 登录接口
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // 查询用户是否存在
    const findUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(findUserQuery, [email], async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(400).json({ msg: '无效的凭据' });
        }

        const user = results[0];

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
            if (err) throw err;
            // 返回 token 和 email
            res.json({
                token, 
                username: user.email // 假设没有 username 字段，用 email 代替
            });
        });
    });
});

// 新增：获取文章的API端点
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

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在 http://localhost:${PORT} 运行`);
});
