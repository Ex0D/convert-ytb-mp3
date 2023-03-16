**THIS README IS INCOMPLETE RIGHT NOW (there are things missing to say)**

# Youtube link to MP3 file converter

A (bad) converter taking a Youtube link and turning it into .mp3 without the use of external google api

## TODO
- [ ] Remux .weba file into .mp3 (with FFMPEG ?)
- [ ] Better error handling
- [ ] Better comments
- [ ] CLI option

## How to use it ?
1. Copy this repo 
```shell
git clone https://github.com/Ex0D/convert-ytb-mp3.git
```
2. Installation with pnpm (you can use npm as well but it's better with pnpm) 
```shell
pnpm install
```

3. Execution (You can use PM2 for hosting, or just use node)
```shell
node server.js
```

4. Go to you'r [localhost](http://localhost:3000) page and type the Youtube URL you want to download.

5. Wait ~ 5 seconds

6. Done ! 
Check your audio folder !

## How does it work ? 

### Text explanation
Well, in itself it is not very complicated but let's go:

First of all, you have to know that to "receive" the video/audio stream, Youtube uses a kind of player that is virtualized from a "blob" protocol, so it is rather complicated to get this stream through this blob (see impossible)

However, to "inject" the audio and video data stream, Youtube uses requests as the video is playing.

So let's try to trace these requests in the "Network" tab in the Devtool (F12 of course)

It's normal to get lost or just lose time looking at each query one by one, so I found the queries corresponding to the video/audio stream that google servers import.

![videoplayback_requests](https://cdn.discordapp.com/attachments/1085579051839787119/1085579067887210676/image.png)

All the queries framed in red are the ones we are interested in, especially the one with the response header "audio/webm".

Yes, because Youtube cuts audio and video into 2 distinct types of requests 

![video_response](https://cdn.discordapp.com/attachments/1085579051839787119/1085581238041055272/image.png)
![audio_response](https://cdn.discordapp.com/attachments/1085579051839787119/1085581147720917122/image.png)

Now how do we proceed? We just have to filter through this response header and download the file?

Not really, if you try to access the URL (the request url) you will quickly realize the problem: the audio / video is fragmented into several pieces of files (basically we have only a few seconds of audio / video).

Well NO, after a few minutes of searching, the file is right in front of you, intact, but something is "blocking" your browser from being able to play the file entirely.

And for that you have to look at the URL more closely: https://rr1---sn-5hne6ns6.googlevideo.com/videoplayback?expire=1678914640&...&range=629778949-631076654

Yes, you see it too: in the URL there is a "section" named "range" with several numbers delimited by a "-".

Ok, what if we try to edit the range of the audio / video ? (example : "range=0-9999999999999").

In short, YouTube does not load the entire video/audio file directly (which is logical) and therefore uses this "range" parameter to regulate traffic (the video/audio synchronization is totally managed by the youtube player) 
Let's go ! We have the whole file! Just have to download it !

Here is how to download the audio from a youtube link.

### Packages :
- [Express](http://expressjs.com/) - Web framework that allow me to render view & make my stuff (fastify is better, but for some reason, i use express (5.0 inc ? 👀))
- [puppeteer](https://pptr.dev/) - Puppeteer is a Node.js library which provides a high-level API to control Chrome/Chromium over the DevTools Protocol. (Fighting fire with fire)
- [ejs](https://ejs.co/) - Embedded JavaScript templating (Contrary to Jade or pug, EJS does not touch too much the HTML structure and I find that very nice, in spite of the frontend)
- [body-parser](https://www.npmjs.com/package/body-parser) - Parse incoming request bodies in a middleware before your handlers, available under the `req.body` property (Unfortunately, it is mandatory to use it)
- [express-session](https://www.npmjs.com/package/express-session/v/1.15.6) - (wtf ? see bellow)
- [connect-flash](https://www.npmjs.com/package/connect-flash) - The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered. (that's why express-session is required)

<!-- ## So why it's bad ?
...

## Some Warning 
...

## A little diagram of how the program works
```mermaid
stateDiagram-v2
``` -->

## Conclusion
As long as Youtube (or even another platform offering videos/images/sounds on the Internet) offers their content in a public way (i.e. without protection by login or other), there will always be a way to automate the thing, they can always change their structures, their API, the way they design their products, EVERYTHING is available no matter what and there will inevitably be people like me who will say "go automate this or that".

Unless the internet protocols change, you are in fact more powerful than a simple user on a browser, the browser is a gigantic debugger, it remains to know how to use it well.

On these beautiful philosophical words, have a good day if you go through this repo, whether you are from google, amazon or any other

o/  
