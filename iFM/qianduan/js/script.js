$(window).load(function(){
	var sug=$('.suggest-item');
	for(var i=0;i<sug.length;i++){
		sug[i].onclick=function(e){
			$('#seac').val(e.target.innerHTML);
		};
	}
	$('#closeLog').click(function(){
		$('.zhezhaoceng').css("display","none")
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
	var ply=document.getElementById('audio_player');
		ply.src=data;
		ply.play();
	$('#song_name').text("歌曲名:"+data);
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
                var listItem = `
                    <li>
                        <div class="list_item_top">
                            <div class="item_pic">
                                <a href="#">
                                    <img src="img/recommond1.jpg" alt="${article.title}" />
                                    <span>${article.author}</span>
                                </a>
                                <a id="icon-play" name="${article.audio_path}" onclick="playMusic(this.name);" href="javascript:void(0)"><i class="glyphicon glyphicon-expand"></i></a>
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
