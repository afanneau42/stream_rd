$(document).ready(() => {
    var url_string = window.location.href
    var url = new URL(url_string);
    var param = url.searchParams.get("imdbid");
    $.post('/movie_info', {imdbid:param}, (data) => {
        console.log(data)
        data.title ? document.getElementById('title').innerHTML = data.title : 0
        data.ratings[0] ? document.getElementById('rate-1').innerHTML = data.ratings[0].Value : 0
        data.ratings[0] ? document.getElementById('rate-name-1').innerHTML = data.ratings[0].Source : 0
        data.ratings[1] ? document.getElementById('rate-2').innerHTML = data.ratings[1].Value : 0
        data.ratings[1] ? document.getElementById('rate-name-2').innerHTML = data.ratings[1].Source : 0
        data.ratings[2] ? document.getElementById('rate-3').innerHTML = data.ratings[2].Value : 0
        data.ratings[2] ? document.getElementById('rate-name-3').innerHTML = data.ratings[2].Source : 0
        data.plot ? document.getElementById('plot').innerHTML = data.plot : 0
        data.director ? document.getElementById('director').innerHTML = 'Director: ' + data.director : 0
        data.genres ? document.getElementById('genres').innerHTML = 'Genres: ' + data.genres : 0
        data.year ? document.getElementById('year').innerHTML = 'Released:  ' + data.year : 0
        data.runtime ? document.getElementById('runtime').innerHTML = 'Duration: ' + data.runtime : 0
        data.poster ? $('#poster').attr("src", data.poster) : 0
        data.poster ? $('#ny-video').attr("poster", data.poster) : 0
    })
})