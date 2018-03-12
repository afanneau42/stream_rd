$(document).ready(() => {
    var myPlayer = videojs('my-video');
    myPlayer.on('play', () => {
        console.log(myPlayer.currentTime());
    })
    myPlayer.ready(function() {
        myPlayer.currentTime(0)
    var whereYouAt = myPlayer.currentTime();
    });




    var url_string = window.location.href
    var url = new URL(url_string);
    var param = url.searchParams.get("id");
    $.get('https://yts.am/api/v2/movie_details.json?movie_id='+param, (data) => {
        console.log(data)
        console.log(data.data.movie.torrents[0].url)
        $('body').attr('style','background-image:url("'+data.data.movie.background_image+'");background-size: cover;background-repeat:no-repeat;')
        data.data.movie.title ? document.getElementById('title').innerHTML = data.data.movie.title : 0
        data.data.movie.rating ? document.getElementById('rate-1').innerHTML = data.data.movie.rating : 0
        // data.ratings[0] ? document.getElementById('rate-name-1').innerHTML = data.ratings[0].Source : 0
        // data.ratings[1] ? document.getElementById('rate-2').innerHTML = data.ratings[1].Value : 0
        // data.ratings[1] ? document.getElementById('rate-name-2').innerHTML = data.ratings[1].Source : 0
        // data.ratings[2] ? document.getElementById('rate-3').innerHTML = data.ratings[2].Value : 0
        // data.ratings[2] ? document.getElementById('rate-name-3').innerHTML = data.ratings[2].Source : 0
        data.data.movie.description_full ? document.getElementById('plot').innerHTML = data.data.movie.description_full : 0
        // data.director ? document.getElementById('director').innerHTML = 'Director: ' + data.director : 0
        data.data.movie.genres[0] ? document.getElementById('genres').innerHTML = 'Genres: ' + data.data.movie.genres[0] : 0
        data.data.movie.year ? document.getElementById('year').innerHTML = 'Released:  ' + data.data.movie.year : 0
        data.data.movie.runtime ? document.getElementById('runtime').innerHTML = 'Duration: ' + data.data.movie.runtime : 0
        data.data.movie.medium_cover_image ? $('#poster').attr("src", data.data.movie.medium_cover_image) : 0
        // data.data.movie.background_image_original ? myPlayer.src(data.data.movie.background_image_original) : 0;
        // $.ajax({
        //     type: 'GET',
        //     url: '/video_dl?hash='+ data.data.movie.torrents[0].hash,
        //     // beforeSend: (req) => {
        //         // req.setRequestHeader('range', 'bytes=18943269-19943268')
        //     // }
        // }).done((data) => {
        //     console.log('done')
        //     // myPlayer.src([{type: "video/mp4", src: data}])
        // });
        myPlayer.src([{type: "video/mp4", src: '/torrent?hash='+data.data.movie.torrents[0].hash}])
        // myPlayer.src([{type: "video/ogg", src: 'localhost:7777/video?hash='+data.data.movie.torrents[0].hash}])
        // myPlayer.src([{type: "video/webmv", src: 'localhost:7777/video?hash='+data.data.movie.torrents[0].hash}])
        
    })
})