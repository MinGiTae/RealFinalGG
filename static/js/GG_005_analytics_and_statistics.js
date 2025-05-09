const ctx1 = document.getElementById('carbonChart').getContext('2d');
new Chart(ctx1, {
  type: 'doughnut',
  data: {
    labels: ['플라스틱', '벽돌', '목재', '콘크리트'],
    datasets: [{
      data: [25, 20, 30, 25],
      backgroundColor: [
        '#6366F1', '#FACC15', '#FB923C', '#22D3EE'
      ],
      borderWidth: 0
    }]
  },
  options: {
    cutout: '70%',
    plugins: {
      title: {
        display: true,
        text: '폐기물별 탄소 배출량',
        color: 'white',
        font: { size: 17, weight: 'bold' },
        align: 'start',
        padding: { bottom: 20 }
      },
      legend: {
        display: true,
        position: 'bottom',
        align: 'center',
        labels: {
          color: 'white',
          boxWidth: 10,
          padding: 40,
          font: { size: 14 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#333',
        bodyColor: '#fff',
        borderColor: '#555',
        borderWidth: 1
      }
    }
  }
});

const ctx2 = document.getElementById('wasteChart').getContext('2d');
new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: ['섬유', '플라스틱', '벽돌', '유리', '목재', '콘크리트'],
    datasets: [{
      label: '배출량',
      data: [10, 20, 30, 12, 25, 35],
      backgroundColor: '#FACC15',
      borderRadius: 20,
      barPercentage: 0.5,
      categoryPercentage: 0.5
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '폐기물 종류별 배출량',
        color: 'white',
        font: { size: 24, weight: 'bold' },
        align: 'start',
        padding: { bottom: 30 }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white', font: { size: 14 } },
        grid: { display: false }
      },
      y: {
        ticks: { color: 'white', font: { size: 14 }, stepSize: 10 },
        grid: { color: '#333' }
      }
    }
  }
});

const ctx3 = document.getElementById('monthlyCompareChart').getContext('2d');
new Chart(ctx3, {
  type: 'bar',
  data: {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: '폐기물 배출량',
        data: [30, 32, 35, 28, 40, 20],
        backgroundColor: '#fbbf24',
        borderRadius: 6
      },
      {
        label: '탄소 배출량',
        data: [28, 30, 33, 26, 38, 18],
        backgroundColor: '#3b82f6',
        borderRadius: 6
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: 'white', font: { size: 14 } }
      },
      title: {
        display: true,
        text: '월별 탄소량과 폐기물량 비교',
        color: 'white',
        font: { size: 20, weight: 'bold' },
        padding: { bottom: 20 }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white', font: { size: 14 } },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { color: 'white', font: { size: 14 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  }
});

