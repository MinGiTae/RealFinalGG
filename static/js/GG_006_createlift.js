window.addEventListener('DOMContentLoaded', () => {
  const companySelect = document.getElementById('company-select');
  const siteSelect = document.getElementById('site-select');
  const selectedInfo = document.getElementById('selected-info');
  const arrow = document.getElementById('arrow');
  const manualList = document.getElementById('manual-list');
  const resultTbody = document.querySelector('#result-table tbody');
  const detailModal = document.getElementById('detail-modal');
  const detailBody = document.getElementById('detail-body');
  const modalClose = document.querySelector('.modal-close');

  let selectedSiteName = null;
  let latestReasons = [];

  // 회사 선택 → 현장 리스트 로드
  companySelect.addEventListener('change', async () => {
    const companyName = companySelect.value;
    selectedInfo.textContent = `선택된 회사: ${companyName} / 현장: –`;

    try {
      const res = await fetch(`/search-site?keyword=${encodeURIComponent(companyName)}`);
      const data = await res.json();

      siteSelect.innerHTML = `<option disabled selected>현장을 선택하세요</option>`;
      data.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.site_name;
        opt.textContent = o.site_name;
        siteSelect.appendChild(opt);
      });
      siteSelect.disabled = false;
    } catch (err) {
      console.error('현장 리스트 불러오기 실패', err);
    }
  });

  // 현장 선택 → 자동판정 요청
  siteSelect.addEventListener('change', async () => {
    selectedSiteName = siteSelect.value;
    const companyName = companySelect.value;
    selectedInfo.textContent = `선택된 회사: ${companyName} / 현장: ${selectedSiteName}`;

    resetVisuals();

    const body = new URLSearchParams();
    body.set('company_name', companyName);
    body.set('site_name', selectedSiteName);

    try {
      const res = await fetch('/select-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      const data = await res.json();

      const results = data.actual_results || [];
      latestReasons = data.reasons || [];

      autoRunChecks(results);
    } catch (err) {
      console.error('자동판정 실패', err);
    }
  });

  // 초기화
  function resetVisuals() {
    resultTbody.innerHTML = '';
    manualList.innerHTML = '';
    document.querySelectorAll('.status-circle').forEach(el => {
      el.classList.remove('checked', 'unchecked');
    });
  }

  // 판정 결과 체크 + 화살표
  function autoRunChecks(results) {
    const targets = Array.from(document.querySelectorAll('#iso-column .row .status-circle'));

    if (results.length !== targets.length) {
      alert(`서버 판정 결과(${results.length}개)가 문항 수(${targets.length}개)와 일치하지 않습니다.`);
      return;
    }

    arrow.style.display = 'block';
    let idx = 0;

    (function step() {
      if (idx >= targets.length) {
        arrow.style.display = 'none';
        return;
      }

      const curr = targets[idx];
      const pass = !!results[idx];
      curr.classList.add(pass ? 'checked' : 'unchecked');

      const offsetX = curr.offsetLeft + curr.offsetWidth + 10;
      const offsetY = curr.offsetTop + curr.offsetHeight / 2;
      arrow.style.left = `${offsetX}px`;
      arrow.style.top = `${offsetY}px`;

      idx++;
      setTimeout(step, 300);
    })();
  }

  // 결과 테이블 및 수동확인 목록 작성
  document.getElementById('Button3').addEventListener('click', () => {
    resultTbody.innerHTML = '';
    manualList.innerHTML = '';

    const targets = Array.from(document.querySelectorAll('#iso-column .row .status-circle'));

    targets.forEach((circle, i) => {
      const num = i + 1;
      const row = circle.closest('.row');
      const question = row.querySelector('.question').textContent.trim();
      const pass = circle.classList.contains('checked');
      const reason = latestReasons[i] || '판단 근거 없음';
      const now = new Date().toLocaleString();

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${num}</td>
        <td>${question}</td>
        <td>${pass ? '✅ 적합' : '❌ 부적합'}</td>
        <td>${pass ? '-' : reason}</td>
        <td>${now}</td>
        <td><button class="detail-btn" data-index="${i}">보기</button></td>
      `;
      resultTbody.appendChild(tr);

      if (!pass) {
        const li = document.createElement('li');
        li.textContent = question;
        manualList.appendChild(li);
      }
    });
  });

  // 상세 근거 모달
  document.body.addEventListener('click', e => {
    if (e.target.classList.contains('detail-btn')) {
      const idx = parseInt(e.target.dataset.index, 10);
      const questionElem = document.querySelectorAll('#iso-column .row .question')[idx];
      const question = questionElem.textContent.trim();
      const reason = latestReasons[idx] || '판단 근거 없음';

      detailBody.innerHTML = `<strong>${question}</strong><br>${reason}`;
      detailModal.style.display = 'block';
    }
  });

  modalClose.addEventListener('click', () => {
    detailModal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === detailModal) {
      detailModal.style.display = 'none';
    }
  });

  // 엑셀 다운로드
  document.getElementById('Button1').addEventListener('click', () => {
    const company = encodeURIComponent(companySelect.value);
    const site = encodeURIComponent(siteSelect.value);
    window.location = `/download-audit-excel?company_name=${company}&site_name=${site}`;
  });
});
