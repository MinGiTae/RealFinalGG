const character = document.getElementById('character');

window.addEventListener('mousemove', (e) => {
  character.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

const text = document.getElementById('scrollText1');
const logo2 = document.getElementById('logo2');
const text2 = document.getElementById('scrollText2');
const text3 = document.getElementById('scrollText3');
const scrollText = document.getElementById('scrollText4');
const scrollText2 = document.getElementById('scrollText5');
const scrollText3 = document.getElementById('scrollText6');



window.addEventListener('scroll', () => {
const scrollY = window.scrollY;

text.style.transform = `translate(calc(-50% - ${scrollY}px), -50%)`;
text.style.opacity = `${1 - scrollY / 500}`;

logo2.style.transform = `translate(calc(-50% - ${scrollY}px), -50%)`;
logo2.style.opacity = `${1 - scrollY / 500}`;

text2.style.transform = `translate(calc(-50% - ${scrollY}px), -50%)`;
text2.style.opacity = `${1 - scrollY / 500}`;

text3.style.transform = `translate(calc(-50% - ${scrollY}px), -50%)`;
text3.style.opacity = `${1 - scrollY / 500}`;
});








window.addEventListener('scroll', function () {
const scrollY = window.scrollY;
const windowHeight = window.innerHeight;
const triggerPoint = 500; // 텍스트가 등장할 지점 (적절히 조절)

if (scrollY > triggerPoint) {
  scrollText.style.transform = 'translateX(0)';
  scrollText.style.opacity = '1';
} else {
  scrollText.style.transform = 'translateX(-100%)';
  scrollText.style.opacity = '0';
}

if (scrollY > triggerPoint) {
  scrollText2.style.transform = 'translateX(0)';
  scrollText2.style.opacity = '1';
} else {
  scrollText2.style.transform = 'translateX(-100%)';
  scrollText2.style.opacity = '0';
}

if (scrollY > triggerPoint) {
  scrollText3.style.transform = 'translateX(0)';
  scrollText3.style.opacity = '1';
} else {
  scrollText3.style.transform = 'translateX(-100%)';
  scrollText3.style.opacity = '0';
}
});












const scrollText7 = document.getElementById('scrollText7');
const rawHTML = scrollText7.innerHTML;
const plainText = rawHTML.replace(/<br\s*\/?>/gi, '\n');

let isVisible = false;

function animateText() {
  scrollText7.innerHTML = '';
  scrollText7.style.visibility = 'visible';

  let i = 0;

  function addChar() {
    if (i >= plainText.length) return;

    const char = plainText[i];

    if (char === '\n') {
      scrollText7.appendChild(document.createElement('br'));
      i++;
      // 줄바꿈은 바로 다음 문자로 넘어감 (딜레이 없음)
      addChar();
    } else {
      const span = document.createElement('span');
      span.className = 'fade-in-char';
      span.textContent = char;
      scrollText7.appendChild(span);
      i++;
      setTimeout(addChar, 20); // 다음 문자 20ms 후 추가
    }
  }

  addChar();
}

function hideText() {
  scrollText7.style.visibility = 'hidden';
  scrollText7.innerHTML = '';
}

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 500 && !isVisible) {
    isVisible = true;
    animateText();
  } else if (scrollY <= 500 && isVisible) {
    isVisible = false;
    hideText();
  }
});








window.addEventListener('scroll', function() {
  const scrollImage2 = document.getElementById('scrollImage2');
  const scrollThreshold = 950; // 원하는 위치(px)

  if (window.scrollY > scrollThreshold) {
    scrollImage2.style.opacity = 1;
  } else {
    scrollImage2.style.opacity = 0;
  }
});

















const scrollThreshold = 1600;



window.addEventListener('scroll', function () {
  const scrollbutton1 = document.getElementById('Button3');
  if (window.scrollY > scrollThreshold) {
    scrollbutton1.style.opacity = '1';
    scrollbutton1.style.pointerEvents = 'auto';
    scrollbutton1.style.display = 'block';
  } else {
    scrollbutton1.style.opacity = '0';
    scrollbutton1.style.pointerEvents = 'none';
    scrollbutton1.style.display = 'none';
  }
});

window.addEventListener('scroll', function () {
  const scrollbutton2 = document.getElementById('Button4');
  if (window.scrollY > scrollThreshold) {
    scrollbutton2.style.opacity = '1';
    scrollbutton2.style.pointerEvents = 'auto';
    scrollbutton2.style.display = 'block';
  } else {
    scrollbutton2.style.opacity = '0';
    scrollbutton2.style.pointerEvents = 'none';
    scrollbutton2.style.display = 'none';
  }
});




window.addEventListener('scroll', function () {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    const button1 = document.getElementById('Button1');
    const button2 = document.getElementById('Button2');

    if (scrollY >= 950) {
      button1.style.opacity = '0';
      button1.style.pointerEvents = 'none';

      button2.style.opacity = '0';
      button2.style.pointerEvents = 'none';
    } else {
      button1.style.opacity = '1';
      button1.style.pointerEvents = 'auto';

      button2.style.opacity = '1';
      button2.style.pointerEvents = 'auto';
    }
});








window.addEventListener('DOMContentLoaded', () => {
  const images = [];
  const totalImages = 5;
  const startDelay = 500;
  const delayStep = 500;
  const triggerOffset = 1500;

  let hasAnimated = false;
  let isAnimating = false;

  // 이미지 요소들을 배열에 담기
  for (let i = 1; i <= totalImages; i++) {
    const id = i === 1 ? 'AnimationImage' : `AnimationImage${i}`;
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      images.push(el);
    }
  }

  function triggerAnimation() {
    const shouldShow = window.scrollY >= triggerOffset;

    if (shouldShow && !hasAnimated && !isAnimating) {
      isAnimating = true;

      images.forEach((img, index) => {
        setTimeout(() => {
          img.classList.remove('hidden');
          img.classList.add('show');
          if (index === images.length - 1) {
            hasAnimated = true;
            isAnimating = false;
          }
        }, startDelay + index * delayStep);
      });

    } else if (!shouldShow && hasAnimated && !isAnimating) {
      // 한 번에 사라지게끔 수정
      images.forEach((img) => {
        img.classList.remove('show');
        img.classList.add('hidden');
      });
      hasAnimated = false;
      isAnimating = false;
    }
  }

  window.addEventListener('scroll', triggerAnimation);
});













const images = [
  document.getElementById('AnimationImage6'),
  document.getElementById('AnimationImage7'),
  document.getElementById('AnimationImage8'),
  document.getElementById('AnimationImage9')
];

let hasAnimated = false;
let isAnimating = false;

window.addEventListener('scroll', function () {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (scrollPosition > 1500 && !hasAnimated && !isAnimating) {
    isAnimating = true;

    setTimeout(() => {
      images.forEach((img, index) => {
        setTimeout(() => {
          img.classList.add('show');
          if (index === images.length - 1) {
            hasAnimated = true;
            isAnimating = false;
          }
        }, index * 150);
      });
    }, 3000); // 전체 등장 딜레이
  }

  // 위로 올라가면 다시 숨기되, 애니메이션은 다시 실행되지 않게
  if (scrollPosition <= 1500 && hasAnimated) {
    images.forEach((img) => img.classList.remove('show'));
    hasAnimated = false; // 원하면 true로 유지해서 재실행 막을 수 있음
  }
});