const ctx4 = document.getElementById('marchWasteChart').getContext('2d');
new Chart(ctx4, {
  type: 'bar',
  data: {
    labels: ['플라스틱', '콘크리트', '목재', '벽돌'],
    datasets: [{
      label: '배출량 (%)',
      data: [46, 17, 19, 29],
      backgroundColor: ['#f5a623', '#80deea', '#42a5f5', '#ce93d8'],
      borderRadius: 10,
      barThickness: 20
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '3월 폐기물 배출량 순위',
        color: 'white',
        font: { size: 20, weight: 'bold' },
        align: 'start',
        padding: { bottom: 30 }
      },
      legend: { display: false },
      datalabels: {
        color: '#fff',
        backgroundColor: function(context) {
          const colors = [
            'rgba(245, 166, 35, 0.2)', 'rgba(128, 222, 234, 0.2)',
            'rgba(66, 165, 245, 0.2)', 'rgba(206, 147, 216, 0.2)'
          ];
          return colors[context.dataIndex];
        },
        borderColor: function(context) {
          const borderColors = ['#f5a623', '#80deea', '#42a5f5', '#ce93d8'];
          return borderColors[context.dataIndex];
        },
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        anchor: 'end',
        align: 'end',
        formatter: value => `${value}%`,
        font: { weight: 'bold', size: 12 },
        clamp: true
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.raw}%`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#ccc',
          callback: val => `${val}%`
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { display: false }
      }
    }
  },
  plugins: [ChartDataLabels]
});

const ctx5 = document.getElementById('companyCarbonChart').getContext('2d');
new Chart(ctx5, {
  type: 'line',
  data: {
    labels: ['현대건설', 'GS건설', '태영건설', '한화건설', '대림건설'],
    datasets: [{
      label: '탄소 배출량 (톤)',
      data: [120, 95, 80, 70, 60],
      borderColor: '#4fc3f7',
      backgroundColor: 'rgba(79, 195, 247, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4fc3f7',
      pointBorderColor: '#fff',
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '건설사별 탄소 배출량',
        color: 'white',
        font: { size: 20, weight: 'bold' },
        align: 'start',
        padding: { bottom: 30 }
      },
      legend: { labels: { color: 'white' } },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw}톤`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white', font: { size: 14 } },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: 'white', font: { size: 14 } },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  }
});
const ctx6 = document.getElementById('topCompanyChart').getContext('2d');
new Chart(ctx6, {
  type: 'doughnut',
  data: {
    labels: ['탄소 배출량', '나머지'],
    datasets: [{
      data: [70, 30],
      backgroundColor: ['#FACC15', '#222'],
      borderWidth: 0,
      cutout: '70%'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      title: {
        display: true,
        text: '미래건설 탄소 배출량',
        color: 'white',
        font: { size: 20, weight: 'bold' },
        padding: { top: 20, bottom: 20 }
      }
    }
  },
  plugins: [{
    id: 'centerText',
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.save();
      ctx.font = 'bold 30px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('70%', width / 2, height / 2 + 30);
      ctx.restore();
    }
  }]
});

const ctx7  = document.getElementById('siteCarbonChart').getContext('2d');
const gradient1 = ctx7.createLinearGradient(0, 0, 0, 300);
gradient1.addColorStop(0, 'rgba(34, 211, 238, 0.5)');
gradient1.addColorStop(1, 'rgba(34, 211, 238, 0.05)');

const gradient2 = ctx7.createLinearGradient(0, 0, 0, 300);
gradient2.addColorStop(0, 'rgba(236, 72, 153, 0.5)');
gradient2.addColorStop(1, 'rgba(236, 72, 153, 0.05)');

siteCarbonChart = new Chart(ctx7, {
  type: 'line',
  data: {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'],
    datasets: [
      {
        label: '현장 A',
        data: [30, 25, 35, 28, 33, 30, 40, 38, 35, 50],
        fill: true,
        backgroundColor: gradient1,
        borderColor: '#22D3EE',
        tension: 0.4,
        pointBackgroundColor: '#22D3EE',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: '현장 B',
        data: [20, 18, 25, 22, 25, 24, 28, 27, 30, 40],
        fill: true,
        backgroundColor: gradient2,
        borderColor: '#EC4899',
        tension: 0.4,
        pointBackgroundColor: '#EC4899',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '현장 탄소 배출량',
        color: 'white',
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 20 }
      },
      legend: {
        labels: { color: 'white', font: { size: 14 } }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw}톤`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  }
});

const ctx8 = document.getElementById('wastePopularityChart').getContext('2d');
wastePopularityChart = new Chart(ctx8, {
  type: 'bar',
  data: {
    labels: ['플라스틱', '콘크리트', '목재', '벽돌'],
    datasets: [{
      label: '배출량 (%)',
      data: [46, 17, 19, 29],
      backgroundColor: ['#f5a623', '#80deea', '#42a5f5', '#ce93d8'],
      borderRadius: 10,
      barThickness: 20
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '현장 폐기물 배출량 순위',
        color: 'white',
        font: { size: 20, weight: 'bold' },
        align: 'start',
        padding: { bottom: 30 }
      },
      legend: { display: false },
      datalabels: {
        color: '#fff',
        backgroundColor: function(context) {
          const colors = [
            'rgba(245, 166, 35, 0.2)', 'rgba(128, 222, 234, 0.2)',
            'rgba(66, 165, 245, 0.2)', 'rgba(206, 147, 216, 0.2)'
          ];
          return colors[context.dataIndex];
        },
        borderColor: function(context) {
          const borderColors = ['#f5a623', '#80deea', '#42a5f5', '#ce93d8'];
          return borderColors[context.dataIndex];
        },
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        anchor: 'end',
        align: 'end',
        formatter: value => `${value}%`,
        font: { weight: 'bold', size: 12 },
        clamp: true
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.raw}%`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#ccc',
          callback: val => `${val}%`
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { display: false }
      }
    }
  },
  plugins: [ChartDataLabels]
});


const siteLineCanvas = document.getElementById("siteLineChart");
if (siteLineCanvas) {
  siteLineCanvas.width = siteLineCanvas.offsetWidth;
  siteLineCanvas.height = 300;
  siteLineChart = new Chart(siteLineCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'],
      datasets: [{
        label: "탄소 배출량",
        data: [],
        borderColor: "#4fc3f7",
        backgroundColor: "rgba(79,195,247,0.2)",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
        y: { beginAtZero: true, ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } }
      },
      plugins: {
        legend: { labels: { color: "#fff" } },
        title: {
          display: true,
          text: "월별 탄소 배출량",
          color: "#fff",
          font: { size: 18, weight: "bold" },
          padding: { bottom: 20 }
        }
      }
    }
  });
}

