const CANVAS_ID = "canvas";
const algo = require("./michi.js");

document.addEventListener("DOMContentLoaded", () => {
    const map_canvas   = document.getElementById("map");
    const route_canvas = document.getElementById("route");
    const source_area  = document.getElementById("source");
    function refresh(data){
        [route_canvas, map_canvas].forEach(canvas => {
            canvas.getContext("2d").clearRect(0, 0,
                                              canvas.width,
                                              canvas.height);
        });
        algo.drawMap(map_canvas, data);
        const route = algo.solve(data);
        if(route !== null){
            algo.drawRoute(route_canvas, route);
        }
    }
    refresh(algo.INITIAL_DATA);

    function toMap(str){
        return str.split("\n").map(row => row.split(""));
    }
    function toStr(map){
        return map.map(row => row.join("")).join("\n");
    }
    source_area.value = toStr(algo.INITIAL_DATA);
    source_area.addEventListener("input", () => refresh(toMap(source_area.value)));
});
