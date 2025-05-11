window.addEventListener('DOMContentLoaded', () => {
  const companySelect = document.getElementById('company-select');
  const siteSelect = document.getElementById('site-select');
  const hiddenCompany = document.getElementById('company-name-input');
  const hiddenSite = document.getElementById('site-name-input');
  const selectedInfo = document.getElementById('selected-info');
  const arrow = document.getElementById('arrow');
  const manualList = document.getElementById('manual-list');
  const resultTbody = document.querySelector('#result-table tbody');
  const detailModal = document.getElementById('detail-modal');
  const detailBody = document.getElementById('detail-body');
  const modalClose = document.querySelector('.modal-close');
  let selectedSiteName = null;
  let reasons = [];

  // 회사 선택 → 현장 목록 로드
  companySelect.addEventListener('change', () => {
    hiddenCompany.value = companySelect.value;
    selectedInfo.textContent = `선택된 회사: ${companySelect.value}`;
    fetch(`/search-site?keyword=${encodeURIComponent(companySelect.value)}`)
      .then(res => res.json())
      .then(data => {
        siteSelect.innerHTML = `<option disabled selected>현장을 선택하세요</option>`;
        data.forEach(o => {
          const opt = document.createElement('option');
          opt.value = o.site_name;
          opt.textContent = o.site_name;
          siteSelect.appendChild(opt);
        });
        siteSelect.disabled = false;
      })
      .catch(console.error);
  });

  // 현장 선택 → 자동 분석 요청
  siteSelect.addEventListener('change', () => {
    selectedSiteName = siteSelect.value;
    hiddenSite.value = selectedSiteName;
    selectedInfo.textContent = `선택된 회사: ${companySelect.value} / 현장: ${selectedSiteName}`;

    resultTbody.innerHTML = '';
    manualList.innerHTML = '';
    document.querySelectorAll('.status-circle').forEach(el => {
      el.classList.remove('checked', 'unchecked');
    });

    const body = new URLSearchParams();
    body.set('company_name', hiddenCompany.value);
    body.set('site_name', hiddenSite.value);

    fetch('/select-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })
      .then(res => res.json())
      .then(data => {
        const results = Array.isArray(data.actual_results) ? data.actual_results : [];
        reasons = Array.isArray(data.reasons) ? data.reasons : [];
        autoRunChecks(results);
      })
      .catch(console.error);
  });

  // 자동 체크 및 화살표 애니메이션
  function autoRunChecks(results) {
    const targets = Array.from(document.querySelectorAll('#iso-column .status-circle.arrow-target'));

    if (results.length !== targets.length) {
      alert(`⚠️ 서버 판정 결과(${results.length}개)가 문항 수(${targets.length}개)와 일치하지 않습니다.`);
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
      const offsetY = curr.offsetTop + (curr.offsetHeight / 2);

      arrow.style.left = `${offsetX}px`;
      arrow.style.top = `${offsetY}px`;

      idx++;
      setTimeout(step, 300);
    })();
  }

  // 완료 버튼 → 결과 테이블 및 수동 확인 리스트 작성
  document.getElementById('Button3').addEventListener('click', () => {
    resultTbody.innerHTML = '';
    manualList.innerHTML = '';

    const targets = Array.from(document.querySelectorAll('#iso-column .status-circle.arrow-target'));

    targets.forEach((c, i) => {
      const num = i + 1;
      const question = c.closest('.row').querySelector('.question').textContent.trim();
      const pass = c.classList.contains('checked');
      const reason = reasons[i] || '-';
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

  // 상세 판단 근거 모달
  document.body.addEventListener('click', e => {
    if (e.target.classList.contains('detail-btn')) {
      const idx = parseInt(e.target.dataset.index, 10);
      const question = document.querySelectorAll('#iso-column .row .question')[idx].textContent.trim();
      const reasonDetail = reasons[idx] || '해당 항목의 상세 근거가 없습니다.';

      detailBody.textContent = `【 ${idx + 1} 】 ${question}\n\n상세 판단 근거: ${reasonDetail}`;
      detailModal.style.display = 'block';
    }
  });

  modalClose.addEventListener('click', () => detailModal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === detailModal) detailModal.style.display = 'none';
  });

  // EXCEL 다운로드
  document.getElementById('Button1').addEventListener('click', () => {
    const company = encodeURIComponent(hiddenCompany.value);
    const site = encodeURIComponent(hiddenSite.value);
    window.location = `/download-audit-excel?company_name=${company}&site_name=${site}`;
  });
});
