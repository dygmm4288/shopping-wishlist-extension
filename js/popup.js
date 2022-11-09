const ITEM = 'ITEM';
const BrandWrapper = selector('.brand-wrapper');
const WishlistCardContainer = selector('.wishlist-card-container');

const setBrandPage = (items) => {
    const brands = Array(...new Set(items.map((i) => i.brand)));
    const brandElement = brands.map((brand) => {
        const li = createElement('li');
        const span = createElement('span');
        li.classList.add('brand-item');
        span.innerText = brand;

        appendChild(li, span);

        return li;
    });

    BrandWrapper.innerHTML = '';
    appendChild(BrandWrapper, brandElement);
};
const setCardPage = (items) => {
    const Cards = items.map((item) => {
        const ce = createElement;
        const Card = ce('li');
        const brandSpan = ce('span');
        const idSpan = ce('span');
        const imgUl = ce('ul');
        const imgLi = ce('li');
        const imgs = item.imgURL.map((src) => {
            const img = ce('img');
            img.src = src;
            img.alt = item.brand.name + 'image';
            return img;
        });
        appendChild(imgLi, imgs);
        appendChild(imgUl, imgLi);

        const priceSpan = ce('span');
        const nameSpan = ce('span');
        const rankingSpan = ce('span');
        const removeButton = ce('button');

        brandSpan.innerText = item.brand;
        idSpan.innerText = item.id;
        priceSpan.innerText = item.price;
        nameSpan.innerText = item.name;
        rankingSpan.innerText = item.ranking;

        removeButton.innerText = 'Remove';
        removeButton.addEventListener('click', handleRemove(item.id));

        appendChild(Card, [
            brandSpan,
            idSpan,
            imgUl,
            priceSpan,
            nameSpan,
            rankingSpan,
            removeButton,
        ]);
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
        setCardPage(value[ITEM]);
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
            setCardPage(removedItems);
        });
    });
};
(() => {
    InitPage();
})();
