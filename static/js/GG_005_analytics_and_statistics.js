// static/js/GG_005_analytics_and_statistics.js






// ─────────────────────────────────────────────────────────────
// 0) Chart.js 공통 설정
Chart.defaults.color = 'white';
Chart.defaults.font.family = '"Noto Sans KR", sans-serif';
Chart.defaults.font.size = 14;
Chart.defaults.plugins.title.position = 'top';
Chart.defaults.plugins.title.align = 'start';
Chart.defaults.plugins.title.padding = { top: 4, bottom: 4 };
Chart.defaults.layout = { padding: { left: 0, right: 0, top: 0, bottom: 0 } };
// ─────────────────────────────────────────────────────────────






document.addEventListener('DOMContentLoaded', () => {
  // ── 1) 폐기물별 탄소 배출량 (도넛) ──
  const ctx1 = document.getElementById('carbonChart')?.getContext('2d');
  if (ctx1) {
    const labelMap = {
      plastic: '플라스틱', brick: '벽돌', wood: '목재',
      concrete: '콘크리트', pipes: '파이프', general_w: '혼합 폐기물',
      foam: '폼', tile: '타일', gypsum_board: '석고보드'
    };
    fetch('/api/emissions_by_waste')
      .then(r => r.json())
      .then(data => {
        new Chart(ctx1, {
          type: 'doughnut',
          data: {
            labels: data.map(i => labelMap[i.waste_type] || i.waste_type),
            datasets: [{
              data: data.map(i => i.total_emission),
              backgroundColor: ['#6366F1','#FACC15','#FB923C','#22D3EE'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              title: { display: true, text: '폐기물별 탄소 배출량', font: { size: 16 } },
              legend: {
                display: true, position: 'bottom', labels: {
                  boxWidth: 10, usePointStyle: true, pointStyle: 'circle', padding: 12
                }
              },
              tooltip: { backgroundColor: '#333', bodyColor: '#fff', borderColor: '#555', borderWidth: 1 }
            }
          }
        });
      });
  }

  // ── 2) 폐기물 종류별 배출량 (바) ──
  fetch('/api/waste-types')
    .then(r => r.json())
    .then(data => {
      const ctx2 = document.getElementById('wasteChart').getContext('2d');
      new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: data.map(i => i.waste_type),
          datasets: [{
            data: data.map(i => i.total_amount),
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
            title: { display: true, text: '폐기물 종류별 배출량', font: { size: 16 } },
            legend: { display: false },
            datalabels: {
              color: 'white',
              anchor: 'center',
              align: 'center',
              font: { size: 12, weight: 'bold' },
              formatter: val => val
            }
          },
          scales: {
            x: { ticks: { color: 'white' }, grid: { display: false } },
            y: { ticks: { color: 'white' }, grid: { color: '#333' } }
          }
        },
        plugins: [ChartDataLabels]
      });
    });


// ↓ 아래부터 기존 코드

  // ── 3) 월별 탄소량 & 폐기물량 비교 (바, 시간축) ──
//  const ctx3 = document.getElementById('monthlyCompareChart').getContext('2d');
//  fetch('/api/monthly-stats')
//    .then(r => r.json())
//    .then(data => {
//      // "YYYY-MM" → "YYYY-MM-01" 으로 변환
//
//
//      const labels = data.map(d => d.month);
//
//      new Chart(ctx3, {
//        type: 'bar',
//        data: {
//          labels,
//          datasets: [
//            {
//              label: '폐기물 배출량',
//              data: data.map(d => d.total_waste),
//              backgroundColor: '#fbbf24', borderRadius: 6
//            },
//            {
//              label: '탄소 배출량',
//              data: data.map(d => d.total_emission),
//              backgroundColor: '#3b82f6', borderRadius: 6
//            }
//          ]
//        },
//        options: {
//          responsive: true,
//          maintainAspectRatio: false,
//          plugins: {
//            title: { display: true, text: '월별 탄소량과 폐기물량 비교', font: { size: 16 } },
//            legend: { labels: { color: 'white' } }
//          },
//          scales: {
//            x: {
//              type: 'category',
//              time: {
//                parser: 'yyyy-MM-dd',
//                unit: 'month',
//                displayFormats: { month: 'yyyy년 M월' }
//              },
//              ticks: { color: 'white',
//              callback: v => v.replace('-', '년 ') + '월'
//              },
//              grid: { display: false }
//            },
//            y: {
//              beginAtZero: true,
//              ticks: { color: 'white' },
//              grid: { color: 'rgba(255,255,255,0.1)' }
//            }
//          }
//        }
//      });
//    })
//    .catch(console.error);
//const ctx3 = document.getElementById('monthlyCompareChart').getContext('2d');
//
//fetch('/api/monthly-stats')
//  .then(res => res.json())
//  .then(data => {
//    const labels = data.map(d => d.month);
//    console.log("📅 labels 확인", labels);  // ← 여기에 넣어봐
//
//    const wasteData = data.map(d => d.total_waste);
//    const emissionData = data.map(d => d.total_emission);
//
//    new Chart(ctx3, {
//      type: 'bar',
//      data: {
//        labels: labels,
//        datasets: [
//          {
//            label: '폐기물 배출량',
//            data: wasteData,
//            backgroundColor: '#fbbf24',
//            borderRadius: 6
//          },
//          {
//            label: '탄소 배출량',
//            data: emissionData,
//            backgroundColor: '#3b82f6',
//            borderRadius: 6
//          }
//        ]
//      },
//      options: {
//        responsive: true,
//        maintainAspectRatio: false,
//        plugins: {
//          legend: {
//            display: true,
//            labels: { color: 'white', font: { size: 14 } }
//          },
//          title: {
//            display: true,
//            text: '월별 탄소량과 폐기물량 비교',
//            color: 'white',
//            font: { size: 20, weight: 'bold' },
//            padding: { bottom: 20 }
//          }
//        },
//        scales: {
//          x: {
//
//            type: 'category',
//            ticks: { color: 'white', font: { size: 14 },
//                callback: function(value) {
//      const rawLabel = this.getLabelForValue(value);
//      if (typeof rawLabel === 'string' && rawLabel.includes('-')) {
//        const [year, month] = rawLabel.split('-');
//        return `${year}년 ${parseInt(month)}월`;
//      }
//      return rawLabel;
//    }
//
//
//
//
//
//            },
//
//            grid: { display: false }
//          },
//          y: {
//            beginAtZero: true,
//            ticks: { color: 'white', font: { size: 14 } },
//            grid: { color: 'rgba(255, 255, 255, 0.1)' }
//          }
//        }
//      }
//    });
//  });
//
//
//
//  // ── 4) 3월 폐기물 배출량 순위 (가로바) ──
//  const now = new Date();
//  const currentMonthTitle = `${now.getMonth() + 1}월 폐기물 배출량 순위`;
//
//
//  fetch('/api/waste-percentage')
//    .then(r => r.json())
//    .then(data => {
//      const ctx4 = document.getElementById('marchWasteChart').getContext('2d');
//      new Chart(ctx4, {
//        type: 'bar',
//        data: {
//          labels: data.map(d => d.waste_type),
//          datasets: [{
//            data: data.map(d => d.percentage),
//            backgroundColor: ['#f5a623','#80deea','#42a5f5','#ce93d8'],
//            borderRadius: 8,
//            barThickness: 20
//          }]
//        },
//        options: {
//          indexAxis: 'y',
//          responsive: true,
//          maintainAspectRatio: false,
//          plugins: {
//            title: { display: true, text: currentMonthTitle , font: { size: 16 } },
//            legend: { display: false },
//            datalabels: {
//              color: 'white',
//              anchor: 'center',
//              align: 'center',
//              font: { size: 12, weight: 'bold' },
//              formatter: v => `${v}%`
//            }
//          },
//          scales: {
//            x: {
//              beginAtZero: true,
//              max: 100,
//              ticks: { color: '#ccc', callback: v => `${v}%` },
//              grid: { color: 'rgba(255,255,255,0.05)' }
//            },
//            y: { ticks: { color: 'white' }, grid: { display: false } }
//          }
//        },
//        plugins: [ChartDataLabels]
//      });
//    });

  // ── 5) 건설사별 탄소 배출량 (라인) ──
  const ctx5 = document.getElementById('companyCarbonChart').getContext('2d');
  fetch('/api/emission-by-company')
    .then(r => r.json())
    .then(data => {
      new Chart(ctx5, {
        type: 'line',
        data: {
          labels: data.map(i => i.company_name),
          datasets: [{
            label: '탄소 배출량 (톤)',
            data: data.map(i => i.total_emission),
            borderColor: '#4fc3f7',
            backgroundColor: 'rgba(79,195,247,0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: '건설사별 탄소 배출량', font: { size: 16 } },
            legend: { labels: { color: 'white' } },
            tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}톤` } }
          },
          scales: {
            x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            y: { beginAtZero: true, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } }
          }
        }
      });
    });

  // ── 6) 최대 배출사 비율 (도넛 + 중앙 텍스트) ──
  fetch('/api/top-emitter')
    .then(r => r.json())
    .then(({ company_name, total_emission }) => {
      const pct = Math.min(Math.max(Number(total_emission), 0), 100).toFixed(1);
      const ctx6 = document.getElementById('topCompanyChart').getContext('2d');
      new Chart(ctx6, {
        type: 'doughnut',
        data: {
          labels: ['탄소 배출량','나머지'],
          datasets: [{
            data: [pct, 100 - pct],
            backgroundColor: ['#FACC15','#222'],
            borderWidth: 0,
            cutout: '70%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: `${company_name} 탄소 배출량`, font: { size: 16 } },
            legend: { display: false }
          }
        },
        plugins: [{
          id: 'centerText',
          beforeDraw(chart) {
            const { width, height, ctx } = chart;
            ctx.save();
            ctx.font = 'bold 24px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${pct}%`, width/2, height/2 + 10);
            ctx.restore();
          }
        }]
      });
    })
    .catch(console.error);

  // ── 7) 현장 탄소 배출량 (라인, 업데이트용 전역) ──
  const ctx7 = document.getElementById('siteCarbonChart').getContext('2d');
  const gradient1 = ctx7.createLinearGradient(0,0,0,300);
  gradient1.addColorStop(0,'rgba(34,211,238,0.5)');
  gradient1.addColorStop(1,'rgba(34,211,238,0.05)');
  const gradient2 = ctx7.createLinearGradient(0,0,0,300);
  gradient2.addColorStop(0,'rgba(236,72,153,0.5)');
  gradient2.addColorStop(1,'rgba(236,72,153,0.05)');
  window.siteCarbonChart = new Chart(ctx7, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: '현장 탄소 배출량', font: { size: 16 } },
        legend: { labels: { color: 'white' } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}톤` } }
      },
      scales: {
        x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { beginAtZero: true, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });

  // ── 8) 현장 폐기물 배출량 순위 (가로바) ──
  const ctx8 = document.getElementById('wastePopularityChart').getContext('2d');
  window.wastePopularityChart = new Chart(ctx8, {
    type: 'bar',
    data: { labels: [], datasets: [{ label: '배출량 (kg)', data: [], backgroundColor: [], borderRadius: 8, barThickness: 20 }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: '현장 폐기물 배출량 순위', font: { size: 16 } },
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.raw}kg` } },
        datalabels: {
          color: 'white',
          anchor: 'center',
          align: 'center',
          font: { size: 12, weight: 'bold' },
          formatter: v => v.toFixed(0)
        }
      },
      scales: {
        x: { beginAtZero: true, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: 'white' }, grid: { display: false } }
      }
    },
    plugins: [ChartDataLabels]
  });

  // ── 9) siteData 불러오기 & 지도 채색 ──
  window.siteData = {};
  const idToRegionName = {
    "KR-11":"서울특별시","KR-26":"부산광역시","KR-27":"대구광역시","KR-28":"인천광역시",
    "KR-29":"광주광역시","KR-30":"대전광역시","KR-31":"울산광역시","KR-41":"경기도",
    "KR-42":"강원도","KR-43":"충청북도","KR-44":"충청남도","KR-45":"전라북도",
    "KR-46":"전라남도","KR-47":"경상북도","KR-48":"경상남도","KR-49":"제주특별자치도",
    "KR-50":"세종특별자치시"
  };
  const excelCarbonData = {
    '서울특별시':194195717.67,'부산광역시':111389268.12,'대구광역시':68451056.07,
    '인천광역시':101747460.87,'광주광역시':52323444.37,'대전광역시':46349842.99,
    '울산광역시':46377438.76,'세종특별자치시':28039838.23,'경기도':289137143.75,
    '강원도':73129346.10,'충청북도':72855850.81,'충청남도':96639696.34,
    '전라북도':73538030.99,'전라남도':70181621.94,'경상북도':120016352.27,
    '경상남도':116087012.18,'제주특별자치도':21376490.53
  };
  function updateMapColors(dataObj) {
    const vals = Object.values(dataObj).sort((a,b)=>a-b);
    const t1 = vals[Math.floor(vals.length*0.33)], t2 = vals[Math.floor(vals.length*0.66)];
    document.querySelectorAll('#korea-map path').forEach(path => {
      const step = dataObj[idToRegionName[path.id]] >= t2 ? 3
                 : dataObj[idToRegionName[path.id]] >= t1 ? 2
                 : 1;
      path.style.fill = step===3? '#0f766e' : step===2? '#34d399' : '#a7f3d0';
    });
  }
  fetch('/api/sites').then(r=>r.json()).then(list=>{
    list.forEach(site=>{
      const region = (site.latitude&&site.longitude)
        ? getRegionFromLatLng(site.latitude, site.longitude)
        : getRegionFromAddress(site.address);
      window.siteData[region] = window.siteData[region]||{sites:[],carbonData:[],wasteData:[]};
      window.siteData[region].sites.push(site.site_name);
      window.siteData[region].carbonData.push(Array.from({length:10},()=>Math.floor(Math.random()*50)+10));
      window.siteData[region].wasteData.push(Math.random()*100);
    });
    updateMapColors(excelCarbonData);
  });

  // ── 10) 지도 클릭 & 팝업 ──
  const popup = document.getElementById('construction-list');
  document.querySelectorAll('#korea-map path').forEach(region=>{
    region.addEventListener('click', e=>{
      const name = idToRegionName[region.id] || '기타';
      const rd = window.siteData[name] || {sites:[]};
      let html = `<div class="popup-header"><h3>${name} 건설현장</h3>
                  <span class="popup-close" onclick="closePopup()">✕</span></div><ul>`;
      rd.sites.forEach(s=> html += `<li>${s}</li>`);
      if (!rd.sites.length) html += `<li>등록된 건설현장이 없습니다</li>`;
      html += '</ul>';
      popup.innerHTML = html;
      popup.classList.add('active');
      popup.style.left = `${e.pageX+15}px`;
      popup.style.top  = `${e.pageY-50}px`;

      // 월별 데이터 업데이트
      fetch(`/api/emission/region-monthly/${name}`)
        .then(r=>r.json())
        .then(res=>{
          if (res.status==='success') {
            window.siteCarbonChart.data.labels   = res.months.map(m=>m.replace('월','')+'-01');
            window.siteCarbonChart.data.datasets = res.carbonData.map((arr,i)=>({
              label: res.sites[i]||`현장 ${i+1}`,
              data: arr,
              fill: true,
              backgroundColor: i%2?gradient2:gradient1,
              borderColor: i%2?'#EC4899':'#22D3EE',
              tension:0.4, pointRadius:5, pointHoverRadius:7
            }));
            window.siteCarbonChart.update();
          }
        }).catch(console.error);

      // 폐기물 순위 업데이트
      fetch(`/api/waste-ranking/${name}`)
        .then(r=>r.json())
        .then(d=>{
          const labs = d.data.map(i=>i.waste_type);
          const vals = d.data.map(i=>i.total_amount);
          const cols = ['#f5a623','#80deea','#42a5f5','#ce93d8','#f87171','#34d399','#a78bfa','#fcd34d','#60a5fa','#f472b6'];
          window.wastePopularityChart.data.labels = labs;
          window.wastePopularityChart.data.datasets[0].data = vals;
          window.wastePopularityChart.data.datasets[0].backgroundColor = cols.slice(0,labs.length);
          window.wastePopularityChart.update();
        }).catch(console.error);
    });
  });
  window.closePopup = () => popup.classList.remove('active');

  // ── 헬퍼: 주소→지역, 위경도→지역 ──
  function getRegionFromAddress(addr) {
    if (!addr) return '기타';
    if (addr.includes('서울')) return '서울특별시';
    if (addr.includes('부산')) return '부산광역시';
    if (addr.includes('대구')) return '대구광역시';
    if (addr.includes('인천')) return '인천광역시';
    if (addr.includes('광주')) return '광주광역시';
    if (addr.includes('대전')) return '대전광역시';
    if (addr.includes('울산')) return '울산광역시';
    if (addr.includes('세종')) return '세종특별자치시';
    if (addr.includes('경기')) return '경기도';
    if (addr.includes('강원')) return '강원도';
    if (addr.includes('충북')) return '충청북도';
    if (addr.includes('충남')) return '충청남도';
    if (addr.includes('전북')) return '전라북도';
    if (addr.includes('전남')) return '전라남도';
    if (addr.includes('경북')) return '경상북도';
    if (addr.includes('경남')) return '경상남도';
    if (addr.includes('제주')) return '제주특별자치도';
    return '기타';
  }
  function getRegionFromLatLng(lat,lng) {
    if(lat>=37.4&&lat<=37.7&&lng>=126.8&&lng<=127.2) return '서울특별시';
    if(lat>=35.0&&lat<=35.3&&lng>=128.8&&lng<=129.2) return '부산광역시';
    if(lat>=35.7&&lat<=36.0&&lng>=128.4&&lng<=128.8) return '대구광역시';
    if(lat>=37.3&&lat<=37.6&&lng>=126.5&&lng<=126.9) return '인천광역시';
    if(lat>=35.0&&lat<=35.3&&lng>=126.7&&lng<=127.0) return '광주광역시';
    if(lat>=36.2&&lat<=36.5&&lng>=127.2&&lng<=127.5) return '대전광역시';
    if(lat>=35.4&&lat<=35.7&&lng>=129.1&&lng<=129.4) return '울산광역시';
    if(lat>=36.4&&lat<=36.7&&lng>=127.1&&lng<=127.4) return '세종특별자치시';
    if(lat>=36.8&&lat<=38.3&&lng>=126.5&&lng<=127.8) return '경기도';
    if(lat>=37.0&&lat<=38.5&&lng>=127.5&&lng<=129.3) return '강원도';
    if(lat>=36.3&&lat<=37.3&&lng>=127.3&&lng<=128.3) return '충청북도';
    if(lat>=36.0&&lat<=36.9&&lng>=126.5&&lng<=127.4) return '충청남도';
    if(lat>=35.3&&lat<=36.1&&lng>=126.5&&lng<=127.4) return '전라북도';
    if(lat>=34.4&&lat<=35.3&&lng>=126.2&&lng<=127.3) return '전라남도';
    if(lat>=35.8&&lat<=37.0&&lng>=128.0&&lng<=129.5) return '경상북도';
    if(lat>=34.8&&lat<=35.7&&lng>=127.8&&lng<=129.4) return '경상남도';
    if(lat>=33.1&&lat<=33.6&&lng>=126.2&&lng<=126.8) return '제주특별자치도';
    return '기타';
  }
});