// ✅ SVG Hover로 지역별 현장 리스트 띄우기 추가
// ✅ 1. API 연동 후 siteData 생성
window.addEventListener('DOMContentLoaded', () => {
  fetch('/api/sites')
    .then(res => res.json())
    .then(data => {


      data.forEach(site => {
        if (!site.latitude || !site.longitude) return; // 위경도 없는 건 무시
        const region = (site.latitude && site.longitude)
        ? getRegionFromLatLng(site.latitude, site.longitude): getRegionFromAddress(site.address);

        if (!siteData[region]) {
          siteData[region] = { sites: [], carbonData: [], wasteData: [] };
        }

        siteData[region].sites.push(site.site_name);
//        siteData[region].carbonData.push(Math.random() * 100);  // 예시용 더미 데이터
        siteData[region].carbonData.push(Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 10)); // 🔼 10개월용 데이터 배열로 변경됨

        siteData[region].wasteData.push(Math.random() * 100);
      });

      window.siteData = siteData;
      updateMapColors(siteData); // 지도 채색 함수 호출
      updateMapColorsFromExcel(excelCarbonData);
    });
});

// ✅ 2. getRegionFromLatLng 함수는 위경도를 통해 행정구역명 리턴
function getRegionFromLatLng(lat, lng) {
  if (lat >= 37.4 && lat <= 37.7 && lng >= 126.8 && lng <= 127.2) return '서울특별시';
  if (lat >= 35.0 && lat <= 35.3 && lng >= 128.8 && lng <= 129.2) return '부산광역시';
  if (lat >= 35.7 && lat <= 36.0 && lng >= 128.4 && lng <= 128.8) return '대구광역시';
  if (lat >= 37.3 && lat <= 37.6 && lng >= 126.5 && lng <= 126.9) return '인천광역시';
  if (lat >= 35.0 && lat <= 35.3 && lng >= 126.7 && lng <= 127.0) return '광주광역시';
  if (lat >= 36.2 && lat <= 36.5 && lng >= 127.2 && lng <= 127.5) return '대전광역시';
  if (lat >= 35.4 && lat <= 35.7 && lng >= 129.1 && lng <= 129.4) return '울산광역시';
  if (lat >= 36.4 && lat <= 36.7 && lng >= 127.1 && lng <= 127.4) return '세종특별자치시';
  if (lat >= 36.8 && lat <= 38.3 && lng >= 126.5 && lng <= 127.8) return '경기도';
  if (lat >= 37.0 && lat <= 38.5 && lng >= 127.5 && lng <= 129.3) return '강원도';
  if (lat >= 36.3 && lat <= 37.3 && lng >= 127.3 && lng <= 128.3) return '충청북도';
  if (lat >= 36.0 && lat <= 36.9 && lng >= 126.5 && lng <= 127.4) return '충청남도';
  if (lat >= 35.3 && lat <= 36.1 && lng >= 126.5 && lng <= 127.4) return '전라북도';
  if (lat >= 34.4 && lat <= 35.3 && lng >= 126.2 && lng <= 127.3) return '전라남도';
  if (lat >= 35.8 && lat <= 37.0 && lng >= 128.0 && lng <= 129.5) return '경상북도';
  if (lat >= 34.8 && lat <= 35.7 && lng >= 127.8 && lng <= 129.4) return '경상남도';
  if (lat >= 33.1 && lat <= 33.6 && lng >= 126.2 && lng <= 126.8) return '제주특별자치도';
  return '기타';
}




// ✅ 3. 지도 색상 업데이트 함수
function updateMapColors(siteData) {
  const regionEmission = {};
  for (const region in siteData) {
    const carbonList = siteData[region].carbonData || [];
    const totalCarbon = carbonList.reduce((a, b) => a + b, 0);
    regionEmission[region] = totalCarbon;
  }

  const emissions = Object.values(regionEmission);
  const sorted = [...emissions].sort((a, b) => a - b);
  const t1 = sorted[Math.floor(sorted.length * 0.33)];
  const t2 = sorted[Math.floor(sorted.length * 0.66)];

  const getStep = (value) => {
    if (value >= t2) return 3;
    if (value >= t1) return 2;
    return 1;
  };

  const getColorByStep = (step) => {
    if (step === 3) return "#0f766e";
    if (step === 2) return "#34d399";
    return "#a7f3d0";
  };

  document.querySelectorAll("#korea-map path").forEach(region => {
    const regionId = region.getAttribute("id");
    const regionName = idToRegionName[regionId];
    const emission = regionEmission[regionName];
    if (emission !== undefined) {
      const step = getStep(emission);
      region.style.fill = getColorByStep(step);
    }
  });
}


