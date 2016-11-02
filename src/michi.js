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

