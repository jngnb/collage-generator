const APIControl = (function() {

    const clientID = '';
    const clientSecret = '';

    const _getAuth = async() => {

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${btoa(clientID + ":" + clientSecret)}`);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var form = new URLSearchParams();
        form.append("grant_type", "client_credentials");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: form,
            redirect: 'follow'
        }

        const fetchToken = await fetch('https://accounts.spotify.com/api/token', requestOptions);
        const data = await fetchToken.json();
        return data.access_token;
    }

    const _getTracks = async (token, playlistID) => {

        const limit = 5;
    
        const fetchPlaylist = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=total,items.track.album.images`, {
            method: 'GET',
            headers: {'Authorization' : `Bearer ${token}`}
        });

        const data = await fetchPlaylist.json();
        return data.items;
    } 

    const _getAlbumCovers = (tracks) => {
        var covers = [];

        tracks.forEach(trackObj => {
            const cover = trackObj.track.album.images[1].url;
            let i = 0;
            for (; i < covers.length; ++i){
                if (covers[i] == cover){ break; }
            }
            if (i == covers.length) { covers.push(cover); }
        });

        localStorage.setItem("numCovers", covers.length);

        const backgroundIndex = Math.floor(Math.random()*Number(covers.length));
        localStorage.setItem("backgroundIndex", backgroundIndex);
        localStorage.setItem("backgroundURL", covers[backgroundIndex]);

        return covers;
    }

    const _transformCovers = async (covers) => {

        const numImages = Math.min(Number(localStorage.getItem("numImages")), Number(covers.length));

        const apiKey = "";

        for (let i = 0; i < numImages - 1; ++i){

            let randomIndex = Math.floor(Math.random()*Number(covers.length));;

            while (randomIndex == localStorage.getItem("backgroundIndex") || localStorage.getItem(randomIndex) != null){
                randomIndex = Math.floor(Math.random()*Number(covers.length));
            }

            const cover = covers[randomIndex];

            var form = new URLSearchParams();
            form.append("image_url", `${cover}`);

            const removeBG = await fetch(`https://api.remove.bg/v1.0/removebg`, {
                method: 'POST',
                headers: {
                    'accept' : 'application/json',
                    'X-Api-Key' : apiKey
                },
                body: form
            });

            if (removeBG.status >= 200 && removeBG.status <= 299) {
                const result = await removeBG.json();
                localStorage.setItem(`${randomIndex}`, `data:image/png;base64,${result.data.result_b64}`);
            }
            else{
                console.log(removeBG.status, removeBG.statusText);
            }

        }
    }

    return {
        getAuth() {
            return _getAuth();
        },
        getTracks(token, playlistID){
            return _getTracks(token, playlistID);
        },
        getAlbumCovers(tracks){
            return _getAlbumCovers(tracks);
        },
        transformCovers(covers){
            return _transformCovers(covers);
        }
    }

})();

const UIControl = (function() {
    return {
        getPlaylistID() {
            return {
                playlistID: document.querySelector("#playlist-id"),
                submit: document.querySelector("#submit-btn"),
                download: document.querySelector("#fa-save")
            }
        },
        storeToken(token){
            document.querySelector("#hidden-token").setAttribute("value", token)
        },
        putCover() {
            document.querySelector(".photo").setAttribute('src', coverURL);
        }
    }
    
})();

const AlgorithmControl = (function(UICtl, APICtl){

    const inputs = UICtl.getPlaylistID();

    const fetchData = async () => {

        //get token
        // const token = await APICtl.getAuth();

        // //store token
        // UICtl.storeToken(token);

        // //get tracks of playlist
        // const tracks = await APICtl.getTracks(token, inputs.playlistID.value);

        // //get original album covers
        // const covers = APICtl.getAlbumCovers(tracks);

        // //get edited album covers and save to local storage
        // await APICtl.transformCovers(covers);

        //make collage
        makeCollage();

    };

    //submit button event listener
    inputs.submit.addEventListener('click', async(e) => {
        //prevent page resetting
        e.preventDefault();

        //localStorage.clear();

        //store number of images
        var numImages = document.getElementById("num-imgs").value;
        localStorage.setItem("numImages", numImages);
        console.log(numImages);

        //begin processing
        fetchData();

    });

    // inputs.download.addEventListener('click', async(e) => {
    //     //prevent page resetting
    //     e.preventDefault();
    //     var a = document.getElementById("download");
    //     a.click();

    // });

    return {
        init(){
            console.log("Program starting");
        }
    }

})(UIControl, APIControl);


AlgorithmControl.init();