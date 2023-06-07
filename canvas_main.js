var canvas_div = document.getElementById('canvas_div');
var canvas = document.getElementById("canvas_main");
var pagenames = ["index", "topics", "cv"];
var flagnames = ["Home", "Topics", "Profile"];
ctx = canvas.getContext("2d");

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
// canvas.addEventListener('click', () => {
// });

//global variables for proportion:
var ratio_h_logo_h_canvas = 2.1*0.1065;
var ratio_w_logo_h_canvas = 2.1*0.1023;
var ratio_w_logo_h_logo = ratio_w_logo_h_canvas/ratio_h_logo_h_canvas;
var ratio_h_flag_h_canvas = 0.10;
var ratio_w_flag_h_canvas = 0.216;//ratio_w_logo_h_canvas;
var ratio_h_topmargin_h_canvas = 0.2;
var ratio_h_bottommargin_h_canvas = 0.1;
var ratio_w_flag_h_flag = ratio_w_flag_h_canvas/ratio_h_flag_h_canvas;

var ratio_w_textsize_w_logo = 35/102.3//0.255; //0.255
var ratio_w_charoffset_w_logo = 0.08;
var ratio_h_charoffset_h_logo = 0.41;
var ratio_h_charoffset_h_flag = 0.9;

//global variables for sizing:
var height_underline;
var width_text;
var width_border = 2;
var magnifylogo_original = 2.5;
var magnifylogo;
var magnifyflag;
var width_seplogoflag;
var width_sepleftflag;
var width_margin; //this can be fixed if needed
var width_logo, height_logo, width_flag, height_flag, height_topmargin, height_bottommargin, width_buttonleftoffset, lineheight;
var map;

//for style:
var gradient;
var activetitle;

var hover = false, id; //set by canvas.onmousemove
var _i, _b;


function getActiveTitle(){
    var idx;

    if (document.URL.includes(pagenames[0])){
        idx = 1;
    }else if(document.URL.includes(pagenames[1])){
        idx = 2;
    }else if(document.URL.includes(pagenames[2])){
        idx = 3;
    }else{
        idx = 1; //home page
    }
    return idx
}
activetitle = getActiveTitle();


function renderMap() {
    var newfontsize_str
    var offset_x, offset_y;
    const match = /(?<value>\d+\.?\d*)/;
    const setFontSize = (size) => ctx.font = ctx.font.replace(match, size);
    const adjustFontSize = (amount) => {
        const newSize = parseFloat(ctx.font.match(match).groups.value + amount);
        return ctx.font = ctx.font.replace(match, newSize);
    }

    //logo box:       
    ctx.strokeStyle = '#737373ff';
    ctx.lineWidth = width_border;
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    _b = map[0]
    ctx.fillRect(_b.x, _b.y, _b.w, _b.h);
    ctx.strokeRect(_b.x+width_border/2, _b.y+width_border/2, _b.w-width_border, _b.h-width_border);

    //logo:
    // get the new font size to preserve the logo
    newfontsize_str = (1.0*ratio_w_textsize_w_logo*width_logo).toString().concat("px");
    //lineheight_overlap = height_logo*0.32/3;

    ctx.textAlign = "left";
    ctx.textBaseline = "bottom"
    ctx.fillStyle = "white";
    offset_x = map[0].x + ratio_w_charoffset_w_logo*width_logo;
    //offset_y = map[0].y + ratio_h_charoffset_h_logo*height_logo;

    //ctx.font = 'italic 500 30px "Roboto Mono"';
    ctx.font = 'italic 30px "Times"';
    // we must replace the font size after defining the font
    //ctx.font = ctx.font.replace(match, newfontsize_str);
    setFontSize(22)
    offset_y = map[0].y + 0.3*height_logo;
    ctx.fillText("atmosalex's", offset_x, offset_y);
    setFontSize(43)



    gradient = ctx.createLinearGradient(offset_x, map[0].y + height_logo, map[0].x+map[0].w-width_border, map[0].y+map[0].h-width_border);
    gradient.addColorStop(0, "rgb(42, 255, 213)");
    gradient.addColorStop(1, "rgb(43, 201, 242)");
    ctx.fillStyle = gradient;


    //ctx.font = 'italic 300 30px "Roboto Mono"';
    //ctx.font = ctx.font.replace(/\d+px/, newfontsize_str);
    offset_y = map[0].y + 0.65*height_logo;
    ctx.fillText("ML", offset_x, offset_y);

    //ctx.font = 'italic 500 30px "Roboto Mono"';
    //ctx.font = ctx.font.replace(/\d+px/, newfontsize_str);
    //ctx.fillStyle = "#2affd5ff";

    ctx.textAlign = "right";
    offset_x = map[0].x + map[0].w - ratio_w_charoffset_w_logo*width_logo;
    offset_y = map[0].y + 0.9*height_logo;
    ctx.fillText("repos", offset_x, offset_y);
}


function resizeCanvas() {
    magnifylogo = magnifylogo_original
    magnifyflag = magnifylogo

    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;

    //width_seplogoflag = width_buttonleftoffset - (width_logo + width_margin), expanding this expression:
    width_margin = 0//0.02*canvas.width
    width_seplogoflag = canvas.width - (canvas.height * ratio_h_logo_h_canvas * magnifylogo * ratio_w_logo_h_logo + width_margin);
    width_sepleftflag = canvas.width - 3*(canvas.height * ratio_h_flag_h_canvas * magnifyflag * ratio_w_flag_h_flag) -2*width_margin;

    if (width_seplogoflag < 0){ //adjust magnification such that all the buttons are side by side and don't overlap
      // solving width_seplogoflag = 0 for magnifylogo:
      magnifylogo = (canvas.width - 3 * width_margin)/ (3*canvas.height * ratio_h_flag_h_canvas * ratio_w_flag_h_flag + canvas.height * ratio_h_logo_h_canvas * ratio_w_logo_h_logo);
    }

    if (width_sepleftflag < 0){ //adjust magnification such that all the buttons are side by side and fill the page but don't spill over
      // solving width_seplogoflag = 0 for magnifylogo:
      magnifyflag = (canvas.width - 3 * width_margin)/ (3*canvas.height * ratio_h_flag_h_canvas * ratio_w_flag_h_flag);
    }


    height_logo = canvas.height * ratio_h_logo_h_canvas * magnifylogo
    width_logo = height_logo * ratio_w_logo_h_logo

    //https://stackoverflow.com/questions/294250/how-do-i-retrieve-an-html-elements-actual-width-and-height
    height_topmargin = canvas.height * ratio_h_topmargin_h_canvas
    height_bottommargin = canvas.height * ratio_h_bottommargin_h_canvas


    map = [
        {x: 0, y: height_topmargin, w: width_logo, h: height_logo}
    ];

    renderMap();
}
resizeCanvas();



// canvas.onmousemove = function(e) {
//     // Get the current mouse position
//     var r = canvas.getBoundingClientRect(),
//         x = e.clientX - r.left, y = e.clientY - r.top;
//     hover = false;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     //ctx.clearRect(0, 0, context.canvas.width, context.canvas.height)
//     b = map[0]
//     //for(var i = map.length - 1, b; b = map[i]; i--) {
//     if(x >= b.x && x <= b.x + b.w &&
//        y >= b.y && y <= b.y + b.h) {
//         // The mouse honestly hits the rect
//         hover = true;
//         //id = i;
//         //break;
//     }
//     //the problem is that the mouse may leave the canvas without leaving the map box first (i.e. it leaves very quickly), and then hover does not get set false
//     renderMap();
// }