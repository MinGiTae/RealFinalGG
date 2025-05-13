// static/js/GG_003_csr.js
// 최종판: Flash 메시지, 파일 링크 표시 체크, 날짜/좌표/파일 필드 완전 처리

document.addEventListener('DOMContentLoaded', () => {
  // 플래시 메시지 헬퍼
  function showFlash(type, message) {
    let wrapper = document.querySelector('.flash-message-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'flash-message-wrapper';
      document.body.appendChild(wrapper);
    }
    const msg = document.createElement('div');
    msg.className = `flash-message ${type}`;
    msg.textContent = message;
    wrapper.appendChild(msg);
    setTimeout(() => {
      msg.remove();
      if (!wrapper.hasChildNodes()) wrapper.remove();
    }, 3000);
  }

  // 1) 지도 및 지오코더 초기화
  const map = new kakao.maps.Map(
    document.getElementById('map'),
    { center: new kakao.maps.LatLng(36.348504088450035, 127.38215399734425), level: 3 }
  );
  const geocoder = new kakao.maps.services.Geocoder();
  setTimeout(() => {
    map.relayout();
    map.setCenter(new kakao.maps.LatLng(36.348504088450035, 127.38215399734425));
  }, 100);

  // 2) 폼 필드 참조
  const form = document.getElementById('siteForm');
  const fields = {
    siteId:     document.getElementById('site_id'),
    name:       document.getElementById('search-input1'),
    address:    document.getElementById('search-input2'),
    manager:    document.getElementById('search-input3'),
    company:    document.getElementById('companySelect'),
    department: document.getElementById('departmentSelect'),
    importance: document.getElementById('importanceLevel'),
    notes:      document.getElementById('contractor_notes'),
    calDate:    document.getElementById('calibration_date'),
    lat:        document.getElementById('latitude'),
    lng:        document.getElementById('longitude')
  };

  // 3) 파일 입력 필드 & 링크 텍스트박스 생성
  const fileFields = {
    survey_file:     { input: document.getElementById('survey_file'),      pathKey: 'survey_file_path' },
    procedure_file:  { input: document.getElementById('procedure_file'),    pathKey: 'procedure_file_path' },
    standard_file:   { input: document.getElementById('standard_file'),     pathKey: 'standard_file_path' },
    monitoring_data: { input: document.getElementById('monitoring_data'),   pathKey: 'monitoring_data_path' },
    calibration_file:{ input: document.getElementById('calibration_file'),  pathKey: 'calibration_file_path' }
  };

  // 링크용 텍스트박스 추가
  Object.values(fileFields).forEach(field => {
    const link = document.createElement('input');
    link.type = 'text';
    link.readOnly = true;
    link.className = 'file-link-text';
    link.style.display = 'none';
    link.style.cursor = 'pointer';
    field.input.after(link);
    field.link = link;
    link.addEventListener('click', () => {
      const url = link.dataset.url;
      if (url) window.open(url, '_blank');
    });
  });

  // 4) 자동완성 요소
  const searchInput = document.getElementById('search-input4');
  const resultsBox  = document.getElementById('autocomplete-results');

  // 5) 마커 데이터 저장
  const markers     = [];
  const infowindows = [];
  let tempMarker, selectedMarker, selectedInfowindow;
  const siteNames  = [];

  // 6) 마커 클릭 핸들러: 폼 및 링크 채우기
  function openMarker(marker) {
    const data = markers.find(m => m.marker === marker);
    if (!data) return;

    // 이전 선택 리셋
    if (selectedMarker) {
      selectedMarker.setImage(new kakao.maps.MarkerImage(
        '/static/img/hammer.png', new kakao.maps.Size(40,40)
      ));
      selectedInfowindow.close();
    }

    // 폼 데이터 채우기
    fields.siteId.value     = data.site_id;
    fields.name.value       = data.site_name;
    fields.address.value    = data.address;
    fields.manager.value    = data.manager_name    || '';
    fields.company.value    = data.company_id;
    fields.department.value = data.department      || '';
    fields.importance.value = data.importance_level|| '';
    fields.notes.value      = data.contractor_notes|| '';
    fields.calDate.value    = data.calibration_date|| '';

    // 파일 링크 표시/숨김
    Object.values(fileFields).forEach(({ pathKey, link }) => {
      const url = data[pathKey] || '';
      if (url) {
        link.value = url.split('/').pop();
        link.dataset.url = url;
        link.style.display   = 'inline-block';
      } else {
        link.value = '';
        link.dataset.url = '';
        link.style.display   = 'none';
      }
    });

    // 좌표 업데이트
    const pos = marker.getPosition();
    fields.lat.value = pos.getLat();
    fields.lng.value = pos.getLng();

    // 선택 마커 강조 & 인포윈도우
    selectedMarker     = marker;
    selectedMarker.setImage(new kakao.maps.MarkerImage(
      '/static/img/hammer.png', new kakao.maps.Size(50,50)
    ));
    selectedInfowindow = infowindows[markers.indexOf(data)];
    selectedInfowindow.open(map, marker);
  }

  // 7) 서버에서 마커 데이터 로드 & 중앙 정렬된 인포윈도우
  fetch('/csr/get_sites')
    .then(res => res.json())
    .then(list => {
      list.forEach(site => {
        const coords    = new kakao.maps.LatLng(site.latitude, site.longitude);
        const markerImg = new kakao.maps.MarkerImage('/static/img/hammer.png', new kakao.maps.Size(40,40));
        const marker    = new kakao.maps.Marker({ position: coords, map, image: markerImg });
        // 중앙 정렬(padding 포함)
        const iw = new kakao.maps.InfoWindow({
          content: `<div style="width:150px; text-align:center; padding:6px 0;">${site.site_name}</div>`
        });
        iw.open(map, marker);

        markers.push({ marker, ...site });
        infowindows.push(iw);
        siteNames.push(site.site_name);

        kakao.maps.event.addListener(marker, 'click', () => openMarker(marker));
      });
    });

  // 8) 지도 클릭 → 폼 초기화 + 임시 마커
  kakao.maps.event.addListener(map, 'click', e => {
    const pos = e.latLng;
    geocoder.coord2Address(pos.getLng(), pos.getLat(), (res, status) => {
      if (status === kakao.maps.services.Status.OK) {
        fields.address.value = res[0].address.address_name;
      }
    });

    // 폼 초기화
    Object.values(fields).forEach(f => { if (['INPUT','SELECT','TEXTAREA'].includes(f.tagName)) f.value=''; });
    Object.values(fileFields).forEach(({ link }) => link.style.display='none');

    fields.lat.value = pos.getLat();
    fields.lng.value = pos.getLng();

    if (tempMarker) tempMarker.setMap(null);
    tempMarker = new kakao.maps.Marker({ position: pos, map, opacity:0.5, clickable:false });
  });

  // 9) CRUD 버튼 핸들러
  document.getElementById('ButtonUpdate').addEventListener('click', () => {
    if (!fields.siteId.value) return showFlash('error', '수정할 현장을 선택하세요.');
    const fd = new FormData(form);
    fetch('/csr/update_site', { method: 'POST', body: fd })
      .then(r => r.json())
      .then(res => {
        if (res.success) { showFlash('success', '업데이트 성공'); setTimeout(() => location.reload(), 1000); }
        else showFlash('error', `업데이트 실패: ${res.error}`);
      });
  });

  document.getElementById('ButtonDelete').addEventListener('click', () => {
    if (!fields.siteId.value) return showFlash('error', '삭제할 현장을 선택하세요.');
    if (!confirm('정말 삭제하시겠습니까?')) return;
    fetch('/csr/delete_site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site_id: parseInt(fields.siteId.value) })
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) { showFlash('success', '삭제 성공'); setTimeout(() => location.reload(), 1000); }
        else showFlash('error', `삭제 실패: ${res.error}`);
      });
  });

  // 10) 자동완성 & 이동
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { resultsBox.style.display='none'; return; }
    const filtered = siteNames.filter(n => n.toLowerCase().startsWith(q));
    if (filtered.length) {
      resultsBox.style.display='block';
      resultsBox.innerHTML = filtered.map(n => `<div class="autocomplete-item">${n}</div>`).join('');
      document.querySelectorAll('.autocomplete-item').forEach(item =>
        item.addEventListener('click', () => { searchInput.value=item.textContent; resultsBox.style.display='none'; })
      );
    } else resultsBox.style.display='none';
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key==='Enter') { e.preventDefault(); document.getElementById('Button5').click(); }
  });

  document.getElementById('Button5').addEventListener('click', () => {
    const found = markers.find(m => m.siteName === searchInput.value.trim());
    if (found) map.setCenter(found.marker.getPosition());
    else showFlash('error', '해당 현장을 찾을 수 없습니다.');
    resultsBox.style.display='none';
  });

  // 11) 회사 모달 열기
  document.getElementById('openCompanyModal').addEventListener('click', () => {
    document.getElementById('companyModal').style.display='block';
  });
});
