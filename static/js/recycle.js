// =========================
// 1. 데이터 및 설정
// =========================

// 기본 weight 데이터
window.data = { weight: 0 };

// 단위별 순환골재 사용량 (kg)
const ROAD_KG_PER_M        = 1200;   // 도로 1m
const RA_PER_FLOOR         = 19620;  // 아파트 골조 1층
const SIDEWALK_KG_PER_M2   = 132;    // 보도블록 1㎡
const BARRIER_KG_PER_UNIT  = 50;     // 에코블록 1개
const CEMENT_KG_PER_M3     = 900;    // 시멘트 1m³
const LANDFILL_KG_PER_UNIT = 2000;   // 매립 1회

// 사용처 리스트 (아이콘, 탄소 절감량 포함)
const uses = [
  { key:'road',     label:'도로 건설',         perUnit: ROAD_KG_PER_M,        carbonPerUnit:100, icon:'🛣️' },
  { key:'building', label:'아파트 골조',       perUnit: RA_PER_FLOOR,         carbonPerUnit:200, icon:'🏢' },
  { key:'sidewalk', label:'보도블록 설치',      perUnit: SIDEWALK_KG_PER_M2,   carbonPerUnit:15,  icon:'🚶‍♂️' },
  { key:'barrier',  label:'에코블록 설치',      perUnit: BARRIER_KG_PER_UNIT,  carbonPerUnit:25,  icon:'🧱' },
  { key:'cement',   label:'시멘트 제조',        perUnit: CEMENT_KG_PER_M3,     carbonPerUnit:120, icon:'🏭' },
  { key:'landfill', label:'매립 충전',         perUnit: LANDFILL_KG_PER_UNIT, carbonPerUnit:50,  icon:'🗑️' }
];


// =========================
// 2. 캔버스 및 UI 요소 연결
// =========================
const animCanvas   = document.getElementById('animationCanvas');
const ctx          = animCanvas.getContext('2d');
const treeCanvas   = document.getElementById('treeCanvas');
const tctx         = treeCanvas.getContext('2d');
const treeWrapper  = document.querySelector('.tree-wrapper');
const weightBtns   = document.querySelectorAll('#weightButtons button');


// =========================
// 3. 캔버스 리사이즈 처리
// =========================
function resizeCanvas() {
  animCanvas.width  = animCanvas.clientWidth;
  animCanvas.height = Math.floor(animCanvas.clientWidth * 0.4);
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  init(); // 초기화 실행
});


// =========================
// 4. 초기화 (초기 값 세팅)
// =========================
function init() {
  document.getElementById('totalWeight').innerText = `${data.weight.toFixed(2)} kg`;
  document.getElementById('totalCount').innerText = `0.00 개`;
  document.getElementById('progressBar').style.width = '0%';

  // 무게 버튼 이벤트 설정
  weightBtns.forEach(btn => {
    btn.onclick = () => {
      data.weight = +btn.dataset.weight;
      reset(); // 새로 초기화
    };
  });

  loadSuggestions(); // 추천 활동 로드
  treeWrapper.style.height = '0px';
  treeWrapper.style.overflow = 'hidden';
}

// 리셋 함수 (화면 초기화)
function reset() {
  document.getElementById('totalWeight').innerText = `${data.weight.toFixed(2)} kg`;
  document.getElementById('totalCount').innerText = `0.00 개`;
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('resultInfo').innerHTML = '';
  ctx.clearRect(0,0,animCanvas.width,animCanvas.height);
  tctx.clearRect(0,0,treeCanvas.width,treeCanvas.height);
  treeWrapper.style.height = '0px';
  treeWrapper.style.overflow = 'hidden';
}

// 추천 활동 카드 만들기
function loadSuggestions() {
  const container = document.getElementById('suggestions');
  container.innerHTML = '';
  uses.forEach(use => {
    const d = document.createElement('div');
    d.className = 'suggestion';
    d.innerHTML = `
      <div class="icon">${use.icon}</div>
      <h4>${use.label}</h4>
      <p>필요 중량: ${use.perUnit.toLocaleString()} kg</p>
      <button>시작</button>
    `;
    d.querySelector('button').onclick = () => startUse(use);
    container.appendChild(d);
  });
}

