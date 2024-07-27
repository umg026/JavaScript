// @ts-nocheck
let startTime = Date.now();
let timeSpent = 0;

function sendTimeSpent(startTime) {
  let endTime = Date.now();
  let timeSpent = endTime - startTime; // Time spent in milliseconds
  return timeSpent;
}

function getCookie(name) {
  let cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");

    // Removing whitespace at the beginning of the cookie name and compare it with the given name
    if (name == cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
}

// function querydata(url,filter,expand) {

//   if(!filter&&!expand){
//   return   fetch(`${url}`).then(d=>d.json()).then(d=>{
//       console.log(d);
//       return d;
//     }).catch(e=>console.log("error while fetching data:",e));

//   }else if(filter&&!expand){
//     let queryString = `1 = 1 && ${filter} `;
// return    fetch(`${url}?filter=(${encodeURIComponent(queryString)})`).then(d=>d.json()).then(d=>{
//       console.log(d);
//       return d;
//     }).catch(e=>console.log("error while fetching data:",e));
//   }else if(expand&&!filter){
//     return fetch(`${url}?expand=(${expand})`).then(d=>d.json()).then(d=>{
//       console.log(d);
//       return d;
//     }).catch(e=>console.log("error while fetching data:",e));

//   }

// }

function sendData(data, response, myCookie) {
  $.ajax({
    // url: `http://192.168.1.116:8090/visitor/api/route/${response.ip}`,
    url: `https://cms.3m3.in/visitor/api/route/${response.ip}`,
    type: "POST",
    async: true,
    data: data,
    success: {
      msg: `ip: ${response.ip}`,
    },
  })
    .then((d) => {
      console.log(JSON.stringify(d));
      if (!myCookie || myCookie != d.visitorRecord.id) {
        document.cookie = `id=${d.visitorRecord.id}`;
        console.log(document.cookie);
      }
    })
    .catch((e) => {
      console.log("error:", e);
      if (e.responseJSON.error.value.Ip === "Value must be unique") {
      }
    });
  return null;
}

function handleCategoryEventClick(event) {
  const categoryId = event.currentTarget.id;
  console.log(`category clicked: ${categoryId}`);
  console.log(`category clicked: ${event.currentTarget}`);

  // Example of sending data to the server
  // fetch("http://192.168.1.116:8090/api/collections/visitor_events/records", {
    fetch("https://cms.3m3.in/api/collections/visitor_events/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: "category_click",
      visitor_id: getCookie("id"),
      event_data: {
        categoryId,
        url: window.location.host,
        // path: window.location.pathname
      },
    }),
  }).catch((e) => console.log("error category handle:", e));
}

function handleHomeEventClick(event) {
  console.log(`home clicked: ${event}`);

  // Example of sending data to the server
  // fetch("http://192.168.1.116:8090/api/collections/visitor_events/records", {
    fetch("https://cms.3m3.in/api/collections/visitor_events/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: "home_click",
      visitor_id: getCookie("id"),
      event_data: {
        clicked_url: event.currentTarget,
        // path: window.location.pathname
      },
    }),
  }).catch((e) => console.log("error home handle:", e));
}

function handleStoryClick(event) {
  const storyId = event.currentTarget.id;
  const currentTarget = event.currentTarget;
  console.log(`Story clicked: ${storyId}`);
  console.log(`Story clicked: ${currentTarget}`);

  // console.log("slug:", slug);
  // Example of sending data to the server
  // fetch("http://192.168.1.116:8090/api/collections/visitor_events/records", {
    fetch("https://cms.3m3.in/api/collections/visitor_events/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: "story_click",
      story_id: storyId,
      visitor_id: getCookie("id"),
      event_data: {
        url: currentTarget,
        domain: window.location.host,
        // slug: currentTarget.replace("/posts/", ""),
      },
    }),
  }).catch((e) => console.log("error story handle:", e));
}

