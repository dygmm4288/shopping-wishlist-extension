const query = (selector, tag = document) => tag.querySelector(selector);
const queryAll = (selector, tag = document) => tag.querySelectorAll(selector);
const createElement = (tag) => document.createElement(tag);
const appendChild = (parent, childs) => {
    if (Array.isArray(childs)) {
        childs.forEach((child) => {
            parent.appendChild(child);
        });
    } else {
        parent.appendChild(childs);
    }
    return parent;
};
/* Toast */
function initToast() {
    const Toast = {
        toasts: [],
        toastContainer: null,
        pushToast: function (text, err) {
            if (!this.toastContainer) return;
            const toastTag = createElement('div');
            const pTag = createElement('p');
            toastTag.classList.add('toast-item');
            if (err) toastTag.classList.add('error');
            pTag.innerText = text;

            appendChild(this.toastContainer, appendChild(toastTag, pTag));

            const removeTag = () => {
                try {
                    this.toastContainer.removeChild(toastTag);
                } catch (e) {
                    console.error(e);
                }
            };

            setTimeout(() => {
                removeTag();
            }, 3000);
        },
    };

    const toastContainer = createElement('div');
    toastContainer.id = 'toast-container';
    Toast.toastContainer = toastContainer;
    return Toast;
}
const Toast = initToast();

const getItem = () => {
    const dl = query('dl.info.container');
    if (!dl) return;

    const id = query('dd', dl).innerText;
    const name = query('h5[itemprop=name]').innerText;
    const brand = query('span[itemprop=name]').innerText;
    const price = query('[itemprop=price]').innerText;
    const ranking = query('.fleft').innerText;
    const imgURL = (() => {
        const elems = queryAll('.thumb img');
        ret = [];
        for (let i = 0, len = elems.length; i < len; i++) {
            ret.push(elems[i].src);
        }
        return ret;
    })();

    return {
        id,
        name,
        brand,
        price,
        ranking,
        imgURL,
    };
};
const getDl = () => query('dl.info.container');
const isEmptyObject = (obj) =>
    obj.constructor === Object && Object.keys(obj).length === 0;

const saveItem = (newItem) => {
    const ITEM = 'ITEM';
    chrome.storage.local.get(ITEM, (value) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            Toast.pushToast(chrome.runtime.lastError, true);
            return;
        }
        if (isEmptyObject(value)) {
            const newValue = { [ITEM]: [newItem] };
            chrome.storage.local.set(newValue, () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    Toast.pushToast(chrome.runtime.lastError, true);
                    return;
                }
            });
        } else {
            const newItems = value[ITEM].filter(({ id }) => id != newItem.id);
            newItems.push(newItem);
            const newValue = { [ITEM]: newItems };

            chrome.storage.local.set(newValue, () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    Toast.pushToast(chrome.runtime.lastError, true);
                    return;
                }
                console.log(`Stored data ${ITEM} : `);
                Toast.pushToast('저장이 완료됐습니다.');
            });
        }
    });
};
const appendATag = () => {
    const aTag = document.createElement('a');
    aTag.classList.add('btn_ob');
    aTag.innerText = ' WISH LIST 추가하기(Extension)';
    aTag.style.width = '100%';
    aTag.style.marginTop = '15px';
    aTag.href = '#';
    aTag.addEventListener('click', (e) => {
        e.preventDefault();
        saveItem(getItem());
        return;
    });

    const btnWrapper = query('.productInfoSec .detailInfo .txt .btns');
    btnWrapper.appendChild(aTag);
};

function appendStyle(styles) {
    const css = createElement('style');
    css.type = 'text/css';

    appendChild(
        query('head'),
        appendChild(css, document.createTextNode(styles)),
    );
}

(async () => {
    appendChild(document.body, Toast.toastContainer);
    appendATag();
    appendStyle(`
@keyframes toast-up {
    0% {
        opacity: 0;
        transform: translateY(50%);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
#toast-container {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-start;
    align-items: stretch;
    width: 300px;
    position:fixed;
    right: 0;
    bottom: 0;
    gap: 0.5rem;
    margin-right: 1.2rem;
    margin-bottom: 1.2rem;
    z-index: 9999;
}
.toast-item {
    animation: toast-up 0.25s ease-in;
    background-color: #64c165;
    color: #fff;
    border-radius: 0.5rem;
    padding: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
}
.error {
    background-color: #ff4d4d;
}
`);
})();