// 버튼 활성/비활성 토글
function setButtonsDisabled(v) {
  weightBtns.forEach(b => b.disabled = v);
  document.querySelectorAll('.suggestion button').forEach(b => b.disabled = v);
}


// =========================
// 5. 사용처별 애니메이션 시작
// =========================
function startUse(use) {
  setButtonsDisabled(true);
  ctx.clearRect(0,0,animCanvas.width,animCanvas.height);
  tctx.clearRect(0,0,treeCanvas.width,treeCanvas.height);
  document.getElementById('resultInfo').innerHTML = '';

  // 사용량 계산
  const raw = data.weight / use.perUnit;
  let count, display, unit;
  switch(use.key) {
    case 'road':
      count = raw;
      display = count < 1000 ? `${count.toFixed(2)} m` : `${(count/1000).toFixed(2)} km`;
      unit = 'm';
      break;
    case 'building':
      count = raw;
      display = `${count.toFixed(2)} 층`;
      unit = '층';
      break;
    case 'sidewalk':
      count = Math.floor(raw);
      display = `${count.toFixed(2)} m²`;
      unit = 'm²';
      break;
    case 'barrier':
      count = Math.floor(raw);
      display = `${count.toFixed(2)} 개`;
      unit = '개';
      break;
    case 'cement':
      count = raw;
      display = `${count.toFixed(2)} m³`;
      unit = 'm³';
      break;
    case 'landfill':
      count = Math.floor(raw);
      display = `${count.toFixed(2)} 회`;
      unit = '회';
      break;
  }

  document.getElementById('totalCount').innerText = display;
  document.getElementById('progressBar').style.width = `${Math.min(raw,1)*100}%`;

  // 각 활동별 애니메이션 실행
  switch(use.key) {
    case 'road':     animateRoad(count);     break;
    case 'building': animateBuilding(count); break;
    case 'sidewalk': animateSidewalk(count); break;
    case 'barrier':  animateBarrier(count);  break;
    case 'cement':   animateCement(count);   break;
    case 'landfill': animateLandfill(count); break;
  }
}


// =========================
// 6. 결과 표시 (탄소 절감, 나무 환산)
// =========================
function showResult(label, count) {
  const use = uses.find(u => u.label === label);
  const carbon = (count * use.carbonPerUnit).toFixed(2);
  const trees  = Math.round(carbon / 21); // 1그루가 21kg CO₂ 절감 기준

  document.getElementById('resultInfo').innerHTML = `
    <p>${label}: <strong>${count.toFixed(2)}</strong></p>
    <p>절감된 탄소량: <strong>${carbon} kg CO₂</strong></p>
    <p>나무 환산: <strong>${trees} 그루</strong></p>
  `;

  // 나무 그리기
  const size = 40, pad = 20;
  const cols = Math.max(1, Math.floor(treeCanvas.clientWidth / size));
  const rows = Math.ceil(trees / cols);
  const h    = rows * size + pad * 2;

  treeCanvas.width  = treeCanvas.clientWidth;
  treeCanvas.height = h;
  treeWrapper.style.height = `${h}px`;
  treeWrapper.style.overflow = 'visible';

  tctx.clearRect(0,0,treeCanvas.width,treeCanvas.height);
  tctx.font = `${size}px serif`;
  tctx.fillStyle = '#76c7c0';
  for (let i = 0; i < trees; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    tctx.fillText('🌳', c * size + 5, pad + r * size + size);
  }

  setButtonsDisabled(false);
}

// =========================
// 7. 활동별 애니메이션 함수
// =========================

