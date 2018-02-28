// var myPlayer = videojs('my-video');
// myPlayer.on('play', () => {
//     console.log(myPlayer.currentTime());
//    })
// myPlayer.ready(function() {
    // myPlayer.currentTime(0)
    
    
    //   // set current time to 2 minutes into the video

//   // get the current time, should be 120 seconds
//   var whereYouAt = myPlayer.currentTime();
// });

// $.ajax({
//     type: 'GET',
//     url: '/video',
//     beforeSend: (req) => {
//         req.setRequestHeader('range', 'bytes=18943269-19943268')
//     }
// }).done((data) => {
//     console.log('done')
//     // myPlayer.src([{type: "video/webm", src: data}])
// });
let prev_id = 0;
$('#searchMovie').keyup((e) => {
    console.log('ef')
    search()
})

// $('#search_movie').on('submit', (e) => {
    // e.preventDefault()
    
// })

$('#form_button').click((e) => {
    e.preventDefault()
    search()
})

console.log(location.host)

function search() {
    $('#return_search').empty()
    $.post('/search_movie', {search:$('#searchMovie').val()}, (data) => {
    console.log(data)
    if (data[0] === 'false')
        document.getElementById('return_search').innerHTML = data[1].message
    else {
        $('#movie_container').empty()
        console.log(data[1])
        data[1].results.forEach((movie) => {
            if (movie.imdbid != prev_id && movie.poster !== 'N/A' && !movie.poster.match('\^http:\/\/ia.media-imdb.com')) { // We check if there is a poster and if it's not ia.media-imdb.com because of copyright issues 
                // $.get(movie.poster)
                // .done(function() {
                    console.log('DONE')
                    // Do something now you know the image exists.
                    prev_id = movie.imdbid
                        $('#movie_container').prepend('<div id=\'m_'+movie.imdbid+'\' class=\'mov m-3 col-3 border border-dark\'><img class=\'m-3 horizontal-and-vertical-centering\' style=\'min-width:230px;height:300px;\'src=\''+movie.poster+'\'></img><h3 class=\'text-center\' style=\'font-weight: bold;color:white;\'>'+movie.title+'</h3><h6 class=\'text-center\' style=\'color:#666;\'>('+movie.year+')</h6></div>')
                        $('#m_'+movie.imdbid).click(() => {
                            window.location.replace('/movie_page?imdbid='+movie.imdbid)
                        })
                        // new_mov.on('click',(e) => {
                            // window.location.replace('/movie_page?imdbid='+movie.imdbid)
                    // new_mov.show()
                    // })
                // }).fail(console.log)
            }
        })
        
    }
})}