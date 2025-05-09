const character = document.getElementById('character');

window.addEventListener('mousemove', (e) => {
  character.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});



function readExcel() {
  const fileInput = document.getElementById('excelFile');
  const file = fileInput.files[0];
  if (!file) {
    alert('엑셀 파일을 선택해주세요!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // 예: [ ['자재명', '수량', '단위'], ['철근', 50, 'ton'], ['시멘트', 20, 'bag'] ]
    const materialBoxes = document.querySelectorAll('#Material-box');

    json.slice(1).forEach((row, index) => {
      if (materialBoxes[index]) {
        const inputs = materialBoxes[index].querySelectorAll('input');
        inputs[0].value = row[0] || '';
        inputs[1].value = row[1] || '';
        inputs[2].value = row[2] || '';
      }
    });
  };

  reader.readAsArrayBuffer(file);
}