$(document).ready(() => {
  // Use "https://ipinfo.io" link to use the
  // ipinfo for getting the ip address
  console.log(startTime);
  console.log(Math.floor((startTime % (1000 * 60)) / 1000));
  $.getJSON(
    "https://ipinfo.io",
    function (response) {
      //- console.log("IP Address:",response.ip)
      //- console.log("response:",response)
      //- console.log("referrer:",document.referrer)
      //- console.log("location.href:",location.href)

      let navg = navigator.userAgent;
      console.log("navigator.userAgent:", navg);
      // Example usage:
      let myCookie = getCookie("id");
      document.querySelectorAll(".story").forEach((story) => {
        story.addEventListener("click", handleStoryClick);
      });
      document.querySelectorAll(".categoryEvent").forEach((category) => {
        category.addEventListener("click", handleCategoryEventClick);
      });
      document
        .getElementById("homeEvent")
        .addEventListener("click", handleHomeEventClick);
      //  console.log("myCookie:",myCookie);

      //- navigator.geolocation.getCurrentPosition(function(position){
      //-     console.log("position:",position)
      //- })

      // let data1 = {
      //   response,
      //   user_agent: navg,
      // };
      // let queryString = `1 = 1 && domain="${window.location.protocol+'//'+window.location.host}" && status='Active'`;
      // fetch(`http://192.168.1.116:8090/api/collections/domain/records?filter=(${encodeURIComponent(queryString)})`).then(d=>d.json())

      let queryString = `1 = 1 && domain="${window.location.origin}" `;

      if (getCookie("id")) {
        fetch(
          // `http://192.168.1.116:8090/api/collections/visitors/records/${getCookie(
            `https://cms.3m3.in/api/collections/visitors/records/${getCookie(
            "id"
          )}`
        )
          .then((d) => d.json())
          .then((d) => {
            // console.log("d:",d);
            // console.log("d:",Object.keys(d).length);
            if (d.code == 404 || Object.keys(d).length < 1) {
              console.log("didn't get id:", d);
              fetch(
                // `http://192.168.1.116:8090/api/collections/domain/records?filter=(${encodeURIComponent(
                  `https://cms.3m3.in/api/collections/domain/records?filter=(${encodeURIComponent(
                  queryString
                )})`
              )
                .then((d) => d.json())
                .then((d) => {
                  // console.log(JSON.stringify(d));
                  console.log(d);
                  // console.log("resp:",d);
                  // console.log("resp:",d.items[0].id);
                  if (d.items[0].id) {
                    let data = {
                      domain_id: d.items[0].id,
                      response,
                      user_agent: navg,
                      pageInfo: window.location.origin,
                      pagePath: window.location.pathname,
                      domain_status: d.items[0].status,
                    };
                    sendData(data, response, getCookie("id"));
                    // console.log("document.cookie:", document.cookie);
                  } else {
                    console.log("Something went wrong while fetching data!");
                  }
                })
                .catch((e) => {
                  console.log("error:", e);
                  // sendData(data, myCookie, response);
                });
            }
          })
          .catch((e) => console.log(e));
      } else if (!getCookie("id")) {
        fetch(
          // `http://192.168.1.116:8090/api/collections/domain/records?filter=(${encodeURIComponent(
            `https://cms.3m3.in/api/collections/domain/records?filter=(${encodeURIComponent(
            queryString
          )})`
        )
          .then((d) => d.json())
          .then((d) => {
            // console.log(JSON.stringify(d));
            // console.log(d);
            console.log("resp:",d);
            // console.log("resp:",d.items[0].id);
            if(d.items.length>0)
             {
              let data = {
                domain_id: d.items[0].id,
                response,
                user_agent: navg,
                pageInfo: window.location.origin,
                pagePath: window.location.pathname,
                domain_status: d.items[0].status,
              };
              sendData(data, response);
              // console.log("document.cookie:", document.cookie);
            } else {
              console.log("Something went wrong while fetching data!");
              let data = {
                response,
                user_agent: navg,
                pageInfo: window.location.origin,
                pagePath: window.location.pathname,
              };
              sendData(data, response);

            }
          })
          .catch((e) => {
            console.log("error:", e);
            // sendData(data, myCookie, response);
          });
      }
    },
    "jsonp"
  );
});

