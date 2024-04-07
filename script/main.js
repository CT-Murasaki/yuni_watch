//■■■■■■■■■■■■　 ここまでコピペ用 　■■■■■■■■■■■■

exports.main = void 0;

function main(param) {
	g.game.pushScene(makescene(param));
}

function makescene(param) {

    var scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: [
            "main1",
            "main2",
            "main3",
            "main4",
            "main5",
            "main6",
            "main7",
            "main8",
            "main9",
            "main10",
            "main11",
            "main12",
            "main13",
            "main14",
            "main15",
            "main16",
            "main17",
            "main18",
            "main19",
            "main20",
            "main21",
            "main22",
            "main23",
            "main24",
            "main25",
            "main26",
            "main27",
            "main28",
            "main29",
            "main30",
            "main31",
            "main32",
            "main33",
            "main34",
            "main35",
            "main36",
            "main37",
            "main38",
            "main39",
            "main40",
            "main41",
            "main42",
            "main43",
            "main44",
            "main45",
            "main46",
            "main47",
            "main48",
            "main49",
            "main50",
            "main51",
            "main52",
            "main53",
            "main54",
            "main55",
            "main56",
            "main57",
            "main58",
            "main59",
            "main60",
            "main61",
            "main62",
            "main63",
            "main64",
            "main65",
            "main66",
            "main67",
            "main68",
            "main69",
            "main70",
            "main71",
            "main72",
            "main73",
            "main74",
            "main75",
            "main76",
            "main77",
            "main78",
            "main79",
            "main80",
            "main81",
            "main82",
            "main83",
            "main84",
            "main85",
            "main86",
            "main87",
            "main88",
            "main89",
            "main90",
            "main91",
            "main92",
            "main93",
            "main94",
            "main95",
            "main96",
            "main97",
            "main98",
            "main99",
            "main100",
            "main101",
            "main102",
            "main103",
            "main104",
            "main105",
            "main106",
            "main107",
            "main108",
            "main109",
            "main110",
            "main111",
            "main112",
            "main113",
            "main114",
            "main115",
            "main116",
            "main117",
            "main118",
            "main119",
            "main120",
            "main121",
            "main122",
            "main123",
            "main124",
            "main125",
            "main126",
            
			//音声ファイルはhttps://github.com/akashic-contents　CC BY 2.1 JP　DWANGO Co., Ltd.
            "se_finish"
	    ]
    });

    // 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
    g.game.vars.gameState = { score: 0 };

    scene.onLoad.add(function () {
        // ここからゲーム内容を記述します

        var font = new g.DynamicFont({
            game: g.game,
            fontFamily: "sans-serif",
            size: 48
        });
        // スコア表示用のラベル
        var scoreLabel = new g.Label({
            scene: scene,
            text: "SCORE: 0",
            font: font,
            fontSize: font.size / 2,
            textColor: "white"
        });
        scene.append(scoreLabel);
        var closeingLabel = new g.Label({
            scene: scene,
            text: "口が閉じた回数: 0",
            font: font,
            fontSize: font.size / 2,
            anchorY: -1,
            textColor: "white"
        });
        scene.append(closeingLabel);

        let imagenum = 126;
        let closeingcnt = 0;
        let images = [];
        for (let i = 1; i <= imagenum; i++) {
            images[i] = new g.FrameSprite({
                scene: scene, src: scene.assets["main" + i],
                x: g.game.width / 3,opacity: 0
            });
            scene.append(images[i]);
        }
        
        let gametime = 0;
        let gameimage = 0;
        let correction = false;
        // ■■■■■■■■■■■■　 開始処理　　■■■■■■■■■■■■
        scene.onUpdate.add(function () {//時間経過
            gametime += 1 / g.game.fps; 
            if (gametime <= 15){
                gameimage = g.game.random.get(1, imagenum);
                images[gameimage].opacity = 1;
                images[gameimage].invalidate();

                switch (gameimage){
                    case 3:
                    case 26:
                    case 60:
                    case 61:
                    case 83:
                    case 87:
                    case 89:
                    case 99:
                    case 114:
                    case 120:
                    case 122:
                    case 123:
                    case 125:
                        g.game.vars.gameState.score += g.game.random.get(0, 10000);
                        closeingcnt += 1;
                        break;

                    case 74:
                    case 100:
                        g.game.vars.gameState.score += 10000;
                        break;

                    case 104:
                        g.game.vars.gameState.score += 100000;
                        closeingcnt += 1;
                        break;

                    default:
                        g.game.vars.gameState.score += g.game.random.get(0, 10000);
                }
                scoreLabel.text = "SCORE: " + g.game.vars.gameState.score;
                scoreLabel.invalidate();
                closeingLabel.text = "口が閉じた回数: " + closeingcnt;
                closeingLabel.invalidate();
                for (let i = 1; i <= imagenum; i++) {
                    if (gameimage != i){
                        images[i].opacity = 0;
                        images[i].invalidate();
                    }  
                }
            }
            else{
                scoreLabel.opacity = 0;
                scoreLabel.invalidate();
                closeingLabel.opacity = 0;
                closeingLabel.invalidate();
                for (let i = 1; i <= imagenum; i++) {
                    images[i].opacity = 0;
                    images[i].invalidate();
                }
                if (correction == false){
                    g.game.vars.gameState.score = Math.ceil(g.game.vars.gameState.score + (g.game.vars.gameState.score * closeingcnt * 0.01));
                    correction = true;
                }
                
            }
        });
        // ■■■■■■■■■■■■　 終了処理　　■■■■■■■■■■■■
        // ここまでゲーム内容を記述します
    });

    return scene;
}
exports.main = main;