// 7.1 도로 건설 애니메이션 (자동차가 도로를 달리며 진행)
function animateRoad(count) {
  let f = 0, o = 0;
  const total = Math.ceil((animCanvas.width + 60) / 4) * count; // 총 이동 거리
  const baseH = Math.min(data.weight / 10000, 1) * animCanvas.height * 0.2; // 도로 높이 비율
  const clouds = [
    { x: -60, y: animCanvas.height * 0.2 },
    { x: animCanvas.width * 0.4, y: animCanvas.height * 0.15 },
    { x: animCanvas.width * 0.8, y: animCanvas.height * 0.25 }
  ];
  const laneY = animCanvas.height - baseH - 20; // 차선 위치

  function draw() {
    ctx.clearRect(0,0,animCanvas.width,animCanvas.height);

    // 배경 (하늘색 + 구름)
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, animCanvas.width, animCanvas.height);

    clouds.forEach(c => {
      c.x += 0.5;
      if (c.x > animCanvas.width + 20) c.x = -60;
      ctx.font = '30px serif';
      ctx.fillText('☁️', c.x, c.y);
    });

    // 도로 (회색 사각형)
    ctx.fillStyle = '#555';
    ctx.fillRect(0, animCanvas.height - baseH, animCanvas.width, baseH);

    // 차선 (점선)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 3;
    ctx.setLineDash([30,15]);
    ctx.lineDashOffset = -o;
    ctx.beginPath();
    ctx.moveTo(0, laneY);
    ctx.lineTo(animCanvas.width, laneY);
    ctx.stroke();
    o = (o + 3) % 45; // 차선 움직이는 효과

    // 자동차
    const carX = (f * 4) % animCanvas.width;
    ctx.font = '30px serif';
    ctx.fillText('🚗', carX, laneY - 8);

    f++;
    f < total ? requestAnimationFrame(draw) : showResult('도로 건설', count);
  }
  draw();
}

// 7.2 아파트 골조 애니메이션 (건물이 위로 올라감)
function animateBuilding(count) {
  const w = animCanvas.width * 0.5;
  const h = animCanvas.height * 0.6;
  const x = (animCanvas.width - w) / 2;
  let y = animCanvas.height;           // 시작점은 화면 맨 아래
  const ty = animCanvas.height - h;     // 목표 y 좌표 (완성된 위치)

  function rise() {
    ctx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    // 배경
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, animCanvas.width, animCanvas.height);

    // 건물 올라오기
    y = Math.max(ty, y - 4);
    ctx.fillStyle = '#6b8e23'; // 건물 색
    ctx.fillRect(x, y, w, animCanvas.height - y);

    if (y > ty) {
      requestAnimationFrame(rise);
    } else {
      drawWindows(); // 다 올라오면 창문 그리기
    }
  }

  function drawWindows() {
    const rows = 5, cols = 4;
    const winW = w / cols * 0.6, winH = h / rows * 0.2;
    ctx.fillStyle = '#edf2f4';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = x + c * (w / cols) + (w / cols - winW) / 2;
        const wy = ty + r * (h / rows) + (h / rows - winH) / 2;
        ctx.fillRect(wx, wy, winW, winH);
      }
    }
    showResult('아파트 골조', count);
  }

  rise();
}

// 7.3 보도블록 설치 애니메이션 (타일이 위로 올라옴)
function animateSidewalk(count) {
  const cols = Math.floor(animCanvas.width / 48);
  const tiles = Array.from({ length: count }, (_, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    return { x: c * 48, y: animCanvas.height + 48, ty: animCanvas.height * 0.75 + r * 48 };
  });
  let idx = 0;

  function riseNext() {
    if (idx < tiles.length) {
      const t = tiles[idx];
      function rise() {
        ctx.clearRect(0, 0, animCanvas.width, animCanvas.height);
        tiles.slice(0, idx + 1).forEach(tt => {
          tt.y = Math.max(tt.ty, tt.y - 8);
          ctx.fillStyle = '#888';
          ctx.fillRect(tt.x, tt.y, 46, 46);
        });
        if (t.y > t.ty) requestAnimationFrame(rise);
        else {
          idx++;
          setTimeout(riseNext, 50);
        }
      }
      rise();
    } else {
      showResult('보도블록 설치', count);
    }
  }

  riseNext();
}

