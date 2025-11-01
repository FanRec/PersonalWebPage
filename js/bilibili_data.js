// const b_follower = document.getElementById("b-follower");
// const b_follower_change = document.getElementById("b-follower-change");
// // function getBilibiliData() {
// //   fetch("https://api.bilibili.com/x/relation/stat?vmid=401470526", {
// //     headers: {
// //       "User-Agent":
// //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
// //       Referer: "https://www.bilibili.com/",
// //     },
// //   })
// //     .then((response) => response.json())
// //     .then((data) => {
// //       b_follower.textContent = data.data.follower;
// //     })
// //     .catch((error) => (b_follower.textContent = "--"));
// // }
// window.handleBilibiliData = function (data) {
//   try {
//     if (data.code === 0 && data.data && data.data.follower != undefined) {
//       b_follower.textContent = data.data.follower;
//     } else {
//       b_follower.textContent = "数据异常";
//     }
//   } catch (error) {
//     b_follower.textContent = "--";
//   } finally {
//     const script = document.getElementById("bilibili-jsonp-script");
//     if (script) {
//       script.remove();
//     }
//   }
// };
// function getBilibiliDataByJSONP() {
//   const callbackName = "handleBilibiliData_" + Date.now();

//   window[callbackName] = function (data) {
//     window.handleBilibiliData(data);
//     delete window[callbackName];
//   };
//   const script = document.createElement("script");
//   script.id = "bilibili-jsonp-script";
//   script.src = `https://api.bilibili.com/x/relation/stat?vmid=401470526&callback=${callbackName}`;
//   //超时处理
//   const timeout = setTimeout(() => {
//     b_follower.textContent = "--";
//     script.remove();
//     delete window[callbackName];
//   }, 5000);

//   script.onload = () => clearTimeout(timeout);
//   document.body.appendChild(script);
// }
