/*
akashic init -t javascript-shin-ichiba-ranking
akashic-sandbox
akashic scan asset
glyph jsonのmapの{}を消すこと
bmpfont-generator --chars '0123456789' --height 48 --fill #000000 --stroke #ffffff rounded-x-mplus-1c-black.ttf bitmap.png --margin 8
ffmpeg -ss 0.8 -to 1.5 -i se.mp3 -af volume=-5dB se.ogg
ffmpeg -i input1.mp3 -i input2.mp3 -filter_complex "concat=n=2:v=0:a=1" output.mp3
akashic export html -f --output <zipFileName> --atsumaru
*/
/*
scene.onUpdate.add(function() {
});

function createRect() {
}

scene.setTimeout(function() {
}, 3000);

scene.setInterval(function() {
}, 500);

g.game.random.generate();

rect.onPointDown.add(function(ev) {
    let x = ev.point.x;
    let y = ev.point.y;
});
rect.onPointUp.add(function(ev) {
    rect.x += ev.startDelta.x;
    rect.y += ev.startDelta.y;
});
rect.onPointMove.add(function(ev) {
    rect.x += ev.prevDelta.x;
    rect.y += ev.prevDelta.y;
});
scene.onPointDownCapture.add(function(ev) {
});

if (soundstate) scene.assets["se_start"].play();

let sprite  = new g.Sprite({
    scene: scene, src: scene.assets["tutorial"], parent: buttonlayer,
    x: g.game.width/2, y: g.game.height/2,
    anchorX: 0.5, anchorY: 0.5, opacity: 1,
});

let glyph = JSON.parse(scene.assets["font_round_glyphs"].data);
let font = new g.BitmapFont({
    src: scene.assets["font_round"],
    map: glyph,
    defaultGlyphWidth: 96,
    defaultGlyphHeight: 96,
});

let syncrandom = param.random;
g.game.random
*/
//■■■■■■■■■■■■　 ここまでコピペ用 　■■■■■■■■■■■■

exports.main = void 0;

let soundstate = true;
let musicstate = true;

function main(param) {
	g.game.pushScene(makescene(param));
}

