
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
//const zoomInBtn = document.querySelector(".zoom-in");
//const zoomOutBtn = document.querySelector(".zoom-out");
//const zoomValueOutput = document.querySelector(".zoom-value");
const countryNameOutput = document.querySelector(".side-panel .container .country-name");

const myTooltip = document.getElementById('myTooltip');

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
                let count = 1;
                for (let i of dataById[clickedCountryName].desc) {
                    list += `<li>${i.text}<sup>${count++}</sup></li>`;
                    sources += `<li>${i.source}</li>`;
                }

                list += "</ul>";
                sources += "</ol> </details>"
            }

            document.getElementsByClassName("textList")[0].innerHTML = list;
            document.getElementsByClassName("sourcesList")[0].innerHTML = sources;
            myTooltip.innerText = "";
            myTooltip.style.visibility = 'hidden';
            myTooltip.style.opacity = '0';

        });
    }

    country.addEventListener("mouseenter", function (event) {
        const countryName = [...country.classList].join(' ');
        if (dataById[countryName]) {
            const selector = "[class=\"" + countryName + "\"]"
            //select all pieces of land that belongs to the same country (avg paths)
            const matchingElements = document.querySelectorAll(selector);
            matchingElements.forEach(el => el.style.fill = "#a37dce")
        }
        myTooltip.innerText = countryName;
        myTooltip.style.left = `${event.clientX + 10}px`; // Adjust offset as needed
        myTooltip.style.top = `${event.clientY + 10}px`;  // Adjust offset as needed
        myTooltip.style.visibility = 'visible';
        myTooltip.style.opacity = '0.8';

    });

    country.addEventListener("mouseout", function () {
        const countryName = [...country.classList].join(' ');
        if (dataById[countryName]) {
            const selector = "[class=\"" + countryName + "\"]"
            const matchingElements = document.querySelectorAll(selector);
            matchingElements.forEach(el => el.style.fill = "#443d4b");
            myTooltip.innerText = "";
            myTooltip.style.visibility = 'hidden';
            myTooltip.style.opacity = '0';
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
const svg = document.querySelector('svg');


window.addEventListener("DOMContentLoaded", (event) => {
    const svg = document.querySelector('svg');

    const doScale = function (scale, pt) {
        // get viewBox transform
        let [x, y, width, height] = svg.getAttribute('viewBox').split(' ').map(Number);


        // get pt.x as a proportion of width and pt.y as proportion of height
        let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height];

        // calc new width and height, new x2, y2 (using proportions and new width and height)
        let [width2, height2] = [width + width * scale, height + height * scale];
        let x2 = pt.x - xPropW * width2;
        let y2 = pt.y - yPropH * height2;

        console.log(width2)
        if (width2 <= 14 || width2 >= 14000) //zoomed in/out too much
            return;

        svg.setAttribute('viewBox', `${x2} ${y2} ${width2} ${height2}`);
    }

    // zooming
    svg.onwheel = function (event) {
        event.preventDefault();

        // set the scaling factor (and make sure it's at least 10%)
        let scale = event.deltaY / 1000;
        scale = Math.abs(scale) < .1 ? .1 * event.deltaY / Math.abs(event.deltaY) : scale;

        // get point in SVG space
        let pt = new DOMPoint(event.clientX, event.clientY);
        pt = pt.matrixTransform(svg.getScreenCTM().inverse());
        doScale(scale, pt);
    }

    let start = {};
    let isPanning = false;
    // Calculate distance between two fingers
    const distance = (event) => {
        return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
    };

    svg.addEventListener('touchstart', (event) => {
        // console.log('touchstart', event);
        if (event.touches.length === 2) {
            event.preventDefault(); // Prevent page scroll

            // Calculate where the fingers have started on the X and Y axis
            start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            start.distance = distance(event);
        }
        else if (event.touches.length === 1) {
            isPanning = true;
            start.x = event.touches[0].pageX;
            start.y = event.touches[0].pageY;
        }
    });

    svg.addEventListener('touchmove', (event) => {
        // console.log('touchmove', event);
        if (event.touches.length === 2) {
            event.preventDefault(); // Prevent page scroll

            // Safari provides event.scale as two fingers move on the screen
            // For other browsers just calculate the scale manually
            let scale;
            if (event.scale) {
                scale = event.scale;
            } else {
                const deltaDistance = distance(event);
                scale = deltaDistance / start.distance;
            }
            if (scale > 1)
                scale = -0.05;
            else
                scale = 0.05;

            // get point in SVG space
            let pt = new DOMPoint(start.x, start.y);
            pt = pt.matrixTransform(svg.getScreenCTM().inverse());

            doScale(scale, pt);
        }
        else if (event.touches.length === 1) {
            if (isPanning) {
                const dx = event.touches[0].clientX - start.x;
                const dy = event.touches[0].clientY - start.y;

                if (Math.abs(dx) < 5 && Math.abs(dy) < 5)
                    return;

                let [viewBoxX, viewBoxY, width, height] = svg.getAttribute('viewBox').split(' ').map(Number);

                // Adjust viewBox coordinates based on mouse movement
                viewBoxX -= dx;
                viewBoxY -= dy;

                // Update the SVG's viewBox
                svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${width} ${height}`);

                start.x = event.touches[0].clientX;
                start.y = event.touches[0].clientY;
            }
        }
    });

    svg.addEventListener('touchend', (event) => {
        if (isPanning) {
            isPanning = false;
        }
        // console.log('touchend', event);
        // Reset image to it's original format
        //svg.style.transform = "";
        //svg.style.WebkitTransform = "";
        //svg.style.zIndex = "";
    });

})


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



