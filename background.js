console.log("new")

let minTime = 0;

setInterval(()=>{
    minTime+=1
},60000)

headersReceivedListener = (requestDetails) => {
    if (typeof browser === "undefined"){       
        if(requestDetails.initiator?.includes("http")){
       let origin = requestDetails.initiator.split("/")[2]
       const responseHeadersContentLength = requestDetails.responseHeaders.find(element => element.name.toLowerCase() === "content-length");
       const contentLength = undefined === responseHeadersContentLength ? {value: 0}
        : responseHeadersContentLength;
       const requestSize = parseInt(contentLength.value, 10);
       chrome.runtime.sendMessage({
        data: {
        origin:origin,
        byteLength:requestSize,
        minTime :minTime
        }
        }
    );
    }
}
}
chrome.webRequest.onHeadersReceived.addListener(
    headersReceivedListener,
    {urls: ['<all_urls>']},
    ['responseHeaders'])
