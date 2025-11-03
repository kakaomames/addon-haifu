import { world, system, Entity } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

// 1. スコアボード名とアイテムIDの定義
const SCOREBOARD_OBJ_X = "ev_x";
const SCOREBOARD_OBJ_Y = "ev_y";
const SCOREBOARD_OBJ_Z = "ev_z";
const SETTING_ITEM_ID = "my:ev_setting";

// --- 座標設定ロジック ---

// 2. プレイヤーのアイテム使用イベントを購読
world.events.beforeItemUse.subscribe(event => {
    const player = event.source;
    const item = event.item;

    if (item.typeId === SETTING_ITEM_ID) {
        // デフォルトのアイテム使用アクションをキャンセル
        event.cancel = true;

        // プレイヤーの視線が向いているブロックの情報を取得
        const blockRaycastHit = player.getBlockFromViewDirection();
        
        if (!blockRaycastHit) {
            player.sendMessage("§cブロックを見て使用してください。");
            return;
        }

        // 3. UIを表示して何階の座標を設定するか尋ねる
        showFloorSelectionUI(player, blockRaycastHit.block.location);
    }
});

/**
 * 階層選択UIを表示し、座標設定を実行する関数
 */
function showFloorSelectionUI(player, blockLocation) {
    const form = new ModalFormData()
        .title("🛗 エレベーター座標設定")
        .textField(
            "設定する階層番号 (半角数字 1-10):",
            "例: 3 (3階)",
            ""
        )
        .textField(
            "座標を確認 (編集不可):",
            `X:${blockLocation.x} Y:${blockLocation.y} Z:${blockLocation.z}`,
            ""
        );

    form.show(player).then(response => {
        if (response.canceled) {
            player.sendMessage("§7設定をキャンセルしました。");
            return;
        }

        const floorInput = response.formValues[0].trim();
        const floorNum = parseInt(floorInput);

        if (isNaN(floorNum) || floorNum < 1 || floorNum > 10) {
            player.sendMessage("§c入力された階層番号が不正です。1から10の半角数字を入力してください。");
            return;
        }

        // 4. スコアボードに座標を登録
        const floorId = `ev-${floorNum}`;
        const x_val = blockLocation.x;
        const y_val = blockLocation.y + 1; // ブロックの上（乗る場所）をY座標として登録
        const z_val = blockLocation.z;
        
        // コマンド実行（スコアボードに値を設定）
        player.runCommandAsync(`scoreboard players set ${floorId} ${SCOREBOARD_OBJ_X} ${x_val}`);
        player.runCommandAsync(`scoreboard players set ${floorId} ${SCOREBOARD_OBJ_Y} ${y_val}`);
        player.runCommandAsync(`scoreboard players set ${floorId} ${SCOREBOARD_OBJ_Z} ${z_val}`);

        player.sendMessage(`§a✅ ${floorNum}階 の座標を登録しました！`);
        player.sendMessage(`§7(${x_val}, ${y_val}, ${z_val})`);
    });
}

// --- エレベーター操作・移動ロジック ---

// 5. エレベーターエンティティの使用を検知
world.events.beforeItemUseOnEntity.subscribe(event => {
    const player = event.source;
    const targetEntity = event.target;

    // 対象がエレベーターエンティティか確認
    if (targetEntity.typeId === "myaddon:elevator") {
        event.cancel = true;
        
        // 階層選択UIを表示
        showFloorMoveUI(player, targetEntity);
    }
});

/**
 * 階層選択UIを表示し、エレベーター移動を実行する関数
 */
