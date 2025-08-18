
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
//const zoomInBtn = document.querySelector(".zoom-in");
//const zoomOutBtn = document.querySelector(".zoom-out");
//const zoomValueOutput = document.querySelector(".zoom-value");
const countryNameOutput = document.querySelector(".side-panel .container .country-name");



var dataById = {};

data.forEach(function (d) {
    dataById[d.country] = {
        desc: structuredClone(d.desc),
    }
});


countries.forEach(country => {
    const countryName = [...country.classList].join(' ');

    //console.log(countryName)
    if (!dataById[countryName]) {
        //select all pieces of land that belongs to the same country (avg paths)
        const selector = "[class=\"" + countryName + "\"]"
        const matchingElements = document.querySelectorAll(selector);
        matchingElements.forEach(el => el.style.fill = "#716c76")
    }
    else {

        country.addEventListener("click", function (e) {

            //console.log("country found:" + countryName)
            let clickedCountryName;

            clickedCountryName = e.target.classList.value;

            sidePanel.classList.add("side-panel-open")
            //console.log(clickedCountryName)
            countryNameOutput.innerText = clickedCountryName;

            let list = "";
            let sources = ""

            if (dataById[clickedCountryName]) {
                //console.log(dataById[clickedCountryName])
                list = "<ul>";
                sources = "<details> <summary>Sources</summary> <ol>"

                for (let i of dataById[clickedCountryName].desc) {
                    list += `<li>${i.text}</li>`;
                    sources += `<li>${i.source}</li>`;
                }

                list += "</ul>";
                sources += "</ol> </details>"
            }

            document.getElementsByClassName("textList")[0].innerHTML = list;
            document.getElementsByClassName("sourcesList")[0].innerHTML = sources;


        });
    }

    country.addEventListener("mouseenter", function () {
        const countryName = [...country.classList].join(' ');
        if (dataById[countryName]) {
            const selector = "[class=\"" + countryName + "\"]"
            //select all pieces of land that belongs to the same country (avg paths)
            const matchingElements = document.querySelectorAll(selector);
            matchingElements.forEach(el => el.style.fill = "#a37dce")

        }

    });

    country.addEventListener("mouseout", function () {
        const countryName = [...country.classList].join(' ');
        if (dataById[countryName]) {
            const selector = "[class=\"" + countryName + "\"]"
            const matchingElements = document.querySelectorAll(selector);
            matchingElements.forEach(el => el.style.fill = "#443d4b");
        }
    });

});

closeBtn.addEventListener("click", () => {
    sidePanel.classList.remove("side-panel-open");
});

/*
let zoomValue = 100;

zoomOutBtn.disabled = true;

zoomInBtn.addEventListener("click", () => {
    zoomOutBtn.disabled = false;
    zoomValue += 100;

    if (zoomValue < 500) {
        zoomInBtn.disabled = false;
    }
    else {
        zoomInBtn.disabled = true;
    }

    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";

    zoomValueOutput.innerText = zoomValue + "%"
});

zoomOutBtn.addEventListener("click", () => {
    zoomInBtn.disabled = false;
    zoomValue -= 100;

    if (zoomValue > 100) {
        zoomOutBtn.disabled = false;
    }
    else {
        zoomOutBtn.disabled = true;
    }

    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";

    zoomValueOutput.innerText = zoomValue + "%"
});
*/


window.addEventListener("DOMContentLoaded", (event) => {
    const svg = document.querySelector('svg');

    // zooming
    svg.onwheel = function (event) {
        event.preventDefault();

        // set the scaling factor (and make sure it's at least 10%)
        let scale = event.deltaY / 1000;
        scale = Math.abs(scale) < .1 ? .1 * event.deltaY / Math.abs(event.deltaY) : scale;

        // get point in SVG space
        let pt = new DOMPoint(event.clientX, event.clientY);
        pt = pt.matrixTransform(svg.getScreenCTM().inverse());

        // get viewBox transform
        let [x, y, width, height] = svg.getAttribute('viewBox').split(' ').map(Number);

        // get pt.x as a proportion of width and pt.y as proportion of height
        let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height];

        // calc new width and height, new x2, y2 (using proportions and new width and height)
        let [width2, height2] = [width + width * scale, height + height * scale];
        let x2 = pt.x - xPropW * width2;
        let y2 = pt.y - yPropH * height2;

        svg.setAttribute('viewBox', `${x2} ${y2} ${width2} ${height2}`);
    }
})




const svg = document.querySelector('svg');
let isPanning = false;
let startX, startY;

svg.addEventListener('mousedown', (e) => {
    isPanning = true;
    startX = e.clientX;
    startY = e.clientY;
});

svg.addEventListener('mousemove', (e) => {
    if (!isPanning) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) < 5 && Math.abs(dy) < 5)
        return;

    let [viewBoxX, viewBoxY, width, height] = svg.getAttribute('viewBox').split(' ').map(Number);

    // Adjust viewBox coordinates based on mouse movement
    viewBoxX -= dx;
    viewBoxY -= dy;

    // Update the SVG's viewBox
    svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${width} ${height}`);

    startX = e.clientX;
    startY = e.clientY;
});

svg.addEventListener('mouseup', () => {
    isPanning = false;
});

svg.addEventListener('mouseleave', () => {
    isPanning = false; // Stop panning if mouse leaves the SVG area
});