window.addEventListener("beforeunload", (event) => {
  // event.preventDefault();
  let slug;
  let category;
  if(window.location.pathname.includes('/posts/')){
    slug= window.location.pathname.replace(`/posts/`,'')
    console.log("slug:",slug);
  }else{
    category = window.location.href.replace(window.location.origin+'/','')
    console.log("category:",category);
  }
  // else if(event.currentTarget.location.href.includes()){
  // }
  console.log("slug:",event.currentTarget.location.href);
  
  timeSpent = sendTimeSpent(startTime);
  timeSpent = Math.floor((timeSpent % (1000 * 60)) / 1000);
  console.log("timeSpent:", timeSpent);
  let data = {
    visitor_id: getCookie("id"),
    event_type: "timeSpent",
    event_data: {
      timeSpent: Number(timeSpent),
      url: window.location.href,
      domain: window.location.host,
      slug,
      category
    },
  };
  if (!data.visitor_id) {
    return;
  }
  $.ajax({
    headers: {
      // Accept: "*/*",
      "Content-Type": "application/json",
    },
    url: `https://cms.3m3.in/api/collections/visitor_events/records`,
    // url: `http://192.168.1.116:8090/api/collections/visitor_events/records`,
    type: "POST",
    async: true,
    data: JSON.stringify(data),
    success: {
      msg: `Inserted data successfully!`,
    },
  })
    .then((d) => {
      console.log(sendTimeSpent(startTime));
      console.log(JSON.stringify(d));
    })
    .catch((e) => console.log(e));

  // return (event.returnValue = "");
});

const adE1 = document.getElementById("adhtml1");
const adE2 = document.getElementById("adhtml2");
if (adE1 && adE2) {
  adE1.addEventListener("click", () => {
    // console.log(adE1.querySelector('a').href)
    let data = {
      visitor_id: getCookie("id"),
      event_type: "AdClick",
      event_data: {
        ad: adE1.querySelector("a").href,
        url: window.location.href,
      },
    };

    $.ajax({
      headers: {
        // Accept: "*/*",
        "Content-Type": "application/json",
      },
      // url: `http://192.168.1.116:8090/api/collections/visitor_events/records`,
      url: `https://cms.3m3.in/api/collections/visitor_events/records`,
      type: "POST",
      async: true,
      data: JSON.stringify(data),
      success: {
        msg: `Inserted data successfully!`,
      },
    })
      .then((d) => {
        console.log(JSON.stringify(d));
      })
      .catch((e) => console.log(e));
  });

  adE2.addEventListener("click", () => {
    console.log(adE2.querySelector("a").href);
    let data = {
      visitor_id: getCookie("id"),
      event_type: "AdClick",
      event_data: {
        ad: adE1.querySelector("a").href,
      },
    };
    $.ajax({
      headers: {
        // Accept: "*/*",
        "Content-Type": "application/json",
      },
      // url: `http://192.168.1.116:8090/api/collections/visitor_events/records`,
      url: `https://cms.3m3.in/api/collections/visitor_events/records`,
      type: "POST",
      async: true,
      data: JSON.stringify(data),
      success: {
        msg: `Inserted data successfully!`,
      },
    })
      .then((d) => {
        console.log(JSON.stringify(d));
      })
      .catch((e) => console.log(e));
  });
}

function searchFunction() {
  var searchValue = document.getElementById("searchInput").value;
    fetch("https://cms.3m3.in/api/collections/visitor_events/records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                event_type: "searchEvent",
                visitor_id: getCookie("id"),
                event_data: {
                    url: event.currentTarget,
                    searchValue
                    // path: window.location.pathname
                },
            }),
        });
sendBackend(searchValue)
     console.log("searchvalue:",searchValue);
    console.log("http://localhost:8000/demo/route/"+searchValue);
    
}

async function sendBackend(val){
    const res = await fetch(`http://localhost:8000/demo/route/${val}`,{
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
    
        },
        body: JSON.stringify({data:val}), 
     });
console.log(await res.json());
}
