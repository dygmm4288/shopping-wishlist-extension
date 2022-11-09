const ITEM = 'ITEM';
const BRAND_ACTIVE = 'active';
const BrandWrapper = selector('.brand-wrapper');
const WishlistCardContainer = selector('.wishlist-card-container');

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
            const imgs = item.imgURL.map((src) => {
                const img = ce('img');
                const imgLi = ce('li');
                img.src = src;
                img.alt = item.brand.name + 'image';
                appendChild(imgLi, img);
                return imgLi;
            });

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

            /* appendChild */
            appendChild(infoContainer, [priceSpan, removeButton]);

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
    chrome.storage.local.get(ITEM, (value) => {
        if (chrome.runtime.lastError) {
            console.error(chorme.runtime.lastError);
            return;
        }
        if (brand !== 'All') {
            setCardPage(value[ITEM], (item) => item.brand === brand);
        } else {
            setCardPage(value[ITEM], identity);
        }
    });
};
(() => {
    InitPage();
})();