function makescene(param) {

    let scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: [
            "tutorial",
            "clock_round",
            "finish",
            "restart",
            "ranking",
            "font_round",
            "font_round_glyphs",
            "musicbutton",
            "soundbutton",
			//音声ファイルはhttps://github.com/akashic-contents　CC BY 2.1 JP　DWANGO Co., Ltd.
            "bgm",
            "se_start",
            "se_seikai",
            "se_hazure",
            "se_finish",

            "odai",
            "find",
	    ]
    });

    // 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
    g.game.vars.gameState = { score: 0 };

    scene.onLoad.add(function () {
        // ここからゲーム内容を記述します

        //■■■■■■■■■■■■　 変数　レイヤー　フォント 　■■■■■■■■■■■■

        let gametime = 0; // 経過時間
        let timelimit = 70; // 制限時間
        let warmup = 7;
        let startstate = false;
        let finishstate = false;
        let stage = 0;
        let point = 100;

        let imagenum = 46; //用意した画像の枚数
        let imagew = 112; //用意した画像の1枚の幅
        let imageh = 96; //用意した画像の1枚の高さ
		let imagescale = 1; //選択する画像の倍率
		let odaiscale = 2; //右に表示するお題の倍率
        let speed = 2;

        let shuffle = [];

        let ans = []; //出題ランダム化
        for (let i = 0; i < imagenum ; i++) {//入れ替え用配列作成
            shuffle[i] = i;
        }
        for (let i = 0; i < imagenum ; i++) {//入れ替え　代入
            let select = g.game.random.get(0, shuffle.length-1);
            ans[i] = shuffle.splice(select,1);
        }


        // レイヤーの生成
        let backlayer = new g.E({ scene: scene, parent: scene });
        let movelayer = new g.E({ scene: scene, parent: scene });
        let uilayer = new g.E({ scene: scene, parent: scene });
        let touchlayer = new g.E({ scene: scene, parent: scene });
        let buttonlayer = new g.E({ scene: scene, parent: scene });

        // フォントの生成
        let glyph = JSON.parse(scene.assets["font_round_glyphs"].data);
        let font = new g.BitmapFont({
            src: scene.assets["font_round"],
            map: glyph,
            defaultGlyphWidth: 96,
            defaultGlyphHeight: 96,
        });


        // ■■■■■■■■■■■■　 開始処理　　■■■■■■■■■■■■


        scene.onUpdate.add(function () {//時間経過
            if (warmup >= 0) warmup -= 1 / g.game.fps;
            if (warmup < 0) startstate = true;
            if (warmup < 0) gametime += 1 / g.game.fps;
        });
        if (musicstate) scene.assets["bgm"].play().changeVolume(0.7);
        scene.setTimeout(function() {
            if (soundstate) scene.assets["se_start"].play().changeVolume(0.7);
        }, 6*1000);//warmupは動的なので固定数を指定

        let countlabel = new g.Label({ // カウントダウンラベル
            scene: scene, text: "", parent: uilayer,
            font: font, fontSize: 96,
            x: g.game.width*0.9, y: g.game.height*0.5,
            anchorX: 0.5, anchorY: 0.5
        });
        countlabel.onUpdate.add(function () {
            if(warmup<=4) {
                if(warmup<=3) {
                    if(warmup<=2) {
                        if(warmup<=1) {
                            if(warmup<=0) {
                                countlabel.text = "" ; countlabel.invalidate();
                            }else{countlabel.text = "Go!" ; countlabel.invalidate();}
                        }else{countlabel.text = "1" ; countlabel.invalidate();}
                    }else{countlabel.text = "2" ; countlabel.invalidate();}
                }else{countlabel.text = "3" ; countlabel.invalidate();}
            }else{countlabel.text = "" ; countlabel.invalidate();}
        });
        let tutorial  = new g.Sprite({ //チュートリアル
        	scene: scene, src: scene.assets["tutorial"], parent: buttonlayer,
        	x: g.game.width/2, y: g.game.height/2,
        	anchorX: 0.5, anchorY: 0.5, opacity: 1,
        });
        scene.onUpdate.add(function () {
            if (startstate) {   tutorial.opacity = 0;
		　　} else {            tutorial.opacity = 1;}
		　　tutorial.modified();
		});


        // ■■■■■■■■■■■■　 メイン描画　　■■■■■■■■■■■■

        let background = new g.FilledRect({ //背景
			scene: scene, cssColor: "white", parent: backlayer,
			x: g.game.width/2, y: g.game.height/2,
			width: g.game.width, height: g.game.height,
			anchorX: 0.5, anchorY: 0.5, opacity: 0.4, touchable: true,
		});
        background.onPointDown.add(function(ev) {
            if (startstate && !finishstate) {
                g.game.vars.gameState.score -= 50;
                if (soundstate) scene.assets["se_hazure"].play().changeVolume(0.6);
            }
        });
        let rightback = new g.FilledRect({ //背景
            scene: scene, cssColor: "white", parent: backlayer,
            x: g.game.width, y: g.game.height/2,
            width: g.game.width*0.2, height: g.game.height,
            anchorX: 1, anchorY: 0.5, opacity: 0.1, touchable: true,
        });
        let find  = new g.Sprite({
        	scene: scene, src: scene.assets["find"], parent: backlayer,
        	x: g.game.width*0.9, y: g.game.height*0.74,
        	anchorX: 0.5, anchorY: 0.5, opacity: 0,
        });
        scene.onUpdate.add(function () {
            if (startstate) {   find.opacity = 1;
		　　} else {            find.opacity = 0;}
		　　find.modified();
		});

        let odai = new g.FrameSprite({
            scene: scene, src: scene.assets["odai"], parent: uilayer,
            x: g.game.width*0.9, y: g.game.height*0.5, scaleX: odaiscale, scaleY: odaiscale,
            width: imagew, height: imageh, srcWidth: imagew, srcHeight: imageh, frames: ans,
            anchorX: 0.5, anchorY: 0.5, opacity: 0, touchable: false,
        });
        scene.onUpdate.add(function () {//お題更新
            odai.frameNumber = stage;
            odai.modified();
            if (startstate) odai.opacity = 1;
        });
        for (let i = 0; i < imagenum; i++) {
            let image = new g.FrameSprite({
                scene: scene, src: scene.assets["odai"], parent: movelayer,
                x: g.game.width,
                y: g.game.height,
                scaleX: imagescale, scaleY: imagescale,
                width: imagew, height: imageh, srcWidth: imagew, srcHeight: imageh, frames: [ans[i]],
                anchorX: 0.5, anchorY: 0.5, opacity: 0, touchable: false,
                tag: 360*g.game.random.generate(),
            });
            image.onPointDown.add(function(ev) {
                if (startstate && !finishstate) {
                    if (i == stage) {
                        g.game.vars.gameState.score += 100;
                        if (soundstate) scene.assets["se_seikai"].play().changeVolume(0.4);
                        stage++;
                        point = 1000;
                    }
                }
            });
            image.onUpdate.add(function () {//画像移動・画像表示ONOFF・タッチ判定更新
                if (i < stage){ image.opacity = 0;
                } else {        image.opacity = 1;}
                if (i == stage){image.touchable = true;
                } else {        image.touchable = false;}
                image.modified();
            });
        }
        scene.onUpdate.add(function () {//ステージ継続ボーナス
            if (startstate && !finishstate && g.game.age%g.game.fps==0) g.game.vars.gameState.score += stage;
        });
        movelayer.children.sort((a, b) => a.tag - b.tag);


        // ■■■■■■■■■■■■　 UI　　■■■■■■■■■■■■

        // チェック用ラベル
        // let checklabel = new g.Label({
        //     scene: scene, text: "", parent: uilayer,
        //     font: font, fontSize: 48,
        //     x: g.game.width*0.2, y: 36,
        //     anchorX: 0, anchorY: 0.5, opacity: 1,
        // });
        // scene.onUpdate.add(function () {
        //     checklabel.text =  "" + ans;
        //     checklabel.invalidate();
        // });
        // スコアラベル
        let scorelabel = new g.Label({
            scene: scene, text: "", parent: uilayer,
            font: font, fontSize: 60,
            x: g.game.width-16, y: 110,
            anchorX: 1,	anchorY: 0.5, opacity: 1,
        });
        scene.onUpdate.add(function () {
            scorelabel.text =  "" + g.game.vars.gameState.score;
            scorelabel.invalidate();
        });
        // 残り時間表示用ラベル
        let clock = new g.Sprite({
            scene: scene,	src: scene.assets["clock_round"], parent: uilayer,
            x: g.game.width*0.85, y: 40, scaleX: 0.4, scaleY: 0.4,
            anchorX: 1,	anchorY: 0.5, opacity: 1,
        });
        let timelabel = new g.Label({
            scene: scene, text: "", parent: uilayer,
            font: font, fontSize: 48,
            x: clock.x, y: clock.y+4,
            anchorX: 0,	anchorY: 0.5,
        });
        scene.onUpdate.add(function () {
            timelabel.text = "" + Math.ceil((timelimit-gametime) * (timelimit>gametime));
            timelabel.invalidate();
        });
        // 残り時間表示用バー
        let timebar = new g.FilledRect({
            scene: scene, cssColor: "lawngreen", parent: uilayer,
            width: g.game.width - 8, height: 8,
            x: 4, y: 4,
            anchorX: 0,	anchorY: 0,
        });
        scene.onUpdate.add(function () {
            timebar.width = (g.game.width - 8) / timelimit * (timelimit-gametime) * (timelimit>gametime);
    		timebar.modified();
        });

        // 音量ボタン
		let soundbutton = new g.FrameSprite({
			scene: scene, src: scene.assets["soundbutton"], parent: buttonlayer,
			x: g.game.width*0.86, y: g.game.height-60, scaleX: 0.7, scaleY: 0.7,
			width: 160, height: 100, srcWidth: 160, srcHeight: 100, frames: [0, 1],
			anchorX: 0.5, anchorY: 0.5, touchable: true,
		});
		let musicbutton = new g.FrameSprite({
			scene: scene, src: scene.assets["musicbutton"], parent: buttonlayer,
            x: g.game.width*0.94, y: g.game.height-60, scaleX: 0.7, scaleY: 0.7,
			width: 160, height: 100, srcWidth: 160, srcHeight: 100, frames: [0, 1],
			anchorX: 0.5, anchorY: 0.5, touchable: true,
		});
		soundbutton.onPointDown.add(function(event) {
			if(soundstate) { soundstate = false;
			}else{ soundstate = true; }
        });
		musicbutton.onPointDown.add(function(event) {
			if(musicstate) { musicstate = false; scene.assets["bgm"].stop();
			}else{ musicstate = true; scene.assets["bgm"].play().changeVolume(0.7); }
        });
		scene.onUpdate.add(function () {
			if(soundstate) { soundbutton.frameNumber = 0; soundbutton.modified();
			}else{ soundbutton.frameNumber = 1; soundbutton.modified(); }
			if(musicstate) { musicbutton.frameNumber = 0; musicbutton.modified();
			}else{ musicbutton.frameNumber = 1; musicbutton.modified(); }
		});


        // ■■■■■■■■■■■■　 終了処理　　■■■■■■■■■■■■

        let finish  = new g.Sprite({ //終了の文字
        	scene: scene, src: scene.assets["finish"], parent: buttonlayer,
        	x: g.game.width/2, y: g.game.height/2,
        	anchorX: 0.5, anchorY: 0.5, opacity: 0,
        });
        scene.onUpdate.add(function () {
            if (finishstate) { finish.opacity = 1;
		　　} else {            finish.opacity = 0;}
		　　finish.modified();
		});

        scene.onUpdate.add(function () { //終了したときに1度だけ処理する内容
            if (!finishstate && gametime > timelimit) {
                finishstate = true;
                if (soundstate) scene.assets["se_finish"].play().changeVolume(0.8);
                if (param.isAtsumaru) {//アツマールのときのみ
                    window.RPGAtsumaru.experimental.scoreboards.setRecord(1, g.game.vars.gameState.score).then(function () {
                        window.RPGAtsumaru.experimental.scoreboards.display(1);
                    });
                }
            }
		});

        if (param.isAtsumaru) {//アツマールのときのみ配置
            let restart = new g.Sprite({ // リスタートボタン
                scene: scene,	src: scene.assets["restart"], parent: buttonlayer,
                x: g.game.width*0.86, y: g.game.height*0.26, scaleX: 1, scaleY: 1,
                anchorX: 0.5,	anchorY: 0.5, touchable: true,
            });
            let ranking = new g.Sprite({ //ランキングボタン
                scene: scene,	src: scene.assets["ranking"], parent: buttonlayer,
                x: g.game.width*0.94, y: g.game.height*0.26, scaleX: 1, scaleY: 1,
                anchorX: 0.5, anchorY: 0.5, touchable: true,
            });
            restart.onPointDown.add(function(event) {// リスタート操作
                g.game.replaceScene(makescene(param));
            });
            ranking.onPointDown.add(function(scene) {// ランキング表示
                window.RPGAtsumaru.experimental.scoreboards.display(1);
            });
        }

        // ここまでゲーム内容を記述します
    });

    // g.game.pushScene(scene);
    return scene;

}
exports.main = main;
