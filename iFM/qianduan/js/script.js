$(window).load(function(){
    var sug = $('.suggest-item');
    for(var i = 0; i < sug.length; i++){
        sug[i].onclick = function(e){
            $('#seac').val(e.target.innerHTML);
        };
    }
    $('#closeLog').click(function(){
        $('.zhezhaoceng').css("display","none");
    });
});

function suggest_list_toggle(){
    $('#ul-suggest-list').slideToggle().css({"border":"solid 1px lightblue"});
}

function upload_list_toggle(){
    $('#upload_list').toggle();
}

function playMusic(data){
    alert(data);
    var ply = document.getElementById('audio_player');
    ply.src = data;
    ply.play();
    $('#song_name').text("歌曲名:" + data);
}

function showLogBig(){
    $('.zhezhaoceng').css({"display":"block"});
}

$(document).ready(function() {
    // 获取文章数据
    $.ajax({
        url: 'http://localhost:3000/articles', // 根据您的后端地址调整
        method: 'GET',
        success: function(data) {
            // data 应该是一个文章数组
            var articleList = $('#article-list');
            articleList.empty(); // 清空现有内容

            data.forEach(function(article) {
                // URL编码音频路径和标题
                var encodedAudioPath = encodeURIComponent(article.audio_path);
                var encodedTitle = encodeURIComponent(article.title);
                var encodedAuthor = encodeURIComponent(article.author);
                var encodedAlbumArt = encodeURIComponent(article.album_art || 'img/default-album.jpg'); // 动态专辑封面

                var listItem = `
                    <li>
                        <div class="list_item_top">
                            <div class="item_pic">
                                <a href="#">
                                    <img src="${article.album_art || 'img/default-album.jpg'}" alt="${article.title}" onerror="this.onerror=null;this.src='img/default-album.jpg';" />
                                    <span>${article.author}</span>
                                </a>
                                <a class="icon-play" href="player.html?audio=${encodedAudioPath}&title=${encodedTitle}&author=${encodedAuthor}&album=${encodedAlbumArt}&article_id=${article.id}">
                                    <i class="glyphicon glyphicon-expand"></i>
                                </a>
                            </div>
                            <a class="title" href="#">${article.title}</a>
                            <a class="user-name" href="#">by：${article.author}</a>
                        </div>
                        <p class="count-info">
                            <span><a href="#"><i class="glyphicon glyphicon-play"></i> ${article.play_count || 0}</a></span>
                            <span><a href="#"><i class="glyphicon glyphicon-heart"></i> ${article.like_count || 0}</a></span>
                            <span><a href="#"><i class="glyphicon glyphicon-comment"></i> ${article.comment_count || 0}</a></span>
                        </p>
                    </li>
                `;
                articleList.append(listItem);
            });
        },
        error: function(err) {
            console.error('获取文章失败:', err);
        }
    });
});

$(document).ready(function() {
    // 获取文章数据
    $.ajax({
        url: 'http://localhost:3000/articles', // 根据您的后端地址调整
        method: 'GET',
        success: function(data) {
            // data 应该是一个文章数组
            var articleList = $('#article-list');
            articleList.empty(); // 清空现有内容

            data.forEach(function(article) {
                // URL编码音频路径和标题
                var encodedAudioPath = encodeURIComponent(article.audio_path);
                var encodedTitle = encodeURIComponent(article.title);
                var encodedAuthor = encodeURIComponent(article.author);
                var encodedAlbumArt = encodeURIComponent(article.album_art || 'img/default-album.jpg'); // 动态专辑封面

                var listItem = `
                    <li>
                        <div class="list_item_top">
                            <div class="item_pic">
                                <a href="#">
                                    <img src="${article.album_art || 'img/default-album.jpg'}" alt="${article.title}" onerror="this.onerror=null;this.src='img/default-album.jpg';" />
                                    <span>${article.author}</span>
                                </a>
                                <a class="icon-play" href="player.html?audio=${encodedAudioPath}&title=${encodedTitle}&author=${encodedAuthor}&album=${encodedAlbumArt}&article_id=${article.id}">
                                    <i class="glyphicon glyphicon-expand"></i>
                                </a>
                            </div>
                            <a class="title" href="#">${article.title}</a>
                            <a class="user-name" href="#">by：${article.author}</a>
                        </div>
                        <p class="count-info">
                            <span><a href="#"><i class="glyphicon glyphicon-play"></i> ${article.play_count || 0}</a></span>
                            <span><a href="#"><i class="glyphicon glyphicon-heart"></i> ${article.like_count || 0}</a></span>
                            <span><a href="#"><i class="glyphicon glyphicon-comment"></i> ${article.comment_count || 0}</a></span>
                        </p>
                    </li>
                `;
                articleList.append(listItem);
            });
        },
        error: function(err) {
            console.error('获取文章失败:', err);
        }
    });

    // 获取新闻数据
    $.ajax({
        url: 'http://localhost:3000/news', // 根据您的后端地址调整
        method: 'GET',
        success: function(data) {
            // data 应该是一个新闻数组
            var newsList = $('#news-list');
            newsList.empty(); // 清空现有内容

            data.forEach(function(news, index) {
                var listItem = `
                    <li>
                        <span>${index + 1}</span>
                        <a href="news.html?id=${news.id}">${news.title}</a>
                    </li>
                `;
                newsList.append(listItem);
            });
        },
        error: function(err) {
            console.error('获取新闻失败:', err);
        }
    });
});

