import { page } from "../server.js";

/**
 * @description Filter all request in 4500 ms and get one URL that been generated
 * by youtube, then increase the query "range" of this url then return it
 * @param {String} url The youtube link
 */
export default async (url) => 
{
    // Match youtube link (20 characters max, can be changed with 0 issue)
    if (!url.match(/https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z]{1,20}/))
    {
        throw new Error("The URL is not a valid Youtube link");
    }

    let paused = false;
    let pausedRequest = [];
    let result = "";

    const nextRequest = () =>
    {
        if (pausedRequest.length === 0)
        {
            paused = false;
        }
        else
        {
            (pausedRequest.shift())();
        }
    }

    // Like network tab in Chrome but headless
    await page.setRequestInterception(true);

    // Listener for all caught requests (not finished)
    page.on('request', (request) =>
    {
        if (paused)
        {
            pausedRequest.push(() => request.continue());
        }
        else
        {
            paused = true;
            request.continue();
        }
    });

    // Listener for all finished requests
    page.on('requestfinished', (request) =>
    {
        /**
         * First of all, check if the url has "googlevideo.com/videoplayback"
         * because it's where the audio is stocked.
         * A filter to response headers is here too because Youtube split the audio and the video (has the same URL but not the same header)
         */ 
        if (request.url().includes('googlevideo.com/videoplayback') &&
        findKey(request.response().headers(), (p) => p === "audio/webm"))
        {
            result = request.url();
        }
        else
        {
            nextRequest();
        }
    });

    /**
    *  Go to youtube URL
    * ! WARNING MAKE AN EDIT : node_modules/.pnpm/puppeteer-core@19.7.4/node_modules/puppeteer-core/lib/esm/puppeteer/common/LifecycleWatcher.js:170:12
    * ! CHANGE return new TimeoutError(errorMessage) to return console.error(errorMessage)
    * ! Even if we add the property waitUntil: "networkIdle0" or "networkIdle2", that throwing an error and stop the server
    * ! It's because youtube is constantly loading requests (due to video fragments, trackers, audio ect...) so you have to put a timer
    * ! I found this issue : https://github.com/puppeteer/puppeteer/issues/3238 but no PR has been allowed Sadge
    */
    await page.goto(url, { timeout: 5000 })
    .catch(e => { console.error(e) });

    // (need better explication on getting range)
    result = result.replace(/range=[0]-[0-9]{1,10}/, 'range=0-9999999999999');

    await page.close();
    return result;
}

const findKey = (obj, p) =>
{
    let result;

    if (obj == null)
    {
        return result
    }

    Object.keys(obj).some((key) =>
    {
        const value = obj[key]
        if (p(value, key, obj))
        {
            result = key;
            return true;
        }
    })

    return result;
}