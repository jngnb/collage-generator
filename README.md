# Spotify Playlist Cover Generator

## Summary
_A state-of-the-art playlist cover generator for Spotify playlists_

Takes a Spotify playlist ID as input, compiles album covers of all the tracks in the playlist, removes the background of all covers, puts edited album covers into a collage under an algorithm to prevent too much overlap.

Check this out:

<img src="https://i.imgur.com/qUdhDYb.png" width=45% height=45%> <img src="https://i.imgur.com/N6q0Bt8.png" width=44% height=44%>

## Usage
1. Clone this repository
`git clone https://github.com/jngnb/collage-generator.git`
2. Obtain Spotify clientID and clientSecret via [Spotify for Developers](https://developer.spotify.com/) and input into `const clientID = '[here]';`
`const clientSecret = '[here]';`
3. Obtain removeBG api key and input into `const apiKey = "[here]";`
4. Open in localhost brower and run!

## Intent
The Spotify app automatically creates a 4-frame playlist cover from the first 4 tracks of a playlist. 
I wanted to write a program that creates a playlist cover that gives a better sense of the playlist content _and_ looks good

## Algorithm
#### 1. Initial Scaling
- Divide canvas surface area with user inputted number of album covers `numImages` to include in the final output to find average surface area available per edited album cover
- Randomly compute a scale factor ranging from 0.8 to 1.8 
#### 2. Finding starting point
- Randomly compute x and y offset, offsetting the range by 25% of canvas to prevent images completely cutting off 
    - Bigger images continue often cut off too much so added function `preventEdgeCutOff()` that recomputes x and y offsets until at least 50% of width and height are included on canvas
     <img src="https://i.imgur.com/DBtQQaT.jpg" width=40% height=40%>
- Compute 4 edge positions of each image with `computeSizes()` with computed offsets and scale factor
#### 3. Checking for overlap
- Given the 4 endpoints computed, 
    - Iterate through array of edge positions of already-appended images `appendedImgs` and for each already-appended. perform checks with computed image
        1. If _left_ edge of image is overlapping with over 50% of the _right_ edge of the already-appended image
        2. If _right_ edge of image is overlapping with over 50% of the _left_ edge of the already-appended image
        3. If _bottom_ edge of image is overlapping with over 50% of the _top_ edge of the already-appended image
        4. If _top_ edge of image is overlapping with over 50% of the _bottom_ edge of the already-appended image
    If any checks return true before the iteration reaches the final already-appended image in the array, there is too much overlap
    - Run through `20 - numImages` offsets before downsizing the image by 75%
#### 4. Appending/Resizing 
- If there is too much overlap, try `20 - size(appendedImgs)` offsets (more images appended canvas, less room, hence less offsets tried) 
- If any offset succeeds, append the image to canvas and add edge information to `appendedImgs`
- If no offset succeeds, downsize image by 75% and repeat process until checks succeed

## Testing Results/Sample Collages
**9 album covers included**
**Same set of album covers used**
<img src="https://i.imgur.com/3niYmj6.jpg" width=45% height=45%> <img src="https://i.imgur.com/uSonQkw.jpg" width=45% height=45%>
<img src="https://i.imgur.com/s7tEoC6.jpg" width=45% height=45%> <img src="https://i.imgur.com/dpb2clH.jpg" width=45% height=45%>

## Technologies Used
#### APIs
[Spotify API](https://developer.spotify.com/)
[removeBG API](https://www.remove.bg/tools-api)
#### Languages
JavaScript, HTML, CSS