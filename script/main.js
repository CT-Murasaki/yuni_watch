//■■■■■■■■■■■■　 ここまでコピペ用 　■■■■■■■■■■■■

exports.main = void 0;

function main(param) {
	g.game.pushScene(makescene(param));
}

function makescene(param) {
    let mainList = []
    let imagenum = 126;
    for (let i = 1; i <= imagenum; i++){
        mainList.push("main" + i);
    }
    mainList.push("se_finish");

    let scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: mainList
    });

    // 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
    g.game.vars.gameState = { score: 0 };

    scene.onLoad.add(function () {
        // ここからゲーム内容を記述します

        let font = new g.DynamicFont({
            game: g.game,
            fontFamily: "sans-serif",
            size: 48
        });
        // スコア表示用のラベル
        let scoreLabel = new g.Label({
            scene: scene,
            text: "SCORE: 0",
            font: font,
            fontSize: font.size / 2,
            textColor: "white"
        });
        scene.append(scoreLabel);
        let closeingLabel = new g.Label({
            scene: scene,
            text: "口が閉じた回数: 0",
            font: font,
            fontSize: font.size / 2,
            anchorY: -1,
            textColor: "white"
        });
        scene.append(closeingLabel);

        let score = 0;
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
                        score += g.game.random.get(0, 10000);
                        closeingcnt += 1;
                        break;

                    case 74:
                    case 100:
                        score += 10000;
                        break;

                    case 104:
                        score += 100000;
                        closeingcnt += 1;
                        break;

                    default:
                        score += g.game.random.get(0, 10000);
                }
                scoreLabel.text = "SCORE: " + score;
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
                    g.game.vars.gameState.score = Math.ceil(score + (score * closeingcnt * 0.01));
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