function updateMapColorsFromExcel(excelData) {
  const emissions = Object.values(excelData);
  const sorted = [...emissions].sort((a, b) => a - b);
  const t1 = sorted[Math.floor(sorted.length * 0.33)];
  const t2 = sorted[Math.floor(sorted.length * 0.66)];

  const getStep = (value) => {
    if (value >= t2) return 3;
    if (value >= t1) return 2;
    return 1;
  };

  const getColorByStep = (step) => {
    if (step === 3) return "#0f766e";
    if (step === 2) return "#34d399";
    return "#a7f3d0";
  };

  document.querySelectorAll("#korea-map path").forEach(region => {
    const regionId = region.getAttribute("id");
    const regionName = idToRegionName[regionId];
    const emission = excelData[regionName];

    if (emission !== undefined) {
      const step = getStep(emission);
      region.style.fill = getColorByStep(step);
    }
  });
}

// ✅ 4. 지역 클릭 시 팝업 리스트 갱신

document.querySelectorAll("#korea-map path").forEach(region => {
  region.addEventListener("click", (e) => {
    const regionId = region.getAttribute("id");
    const regionName = idToRegionName[regionId];
    const regionData = window.siteData?.[regionName];

    const popup = document.getElementById("construction-list");

    let siteListHTML = `
   <div class="popup-header">
    <h3>${regionName} 건설현장</h3>
    <span class="popup-close" onclick="closePopup()">✕</span>
  </div>
  <ul>
 `;

    if (regionData?.sites?.length > 0) {
      regionData.sites.forEach(site => {
        siteListHTML += `<li>${site}</li>`;
      });
    } else {
      siteListHTML += `<li>등록된 건설현장이 없습니다</li>`;
    }

    siteListHTML += "</ul>";
    popup.innerHTML = siteListHTML;
    popup.classList.add("active");

    popup.style.left = `${e.pageX + 15}px`;
    popup.style.top = `${e.pageY - 50}px`;

//    if (regionData) {
//      siteCarbonChart.data.datasets[0].data = regionData.carbonData;
//      siteCarbonChart.update();
//
//      wastePopularityChart.data.datasets[0].data = regionData.wasteData;
//      wastePopularityChart.update();
//    }
siteCarbonChart.data.datasets = []; // 기존 데이터 제거
regionData.carbonData.forEach((carbonArr, index) => {
  siteCarbonChart.data.datasets.push({
    label: regionData.sites[index] || `현장 ${index + 1}`, // 건설현장 이름 반영
    data: carbonArr,
    fill: true,
    backgroundColor: index % 2 === 0 ? gradient1 : gradient2,
    borderColor: index % 2 === 0 ? '#22D3EE' : '#EC4899',
    tension: 0.4,
    pointBackgroundColor: index % 2 === 0 ? '#22D3EE' : '#EC4899',
    pointBorderColor: '#fff',
    pointRadius: 5,
    pointHoverRadius: 7
  });
});
siteCarbonChart.update();

  });
});

// ✅ 5. 지도 바깥 클릭 시 팝업 제거

document.addEventListener("click", (e) => {
  const popup = document.getElementById("construction-list");
  const isMapPath = e.target.closest("#korea-map path");
  const isPopup = e.target.closest("#construction-list");
  if (!isMapPath && !isPopup) {
    popup.classList.remove("active");
  }
});

function closePopup() {
  const popup = document.getElementById("construction-list");
  popup.classList.remove("active");
}

// ✅ 기타 기존 차트 등 코드 아래 유지


