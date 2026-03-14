// import axios, { AxiosHeaders } from "axios";
// import { Readability } from "@mozilla/readability";
// import { JSDOM } from "jsdom";
// import * as cheerio from "cheerio";
// import YouTubeVideoId from 'youtube-video-id';
// import { fetchTranscript } from 'youtube-transcript';



// const url = "https://en.wikipedia.org/wiki/Blog";
// const url = "https://www.theblogstarter.com/";
// const response = await axios.get(url, {
//   headers: {
//     "User-Agent": "Mozilla/5.0",
//   },
// });

// // console.log(response.data); // got html here
// //extract the html

// const dom = new JSDOM(response.data, { url });
// const reader = new Readability(dom.window.document);
// const article = reader.parse();

// // console.log(article.textContent)

// // const cleantext = removeHtmlTags(article.excerpt)
// console.log(article.excerpt)


// function removeHtmlTags(text) {
//   const $ = cheerio.load(text);
//   return $('p').text().trim();
// }

// console.log(cleantext)



// import YouTubeVideoId from 'youtube-video-id';
// // import {YoutubeTranscriptApi} from 'youtube-transcript-api';

// const videoId = YouTubeVideoId('https://www.youtube.com/watch?v=31qyMKNB2RA');

// const transcript = await YoutubeTranscriptApi.getTranscript(videoId);
// const text = transcript.map((chunk) => chunk.text).join(" ");

// import { YoutubeTranscript } from "youtube-transcript";

// async function getTranscript() {
//   const transcript = await YoutubeTranscript.fetchTranscript(
//     "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
//   );

//   console.log(transcript);
// }

// getTranscript();


// import { fetchTranscript } from 'youtube-transcript-plus';

// Replace 'VIDEO_ID_OR_URL' with the actual YouTube video ID or full URL
//  fetchTranscript(videoId , {
//   lang: "en" | 'hi'
// })
//   .then(transcript => {
//     // The transcript is an array of segments, which you can process
//     const fullText = transcript.map(segment => segment.text).join(' ');
//     return fullText
//   })
//   .catch(error => {
//     console.error('Error fetching transcript:', error.message);
//   });


//   console.log(transcript)


// import { fetchTranscript } from "youtube-transcript";

// async function getTranscript() {
//   const videoId = "jNQXAC9IVRw"; 

//   try {
//     const transcript = await fetchTranscript(videoId, {
//       lang: "en"
//     });

//     // console.log(transcript)
//     const fullText = [];

//     fullText
//     // const fullText = transcript.map(segment => segment.text).join(" ");

//     // console.log(fullText);
//   } catch (error) {
//     console.error("Error fetching transcript:", error.message);
//   }
// }

// getTranscript();