function showFloorMoveUI(player, elevatorEntity) {
    const form = new ModalFormData()
        .title("🛗 移動階層の選択")
        .textField(
            "行きたい階層番号 (半角数字 1-10):",
            "例: 5",
            ""
        );

    form.show(player).then(response => {
        if (response.canceled) {
            player.sendMessage("§7操作をキャンセルしました。");
            return;
        }

        const floorInput = response.formValues[0].trim();
        const targetFloorNum = parseInt(floorInput);
        
        if (isNaN(targetFloorNum) || targetFloorNum < 1 || targetFloorNum > 10) {
            player.sendMessage("§c不正な階層番号です。1から10の半角数字を入力してください。");
            return;
        }

        const floorId = `ev-${targetFloorNum}`;
        
        // 6. スコアボードから目標座標を取得
        system.run(() => {
            try {
                // スコアボードから座標を取得するコマンドを実行
                const getX = player.runCommand(`scoreboard players get ${floorId} ${SCOREBOARD_OBJ_X}`).result;
                const getY = player.runCommand(`scoreboard players get ${floorId} ${SCOREBOARD_OBJ_Y}`).result;
                const getZ = player.runCommand(`scoreboard players get ${floorId} ${SCOREBOARD_OBJ_Z}`).result;

                // コマンド結果から値を取得 (scoreを整数値として取得)
                const targetX = getX.details[0].score;
                const targetY = getY.details[0].score;
                const targetZ = getZ.details[0].score;

                // 7. 移動ロジックを起動
                startElevatorMovement(elevatorEntity, targetX, targetY, targetZ, targetFloorNum);
                
            } catch (e) {
                player.sendMessage(`§cエラー: ${targetFloorNum}階の座標が登録されていません。`);
            }
        });
    });
}


/**
 * エレベーターを滑らかに移動させる関数
 */
function startElevatorMovement(elevatorEntity, targetX, targetY, targetZ, targetFloorNum) {
    const currentLoc = elevatorEntity.location;
    const currentY = currentLoc.y;
    
    // Y座標の移動距離を算出
    const totalDistanceY = targetY - currentY;
    
    if (Math.abs(totalDistanceY) < 0.1) {
        elevatorEntity.sendMessage(`§e既に${targetFloorNum}階にいます。`);
        return;
    }
    
    // 移動設定
    const durationTicks = 100; // 5秒で移動
    let currentTick = 0;
    
    // X, Zはスコアボードの値を使用 (ブロックの中心に合わせる)
    const targetMoveX = targetX + 0.5;
    const targetMoveZ = targetZ + 0.5;

    elevatorEntity.sendMessage(`§a${targetFloorNum}階へ移動を開始します...`);

    // 1. ドアを開けるアニメーションイベントを送信
    elevatorEntity.triggerEvent("myaddon:open_door");

    // 2. 数ティック待ってから移動を開始
    system.runTimeout(() => {
        
        const tickMove = system.runInterval(() => {
            currentTick++;
            if (currentTick > durationTicks) {
                system.clearRun(tickMove);
                
                // 移動完了後の処理
                elevatorEntity.triggerEvent("myaddon:close_door");
                elevatorEntity.sendMessage(`§a${targetFloorNum}階に到着しました。`); 
                return;
            }

            // 毎ティックの移動量 (dy)
            const dy = totalDistanceY / durationTicks; 
            
            // 8. エレベーターを移動 (X, Zは固定、Yは毎ティック変化)
            const newY = currentY + (dy * currentTick);

            // プレイヤーが一緒に移動するように、Entity.teleportを使用
            elevatorEntity.teleport({ x: targetMoveX, y: newY, z: targetMoveZ }, elevatorEntity.dimension);
            
            // 9. エレベーター上のエンティティも一緒に移動させるロジック
            const entities = elevatorEntity.dimension.getEntities({
                location: elevatorEntity.location,
                maxDistance: 2,
                excludeTypes: ["myaddon:elevator"] // 自分自身を除く
            });

            for (const entity of entities) {
                // プレイヤーの足元の座標がエレベーターの上面とほぼ一致するかをチェック
                const entityLoc = entity.location;
                // Y座標だけ dy だけ移動させる
                entity.teleport({ x: entityLoc.x, y: entityLoc.y + dy, z: entityLoc.z }, entity.dimension);
            }

        }, 1); // 1ティックごとに実行
        
    }, 20); // ドアが開くのを待つ (20ティック = 1秒)
}
