// GG_006_createlift.js

// 모든 로직을 DOMContentLoaded 이후에 실행하도록 래핑
window.addEventListener('DOMContentLoaded', () => {

  // 요소 참조
  const companySelect     = document.getElementById('company-select');
  const siteSelect        = document.getElementById('site-select');
  const selectForm        = document.getElementById('select-form');
  const hiddenCompany     = document.getElementById('company-name-input');
  const hiddenSite        = document.getElementById('site-name-input');
  const selectedInfo      = document.getElementById('selected-info');
  let selectedCompanyName = null;
  let selectedSiteName    = null;

  // 회사 선택 → 현장 목록 요청
  companySelect.addEventListener('change', () => {
    selectedCompanyName = companySelect.value;
    hiddenCompany.value = selectedCompanyName;
    selectedInfo.textContent = `선택된 회사: ${selectedCompanyName}`;

    fetch(`/search-site?keyword=${encodeURIComponent(selectedCompanyName)}`)
      .then(res => res.json())
      .then(data => {
        siteSelect.innerHTML = `<option disabled selected>현장을 선택하세요</option>`;
        data.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.site_name;
          opt.textContent = item.site_name;
          siteSelect.appendChild(opt);
        });
        siteSelect.disabled = false;
      })
      .catch(err => console.error('Error fetching sites:', err));
  });

  // 현장 선택 → 자동 검사 시작
  siteSelect.addEventListener('change', () => {
    selectedSiteName = siteSelect.value;
    hiddenSite.value = selectedSiteName;
    selectedInfo.textContent = `선택된 회사: ${selectedCompanyName} / 현장: ${selectedSiteName}`;

    // 초기화
    const tbody = document.querySelector('#result-table tbody');
    if (tbody) tbody.innerHTML = '';
    document.querySelectorAll('.status-circle.arrow-target')
      .forEach(el => el.classList.remove('checked', 'unchecked'));

    index = 0;
    moveArrowAndToggle();
  });

  // 팝업 토글
  const popupBtn = document.getElementById('popup-btn');
  const popup    = document.getElementById('popup');
  if (popupBtn && popup) {
    popupBtn.addEventListener('click', () => {
      popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    });
  }

  // 화살표 이동 & 체크
  let index = 0;
  function moveArrowAndToggle() {
    const targets = document.querySelectorAll('.status-circle.arrow-target');
    const arrow   = document.getElementById('arrow');
    if (!arrow || !targets.length) return;

    const curr = targets[index];
    const row  = curr.closest('.row');
    const rect = row.getBoundingClientRect();
    const sy   = window.scrollY, sx = window.scrollX;

    arrow.style.left    = `${rect.left + sx - 40}px`;
    arrow.style.top     = `${rect.top + sy + rect.height/2 - 20}px`;
    arrow.style.display = 'block';

    //>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?>?
    setTimeout(() => {
      const pass = Math.random() > 0;
      curr.classList.toggle('checked', pass);
      curr.classList.toggle('unchecked', !pass);
      index++;
      if (index < targets.length) {
        setTimeout(() => {
          const next    = targets[index];
          const nr      = next.closest('.row').getBoundingClientRect();
          const leftCol = document.querySelector('.table-container .table-column:first-child');
          const isLeft  = next.closest('.table-column') === leftCol;

          arrow.style.left = isLeft
            ? `${nr.right + sx + 10}px`
            : `${nr.left  + sx - 40}px`;
          arrow.style.top = `${nr.top + sy + nr.height/2 - 20}px`;

          moveArrowAndToggle();
        }, 100);
      }
    }, 300);
  }

  // 완료 버튼 → 결과표 생성
  const tbody   = document.querySelector('#result-table tbody');
  const reasons = {
    1: { title: '조직은 자사의 환경 방침 수립', reason: '공식 문서 미존재' },
    2: { title: '환경 측면 식별', reason: '영향 요소 평가 누락' }
    // 나머지 기준 매핑...
  };
  document.getElementById('Button3')?.addEventListener('click', () => {
    if (!tbody) return;
    tbody.innerHTML = '';
    document.querySelectorAll('.status-circle.arrow-target').forEach((c,i) => {
      const num  = i+1;
      const pass = c.classList.contains('checked');
      const d    = reasons[num] || { title: `기준 ${num}`, reason: '설명 없음' };
      const tr   = document.createElement('tr');
      tr.innerHTML = `
        <td>${num}</td>
        <td>${d.title}</td>
        <td>${pass?'✅ 적합':'❌ 부적합'}</td>
        <td>${pass?'-':d.reason}</td>
        <td>${new Date().toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
    document.getElementById('arrow').style.display = 'none';
  });

  // PDF 저장 (원래 방식으로 복귀)
  document.getElementById('Button2')?.addEventListener('click', () => {
    if (!selectedSiteName) {
      alert('현장을 선택 후 시도해주세요');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    const rows = document.getElementById('result-table').rows;
    for (let r of rows) {
      [...r.cells].forEach((c,i) => doc.text(c.innerText, 10 + i*40, y));
      y += 10;
    }
    const fn = `${selectedSiteName.replace(/\s/g,'_')}.pdf`;
    doc.save(fn);
  });

  // Excel 저장 (원래 방식으로)
  document.getElementById('Button1')?.addEventListener('click', () => {
    const ws = XLSX.utils.table_to_sheet(document.getElementById('result-table'));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '결과표');
    const filename = `${selectedSiteName.replace(/\s/g,'_')}.xlsx`;
    XLSX.writeFile(wb, filename);
  });
});
