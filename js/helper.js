const createElement = (tag) => document.createElement(tag);
const selector = (selector) => document.querySelector(selector);
const selectorAll = (selector) => document.querySelectorAll(selector);
const identity = (x) => x;
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
const log = (x) => {
    console.log(x);
    return x;
};
