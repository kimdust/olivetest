$(document).ready(function () {
    $.ajax({
        url: 'https://oliva.boundary.team/api/main-banners',
        method: 'GET',
        success: function (banners) {
        let slides = '';

        banners.forEach(function (b) {
        let mediaTag = '';

        if (b.image_path) {
            mediaTag = `<img src="https://oliva.boundary.team/storage/${b.image_path}" alt="">`;
        } else if (b.video_path) {
            mediaTag = `<video src="https://oliva.boundary.team/storage/${b.video_path}" controls muted playsinline style="width:100%;"></video>`;
        }

        const getSafeLink = (link) => {
            if (!link) return null;
            if (link.startsWith('http://') || link.startsWith('https://')) {
            return link;
            }
            return 'https://' + link;
        };

        const safeLink = getSafeLink(b.link);

        const wrapper = safeLink
            ? `<a href="${safeLink}" target="_blank" rel="noopener noreferrer">${mediaTag}</a>`
            : mediaTag;

        slides += `
            <div class="swiper-slide main_hero_slide">
            ${wrapper}
            </div>`;
        });

        $('#mainBannerWrapper').html(slides);

        new Swiper('.main_hero_slider', {
            pagination: {
                el: ".swiper-pagination",
                type : 'fraction'
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            loop: true,
            autoHeight: true,
        });
        },
        error: function () {
        console.error('배너를 불러오지 못했습니다.');
        }
    });
});

var mainBannerSwiper = new Swiper(".main_banner_slider", {
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    loop: true,
    autoHeight: true,
});

const rangeInputvalue = document.querySelectorAll(".range-input input");
const priceInputvalue = document.querySelectorAll(".price-input input");
const rangevalue = document.querySelector(".slider .price-slider");

function saveSliderState() {
const min = rangeInputvalue[0].value;
const max = rangeInputvalue[1].value;
sessionStorage.setItem("slider-min", min);
sessionStorage.setItem("slider-max", max);
}

function formatCurrency(number) {
return Number(number).toLocaleString();
}

function updateFormattedPrices() {
const minInput = priceInputvalue[0];
const maxInput = priceInputvalue[1];
const minVal = parseInt(minInput.value);
const maxVal = parseInt(maxInput.value);
const maxLimit = parseInt(rangeInputvalue[1].max);

document.querySelectorAll(".formatted-price").forEach(el => el.remove());

const minSpan = document.createElement("p");
minSpan.className = "formatted-price";
minSpan.textContent = formatCurrency(minVal);
minInput.parentNode.appendChild(minSpan);

const maxSpan = document.createElement("p");
maxSpan.className = "formatted-price";
maxSpan.textContent = formatCurrency(maxVal) + (maxVal >= maxLimit ? "+" : "");
maxInput.parentNode.appendChild(maxSpan);
}

function restoreSliderState() {
const min = sessionStorage.getItem("slider-min");
const max = sessionStorage.getItem("slider-max");
if (min !== null && max !== null) {
    rangeInputvalue[0].value = min;
    rangeInputvalue[1].value = max;
    priceInputvalue[0].value = min;
    priceInputvalue[1].value = max;

    const maxRange = rangeInputvalue[0].max;
    rangevalue.style.left = `${(min / maxRange) * 100}%`;
    rangevalue.style.width = `${((max - min) / maxRange) * 100}%`;

    updateFormattedPrices();
}
}

window.addEventListener("beforeunload", saveSliderState);
window.addEventListener("pageshow", function () {
restoreSliderState();
});

let priceGap = 10000;

for (let i = 0; i < priceInputvalue.length; i++) {
priceInputvalue[i].addEventListener("input", e => {
    let minp = parseInt(priceInputvalue[0].value);
    let maxp = parseInt(priceInputvalue[1].value);
    let diff = maxp - minp;

    if (minp < 0) {
    alert("minimum price cannot be less than 0");
    priceInputvalue[0].value = 0;
    minp = 0;
    }

    if (maxp > 10000) {
    alert("maximum price cannot be greater than 10000");
    priceInputvalue[1].value = 10000;
    maxp = 10000;
    }

    if (minp > maxp - priceGap) {
    priceInputvalue[0].value = maxp - priceGap;
    minp = maxp - priceGap;
    if (minp < 0) {
        priceInputvalue[0].value = 0;
        minp = 0;
    }
    }

    if (diff >= priceGap && maxp <= rangeInputvalue[1].max) {
    if (e.target.className === "min-input") {
        rangeInputvalue[0].value = minp;
        let value1 = rangeInputvalue[0].max;
        rangevalue.style.left = `${(minp / value1) * 100}%`;
    } else {
        rangeInputvalue[1].value = maxp;
        let value2 = rangeInputvalue[1].max;
        rangevalue.style.right = `${100 - (maxp / value2) * 100}%`;
    }
    }

    updateFormattedPrices();
});
}

for (let i = 0; i < rangeInputvalue.length; i++) {
rangeInputvalue[i].addEventListener("input", e => {
    let minVal = parseInt(rangeInputvalue[0].value);
    let maxVal = parseInt(rangeInputvalue[1].value);
    let diff = maxVal - minVal;

    if (diff < priceGap) {
    if (e.target.className === "min-range") {
        rangeInputvalue[0].value = maxVal - priceGap;
    } else {
        rangeInputvalue[1].value = minVal + priceGap;
    }
    } else {
    priceInputvalue[0].value = minVal;
    priceInputvalue[1].value = maxVal;
    rangevalue.style.left = `${((minVal / rangeInputvalue[0].max) * 99 + 0.6)}%`;
    rangevalue.style.width = `${((maxVal - minVal) / rangeInputvalue[1].max) * 100}%`;
    }

    updateFormattedPrices();
});
}

document.addEventListener("DOMContentLoaded", () => {
    const fruitRange = document.getElementById("fruit-range");
    const fruitLevelDisplay = document.getElementById("fruit-level");
    if (fruitRange && fruitLevelDisplay) {
    function saveFruitLevel() {
        sessionStorage.setItem("fruit-level", fruitRange.value);
    }
    function restoreFruitLevel() {
        const saved = sessionStorage.getItem("fruit-level");
        fruitRange.value = saved ?? fruitRange.value;
        fruitLevelDisplay.textContent = fruitRange.value;
    }
    fruitRange.addEventListener("input", () => {
        fruitLevelDisplay.textContent = fruitRange.value;
        saveFruitLevel();
    });
    restoreFruitLevel();
    }

    const spiceRange = document.getElementById("spice-range");
    const spiceLevelDisplay = document.getElementById("spice-level");
    if (spiceRange && spiceLevelDisplay) {
    function saveSpiceLevel() {
        sessionStorage.setItem("spice-level", spiceRange.value);
    }
    function restoreSpiceLevel() {
        const saved = sessionStorage.getItem("spice-level");
        spiceRange.value = saved ?? spiceRange.value;
        spiceLevelDisplay.textContent = spiceRange.value;
    }
    spiceRange.addEventListener("input", () => {
        spiceLevelDisplay.textContent = spiceRange.value;
        saveSpiceLevel();
    });
    restoreSpiceLevel();
    }
});