exports.main = void 0;

function main(param) {
	g.game.pushScene(makescene(param));
}

function makescene(param) {
    let mainList = []
    let imagenum = 72;
    for (let i = 1; i <= imagenum; i++){
        mainList.push("main" + i);
    }

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
            textColor: "black"
        });
        scene.append(scoreLabel);
        let closeingLabel = new g.Label({
            scene: scene,
            text: "口が閉じた回数: 0",
            font: font,
            fontSize: font.size / 2,
            anchorY: -1,
            textColor: "black"
        });
        scene.append(closeingLabel);

        let score = 0;
        let closeingcnt = 0;
        let images = new g.FrameSprite({
            scene: scene, src: scene.assets["main" + 1],
            x: g.game.width / 3,opacity: 1
        });
        scene.append(images);
        images.invalidate();
        
        let gametime = 0;
        let gameimage = 0;
        let correction = false;
        // ■■■■■■■■■■■■　 開始処理　　■■■■■■■■■■■■
        scene.onUpdate.add(function () {//時間経過
            gametime += 1 / g.game.fps; 
            if (gametime <= 15){
                gameimage = g.game.random.get(1, imagenum);
                images.src = scene.assets["main" + gameimage];
                images.invalidate();

                switch (gameimage){
                    case 1,10,42,52,68:
                        score += g.game.random.get(1, 10000);
                        closeingcnt += 1;
                        break;

                    case 17:
                        score += 10000;
                        closeingcnt += 1;
                        break;

                    case 13,32,35:
                        score += 10000;
                        break;

                    case 71,72:
                        score += 50000;
                        closeingcnt += 1;
                        break;

                    case 15,36,69:
                        break;

                    default:
                        score += g.game.random.get(1, 10000);
                }
                scoreLabel.text = "SCORE: " + score;
                scoreLabel.invalidate();
                closeingLabel.text = "口が閉じた回数: " + closeingcnt;
                closeingLabel.invalidate();
            }
            else if(correction == false){
                scoreLabel.hide();
                closeingLabel.hide();
                images.hide();
                let scorevar = Math.floor(score * (1 + 0.1 * closeingcnt));
                g.game.vars.gameState.score = scorevar;
                console.log(g.game.vars.gameState.score);
                correction = true;   
            }
        });
    });

    return scene;
}
exports.main = main;
