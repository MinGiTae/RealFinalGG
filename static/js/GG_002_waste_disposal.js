// static/js/GG_002_waste_disposal.js
// ================================
// 🛠️ GarbageGuard 프로젝트: 폐기물 처리 페이지 JS
// 📌 템플릿에서 주입된 전역 변수
console.log('[WasteDisposal.js] 로드 완료:', {
  CURRENT_SITE_ID: window.CURRENT_SITE_ID,
  resultImgPath: window.resultImgPath,
  detectedDetailed: window.detectedDetailed
});

let wasteChart;
let carbonChart;

// 📊 차트 초기화 함수
function initializeCharts() {
  // 폐기물 종류 비율 - Bar Chart
  const wasteCtx = document.getElementById('wasteChart').getContext('2d');
  wasteChart = new Chart(wasteCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: '개수',
        data: [],
        // 색상은 백엔드와 일치하도록 설정
        backgroundColor: '#ffff99',
        borderRadius: 10
      }]
    },
    options: {
      plugins: {
        tooltip: { callbacks: { label: ctx => `${ctx.parsed.y}개` } },
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: 'white' }, grid: { display: false } },
        y: { ticks: { color: 'white' }, grid: { color: '#444' } }
      }
    }
  });

  // 월별 탄소 배출량 비교 - Line Chart
  const carbonCtx = document.getElementById('carbonChart').getContext('2d');
  carbonChart = new Chart(carbonCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: '월별 폐기물 탄소 배출량 (kg)',
        data: [],
        fill: false,
        tension: 0.3,
        pointBackgroundColor: 'white'
      }]
    },
    options: {
      plugins: {
        tooltip: { callbacks: { label: ctx => `${ctx.parsed.y} kg` } },
        legend: { labels: { color: 'white' } }
      },
      scales: {
        x: { ticks: { color: 'white' }, grid: { display: false } },
        y: { ticks: { color: 'white' }, grid: { color: '#444' } }
      }
    }
  });
}

// 📈 월별 통계 데이터 로드 및 차트 갱신
function loadMonthlyStats(siteId) {
  if (!siteId) return;
  fetch(`/upload/monthly_stats?site_id=${siteId}`)
    .then(res => res.json())
    .then(data => {
      console.log('[📊 월별통계 응답]', data);
      const labels = data.map(d => d.month);
      const values = data.map(d => parseFloat(d.total_emission) || 0);

      // 현재 월 추가
      const current = new Date().toISOString().slice(0,7);
      if (!labels.includes(current)) {
        labels.push(current);
        values.push(0);
      }

      // 정렬 후 차트 데이터 설정
      const sorted = labels.map((m,i) => ({ month: m, emission: values[i] }))
                           .sort((a,b) => a.month.localeCompare(b.month));
      carbonChart.data.labels = sorted.map(x => x.month);
      carbonChart.data.datasets[0].data = sorted.map(x => x.emission);
      carbonChart.update();
    })
    .catch(e => console.error('[loadMonthlyStats] 실패', e));
}

// ⛓️ 회사 - 현장 바인딩 및 표시
function bindCompanySite() {
  const companySelect = document.getElementById('company-select');
  const siteSelect    = document.getElementById('site-select');
  const displayEl     = document.getElementById('site-name-display');

  companySelect.addEventListener('change', () => {
    Array.from(siteSelect.options).forEach(opt => {
      opt.style.display = (!opt.value || opt.getAttribute('data-company') === companySelect.value)
                          ? 'block' : 'none';
    });
    siteSelect.value = '';
    displayEl.innerText = '현장명 없음';
  });

  siteSelect.addEventListener('change', () => {
    const cname = companySelect.selectedOptions[0]?.text || '';
    const sname = siteSelect.selectedOptions[0]?.text   || '';
    displayEl.innerText = (cname && sname) ? `${cname} - ${sname}` : '현장명 없음';
  });
}

// 🔍 이미지 확대/축소 설정 (Panzoom)
function bindPanzoom() {
  const zoomContainer = document.getElementById('zoom-container');
  if (zoomContainer && window.panzoom) {
    const pz = panzoom(zoomContainer, { maxZoom: 5, minZoom: 0.5, bounds: true, boundsPadding: 0.1 });
    document.getElementById('resetZoom')?.addEventListener('click', () => {
      pz.moveTo(0, 0);
      pz.zoomAbs(0, 0, 1);
    });
    document.getElementById('reuploadBtn')?.addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });
  }
}

