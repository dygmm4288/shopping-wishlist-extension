const ITEM = 'ITEM';
const HIDDEN = 'hidden';
const GUGUSURL = 'https://www.gugus.co.kr/shopping/goodsview.asp?num=';
const BRAND_ACTIVE = 'active';
const BrandWrapper = selector('.brand-wrapper');
const WishlistCardContainer = selector('.wishlist-card-container');
const SearchBarForm = selector('form.search-bar');
const Overlay = selector('.overlay');
const SliderWrapper = selector('.slider-wrapper');
const SliderContainer = selector('.slider-container');
const SliderPrev = selector('.prev');
const SldierNext = selector('.next');
let Items;

const setBrandPage = (items) => {
    const brands = Array('All', ...new Set(items.map((i) => i.brand)));

    let selectedBrand = 'All';
    selectorAll('brand-item').forEach((elem) => {
        if (elem.classList.has(BRAND_ACTIVE)) {
            selectedBrand = elem.innerText;
        }
    });

    const brandElement = brands.map((brand) => {
        const li = createElement('li');
        const span = createElement('span');
        li.classList.add('brand-item');
        if (brand === selectedBrand) {
            li.classList.add(BRAND_ACTIVE);
        } else {
            li.classList.remove(BRAND_ACTIVE);
        }

        span.innerText = brand;
        appendChild(li, span);

        /* event */
        li.addEventListener('click', handleBrand(brand));

        return li;
    });

    BrandWrapper.innerHTML = '';
    appendChild(BrandWrapper, brandElement);
};
const setCardPage = (items, predi) => {
    const Cards = items
        .filter((item) => predi(item))
        .map((item) => {
            const ce = createElement;
            const Card = ce('li');
            const imgUl = ce('ul');
            const imgs = item.imgURL.map((src, i) => {
                const img = ce('img');
                const imgLi = ce('li');
                img.src = src;
                img.alt = item.brand.name + 'image';
                appendChild(imgLi, img);
                img.addEventListener('click', setSlider(item, i));
                return imgLi;
            });

            const DetailLink = ce('a');
            DetailLink.href = GUGUSURL + item.id;
            DetailLink.innerText = 'Detail';

            appendChild(imgUl, imgs);

            const priceSpan = ce('span');

            const infoContainer = ce('div');
            const nameSpan = ce('span');
            const removeButton = ce('button');

            priceSpan.innerText = item.price;
            nameSpan.innerText = item.name;

            /* Event */
            removeButton.innerText = 'Remove';
            removeButton.addEventListener('click', handleRemove(item.id));
            /* Class */
            nameSpan.classList.add('card-name');
            priceSpan.classList.add('card-price');
            infoContainer.classList.add('card-info');
            removeButton.classList.add('button');
            DetailLink.classList.add('card-detail');
            DetailLink.classList.add('button');

            /* appendChild */
            appendChild(infoContainer, [priceSpan, DetailLink, removeButton]);

            appendChild(Card, [nameSpan, imgUl, infoContainer]);
            return Card;
        });
    WishlistCardContainer.innerHTML = '';
    appendChild(WishlistCardContainer, Cards);
};
const InitPage = () => {
    chrome.storage.local.get(ITEM, (value) => {
        if (chrome.runtime.lastError) {
            console.error(chorme.runtime.lastError);
            return;
        }
        setBrandPage(value[ITEM]);
        setCardPage(value[ITEM], identity);
    });
};
const handleRemove = (id) => () => {
    chrome.storage.local.get(ITEM, (value) => {
        if (chrome.runtime.lastError) {
            console.error(chorme.runtime.lastError);
            return;
        }
        const removedItems = value[ITEM].filter((item) => item.id !== id);

        chrome.storage.local.set({ [ITEM]: removedItems }, () => {
            if (chrome.runtime.lastError) {
                console.error(chorme.runtime.lastError);
                return;
            }
            console.log(`Stored data ${ITEM} : `);
            console.log({ [ITEM]: removedItems });
            setBrandPage(removedItems);
            setCardPage(removedItems, identity);
        });
    });
};
const handleBrand = (brand) => () => {
    selectorAll('.brand-item').forEach((elem) => {
        elem.classList.remove(BRAND_ACTIVE);
        if (elem.innerText === brand) {
            elem.classList.add(BRAND_ACTIVE);
        }
    });
    const inputValue = selector('#search-bar-input').value;
    chrome.storage.local.get(ITEM, (value) => {
        if (chrome.runtime.lastError) {
            console.error(chorme.runtime.lastError);
            return;
        }

        setCardPage(
            log(
                value[ITEM].filter((item) =>
                    brand !== 'All' ? item.brand === brand : identity,
                ),
            ),
            (item) =>
                inputValue !== '' ? item.name.includes(inputValue) : identity,
        );
    });
};
const handleSearch = (e) => {
    if (!Items) {
        chrome.storage.local.get(ITEM, (value) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }
            Items = value[ITEM];
        });
        return;
    }

    const inputValue = e.target.value;
    const selectedBrand = getSelectedBrand();
    if (!inputValue) {
        setCardPage(Items, (item) =>
            selectedBrand !== 'All' ? item.brand === selectedBrand : identity,
        );
        return;
    }

    setCardPage(
        Items.filter((item) =>
            selectedBrand === 'All' ? identity : item.brand === selectedBrand,
        ),
        (item) => item.name.includes(inputValue),
    );
};
/* Sldier */
const setSlider = (item, index) => () => {
    const ce = createElement;

    const SLIDER_ITEM = 'slider-item';
    const indexElement = selector('.cur-index');
    indexElement.innerText = index;
    const liArray = [];
    item.imgURL.forEach((url, i) => {
        const img = ce('img');
        const li = ce('li');
        img.src = url;
        img.alt = item.name + i + 'img';
        li.style.opacity = '0';
        appendChild(li, img);
        li.classList.add(SLIDER_ITEM);
        liArray.push(li);
    });
    SliderContainer.innerHTML = '';
    appendChild(SliderContainer, liArray);
    handleOverlay();

    const firstImg = liArray[index].querySelector('img');
    const width = firstImg.clientWidth;
    const height = firstImg.clientHeight;

    liArray[index].style.opacity = '1';
    SliderWrapper.style.width = `${width}px`;
    SliderWrapper.style.height = `${height}px`;
    var viewportHeight = window.innerHeight;
    var elementHeight = SliderWrapper.offsetHeight;
    var scrollTop = window.scrollY;
    var topPosition = Math.max(
        0,
        scrollTop + (viewportHeight - elementHeight) / 2,
    );

    SliderWrapper.style.top = topPosition + 'px';
};
const moveSlide = (index) => {
    const item = selectorAll('.slider-container li')[index];
    const img = item.querySelector('img');
    const width = img.offsetWidth;
    const height = img.offsetHeight;

    SliderContainer.style.width = `${width}px`;
    SliderContainer.style.height = `${height}px`;

    item.style.opacity = '1';
    selectorAll('.slider-container li').forEach((elem, i) => {
        if (i !== index) {
            elem.style.opacity = '0';
        }
    });
};

