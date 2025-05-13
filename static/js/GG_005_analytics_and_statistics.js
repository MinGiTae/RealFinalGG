// GG_005_analytics_and_statistics.js

// ─────────────────────────────────────────────────────────────
// 0) 공통 Chart.js 기본 설정
Chart.defaults.color = 'white';
Chart.defaults.font.family = '"Noto Sans KR", sans-serif';
Chart.defaults.font.size = 14;
Chart.defaults.plugins.title.position = 'top';
Chart.defaults.plugins.title.align = 'start';
// 제목 패널 상단에서 살짝 위로(5px) 올리기
Chart.defaults.plugins.title.padding = { top: 2, bottom: 4 };
Chart.defaults.layout = {
  padding: { left: 10, right: 10, top: 10, bottom: 10 }
};
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // ── 1) 폐기물별 탄소 배출량 (도넛) ──
  const ctx1 = document.getElementById('carbonChart')?.getContext('2d');
  if (ctx1) {
    const labelMap = {
      plastic: '플라스틱',
      brick: '벽돌',
      wood: '목재',
      concrete: '콘크리트',
      pipes: '파이프',
      general_w: '혼합 폐기물',
      foam: '폼',
      tile: '타일',
      gypsum_board: '석고보드'
    };
    fetch('/api/emissions_by_waste')
      .then(res => res.json())
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
            layout: { padding: 10 },
            plugins: {
              title: { display: true, text: '폐기물별 탄소 배출량', font: { size: 16 } },
              legend: {
                display: true,
                position: 'bottom',
                labels: { boxWidth:10, usePointStyle:true, pointStyle:'circle', padding:12 }
              },
              tooltip: { backgroundColor:'#333', bodyColor:'#fff', borderColor:'#555', borderWidth:1 }
            }
          }
        });
      })
      .catch(console.error);
  }

  // ── 2) 폐기물 종류별 배출량 (바) ──
  fetch('/api/waste-types')
    .then(res => res.json())
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
          layout: { padding: 10 },
          plugins: {
            title: { display: true, text: '폐기물 종류별 배출량', font: { size: 16 } },
            legend: { display: false }
          },
          scales: {
            x: { ticks: { color:'white' }, grid:{ display:false } },
            y: { ticks: { color:'white' }, grid:{ color:'#333' } }
          }
        }
      });
    })
    .catch(console.error);

  // 3) 월별 탄소량 & 폐기물량 비교 (바)
  const ctx3 = document.getElementById('monthlyCompareChart').getContext('2d');
  fetch('/api/monthly-stats')
    .then(r => r.json())
    .then(data => {
      const labels = data.map(d => d.month); // ['2023-01','2023-02',...]
      new Chart(ctx3, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: '폐기물 배출량', data: data.map(d => d.total_waste), backgroundColor: '#fbbf24', borderRadius: 6 },
            { label: '탄소 배출량',   data: data.map(d => d.total_emission), backgroundColor: '#3b82f6', borderRadius: 6 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: 10 },
          plugins: {
            title: { display: true, text: '월별 탄소량과 폐기물량 비교', font: { size: 16 } },
            legend: { labels: { color: 'white' } }
          },
          scales: {
            x: {
              type: 'category',      // 카테고리 축으로 설정
              ticks: { color: 'white' },
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              ticks: { color: 'white' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            }
          }
        }
      });
    })
    .catch(console.error);

  // ── 4) 금월 배출량 순위 (가로바) ──
  fetch('/api/waste-percentage')
    .then(res => res.json())
    .then(data => {
      const ctx4 = document.getElementById('marchWasteChart').getContext('2d');
      new Chart(ctx4, {
        type: 'bar',
        data: {
          labels: data.map(d => d.waste_type),
          datasets: [{
            data: data.map(d => d.percentage),
            backgroundColor: ['#f5a623','#80deea','#42a5f5','#ce93d8'],
            borderRadius:8,
            barThickness:20
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding:10 },
          plugins: {
            title: { display:true, text:'금월 배출량 순위', font:{ size:16 } },
            legend:{ display:false },
            // 데이터 라벨을 바 내부 가운데로
            datalabels: {
              color:'#fff',
              anchor:'center',
              align:'center',
              formatter:v=>`${v}%`,
              font:{ weight:'bold', size:12 }
            }
          },
          scales: {
            x: {
              beginAtZero:true,
              max:100,
              ticks:{ color:'#ccc', callback:v=>`${v}%` },
              grid:{ color:'rgba(255,255,255,0.05)' }
            },
            y: { ticks:{ color:'white' }, grid:{ display:false } }
          }
        },
        plugins:[ChartDataLabels]
      });
    })
    .catch(console.error);

  // ── 5) 건설사별 탄소 배출량 (라인) ──
  const ctx5 = document.getElementById('companyCarbonChart').getContext('2d');
  fetch('/api/emission-by-company')
    .then(res => res.json())
    .then(data => {
      new Chart(ctx5, {
        type: 'line',
        data: {
          labels: data.map(i=>i.company_name),
          datasets:[{
            label:'탄소 배출량 (톤)',
            data: data.map(i=>i.total_emission),
            borderColor:'#4fc3f7',
            backgroundColor:'rgba(79,195,247,0.2)',
            fill:true,
            tension:0.4,
            pointRadius:6,
            pointHoverRadius:8
          }]
        },
        options: {
          responsive:true,
          maintainAspectRatio:false,
          layout:{ padding:10 },
          plugins:{
            title:{ display:true, text:'건설사별 탄소 배출량', font:{ size:16 } },
            legend:{ labels:{ color:'white' } },
            tooltip:{ callbacks:{ label:ctx=>`${ctx.dataset.label}: ${ctx.raw}톤` } }
          },
          scales:{
            x:{ ticks:{ color:'white' }, grid:{ color:'rgba(255,255,255,0.1)' } },
            y:{ beginAtZero:true, ticks:{ color:'white' }, grid:{ color:'rgba(255,255,255,0.1)' } }
          }
        }
      });
    })
    .catch(console.error);

  // ── 6) 최대 배출사 비율 (도넛 + 중앙 텍스트) ──
  fetch('/api/top-emitter')
    .then(res => res.json())
    .then(({ company_name, total_emission }) => {
      const raw = parseFloat(total_emission) || 0;
      const pct = Math.min(Math.max(raw, 0), 100).toFixed(1);
      const ctx6 = document.getElementById('topCompanyChart').getContext('2d');
      new Chart(ctx6, {
        type:'doughnut',
        data:{
          labels:['탄소 배출량','나머지'],
          datasets:[{
            data:[pct,100-pct],
            backgroundColor:['#FACC15','#222'],
            borderWidth:0,
            cutout:'70%'
          }]
        },
        options:{
          responsive:true,
          maintainAspectRatio:false,
          layout:{ padding:10 },
          plugins:{
            title:{ display:true, text:`${company_name} 탄소 배출량`, font:{ size:16 } },
            legend:{ display:false }
          }
        },
        plugins:[{
          id:'centerText',
          beforeDraw(chart){
            const {width,height,ctx} = chart;
            ctx.save();
            ctx.font='bold 24px sans-serif';
            ctx.fillStyle='#fff';
            ctx.textAlign='center';
            ctx.textBaseline='middle';
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
    type:'line',
    data:{ labels:[], datasets:[] },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      layout:{ padding:10 },
      plugins:{
        title:{ display:true, text:'현장 탄소 배출량', font:{ size:16 } },
        legend:{ labels:{ color:'white' } },
        tooltip:{ callbacks:{ label:ctx=>`${ctx.dataset.label}: ${ctx.raw}톤` } }
      },
      scales:{
        x:{ ticks:{ color:'white' }, grid:{ color:'rgba(255,255,255,0.05)' } },
        y:{ beginAtZero:true, ticks:{ color:'white' }, grid:{ color:'rgba(255,255,255,0.05)' } }
      }
    }
  });

  // ── 8) 현장 폐기물 배출량 순위 (가로바) ──
  const ctx8 = document.getElementById('wastePopularityChart').getContext('2d');
  window.wastePopularityChart = new Chart(ctx8, {
    type:'bar',
    data:{ labels:[], datasets:[{ data:[], backgroundColor:[], borderRadius:8, barThickness:20 }] },
    options:{
      indexAxis:'y',
      responsive:true,
      maintainAspectRatio:false,
      layout:{ padding:10 },
      plugins:{
        title:{ display:true, text:'현장 폐기물 배출량 순위', font:{ size:16 } },
        legend:{ display:false },
        tooltip:{ callbacks:{ label:ctx=>`${ctx.raw}kg` } }
      },
      scales:{
        x:{ beginAtZero:true, ticks:{ color:'#ccc' }, grid:{ color:'rgba(255,255,255,0.05)' } },
        y:{ ticks:{ color:'white' }, grid:{ display:false } }
      }
    },
    plugins:[ChartDataLabels]
  });

  // ── 9) 공통: siteData 불러오기 & 지도 채색 & 팝업 ──
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
      const name = idToRegionName[path.id], val = dataObj[name];
      if (val != null) {
        const step = val >= t2 ? 3 : val >= t1 ? 2 : 1;
        path.style.fill = step===3 ? '#0f766e' : step===2 ? '#34d399' : '#a7f3d0';
      }
    });
  }
  fetch('/api/sites')
    .then(r=>r.json())
    .then(data=>{
      data.forEach(site=>{
        const region = (site.latitude && site.longitude)
          ? getRegionFromLatLng(site.latitude, site.longitude)
          : getRegionFromAddress(site.address);
        const R = window.siteData[region] = window.siteData[region] || { sites:[], carbonData:[], wasteData:[] };
        R.sites.push(site.site_name);
        R.carbonData.push(Array.from({length:10},()=>Math.floor(Math.random()*50)+10));
        R.wasteData.push(Math.random()*100);
      });
      updateMapColors(excelCarbonData);
    })
    .catch(console.error);

  // ── 10) 지도 클릭 & 팝업 ──
  const popup = document.getElementById('construction-list');
  document.querySelectorAll('#korea-map path').forEach(region=>{
    region.addEventListener('click', e=>{
      const name = idToRegionName[region.id] || '기타';
      const rd = window.siteData[name] || { sites: [] };
      let html = `<div class="popup-header"><h3>${name} 건설현장</h3>
                  <span class="popup-close" onclick="closePopup()">✕</span></div><ul>`;
      rd.sites.length
        ? rd.sites.forEach(s=> html += `<li>${s}</li>`)
        : html += `<li>등록된 건설현장이 없습니다</li>`;
      html += '</ul>';
      popup.innerHTML = html;
      popup.classList.add('active');
      popup.style.left = `${e.pageX + 15}px`;
      popup.style.top  = `${e.pageY - 50}px`;

      // 월별 탄소 업데이트
      fetch(`/api/emission/region-monthly/${name}`)
        .then(r=>r.json())
        .then(res=>{
          if (res.status==='success') {
            window.siteCarbonChart.data.labels = res.months;
            window.siteCarbonChart.data.datasets = res.carbonData.map((arr,i)=>({
              label: res.sites[i]||`현장 ${i+1}`,
              data: arr,
              fill: true,
              backgroundColor: i%2 ? gradient2 : gradient1,
              borderColor: i%2 ? '#EC4899' : '#22D3EE',
              tension:0.4,
              pointRadius:5,
              pointHoverRadius:7
            }));
            window.siteCarbonChart.update();
          }
        })
        .catch(console.error);

      // 폐기물 순위 업데이트
      fetch(`/api/waste-ranking/${name}`)
        .then(r=>r.json())
        .then(d=>{
          const labs = d.data.map(i=>i.waste_type),
                vals = d.data.map(i=>i.total_amount),
                cols = ['#f5a623','#80deea','#42a5f5','#ce93d8','#f87171','#34d399','#a78bfa','#fcd34d','#60a5fa','#f472b6'];
          window.wastePopularityChart.data.labels = labs;
          window.wastePopularityChart.data.datasets[0].data = vals;
          window.wastePopularityChart.data.datasets[0].backgroundColor = cols.slice(0,labs.length);
          window.wastePopularityChart.update();
        })
        .catch(console.error);
    });
  });
  window.closePopup = () => popup.classList.remove('active');

  // Helper: 주소 → 지역
  function getRegionFromAddress(addr) { /* ...same as above... */ }
  // Helper: 위경도 → 지역
  function getRegionFromLatLng(lat,lng) { /* ...same as above... */ }
});