$(document).ready(function() {
    // 获取JWT令牌（假设存储在localStorage中）
    const token = localStorage.getItem('token');

    // 获取文章数据
    $.ajax({
        url: 'http://localhost:3000/articles', // 根据您的后端地址调整
        method: 'GET',
        success: function(data) {
            // data 应该是一个文章数组
            var articleList = $('#article-list');
            articleList.empty(); // 清空现有内容

            data.forEach(function(article, index) {
                // URL编码音频路径和标题
                var encodedAudioPath = encodeURIComponent(article.audio_path);
                var encodedTitle = encodeURIComponent(article.title);
                var encodedAuthor = encodeURIComponent(article.author);
                var encodedAlbumArt = encodeURIComponent(article.album_art || '/img/default-album.jpg'); // 动态专辑封面

                var listItem = `
                    <li>
                        <div class="list_item_top">
                            <div class="item_pic">
                                <a href="#">
                                    <img src="${article.album_art || 'img/default-album.jpg'}" alt="${article.title}" onerror="this.onerror=null;this.src='img/default-album.jpg';" />
                                    <span>${article.author}</span>
                                </a>
                                <a class="icon-play" href="player.html?audio=${encodedAudioPath}&title=${encodedTitle}&author=${encodedAuthor}&album=${encodedAlbumArt}&article_id=${article.id}">
                                    <i class="glyphicon glyphicon-expand"></i>
                                </a>
                            </div>
                            <a class="title" href="#">${article.title}</a>
                            <a class="user-name" href="#">by：${article.author}</a>
                        </div>
                        <p class="count-info">
                            <span><a href="#"><i class="glyphicon glyphicon-play"></i> ${article.play_count || 0}</a></span>
                            <span>
                                <a href="#" class="like-button" data-article-id="${article.id}">
                                    <i class="glyphicon glyphicon-heart"></i> ${article.like_count || 0}
                                </a>
                            </span>
                            <!-- 评论功能已移除 -->
                        </p>
                    </li>
                `;
                articleList.append(listItem);
            });

            // 绑定点赞按钮点击事件
            $('.like-button').click(function(e) {
                e.preventDefault();
                const articleId = $(this).data('article-id');
                const likeBtn = $(this);
                const currentLikeCount = parseInt(likeBtn.text());

                if (!token) {
                    alert('请先登录才能点赞');
                    return;
                }

                $.ajax({
                    url: `http://localhost:3000/articles/${articleId}/like`,
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function(data) {
                        alert(data.msg);
                        likeBtn.html(`<i class="glyphicon glyphicon-heart"></i> ${data.like_count}`);
                    },
                    error: function(err) {
                        if (err.responseJSON && err.responseJSON.msg) {
                            alert(err.responseJSON.msg);
                        } else {
                            console.error('点赞失败:', err);
                            alert('点赞失败');
                        }
                    }
                });
            });
        },
        error: function(err) {
            console.error('获取文章失败:', err);
        }
    });

    // 获取新闻数据
    $.ajax({
        url: 'http://localhost:3000/news', // 根据您的后端地址调整
        method: 'GET',
        success: function(data) {
            // data 应该是一个新闻数组
            var newsList = $('#news-list');
            newsList.empty(); // 清空现有内容

            data.forEach(function(news, index) {
                var listItem = `
                    <li>
                        <span>${index + 1}</span>
                        <a href="news.html?id=${news.id}">${news.title}</a>
                    </li>
                `;
                newsList.append(listItem);
            });
        },
        error: function(err) {
            console.error('获取新闻失败:', err);
        }
    });
});
