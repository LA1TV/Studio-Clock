const config = {
    width: 1280,
    height: 720,
    bgColor: 0x000000,
    clockColor: 0xFF0000,
    liveColor: 0xFF0000,
    rehersalColor: 0x00FF00,
    inactiveColor: 0x303030,
};

const renderer = PIXI.autoDetectRenderer(config.width, config.height);
const stage = new PIXI.Container();
const graphics = new PIXI.Graphics();

// Scaling to the right size for the display
const digiclocksize  = renderer.height / 3.5;
const digiclockspace = renderer.height / 10.5;
const dotsize        = renderer.height / 90;
const hradius        = renderer.height / 2.5;
const secradius      = hradius - (renderer.height / 26);
const indtxtsize     = renderer.height / 5;
const indboxy        = renderer.height / 6;
const indboxx        = renderer.width / 2.5;

const xclockpos      = renderer.width * 0.2875;
const ycenter        = renderer.height / 2;
const xtxtpos        = renderer.width * 0.75;
const xindboxpos     = xtxtpos - (indboxx / 2);
const ind1y          = (ycenter * 0.4) - (indboxy / 2);
const ind2y          = (ycenter * 0.8) - (indboxy / 2);
const ind3y          = (ycenter * 1.2) - (indboxy / 2);
const txthmy         = ycenter - digiclockspace;
const txtsecy        = ycenter + digiclockspace;

function resize() {
    let w, h;
    const ratio = config.width / config.height;

    if (window.innerWidth / window.innerHeight >= ratio) {
        w = window.innerHeight * ratio;
        h = window.innerHeight;
    } else {
        w = window.innerWidth;
        h = window.innerWidth / ratio;
    }
    renderer.view.style.width = w + 'px';
    renderer.view.style.height = h + 'px';
}

window.onresize = function(event) {
    resize();
};

stage.addChild(graphics);
document.body.appendChild(renderer.view);

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Equations for second markers
function paraeqsmx(smx) {
    return xclockpos - (secradius * (Math.cos(Math.radians((smx) + 90 ))));
}

function paraeqsmy(smy) {
    return ycenter - (secradius * (Math.sin(Math.radians((smy) + 90 ))));
}

// Equations for hour markers
function paraeqshx(shx) {
    return xclockpos - (hradius * (Math.cos(Math.radians((shx) + 90 ))));
}

function paraeqshy(shy) {
    return ycenter - (hradius * (Math.sin(Math.radians((shy) + 90))));
}

//Clock Text

const clockText = new PIXI.Text('##:##', {fontFamily : 'Arial', fontSize: (digiclocksize * 0.6), fill : 0xff1010, align : 'center'});
clockText.x = xclockpos;
clockText.y = txthmy;
clockText.anchor = new PIXI.Point(0.5, 0.5);
stage.addChild(clockText);

const secondText = new PIXI.Text('##', {fontFamily : 'Arial', fontSize: (digiclocksize * 0.6), fill : 0xff1010, align : 'center'}); 
secondText.x = xclockpos;
secondText.y = txtsecy;
secondText.anchor = new PIXI.Point(0.5, 0.5);
stage.addChild(secondText);

//Studo Indicators

const liveText = new PIXI.Text('ON AIR', {fontFamily : 'Arial', fontSize: (indtxtsize * 0.6), fill : 'black', align : 'center'}); 
liveText.x = xtxtpos;
liveText.y = ycenter * 0.4;
liveText.anchor = new PIXI.Point(0.5, 0.5);
stage.addChild(liveText);

const rehersalText = new PIXI.Text('REHERSAL', {fontFamily : 'Arial', fontSize: (indtxtsize * 0.6), fill : 'black', align : 'center'}); 
rehersalText.x = xtxtpos;
rehersalText.y = ycenter * 0.8;
rehersalText.anchor = new PIXI.Point(0.5, 0.5);
stage.addChild(rehersalText);

const programText = new PIXI.Text('STUDIO DARK', {fontFamily : 'Arial', fontSize: (indtxtsize * 0.4), fill : 'white', align : 'center'}); 
programText.x = xtxtpos;
programText.y = ycenter * 1.4;
programText.anchor = new PIXI.Point(0.5, 0.5);
stage.addChild(programText);

function animate() {
    graphics.clear();
    renderer.backgroundColor = config.bgColor;

    const date = new Date();
    const sectime = date.getSeconds();
    const secdeg  = (sectime + 1) * 6;

    let smx = 0, smy = 0
    while (smx < secdeg) {   
        graphics.beginFill(config.clockColor);
        graphics.drawCircle(paraeqsmx(smx), paraeqsmy(smy), dotsize); 
        graphics.endFill();

        smy += 6;  // 6 Degrees per second
        smx += 6;
    }

    // Draw hour markers
    let shx = 0, shy = 0;
    while (shx < 360) {
        graphics.beginFill(config.clockColor);
        graphics.drawCircle(paraeqshx(shx), paraeqshy(shy), dotsize); 
        graphics.endFill();

        shy += 30;  // 30 Degrees per hour
        shx += 30;
    }

    clockText.text = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    secondText.text = ('0' + sectime).slice(-2);
    programText.text = 'STUDIO DARK';

    //draw info boxes
    graphics.beginFill(config.liveColor);
    graphics.drawRect(xindboxpos, ind1y, indboxx, indboxy)
    graphics.endFill();

    graphics.beginFill(config.inactiveColor);
    graphics.drawRect(xindboxpos, ind2y, indboxx, indboxy)
    graphics.endFill();

    graphics.beginFill(0x000000);
    graphics.lineStyle(5, 0xFFFFFF);
    graphics.drawRect(xindboxpos, ind3y, indboxx, (indboxy * 2.2));
    graphics.endFill();

    //Render the stage
    renderer.render(stage);
    requestAnimationFrame(animate);
}

//Fire one resize event to fit the screen
resize();
animate();