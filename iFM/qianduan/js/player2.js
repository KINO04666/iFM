document.addEventListener('DOMContentLoaded', function() {
    // 获取URL中的参数
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('article_id')); // 当前播放歌曲的ID

    // 元素引用
    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.getElementById('play-button');
    const progressBar = document.getElementById('progress-bar');
    const progressFilled = document.getElementById('progress-filled');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const albumArtElement = document.getElementById('album-art');
    const songTitle = document.getElementById('song-title');
    const songAuthor = document.getElementById('song-author');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    // 播放列表和当前索引
    let playlist = [];
    let currentIndex = -1;
    let isManualNext = false; // 标记是否为手动点击“下一曲”

    // 获取音乐列表
    function fetchPlaylist() {
        fetch('http://localhost:3000/articles')
            .then(response => response.json())
            .then(data => {
                playlist = data;
                console.log('播放列表:', playlist); // 调试信息

                // 找到当前播放的歌曲索引
                currentIndex = playlist.findIndex(song => song.id === articleId);
                console.log('当前索引:', currentIndex); // 调试信息

                if (currentIndex === -1 && playlist.length > 0) {
                    currentIndex = 0;
                    console.log('未找到当前歌曲，默认播放第一首。');
                }

                loadSong(currentIndex);
            })
            .catch(err => {
                console.error('获取音乐列表失败:', err);
                alert('无法加载播放列表，请稍后重试。');
            });
    }

    // 加载歌曲
    function loadSong(index) {
        if (index < 0 || index >= playlist.length) {
            console.warn('歌曲索引超出范围');
            return;
        }
        const song = playlist[index];
        console.log(`加载歌曲: ${song.title} (ID: ${song.id})`); // 调试信息

        audioPlayer.src = song.audio_path;
        songTitle.textContent = song.title;
        songAuthor.textContent = `by: ${song.author}`;
        albumArtElement.src = song.album_art || 'img/default-album.jpg';

        // 自动播放新歌曲
        audioPlayer.play().then(() => {
            playButton.innerHTML = '<i class="glyphicon glyphicon-pause"></i>';
        }).catch(err => {
            console.error('自动播放失败:', err);
            playButton.innerHTML = '<i class="glyphicon glyphicon-play"></i>'; // 如果自动播放失败，显示播放图标
        });
    }

    // 播放/暂停功能
    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play().then(() => {
                playButton.innerHTML = '<i class="glyphicon glyphicon-pause"></i>';
            }).catch(err => {
                console.error('播放失败:', err);
            });
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
                // 如果需要在播放器页面显示播放量，可以在此处更新相关元素
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
        if (audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFilled.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
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

    // 前一曲功能
    window.prevTrack = function() {
        if (currentIndex > 0) {
            currentIndex--;
            loadSong(currentIndex);
        } else {
            alert('已经是第一首歌曲');
        }
    }

    // 后一曲功能
    window.nextTrack = function() {
        if (currentIndex < playlist.length - 1) {
            currentIndex++;
            loadSong(currentIndex);
        } else {
            alert('已经是最后一首歌曲');
        }
    }

    // 自动播放下一个曲目
    audioPlayer.addEventListener('ended', function() {
        if (currentIndex < playlist.length - 1) {
            currentIndex++;
            loadSong(currentIndex);
        } else {
            alert('已经到达播放列表末尾');
            // 或者选择循环播放
            // currentIndex = 0;
            // loadSong(currentIndex);
        }
    });

    // 按钮事件绑定
    prevButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.prevTrack();
    });
    nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.nextTrack();
    });

    // 初始化播放列表
    fetchPlaylist();
});
