const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');

burgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');

let currentSlide = 0;
let autoSlideInterval;

slides.forEach((_, index) => {
    const button = document.createElement('button');
    button.classList.add('indicator');

    if (index === 0) {
        button.classList.add('active');
    }

    button.addEventListener('click', () => {
        showSlide(index);
        restartAutoSlide();
    });

    indicatorsContainer.appendChild(button);
});

const indicators = document.querySelectorAll('.indicator');

function showSlide(index) {
    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    indicators.forEach(indicator => indicator.classList.remove('active'));
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

nextBtn.addEventListener('click', () => {
    nextSlide();
    restartAutoSlide();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    restartAutoSlide();
});

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3000);
}

function restartAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

startAutoSlide();

const loadDataBtn = document.getElementById('loadDataBtn');
const ajaxResult = document.getElementById('ajaxResult');

loadDataBtn.addEventListener('click', () => {
    fetch('data/info.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Помилка завантаження JSON');
            }

            return response.json();
        })
        .then(data => {
            ajaxResult.innerHTML = '';

            data.items.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('info-card');

                card.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                `;

                ajaxResult.appendChild(card);
            });
        })
        .catch(error => {
            ajaxResult.innerHTML = `<p>${error.message}</p>`;
        });
});
