document.addEventListener('DOMContentLoaded', function () {
    const formTitle = document.getElementById('formTitle');
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    const submitButton = document.querySelector('input[type="submit"]');
    const formFooter = document.getElementById('formFooter');
    const toggleFormLink = document.getElementById('formFooter');
    const zhezhaoceng = document.querySelector('.zhezhaoceng'); // 遮罩层
    // 检查是否找到切换表单的链接
    if (!toggleFormLink) {
        console.error('切换表单的链接没有找到');
        return;
    }

    // 是否为登录模式
    let isLogin = true;

    // 切换表单内容
    toggleFormLink.addEventListener('click', function () {
        console.log('表单切换触发');
        if (isLogin) {
            // 切换为注册表单
            formTitle.textContent = '注册';
            authEmail.placeholder = '请输入邮箱';
            authPassword.placeholder = '请输入密码';
            submitButton.value = '注册';
            formFooter.innerHTML = '已有账号？<a id="toggleForm" href="javascript:void(0)">登录！</a>';
        } else {
            // 切换为登录表单
            formTitle.textContent = '登录';
            authEmail.placeholder = '邮箱或手机号';
            authPassword.placeholder = '密码';
            submitButton.value = '登录';
            formFooter.innerHTML = '没有账号？<a id="toggleForm" href="javascript:void(0)">注册！</a>';
        }
        isLogin = !isLogin;
    });

    // 提交表单时的处理
    authForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = authEmail.value;
        const password = authPassword.value;

        if (isLogin) {
            // 登录表单提交逻辑
            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    alert('登录成功！');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username); // 保存用户名
                    // 隐藏登录表单和遮罩层
                    zhezhaoceng.style.display = 'none';
                } else {
                    alert('登录失败：' + data.msg);
                }
            })
            .catch((error) => {
                console.error('登录请求失败:', error);
            });
        } else {
            // 注册表单提交逻辑
            fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.msg === '用户注册成功') {
                    alert('注册成功，请登录！');
                    formTitle.textContent = '登录';
                    authEmail.placeholder = '邮箱或手机号';
                    authPassword.placeholder = '密码';
                    submitButton.value = '登录';
                    formFooter.innerHTML = '没有账号？<a id="toggleForm" href="javascript:void(0)">注册！</a>';
                    isLogin = true;
                } else {
                    alert('注册失败：' + data.msg);
                }
            })
            .catch((error) => {
                console.error('注册请求失败:', error);
            });
        }
    });
});
