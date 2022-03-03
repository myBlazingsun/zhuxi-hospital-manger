export const on = (function () {
    if (document.addEventListener) {
        return function (ele, event, handler) {
            if (ele && event && handler) {
                ele.addEventListener(event, handler, false)
            }
        }
    } else {
        return function (ele, event, handler) {
            if (ele && event && handler) {
                ele.attachEvent('on' + event, handler)
            }
        }
    }
}())

export const off = (function () {
    if (document.removeEventListener) {
        return function(ele, event, handler){
            if(ele && event){
                ele.removeEventListener(event, handler, false)
            }
        }
    }else{
        return function(ele, event, handler){
            if(ele && event){
                ele.detachEvent('on' + event, handler)
            }
        }
    }
}())

export const hasClass = (el, cls) => {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}


export const addClass = (el, cls) => {
    if (!el) return;
    var curClass = el.className;
    var classes = (cls || '').split(' ');

    for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
};