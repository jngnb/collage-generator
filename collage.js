
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const numImages = Math.min(Number(localStorage.getItem("numImages")), Number(localStorage.getItem("numCovers")));

const canvasSide = canvas.width;
const canvasSize = canvasSide*canvasSide;

//scaling the average image
const scaledImgSize = (canvasSize/(numImages-1));

//array of already-appended image objects
const appendedImgs = [];

var makeCollage = function() {
    appendBackground();

    setTimeout(() => {
        displayCompletedCover();
    }, 3000);
}

//make collage
function appendBackground() {
    //set background first
    var img = new Image();
    img.src = localStorage.getItem("backgroundURL");
    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = function() {
        console.log(img.width);
        console.log(img.height);
        ctx.drawImage(img, 0, 0, canvasSide, canvasSide);

        //for all covers not used as the background
        var keys = Object.keys(localStorage);
        for (i in keys){
            //if key is a number-string
            if (!isNaN(keys[i])){
                appendImage(keys[i]);
            }
        }
    }

}

const currImg = {
    ImgWidth: -1, 
    ImgHeight: -1,
    leftmost: -1, rightmost: -1, 
    bottommost: -1, topmost: -1
};

//dx dy = starting point at top left
//appending each image to canvas
function appendImage (key) {

    var img = new Image();
    img.src = localStorage.getItem(key);
    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = function() {

        //scaling algorithm
        //scale from 0.8 ~ 2
        let scaleFactor = Math.random() * 1 + 0.8;
        let currDx = Math.random() * canvasSide - (0.25*canvasSide);
        let currDy = Math.random() * canvasSide - (0.25*canvasSide);
        computeSizes(scaleFactor, currDx, currDy);

        currDx = preventEdgeCutOff(currDx);
        currDy = preventEdgeCutOff(currDy);
        computeSizes(scaleFactor, currDx, currDy);

        for (let i = 0; i <= 20 - appendedImgs.length; ++i){

            // if 10-numImages centers were tried with the same scale factor
            // and none passed, reduce image size by 25%
            if (i == (20 - numImages)){
                scaleFactor *= 0.75;
                i = 0;
            }

            /* if randomly computed leftmost/rightmost points and 
                                    bottommost/topmost points are 
            overlapping more than 25% of appended image's right/left edge
            OR overlapping more than 25% of appended image's top/bottom edge,
            try another center */
            let j = 0;
            for (; j < appendedImgs.length; ++j) {

                const tempImg = appendedImgs[j];

                const Dx = tempImg.dx;
                const Dy = tempImg.dy;
                const Width = tempImg.width;
                const Height = tempImg.height;

                //if there is too much overlap
                if (((currImg.leftmost < (Dx+(Width*0.5))) && (currImg.rightmost > (Dx+(Width*0.5))))
                || ((currImg.topmost < (Dy+(Height*0.5))) && (currImg.bottommost > (Dy+(Height*0.5))))) 
                {
                    break;
                }
            }

            // if current image does not result in too much overlap with 
            // the entirety of appended images, break
            if (j == appendedImgs.length){
                break;
            }

            //else compute a new center and corresponding sizes
            currDx = Math.random() * canvasSide - (0.25*canvasSide);
            currDy = Math.random() * canvasSide - (0.25*canvasSide);

            computeSizes(scaleFactor, currDx, currDy);

            //compute until 50% image is not cut off from edge of canvas
            currDx = preventEdgeCutOff(currDx);
            currDy = preventEdgeCutOff(currDy);

            computeSizes(scaleFactor, currDx, currDy);
            
        }

        //add to appendedImgs array after successfully appending
        appendedImgs.push({dx: currDx, dy: currDy, width: currImg.ImgWidth, height: currImg.ImgHeight});

        //draw image in corresponding spot
        ctx.drawImage(img, currDx, currDy, currImg.ImgHeight, currImg.ImgWidth);
    }

}

function displayCompletedCover(){

    var canvas = document.getElementById("canvas");
    var completedURL = canvas.toDataURL("image/jpeg");
    var completedImg = document.getElementById("completed-img");
    var downloadA = document.getElementById("download");

    completedImg.setAttribute("src", completedURL); 
    downloadA.setAttribute("href", completedURL);

    //display complete jpeg image
    completedImg.style.display = "block";

    //display icon
    document.querySelector(".fa-save").style.display="block";

}


function computeSizes(scaleFactor, currDx, currDy) {

    const ImgWidth = scaleFactor*(Math.sqrt(scaledImgSize));
    const ImgHeight = scaleFactor*(Math.sqrt(scaledImgSize));

    currImg.ImgWidth = ImgWidth;
    currImg.ImgHeight = ImgHeight;

    currImg.leftmost = currDx;
    currImg.rightmost = currDx + ImgWidth;
    currImg.bottommost = currDy + ImgHeight;
    currImg.topmost = currDy;

}

function preventEdgeCutOff(currPoint){
    while (true){
        if (((currPoint < 0) && (Math.abs(currPoint) < currImg.ImgHeight*0.5)) ||
            ((currPoint > 0) && (canvasSide-currPoint > currImg.ImgHeight*0.5))){
            return currPoint;
        }
        currPoint = Math.random() * canvasSide;
    }

}