// 7.4 에코블록 설치 애니메이션 (벽돌이 떨어짐)
function animateBarrier(count) {
  const cols = Math.floor(animCanvas.width / 40);
  const blocks = Array.from({ length: count }, (_, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    return { x: c * 40, y: -40, ty: animCanvas.height - 40 - r * 40 };
  });
  let idx = 0;

  function dropNext() {
    if (idx < blocks.length) {
      const b = blocks[idx];
      function fall() {
        ctx.clearRect(0, 0, animCanvas.width, animCanvas.height);
        blocks.slice(0, idx + 1).forEach(bb => {
          bb.y = Math.min(bb.ty, bb.y + 12);
          ctx.font = '36px serif';
          ctx.fillText('🧱', bb.x + 2, bb.y + 36);
        });
        if (b.y < b.ty) requestAnimationFrame(fall);
        else {
          idx++;
          setTimeout(dropNext, 30);
        }
      }
      fall();
    } else {
      showResult('에코블록 설치', count);
    }
  }

  dropNext();
}

// 7.5 시멘트 제조 애니메이션 (시멘트가 채워짐)
function animateCement(count) {
  const total = 60;
  const stepY = (animCanvas.height * 0.8) / total;
  let i = 0;

  function fill() {
    ctx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    // 배경
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, animCanvas.width, animCanvas.height);

    // 시멘트 채우기
    const w = animCanvas.width * 0.2;
    const x = (animCanvas.width - w) / 2;
    const y0 = animCanvas.height * 0.1;
    const h = i * stepY;

    ctx.fillStyle = '#7f7f7f';
    ctx.fillRect(x, y0 + animCanvas.height * 0.8 - h, w, h);

    // 시멘트 틀
    ctx.strokeStyle = '#e0e0e0';
    ctx.strokeRect(x, y0, w, animCanvas.height * 0.8);

    i++;
    if (i <= total) setTimeout(fill, 50);
    else showResult('시멘트 제조', count);
  }

  fill();
}

// 7.6 매립 충전 애니메이션 (트럭과 흙 채우기)
function animateLandfill(count) {
  const pitX = animCanvas.width * 0.2;
  const pitW = animCanvas.width * 0.6;
  const pitY = animCanvas.height * 0.75;
  const soilH = (animCanvas.height - pitY) / count;

  let soil = 0;
  let truckX = animCanvas.width;
  const targetX = pitX + pitW / 2;

  function moveTruck() {
    ctx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    // 매립 구덩이
    ctx.fillStyle = '#333';
    ctx.fillRect(pitX, pitY, pitW, animCanvas.height - pitY);

    // 채워진 흙
    ctx.fillStyle = '#654321';
    ctx.fillRect(pitX, pitY + (count - soil) * soilH, pitW, soil * soilH);

    // 트럭 이동
    truckX = Math.max(targetX, truckX - 4);
    ctx.font = '40px serif';
    ctx.fillText('🚚', truckX, pitY - 10);

    if (truckX > targetX) requestAnimationFrame(moveTruck);
    else dropSoil();
  }

  function dropSoil() {
    if (soil < count) {
      let dropY = pitY - 10;
      function fall() {
        ctx.clearRect(0, 0, animCanvas.width, animCanvas.height);

        ctx.fillStyle = '#333';
        ctx.fillRect(pitX, pitY, pitW, animCanvas.height - pitY);

        ctx.fillStyle = '#654321';
        ctx.fillRect(pitX, pitY + (count - soil) * soilH, pitW, soil * soilH);

        ctx.font = '40px serif';
        ctx.fillText('🚚', targetX, pitY - 10);

        // 흙 떨어지는 점
        ctx.fillStyle = '#553311';
        ctx.beginPath();
        ctx.arc(targetX + 20, dropY, 6, 0, 2 * Math.PI);
        ctx.fill();
        dropY += 8;

        if (dropY < pitY + (count - soil) * soilH) {
          requestAnimationFrame(fall);
        } else {
          soil++;
          setTimeout(dropSoil, 100);
        }
      }
      fall();
    } else {
      showResult('매립 충전', count);
    }
  }

  moveTruck();
}
