(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./michi.js":2}],2:[function(require,module,exports){
const BLOCK_SIZE = 32;
const INITIAL_DATA_S = ["#################",
                        "#........#.....##",
                        "#...#..........##",
                        "#.........#....##",
                        "#.#............##",
                        "##.......#.....##",
                        "#.............###",
                        "#......#.......g#",
                        "#..#...........g#",
                        "#.............###",
                        "#.......#......##",
                        "#.....#...#....##",
                        "#..............##",
                        "##############s##",
                        "#################"];
const INITIAL_DATA = INITIAL_DATA_S.map(row => row.split(""));

const START = 's';
const GOAL  = 'g';
const WALL  = '#';
const ICE   = '.';

const COLORS = new Map([
    [START, "rgb(0,   255,   0)"],
    [GOAL,  "rgb(255,   0,   0)"],
    [WALL,  "rgb(100, 100, 100)"],
    [ICE,   "rgb(255, 255, 255)"]
]);

function drawMap(canvas, map){
    const ctx    = canvas.getContext("2d");
    for(let row=0; row<map.length; row++){
        for(let col=0; col<map[row].length; col++){
            ctx.fillStyle = COLORS.get(map[row][col]);
            ctx.fillRect(BLOCK_SIZE*col, BLOCK_SIZE*row,
                         BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}
function drawRoute(canvas, route){
    const ctx    = canvas.getContext("2d");
    for(var i=0;i<route.length;i++){
        let r = route[i];
        const y = r[0];
        const x = r[1];
        console.log(y, x);
        ctx.fillStyle = COLORS.get("rgb(0,0,0)");
        ctx.fillText(i + "", BLOCK_SIZE*(x+0.25), BLOCK_SIZE*(y+0.25));
        ctx.fillRect(BLOCK_SIZE*(x+0.25), BLOCK_SIZE*(y+0.25),
                     BLOCK_SIZE * 0.5, BLOCK_SIZE* 0.5);
    }
}

// needs for throw
class Route {
    constructor(route){
        this.route = route;
    }
}

const dy = [-1, 0, 1,  0];
const dx = [ 0, 1, 0, -1];
function solve(map){
    let alreadyVisited = new Set();
    function serializePoint(y, x){
        return x + "," + y;
    }
    let route = [];
    function dfs(y, x){
        if(map[y][x] == GOAL){
            throw new Route(route);
        }
        if(alreadyVisited.has(serializePoint(y, x))){
            return;
        }
        alreadyVisited.add(serializePoint(y, x));
        for(var i=0; i<4; i++){
            const ddy = dy[i];
            const ddx = dx[i];
            let ny = y;
            let nx = x;
            // 本当は g とかも考慮しないといけんね．
            while(map[ny][nx] != WALL){
                ny += ddy;
                nx += ddx;
            }
            // いきすぎなのでもどる
            ny -= ddy;
            nx -= ddx;
            if(!(y == ny && x == nx)){
                route.push([ny, nx]);
                dfs(ny, nx);
                route.pop();
            }
        }
    }
    function findStart(){
        let ret = [];
        for(let y=0; y<map.length; y++){
            for(let x=0; x<map[y].length; x++){
                if(map[y][x] == START){
                    ret.push([y, x]);
                }
            }
        }
        return ret;
    }
    try {
        for(let start of findStart()){
            route = [start];
            dfs(start[0], start[1]);
        }
    } catch(e) { // found
        if(e instanceof Route){
            console.log(e.route);
            console.log("found");
            return e.route;
        }
        throw(e);
    }
    return null;
}

exports.solve = solve;
exports.drawMap = drawMap;
exports.drawRoute = drawRoute;
exports.INITIAL_DATA = INITIAL_DATA;


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbWljaGkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgQ0FOVkFTX0lEID0gXCJjYW52YXNcIjtcbmNvbnN0IGFsZ28gPSByZXF1aXJlKFwiLi9taWNoaS5qc1wiKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1hcF9jYW52YXMgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpO1xuICAgIGNvbnN0IHJvdXRlX2NhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGVcIik7XG4gICAgY29uc3Qgc291cmNlX2FyZWEgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3VyY2VcIik7XG4gICAgZnVuY3Rpb24gcmVmcmVzaChkYXRhKXtcbiAgICAgICAgW3JvdXRlX2NhbnZhcywgbWFwX2NhbnZhc10uZm9yRWFjaChjYW52YXMgPT4ge1xuICAgICAgICAgICAgY2FudmFzLmdldENvbnRleHQoXCIyZFwiKS5jbGVhclJlY3QoMCwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIH0pO1xuICAgICAgICBhbGdvLmRyYXdNYXAobWFwX2NhbnZhcywgZGF0YSk7XG4gICAgICAgIGNvbnN0IHJvdXRlID0gYWxnby5zb2x2ZShkYXRhKTtcbiAgICAgICAgaWYocm91dGUgIT09IG51bGwpe1xuICAgICAgICAgICAgYWxnby5kcmF3Um91dGUocm91dGVfY2FudmFzLCByb3V0ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVmcmVzaChhbGdvLklOSVRJQUxfREFUQSk7XG5cbiAgICBmdW5jdGlvbiB0b01hcChzdHIpe1xuICAgICAgICByZXR1cm4gc3RyLnNwbGl0KFwiXFxuXCIpLm1hcChyb3cgPT4gcm93LnNwbGl0KFwiXCIpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdG9TdHIobWFwKXtcbiAgICAgICAgcmV0dXJuIG1hcC5tYXAocm93ID0+IHJvdy5qb2luKFwiXCIpKS5qb2luKFwiXFxuXCIpO1xuICAgIH1cbiAgICBzb3VyY2VfYXJlYS52YWx1ZSA9IHRvU3RyKGFsZ28uSU5JVElBTF9EQVRBKTtcbiAgICBzb3VyY2VfYXJlYS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4gcmVmcmVzaCh0b01hcChzb3VyY2VfYXJlYS52YWx1ZSkpKTtcbn0pO1xuIiwiY29uc3QgQkxPQ0tfU0laRSA9IDMyO1xuY29uc3QgSU5JVElBTF9EQVRBX1MgPSBbXCIjIyMjIyMjIyMjIyMjIyMjI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4uLi4uLi4jLi4uLi4jI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4uIy4uLi4uLi4uLi4jI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4uLi4uLi4uIy4uLi4jI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLiMuLi4uLi4uLi4uLi4jI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjIy4uLi4uLi4jLi4uLi4jI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4uLi4uLi4uLi4uLiMjI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4uLi4uIy4uLi4uLi5nI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4jLi4uLi4uLi4uLi5nI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4uLi4uLi4uLi4uLiMjI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4uLi4uLiMuLi4uLi4jI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4uLi4jLi4uIy4uLi4jI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjLi4uLi4uLi4uLi4uLi4jI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjIyMjIyMjIyMjIyMjI3MjI1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjIyMjIyMjIyMjIyMjIyMjI1wiXTtcbmNvbnN0IElOSVRJQUxfREFUQSA9IElOSVRJQUxfREFUQV9TLm1hcChyb3cgPT4gcm93LnNwbGl0KFwiXCIpKTtcblxuY29uc3QgU1RBUlQgPSAncyc7XG5jb25zdCBHT0FMICA9ICdnJztcbmNvbnN0IFdBTEwgID0gJyMnO1xuY29uc3QgSUNFICAgPSAnLic7XG5cbmNvbnN0IENPTE9SUyA9IG5ldyBNYXAoW1xuICAgIFtTVEFSVCwgXCJyZ2IoMCwgICAyNTUsICAgMClcIl0sXG4gICAgW0dPQUwsICBcInJnYigyNTUsICAgMCwgICAwKVwiXSxcbiAgICBbV0FMTCwgIFwicmdiKDEwMCwgMTAwLCAxMDApXCJdLFxuICAgIFtJQ0UsICAgXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIl1cbl0pO1xuXG5mdW5jdGlvbiBkcmF3TWFwKGNhbnZhcywgbWFwKXtcbiAgICBjb25zdCBjdHggICAgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGZvcihsZXQgcm93PTA7IHJvdzxtYXAubGVuZ3RoOyByb3crKyl7XG4gICAgICAgIGZvcihsZXQgY29sPTA7IGNvbDxtYXBbcm93XS5sZW5ndGg7IGNvbCsrKXtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBDT0xPUlMuZ2V0KG1hcFtyb3ddW2NvbF0pO1xuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KEJMT0NLX1NJWkUqY29sLCBCTE9DS19TSVpFKnJvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgICBCTE9DS19TSVpFLCBCTE9DS19TSVpFKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGRyYXdSb3V0ZShjYW52YXMsIHJvdXRlKXtcbiAgICBjb25zdCBjdHggICAgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGZvcih2YXIgaT0wO2k8cm91dGUubGVuZ3RoO2krKyl7XG4gICAgICAgIGxldCByID0gcm91dGVbaV07XG4gICAgICAgIGNvbnN0IHkgPSByWzBdO1xuICAgICAgICBjb25zdCB4ID0gclsxXTtcbiAgICAgICAgY29uc29sZS5sb2coeSwgeCk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBDT0xPUlMuZ2V0KFwicmdiKDAsMCwwKVwiKTtcbiAgICAgICAgY3R4LmZpbGxUZXh0KGkgKyBcIlwiLCBCTE9DS19TSVpFKih4KzAuMjUpLCBCTE9DS19TSVpFKih5KzAuMjUpKTtcbiAgICAgICAgY3R4LmZpbGxSZWN0KEJMT0NLX1NJWkUqKHgrMC4yNSksIEJMT0NLX1NJWkUqKHkrMC4yNSksXG4gICAgICAgICAgICAgICAgICAgICBCTE9DS19TSVpFICogMC41LCBCTE9DS19TSVpFKiAwLjUpO1xuICAgIH1cbn1cblxuLy8gbmVlZHMgZm9yIHRocm93XG5jbGFzcyBSb3V0ZSB7XG4gICAgY29uc3RydWN0b3Iocm91dGUpe1xuICAgICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG4gICAgfVxufVxuXG5jb25zdCBkeSA9IFstMSwgMCwgMSwgIDBdO1xuY29uc3QgZHggPSBbIDAsIDEsIDAsIC0xXTtcbmZ1bmN0aW9uIHNvbHZlKG1hcCl7XG4gICAgbGV0IGFscmVhZHlWaXNpdGVkID0gbmV3IFNldCgpO1xuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZVBvaW50KHksIHgpe1xuICAgICAgICByZXR1cm4geCArIFwiLFwiICsgeTtcbiAgICB9XG4gICAgbGV0IHJvdXRlID0gW107XG4gICAgZnVuY3Rpb24gZGZzKHksIHgpe1xuICAgICAgICBpZihtYXBbeV1beF0gPT0gR09BTCl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUm91dGUocm91dGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmKGFscmVhZHlWaXNpdGVkLmhhcyhzZXJpYWxpemVQb2ludCh5LCB4KSkpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGFscmVhZHlWaXNpdGVkLmFkZChzZXJpYWxpemVQb2ludCh5LCB4KSk7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPDQ7IGkrKyl7XG4gICAgICAgICAgICBjb25zdCBkZHkgPSBkeVtpXTtcbiAgICAgICAgICAgIGNvbnN0IGRkeCA9IGR4W2ldO1xuICAgICAgICAgICAgbGV0IG55ID0geTtcbiAgICAgICAgICAgIGxldCBueCA9IHg7XG4gICAgICAgICAgICAvLyDmnKzlvZPjga8gZyDjgajjgYvjgoLogIPmha7jgZfjgarjgYTjgajjgYTjgZHjgpPjga3vvI5cbiAgICAgICAgICAgIHdoaWxlKG1hcFtueV1bbnhdICE9IFdBTEwpe1xuICAgICAgICAgICAgICAgIG55ICs9IGRkeTtcbiAgICAgICAgICAgICAgICBueCArPSBkZHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDjgYTjgY3jgZnjgY7jgarjga7jgafjgoLjganjgotcbiAgICAgICAgICAgIG55IC09IGRkeTtcbiAgICAgICAgICAgIG54IC09IGRkeDtcbiAgICAgICAgICAgIGlmKCEoeSA9PSBueSAmJiB4ID09IG54KSl7XG4gICAgICAgICAgICAgICAgcm91dGUucHVzaChbbnksIG54XSk7XG4gICAgICAgICAgICAgICAgZGZzKG55LCBueCk7XG4gICAgICAgICAgICAgICAgcm91dGUucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZmluZFN0YXJ0KCl7XG4gICAgICAgIGxldCByZXQgPSBbXTtcbiAgICAgICAgZm9yKGxldCB5PTA7IHk8bWFwLmxlbmd0aDsgeSsrKXtcbiAgICAgICAgICAgIGZvcihsZXQgeD0wOyB4PG1hcFt5XS5sZW5ndGg7IHgrKyl7XG4gICAgICAgICAgICAgICAgaWYobWFwW3ldW3hdID09IFNUQVJUKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goW3ksIHhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yKGxldCBzdGFydCBvZiBmaW5kU3RhcnQoKSl7XG4gICAgICAgICAgICByb3V0ZSA9IFtzdGFydF07XG4gICAgICAgICAgICBkZnMoc3RhcnRbMF0sIHN0YXJ0WzFdKTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2goZSkgeyAvLyBmb3VuZFxuICAgICAgICBpZihlIGluc3RhbmNlb2YgUm91dGUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coZS5yb3V0ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZvdW5kXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGUucm91dGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3coZSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5leHBvcnRzLnNvbHZlID0gc29sdmU7XG5leHBvcnRzLmRyYXdNYXAgPSBkcmF3TWFwO1xuZXhwb3J0cy5kcmF3Um91dGUgPSBkcmF3Um91dGU7XG5leHBvcnRzLklOSVRJQUxfREFUQSA9IElOSVRJQUxfREFUQTtcblxuIl19