// 💾 분석 결과 서버 저장 바인딩
function bindSave() {
  document.querySelector('.save-button').addEventListener('click', () => {
    const imgPath = window.resultImgPath;
    const data = window.detectedDetailed;
    if (!imgPath || !Array.isArray(data) || data.length === 0) {
      return alert('저장할 분석 결과가 없습니다.');
    }

    const counts = {};
    data.forEach(d => counts[d.name] = d.count);

    fetch('/upload/save_result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: document.getElementById('company-select').value,
        site_id:    document.getElementById('site-select').value,
        site_name:  document.getElementById('site-select').selectedOptions[0]?.text || '',
        site_date:  document.getElementById('site-date').value,
        result_img: imgPath.replace('/result/', ''),
        detected:   counts
      })
    })
    .then(res => res.json())
    .then(resp => alert(resp.message))
    .catch(() => alert('저장 실패'));
  });
}

// 🖼️ 이미지 미리보기 후 폼 제출
function previewImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById('hidden-site-name').value =
    document.getElementById('site-select').selectedOptions[0]?.text || '';
  document.getElementById('hidden-site-date').value =
    document.getElementById('site-date').value || '';

  const reader = new FileReader();
  reader.onload = () => {
    const prev = document.getElementById('preview');
    prev.src = reader.result;
    prev.style.display = 'block';
    setTimeout(() => document.querySelector('form').submit(), 200);
  };
  reader.readAsDataURL(file);
}

// 👁️ 탐지 결과 렌더링
function showDetection() {
  const imgPath = window.resultImgPath;
  const data = window.detectedDetailed;
  console.log('[showDetection] 전체 데이터:', data);
  if (!imgPath || !Array.isArray(data)) {
    return console.log('[showDetection] 탐지 결과 없음');
  }
  updateStats(data);
  updateWasteChart(data);
  updateList(data);
  updateCarbonTable(data);

  document.getElementById('zoom-container').style.display = 'block';
  document.getElementById('placeholder').style.display = 'none';
}

// 📌 통계 숫자 영역 갱신
function updateStats(data) {
  console.log('[updateStats] data:', data);
  const total          = data.reduce((sum, v) => sum + (v.count || 0), 0);
  const hazardousCount = data.find(d => d.name === '석면')?.count || 0;
  const recyclableCount= data.filter(d => d.recyclable).reduce((sum, v) => sum + (v.count || 0), 0);
  const carbonEmission = data.reduce((sum, d) => sum + (d.carbon || 0), 0).toFixed(1);

  document.getElementById('totalObjects').innerText   = total;
  document.getElementById('hazardousCount').innerText = hazardousCount;
  document.getElementById('recyclableCount').innerText= recyclableCount;
  document.getElementById('carbonEmission').innerText = `${carbonEmission} kg`;
}

// 📊 막대그래프 갱신
function updateWasteChart(data) {
  console.log('[updateWasteChart] data:', data);
  wasteChart.data.labels = data.map(d => d.name || 'unknown');
  wasteChart.data.datasets[0].data = data.map(d => d.count || 0);
  wasteChart.update();
}

// 📋 탐지 객체 리스트 갱신
function updateList(data) {
  console.log('[updateList] data:', data);
  const ul = document.querySelector('.object-list'); ul.innerHTML = '';
  data.forEach((d, idx) => {
    console.log('[list item]', d.name, d);
    const li = document.createElement('li');
    li.innerHTML = `<span>${d.name || 'unknown'}</span><span>${d.count || 0}개</span>`;
    li.style.background = idx % 2 === 0 ? '#ffffcc' : '#ffff99';
    ul.appendChild(li);
  });
}

// 📈 탄소 테이블 갱신
function updateCarbonTable(data) {
  console.log('[updateCarbonTable] data:', data);
  const tbody = document.querySelector('#carbonTable tbody'); tbody.innerHTML = '';
  data.sort((a, b) => (b.count || 0) - (a.count || 0)).forEach((d, idx) => {
    console.log('[carbon row]', d.name, d.carbon);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center">${String(idx+1).padStart(2,'0')}</td>
      <td>${d.name || 'unknown'}</td>
      <td style="text-align:center">${d.count || 0}</td>
      <td style="text-align:center">${(d.carbon || 0).toFixed(1)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ✅ 페이지 로드 시 초기 실행
window.addEventListener('DOMContentLoaded', () => {
  initializeCharts();
  loadMonthlyStats(window.CURRENT_SITE_ID);
  bindCompanySite();
  bindPanzoom();
  showDetection();
  bindSave();
  document.getElementById('fileInput').addEventListener('change', previewImage);
});
