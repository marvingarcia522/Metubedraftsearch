$(function() {

    let searchTerm = "webdevelopment";
    let videoList = $("#videoList");
    let apiKey = "AIzaSyCofRFTGcswzE9skiQsyHZx9bNGy0Y-Bk4";
    let player = $("#player");
    clearVideoList();
    search(searchTerm);

    $("#searchForm").on("submit", (e) => {
        e.preventDefault();
        searchTerm = $("#searchField").val();
        search(searchTerm);
    });

    function search(q) {

        $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/youtube/v3/search",
            data: {
                key: apiKey,
                q: q,
                part: "snippet",
                maxResults: 15,
                type: "video",
                videoEmbeddable: true,

            }
        }).done((data) => {
            let videos = data.items;
            clearVideoList();
            videos.forEach((el) => {
                //add channelTitle
                // add video id to li element
                videoList.append(`<li class="media mb-2" id="${el.id.videoId}">
                <img src="${el.snippet.thumbnails.medium.url}" class="mr-3">
                <div class="media-body">
                  <h5 class="mt-0 mb-1">${el.snippet.title}</h5>
                  <h6 class="my-1 text-info">${el.snippet.channelTitle}</h6>
                  <p class="mb-0">${el.snippet.description}</p>
                </div>
              </li>`);
            });

            //By default, the first video of the search result will be played
            //display the title, the description and the channel name
            let video = data.items[0];
            play(video.id.videoId, video.snippet.title,
                video.snippet.description, video.snippet.channelTitle);

        }).fail(function(data) {
            console.log(data);
        });
    }

    function clearVideoList() {
        videoList.find(".media").remove();
    }

    function play(id, title, description, channelTitle) {
        player.attr("src", `https://www.youtube.com/embed/${id}?enablejsapi=1`);
        $("#video-title").text(title);
        $("#video-description").text(description);
        $("#video-channelTitle").text(channelTitle);
    }

    //select the video
    videoList.on("click", "li", function() {
        let id = $(this).attr("id");
        findVideoById(id);
    });

    //find video by id
    function findVideoById(id) {
        $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/youtube/v3/videos",
            data: {
                key: apiKey,
                id: id,
                part: "snippet",

            }
        }).done((data) => {
            let video = data.items[0];
            let snippet = video.snippet;
            play(id, snippet.title, snippet.description, snippet.channelTitle)

        }).fail((data) => {
            console.log(data);
        });

    }

});