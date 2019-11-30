let html = document.documentElement;

let calcRem = function () {
    let w = html.clientWidth;
    if (w < 320) {
        html.style.fontSize = '13px'
    } else if (w <= 640) {
        html.style.fontSize = "16px"
    } else if (w >= 768) {
        html.style.fontSize = "30px"
    } else if (w >= 800) {
        html.style.fontSize = "36px"

    }
}

calcRem()

window.onresize = function () {
    calcRem()
}