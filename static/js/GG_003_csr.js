// GG_003_csr.js (최종판)
// ----------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // 1) 지도 초기화
  const mapContainer = document.getElementById('map');
  const map = new kakao.maps.Map(mapContainer, {
    center: new kakao.maps.LatLng(36.348504088450035, 127.38215399734425),
    level: 3
  });
  const geocoder = new kakao.maps.services.Geocoder();
  setTimeout(() => {
    map.relayout();
    map.setCenter(new kakao.maps.LatLng(36.348504088450035, 127.38215399734425));
  }, 100);

  // 2) 폼 요소 참조
  const form            = document.getElementById('siteForm');
  const inputSiteId     = document.getElementById('site_id');
  const inputName       = document.getElementById('search-input1');
  const inputAddress    = document.getElementById('search-input2');
  const inputManager    = document.getElementById('search-input3');
  const inputCompany    = document.getElementById('companySelect');
  const inputDept       = document.getElementById('departmentSelect');
  const inputSurvey     = document.getElementById('survey_file');
  const inputImportance = document.getElementById('importanceLevel');
  const inputProcedure  = document.getElementById('procedure_file');
  const inputContractor = document.getElementById('contractor_notes');
  const inputStandard   = document.getElementById('standard_file');
  const inputMonitoring = document.getElementById('monitoring_data');
  const inputCalDate    = document.getElementById('calibration_date');
  const inputCalFile    = document.getElementById('calibration_file');
  const inputLatitude   = document.getElementById('latitude');
  const inputLongitude  = document.getElementById('longitude');

  // 3) 자동완성 검색 요소
  const inputSearch4 = document.getElementById('search-input4');
  const resultsBox  = document.getElementById('autocomplete-results');

  // 4) 마커 저장용
  const markers     = [];
  const infowindows = [];
  let tempMarker         = null;
  let selectedMarker     = null;
  let selectedInfowindow = null;
  let siteNames          = [];

  // 5) 마커 클릭 시 폼 채우기
  function openMarker(marker) {
    const data = markers.find(m => m.marker === marker);
    if (!data) return;

    // 이전 선택 마커 리셋
    if (selectedMarker) {
      selectedMarker.setImage(new kakao.maps.MarkerImage(
        '/static/img/hammer.png',
        new kakao.maps.Size(40,40)
      ));
      selectedInfowindow.close();
    }

    // 폼에 데이터 채우기
    inputSiteId.value     = data.siteId;
    inputName.value       = data.siteName;
    inputAddress.value    = data.address;
    inputManager.value    = data.managerName || '';
    inputCompany.value    = data.companyId;
    inputDept.value       = data.department || '';
    inputImportance.value = data.importance_level || '';
    inputContractor.value = data.contractor_notes  || '';
    inputCalDate.value    = data.calibration_date  || '';

    // 파일 input은 초기화하지 않음 (수정됨)
    [ inputSurvey, inputProcedure, inputStandard, inputMonitoring ]
      .forEach(el => el.value = '');

    const pos = marker.getPosition();
    inputLatitude.value   = pos.getLat();
    inputLongitude.value  = pos.getLng();

    // 새 마커 하이라이트
    selectedMarker     = marker;
    selectedInfowindow = infowindows[markers.indexOf(data)];
    selectedMarker.setImage(new kakao.maps.MarkerImage(
      '/static/img/hammer.png',
      new kakao.maps.Size(50,50)
    ));
    selectedInfowindow.open(map, marker);
  }

  // 6) DB 마커 불러오기
  fetch('/csr/get_sites')
    .then(res => res.json())
    .then(list => {
      list.forEach(site => {
        const coords      = new kakao.maps.LatLng(site.latitude, site.longitude);
        const markerImage = new kakao.maps.MarkerImage(
          '/static/img/hammer.png',
          new kakao.maps.Size(40,40)
        );
        const marker      = new kakao.maps.Marker({
          position: coords,
          map,
          image: markerImage
        });
        const iw = new kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">${site.site_name}</div>`
        });
        iw.open(map, marker);

        markers.push({
          marker,
          siteId          : site.site_id,
          siteName        : site.site_name,
          address         : site.address,
          managerName     : site.manager_name,
          companyId       : site.company_id,
          department      : site.department,
          importance_level: site.importance_level,
          contractor_notes: site.contractor_notes,
          calibration_date: site.calibration_date
        });
        infowindows.push(iw);
        siteNames.push(site.site_name);

        kakao.maps.event.addListener(marker, 'click', () => openMarker(marker));
      });
    });

  // 7) 지도 클릭 → 폼 리셋 및 임시 마커
  kakao.maps.event.addListener(map, 'click', e => {
    const pos = e.latLng;
    geocoder.coord2Address(pos.getLng(), pos.getLat(), (res, status) => {
      if (status === kakao.maps.services.Status.OK) {
        inputAddress.value = res[0].address.address_name;
      }
    });

    // 폼 초기화
    [ inputSiteId, inputName, inputManager,
      inputCompany, inputDept, inputImportance,
      inputContractor, inputCalDate ]
      .forEach(el => el.value = '');
    [ inputSurvey, inputProcedure,
      inputStandard, inputMonitoring,
      inputCalFile ]
      .forEach(el => el.value = '');

    inputLatitude.value  = pos.getLat();
    inputLongitude.value = pos.getLng();

    if (tempMarker) tempMarker.setMap(null);
    tempMarker = new kakao.maps.Marker({
      position: pos,
      map,
      opacity: 0.5,
      clickable: false
    });
  });

  // 8) 버튼별 핸들러 분리
  document.getElementById('ButtonUpdate').addEventListener('click', () => {
    if (!inputSiteId.value) {
      alert('수정할 현장을 선택하세요.');
      return;
    }
    const formData = new FormData(form);
    fetch('/csr/update_site', {
      method: 'POST',
      body: formData
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) location.reload();
      else alert('❌ 업데이트 실패: ' + res.error);
    });
  });

  document.getElementById('ButtonDelete').addEventListener('click', () => {
    if (!inputSiteId.value) {
      alert('삭제할 현장을 선택하세요.');
      return;
    }
    if (!confirm('정말 삭제하시겠습니까?')) return;
    fetch('/csr/delete_site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site_id: parseInt(inputSiteId.value) })
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) location.reload();
      else alert('❌ 삭제 실패: ' + res.error);
    });
  });

  // 9) 자동완성 및 이동
  inputSearch4.addEventListener('input', () => {
    const q = inputSearch4.value.trim().toLowerCase();
    if (!q) {
      resultsBox.style.display = 'none';
      return;
    }
    const filtered = siteNames.filter(name => name.toLowerCase().startsWith(q));
    if (filtered.length) {
      resultsBox.style.display = 'block';
      resultsBox.innerHTML = filtered
        .map(name => `<div class="autocomplete-item">${name}</div>`)
        .join('');
      document.querySelectorAll('.autocomplete-item').forEach(item =>
        item.addEventListener('click', () => {
          inputSearch4.value = item.textContent;
          resultsBox.style.display = 'none';
        })
      );
    } else {
      resultsBox.style.display = 'none';
    }
  });

  inputSearch4.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('Button5').click();
    }
  });

  document.getElementById('Button5').addEventListener('click', () => {
    const data = markers.find(m => m.siteName === inputSearch4.value.trim());
    if (data) map.setCenter(data.marker.getPosition());
    else alert('해당 현장을 찾을 수 없습니다.');
    resultsBox.style.display = 'none';
  });

  // 10) 회사 모달 열기
  document.getElementById('openCompanyModal').addEventListener('click', () => {
    document.getElementById('companyModal').style.display = 'block';
  });
});
