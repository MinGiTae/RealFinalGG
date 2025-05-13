window.addEventListener('DOMContentLoaded', () => {
  const companySelect = document.getElementById('company-select');
  const siteSelect    = document.getElementById('site-select');
  const selectedInfo  = document.getElementById('selected-info');
  const arrow         = document.getElementById('arrow');
  const manualList    = document.getElementById('manual-list');
  const resultTbody   = document.querySelector('#result-table tbody');
  const detailModal   = document.getElementById('detail-modal');
  const detailBody    = document.getElementById('detail-body');
  const modalClose    = document.querySelector('.modal-close');

  let latestReasons = [];

  // ① 회사 선택 → 현장 리스트
  companySelect.addEventListener('change', async () => {
    const companyName = companySelect.value;
    selectedInfo.textContent = `선택된 회사: ${companyName} / 현장: –`;

    try {
      const res = await fetch(`/createlift/search-site?keyword=${encodeURIComponent(companyName)}`);
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

  // ② 현장 선택 → 자동판정 요청
  siteSelect.addEventListener('change', async () => {
    const companyName = companySelect.value;
    const siteName    = siteSelect.value;
    selectedInfo.textContent = `선택된 회사: ${companyName} / 현장: ${siteName}`;

    resetVisuals();

    const params = new URLSearchParams({ company_name: companyName, site_name: siteName });
    try {
      const res  = await fetch('/createlift/select-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
      const data = await res.json();
      autoRunChecks(data.actual_results || []);
      latestReasons = data.reasons || [];
    } catch (err) {
      console.error('자동판정 실패', err);
    }
  });

  // 초기화
  function resetVisuals() {
    resultTbody.innerHTML = '';
    manualList.innerHTML  = '';
    document.querySelectorAll('.status-circle').forEach(el => {
      el.classList.remove('checked', 'unchecked');
    });
  }

  // 자동 체크 + 애니메이션 화살표
  function autoRunChecks(results) {
    const targets = Array.from(document.querySelectorAll('#iso-column .row .status-circle'));
    if (results.length !== targets.length) {
      alert(`판정 개수(${results.length})와 문항 수(${targets.length})가 일치하지 않습니다.`);
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
      curr.classList.add(results[idx] ? 'checked' : 'unchecked');

      const x = curr.offsetLeft + curr.offsetWidth + 10;
      const y = curr.offsetTop + curr.offsetHeight / 2;
      arrow.style.left = `${x}px`;
      arrow.style.top  = `${y}px`;

      idx++;
      setTimeout(step, 300);
    })();
  }

  // ③ 완료 버튼 → 결과 테이블 / 수동확인 목록
  document.getElementById('Button3').addEventListener('click', () => {
    resultTbody.innerHTML = '';
    manualList.innerHTML  = '';

    const circles = Array.from(document.querySelectorAll('#iso-column .row .status-circle'));
    circles.forEach((circle, i) => {
      const num      = i + 1;
      const row      = circle.closest('.row');
      const question = row.querySelector('.question').textContent.trim();
      const pass     = circle.classList.contains('checked');
      const reason   = pass ? '-' : (latestReasons[i] || '근거 없음');
      const now      = new Date().toLocaleString();

      // 테이블 행
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${num}</td>
        <td>${question}</td>
        <td>${pass ? '✅ 적합' : '❌ 부적합'}</td>
        <td>${reason}</td>
        <td>${now}</td>
        <td><button class="detail-btn" data-index="${i}">보기</button></td>
      `;
      resultTbody.appendChild(tr);

      // 부적합 항목은 수동확인 리스트에
      if (!pass) {
        const li = document.createElement('li');
        li.textContent = question;
        manualList.appendChild(li);
      }
    });
  });

  // 상세 보기 모달
  document.body.addEventListener('click', e => {
    if (e.target.classList.contains('detail-btn')) {
      const i = +e.target.dataset.index;
      const question = document.querySelectorAll('#iso-column .row .question')[i].textContent.trim();
      const reason   = latestReasons[i] || '근거 없음';
      detailBody.innerHTML = `<strong>${question}</strong><br>${reason}`;
      detailModal.style.display = 'block';
    }
  });
  document.querySelector('.modal-close').addEventListener('click', () => {
    detailModal.style.display = 'none';
  });
  window.addEventListener('click', e => {
    if (e.target === detailModal) {
      detailModal.style.display = 'none';
    }
  });

  // ④ 엑셀 다운로드
  document.getElementById('Button1').addEventListener('click', () => {
    const c = encodeURIComponent(companySelect.value);
    const s = encodeURIComponent(siteSelect.value);
    window.location = `/createlift/download-audit-excel?company_name=${c}&site_name=${s}`;
  });
});
