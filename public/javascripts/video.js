const limit = 12;
let page = 1;
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
search($('#searchMovie').val())

$('#searchMovie').keyup((e) => {
    page = 0
    console.log(e)
    search($('#searchMovie').val())
})

// $('#search_movie').on('submit', (e) => {
    // e.preventDefault()
    
// })

$('#form_button').click((e) => {
    e.preventDefault()
    search($('#searchMovie').val())
})

console.log(location.host)

function search(val) {
    // $('#return_search').empty()
    // let url = 'https://yts.am/api/v2/list_movies.json?sort_by=seeds&limit='+limit+'&query_term='+val;
    // page > 1 ? url += '&page=' + page : 0
    // $.get(url, (data) => {
    //     console.log(data)
    //     if (page <= 1)
    //         $('#movie_container').empty()
    //     if (data[0] === 'false' || data.data.movie_count === 0)
    //         document.getElementById('return_search').innerHTML = 'No results'
    //     else {
    //         // console.log(data[1])
    //         data.data.movies.forEach((movie) => {
    //             $('#movie_container').append('<div id=\'m_'+movie.id+'\' class=\'mov m-3 col-3 border border-dark\'><img class=\'m-3 horizontal-and-vertical-centering\' style=\'min-width:230px;height:300px;\'src=\''+movie.medium_cover_image+'\'></img><h3 class=\'text-center\' style=\'font-weight: bold;color:white;\'>'+movie.title+'</h3><h6 class=\'text-center\' style=\'color:#666;\'>('+movie.year+')</h6><h6 class=\'text-center\' style=\'color:rgb(255,215,0);opacity: 0.75;\'>'+movie.rating+'</h6></div>')
    //             $('#m_'+movie.id).click(() => {
    //                 window.location.replace('/movie_page?id='+movie.id)
    //             })
    //                         // new_mov.on('click',(e) => {
    //         })
    //         infiniteScroll(url)   
    //     }
    // })
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
    })
}



function infiniteScroll(url) {	
    // vérifie si c'est un iPhone, iPod ou iPad
    var deviceAgent = navigator.userAgent.toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
      
    // on déclence une fonction lorsque l'utilisateur utilise sa molette 
    $(window).scroll(function() {		
        
      // cette condition vaut true lorsque le visiteur atteint le bas de page
      // si c'est un iDevice, l'évènement est déclenché 150px avant le bas de page
      console.log('\nwin scroll Top : '+$(window).scrollTop())
      console.log('win height : '+$(window).height())
      console.log('document height : '+$(document).height())      
      if ($(document).height() - $(window).height() == $(window).scrollTop()) {
          console.log('TRIGGER SALE PUTEEEEE')
        // on effectue nos traitements
            page += 1
            search($('#searchMovie').val())
      }
    });	
  };