const siteData = {};
function getRegionFromAddress(address) {
  if (!address) return "기타";
  if (address.includes("서울")) return "서울특별시";
  if (address.includes("부산")) return "부산광역시";
  if (address.includes("대구")) return "대구광역시";
  if (address.includes("인천")) return "인천광역시";
  if (address.includes("광주")) return "광주광역시";
  if (address.includes("대전")) return "대전광역시";
  if (address.includes("울산")) return "울산광역시";
  if (address.includes("세종")) return "세종특별자치시";
  if (address.includes("경기")) return "경기도";
  if (address.includes("강원")) return "강원도";
  if (address.includes("충북")) return "충청북도";
  if (address.includes("충남")) return "충청남도";
  if (address.includes("전북")) return "전라북도";
  if (address.includes("전남")) return "전라남도";
  if (address.includes("경북")) return "경상북도";
  if (address.includes("경남")) return "경상남도";
  if (address.includes("제주")) return "제주특별자치도";
  return "기타";
}
const excelCarbonData = {
  '서울특별시': 194195717.67,
  '부산광역시': 111389268.12,
  '대구광역시': 68451056.07,
  '인천광역시': 101747460.87,
  '광주광역시': 52323444.37,
  '대전광역시': 46349842.99,
  '울산광역시': 46377438.76,
  '세종특별자치시': 28039838.23,
  '경기도': 289137143.75,
  '강원도': 73129346.10,
  '충청북도': 72855850.81,
  '충청남도': 96639696.34,
  '전라북도': 73538030.99,
  '전라남도': 70181621.94,
  '경상북도': 120016352.27,
  '경상남도': 116087012.18,
  '제주특별자치도': 21376490.53
};


const idToRegionName = {
  "KR-11": "서울특별시",
  "KR-26": "부산광역시",
  "KR-27": "대구광역시",
  "KR-28": "인천광역시",
  "KR-29": "광주광역시",
  "KR-30": "대전광역시",
  "KR-31": "울산광역시",
  "KR-41": "경기도",
  "KR-42": "강원도",
  "KR-43": "충청북도",
  "KR-44": "충청남도",
  "KR-45": "전라북도",
  "KR-46": "전라남도",
  "KR-47": "경상북도",
  "KR-48": "경상남도",
  "KR-49": "제주특별자치도",
  "KR-50": "세종특별자치시"
};

const regionEmission = {};
for (const region in siteData) {
  const carbonList = siteData[region].carbonData || [];
  const totalCarbon = carbonList.reduce((a, b) => a + b, 0);
  regionEmission[region] = totalCarbon;
}


const emissions = Object.values(regionEmission);
const sorted = [...emissions].sort((a, b) => a - b);
const t1 = sorted[Math.floor(sorted.length * 0.33)];
const t2 = sorted[Math.floor(sorted.length * 0.66)];



const getStep = (value) => {
  if (value >= t2) return 3;
  if (value >= t1)  return 2;
  return 1;
};

const getColorByStep = (step) => {
  if (step === 3) return "#0f766e";  // 빨강
  if (step === 2) return "#34d399";  // 주황
  return "#a7f3d0";                  // 노랑
};

document.querySelectorAll("#korea-map path").forEach(region => {
  const regionId = region.getAttribute("id");
  const regionName = idToRegionName[regionId]?.trim();
  const emission = regionEmission[regionName];

  console.log(regionId, regionName, emission);

  if (emission !== undefined) {
    const step = getStep(emission);
    region.style.fill = getColorByStep(step);
  }
});

document.querySelectorAll("#korea-map path").forEach(region => {
  region.addEventListener("click", (e) => {
    const regionId = region.getAttribute("id");
    const regionName = idToRegionName[regionId];
    const regionData = siteData[regionName];
    const sites =  regionData?.sites || [];

    const popup = document.getElementById("construction-list");


    let siteListHTML = `
   <div class="popup-header">
    <h3>${regionName} 건설현장</h3>
    <span class="popup-close" onclick="closePopup()">✕</span>
  </div>
  <ul>
 `;
  sites.forEach(site => {
  siteListHTML += `<li>${site}</li>`;
});


    siteListHTML += "</ul>";
    popup.innerHTML = siteListHTML;
    popup.classList.add("active");

    // 마우스 위치 기준으로 팝업 위치 조정
    popup.style.left = `${e.pageX + 15}px`;
    popup.style.top = `${e.pageY - 50}px`;

    if (regionData) {
    siteCarbonChart.data.datasets[0].data = regionData.carbonData;
    siteCarbonChart.update();

    wastePopularityChart.data.datasets[0].data = regionData.wasteData;
    wastePopularityChart.update();
}
  });
});

document.addEventListener("click", (e) => {
  const popup = document.getElementById("construction-list");
  const isMapPath = e.target.closest("#korea-map path");
  const isPopup = e.target.closest("#construction-list");

  // 지도나 팝업 내부가 아닌 다른 영역 클릭 시 닫기
  if (!isMapPath && !isPopup) {
    popup.classList.remove("active");
  }
});
// 🔽 이 아래에 추가
function closePopup() {
  const popup = document.getElementById("construction-list");
  popup.classList.remove("active");
}