const handleSlider = (dir) => () => {
    const indexElement = selector('.cur-index');
    const curIndex = parseInt(indexElement.innerText);
    const size = selectorAll('.slider-container .slider-item').length;
    // left
    if (dir === 0) {
        const nextIndex = (curIndex - 1 + size) % size;
        moveSlide(nextIndex);
        indexElement.innerText = nextIndex;
    } else {
        // right
        const nextIndex = (curIndex + 1) % size;
        moveSlide(nextIndex);
        indexElement.innerText = nextIndex;
    }
};
const handleOverlay = () => {
    Overlay.classList.toggle(HIDDEN);
    SliderWrapper.classList.toggle(HIDDEN);
    Overlay.style.height = `${document.body.clientHeight}px`;
};

const getSelectedBrand = () => {
    return log(Array.prototype.slice.call(selectorAll('.brand-item'))).reduce(
        (c, elem) => {
            if (elem.classList.contains(BRAND_ACTIVE)) c = elem.innerText;
            return c;
        },
        'All',
    );
};
(() => {
    InitPage();
    const SearchInput = SearchBarForm.querySelector('input');
    SearchBarForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });
    SearchInput.addEventListener('keyup', handleSearch);
    const PrevControl = selector('.slider-wrapper .prev');
    const NextControl = selector('.slider-wrapper .next');

    PrevControl.addEventListener('click', handleSlider(0));
    NextControl.addEventListener('click', handleSlider(1));
    Overlay.addEventListener('click', handleOverlay);
})();
