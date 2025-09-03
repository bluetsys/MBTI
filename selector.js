function _$(selector) {
    let elements;
    if (typeof selector === 'string') {
        if (selector.startsWith('#') && !selector.includes(' ')) {
            const el = document.getElementById(selector.slice(1));
            elements = el ? [el] : [];
        } else {
            elements = Array.from(document.querySelectorAll(selector));
        }
    } else if (Array.isArray(selector)) {
        elements = selector;
    } else {
        elements = [selector];
    }

    const customApi = {
        each(callback) {
            const arr = Array.isArray(this) ? this : [this];
            arr.forEach((el, idx) => callback.call(el, el, idx));
            return arr;
        },
        index(index) {
            const arr = Array.isArray(this) ? this : [this];
            return arr[index];
        },
        find(selector) {
            let foundElements = [];
            const arr = Array.isArray(this) ? this : [this];
            customApi.each.call(arr, el => {
                const matches = Array.from(el.querySelectorAll(selector));
                foundElements = foundElements.concat(matches);
            });
            return _$(foundElements);
        },
        attr(name, value) {
            const arr = Array.isArray(this) ? this : [this];
            if (value === undefined) {
                return arr[0] ? arr[0].getAttribute(name) : null;
            }
            customApi.each.call(arr, el => el.setAttribute(name, value));
            return arr;
        },
        removeAttr(name) {
            const arr = Array.isArray(this) ? this : [this];
            customApi.each.call(arr, el => el.removeAttribute(name));
            return arr;
        },
        addClass(className) {
            const arr = Array.isArray(this) ? this : [this];
            customApi.each.call(arr, el => el.classList.add(className));
            return arr;
        },
        removeClass(className) {
            const arr = Array.isArray(this) ? this : [this];
            customApi.each.call(arr, el => el.classList.remove(className));
            return arr;
        },
        on(event, handler) {
            const arr = Array.isArray(this) ? this : [this];
            customApi.each.call(arr, el => el.addEventListener(event, handler));
            return arr;
        },
        css(prop, value) {
            const arr = Array.isArray(this) ? this : [this];
            customApi.each.call(arr, el => el.style[prop] = value);
            return arr;
        },
        text(value) {
            const arr = Array.isArray(this) ? this : [this];
            if (value === undefined) return arr[0] ? arr[0].textContent : '';
            customApi.each.call(arr, el => el.textContent = value);
            return arr;
        },
        html(value) {
            const arr = Array.isArray(this) ? this : [this];
            if (value === undefined) return arr[0] ? arr[0].innerHTML : '';
            customApi.each.call(arr, el => el.innerHTML = value);
            return arr;
        },
        val(value) {
            const arr = Array.isArray(this) ? this : [this];
            if (value === undefined) return arr[0] ? arr[0].value : '';
            customApi.each.call(arr, el => el.value = value);
            return arr;
        },
        first() {
            const arr = Array.isArray(this) ? this : [this];
            return arr[0];
        },
        last() {
            const arr = Array.isArray(this) ? this : [this];
            return arr[arr.length - 1];
        },
        add(selector) {
            const arr = Array.isArray(this) ? this : [this];
            let newElements = _$(selector);
            let combinedElements = Array.from(new Set(arr.concat(newElements)));
            return _$(combinedElements);
        }
    };

    // customApi 메서드를 배열과 단일 요소 모두에 동작하도록 래핑
    function wrapApi(target) {
        Object.keys(customApi).forEach(fn => {
            target[fn] = function(...args) {
                // this가 배열이 아니면 배열로 변환
                const arr = Array.isArray(target) ? target : [target];
                return customApi[fn].apply(arr, args);
            };
        });
        return target;
    }

    if (elements.length === 1) {
        return wrapApi(elements[0]);
    }
    return wrapApi(elements);
}