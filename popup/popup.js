let runAnalysis = document.querySelector(".run_analysis");
let locations = document.querySelector(".locations");
let urlList  = document.querySelector(".urlList");
let reset  = document.querySelector(".reset");


let duration
let oldDuration = 0;
let totalDuration = 0;
let defaultCarbonIntensityFactorIngCO2PerKWh = 1 //change
let prevTime = parseInt(localStorage.getItem("duration"))
if(prevTime){
  duration = prevTime
}

runAnalysis.addEventListener("click", () => {
  let selectedLocation = locations.options[locations.selectedIndex].value;
  fetch(`https://api.co2signal.com/v1/latest?countryCode=${selectedLocation}`, {
    method: "GET",
    headers: {
      "auth-token": "b5bMfLXPUGLRk158DHL7GPmPqxc8Jwu4",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      console.log(res)
      console.log("he",res.data.carbonIntensity);
      if (res.data.carbonIntensity){
        defaultCarbonIntensityFactorIngCO2PerKWh = res.data.carbonIntensity
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


const kWhPerByteDataCenter = 0.000000000072;
const kWhPerByteNetwork = 0.000000000152;
const kWhPerMinuteDevice = 0.00021;

const GESgCO2ForOneKmByCar = 170.5;
const GESgCO2ForOneChargedSmartphone = 8.3;

new Chartist.Line(
  ".historyChart",
  {
    labels: [
      "14 June",
      "15 June",
      "16 June",
      "17 June",
      "18 June",
      "19 June",
      "20 June",
      "21 June",
      "22 June",
      "23 June",
      "24 June",
    ],
    series: [[5, 9, 7, 8, 5, 3, 5, 4]],
  },
  {
    low: 0,
    showArea: true,
  }
);


setTimeInLocalStorage = (minTime)=>{
  oldDuration = oldDuration+1
  if (oldDuration === 1){
    minTime = minTime+ duration
  }
  localStorage.setItem("duration",minTime)
}

setByteLengthPerOrigin = (origin, byteLength) => {
  const statsJson = getLocalStorageStats();
  let bytePerOrigin =
    statsJson[origin] === undefined ? 0 : parseInt(statsJson[origin]);
  statsJson[origin] = bytePerOrigin + byteLength;
  localStorage.setItem("stats", JSON.stringify(statsJson));
};

getLocalStorageStats = () => {
  const stats = localStorage.getItem("stats");
  const statsJson = stats === null ? {} : JSON.parse(stats);
  return statsJson;
};

getStats = () => {
  const statsList = getLocalStorageStats();
  let total = 0;
  const sortedList = [];

  for (let origin in statsList) {
    total += statsList[origin];
    sortedList.push({ origin: origin, byte: statsList[origin] });
  }

  sortedList.sort(function (a, b) {
    return b.byte - a.byte;
  });

  let topList = sortedList.slice(0, 4);
  let subtotal = 0;
  topList.forEach((element) => {
    subtotal += element.byte;
  });
  let remaining = total - subtotal;
 let  remainingPrnt = Math.round((remaining / total) * 100)

  topList.forEach((element) => {
    element.percent = Math.round((element.byte / total) * 100);
  });

  return {
    total: total,
    remaining:remaining,
    remainingPrnt:remainingPrnt,
    topList: topList,
  };
};


showData = () => {
  const { total: totalByteLength,remainingPrnt, topList } = getStats();

  urlList.replaceChildren();

  if (totalByteLength === 0) {
    return;
  }
  for (let i in topList) {
    let node = document.createElement("li")
    node.innerHTML = `${topList[i].percent}% ${topList[i].origin}`
    urlList.appendChild(node)
    node.classList.add("urlList")
  }
  let node = document.createElement("li")
    node.innerHTML = `${remainingPrnt}% Others`
    urlList.appendChild(node)
    node.classList.add("urlList")

  totalDuration = parseInt(localStorage.getItem("duration"))

    const kWhDataCenterTotal = totalByteLength * kWhPerByteDataCenter;
    const GESDataCenterTotal = kWhDataCenterTotal * defaultCarbonIntensityFactorIngCO2PerKWh;
    
    const kWhNetworkTotal = totalByteLength * kWhPerByteNetwork;
    const GESNetworkTotal = kWhNetworkTotal * defaultCarbonIntensityFactorIngCO2PerKWh;
    
    const kWhDeviceTotal = totalDuration * kWhPerMinuteDevice;
    const GESDeviceTotal = kWhDeviceTotal * defaultCarbonIntensityFactorIngCO2PerKWh;
    
    const kWhTotal = (kWhDataCenterTotal + kWhNetworkTotal + kWhDeviceTotal).toFixed(3);
    let gCO2Total = (GESDataCenterTotal + GESNetworkTotal + GESDeviceTotal).toFixed(3);

    let trees = Math.round((Number(gCO2Total))/21000);

    let kmByCar =  (gCO2Total / GESgCO2ForOneKmByCar).toFixed(3);
    let chargedSmartphones = (gCO2Total / GESgCO2ForOneChargedSmartphone).toFixed(3);
    localStorage.setItem("gCO2Total",gCO2Total)

    console.log(trees)

    document.querySelector(".timeUsed").innerHTML = `${totalDuration}`;
    document.querySelector(".electricityUsed").innerHTML = `${kWhTotal} kWh`;
    
    let megaByte = Math.round(totalByteLength/1024/1024);
    document.querySelector(".mbUsed").innerHTML = `${megaByte} MB`;

    document.querySelector(".chargedMob").innerHTML = `${chargedSmartphones} charged mobiles`;
    document.querySelector(".kmByCar").innerHTML = `${kmByCar} kms by car`;

    document.querySelector(".timeUsed2").innerHTML = `${totalDuration} minutes`;
    document.querySelector(".electricityUsed2").innerHTML = `${kWhTotal} kWh`;
    
    document.querySelector(".mbUsed2").innerHTML = `${megaByte} MB`;

    document.querySelector(".chargedMob").innerHTML = `${chargedSmartphones} charged mobiles`;
    document.querySelector(".kmByCar").innerHTML = `${kmByCar} kms by car`;

    document.querySelector(".CO2").innerHTML = `${Number(gCO2Total)} gCO2e`;
    document.querySelector(".cReleased").innerHTML = `${Number(gCO2Total)} gCO2e`;

    document.querySelector(".finalCO2").innerHTML = `${gCO2Total}g`;
    document.querySelector(".nTrees").innerHTML = `${trees} tree`;

  };

let createChart = () =>{
  let completeData = []
  let {remaining,topList } = getStats();
  topList.forEach((element)=>{
    completeData.push(element.byte)
  })
  completeData.push(remaining)
  
  var data = {
    series: completeData,
  };
  
  var sum = function (a, b) {
    return a + b;
  };
  
  new Chartist.Pie(".ct-chart", data, {
    labelInterpolationFnc: function (value) {
      return Math.round((value / data.series.reduce(sum)) * 100) + "%";
    },
  });
}

getTotalCarbon = () =>{
  const totalCO2 = localStorage.getItem("gCO2Total")
  document.querySelector(".totalCO2").innerHTML = `${totalCO2}gCO2`
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  {
    let origin = request.data.origin;
    let byteLength = request.data.byteLength;
    let minTime = request.data.minTime;
    setByteLengthPerOrigin(origin, byteLength);
    setTimeInLocalStorage(minTime)
  }
});

setInterval(()=>{
  showData();
  getTotalCarbon();
  createChart();
},1000)

reset.addEventListener("click",()=>{
  localStorage.clear();
})