# Spotify Playlist Cover Generator

## Summary
_A state-of-the-art playlist cover generator for Spotify playlists_

Takes a Spotify playlist ID as input, compiles album covers of all the tracks in the playlist, removes the background of all covers, puts edited album covers into a collage under an algorithm to prevent too much overlap.

Check this out:

<img src="https://i.imgur.com/qUdhDYb.png" width=45% height=45%> <img src="https://i.imgur.com/N6q0Bt8.png" width=44% height=44%>

## Intent
The Spotify app automatically creates a 4-frame playlist cover from the first 4 tracks of a playlist. 
I wanted to write a program that creates a playlist cover that gives a better sense of the playlist content _and_ looks good

## Technologies Used
#### APIs
[Spotify API](https://developer.spotify.com/)

[removeBG API](https://www.remove.bg/tools-api)

#### Languages
JavaScript, HTML, CSS

## Algorithm
1. Finding starting point
2. Checking for overlap
3. Appending/Resizing 
