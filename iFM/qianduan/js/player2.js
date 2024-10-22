document.addEventListener('DOMContentLoaded', function() {
    // 获取URL中的参数
    const urlParams = new URLSearchParams(window.location.search);
    const audioPath = urlParams.get('audio');
    const title = urlParams.get('title');
    const author = urlParams.get('author') || '未知作者';
    const albumArt = urlParams.get('album') || 'img/default-album.jpg';
    const articleId = urlParams.get('article_id'); // 确保URL中传递了 article_id 参数

    if(audioPath) {
        document.getElementById('audio-player').src = audioPath;
    }

    if(title) {
        document.getElementById('song-title').textContent = title;
    }

    if(author) {
        document.getElementById('song-author').textContent = `by: ${author}`;
    }

    if(albumArt) {
        document.getElementById('album-art').src = albumArt;
    }

    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.getElementById('play-button');
    const progressBar = document.getElementById('progress-bar');
    const progressFilled = document.getElementById('progress-filled');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');

    // 播放/暂停功能
    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playButton.innerHTML = '<i class="glyphicon glyphicon-pause"></i>';
        } else {
            audioPlayer.pause();
            playButton.innerHTML = '<i class="glyphicon glyphicon-play"></i>';
        }
    }

    playButton.addEventListener('click', togglePlay);

    // 播放事件监听器，增加播放量
    audioPlayer.addEventListener('play', function() {
        if (articleId) {
            fetch(`http://localhost:3000/articles/${articleId}/play`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg);
                // 可选：更新播放量显示
                // document.getElementById('play-count').textContent = data.play_count;
            })
            .catch(err => {
                console.error('播放量增加失败:', err);
            });
        }
    });

    // 更新进度条
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    });

    function updateProgress() {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFilled.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }

    // 设置进度
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;

        audioPlayer.currentTime = (clickX / width) * duration;
    }

    progressBar.addEventListener('click', setProgress);

    // 格式化时间
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 返回按钮功能
    window.goBack = function() {
        window.history.back();
    }

    // 前后曲目功能（需要后端支持或前端预定义曲目列表）
    window.prevTrack = function() {
        // TODO: 实现上一曲功能
        alert('上一曲功能尚未实现');
    }

    window.nextTrack = function() {
        // TODO: 实现下一曲功能
        alert('下一曲功能尚未实现');
    }

    // 自动播放下一个曲目（示例）
    audioPlayer.addEventListener('ended', function() {
        // TODO: 实现自动播放下一曲
        alert('曲目结束，自动播放下一曲功能尚未实现');
    });
});
