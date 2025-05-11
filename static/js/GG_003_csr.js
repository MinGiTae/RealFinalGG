// GG_003_csr.js
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

  // 2) 입력 폼 요소
  const inputSiteId    = document.getElementById('site_id');
  const inputName      = document.getElementById('search-input1');
  const inputAddress   = document.getElementById('search-input2');
  const inputManager   = document.getElementById('search-input3');
  const inputLatitude  = document.getElementById('latitude');
  const inputLongitude = document.getElementById('longitude');

  // 3) 자동완성 & 검색 요소
  const inputSearch4 = document.getElementById('search-input4');
  const resultsBox  = document.getElementById('autocomplete-results');

  // 4) 마커 저장용
  const markers     = [];
  const infowindows = [];
  let selectedMarker     = null;
  let selectedInfowindow = null;
  let tempMarker         = null;
  let siteNames          = [];

  // 5) 마커 클릭 시 폼 채우기
  function openMarker(marker) {
    const data = markers.find(m => m.marker === marker);
    if (!data) return;

    inputSiteId.value    = data.siteId;
    inputName.value      = data.siteName;
    inputAddress.value   = data.address;
    inputManager.value   = data.managerName || '';
    const pos = marker.getPosition();
    inputLatitude.value  = pos.getLat();
    inputLongitude.value = pos.getLng();

    if (selectedMarker) {
      selectedMarker.setImage(
        new kakao.maps.MarkerImage('/static/img/hammer.png', new kakao.maps.Size(40, 40))
      );
      selectedInfowindow.close();
    }
    selectedMarker = marker;
    selectedInfowindow = infowindows[markers.indexOf(data)];
    selectedMarker.setImage(
      new kakao.maps.MarkerImage('/static/img/hammer.png', new kakao.maps.Size(50, 50))
    );
    selectedInfowindow.open(map, marker);
  }

  // 6) DB에서 저장된 마커 불러오기
  fetch('/csr/get_sites')
    .then(res => res.json())
    .then(list => {
      list.forEach(site => {
        const coords = new kakao.maps.LatLng(site.latitude, site.longitude);
        const markerImage = new kakao.maps.MarkerImage('/static/img/hammer.png', new kakao.maps.Size(40, 40));
        const marker = new kakao.maps.Marker({ position: coords, map, image: markerImage });
        const iw = new kakao.maps.InfoWindow({
          content: `<div style=\"width:150px;text-align:center;padding:6px 0;\">${site.site_name}</div>`
        });
        iw.open(map, marker);

        markers.push({
          marker,
          siteId:      site.site_id,
          siteName:    site.site_name,
          address:     site.address,
          managerName: site.manager_name
        });
        infowindows.push(iw);
        siteNames.push(site.site_name);

        kakao.maps.event.addListener(marker, 'click', () => openMarker(marker));
      });
    });

  // 7) 지도 클릭 → 임시 마커, 주소/좌표 채우기
  kakao.maps.event.addListener(map, 'click', e => {
    const pos = e.latLng;
    geocoder.coord2Address(pos.getLng(), pos.getLat(), (res, status) => {
      if (status === kakao.maps.services.Status.OK) {
        inputAddress.value = res[0].address.address_name;
      }
    });

    inputSiteId.value    = '';
    inputName.value      = '';
    inputManager.value   = '';
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

  // 8) 현장 정보 수정
  const btnUpdate = document.getElementById('ButtonUpdate');
  if (btnUpdate) btnUpdate.addEventListener('click', () => {
    const siteId      = parseInt(inputSiteId.value);
    const siteName    = inputName.value.trim();
    const address     = inputAddress.value.trim();
    const managerName = inputManager.value.trim();
    if (!siteId || !siteName || !address || !managerName) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    fetch('/csr/update_site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site_id: siteId, site_name: siteName, address, manager_name: managerName })
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert("✅ 현장 정보가 업데이트되었습니다.");
        location.reload();
      } else {
        alert("❌ 업데이트 실패: " + res.error);
      }
    });
  });

  // 9) 현장 삭제
  const btnDelete = document.getElementById('ButtonDelete');
  if (btnDelete) btnDelete.addEventListener('click', () => {
    const siteId = parseInt(inputSiteId.value);
    if (!siteId) {
      alert("삭제할 현장을 선택하세요.");
      return;
    }

    fetch('/csr/delete_site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site_id: siteId })
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert("✅ 현장이 삭제되었습니다.");
        location.reload();
      } else {
        alert("❌ 삭제 실패: " + res.error);
      }
    });
  });

  // 10) 현장명 자동완성 및 이동
  if (inputSearch4 && resultsBox) {
    inputSearch4.addEventListener('input', () => {
      const q = inputSearch4.value.trim().toLowerCase();
      if (!q) {
        resultsBox.style.display = 'none';
        return;
      }
      const filtered = siteNames.filter(name => name.toLowerCase().startsWith(q));
      if (filtered.length) {
        resultsBox.style.display = 'block';
        resultsBox.innerHTML = filtered.map(name => `<div class=\"autocomplete-item\">${name}</div>`).join('');
        document.querySelectorAll('.autocomplete-item').forEach(item => item.addEventListener('click', () => {
          inputSearch4.value = item.textContent;
          resultsBox.style.display = 'none';
        }));
      } else {
        resultsBox.style.display = 'none';
      }
    });
    inputSearch4.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const data = markers.find(m => m.siteName === inputSearch4.value.trim());
        if (data) map.setCenter(data.marker.getPosition());
        resultsBox.style.display = 'none';
      }
    });
    const btnSearch = document.getElementById('Button5');
    if (btnSearch) btnSearch.addEventListener('click', () => {
      const data = markers.find(m => m.siteName === inputSearch4.value.trim());
      if (data) {
        map.setCenter(data.marker.getPosition());
        if (selectedMarker) {
          selectedMarker.setImage(
            new kakao.maps.MarkerImage('/static/img/hammer.png', new kakao.maps.Size(40,40))
          );
          selectedInfowindow.close();
        }
        openMarker(data.marker);
      } else {
        alert("해당 현장을 찾을 수 없습니다.");
      }
      resultsBox.style.display = 'none';
    });
  }

  // 11) 회사 모달 오픈
  const companyModal = document.getElementById('companyModal');
  const btnOpenCompany = document.getElementById('openCompanyModal');
  if (btnOpenCompany && companyModal) {
    btnOpenCompany.addEventListener('click', () => {
      companyModal.style.display = 'block';
    });
  }

  // 12) 회사 삭제
  const btnDelCompany = document.getElementById('deleteCompany');
  if (btnDelCompany) btnDelCompany.addEventListener('click', () => {
    const sel = document.getElementById('companySelect');
    const opt = sel.options[sel.selectedIndex];
    if (!opt) return;
    if (!confirm(`회사 "${opt.textContent}"을(를) 삭제하시겠습니까?`)) return;
    fetch('/csr/delete_company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_id: parseInt(opt.value) })
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert("✅ 회사가 삭제되었습니다.");
        location.reload();
      } else {
        alert("❌ 삭제 실패: " + res.error);
      }
    });
  });

  // 13) 패널 접기/펼치기 애니메이션
  const panel = document.getElementById('controlPanel');
  const toggleBtn = panel.querySelector('.toggle-button');
  if (toggleBtn) toggleBtn.addEventListener('click', () => panel.classList.toggle('collapsed'));

  // 14) 플래시 메시지 숨김
  setTimeout(() => {
    const flash = document.querySelector('.flash-message-wrapper');
    if (flash) flash.style.display = 'none';
  }, 3000);
});
