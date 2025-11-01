import { world, system, EntityTypes, BlockPermutation } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

// リアルレールV2 描画範囲
const rail_dist2_low = 2304
const rail_dist2_high = 5184
// カスタムアニメーション再生再開範囲
const visible_dist_2 = 4096
//線路長最小単位
const rail_unit_size = 0.5
// 懸垂式モノレールホームドア検知範囲
const js_high = 0
const je_high = 4
const js_low = -5
const je_low = -1           
// 奈落高さ
const KILL_HEIGHT=world.getDimension("overworld").heightRange.min

//ハフマン符号化テーブル
const RAIL_HUFFMAN_TABLE=new Map([
[ -5, '00000' ] ,
[ 5, '00001' ] ,
[ 9, '000100' ] ,
[ -20, '00010100' ] ,
[ 20, '00010101' ] ,
[ 66, '000101100000' ] ,
[ 86, '0001011000010' ] ,
[ -142, '000101100001100' ] ,
[ 142, '000101100001101' ] ,
[ -110, '00010110000111' ] ,
[ -50, '00010110001' ] ,
[ 50, '00010110010' ] ,
[ 110, '00010110011000' ] ,
[ -141, '000101100110010' ] ,
[ 141, '000101100110011' ] ,
[ -85, '0001011001101' ] ,
[ 85, '0001011001110' ] ,
[ -180, '0001011001111000' ] ,
[ 180, '0001011001111001' ] ,
[ -179, '0001011001111010' ] ,
[ 179, '0001011001111011' ] ,
[ -140, '000101100111110' ] ,
[ 140, '000101100111111' ] ,
[ -65, '000101101000' ] ,
[ 65, '000101101001' ] ,
[ -109, '00010110101000' ] ,
[ 109, '00010110101001' ] ,
[ -84, '0001011010101' ] ,
[ 84, '0001011010110' ] ,
[ -178, '0001011010111000' ] ,
[ 178, '0001011010111001' ] ,
[ -139, '000101101011101' ] ,
[ 139, '000101101011110' ] ,
[ -177, '0001011010111110' ] ,
[ 177, '0001011010111111' ] ,
[ -37, '0001011011' ] ,
[ 37, '0001011100' ] ,
[ -49, '00010111010' ] ,
[ 49, '00010111011' ] ,
[ -27, '000101111' ] ,
[ 27, '000110000' ] ,
[ -108, '00011000100000' ] ,
[ 108, '00011000100001' ] ,
[ -138, '000110001000100' ] ,
[ 138, '000110001000101' ] ,
[ -107, '00011000100011' ] ,
[ -64, '000110001001' ] ,
[ 64, '000110001010' ] ,
[ -83, '0001100010110' ] ,
[ 83, '0001100010111' ] ,
[ 107, '00011000110000' ] ,
[ -176, '0001100011000100' ] ,
[ 176, '0001100011000101' ] ,
[ -137, '000110001100011' ] ,
[ 137, '000110001100100' ] ,
[ -175, '0001100011001010' ] ,
[ 175, '0001100011001011' ] ,
[ -106, '00011000110011' ] ,
[ 106, '00011000110100' ] ,
[ -174, '0001100011010100' ] ,
[ 174, '0001100011010101' ] ,
[ -136, '000110001101011' ] ,
[ -82, '0001100011011' ] ,
[ -48, '00011000111' ] ,
[ -19, '00011001' ] ,
[ -13, '0001101' ] ,
[ 13, '0001110' ] ,
[ 19, '00011110' ] ,
[ 48, '00011111000' ] ,
[ -63, '000111110010' ] ,
[ 63, '000111110011' ] ,
[ -36, '0001111101' ] ,
[ 36, '0001111110' ] ,
[ 82, '0001111111000' ] ,
[ 136, '000111111100100' ] ,
[ -173, '0001111111001010' ] ,
[ 173, '0001111111001011' ] ,
[ -135, '000111111100110' ] ,
[ 135, '000111111100111' ] ,
[ -105, '00011111110100' ] ,
[ 105, '00011111110101' ] ,
[ -81, '0001111111011' ] ,
[ 81, '0001111111100' ] ,
[ -172, '0001111111101000' ] ,
[ 172, '0001111111101001' ] ,
[ -134, '000111111110101' ] ,
[ 134, '000111111110110' ] ,
[ -171, '0001111111101110' ] ,
[ 171, '0001111111101111' ] ,
[ -62, '000111111111' ] ,
[ -8, '001000' ] ,
[ 8, '001001' ] ,
[ -26, '001010000' ] ,
[ 26, '001010001' ] ,
[ -47, '00101001000' ] ,
[ 47, '00101001001' ] ,
[ 62, '001010010100' ] ,
[ -104, '00101001010100' ] ,
[ 104, '00101001010101' ] ,
[ -80, '0010100101011' ] ,
[ 80, '0010100101100' ] ,
[ -133, '001010010110100' ] ,
[ 133, '001010010110101' ] ,
[ -170, '0010100101101100' ] ,
[ 170, '0010100101101101' ] ,
[ -169, '0010100101101110' ] ,
[ 169, '0010100101101111' ] ,
[ -61, '001010010111' ] ,
[ -35, '0010100110' ] ,
[ 35, '0010100111' ] ,
[ -18, '00101010' ] ,
[ 18, '00101011' ] ,
[ 61, '001011000000' ] ,
[ -103, '00101100000100' ] ,
[ 103, '00101100000101' ] ,
[ -132, '001011000001100' ] ,
[ 132, '001011000001101' ] ,
[ -168, '0010110000011100' ] ,
[ 168, '0010110000011101' ] ,
[ -131, '001011000001111' ] ,
[ -46, '00101100001' ] ,
[ 46, '00101100010' ] ,
[ -79, '0010110001100' ] ,
[ 79, '0010110001101' ] ,
[ -102, '00101100011100' ] ,
[ 102, '00101100011101' ] ,
[ 131, '001011000111100' ] ,
[ -167, '0010110001111010' ] ,
[ 167, '0010110001111011' ] ,
[ -130, '001011000111110' ] ,
[ 130, '001011000111111' ] ,
[ -25, '001011001' ] ,
[ 25, '001011010' ] ,
[ -60, '001011011000' ] ,
[ 60, '001011011001' ] ,
[ -101, '00101101101000' ] ,
[ 101, '00101101101001' ] ,
[ -78, '0010110110101' ] ,
[ 78, '0010110110110' ] ,
[ -166, '0010110110111000' ] ,
[ 166, '0010110110111001' ] ,
[ -129, '001011011011101' ] ,
[ 129, '001011011011110' ] ,
[ -165, '0010110110111110' ] ,
[ 165, '0010110110111111' ] ,
[ -34, '0010110111' ] ,
[ -12, '0010111' ] ,
[ -4, '00110' ] ,
[ 4, '00111' ] ,
[ 12, '0100000' ] ,
[ 34, '0100001000' ] ,
[ -45, '01000010010' ] ,
[ 45, '01000010011' ] ,
[ -100, '01000010100000' ] ,
[ 100, '01000010100001' ] ,
[ -77, '0100001010001' ] ,
[ -59, '010000101001' ] ,
[ 59, '010000101010' ] ,
[ 77, '0100001010110' ] ,
[ -164, '0100001010111000' ] ,
[ 164, '0100001010111001' ] ,
[ -128, '010000101011101' ] ,
[ 128, '010000101011110' ] ,
[ -163, '0100001010111110' ] ,
[ 163, '0100001010111111' ] ,
[ -33, '0100001011' ] ,
[ 33, '0100001100' ] ,
[ -99, '01000011010000' ] ,
[ 99, '01000011010001' ] ,
[ -127, '010000110100100' ] ,
[ 127, '010000110100101' ] ,
[ -162, '0100001101001100' ] ,
[ 162, '0100001101001101' ] ,
[ -126, '010000110100111' ] ,
[ -76, '0100001101010' ] ,
[ 76, '0100001101011' ] ,
[ -44, '01000011011' ] ,
[ -24, '010000111' ] ,
[ -7, '010001' ] ,
[ 7, '010010' ] ,
[ -17, '01001100' ] ,
[ 17, '01001101' ] ,
[ 24, '010011100' ] ,
[ 44, '01001110100' ] ,
[ -58, '010011101010' ] ,
[ 58, '010011101011' ] ,
[ -98, '01001110110000' ] ,
[ 98, '01001110110001' ] ,
[ 126, '010011101100100' ] ,
[ -161, '0100111011001010' ] ,
[ 161, '0100111011001011' ] ,
[ -125, '010011101100110' ] ,
[ 125, '010011101100111' ] ,
[ -75, '0100111011010' ] ,
[ 75, '0100111011011' ] ,
[ -97, '01001110111000' ] ,
[ 97, '01001110111001' ] ,
[ -160, '0100111011101000' ] ,
[ 160, '0100111011101001' ] ,
[ -159, '0100111011101010' ] ,
[ 159, '0100111011101011' ] ,
[ -124, '010011101110110' ] ,
[ 124, '010011101110111' ] ,
[ -57, '010011101111' ] ,
[ 57, '010011110000' ] ,
[ -96, '01001111000100' ] ,
[ 96, '01001111000101' ] ,
[ -74, '0100111100011' ] ,
[ -43, '01001111001' ] ,
[ -32, '0100111101' ] ,
[ 32, '0100111110' ] ,
[ 43, '01001111110' ] ,
[ 74, '0100111111100' ] ,
[ -158, '0100111111101000' ] ,
[ 158, '0100111111101001' ] ,
[ -123, '010011111110101' ] ,
[ 123, '010011111110110' ] ,
[ -157, '0100111111101110' ] ,
[ 157, '0100111111101111' ] ,
[ -95, '01001111111100' ] ,
[ 95, '01001111111101' ] ,
[ -73, '0100111111111' ] ,
[ -11, '0101000' ] ,
[ 11, '0101001' ] ,
[ -23, '010101000' ] ,
[ 23, '010101001' ] ,
[ -16, '01010101' ] ,
[ 16, '01010110' ] ,
[ -56, '010101110000' ] ,
[ 56, '010101110001' ] ,
[ 73, '0101011100100' ] ,
[ -122, '010101110010100' ] ,
[ 122, '010101110010101' ] ,
[ -156, '0101011100101100' ] ,
[ 156, '0101011100101101' ] ,
[ -121, '010101110010111' ] ,
[ -94, '01010111001100' ] ,
[ 94, '01010111001101' ] ,
[ 121, '010101110011100' ] ,
[ -155, '0101011100111010' ] ,
[ 155, '0101011100111011' ] ,
[ -154, '0101011100111100' ] ,
[ 154, '0101011100111101' ] ,
[ -120, '010101110011111' ] ,
[ -42, '01010111010' ] ,
[ 42, '01010111011' ] ,
[ -31, '0101011110' ] ,
[ 31, '0101011111' ] ,
[ -3, '01011' ] ,
[ 3, '01100' ] ,
[ -6, '011010' ] ,
[ 6, '011011' ] ,
[ -2, '0111' ] ,
[ -1, '1000' ] ,
[ 1, '1001' ] ,
[ 2, '1010' ] ,
[ -72, '1011000000000' ] ,
[ 72, '1011000000001' ] ,
[ -55, '101100000001' ] ,
[ 55, '101100000010' ] ,
[ -93, '10110000001100' ] ,
[ 93, '10110000001101' ] ,
[ 120, '101100000011100' ] ,
[ -153, '1011000000111010' ] ,
[ 153, '1011000000111011' ] ,
[ -119, '101100000011110' ] ,
[ 119, '101100000011111' ] ,
[ -41, '10110000010' ] ,
[ 41, '10110000011' ] ,
[ -22, '101100001' ] ,
[ 22, '101100010' ] ,
[ -71, '1011000110000' ] ,
[ 71, '1011000110001' ] ,
[ -92, '10110001100100' ] ,
[ 92, '10110001100101' ] ,
[ -152, '1011000110011000' ] ,
[ 152, '1011000110011001' ] ,
[ -118, '101100011001101' ] ,
[ 118, '101100011001110' ] ,
[ -151, '1011000110011110' ] ,
[ 151, '1011000110011111' ] ,
[ -54, '101100011010' ] ,
[ 54, '101100011011' ] ,
[ -30, '1011000111' ] ,
[ -10, '1011001' ] ,
[ 10, '1011010' ] ,
[ 30, '1011011000' ] ,
[ -91, '10110110010000' ] ,
[ 91, '10110110010001' ] ,
[ -70, '1011011001001' ] ,
[ 70, '1011011001010' ] ,
[ -117, '101101100101100' ] ,
[ 117, '101101100101101' ] ,
[ -150, '1011011001011100' ] ,
[ 150, '1011011001011101' ] ,
[ -149, '1011011001011110' ] ,
[ 149, '1011011001011111' ] ,
[ -53, '101101100110' ] ,
[ 53, '101101100111' ] ,
[ -40, '10110110100' ] ,
[ 40, '10110110101' ] ,
[ -116, '101101101100000' ] ,
[ 116, '101101101100001' ] ,
[ -90, '10110110110001' ] ,
[ 90, '10110110110010' ] ,
[ -148, '1011011011001100' ] ,
[ 148, '1011011011001101' ] ,
[ -115, '101101101100111' ] ,
[ -69, '1011011011010' ] ,
[ 69, '1011011011011' ] ,
[ 115, '101101101110000' ] ,
[ -147, '1011011011100010' ] ,
[ 147, '1011011011100011' ] ,
[ -89, '10110110111001' ] ,
[ 89, '10110110111010' ] ,
[ -114, '101101101110110' ] ,
[ 114, '101101101110111' ] ,
[ -52, '101101101111' ] ,
[ -15, '10110111' ] ,
[ 15, '10111000' ] ,
[ -21, '101110010' ] ,
[ 21, '101110011' ] ,
[ -29, '1011101000' ] ,
[ 29, '1011101001' ] ,
[ 52, '101110101000' ] ,
[ -68, '1011101010010' ] ,
[ 68, '1011101010011' ] ,
[ -39, '10111010101' ] ,
[ 39, '10111010110' ] ,
[ -88, '10111010111000' ] ,
[ 88, '10111010111001' ] ,
[ -146, '1011101011101000' ] ,
[ 146, '1011101011101001' ] ,
[ -145, '1011101011101010' ] ,
[ 145, '1011101011101011' ] ,
[ -113, '101110101110110' ] ,
[ 113, '101110101110111' ] ,
[ -67, '1011101011110' ] ,
[ 67, '1011101011111' ] ,
[ -87, '10111011000000' ] ,
[ 87, '10111011000001' ] ,
[ -144, '1011101100001000' ] ,
[ 144, '1011101100001001' ] ,
[ -112, '101110110000101' ] ,
[ 112, '101110110000110' ] ,
[ -143, '1011101100001110' ] ,
[ 143, '1011101100001111' ] ,
[ -51, '101110110001' ] ,
[ 51, '101110110010' ] ,
[ -111, '101110110011000' ] ,
[ 111, '101110110011001' ] ,
[ -86, '10111011001101' ] ,
[ -66, '1011101100111' ] ,
[ -38, '10111011010' ] ,
[ 38, '10111011011' ] ,
[ -28, '1011101110' ] ,
[ 28, '1011101111' ] ,
[ -14, '10111100' ] ,
[ 14, '10111101' ] ,
[ -9, '1011111' ] ,
[ 0, '11' ] ,
]);

let players_g = []
let bodies_g = []
let active_tickers=[]


//スコアボードオブジェクト取得
let obj_mtc_spd
let obj_maxSpd
let obj_accDA
let obj_accDB
let obj_mtc_accN
let obj_not
let obj_mtc_air
let obj_mtc_Rspd
let obj_mtc_up
let obj_notBM
let obj_notAM
let obj_mtc_sid
let obj_mtc_fid
let obj_mtc_uid
let obj_mtc_parent
let obj_mtc_maku
let obj_mtc_rot
let obj_mtc_gradacc
let obj_mtc_prenot
let obj_mtc_not
let obj_mtc_ato
let obj_mtc_ats
let obj_mtc_dist
let obj_mtc_global
let obj_mtc_dd
let obj_mtc_max_door_mode

function loadObjs() {
    obj_mtc_spd = world.scoreboard.getObjective("mtc_spd")
    obj_maxSpd = world.scoreboard.getObjective("mtc_spdMax")
    obj_accDA = world.scoreboard.getObjective("mtc_accDA")
    obj_accDB = world.scoreboard.getObjective("mtc_accDB")
    obj_mtc_accN = world.scoreboard.getObjective("mtc_accN")
    obj_not = world.scoreboard.getObjective("mtc_not")
    obj_mtc_air = world.scoreboard.getObjective("mtc_air")
    obj_mtc_Rspd = world.scoreboard.getObjective("mtc_Rspd")
    obj_mtc_up = world.scoreboard.getObjective("mtc_up")
    obj_notBM = world.scoreboard.getObjective("mtc_notBM")
    obj_notAM = world.scoreboard.getObjective("mtc_notAM")
    obj_mtc_sid = world.scoreboard.getObjective("mtc_sid")
    obj_mtc_fid = world.scoreboard.getObjective("mtc_fid")
    obj_mtc_uid = world.scoreboard.getObjective("mtc_uid")
    obj_mtc_parent = world.scoreboard.getObjective("mtc_parent")
    obj_mtc_maku = world.scoreboard.getObjective("mtc_maku")
    obj_mtc_rot = world.scoreboard.getObjective("mtc_rot")
    obj_mtc_gradacc = world.scoreboard.getObjective("mtc_gradacc")
    obj_mtc_prenot = world.scoreboard.getObjective("mtc_prenot")
    obj_mtc_not = world.scoreboard.getObjective("mtc_not")
    obj_mtc_ato = world.scoreboard.getObjective("mtc_ato")
    obj_mtc_ats = world.scoreboard.getObjective("mtc_ats")
    obj_mtc_dist = world.scoreboard.getObjective("mtc_dist")
    obj_mtc_global = world.scoreboard.getObjective("mtc_global")
    obj_mtc_dd = world.scoreboard.getObjective("mtc_dd")
    obj_mtc_max_door_mode = world.scoreboard.getObjective("mtc_max_door_mode")
}

loadObjs()

//レール情報取得
console.log("Collecting Objects")
//デフォルトのレール順序固定
let rail_types = ["def0", "def1", "def2", "def3", "def4", "def5", "def6", "def7", "def8", "def9", "def10", "def11"]
let n_rail_type = rail_types.length
const ent_list = EntityTypes.getAll()
for (const ent_type of ent_list) {
    const type_id = ent_type.id
    if (type_id.slice(0, 9) === "mtc:rail_") {
        const addType = type_id.slice(9)
        let existRail = false
        for (const exiType of rail_types) {
            if (exiType === addType) {
                existRail = true
                break
            }
        }
        if (!existRail) {
            rail_types.push(addType)
            n_rail_type++
        }
    }
}

let pre_n_rails = world.getDynamicProperty("pre_r_rails")
if (pre_n_rails !== n_rail_type) {
    world.setDynamicProperty("pre_r_rails", n_rail_type)
    for (let i = 0; i < n_rail_type; i++) {
        world.setDynamicProperty("n_rail_used" + i, 1 / n_rail_type)
    }
}

console.log("Done! " + n_rail_type + " rails found!")


world.getDimension("overworld").runCommandAsync("function mtc/worldboot")

//架線柱情報
let pole_types = ["def0", "def1"]
let n_pole_type = pole_types.length
const poent_list = EntityTypes.getAll()
for (const ent_type of poent_list) {
    const type_id = ent_type.id
    if (type_id.slice(0, 9) === "mtc:pole_") {
        const addType = type_id.slice(9)
        let existPole = false
        for (const exiType of pole_types) {
            if (exiType === addType) {
                existPole = true
                break
            }
        }
        if (!existPole) {
            pole_types.push(addType)
            n_pole_type++
        }
    }
}

let pre_n_poles = world.getDynamicProperty("pre_r_poles")
if (pre_n_poles !== n_pole_type) {
    world.setDynamicProperty("pre_r_poles", n_pole_type)
    for (let i = 0; i < n_pole_type; i++) {
        world.setDynamicProperty("n_pole_used" + i, 1 / n_pole_type)
    }
}

console.log("Done! " + n_pole_type + " poles found!")



//車両情報
let all_cars = []
for (const ent_type of ent_list) {
    const type_id = ent_type.id
    if ((type_id.slice(0, 7) === "mtc:mtc" || type_id.slice(0, 7) === "mtc:mcs") && type_id.slice(0, 8) !== "mtc:mtc_") {
        all_cars.push(type_id)
    }
}
all_cars.sort()
console.log("" + all_cars.length + " bodies found!")


const sleep = (time) => new Promise((r) => system.runTimeout(r, time));


//プレイヤidをキーにして周辺bodyを出す
//アニメーション再生補正用
let ents_around_ids = {}
const tick_init = system.currentTick


function showMTCmenu0(player) {
    //乗務確認
    player.runCommand("function mtc/testBoard")
    player.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_calcj1 = @s mtc_calc1")
    const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", player)

    let ent = player
    if (ents.length != 0) {
        ent = ents[0]
    }

    const form_home = new ActionFormData();
    form_home.title({ "translate": "mtc:mtc.ui.controll" })

    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.stop" }] }, "textures/mtc_icons/stop")


    if (ent.hasTag("mtc_open")) {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.doorC" }] }, "textures/mtc_items/doorC")
    } else {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.doorO" }, { "text": " >" }] }, "textures/mtc_items/doorO")
    }
    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.horn" }, { "text": " >" }] }, "textures/mtc_items/horn")
    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.sound" }, { "text": " >" }] }, "textures/mtc_items/sound")
    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.maku" }, { "text": " >" }] }, "textures/mtc_items/mode")
    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.ani" }, { "text": " >" }] }, "textures/mtc_items/ani")

    if(ent.getProperty("mtc:door_mode")!==undefined){
        if (!obj_mtc_max_door_mode.hasParticipant(ent)) {
            obj_mtc_max_door_mode.setScore(ent,1)
        }
        if(obj_mtc_max_door_mode.getScore(ent)>=2){
            form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.door_mode" }, { "text": " >" }] }, "textures/mtc_items/door_mode")
        }
    }


    form_home.show(player).then(re => {
        if (re.cancelationReason === "UserBusy") showMTCmenu0(player);
        const car = getNearestCar(player)
        switch (re.selection) {
            case 0:
                ent.runCommand("scoreboard players operation @s mtc_not = @s mtc_notBM")
                ent.runCommand("tag @s add mtc_mas_v2")
                ent.runCommand("scoreboard players set @s mtc_ato -1")
                ent.runCommand("scoreboard players set @s mtc_spd 0")
                player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.stop" }] })
                break;

            case 1:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {

                    player.runCommand("function mtc/testBoard")
                    const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calcj1=0},c=1]", player)
                    if (ents.length == 0) {
                        player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                    } else {
                        const ent = ents[0]
                        if (ent.hasTag("mtc_open")) {
                            command(player, "function mtc/doorB")
                        } else {
                            showMTCmenu1_1(player);
                        }
                    }
                }
                break;
            case 2:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {

                    showMTCmenu1_5(player);
                }
                break;
            case 3:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {

                    showMTCmenu1_4(player);
                }
                break;
            case 4:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {

                    showMTCmenu1_2(player);
                }
                break;
            case 5:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {

                    showMTCmenu1_3(player);
                }
                break;
            case 6:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {
                    showMTCmenu1_6(player);
                }
                break;
        }
    });
}


//ドア
function showMTCmenu1_1(player) {
    //乗務確認
    player.runCommand("function mtc/testBoard")
    const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", player)

    if (ents.length == 0) {
        player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
    } else {
        const ent = ents[0]
        const form_home = new ActionFormData();
        form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.door" }] })

        if (ent.hasTag("mtc_bus")) {
            form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.doorFr" }] }, "textures/mtc_icons/doorFr")
            form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.doorBa" }] }, "textures/mtc_icons/doorBa")
            form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.doorBB" }] }, "textures/mtc_icons/doorBB")
        } else {
            form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.doorL" }] }, "textures/mtc_icons/doorL")
            form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.doorR" }] }, "textures/mtc_icons/doorR")
            form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.doorB" }] }, "textures/mtc_icons/doorB")
        }
        form_home.button({ rawtext: [{ "text": "< " }, { "translate": "mtc:mtc.ui.back" }] })
        form_home.show(player).then(re => {
            if (re.cancelationReason === "UserBusy") showMTCmenu1_1(player);
            switch (re.selection) {
                case 0:
                    command(player, "function mtc/doorL")
                    break;
                case 1:
                    command(player, "function mtc/doorR")
                    break;
                case 2:
                    command(player, "function mtc/doorB")
                    break;
                case 3:
                    showMTCmenu0(player)
                    break;
            }
        });
    }
}

//幕操作
function showMTCmenu1_2(player) {

    //乗務確認
    player.runCommand("function mtc/testBoard")
    const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", player)

    if (ents.length == 0) {
        player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
    } else {
        const ent = ents[0]
        const sc_makuM = world.scoreboard.getObjective("mtc_makuM").getScore(ent);
        const sc_maku_now = world.scoreboard.getObjective("mtc_maku").getScore(ent);

        const form_home = new ActionFormData();
        form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.maku" }] })

        for (let i = 1; i <= sc_makuM; i++) {
            let now = ""
            if (sc_maku_now + 1 == i) {
                now = " *"
            }
            form_home.button({ rawtext: [{ "translate": "mtc:" + getIdBase(ent.typeId) + ".Mode" + i }, { "text": now }] })
        }

        form_home.button({ rawtext: [{ "text": "< " }, { "translate": "mtc:mtc.ui.back" }] })

        form_home.show(player).then(re => {
            if (re.cancelationReason === "UserBusy") showMTCmenu1_2(player);
            if (re.selection < sc_makuM && re.selection >= 0) {
                ent.runCommand("scoreboard players set @s mtc_maku " + re.selection)
                ent.runCommand("tag @s add mtc_mode_v2")
            } else if (re.selection === sc_makuM) {
                showMTCmenu0(player)
            }
        });
    }
}

//カスタムアニメーション
function showMTCmenu1_3(player) {
    //乗務確認
    player.runCommand("function mtc/testBoard")
    player.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_calcj1 = @s mtc_calc1")
    const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", player)

    if (ents.length == 0) {
        player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
    } else {
        const ent = ents[0]
        let n_anis = world.scoreboard.getObjective("mtc_max_ani").getScore(ent)
        if (n_anis === undefined) {
            n_anis = 2
        }

        const form_home = new ActionFormData();
        form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.ani" }] })

        for (let i = 1; i <= n_anis; i++) {
            let now = ""
            if (ent.getDynamicProperty("ani" + i) === 1) {
                now = "mtc:mtc.ui.now_on"
            } else {
                now = "mtc:mtc.ui.now_off"
            }
            form_home.button({ rawtext: [{ "translate": "mtc:" + getIdBase(ent.typeId) + ".Ani" + i }, { "text": " : " }, { "translate": now }] })
        }

        form_home.button({ rawtext: [{ "text": "< " }, { "translate": "mtc:mtc.ui.back" }] })

        form_home.show(player).then(re => {
            if (re.cancelationReason === "UserBusy") showMTCmenu1_3(player);
            if (re.selection < n_anis && re.selection >= 0) {
                const ani_id = 1 + re.selection
                player.runCommand("execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc2 = @s mtc_fid")
                player.runCommand("scoreboard players operation @e[family=mtc_body] mtc_calc2 -= @e[family=mtc_body,tag=mtc_parent,scores={mtc_calcj1=0},c=1] mtc_fid")
                const ents2 = getSelectorEntities("@e[family=mtc_body,scores={mtc_calc2=0}]", player)
                const entb = getSelectorEntities("@e[family=mtc_body,scores={mtc_calc2=0},tag=mtc_parent]", player)[0]
                const before_state = entb.getDynamicProperty("ani" + ani_id)
                for (const ent of ents2) {
                    if (before_state === 1) {
                        entb.removeTag("mtc_ani" + ani_id)
                        ent.setDynamicProperty("ani" + ani_id, 0)
                        stopAni(ent, "ani" + ani_id)
                        playAni(ent, "ani" + ani_id + "e", "ani" + ani_id)
                        try { ent.runCommand(`function ${getIdBase(ent.typeId)}/ani/ani${ani_id}e`) } catch (e) { }
                        const name = getIdBase(ent.typeId)
                        ent.dimension.playSound(name + "_ani" + ani_id + "e", ent.location, { volume: 256 })
                    } else {
                        entb.addTag("mtc_ani" + ani_id)
                        ent.setDynamicProperty("ani" + ani_id, 1)
                        playAni(ent, "ani" + ani_id, "ani" + ani_id)
                        try { ent.runCommand(`function ${getIdBase(ent.typeId)}/ani/ani${ani_id}`) } catch (e) { }
                        const name = getIdBase(ent.typeId)
                        ent.dimension.playSound(name + "_ani" + ani_id, ent.location, { volume: 256 })
                    }
                }
            } else if (re.selection === n_anis) {
                showMTCmenu0(player)
            }
        });
    }
}

//ループ再生
function showMTCmenu1_4(player) {
    //乗務確認
    player.runCommand("function mtc/testBoard")
    const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", player)

    if (ents.length == 0) {
        player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
    } else {
        const ent = ents[0]
        let n_sounds = world.scoreboard.getObjective("mtc_max_sound").getScore(ent)
        if (n_sounds === undefined) {
            n_sounds = 1
        }

        const form_home = new ActionFormData();
        form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.sound" }] })

        for (let i = 1; i <= n_sounds; i++) {
            let now = ""
            if (ent.getDynamicProperty("sound" + i) === 1) {
                now = "mtc:mtc.ui.now_on"
            } else {
                now = "mtc:mtc.ui.now_off"
            }
            form_home.button({ rawtext: [{ "translate": "mtc:" + getIdBase(ent.typeId) + ".Sound" + i }, { "text": " : " }, { "translate": now }] })
        }

        form_home.button({ rawtext: [{ "text": "< " }, { "translate": "mtc:mtc.ui.back" }] })

        form_home.show(player).then(re => {
            if (re.cancelationReason === "UserBusy") showMTCmenu1_3(player);
            if (re.selection < n_sounds && re.selection >= 0) {
                const sound_id = 1 + re.selection
                player.runCommand("function mtc/testBoard")
                const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", player)

                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {
                    const entb = ents[0]
                    const ents2 = getFormation(entb)
                    const before_state = entb.getDynamicProperty("sound" + sound_id)
                    if (before_state === 1) {
                        loopSoundOff(ents2,sound_id)
                    } else {
                        loopSoundOn(ents2,sound_id)
                    }
                }
            } else if (re.selection === n_sounds) {
                showMTCmenu0(player)
            }
        });
    }
}

//サウンド
function showMTCmenu1_5(player) {
    //乗務確認
    player.runCommand("function mtc/testBoard")
    player.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_calcj1 = @s mtc_calc1")
    const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", player)

    if (ents.length == 0) {
        player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
    } else {
        const ent = ents[0]
        let n_sounds = world.scoreboard.getObjective("mtc_max_horn").getScore(ent)
        if (n_sounds === undefined) {
            n_sounds = 0
        }

        const form_home = new ActionFormData();
        form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.horn" }] })

        for (let i = 1; i <= n_sounds; i++) {
            form_home.button({ rawtext: [{ "translate": "mtc:" + getIdBase(ent.typeId) + ".Horn" + i }] })
        }

        form_home.button({ rawtext: [{ "text": "< " }, { "translate": "mtc:mtc.ui.back" }] })

        form_home.show(player).then(re => {
            if (re.cancelationReason === "UserBusy") showMTCmenu1_3(player);
            if (re.selection < n_sounds && re.selection >= 0) {
                const sound_id = 1 + re.selection
                player.runCommand("execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc2 = @s mtc_fid")
                player.runCommand("scoreboard players operation @e[family=mtc_body] mtc_calc2 -= @e[family=mtc_body,tag=mtc_parent,scores={mtc_calcj1=0},c=1] mtc_fid")
                const ents2 = getSelectorEntities("@e[family=mtc_body,scores={mtc_calc2=0}]", player)
                horn(ents2,sound_id)
            } else if (re.selection === n_sounds) {
                showMTCmenu0(player)
            }
        });
    }
}

//ドアカット
function showMTCmenu1_6(player) {
    //乗務確認
    player.runCommand("function mtc/testBoard")
    const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", player)

    if (ents.length == 0) {
        player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
    } else {
        const ent = ents[0]
        const ents_f = getFormation(ent)
        const n_door_mode=obj_mtc_max_door_mode.getScore(ent)

        if(n_door_mode<2){
            player.sendMessage("§cUnknown Error 907!")
            return
        }
        const form_home = new ActionFormData();
        form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.door_mode" }] })

        form_home.button({ rawtext: [{ "text": "< " }, { "translate": "mtc:mtc.ui.back" }] })

        for(let idx=0;idx<n_door_mode;idx++){
            form_home.button({ rawtext: [{ "translate": `mtc:mtc.ui.door_mode.${idx}` }] })
        }

        form_home.show(player).then(re => {
            if (re.cancelationReason === "UserBusy") showMTCmenu1_6(player);
            switch (re.selection) {
                case 0:
                    showMTCmenu0(player)
                    break;
                default:
                    let sel_mode = re.selection-1
                    for(const ent_f of ents_f){
                        if(ent_f.getProperty("mtc:door_mode")!==undefined) ent_f.setProperty("mtc:door_mode",sel_mode);
                    }
                    break;
            }
        });
    }
}

function showMTCset0(player) {
    //乗務確認
    player.runCommand("function mtc/testBoard")
    player.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_calcj1 = @s mtc_calc1")
    const ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", player)

    let ent = player
    if (ents.length != 0) {
        ent = ents[0]
    }

    const form_home = new ActionFormData();
    form_home.title({ "translate": "mtc:mtc.ui.settings" })
    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.stop_all" }] }, "textures/mtc_icons/stop")

    form_home.button({ "translate": "mtc:mtc.ui.kill_train" }, "textures/mtc_items/kill_train")
    form_home.button({ "translate": "mtc:mtc.ui.kill_formation" }, "textures/mtc_items/kill_train")

    form_home.button({ "translate": "mtc:mtc.ui.rot" }, "textures/mtc_items/rot")
    if (ent.hasTag("mtc_selseat")) {
        form_home.button({ "translate": "mtc:mtc.ui.d_selseat" }, "textures/mtc_items/selseat")
    } else {
        form_home.button({ "translate": "mtc:mtc.ui.selseat" }, "textures/mtc_items/selseat")
    }

    form_home.button({ "translate": "mtc:mtc.ui.connect" }, "textures/mtc_items/connect")
    form_home.button({ "translate": "mtc:mtc.ui.disconnect" }, "textures/mtc_items/disconnect")
    form_home.button({ "translate": "mtc:mtc.ui.setting" }, "textures/mtc_items/mtc_set2")
    form_home.show(player).then(re => {
        if (re.cancelationReason === "UserBusy") showMTCset0(player);
        const car = getNearestCar(player)
        switch (re.selection) {
            case 0:
                player.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_not = @s mtc_notBM")
                player.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run tag @s add mtc_mas_v2")
                player.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players set @s mtc_ato -1")
                player.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players set @s mtc_spd 0")
                world.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.stop" }] })
                break;
            case 1:
                const all_ents=getEntities({location: player.location, maxDistance: 30})
                let trg_kill=undefined
                let min_dist=1e30

                for(const e of all_ents){
                    const type_id=e.typeId
                    const d=dist(player.location,e.location)
                    if (d<min_dist && (type_id.slice(0, 7) === "mtc:mtc" || type_id.slice(0, 7) === "mtc:mcs") && type_id.slice(0, 8) !== "mtc:mtc_") {
                        min_dist=d
                        trg_kill=e
                    }

                }
                if(trg_kill===undefined){
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                }else{
                    trg_kill.kill()
                }

                /*
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {

                    if (car === null) {
                        const bodies_near = player.dimension.getEntities({ families: ["mtc_body"], location: player.location, maxDistance: 30, closest: 1 })
                        if (bodies_near.length > 0) {
                            command(player, `execute positioned ${bodies_near[0].location.x} ${bodies_near[0].location.y} ${bodies_near[0].location.z} run function mtc_kill`)
                        } else {
                            player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_train" }] })
                        }
                    } else {
                        command(player, `execute positioned ${car.location.x} ${car.location.y} ${car.location.z} run function mtc_kill`)
                    }
                }
                */
                break;
            case 2:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {

                    if (car === null) {
                        player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_train" }] })
                    } else {
                        command(player, `execute positioned ${car.location.x} ${car.location.y} ${car.location.z} run function mtc_kill_formation`)
                    }
                }
                break;
            case 3:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {
                    command(player, "function mtc_rot")
                }
                break;
            case 4:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {
                    if (world.getDynamicProperty("mtc_tilt") === 1 && !ent.hasTag("mtc_norail")) {
                        player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.tilt_no_selseat" }] })
                    } else {
                        if (ent.hasTag("mtc_selseat")) {
                            const ents_f = getFormation(ent)
                            for (const ent_f of ents_f) {
                                ent_f.removeTag("mtc_selseat")
                                const com = ent_f.getComponent("minecraft:rideable")
                                if (com !== undefined) {
                                    const riders = com.getRiders()
                                    for (const rider of riders) {
                                        if (rider.typeId == "mtc:seat") {
                                            rider.remove()
                                        }
                                    }
                                }

                            }
                            player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.disable_selseat" }] })
                        } else {
                            player.runCommand("execute as @e[family=mtc_body,c=1] unless entity @s[tag=mtc_selseat] run tellraw @p {\"rawtext\":[{\"text\":\"§a編成の座席選択を有効化しました\"}]}")
                            player.runCommand("execute as @e[family=mtc_body,c=1] if entity @s[tag=mtc_selseat] run tellraw @p {\"rawtext\":[{\"text\":\"§c既に有効化されています\"}]}")
                            player.runCommand("execute as @e[family=mtc_body,c=1] unless entity @s[tag=mtc_selseat] run function mtc_selseat")
                        }
                    }
                }
                break;
            case 5:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {
                    command(player, "function mtc/connect")
                }
                break;
            case 6:
                if (ents.length == 0) {
                    player.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
                } else {

                    command(player, "function mtc/disconnect")
                }

                break;
            case 7:
                showMTCset1_1(player);
                break
        }
    });
}


//他設定
function showMTCset1_1(player) {
    const form_home = new ActionFormData();
    form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.setting" }] })

    if (!obj_mtc_global.hasParticipant("pg_off")) {
        obj_mtc_global.setScore("pg_off", 0)
    }
    if (obj_mtc_global.getScore("pg_off") === 1) {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.pg_on" }] })
    } else {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.pg_off" }] })
    }

    if (world.getDynamicProperty("mtc_tilt") === 1) {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.tilt_off" }] })
    } else {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.tilt_on" }] })
    }

    if (world.getDynamicProperty("mtc_tilt_car_off") === 1) {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.tilt_car_on" }] })
    } else {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.tilt_car_off" }] })
    }


    if (world.getDynamicProperty("mtc_resist_off") === 1) {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.resist_on" }] })
    } else {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.resist_off" }] })
    }

    if (world.getDynamicProperty("mtc_autolook_off") === 1) {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.enable_autolook" }] })
    } else {
        form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.disable_autolook" }] })
    }


    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.kill_all" }] })

    form_home.button({ rawtext: [{ "text": "< " }, { "translate": "mtc:mtc.ui.back" }] })
        .show(player).then(re => {
            if (re.cancelationReason === "UserBusy") showMTCmenu1_1(player);
            switch (re.selection) {
                case 0:
                    if (obj_mtc_global.getScore("pg_off") === 1) {
                        obj_mtc_global.setScore("pg_off", 0)
                    } else {
                        obj_mtc_global.setScore("pg_off", 1)
                    }
                    break;
                case 1:
                    if (world.getDynamicProperty("mtc_tilt") === 1) {
                        for (const ent of bodies_g) {
                            if (!ent.hasTag("mtc_norail")) {
                                const com = ent.getComponent("minecraft:rideable")
                                if (com !== undefined) {
                                    const riders = com.getRiders()
                                    for (const rider of riders) {
                                        if (rider.typeId == "mtc:seat") {
                                            setState(rider, "mtc_tilt_old", 0)
                                            rider.triggerEvent("ev_p0")
                                        }
                                    }
                                }
                                //setbodyUd(ent, 0)
                                //setbodyRl(ent, 0)
                            }
                        }
                        world.setDynamicProperty("mtc_tilt", 0)
                    } else {
                        world.setDynamicProperty("mtc_tilt", 1)
                        world.setDynamicProperty("mtc_tilt_car_off", 0)
                        world.sendMessage({ rawtext: [{ "translate": "mtc:mtc.msg.tilt_on" }] })
                    }
                    break;
                case 2:
                    if (world.getDynamicProperty("mtc_tilt_car_off") !== 1) {
                        for (const ent of bodies_g) {
                            if (!ent.hasTag("mtc_norail")) {
                                setbodyUd(ent, 0)
                                setbodyRl(ent, 0)
                            }
                        }
                        world.setDynamicProperty("mtc_tilt_car_off", 1)
                    } else {
                        world.setDynamicProperty("mtc_tilt_car_off", 0)
                    }
                    break
                case 3:
                    if (world.getDynamicProperty("mtc_resist_off") === 1) {
                        world.setDynamicProperty("mtc_resist_off", 0)
                    } else {
                        world.setDynamicProperty("mtc_resist_off", 1)
                    }
                    break;
                case 4:
                    if (world.getDynamicProperty("mtc_autolook_off") === 1) {
                        world.setDynamicProperty("mtc_autolook_off", 0)
                    } else {
                        world.setDynamicProperty("mtc_autolook_off", 1)
                    }
                    break;
                case 5:
                    for (const ent of bodies_g) {
                        ent.remove()
                    }
                    break;
                case 6:
                    showMTCset0(player)
                    break;
            }
        });
}


//架線柱設置
function showPOLEmenu0(ent, pl) {

    let now_used = []
    let sorted_used = []
    let sorted_id = []
    for (let i = 0; i < n_pole_type; i++) {
        const cache = world.getDynamicProperty("n_pole_used" + i)
        now_used.push(cache)
        sorted_used.push(cache)
        sorted_id.push(i)
    }

    for (let i = 0; i < n_pole_type - 1; i++) {
        for (let j = 0; j < n_pole_type - 1; j++) {
            if (sorted_used[j + 1] > sorted_used[j]) {
                let c = sorted_used[j]
                sorted_used[j] = sorted_used[j + 1]
                sorted_used[j + 1] = c

                c = sorted_id[j]
                sorted_id[j] = sorted_id[j + 1]
                sorted_id[j + 1] = c
            }
        }
    }

    const form_home = new ActionFormData();
    form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.pole" }] })

    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.cancel" }] })
    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.remove_ma" }] })
    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.remove_m" }] })

    for (let i = 0; i < n_pole_type; i++) {
        form_home.button({ rawtext: [{ "translate": "mtc:polename." + pole_types[sorted_id[i]] }] }, "textures/pole_icons/" + pole_types[sorted_id[i]])
    }

    form_home.show(pl).then(re => {
        if (re.cancelationReason === "UserBusy") showRAILmenu0(ent, pl);
        if (re.selection == 1) {
            const owner_id = ent.getDynamicProperty("mtc_owner")
            const entm_s = pl.dimension.getEntities({ families: ["mtc_pmarker"] })
            for (const ent_m of entm_s) {
                if (ent_m.getDynamicProperty("mtc_owner") === owner_id) {
                    ent_m.remove()
                }
            }
        } else if (re.selection == 2) {
            const owner_id = ent.getDynamicProperty("mtc_owner")
            const my_index = ent.getDynamicProperty("mtc_mark_index")
            const entm_s = pl.dimension.getEntities({ families: ["mtc_pmarker"] })
            let markers = []
            let markers1 = []
            let n_markers = 0
            for (const ent_m of entm_s) {
                if (ent_m.getDynamicProperty("mtc_owner") === owner_id) {
                    const ind = ent_m.getDynamicProperty("mtc_mark_index")
                    markers[ind] = ent_m
                    markers1[ind] = ent_m
                    n_markers++
                }
            }

            const entm1_s = pl.dimension.getEntities({ families: ["mtc_pmarker"] })
            let n_markers1 = 1
            for (const ent_m of entm1_s) {
                if (ent_m.getDynamicProperty("mtc_owner") === owner_id) {
                    markers1[ent_m.getDynamicProperty("mtc_mark_index")] = ent_m
                    n_markers1++
                }
            }

            if (my_index < n_markers - 1) {
                if (my_index !== 0) {
                    markers[my_index + 1].setDynamicProperty("mtc_pre_pos", markers[my_index - 1].location)
                } else {
                    markers[1].setDynamicProperty("mtc_pre_pos", undefined)
                }
                for (let i = my_index + 1; i < n_markers; i++) {
                    markers[i].setDynamicProperty("mtc_mark_index", i - 1)
                }
            }

            ent.remove()

        } else if (re.selection >= 3) {
            const id = sorted_id[re.selection - 3]
            //選択がサジェストにどの程度反映されるかの重み
            now_used[id] += 0.1

            let sum = 0
            for (let i = 0; i < n_pole_type; i++) {
                sum += now_used[i]
            }
            for (let i = 0; i < n_pole_type; i++) {
                now_used[i] *= 1 / sum
                world.setDynamicProperty("n_pole_used" + i, now_used[i])
            }

            if (pole_types[id] === "def2") {
                setPole(ent, pl, id, false)
            } else {
                showPOLEmenu0_1(ent, pl, id)
            }

        }
    });
}

function showPOLEmenu0_1(ent, pl, id) {
    const form_home = new MessageFormData();
    form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.pole" }] })
    form_home.body({ rawtext: [{ "translate": "mtc:mtc.ui.pole_edge" }] })
    form_home.button1("No")
    form_home.button2("Yes")
    form_home.show(pl).then(re => {
        if (re.cancelationReason === "UserBusy") showPOLEmenu0_1(ent, pl, id);
        if (!re.canceled) setPole(ent, pl, id, re.selection === 1)
    })
}

//レール設置
function showRAILmenu0(ent, pl) {

    let now_used = []
    let sorted_used = []
    let sorted_id = []
    for (let i = 0; i < n_rail_type; i++) {
        const cache = world.getDynamicProperty("n_rail_used" + i)
        now_used.push(cache)
        sorted_used.push(cache)
        sorted_id.push(i)
    }

    for (let i = 0; i < n_rail_type - 1; i++) {
        for (let j = 0; j < n_rail_type - 1; j++) {
            if (sorted_used[j + 1] > sorted_used[j]) {
                let c = sorted_used[j]
                sorted_used[j] = sorted_used[j + 1]
                sorted_used[j + 1] = c

                c = sorted_id[j]
                sorted_id[j] = sorted_id[j + 1]
                sorted_id[j + 1] = c
            }
        }
    }

    const form_home = new ActionFormData();
    form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.rail" }] })

    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.cancel" }] })
    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.remove_ma" }] })
    form_home.button({ rawtext: [{ "translate": "mtc:mtc.ui.remove_m" }] })

    for (let i = 0; i < n_rail_type; i++) {
        form_home.button({ rawtext: [{ "translate": "mtc:railname." + rail_types[sorted_id[i]] }] }, "textures/rail_icons/" + rail_types[sorted_id[i]])
    }

    form_home.show(pl).then(re => {
        if (re.cancelationReason === "UserBusy") showRAILmenu0(ent, pl);
        if (re.selection == 1) {
            const owner_id = ent.getDynamicProperty("mtc_owner")
            const entm_s = pl.dimension.getEntities({ families: ["mtc_marker"] })
            for (const ent_m of entm_s) {
                if (ent_m.getDynamicProperty("mtc_owner") === owner_id) {
                    ent_m.remove()
                }
            }
        } else if (re.selection == 2) {
            const owner_id = ent.getDynamicProperty("mtc_owner")
            const my_index = ent.getDynamicProperty("mtc_mark_index")
            const entm_s = pl.dimension.getEntities({ type: "mtc:marker0" })
            let markers = []
            let markers1 = []
            let n_markers = 0
            for (const ent_m of entm_s) {
                if (ent_m.getDynamicProperty("mtc_owner") === owner_id) {
                    const ind = ent_m.getDynamicProperty("mtc_mark_index")
                    markers[ind] = ent_m
                    markers1[ind] = ent_m
                    n_markers++
                }
            }

            const entm1_s = pl.dimension.getEntities({ type: "mtc:marker1" })
            let n_markers1 = 1
            for (const ent_m of entm1_s) {
                if (ent_m.getDynamicProperty("mtc_owner") === owner_id) {
                    markers1[ent_m.getDynamicProperty("mtc_mark_index")] = ent_m
                    n_markers1++
                }
            }

            if (n_markers1 > 2 && my_index == 0) {
                pl.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.rail_mk_rem" }] })
            } else {

                if (ent.typeId == "mtc:marker0") {
                    if (my_index < n_markers - 1) {
                        if (my_index !== 0) {
                            markers[my_index + 1].setDynamicProperty("mtc_pre_pos", markers[my_index - 1].location)
                        } else {
                            markers[1].setDynamicProperty("mtc_pre_pos", undefined)
                        }
                        for (let i = my_index + 1; i < n_markers; i++) {
                            markers[i].setDynamicProperty("mtc_mark_index", i - 1)
                        }
                    }

                } else {


                    if (my_index < n_markers1 - 1) {
                        if (my_index !== 0) {
                            markers1[my_index + 1].setDynamicProperty("mtc_pre_pos", markers1[my_index - 1].location)
                        } else {
                            markers1[1].setDynamicProperty("mtc_pre_pos", undefined)
                        }
                        for (let i = my_index + 1; i < n_markers1; i++) {
                            markers1[i].setDynamicProperty("mtc_mark_index", i - 1)
                        }
                    }

                }
                ent.remove()
            }

        } else if (re.selection >= 3) {
            const id = sorted_id[re.selection - 3]
            //選択がサジェストにどの程度反映されるかの重み
            now_used[id] += 0.1

            let sum = 0
            for (let i = 0; i < n_rail_type; i++) {
                sum += now_used[i]
            }
            for (let i = 0; i < n_rail_type; i++) {
                now_used[i] *= 1 / sum
                world.setDynamicProperty("n_rail_used" + i, now_used[i])
            }

            showRAILmenu1_1(ent, pl, id)
        }
    });
}

//レール設置
function showRAILmenu1_1(ent, pl, id) {
    const po_en = (rail_types[id].slice(-3) === "_po")
    const form = new ModalFormData()
    form.title({ rawtext: [{ "translate": "mtc:mtc.ui.rail_title" }] });
    form.slider({ rawtext: [{ "translate": "mtc:mtc.ui.cant_max" }] }, 0, 7.875, 0.125, 6)
    form.textField({ rawtext: [{ "translate": "mtc:mtc.ui.cant_spd" }] },
        { rawtext: [{ "translate": "mtc:mtc.ui.cant_spd_alt" }] }, "")
    form.textField({ rawtext: [{ "translate": "mtc:mtc.ui.joint" }] },
        { rawtext: [{ "translate": "mtc:mtc.ui.cant_spd_alt" }] }, "")
    form.toggle({ rawtext: [{ "translate": "mtc:mtc.ui.tunnel" }] }, false)
    form.toggle({ rawtext: [{ "translate": "mtc:mtc.ui.enable_rainani" }] }, true)
    /*
    if (po_en) {
        let def_m = world.getDynamicProperty("mtc_def_pole_m")
        if (def_m === undefined) def_m = 50;
        form.slider({ rawtext: [{ "translate": "mtc:mtc.ui.pole" }] }, 0, 100, 5, def_m);
    }
    */
    form.show(pl).then(re => {
        if (re.cancelationReason === "UserBusy") showRAILmenu1_1(ent, pl, id)
        if (re.canceled) {
            showRAILmenu0(ent, pl)
        } else {
            const tlm = re.formValues[0]
            let vrail = re.formValues[1]
            let joint = re.formValues[2]
            const tunnel = re.formValues[3]
            const rani_off = re.formValues[4]
            let po_sel = 0
            /*
            if (po_en) {
                po_sel = re.formValues[5]
                world.setDynamicProperty("mtc_def_pole_m", po_sel)
            }
            */

            if (!(vrail > 0)) vrail = 0//Nan/範囲外対応
            if (!(joint > 0)) joint = 0//Nan/範囲外対応
            if (tunnel) {
                showRAILmenu1_1_1(ent, pl, id, tlm, vrail, joint, rani_off, po_sel)
            } else {
                setRail(ent, pl, id, tlm, vrail, joint, false, 0, 0, 0, 0, rani_off, po_sel)//在来線tlm5.63 新幹線tlm7.13
            }
        }
    })
}
function showRAILmenu1_1_1(ent, pl, id, tlm, vrail, joint, rani_off, po_sel) {
    let default_l = world.getDynamicProperty("mtc_tunnel_l")
    let default_r = world.getDynamicProperty("mtc_tunnel_r")
    let default_u = world.getDynamicProperty("mtc_tunnel_u")
    let default_d = world.getDynamicProperty("mtc_tunnel_d")
    if (default_l === undefined) default_l = 2
    if (default_r === undefined) default_r = 2
    if (default_u === undefined) default_u = 5
    if (default_d === undefined) default_d = 0

    const form = new ModalFormData()
    form.title({ rawtext: [{ "translate": "mtc:mtc.ui.tunnel_title" }] });
    form.slider({ rawtext: [{ "translate": "mtc:mtc.ui.tunnel_l" }] }, 0, 10, 1, default_l)
    form.slider({ rawtext: [{ "translate": "mtc:mtc.ui.tunnel_r" }] }, 0, 10, 1, default_r)
    form.slider({ rawtext: [{ "translate": "mtc:mtc.ui.tunnel_u" }] }, 0, 10, 1, default_u)
    form.slider({ rawtext: [{ "translate": "mtc:mtc.ui.tunnel_d" }] }, 0, 10, 1, default_d)
    form.show(pl).then(re => {
        if (re.cancelationReason === "UserBusy") showRAILmenu1_1_1(ent, pl, id, tlm, vrail, joint, rani_off, po_sel)
        if (re.canceled) {
            showRAILmenu1_1(ent, pl, id)
        } else {
            const dl = re.formValues[0]
            const dr = re.formValues[1]
            const du = re.formValues[2]
            const dd = re.formValues[3]
            world.setDynamicProperty("mtc_tunnel_l", dl)
            world.setDynamicProperty("mtc_tunnel_r", dr)
            world.setDynamicProperty("mtc_tunnel_u", du)
            world.setDynamicProperty("mtc_tunnel_d", dd)
            setRail(ent, pl, id, tlm, vrail, joint, true, dl, dr, du, dd, rani_off, po_sel)//在来線tlm5.63 新幹線tlm7.13
        }
    })
}

function showMTCspawn0(pl, pos) {
    if (all_cars.length === 0) {
        pl.sendMessage("§cError: No Trains Detected!")
        return
    }
    const form_home = new ActionFormData();
    form_home.title({ rawtext: [{ "text": "1" }, { "translate": "mtc:mtc.ui.spawn_settings" }, {"text":"§1§l"},{ "translate": "mtc:mtc.ui.spawn_settings1" }] })
    let found_groups=[]
    let raw_idxs=[]
    let i=0
    for (const name of all_cars) {
        const group=getGroupName(name)

        let group_size=0
        for (const name of all_cars) {
            const group2=getGroupName(name)
            if(group==group2) group_size++
        }

        if(!found_groups.includes(group)){
            raw_idxs.push(i)
            found_groups.push(group)
            if(group_size>1){
                form_home.button({ rawtext: [{"text":"§r"},{ "translate": "item.spawn_egg.entity." + name + ".name" },{"text":`§r\n§2${group_size} `},{"translate":"mtc:mtc.ui.type"},{"text":" >"}] }, "textures/items/" + getIdBase(name))
            }else{
                form_home.button({ rawtext: [{"text":"§r"},{ "translate": "item.spawn_egg.entity." + name + ".name" }] }, "textures/items/" + getIdBase(name))
            }
        }
        i++
    }
    form_home.show(pl).then(re => {
        if (re.cancelationReason === "UserBusy") showMTCspawn0(pl, pos);
        if (re.selection >= 0) {
            const sel = re.selection
            let name = all_cars[raw_idxs[sel]]
            selectSubCar(pl,pos,name,[],1)
        }
    })
}
function showMTCspawn1(pl, pos, formations, id, head_group=undefined) {
    const form_home = new ActionFormData();
    form_home.title({ rawtext: [{ "text": `${id}` }, { "translate": "mtc:mtc.ui.spawn_settings" }, {"text":"§1§l"},{ "translate": "mtc:mtc.ui.spawn_settings1" }] })
    form_home.button({ rawtext: [{ "text": `§o§l${id - 1}` }, { "translate": "mtc:mtc.ui.spawn_btn" }] })
    form_home.button({ rawtext: [{ "text": "§4< " }, { "text": `${id - 1}` }, { "translate": "mtc:mtc.ui.resel" }] })
    let found_groups=[]
    let raw_idxs=[]
    let i

    i=0
    for (const name of all_cars) {
        const group=getGroupName(name)
        if(group==head_group){
            let group_size=0
            for (const name of all_cars) {
                const group2=getGroupName(name)
                if(group==group2) group_size++
            }
            raw_idxs.push(i)
            found_groups.push(group)
            if(group_size>1){
                form_home.button({ rawtext: [{"text":"§r§l"},{ "translate": "item.spawn_egg.entity." + name + ".name" },{"text":`§r\n§2${group_size} `},{"translate":"mtc:mtc.ui.type"},{"text":" >"}] }, "textures/items/" + getIdBase(name))
            }else{
                form_home.button({ rawtext: [{"text":"§r§l"},{ "translate": "item.spawn_egg.entity." + name + ".name" }] }, "textures/items/" + getIdBase(name))
            }
            break
        }
        i++
    }

    i=0
    for (const name of all_cars) {
        const group=getGroupName(name)
        if(!found_groups.includes(group)){
            let group_size=0
            for (const name of all_cars) {
                const group2=getGroupName(name)
                if(group==group2) group_size++
            }
            raw_idxs.push(i)
            found_groups.push(group)
            if(group_size>1){
                form_home.button({ rawtext: [{"text":"§r"},{ "translate": "item.spawn_egg.entity." + name + ".name" },{"text":`§r\n§2${group_size} `},{"translate":"mtc:mtc.ui.type"},{"text":" >"}] }, "textures/items/" + getIdBase(name))
            }else{
                form_home.button({ rawtext: [{"text":"§r"},{ "translate": "item.spawn_egg.entity." + name + ".name" }] }, "textures/items/" + getIdBase(name))
            }
        }
        i++
    }

        //
    if(head_group!==undefined){
        let name = all_cars[raw_idxs[0]]
        selectSubCar(pl,pos,name,formations,id)
        return
    }


    form_home.show(pl).then(re => {
        if (re.cancelationReason === "UserBusy") showMTCspawn1(pl, pos, formations, id, head_group);
        if (re.selection === 0) {
            showMTCspawn1_1(pl, pos, formations, id)
        } else if (re.selection === 1) {
            if (id === 2) {
                showMTCspawn0(pl, pos)
            } else {
                let fm2 = []
                for (let i = 0; i < formations.length - 1; i++) {
                    fm2.push(formations[i])
                }
                showMTCspawn1(pl, pos, fm2, id - 1)
            }
        } else if (re.selection >= 2) {
            const sel = re.selection - 2
            let name = all_cars[raw_idxs[sel]]
            selectSubCar(pl,pos,name,formations,id)
        }
    })
}

function showMTCspawn1_1(pl, pos, formations, id) {
    const form_home = new ActionFormData();
    form_home.title({ rawtext: [{ "translate": "mtc:mtc.ui.spawn_setinv" }] })
    form_home.button({ rawtext: [{"text":"§o§l§2"},{ "translate": "mtc:mtc.ui.spawn_normal" }] })
    form_home.button({ rawtext: [{"text":"§o§l"},{ "translate": "mtc:mtc.ui.spawn_inv" }] })
    form_home.button({ rawtext: [{ "text": "§4< " }, { "translate": "mtc:mtc.ui.back" }] })

    form_home.show(pl).then(re => {
        if (re.cancelationReason === "UserBusy") showMTCspawn1_1(pl, pos, formations, id);
        switch (re.selection) {
            case 0:
                spawnFormation(pl, pos, formations, false)
                break;
            case 1:
                spawnFormation(pl, pos, formations, true)
                break;
            case 2:
                showMTCspawn1(pl, pos, formations, id);
                break
        }
    })
}

function selectSubCar(pl,pos,name,formations,id){
    let tsel_back_idx=2
    let same_group=[]
    const group=getGroupName(name)
    for (const name of all_cars) {
        const group_=getGroupName(name)
        if(group==group_) same_group.push(name);
    }

    if(same_group.length===1){
        formations.push(name)
        showMTCspawn1(pl, pos, formations, id+1)
    }

    if(same_group.length>=2){
        const form_home = new ActionFormData();
        form_home.title({ rawtext: [{ "text": `${id}` }, { "translate": "mtc:mtc.ui.spawn_settings" }, {"text":"§4§l"},{ "translate": "mtc:mtc.ui.spawn_settings2" }] })
        if(id>1){
            form_home.button({ rawtext: [{ "text": `§o§l${id - 1}` }, { "translate": "mtc:mtc.ui.spawn_btn" }] })
            form_home.button({ rawtext: [{ "text": "§4< " }, { "text": `${id - 1}` }, { "translate": "mtc:mtc.ui.resel" }] })
        }

        for (const name of same_group) {
            form_home.button({ rawtext: [{"text":"§r"},{ "translate": "item.spawn_egg.entity." + name + ".name" }] }, "textures/items/" + getIdBase(name))
            tsel_back_idx++
        }
        form_home.button({ rawtext: [{ "text": "§4< " }, { "translate": "mtc:mtc.ui.tsel_back" }] })


        form_home.show(pl).then(re => {
            if (re.cancelationReason === "UserBusy"){
                (pl,pos,name,formations,id)
            }else{
                let sel_btn=re.selection
                if(id<=1){
                    sel_btn+=2;
                }
                
                if(sel_btn==tsel_back_idx){
                    if (id === 1) {
                        showMTCspawn0(pl, pos)
                    } else {
                        showMTCspawn1(pl, pos, formations, id)
                    }
                }else if(sel_btn === 0){
                    showMTCspawn1_1(pl, pos, formations, id)
                }else if(sel_btn === 1){
                    if (id === 2) {
                        showMTCspawn0(pl, pos)
                    } else {
                        let fm2 = []
                        for (let i = 0; i < formations.length - 1; i++) {
                            fm2.push(formations[i])
                        }
                        showMTCspawn1(pl, pos, fm2, id - 1, group)
                    }
                } else if (sel_btn >= 2) {
                    const sel = sel_btn - 2
                    
                    let name = same_group[sel]
                    formations.push(name)
                    showMTCspawn1(pl, pos, formations, id+1, group)
                }
            }
        })
    }
}

async function spawnFormation(pl, pos, formations, dir_inv = false) {
    let roty
    for (let i = 0; i < formations.length; i++) {
        const name = formations[formations.length - 1 - i]
        pl.sendMessage({ rawtext: [{ "text": "[" + (i + 1) + "/" + formations.length + "] " }, { "translate": "item.spawn_egg.entity." + name + ".name" }] })
        if (i === 0 && dir_inv) world.setDynamicProperty("mtc_nextspawn_inv", true);
        let ent
        let fail = true
        for (let j = 0; j < 100; j++) {
            try {
                ent = pl.dimension.spawnEntity(name, pos)
                if (ent.isValid()) {
                    fail = false
                    break
                }
            } catch (e) {
            }
            await sleep(1)
        }
        if (fail) {
            pl.sendMessage("§cFormation Spawn Unknown Error 1!\nCannot Spawn Entity")
            return
        }

        fail = true
        for (let j = 0; j < 100; j++) {
            if (ent.hasTag("mtc_init")) {
                fail = false
                break
            }
            await sleep(1)
        }
        if (fail) {
            pl.sendMessage("§cFormation Spawn Unknown Error 2!\nCannot Initialize Entity")
            ent.kill()
            return
        }

        fail = true
        for (let j = 0; j < 100; j++) {
            if (!ent.hasTag("mtc_conn")) {
                fail = false
                break
            }
            await sleep(1)
        }
        if (fail) {
            pl.sendMessage("§cFormation Spawn Unknown Error 3!\nCannot Connect Entity")
            ent.kill()
            return
        }

        fail = true
        for (let j = 0; j < 100; j++) {
            if (ent.getDynamicProperty("mtc_body_length") !== undefined) {
                fail = false
                break
            }
            await sleep(1)
        }
        if (fail) {
            pl.sendMessage("§cFormation Spawn Unknown Error 4!\nCannot Get Body Length\nSee Addon Fixer on MCA Community Webpage")
            ent.kill()
            return
        }

        await sleep(20)
        roty = ent.getRotation().y
        pos = ent.location
        const blen = ent.getDynamicProperty("mtc_body_length")
        let dx = -blen * Math.sin(roty * 0.0174533)
        let dz = blen * Math.cos(roty * 0.0174533)
        pos = { x: pos.x + dx, y: pos.y, z: pos.z + dz }
    }
    pl.sendMessage("§a[OK]")
}

let itemevent_cooldown = 0
world.beforeEvents.itemUseOn.subscribe(ev => {
    if (getState(ev.source, "item_cool") === undefined || system.currentTick - getState(ev.source, "item_cool") >= itemevent_cooldown) {
        setState(ev.source, "item_cool", system.currentTick)
        item(ev, true)
    }
}
)
world.beforeEvents.itemUse.subscribe(ev => {
    if (getState(ev.source, "item_cool") === undefined || system.currentTick - getState(ev.source, "item_cool") >= itemevent_cooldown) {
        setState(ev.source, "item_cool", system.currentTick)
        item(ev, false)
    }
});

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
    const pl=event.player
    const ent=event.target
    setState(pl,"plInteractDone",true)
    
    const item = pl.getComponent("minecraft:inventory").container.getSlot(pl.selectedSlotIndex)
    if (item.hasItem() && item.typeId == "mtc:i_set" && ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_body")){
        const com=ent.getComponent("minecraft:rideable")
        const riders = com.getRiders()

        let riders_non_creative=[]
        for(const rider of riders){
            //if(rider.getGameMode()!="creative"){
            if(rider.id!==pl.id){
                riders_non_creative.push(rider)
            }
        }

        reride(com,riders_non_creative)
    }

})

async function reride(com,riders) {
    await sleep(5)
    for(const rider of riders){
        try{
            com.ejectRider(rider)
        }catch (e) {}
    }

    await sleep(5)
    for(const rider of riders){
        try{
            com.addRider(rider)
        }catch (e) {}
    }
}


let is_rain_g=world.getDynamicProperty("is_rain")
if(is_rain_g===undefined){
    is_rain_g=false
}
world.afterEvents.weatherChange.subscribe((eventData) => {
    const { dimension, previousWeather, newWeather } = eventData;

    let is_rain=false
    if(newWeather=="Rain" || newWeather=="Thunder"){
        is_rain=true
    }
    if(is_rain_g!=is_rain){
        is_rain_g=is_rain
        world.setDynamicProperty("is_rain",is_rain_g)
    }
});

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    const inventory = event.player.getComponent("minecraft:inventory");
    const handitem = inventory.container.getItem(event.player.selectedSlotIndex);
    if(!handitem)return;
    let ev={
        cancel:false,
        source:event.player,
        itemStack:handitem
    }
    if (getState(ev.source, "item_cool") === undefined || system.currentTick - getState(ev.source, "item_cool") >= itemevent_cooldown) {
        setState(ev.source, "item_cool", system.currentTick);
        setState(ev.source,"plInteractDone",false)
        system.runTimeout(() => {
            if(!getState(ev.source,"plInteractDone")) item(ev, false, 1);
        }, 1);
    }
});

function item(ev, on = false, event_cool_offset=0) {
    itemevent_cooldown = 2-event_cool_offset
    if (ev.itemStack.typeId == "mtc:i_notb") {
        ev.cancel = true;
        system.run(() => {
            ev.source.runCommand("execute as \"" + ev.source.name + "\" at @s run function mtc/notb")
        })
    } else if (ev.itemStack.typeId == "mtc:i_noteb") {
        ev.cancel = true;
        system.run(() => {
            ev.source.runCommand("execute as \"" + ev.source.name + "\" at @s run function mtc/noteb")
        })
    } else if (ev.itemStack.typeId == "mtc:i_notn") {
        ev.cancel = true;
        system.run(() => {
            ev.source.runCommand("execute as \"" + ev.source.name + "\" at @s run function mtc/notn")
        })
    } else if (ev.itemStack.typeId == "mtc:i_notp") {
        ev.cancel = true;
        system.run(() => {
            ev.source.runCommand("execute as \"" + ev.source.name + "\" at @s run function mtc/notp")
        })
    } else if (ev.itemStack.typeId == "mtc:i_reverse") {
        ev.cancel = true;
        itemevent_cooldown = 7
        system.run(() => {
            ev.source.runCommand("execute as \"" + ev.source.name + "\" at @s run function mtc/rev")
        })
    } else if (ev.itemStack.typeId == "mtc:i_set") {
        ev.cancel = true;
        itemevent_cooldown = 7
        system.run(() => {
            ev.source.runCommand("playsound random.click \"" + ev.source.name + "\"")
        })
        system.run(() => { showMTCmenu0(ev.source); });
    } else if (ev.itemStack.typeId == "mtc:i_set2") {
        ev.cancel = true;
        itemevent_cooldown = 7
        system.run(() => {
            ev.source.runCommand("playsound random.click \"" + ev.source.name + "\"")
        })
        system.run(() => { showMTCset0(ev.source); });
    } else if (ev.itemStack.typeId == "mtc:i_spawn") {
        ev.cancel = true;
        itemevent_cooldown = 7
        let pos
        if (on) {
            pos = { x: ev.block.x + 0.5, y: ev.block.y + 1, z: ev.block.z + 0.5 }
        } else {
            pos = ev.source.location
        }
        system.run(() => {
            ev.source.runCommand("playsound random.click \"" + ev.source.name + "\"")
        })
        system.run(() => { showMTCspawn0(ev.source, pos); });
    } else if (ev.itemStack.typeId == "mtc:i_marker0") {
        ev.cancel = true;
        itemevent_cooldown = 7
        system.run(() => {
            const bef_ents = ev.source.dimension.getEntities({ type: "mtc:marker0" })
            let n_bef_ent = 0
            let pre_pos = undefined
            let max = -1
            for (const ent of bef_ents) {
                if (ent.getDynamicProperty("mtc_owner") === ev.source.id) {
                    n_bef_ent++
                    if (ent.getDynamicProperty("mtc_mark_index") > max) {
                        max = ent.getDynamicProperty("mtc_mark_index")
                        pre_pos = ent.location
                    }
                }
            }

            let b_pos

            if (on) {
                b_pos = ev.block.center()
                b_pos.y += b_pos.y - ev.block.y
                if (ev.blockFace == "South") {
                    b_pos.z++
                    b_pos.y--
                } else if (ev.blockFace == "North") {
                    b_pos.z--
                    b_pos.y--
                } else if (ev.blockFace == "East") {
                    b_pos.x++
                    b_pos.y--
                } else if (ev.blockFace == "West") {
                    b_pos.x--
                    b_pos.y--
                } else {
                    if (ev.block.typeId.slice(-4) == "rail") b_pos.y -= 1
                    const st = ev.block.permutation.getAllStates()
                    if (st['top_slot_bit'] === false) b_pos.y -= 0.5
                }
            } else {
                b_pos = ev.source.location
            }

            //近傍移動
            const near_markers = ev.source.dimension.getEntities({ families: ["mtc_rail"], location: b_pos, closest: 64 })
            for (const ent_mk of near_markers) {
                let p1 = ent_mk.getDynamicProperty("mtc_bz_p1")
                let p3 = ent_mk.getDynamicProperty("mtc_bz_p3")
                const offset_y= getRailOffset(ent_mk)//(ent_mk.getComponent("minecraft:variant")?.value??68)*0.01
                p1.y-=offset_y
                p3.y-=offset_y
                if (dist(b_pos, p1) < 0.99) {
                    b_pos = p1
                    break
                }
                if (dist(b_pos, p3) < 0.99) {
                    b_pos = p3
                    break
                }
            }


            const ent = ev.source.dimension.spawnEntity("mtc:marker0", b_pos)

            ent.setDynamicProperty("mtc_owner", ev.source.id)
            ent.setDynamicProperty("mtc_mark_index", n_bef_ent)
            if (n_bef_ent > 0) {
                ent.setDynamicProperty("mtc_pre_pos", pre_pos)
            }

            system.run(() => {
                ev.source.runCommand("playsound use.copper \"" + ev.source.name + "\"")
            })
        })
    } else if (ev.itemStack.typeId == "mtc:i_marker1") {
        ev.cancel = true;
        itemevent_cooldown = 7
        system.run(() => {
            const bef_ents = ev.source.dimension.getEntities({ type: "mtc:marker0" })
            let n_bef_ent = 0
            let init_pos = undefined
            for (const ent of bef_ents) {
                if (ent.getDynamicProperty("mtc_owner") === ev.source.id) {
                    n_bef_ent++
                    if (ent.getDynamicProperty("mtc_mark_index") === 0) {
                        init_pos = ent.location
                        break
                    }
                }
            }

            if (n_bef_ent > 0) {
                n_bef_ent = 1
                const bef_ents = ev.source.dimension.getEntities({ type: "mtc:marker1" })
                let pre_pos = init_pos
                let max = -1
                for (const ent of bef_ents) {
                    if (ent.getDynamicProperty("mtc_owner") === ev.source.id) {
                        n_bef_ent++
                        if (ent.getDynamicProperty("mtc_mark_index") > max) {
                            max = ent.getDynamicProperty("mtc_mark_index")
                            pre_pos = ent.location
                        }
                    }
                }

                let b_pos

                if (on) {
                    b_pos = ev.block.center()
                    b_pos.y += b_pos.y - ev.block.y
                    if (ev.blockFace == "South") {
                        b_pos.z++
                        b_pos.y--
                    } else if (ev.blockFace == "North") {
                        b_pos.z--
                        b_pos.y--
                    } else if (ev.blockFace == "East") {
                        b_pos.x++
                        b_pos.y--
                    } else if (ev.blockFace == "West") {
                        b_pos.x--
                        b_pos.y--
                    } else {
                        if (ev.block.typeId.slice(-4) == "rail") b_pos.y -= 1
                        const st = ev.block.permutation.getAllStates()
                        if (st['top_slot_bit'] === false) b_pos.y -= 0.5
                    }
                } else {
                    b_pos = ev.source.location
                }


                //近傍移動
                const near_markers = ev.source.dimension.getEntities({ families: ["mtc_rail"], location: b_pos, closest: 64 })
                for (const ent_mk of near_markers) {
                    let p1 = ent_mk.getDynamicProperty("mtc_bz_p1")
                    let p3 = ent_mk.getDynamicProperty("mtc_bz_p3")
                    const offset_y= getRailOffset(ent_mk)//(ent_mk.getComponent("minecraft:variant")?.value??68)*0.01
                    p1.y-=offset_y
                    p3.y-=offset_y
                    if (dist(b_pos, p1) < 0.99) {
                        b_pos = p1
                        break
                    }
                    if (dist(b_pos, p3) < 0.99) {
                        b_pos = p3
                        break
                    }
                }
                const ent = ev.source.dimension.spawnEntity("mtc:marker1", b_pos)

                ent.setDynamicProperty("mtc_owner", ev.source.id)
                ent.setDynamicProperty("mtc_mark_index", n_bef_ent)
                ent.setDynamicProperty("mtc_pre_pos", pre_pos)

            } else {
                ev.source.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_marker0" }] })
            }
            system.run(() => {
                ev.source.runCommand("playsound use.copper \"" + ev.source.name + "\"")
            })

        })
    } else if (ev.itemStack.typeId == "mtc:i_marker2") {
        ev.cancel = true;
        itemevent_cooldown = 7
        system.run(() => {
            const bef_ents = ev.source.dimension.getEntities({ type: "mtc:marker2" })
            let n_bef_ent = 0
            let pre_pos = undefined
            let max = -1
            for (const ent of bef_ents) {
                if (ent.getDynamicProperty("mtc_owner") === ev.source.id) {
                    n_bef_ent++
                    if (ent.getDynamicProperty("mtc_mark_index") > max) {
                        max = ent.getDynamicProperty("mtc_mark_index")
                        pre_pos = ent.location
                    }
                }
            }

            let b_pos
            if (on) {
                b_pos = ev.block.center()
                b_pos.y += b_pos.y - ev.block.y
                if (ev.blockFace == "South") {
                    b_pos.z++
                    b_pos.y--
                } else if (ev.blockFace == "North") {
                    b_pos.z--
                    b_pos.y--
                } else if (ev.blockFace == "East") {
                    b_pos.x++
                    b_pos.y--
                } else if (ev.blockFace == "West") {
                    b_pos.x--
                    b_pos.y--
                } else {
                    if (ev.block.typeId.slice(-4) == "rail") b_pos.y -= 1
                    const st = ev.block.permutation.getAllStates()
                    if (st['top_slot_bit'] === false) b_pos.y -= 0.5
                }
            } else {
                b_pos = ev.source.location
            }

            const ent = ev.source.dimension.spawnEntity("mtc:marker2", b_pos)

            ent.setDynamicProperty("mtc_owner", ev.source.id)
            ent.setDynamicProperty("mtc_mark_index", n_bef_ent)
            if (n_bef_ent > 0) {
                ent.setDynamicProperty("mtc_pre_pos", pre_pos)
            }
            system.run(() => {
                ev.source.runCommand("playsound use.copper \"" + ev.source.name + "\"")
            })

        })
    }
}

let seat_clean_queue=[]
//2秒毎
system.runInterval(() => {
    world.getDimension("overworld").runCommand("execute as @p at @s run function mtc_inner/install")

    //レールアニメ定速
    aniRail()

    loadAllBodies()

    if(system.currentTick - tick_init<2400){
        const all_tickers=getEntities({type:"mtc:ticker"})
        for(const ticker of all_tickers){
            let is_active=false
            for(const active_ticker of active_tickers){
                if(ticker.id==active_ticker.id){
                    is_active=true
                    break
                }
            }
            if(!is_active){
                ticker.remove()
            }
        }
    }

    //取り残された座席消去
    if(seat_clean_queue.length===0){
        seat_clean_queue = world.getDimension("overworld").getEntities({ type: "mtc:seat" })
        seat_clean_queue = seat_clean_queue.concat(world.getDimension("nether").getEntities({ type: "mtc:seat" }))
        seat_clean_queue = seat_clean_queue.concat(world.getDimension("the_end").getEntities({ type: "mtc:seat" }))
    }
}, 40)


let drawed_rail = {}
let drawed_pole = {}
function aniRail() {
    //レールアニメ
    let ents_r = []
    ents_r = ents_r.concat(world.getDimension("overworld").getEntities({ families: ["mtc_rail"],excludeFamilies: ["mtc_railhide"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))
    ents_r = ents_r.concat(world.getDimension("nether").getEntities({ families: ["mtc_rail"],excludeFamilies: ["mtc_railhide"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))
    ents_r = ents_r.concat(world.getDimension("the_end").getEntities({ families: ["mtc_rail"],excludeFamilies: ["mtc_railhide"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))

    let ents_newvalid = {}
    drawed_rail = {}
    for (const pl of players_g) {
        for (const ent of ents_r) {
            const d2 = dist2(pl.location, ent.location)
            if (d2 < rail_dist2_high) {
                ents_newvalid[ent.id] = ent
                if (d2 < rail_dist2_low) {
                    drawed_rail[ent.id] = true
                }
            }
        }
    }
    for (const key in ents_newvalid) {
        const ent = ents_newvalid[key]
        const rest_rot = getState(ent, "mtc_rail_rest_rot")
        if (rest_rot > 0) {
            setState(ent, "mtc_rail_rest_rot", rest_rot - 1)
            ent.teleport(ent.location, { rotation: ent.getRotation() })
        }
        doRailAnime(ent)
    }

    //  ポールアニメ
    let ents_p = []
    ents_p = ents_p.concat(world.getDimension("overworld").getEntities({ families: ["mtc_pole"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))
    ents_p = ents_p.concat(world.getDimension("nether").getEntities({ families: ["mtc_pole"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))
    ents_p = ents_p.concat(world.getDimension("the_end").getEntities({ families: ["mtc_pole"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))

    if(ents_p.length>0){

        let poles_newvalid = {}
        drawed_pole = {}

        for (const pl of players_g) {
            for (const ent of ents_p) {
                const d2 = dist2(pl.location, ent.location)
                if (d2 < rail_dist2_high) {
                    poles_newvalid[ent.id] = ent
                    if (d2 < rail_dist2_low) {
                        drawed_pole[ent.id] = true
                    }
                }
            }
        }
        for (const key in poles_newvalid) {
            const ent = poles_newvalid[key]
            const rest_rot = getState(ent, "mtc_rail_rest_rot")
            if (rest_rot > 0) {
                setState(ent, "mtc_rail_rest_rot", rest_rot - 1)
                ent.teleport(ent.location, { rotation: ent.getRotation() })
            }
            doPoleAnime(ent)
        }
    }

}

//定期アニメーション外のレールのアニメーション
let prev_plyers_pos = {}
function aniInvalidRail() {
    //レールアニメ
    let ents_r = []
    ents_r = ents_r.concat(world.getDimension("overworld").getEntities({ families: ["mtc_rail"],excludeFamilies: ["mtc_railhide"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))
    ents_r = ents_r.concat(world.getDimension("nether").getEntities({ families: ["mtc_rail"],excludeFamilies: ["mtc_railhide"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))
    ents_r = ents_r.concat(world.getDimension("the_end").getEntities({ families: ["mtc_rail"],excludeFamilies: ["mtc_railhide"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))

    let ents_newvalid = {}
    for (const pl of players_g) {
        if (prev_plyers_pos[pl.id] === undefined || dist2(pl.location, prev_plyers_pos[pl.id]) > 100) {
            prev_plyers_pos[pl.id] = pl.location
            for (const ent of ents_r) {
                if (drawed_rail[ent.id] === undefined) {
                    const d2 = dist2(pl.location, ent.location)
                    if (d2 < rail_dist2_high) {
                        ents_newvalid[ent.id] = ent
                        if (d2 < rail_dist2_low) {
                            drawed_rail[ent.id] = true
                        } else {
                            delete drawed_rail[ent.id]
                        }
                    }
                }
            }
        }
    }
    for (const key in ents_newvalid) {
        const ent = ents_newvalid[key]
        doRailAnime(ent)
    }

    //ポールアニメ
    let ents_p = []
    ents_p = ents_p.concat(world.getDimension("overworld").getEntities({ families: ["mtc_pole"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))
    ents_p = ents_p.concat(world.getDimension("nether").getEntities({ families: ["mtc_pole"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))
    ents_p = ents_p.concat(world.getDimension("the_end").getEntities({ families: ["mtc_pole"], propertyOptions:[{exclude:true, propertyId:"mtc:ver_stat",value:{greaterThanOrEquals:2}}] }))

    if(ents_p.length>0){

        let poles_newvalid = {}
        for (const pl of players_g) {
            if (prev_plyers_pos[pl.id] === undefined || dist2(pl.location, prev_plyers_pos[pl.id]) > 144) {
                prev_plyers_pos[pl.id] = pl.location
                for (const ent of ents_p) {
                    if (drawed_pole[ent.id] === undefined) {
                        const d2 = dist2(pl.location, ent.location)
                        if (d2 < rail_dist2_high) {
                            poles_newvalid[ent.id] = ent
                            if (d2 < rail_dist2_low) {
                                drawed_pole[ent.id] = true
                            } else {
                                delete drawed_pole[ent.id]
                            }
                        }
                    }
                }
            }
        }
        for (const key in poles_newvalid) {
            const ent = poles_newvalid[key]
            doPoleAnime(ent)
        }

    }

}

function doPoleAnime(ent, valid = true, disable = false) {

    let set_v2=false
    if(ent.getProperty("mtc:ver")==2 && ent.getProperty("mtc:ver_stat")!=2){
        ent.setProperty("mtc:ver_stat",2)
        set_v2=true
    }

    if(set_v2){
        ent.setProperty("mtc:pole_base_h",ent.getDynamicProperty("mtc_pole_base_h")==true)
    }else{
        if (ent.getDynamicProperty("mtc_pole_base_h")) {
            if (valid) {
                playAni(ent, "animation.rail.b_h", "pb_h")
            } else if (disable) {
                stopAni(ent, "pb_h")
            }
        }
    }
    const base_deg = ent.getDynamicProperty("mtc_pole_base_deg")
    if(set_v2){
        ent.setProperty("mtc:pole_base_deg",base_deg??0)
    }else{
        if (base_deg > 0) {
            for (let k = 0; k < 6; k++) {
                if ((base_deg >> k & 1) == 1) {
                    if (valid) {
                        playAni(ent, `animation.rail.b_r${k + 1}`, `b_lr${k + 1}`)
                    } else if (disable) {
                        stopAni(ent, `b_lr${k + 1}`)
                    }
                }
            }
        } else if (base_deg < 0) {
            for (let k = 0; k < 6; k++) {
                if (((-base_deg) >> k & 1) == 1) {
                    if (valid) {
                        playAni(ent, `animation.rail.b_l${k + 1}`, `b_lr${k + 1}`)
                    } else if (disable) {
                        stopAni(ent, `b_lr${k + 1}`)
                    }
                }
            }
        }
    }


    const n_s = Math.min(32, ent.getDynamicProperty("n_s"))
    if(set_v2){
        ent.setProperty("mtc:n_s",n_s)
    }else{
        if (n_s < 32) {
            if (valid) {
                playAni(ent, `animation.rail.s${n_s + 1}_h`, `s_h`)
            } else if (disable) {
                stopAni(ent, `s_h`)
            }
        } else {
            if (valid || disable) {
                stopAni(ent, `s_h`)
            }
        }
    }

    if (n_s > 0) {
        const deg_y = ent.getDynamicProperty(`s_lr`)
        const deg_x = ent.getDynamicProperty(`s_ud`)
        if(set_v2){
            ent.setProperty("mtc:s_lr",deg_y)
            ent.setProperty("mtc:s_ud",deg_x)
        }else{
            if (deg_y > 0) {
                for (let k = 0; k < 8; k++) {
                    if ((deg_y >> k & 1) == 1) {
                        if (valid) {
                            playAni(ent, `animation.rail.s1_r${2 ** k}`, `s1_lr${2 ** k}`)
                        } else if (disable) {
                            stopAni(ent, `s1_lr${2 ** k}`)
                        }
                    }
                }
            } else if (deg_y < 0) {
                for (let k = 0; k < 8; k++) {
                    if (((-deg_y) >> k & 1) == 1) {
                        if (valid) {
                            playAni(ent, `animation.rail.s1_l${2 ** k}`, `s$1_lr${2 ** k}`)
                        } else if (disable) {
                            stopAni(ent, `s1_lr${2 ** k}`)
                        }
                    }
                }
            }
            if (deg_x > 0) {
                for (let k = 0; k < 8; k++) {
                    if ((deg_x >> k & 1) == 1) {
                        if (valid) {
                            playAni(ent, `animation.rail.s1_u${2 ** k}`, `s1_ud${2 ** k}`)
                        } else if (disable) {
                            stopAni(ent, `s1_ud${2 ** k}`)
                        }
                    }
                }
            } else if (deg_x < 0) {
                for (let k = 0; k < 8; k++) {
                    if (((-deg_x) >> k & 1) == 1) {
                        if (valid) {
                            playAni(ent, `animation.rail.s1_d${2 ** k}`, `s1_ud${2 ** k}`)
                        } else if (disable) {
                            stopAni(ent, `s1_ud${2 ** k}`)
                        }
                    }
                }
            }
        }
    }


}

function doRailAnime(ent, valid = true, disable = false) {
    //V2クライアントアニメーション移行
    if(ent.getProperty("mtc:ver")==2 && ent.getProperty("mtc:ver_stat")!=2){
        applyRail2(ent)
    }else{
        //ノーマル
        if (ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_rail2") && ent.getDynamicProperty("mtc_now_npt") === 2 && ent.getDynamicProperty("mtc_pani_off") !== 1) {
            if (valid) {
                playAni(ent, `animation.rail.s1_h`, `s_h`)
            } else if (disable) {
                stopAni(ent, `s_h`)
            }
        } else {
            const n_s = Math.min(32, ent.getDynamicProperty("n_s"))
            if (n_s < 32) {
                if (valid) {
                    playAni(ent, `animation.rail.s${n_s + 1}_h`, `s_h`)
                } else if (disable) {
                    stopAni(ent, `s_h`)
                }
            } else {
                if (valid || disable) {
                    stopAni(ent, `s_h`)
                }
            }

            for (let j = 0; j < n_s; j++) {
                const deg_y = ent.getDynamicProperty(`s${j + 1}_lr`)
                const deg_x = ent.getDynamicProperty(`s${j + 1}_ud`)

                if (deg_y > 0) {
                    for (let k = 0; k < 8; k++) {
                        if ((deg_y >> k & 1) == 1) {
                            if (valid) {
                                playAni(ent, `animation.rail.s${j + 1}_r${2 ** k}`, `s${j + 1}_lr${2 ** k}`)
                            } else if (disable) {
                                stopAni(ent, `s${j + 1}_lr${2 ** k}`)
                            }
                        }
                    }
                } else if (deg_y < 0) {
                    for (let k = 0; k < 8; k++) {
                        if (((-deg_y) >> k & 1) == 1) {
                            if (valid) {
                                playAni(ent, `animation.rail.s${j + 1}_l${2 ** k}`, `s${j + 1}_lr${2 ** k}`)
                            } else if (disable) {
                                stopAni(ent, `s${j + 1}_lr${2 ** k}`)
                            }
                        }
                    }
                }
                if (deg_x > 0) {
                    for (let k = 0; k < 8; k++) {
                        if ((deg_x >> k & 1) == 1) {
                            if (valid) {
                                playAni(ent, `animation.rail.s${j + 1}_u${2 ** k}`, `s${j + 1}_ud${2 ** k}`)
                            } else if (disable) {
                                stopAni(ent, `s${j + 1}_ud${2 ** k}`)
                            }
                        }
                    }
                } else if (deg_x < 0) {
                    for (let k = 0; k < 8; k++) {
                        if (((-deg_x) >> k & 1) == 1) {
                            if (valid) {
                                playAni(ent, `animation.rail.s${j + 1}_d${2 ** k}`, `s${j + 1}_ud${2 ** k}`)
                            } else if (disable) {
                                stopAni(ent, `s${j + 1}_ud${2 ** k}`)
                            }
                        }
                    }
                }
            }
        }

        //分岐
        if (ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_rail2")) {
            if (ent.getDynamicProperty("mtc_now_npt") !== 2 && ent.getDynamicProperty("mtc_pani_off") !== 1) {
                if (valid) {
                    playAni(ent, `animation.rail.p2s1_h`, `p2s_h`)
                } else if (disable) {
                    stopAni(ent, `p2s_h`)
                }
            } else {
                const n_s = Math.min(32, ent.getDynamicProperty("n_p2s"))
                if (n_s < 32) {
                    if (valid) {
                        playAni(ent, `animation.rail.p2s${n_s + 1}_h`, `p2s_h`)
                    } else if (disable) {
                        stopAni(ent, `p2s_h`)
                    }
                } else {
                    if (valid || disable) {
                        stopAni(ent, `p2s_h`)
                    }
                }

                for (let j = 0; j < n_s; j++) {
                    const deg_y = ent.getDynamicProperty(`p2s${j + 1}_lr`)
                    const deg_x = ent.getDynamicProperty(`p2s${j + 1}_ud`)
                    if (deg_y > 0) {
                        for (let k = 0; k < 8; k++) {
                            if ((deg_y >> k & 1) == 1) {
                                if (valid) {
                                    playAni(ent, `animation.rail.p2s${j + 1}_r${2 ** k}`, `p2s${j + 1}_lr${2 ** k}`)
                                } else if (disable) {
                                    stopAni(ent, `p2s${j + 1}_lr${2 ** k}`)
                                }
                            }
                        }
                    } else if (deg_y < 0) {
                        for (let k = 0; k < 8; k++) {
                            if (((-deg_y) >> k & 1) == 1) {
                                if (valid) {
                                    playAni(ent, `animation.rail.p2s${j + 1}_l${2 ** k}`, `p2s${j + 1}_lr${2 ** k}`)
                                } else if (disable) {
                                    stopAni(ent, `p2s${j + 1}_lr${2 ** k}`)
                                }
                            }
                        }
                    }
                    if (deg_x > 0) {
                        for (let k = 0; k < 8; k++) {
                            if ((deg_x >> k & 1) == 1) {
                                if (valid) {
                                    playAni(ent, `animation.rail.p2s${j + 1}_u${2 ** k}`, `p2s${j + 1}_ud${2 ** k}`)
                                } else if (disable) {
                                    stopAni(ent, `p2s${j + 1}_ud${2 ** k}`)
                                }
                            }
                        }
                    } else if (deg_x < 0) {
                        for (let k = 0; k < 8; k++) {
                            if (((-deg_x) >> k & 1) == 1) {
                                if (valid) {
                                    playAni(ent, `animation.rail.p2s${j + 1}_d${2 ** k}`, `p2s${j + 1}_ud${2 ** k}`)
                                } else if (disable) {
                                    stopAni(ent, `p2s${j + 1}_ud${2 ** k}`)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function applyRail2(ent){
    if(ent.getProperty("mtc:ver")==2 && ent.getProperty("mtc:ver_stat")!=2 &&  !ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_railhide")){
        let point=0
        if(ent.getDynamicProperty("mtc_pani_off") !== 1){
            if(ent.getDynamicProperty("mtc_now_npt") === 2){
                point=2
            }else{
                point=1
            }
        }

        let vals=[]

        const n_s = Math.min(32, ent.getDynamicProperty("n_s"))
        vals.push(n_s)
        let old
        
        old=0
        for (let j = 0; j < n_s; j++) {
            const deg2 = ent.getDynamicProperty(`s${j + 1}_lr`)
            vals.push(deg2-old)
            old=deg2
        }
        old=0
        for (let j = 0; j < n_s; j++) {
            const deg2 = ent.getDynamicProperty(`s${j + 1}_ud`)
            vals.push(deg2-old)
            old=deg2
        }



        if (ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_rail2")) {
            const n_p2s = Math.min(32, ent.getDynamicProperty("n_p2s"))
            vals.push(n_p2s)

            old=0
            for (let j = 0; j < n_p2s; j++) {
                const deg2 = ent.getDynamicProperty(`p2s${j + 1}_lr`)
                vals.push(deg2-old)
                old=deg2
            }
            old=0
            for (let j = 0; j < n_p2s; j++) {
                const deg2 = ent.getDynamicProperty(`p2s${j + 1}_ud`)
                vals.push(deg2-old)
                old=deg2
            }
        }

        const { encodedArray, originalDataLength } = huffmanEncodeToArray24bit(vals,RAIL_HUFFMAN_TABLE)


        if(encodedArray.length<=28){
            //更新成功時
            for(let i=0;i<encodedArray.length;i++){
                ent.setProperty(`mtc:data${i}`,encodedArray[i])
            }

            ent.setProperty("mtc:point",point)

            ent.setProperty("mtc:stat",(ent.getProperty("mtc:stat")??0)+1)
            ent.setProperty("mtc:ver_stat",2)
        }else{
            //更新失敗：圧縮後のデータ長がオーバーした場合旧システムとして扱う
            ent.setProperty("mtc:ver",0)
            ent.setProperty("mtc:ver_stat",0)
        }
    }
}
//毎秒実行
system.runInterval(() => {
    //ストラクチャーブロック禁止
    let struct_moved_ents=[]
    const ents_r = getEntities({ families: ["mtc_rail"] })
    for (const ent of ents_r) {
        const bz1 = ent.getDynamicProperty("mtc_bz_p1")
        let offset = -getRailOffset(ent)//-(ent.getComponent("minecraft:variant")?.value??68)*0.01
        const bz1_offset={x:bz1.x,y:bz1.y+offset,z:bz1.z}
        let def_loc = ent.getDynamicProperty("location")
        if (def_loc === undefined){
            def_loc=bz1_offset
            ent.setDynamicProperty("location",def_loc);
        } 

        const loc = ent.location
        //const df2 = (bz1.x - loc.x) ** 2 + (bz1.z - loc.z) ** 2
        const d = dist(bz1_offset,loc)
        if (loc.y < KILL_HEIGHT) {
            ent.addTag("mtc_safe_remove")
            ent.remove()
            continue
        }
        const velocity = dist(ent.getVelocity(),{x:0,y:0,z:0})

        if(velocity>0){
            ent.clearVelocity()
        }
        if(velocity>0 && d<5){            
            ent.teleport(def_loc);
        }else if(d>0.01/*0.7*/){
            struct_moved_ents.push(ent)
            
            const bz2 = ent.getDynamicProperty("mtc_bz_p2")
            const bz3 = ent.getDynamicProperty("mtc_bz_p3")
            let dir_x=bz2.x-bz1_offset.x
            let dir_z=bz2.z-bz1_offset.z
            const len=Math.sqrt(dir_x*dir_x+dir_z*dir_z)
            if(len>0.01){
                dir_x/=len
                dir_z/=len
                let dir_r = Math.atan2(-dir_x,dir_z)*57.29578
                if(dir_r>=180)dir_r-=360;
                let dir_a = Math.round(dir_r /45)*45


                //45単位の回転補正
                let edir_dr = ent.getRotation().y-dir_a
                let edir_da = Math.round(edir_dr /90)*90
                let edir_a=edir_da+dir_a
                if(edir_a>=180)edir_a-=360;
                ent.setRotation({x:0,y:edir_a})

                let move_x = loc.x-bz1_offset.x
                let move_y = loc.y-bz1_offset.y
                let move_z = loc.z-bz1_offset.z


                //移動
                //回転ベクトル
                const sin_da = Math.round(Math.sin(edir_da*0.0174533))
                const cos_da = Math.round(Math.cos(edir_da*0.0174533))

                //平行移動
                let base= {x:bz1_offset.x+move_x,y:bz1_offset.y+move_y,z:bz1_offset.z+move_z}
                let new_bz1= {x:bz1.x+move_x,y:bz1.y+move_y,z:bz1.z+move_z}
                let new_bz2= {x:bz2.x+move_x,y:bz2.y+move_y,z:bz2.z+move_z}
                let new_bz3= {x:bz3.x+move_x,y:bz3.y+move_y,z:bz3.z+move_z}
                ent.setDynamicProperty("mtc_bz_p1",new_bz1)
                ent.setDynamicProperty("location",base)
                //回転移動
                ent.setDynamicProperty("mtc_bz_p2",rotateXZ(new_bz2,new_bz1,sin_da,cos_da))
                ent.setDynamicProperty("mtc_bz_p3",rotateXZ(new_bz3,new_bz1,sin_da,cos_da))


                if(ent.getDynamicProperty("mtc_bz1_p1")!==undefined){
                    let p1_bz1=ent.getDynamicProperty("mtc_bz1_p1")
                    let p1_bz2=ent.getDynamicProperty("mtc_bz1_p2")
                    let p1_bz3=ent.getDynamicProperty("mtc_bz1_p3")
                    let p2_bz1=ent.getDynamicProperty("mtc_bz2_p1")
                    let p2_bz2=ent.getDynamicProperty("mtc_bz2_p2")
                    let p2_bz3=ent.getDynamicProperty("mtc_bz2_p3")
                    //平行移動
                    p1_bz1={x:p1_bz1.x+move_x,y:p1_bz1.y+move_y,z:p1_bz1.z+move_z}
                    p1_bz2={x:p1_bz2.x+move_x,y:p1_bz2.y+move_y,z:p1_bz2.z+move_z}
                    p1_bz3={x:p1_bz3.x+move_x,y:p1_bz3.y+move_y,z:p1_bz3.z+move_z}
                    p2_bz1={x:p2_bz1.x+move_x,y:p2_bz1.y+move_y,z:p2_bz1.z+move_z}
                    p2_bz2={x:p2_bz2.x+move_x,y:p2_bz2.y+move_y,z:p2_bz2.z+move_z}
                    p2_bz3={x:p2_bz3.x+move_x,y:p2_bz3.y+move_y,z:p2_bz3.z+move_z}
                    ent.setDynamicProperty("mtc_bz1_p1",p1_bz1)
                    ent.setDynamicProperty("mtc_bz2_p1",p2_bz1)
                    //回転移動
                    ent.setDynamicProperty("mtc_bz1_p2",rotateXZ(p1_bz2,new_bz1,sin_da,cos_da))
                    ent.setDynamicProperty("mtc_bz1_p3",rotateXZ(p1_bz3,new_bz1,sin_da,cos_da))
                    ent.setDynamicProperty("mtc_bz2_p2",rotateXZ(p2_bz2,new_bz1,sin_da,cos_da))
                    ent.setDynamicProperty("mtc_bz2_p3",rotateXZ(p2_bz3,new_bz1,sin_da,cos_da))
                }


            }else{
                let move_x = loc.x-bz1_offset.x
                let move_y = loc.y-bz1_offset.y
                let move_z = loc.z-bz1_offset.z

                let base= {x:bz1_offset.x+move_x,y:bz1_offset.y+move_y,z:bz1_offset.z+move_z}
                let new_bz1= {x:bz1.x+move_x,y:bz1.y+move_y,z:bz1.z+move_z}
                ent.setDynamicProperty("mtc_bz_p1",new_bz1)
                ent.setDynamicProperty("location",base)

                if(ent.getDynamicProperty("mtc_bz1_p1")!==undefined){
                    let p1_bz1=ent.getDynamicProperty("mtc_bz1_p1")
                    let p2_bz1=ent.getDynamicProperty("mtc_bz2_p1")
                    p1_bz1={x:p1_bz1.x+move_x,y:p1_bz1.y+move_y,z:p1_bz1.z+move_z}
                    p2_bz1={x:p2_bz1.x+move_x,y:p2_bz1.y+move_y,z:p2_bz1.z+move_z}
                    ent.setDynamicProperty("mtc_bz1_p1",p1_bz1)
                    ent.setDynamicProperty("mtc_bz2_p1",p2_bz1)
                }
            }


        }
    }

    //ポール水流対策
    let ents_p =  getEntities({ families: ["mtc_pole"] })
    for (const ent of ents_p) {
        const loc = ent.location
        if (loc.y < KILL_HEIGHT) {
            ent.addTag("mtc_safe_remove")
            ent.remove()
            continue
        }
        const p1 = ent.getDynamicProperty("mtc_po_p1")
        let def_loc = ent.getDynamicProperty("location")
        if (def_loc === undefined){
            def_loc=p1
            ent.setDynamicProperty("location",def_loc);
        } 


        const d = dist(p1,loc)
        const velocity = dist(ent.getVelocity(),{x:0,y:0,z:0})

        if(velocity>0){
            ent.clearVelocity()
        }
        if(velocity>0 && d<5){            
            ent.teleport(def_loc);

        }else if(d>0.01){
            struct_moved_ents.push(ent)
            
            const p2 = ent.getDynamicProperty("mtc_po_p2")
            let dir_x=p2.x-p1.x
            let dir_z=p2.z-p1.z
            const len=Math.sqrt(dir_x*dir_x+dir_z*dir_z)
            if(len>0.01){
                dir_x/=len
                dir_z/=len
                let dir_r = Math.atan2(-dir_x,dir_z)*57.29578
                if(dir_r>=180)dir_r-=360;
                let dir_a = Math.round(dir_r /45)*45

                //45単位の回転補正
                let edir_dr = ent.getRotation().y-dir_a
                let edir_da = Math.round(edir_dr /90)*90
                let edir_a=edir_da+dir_a
                if(edir_a>=180)edir_a-=360;

                //平行移動
                let move_x = loc.x-p1.x
                let move_y = loc.y-p1.y
                let move_z = loc.z-p1.z


                //移動
                //回転ベクトル
                const sin_da = Math.round(Math.sin(edir_da*0.0174533))
                const cos_da = Math.round(Math.cos(edir_da*0.0174533))

                //平行移動
                let new_p2= {x:p2.x+move_x,y:p2.y+move_y,z:p2.z+move_z}
                ent.setDynamicProperty("mtc_po_p1",loc)
                ent.setDynamicProperty("location",loc)
                //回転移動
                ent.setDynamicProperty("mtc_po_p2",rotateXZ(new_p2,loc,sin_da,cos_da))
            }else{
                ent.setDynamicProperty("mtc_po_p1",loc)
                ent.setDynamicProperty("location",loc)
            }


        }
    }

    if(struct_moved_ents.length>0){
        world.sendMessage({rawtext:[{"translate":"mtc:mtc.warn.rr_structure"}]})
        for(const ent of struct_moved_ents){
                world.sendMessage(`§cReal Rail at ${ent.location.x.toFixed(2)} ${ent.location.y.toFixed(2)} ${ent.location.z.toFixed(2)}`)
        }
    }

    //自動乗務
    for (const pl of players_g) {
        if (pl.isValid()) {
            if (!pl.hasTag("mtc_ride")) {
                let suc = false
                const ride_cp = pl.getComponent("minecraft:riding")
                if (ride_cp !== undefined) {
                    //乗ってる場合
                    const ride = ride_cp.entityRidingOn
                    if (ride.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_body")) {
                        const fid = obj_mtc_fid.getScore(ride);
                        obj_mtc_parent.setScore(pl, fid)
                        suc = true
                    } else if (ride.typeId == "mtc:seat") {
                        const ride_cp = ride.getComponent("minecraft:riding")
                        if (ride_cp !== undefined) {
                            const ride = ride_cp.entityRidingOn
                            if (ride.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_body")) {
                                const fid = obj_mtc_fid.getScore(ride);
                                obj_mtc_parent.setScore(pl, fid)
                                suc = true
                            }
                        }
                    }
                }

                if (!suc) {
                    obj_mtc_parent.setScore(pl, 0)
                }
            }
        }
    }



    let has_marker2 = false
    let has_marker2_pls = []
    let has_marker = false
    let has_marker_pls = []
    for (const pl of players_g) {
        const item = pl.getComponent("minecraft:inventory").container.getSlot(pl.selectedSlotIndex)
        if (item.hasItem()) {
            if (item.typeId == "mtc:i_marker2") {
                has_marker2 = true
                has_marker2_pls.push(pl)
            }else if (item.typeId == "mtc:i_marker0" || item.typeId == "mtc:i_marker1") {
                has_marker = true
                has_marker_pls.push(pl)
            }
        }
    }

    //架線柱パーティクル
    if (has_marker2) {
        let ents_m = []
        ents_m = ents_m.concat(world.getDimension("overworld").getEntities({ families: ["mtc_pole"] }))
        ents_m = ents_m.concat(world.getDimension("nether").getEntities({ families: ["mtc_pole"] }))
        ents_m = ents_m.concat(world.getDimension("the_end").getEntities({ families: ["mtc_pole"] }))
        for (const ent of ents_m) {
            const eloc = ent.location
            if (ent.dimension.getEntities({ type: "player", location: eloc, maxDistance: 64, closest: 1 }).length > 0) {
                for(const pl of has_marker2_pls){
                    if(dist2(pl.location,eloc)<4096){
                        try{
                            pl.spawnParticle("mtc:high",{x:eloc.x,y:eloc.y+1,z:eloc.z})
                            pl.spawnParticle("mtc:high",{x:eloc.x,y:eloc.y+3,z:eloc.z})
                            pl.spawnParticle("mtc:high",{x:eloc.x,y:eloc.y+5,z:eloc.z})
                        }catch (e) {}
                    }
                }
            }
        }
    }

    for (const pl of players_g) {
        const item = pl.getComponent("minecraft:inventory").container.getSlot(pl.selectedSlotIndex)
        if (item.hasItem()) {
        }
    }

    //レールパーティクル
    if (has_marker) {
        let ents_m = []
        ents_m = ents_m.concat(world.getDimension("overworld").getEntities({ families: ["mtc_rail"] }))
        ents_m = ents_m.concat(world.getDimension("nether").getEntities({ families: ["mtc_rail"] }))
        ents_m = ents_m.concat(world.getDimension("the_end").getEntities({ families: ["mtc_rail"] }))
        for (const ent of ents_m) {
            const eloc = ent.location
            const p1 = ent.getDynamicProperty("mtc_bz_p1")
            const p2 = ent.getDynamicProperty("mtc_bz_p2")
            const p3 = ent.getDynamicProperty("mtc_bz_p3")

            for(const pl of has_marker_pls){
                if(dist2(pl.location,eloc)<4096){
                    try{
                        pl.spawnParticle("mtc:high",{x:eloc.x,y:eloc.y,z:eloc.z})
                    }catch (e) {}
                }
            }

            if (ent.dimension.getEntities({ type: "player", location: eloc, maxDistance: 64, closest: 1 }).length > 0) {
                //ent.runCommand(`particle minecraft:sculk_soul_particle ${(eloc.x).toFixed(5)} ${(eloc.y).toFixed(5)} ${(eloc.z).toFixed(5)}`);

                if (ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_railhide")) {

                    const len = bezierLength(p1, p2, p3, 0, 1)
                    let rail_offset=getRailOffset(ent)//(ent.getComponent("minecraft:variant")?.value??68)*0.01
                    let offset = 0
                    if (rail_offset<0.5) offset = 0.5-rail_offset;
                    for (let t = 0; t <= 1; t += 1 / len) {
                        if (/*Math.random() <= 0.5*/Math.floor(system.currentTick/20)%2 == 0) {
                            const p = getBezier(p1, p2, p3, t)
                            if (ent.dimension.getEntities({ type: "player", location: p, maxDistance: 64, closest: 1 }).length > 0) {
                                //ent.runCommand(`particle minecraft:villager_happy ${(p.x).toFixed(5)} ${(p.y + offset).toFixed(5)} ${(p.z).toFixed(5)}`)
                                for(const pl of has_marker_pls){
                                    if(dist2(pl.location,p)<4096){
                                        try{
                                            pl.spawnParticle("mtc:long",{x:p.x,y:p.y+offset,z:p.z})
                                        }catch (e) {}
                                    }
                                }
                            } else {
                                t += 4 / len
                            }
                        }
                    }
                }
            }
        }
    }

    //マーカーパーティクル
    let ents_m = []
    ents_m = ents_m.concat(world.getDimension("overworld").getEntities({ families: ["mtc_marker"] }))
    ents_m = ents_m.concat(world.getDimension("nether").getEntities({ families: ["mtc_marker"] }))
    ents_m = ents_m.concat(world.getDimension("the_end").getEntities({ families: ["mtc_marker"] }))
    let own_ids = {}
    let final_ent = undefined
    let first_ent = undefined
    let final_index = -1
    for (const ent of ents_m) {
        own_ids[ent.getDynamicProperty("mtc_owner")] = ent
        const pre_pos = ent.getDynamicProperty("mtc_pre_pos")
        const index = ent.getDynamicProperty("mtc_mark_index")
        if (index > final_index) {
            final_ent = ent
            final_index = index
        }
        if (index == 0) {
            first_ent = ent
        }
        if (pre_pos !== undefined && index > 0) {
            const dx = ent.location.x - pre_pos.x
            const dy = ent.location.y - pre_pos.y
            const dz = ent.location.z - pre_pos.z
            const len = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)
            for (let t = 0; t <= 1; t += 0.5 / len) {
                if (/*Math.random() <= 0.5*/Math.floor(system.currentTick/20)%2 == 0) {
                    const p = { x: ent.location.x - dx * t, y: ent.location.y - dy * t + 0.5, z: ent.location.z - dz * t }

                    if (ent.dimension.getEntities({ type: "player", location: p, maxDistance: 64, closest: 1 }).length > 0) {
                        //ent.runCommand(`particle minecraft:villager_happy ${(p.x).toFixed(5)} ${(p.y).toFixed(5)} ${(p.z).toFixed(5)}`)
                        try{
                            ent.dimension.spawnParticle("mtc:long",p)
                        }catch (e) {}
                    } else {
                        t += 4 / len
                    }
                }
            }
        }
    }

    //マーカー位置表示
    if (final_ent !== undefined) {
        const pl = world.getEntity(final_ent.getDynamicProperty("mtc_owner"))
        let trg_pos = pl.location

        const blh = pl.getBlockFromViewDirection()
        if (blh !== undefined) {
            let blp = blh.block.location
            const fcp = blh.faceLocation
            blp.x += fcp.x
            blp.y += fcp.y
            blp.z += fcp.z

            blp.x = Math.floor(blp.x) + 0.5
            blp.y = Math.floor(blp.y * 2) / 2
            blp.z = Math.floor(blp.z) + 0.5

            trg_pos = blp
        }

        const di = dist(final_ent.location, trg_pos)
        const dx = trg_pos.x - final_ent.location.x
        const dy = trg_pos.y - final_ent.location.y
        const dz = trg_pos.z - final_ent.location.z

        pl.runCommand(`title @s actionbar ${di.toFixed(1)}m  dx: ${dx.toFixed(1)}  dy: ${dy.toFixed(1)}  dz: ${dz.toFixed(1)}`)

        {
            const dx = trg_pos.x - first_ent.location.x
            const dz = trg_pos.z - first_ent.location.z
            for (let i = -3; i < 4; i++) {
                let dr = Math.round(dz / 20) * 20 + 10 * i
                let ds = Math.round(dx / 20) * 20
                let d = Math.abs(dr)
                dr -= 0.6
                //pl.runCommand(`particle mtc:ud ${(first_ent.location.x + 1.6 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //pl.runCommand(`particle mtc:num${d % 10} ${(first_ent.location.x + 0.6 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //if (d >= 10) pl.runCommand(`particle mtc:num${Math.trunc(d / 10) % 10} ${(first_ent.location.x + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //if (d >= 100) pl.runCommand(`particle mtc:num${Math.trunc(d / 100) % 10} ${(first_ent.location.x - 0.6 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //if (d >= 1000) pl.runCommand(`particle mtc:num${Math.trunc(d / 1000) % 10} ${(first_ent.location.x - 1.2 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //if (d >= 10000) pl.runCommand(`particle mtc:num${Math.trunc(d / 10000) % 10} ${(first_ent.location.x - 1.8 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)

                try{
                    pl.spawnParticle(`mtc:ud`, {x:first_ent.location.x + 1.6 + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr})
                    pl.spawnParticle(`mtc:num${d % 10}`, {x:first_ent.location.x + 0.6 + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr})

                    if (d >= 10) pl.spawnParticle(`mtc:num${Math.trunc(d / 10) % 10}`,{x:first_ent.location.x + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr});
                    if (d >= 100) pl.spawnParticle(`mtc:num${Math.trunc(d / 100) % 10}`,{x:first_ent.location.x - 0.6 + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr});
                    if (d >= 1000) pl.spawnParticle(`mtc:num${Math.trunc(d / 1000) % 10}`,{x:first_ent.location.x - 1.2,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr});
                    if (d >= 10000) pl.spawnParticle(`mtc:num${Math.trunc(d / 10000) % 10}`,{x:first_ent.location.x - 1.8 + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr});
                }catch (e) {}
            }
            for (let i = -3; i < 4; i++) {
                let dr = Math.round(dx / 20) * 20 + 10 * i
                let ds = Math.round(dz / 20) * 20 + 0.6
                let d = Math.abs(dr)
                //pl.runCommand(`particle mtc:lr ${(first_ent.location.x + 1.6 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //pl.runCommand(`particle mtc:num${d % 10} ${(first_ent.location.x + 0.6 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //if (d >= 10) pl.runCommand(`particle mtc:num${Math.trunc(d / 10) % 10} ${(first_ent.location.x + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //if (d >= 100) pl.runCommand(`particle mtc:num${Math.trunc(d / 100) % 10} ${(first_ent.location.x - 0.6 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //if (d >= 1000) pl.runCommand(`particle mtc:num${Math.trunc(d / 1000) % 10} ${(first_ent.location.x - 1.2 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //if (d >= 10000) pl.runCommand(`particle mtc:num${Math.trunc(d / 10000) % 10} ${(first_ent.location.x - 1.8 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                try{
                    pl.spawnParticle(`mtc:lr`, {x:first_ent.location.x + 1.6 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds})
                    pl.spawnParticle(`mtc:num${d % 10}`, {x:first_ent.location.x + 0.6 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds})

                    if (d >= 10) pl.spawnParticle(`mtc:num${Math.trunc(d / 10) % 10}`,{x:first_ent.location.x + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds});
                    if (d >= 100) pl.spawnParticle(`mtc:num${Math.trunc(d / 100) % 10}`,{x:first_ent.location.x - 0.6 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds});
                    if (d >= 1000) pl.spawnParticle(`mtc:num${Math.trunc(d / 1000) % 10}`,{x:first_ent.location.x - 1.2 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds});
                    if (d >= 10000) pl.spawnParticle(`mtc:num${Math.trunc(d / 10000) % 10}`,{x:first_ent.location.x - 1.8 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds});
                }catch (e) {}
            }


            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    let dx2 = Math.round(i + dx / 20) * 20
                    let dz2 = Math.round(j + dz / 20) * 20
                    //pl.runCommand(`particle mtc:matrix1 ${(first_ent.location.x + dx2).toFixed(4)} ${(first_ent.location.y + 0.05).toFixed(4)} ${(first_ent.location.z + dz2).toFixed(4)}`)
                    try{
                        pl.spawnParticle("mtc:matrix1",{x:first_ent.location.x + dx2,y:first_ent.location.y + 0.05,z:first_ent.location.z + dz2})
                    }catch (e) {}
                }
            }


        }
    }


    //    for (const pl of players_g) {
    for (const own_id in own_ids) {
        const own_ent = own_ids[own_id]
        const opl = world.getEntity(own_id)
        let init_loc
        {
            let marker0s = []
            const bef_ents = own_ent.dimension.getEntities({ type: "mtc:marker0" })
            let n_bef_ent = 0
            for (const ent of bef_ents) {
                if (ent.getDynamicProperty("mtc_owner") === own_id) {
                    n_bef_ent++
                    const index = ent.getDynamicProperty("mtc_mark_index")
                    marker0s[index] = ent.location
                    if (index === 0)
                        init_loc = ent.location;
                }
            }
            if (dist2(marker0s[marker0s.length - 1], opl.location) > 9) {
                const item = opl.getComponent("minecraft:inventory").container.getSlot(opl.selectedSlotIndex)
                if (item.hasItem()) {
                    if (item.typeId == "mtc:i_marker0") {
                        marker0s.push(opl.location)
                    }
                }
            }
            if (n_bef_ent > 0) {
                const bzs = splitBezier(marker0s)
                for (const bz of bzs) {
                    const len = bezierLength(bz[0], bz[1], bz[2], 0, 1)
                    for (let t = 0; t <= 1; t += 1 / len) {
                        const loc = getBezier(bz[0], bz[1], bz[2], t)
                        if (own_ent.dimension.getEntities({ type: "player", location: loc, maxDistance: 64, closest: 1 }).length > 0) {
                            //own_ent.runCommand(`particle minecraft:electric_spark_particle ${loc.x.toFixed(5)} ${(loc.y + 0.2).toFixed(5)} ${loc.z.toFixed(5)}`)
                            own_ent.dimension.spawnParticle("mtc:short",{x:loc.x,y:loc.y+0.2,z:loc.z})
                        } else {
                            t += 4 / len
                        }

                    }
                }
            }
        }
        {
            let marker1s = [init_loc]
            const bef_ents = own_ent.dimension.getEntities({ type: "mtc:marker1" })
            let n_bef_ent = 0
            for (const ent of bef_ents) {
                if (ent.getDynamicProperty("mtc_owner") === own_id) {
                    n_bef_ent++
                    const index = ent.getDynamicProperty("mtc_mark_index")
                    marker1s[index] = ent.location
                }
            }
            if (dist2(marker1s[marker1s.length - 1], opl.location) > 9) {
                const item = opl.getComponent("minecraft:inventory").container.getSlot(opl.selectedSlotIndex)
                if (item.hasItem()) {
                    if (item.typeId == "mtc:i_marker1") {
                        marker1s.push(opl.location)
                    }
                }
            }

            if (n_bef_ent > 0) {
                const bzs = splitBezier(marker1s)
                for (const bz of bzs) {
                    const len = bezierLength(bz[0], bz[1], bz[2], 0, 1)
                    for (let t = 0; t <= 1; t += 1 / len) {
                        const loc = getBezier(bz[0], bz[1], bz[2], t)
                        if (own_ent.dimension.getEntities({ type: "player", location: loc, maxDistance: 64, closest: 1 }).length > 0) {
                            //own_ent.runCommand(`particle minecraft:electric_spark_particle ${loc.x.toFixed(5)} ${(loc.y + 0.2).toFixed(5)} ${loc.z.toFixed(5)}`);
                            own_ent.dimension.spawnParticle("mtc:short",{x:loc.x,y:loc.y+0.2,z:loc.z})
                        } else {
                            t += 4 / len
                        }

                    }
                }
            }
        }
    }

    //ポールマーカーパーティクル
    let ents_pm = []
    first_ent = undefined
    final_ent = undefined
    final_index = -1
    ents_pm = ents_pm.concat(world.getDimension("overworld").getEntities({ families: ["mtc_pmarker"] }))
    ents_pm = ents_pm.concat(world.getDimension("nether").getEntities({ families: ["mtc_pmarker"] }))
    ents_pm = ents_pm.concat(world.getDimension("the_end").getEntities({ families: ["mtc_pmarker"] }))
    for (const ent of ents_pm) {
        const pre_pos = ent.getDynamicProperty("mtc_pre_pos")
        const index = ent.getDynamicProperty("mtc_mark_index")
        if (index > final_index) {
            final_ent = ent
            final_index = index
        }
        if (index == 0) {
            first_ent = ent
        }
        if (pre_pos !== undefined && index > 0) {
            const dx = ent.location.x - pre_pos.x
            const dy = ent.location.y - pre_pos.y
            const dz = ent.location.z - pre_pos.z
            const len = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)
            for (let t = 0; t <= 1; t += 0.5 / len) {
                if (Math.random() <= 0.5) {
                    const p = { x: ent.location.x - dx * t, y: ent.location.y - dy * t + 0.5, z: ent.location.z - dz * t }
                    if (ent.dimension.getEntities({ type: "player", location: p, maxDistance: 64, closest: 1 }).length > 0) {
                        //ent.runCommand(`particle minecraft:villager_happy ${(p.x).toFixed(5)} ${(p.y).toFixed(5)} ${(p.z).toFixed(5)}`)
                        ent.dimension.spawnParticle("mtc:long",p)
                    } else {
                        t += 4 / len
                    }
                }
            }
        } else if (index === 0) {
            //playAni(ent, "animation.mtc_marker.show", "marker_show")
        }
    }

    if (final_ent !== undefined) {
        const pl = world.getEntity(final_ent.getDynamicProperty("mtc_owner"))
        let trg_pos = pl.location

        const blh = pl.getBlockFromViewDirection()
        if (blh !== undefined) {
            let blp = blh.block.location
            const fcp = blh.faceLocation
            blp.x += fcp.x
            blp.y += fcp.y
            blp.z += fcp.z

            blp.x = Math.floor(blp.x) + 0.5
            blp.y = Math.floor(blp.y * 2) / 2
            blp.z = Math.floor(blp.z) + 0.5

            trg_pos = blp
        }

        const di = dist(final_ent.location, trg_pos)
        const dx = trg_pos.x - final_ent.location.x
        const dy = trg_pos.y - final_ent.location.y
        const dz = trg_pos.z - final_ent.location.z

        pl.runCommand(`title @s actionbar ${di.toFixed(1)}m  dx: ${dx.toFixed(1)}  dy: ${dy.toFixed(1)}  dz: ${dz.toFixed(1)}`)

        {
            const dx = trg_pos.x - first_ent.location.x
            const dz = trg_pos.z - first_ent.location.z
            for (let i = -3; i < 4; i++) {
                let dr = Math.round(dz / 20) * 20 + 10 * i
                let ds = Math.round(dx / 10) * 10
                let d = Math.abs(dr)
                dr -= 0.6
                //pl.runCommand(`particle mtc:ud ${(first_ent.location.x + 1.6 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //pl.runCommand(`particle mtc:num${d % 10} ${(first_ent.location.x + 0.6 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //if (d >= 10) pl.runCommand(`particle mtc:num${Math.trunc(d / 10) % 10} ${(first_ent.location.x + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //if (d >= 100) pl.runCommand(`particle mtc:num${Math.trunc(d / 100) % 10} ${(first_ent.location.x - 0.6 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //if (d >= 1000) pl.runCommand(`particle mtc:num${Math.trunc(d / 1000) % 10} ${(first_ent.location.x - 1.2 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                //if (d >= 10000) pl.runCommand(`particle mtc:num${Math.trunc(d / 10000) % 10} ${(first_ent.location.x - 1.8 + ds).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + dr).toFixed(4)}`)
                try{
                    pl.spawnParticle(`mtc:ud`, {x:first_ent.location.x + 1.6 + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr})
                    pl.spawnParticle(`mtc:num${d % 10}`, {x:first_ent.location.x + 0.6 + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr})

                    if (d >= 10) pl.spawnParticle(`mtc:num${Math.trunc(d / 10) % 10}`,{x:first_ent.location.x + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr});
                    if (d >= 100) pl.spawnParticle(`mtc:num${Math.trunc(d / 100) % 10}`,{x:first_ent.location.x - 0.6 + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr});
                    if (d >= 1000) pl.spawnParticle(`mtc:num${Math.trunc(d / 1000) % 10}`,{x:first_ent.location.x - 1.2,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr});
                    if (d >= 10000) pl.spawnParticle(`mtc:num${Math.trunc(d / 10000) % 10}`,{x:first_ent.location.x - 1.8 + ds,y:first_ent.location.y + 0.1,z:first_ent.location.z + dr});
                }catch (e) {}
            }
            for (let i = -3; i < 4; i++) {
                let dr = Math.round(dx / 20) * 20 + 10 * i
                let ds = Math.round(dz / 10) * 10 + 0.6
                let d = Math.abs(dr)
                //pl.runCommand(`particle mtc:lr ${(first_ent.location.x + 1.6 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //pl.runCommand(`particle mtc:num${d % 10} ${(first_ent.location.x + 0.6 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //if (d >= 10) pl.runCommand(`particle mtc:num${Math.trunc(d / 10) % 10} ${(first_ent.location.x + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //if (d >= 100) pl.runCommand(`particle mtc:num${Math.trunc(d / 100) % 10} ${(first_ent.location.x - 0.6 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //if (d >= 1000) pl.runCommand(`particle mtc:num${Math.trunc(d / 1000) % 10} ${(first_ent.location.x - 1.2 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                //if (d >= 10000) pl.runCommand(`particle mtc:num${Math.trunc(d / 10000) % 10} ${(first_ent.location.x - 1.8 + dr).toFixed(4)} ${(first_ent.location.y + 0.1).toFixed(4)} ${(first_ent.location.z + ds).toFixed(4)}`)
                try{
                    pl.spawnParticle(`mtc:lr`, {x:first_ent.location.x + 1.6 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds})
                    pl.spawnParticle(`mtc:num${d % 10}`, {x:first_ent.location.x + 0.6 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds})

                    if (d >= 10) pl.spawnParticle(`mtc:num${Math.trunc(d / 10) % 10}`,{x:first_ent.location.x + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds});
                    if (d >= 100) pl.spawnParticle(`mtc:num${Math.trunc(d / 100) % 10}`,{x:first_ent.location.x - 0.6 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds});
                    if (d >= 1000) pl.spawnParticle(`mtc:num${Math.trunc(d / 1000) % 10}`,{x:first_ent.location.x - 1.2 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds});
                    if (d >= 10000) pl.spawnParticle(`mtc:num${Math.trunc(d / 10000) % 10}`,{x:first_ent.location.x - 1.8 + dr,y:first_ent.location.y + 0.1,z:first_ent.location.z + ds});
                }catch (e) {}
            }


            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    let dx2 = Math.round(i + dx / 20) * 20
                    let dz2 = Math.round(j + dz / 20) * 20
                    //pl.runCommand(`particle mtc:matrix1 ${(first_ent.location.x + dx2).toFixed(4)} ${(first_ent.location.y + 0.05).toFixed(4)} ${(first_ent.location.z + dz2).toFixed(4)}`)
                    try{
                        pl.spawnParticle("mtc:matrix1",{x:first_ent.location.x + dx2,y:first_ent.location.y + 0.05,z:first_ent.location.z + dz2})
                    }catch (e) {}
                }
            }


        }
    }


}, 20);

//毎10tick実行
let t0 = getTime()
let tps_g = 20
let scale_g = 1    //アンチラグスケール
const tps_lpf = 0.8
system.runInterval(() => {
    const t = getTime()
    const tps_temp = 10000 / (t - t0)
    tps_g = tps_temp * (1 - tps_lpf) + tps_g * tps_lpf
    tps_g = Math.min(tps_g, 20)
    obj_mtc_global.setScore("tps", Math.round(tps_g))
    if (world.getDynamicProperty("mtc_scale") > 0) {
        scale_g = world.getDynamicProperty("mtc_scale")
    } else {
        const max_scale = world.getDynamicProperty("mtc_max_scale")
        if (max_scale > 1) {
            scale_g = Math.max(1, Math.min(max_scale, 20 / tps_g))
            if (scale_g < 1.05) scale_g = 1;
        } else {
            scale_g = 1
        }
    }

    t0 = t

    world.getDimension("overworld").runCommand("function mtc/tick10")


    //車体傾斜有効時の鉄道座席選択処理
    if (world.getDynamicProperty("mtc_tilt") === 1) {
        for (const ent of bodies_g) {
            if (!ent.hasTag("mtc_selseat") && !ent.hasTag("mtc_norail")) {
                ent.addTag("mtc_selseat")
            }
        }
    }


    //カスタムアニメーション再開
    // プレイヤ付近のbody検出
    for (const pl of players_g) {

        if (ents_around_ids[pl.id] === undefined) {
            ents_around_ids[pl.id] = []
        }
        // 離れを削除
        let new_ids = []
        for (const ent_id of ents_around_ids[pl.id]) {
            try {
                const ent = world.getEntity(ent_id)
                const d = dist2(pl.location, ent.location)
                if (d < visible_dist_2) {//()64^2
                    new_ids.push(ent_id)
                }
            } catch (e) {
            }
        }
        ents_around_ids[pl.id] = new_ids

        //新規接近
        for (const ent of bodies_g) {
            const d = dist2(pl.location, ent.location)
            if (d < visible_dist_2) {//64^2
                if (!ents_around_ids[pl.id].includes(ent.id)) {
                    ents_around_ids[pl.id].push(ent.id)
                    //新規範囲内エンティティから接近したプレイヤにアニメーション
                    // DynamicProperty参照
                    let n_anis = world.scoreboard.getObjective("mtc_max_ani").getScore(ent)
                    if (n_anis === undefined) {
                        n_anis = 2
                    }

                    for (let i = 1; i <= n_anis; i++) {
                        if (ent.getDynamicProperty("ani" + i) === 1) {
                            playAni(ent, "ani" + i, "ani" + i, pl.name)
                        }
                    }

                    let atc_v = ent.getDynamicProperty("mtc_atc")

                    if (atc_v === undefined)
                        atc_v = -1;
                    //ATC(サブカスタムメーター，1/5/10km/h刻みをサポート)
                    if (atc_v >= 0) {
                        playAni(ent, "atc_" + Math.trunc(atc_v / 10) * 10, "mtc_anicon_atc_meter", pl.name)
                        playAni(ent, "atc_" + Math.trunc(atc_v / 5) * 5, "mtc_anicon_atc_meter", pl.name)
                        playAni(ent, "atc_" + atc_v, "mtc_anicon_atc_meter", pl.name)
                    }

                    const v = Math.abs(Math.ceil(obj_mtc_spd.getScore(ent) / 2000))
                    playAni(ent, "v_" + Math.trunc(v / 10) * 10, "mtc_anicon_spd_meter", pl.name)
                    playAni(ent, "v_" + Math.trunc(v / 5) * 5, "mtc_anicon_spd_meter", pl.name)
                    playAni(ent, "v_" + v, "mtc_anicon_spd_meter", pl.name)
                }
            }
        }
    }

    if (bodies_g.length > 0) {
        for (const ent of bodies_g) {
            // 地中・雨中判定
            const bd_len=ent.getDynamicProperty("mtc_body_length")
            if(bd_len!==undefined){
                const p=ent.location
                const rot=ent.getRotation().y

                const sin_da = Math.sin(rot*0.0174533)
                const cos_da = Math.cos(rot*0.0174533)

                let p1={x:p.x+1,y:p.y+1,z:p.z}
                let p2={x:p.x-1,y:p.y+1,z:p.z}
                let p3={x:p.x+1,y:p.y+1,z:p.z+bd_len}
                let p4={x:p.x-1,y:p.y+1,z:p.z+bd_len}

                //回転
                p1=rotateXZ(p1,p,sin_da,cos_da)
                p2=rotateXZ(p2,p,sin_da,cos_da)
                p3=rotateXZ(p3,p,sin_da,cos_da)
                p4=rotateXZ(p4,p,sin_da,cos_da)

                let is_sky=false
                is_sky||=(ent.dimension.getBlockFromRay(p1,{x:0,y:1,z:0})===undefined)
                is_sky||=(ent.dimension.getBlockFromRay(p2,{x:0,y:1,z:0})===undefined)
                is_sky||=(ent.dimension.getBlockFromRay(p3,{x:0,y:1,z:0})===undefined)
                is_sky||=(ent.dimension.getBlockFromRay(p4,{x:0,y:1,z:0})===undefined)

                if(ent.getProperty("mtc:is_tunnel")!==undefined) ent.setProperty("mtc:is_tunnel",!is_sky);
                if(ent.getProperty("mtc:in_rain")!==undefined) ent.setProperty("mtc:in_rain",is_sky&&is_rain_g);
            }
            
            //音源再生
            let n_sounds = world.scoreboard.getObjective("mtc_max_sound").getScore(ent)
            if (n_sounds === undefined) {
                n_sounds = 1
            }
            for (let i = 1; i <= n_sounds; i++) {
                if (ent.getDynamicProperty("sound" + i) === 1) {
                    //ent.runCommand(`execute positioned ^^^${ent.getDynamicProperty("mtc_body_length")/2} run function mtc/testSound`)
                    testSound(ent,undefined,96)
                    ent.runCommand(`playsound ${getIdBase(ent.typeId) + "_sound" + i} @a[r=32,scores={mtc_sid=0}] ^^^${ent.getDynamicProperty("mtc_body_length") / 2}  64`)
                }
            }
        }

    }
}, 10);

let fid_scores_old=[]
let masters_g=[]
let body_parent_master_refresh=true
function reflesh_formation(){
    //編成IDをキーにしたMapを一時的に作成
    const fid_map = new Map();
    for (const body of bodies_g) {
        try{
            const fid = obj_mtc_fid.getScore(body);
            if (!fid_map.has(fid)) {
                fid_map.set(fid, []);
            }
            fid_map.get(fid).push(body);
        } catch (e) {}
    }
    //作成したMapを使い、新しいキャッシュオブジェクトを効率的に構築
    const new_bodies_sfs_g = {};
    let masters=[]
    for (const body of bodies_g) {
        try{
            if(body.hasTag("mtc_parent")){
                masters.push(body)
            }
            const fid = obj_mtc_fid.getScore(body);
            new_bodies_sfs_g[body.id] = fid_map.get(fid) || [];
        } catch (e) {}
    }
    //グローバルキャッシュを新しいものに一括で置き換える
    bodies_sfs_g = new_bodies_sfs_g;
    masters_g=masters

    fid_scores_old=obj_mtc_fid.getScores()
    body_parent_master_refresh=true
}

let no_loaded_players = world.getPlayers()
let bodies_sfs_g = {}
let n_bodies_g=-1
//毎5tick実行
system.runInterval(() => {

    world.getDimension("overworld").runCommand("function mtc/tick5")

    //プレーヤキャッシュ再構築
    let new_pls = []
    for (const pl of players_g) {
        if (pl !== undefined && pl.isValid()) {
            new_pls.push(pl)
        }
    }
    players_g = new_pls

    //車両キャッシュ更新
    if(bodies_g.length!=n_bodies_g){
        let new_bds = []
        for (const ent of bodies_g) {
            if (ent.isValid()) {
                new_bds.push(ent)
            }
        }
        bodies_g = new_bds
    }
    

    //編成キャッシュ
    const current_fids=obj_mtc_fid.getScores()
    let fid_update=true
    if (current_fids.length === fid_scores_old.length && bodies_g.length===n_bodies_g) {
        fid_update=!current_fids.every((value, index) => value?.score === fid_scores_old[index]?.score);
    }
    if(fid_update){
        reflesh_formation()
    }
    
    n_bodies_g=bodies_g.length

    //取り残された座席消去
    if(seat_clean_queue.length>0){
        const batch_size=Math.max(20,Math.round(seat_clean_queue.length/8))
        const ents_seat=seat_clean_queue.splice(0,batch_size)
        for (const seat of ents_seat) {
            if(seat.isValid){
                const ride_cp = seat.getComponent("minecraft:riding")
                if (ride_cp === undefined) {
                    //乗ってない場合
                    seat.remove()
                }else{
                    const rider0 = seat.getComponent("minecraft:rideable")?.getRiders()[0]
                    if(rider0!==undefined){
                        seat.addTag("mtc_seat_has_rider")
                    }else{
                        seat.removeTag("mtc_seat_has_rider")
                    }
                    
                }
            }
        }
    }


    //レールアニメ高速
    aniInvalidRail()

    //分岐レッドストーン検知
    let ents_rail2 = world.getDimension("overworld").getEntities({ families: ["mtc_rail2"] })
    ents_rail2 = ents_rail2.concat(world.getDimension("nether").getEntities({ families: ["mtc_rail2"] }))
    ents_rail2 = ents_rail2.concat(world.getDimension("the_end").getEntities({ families: ["mtc_rail2"] }))
    for (const ent of ents_rail2) {
        const btm_block = ent.dimension.getBlock({ x: ent.location.x, y: ent.location.y - 1, z: ent.location.z })
        if (btm_block !== undefined) {
            let redstone_on = false
            if (btm_block.typeId == "minecraft:redstone_wire") {
                const st = btm_block.permutation.getAllStates()
                if (st["redstone_signal"] > 0) redstone_on = true
            } else if (btm_block.typeId == "minecraft:redstone_torch") {
                redstone_on = true
            }
            let point_pre = ent.getDynamicProperty("mtc_point_pre")
            if ((redstone_on && point_pre === 1) || point_pre === undefined) {
                ent.setDynamicProperty("mtc_bz_p1", ent.getDynamicProperty("mtc_bz2_p1"))
                ent.setDynamicProperty("mtc_bz_p2", ent.getDynamicProperty("mtc_bz2_p2"))
                ent.setDynamicProperty("mtc_bz_p3", ent.getDynamicProperty("mtc_bz2_p3"))
                ent.setDynamicProperty("mtc_point_pre", 2)
                ent.setDynamicProperty("mtc_now_npt", 2)
                if(ent.getProperty("mtc:point")===undefined){
                    aniRail()
                }else if(ent.getDynamicProperty("mtc_pani_off") !== 1){
                    if(ent.getDynamicProperty("mtc_now_npt")===2){
                        ent.setProperty("mtc:point",2)
                    }else{
                        ent.setProperty("mtc:point",1)
                    }
                }
            }
            if ((!redstone_on && point_pre === 2) || point_pre === undefined) {
                ent.setDynamicProperty("mtc_bz_p1", ent.getDynamicProperty("mtc_bz1_p1"))
                ent.setDynamicProperty("mtc_bz_p2", ent.getDynamicProperty("mtc_bz1_p2"))
                ent.setDynamicProperty("mtc_bz_p3", ent.getDynamicProperty("mtc_bz1_p3"))
                ent.setDynamicProperty("mtc_point_pre", 1)
                ent.setDynamicProperty("mtc_now_npt", 1)
                if(ent.getProperty("mtc:point")===undefined){
                    aniRail()
                }else if(ent.getDynamicProperty("mtc_pani_off") !== 1){
                    if(ent.getDynamicProperty("mtc_now_npt")===2){
                        ent.setProperty("mtc:point",2)
                    }else{
                        ent.setProperty("mtc:point",1)
                    }
                }
            }
        }
    }

    
    for (const pl of players_g) {


        //高速飛行落下防止
        //現在の乗車テスト
        //100km/h以上でロック（カウントセット&entity id登録），未満でアンロック（カウント0）
        //ロックしたらカウントセット
        //乗車してないかつカウント>0の場合→乗車トライ,カウントダウン
        const ride_cp = pl.getComponent("minecraft:riding")
        if (ride_cp !== undefined) {
            //乗ってる場合
            const ride = ride_cp.entityRidingOn
            if (ride.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_body")) {
                if (obj_mtc_spd.getScore(ride) >= 200000 && ride.hasTag("mtc_plane")) {
                    pl.setDynamicProperty("mtc_reride_count", 60)
                    pl.setDynamicProperty("mtc_reride_id", ride.id)
                } else {
                    pl.setDynamicProperty("mtc_reride_count", 0)
                }
            }
        } else {
            //乗ってない場合
            const count = pl.getDynamicProperty("mtc_reride_count")
            const eid = pl.getDynamicProperty("mtc_reride_id")
            if (count !== undefined) {
                if (count > 0) {
                    pl.setDynamicProperty("mtc_reride_count", count - 1)
                    try {
                        const ent = world.getEntity(eid)
                        if (obj_mtc_spd.getScore(ent) >= 200000) {
                            const ridable_cp = ent.getComponent("minecraft:rideable")
                            if (ridable_cp !== undefined) ridable_cp.addRider(pl)
                        } else {
                            pl.setDynamicProperty("mtc_reride_count", 0)
                        }
                    } catch (e) {
                    }
                }
            }
        }
    }

    // 回転召喚補正
    if (obj_mtc_global.getScore("dir_preset") > 0) {
        obj_mtc_global.addScore("dir_preset", -1)
    }

    // 起動検知
    if (no_loaded_players.length > 0) {
        let new_list = []
        for (const pl of no_loaded_players) {
            if (pl.isValid()) {
                if (pl.getVelocity().x !== 0 || pl.getVelocity().y !== 0 || pl.getVelocity().z !== 0) {
                    ents_around_ids[pl.id] = []
                    players_g.push(pl)
                } else {
                    new_list.push(pl)
                }
            }
        }
        no_loaded_players = new_list
    }

    //イベント(速度用)
    for (const ent of bodies_g) {
        if(!ent.isValid) continue;

        // 奈落対策
        if(ent.location.y < KILL_HEIGHT){
            ent.kill()
            continue
        }

        if (ent.hasTag("mtc_parent") && !ent.hasTag("mtc_norail")) {
            const v = Math.abs(Math.ceil(obj_mtc_spd.getScore(ent) / 2000))

            let ats_v = Math.ceil(obj_mtc_ats.getScore(ent) / 2000)
            let ato_v = Math.ceil(obj_mtc_ato.getScore(ent) / 2000)

            if (obj_mtc_ats.getScore(ent) < 0) {
                ats_v = -1
            }
            if (obj_mtc_ato.getScore(ent) < 0) {
                ato_v = -1
            }

            // 親車両個々から実行

            // 実行主mtc_fidと同じmtc_fidを持つ車体を取得
            const ents_f = getFormation(ent)


            const not = obj_not.getScore(ent)
            const notBM = obj_notBM.getScore(ent)
            for (const ent_f of ents_f) {
                // メーターアニメーション
                //const name = ent_f.typeId.split(":")[1]
                const name2 = getIdBase(ent_f.typeId)

                //速度(1/5/10km/h刻みをサポート)
                const spd_v_bef = getState(ent_f, "spd_ani_bef")
                if (spd_v_bef !== v) {
                    setState(ent_f, "spd_ani_bef", v)
                    playAni(ent_f, "v_" + Math.trunc(v / 10) * 10, "mtc_anicon_spd_meter")
                    playAni(ent_f, "v_" + Math.trunc(v / 5) * 5, "mtc_anicon_spd_meter")
                    playAni(ent_f, "v_" + v, "mtc_anicon_spd_meter")
                }

                //ATS(1/5/10km/h刻みをサポート)
                if (ats_v < 0) {
                    if (getState(ent_f, "disable_ats") !== 1) {
                        if(ent_f.getProperty("mtc:ats")!==undefined) ent_f.setProperty("mtc:ats",-1);
                        setState(ent_f, "disable_ats", 1)
                        stopAni(ent_f, "mtc_anicon_ats_meter")
                        stopAni(ent_f, "ats_on")
                    }
                } else {
                    if(ent_f.getProperty("mtc:ats")!==undefined) ent_f.setProperty("mtc:ats",ats_v);
                    setState(ent_f, "disable_ats", 0)
                    playAni(ent_f, "ats_" + Math.trunc(ats_v / 10) * 10, "mtc_anicon_ats_meter")
                    playAni(ent_f, "ats_" + Math.trunc(ats_v / 5) * 5, "mtc_anicon_ats_meter")
                    playAni(ent_f, "ats_" + ats_v, "mtc_anicon_ats_meter")
                    playAni(ent_f, "ats_on", "ats_on")
                }

                //ATO(1/5/10km/h刻みをサポート)
                if (ato_v < 0) {
                    if (getState(ent_f, "disable_ato") !== 1) {
                        if(ent_f.getProperty("mtc:ato")!==undefined) ent_f.setProperty("mtc:ato",-1);
                        setState(ent_f, "disable_ato", 1)
                        stopAni(ent_f, "mtc_anicon_ato_meter")
                        stopAni(ent_f, "ato_on")
                    }
                } else {
                    if(ent_f.getProperty("mtc:ato")!==undefined) ent_f.setProperty("mtc:ato",ato_v);
                    setState(ent_f, "disable_ato", 0)
                    playAni(ent_f, "ato_" + Math.trunc(ato_v / 10) * 10, "mtc_anicon_ato_meter")
                    playAni(ent_f, "ato_" + Math.trunc(ato_v / 5) * 5, "mtc_anicon_ato_meter")
                    playAni(ent_f, "ato_" + ato_v, "mtc_anicon_ato_meter")
                    playAni(ent_f, "ato_on", "ato_on")
                }

                //TASC
                if (ent_f.hasTag("mtc_tasc")) {
                    setState(ent_f, "disable_tasc", 0)
                    playAni(ent_f, "tasc_on", "tasc_on")
                } else {
                    if (getState(ent_f, "disable_tasc") !== 1) {
                        setState(ent_f, "disable_tasc", 1)
                        stopAni(ent_f, "tasc_on")
                    }
                }


                //走行音(通常エンジン)
                if (!ent_f.hasTag("mtc_soundengine2")) {
                    testSound(ent_f, ents_f)
                    const v2 = Math.abs(v)

                    if (not == 0 || not == notBM) {
                        if (!(not == notBM && ent_f.hasTag("mtc_bus"))) ent_f.runCommand(`playsound ${name2}_n${v2} @a[r=96,scores={mtc_sid=0}] ^^^${ent_f.getDynamicProperty("mtc_body_length")??20 / 2} 64`);
                    } else if (not > 0) {
                        ent_f.runCommand(`playsound ${name2}_a${v2} @a[r=96,scores={mtc_sid=0}] ^^^${ent_f.getDynamicProperty("mtc_body_length")??20 / 2} 64`)
                    } else {
                        ent_f.runCommand(`playsound ${name2}_b${v2} @a[r=96,scores={mtc_sid=0}] ^^^${ent_f.getDynamicProperty("mtc_body_length")??20 / 2} 64`)
                    }
                }
            }

            // 0km/h処理
            if (v == 0) {
                ent.addTag("mtc_stop")
            } else {
                ent.removeTag("mtc_stop")
            }
        } else if (ent.hasTag("mtc_plane")) {
            const name = getIdBase(ent.typeId)
            const v = 0.54 * obj_mtc_spd.getScore(ent) / 2000//ノット
            const raw_atc_v = ent.getDynamicProperty("mtc_atc")
            const eng_pow_int = Math.trunc(ent.getDynamicProperty("mtc_engine"))
            const altitude = ent.location.y * 3.2808//10フィート1ステップ
            let dir = ent.getRotation().y
            if (dir < 0)
                dir += 360;

            let atc_v = -1
            if (raw_atc_v !== undefined)
                atc_v = raw_atc_v;

            //高度計算
            let height = 20000.0
            let h_loc = ent.location

            if (h_loc.y > 330)
                h_loc.y = 330;
            for (let i = 0; i < 5; i++) {
                let ublock=undefined;
                if(ent.hasTag("mtc_plane_float")){
                    ublock = ent.dimension.getBlockFromRay({x:h_loc.x,y:h_loc.y+0.9,z:h_loc.z}, { x: 0, y: -1, z: 0 },{includeLiquidBlocks: true,includePassableBlocks:false})
                }else{
                    ublock = ent.dimension.getBlockFromRay({x:h_loc.x,y:h_loc.y+0.9,z:h_loc.z}, { x: 0, y: -1, z: 0 },{includeLiquidBlocks: false,includePassableBlocks:false})
                }
                if (ublock !== undefined) {
                    height = ent.location.y - ublock.block.y - 1
                    break
                } else if (h_loc.y > -64) {
                    h_loc.y -= 200
                } else {
                    break
                }
            }
            height *= 3.2808//10フィート1ステップ

            //飛行機用アニメーション
            //タコメーター(1%刻み)
            playAni(ent, "e_" + eng_pow_int, "ani_mtc_plane_e")

            //速度(1,5,10kt刻みをサポート)
            playAni(ent, "v_" + Math.trunc(v / 10) * 10, "ani_mtc_plane_v")
            playAni(ent, "v_" + Math.trunc(v / 5) * 5, "ani_mtc_plane_v")
            playAni(ent, "v_" + Math.trunc(v), "ani_mtc_plane_v")

            //これらは10,50,100,500ft刻みのアニメーションをサポート
            //高度(ft)
            playAni(ent, "a_" + Math.trunc(altitude / 500) * 500, "ani_mtc_plane_a")
            playAni(ent, "a_" + Math.trunc(altitude / 100) * 100, "ani_mtc_plane_a")
            playAni(ent, "a_" + Math.trunc(altitude / 50) * 50, "ani_mtc_plane_a")
            playAni(ent, "a_" + Math.trunc(altitude / 10) * 10, "ani_mtc_plane_a")
            //高さ(ft)
            playAni(ent, "h_" + Math.trunc(height / 500) * 500, "ani_mtc_plane_h")
            playAni(ent, "h_" + Math.trunc(height / 100) * 100, "ani_mtc_plane_h")
            playAni(ent, "h_" + Math.trunc(height / 50) * 50, "ani_mtc_plane_h")
            playAni(ent, "h_" + Math.trunc(height / 10) * 10, "ani_mtc_plane_h")


            //方位(1,2,5degree刻みをサポート)
            playAni(ent, "d_" + Math.trunc(dir / 5) * 5, "ani_mtc_plane_h")
            playAni(ent, "d_" + Math.trunc(dir / 2) * 2, "ani_mtc_plane_h")
            playAni(ent, "d_" + Math.trunc(dir), "ani_mtc_plane_h")

            /*            console.warn(Math.round(dir))
                        console.warn(Math.trunc(ent.getDynamicProperty("mtc_dx")))
                        console.warn(Math.trunc(ent.getDynamicProperty("mtc_dy")))
                        console.warn(Math.trunc(height / 10) * 10)
                        console.warn(Math.trunc(height / 50) * 50)
            */
            //姿勢pitch(x, degree)
            playAni(ent, "p_" + Math.trunc(-ent.getDynamicProperty("mtc_dx")), "ani_mtc_p")
            //姿勢roll(y, degree)
            playAni(ent, "r_" + Math.trunc(ent.getDynamicProperty("mtc_dy")), "ani_mtc_r")

            //ATC(サブカスタムメーター)
            // 1,2,5刻みをサポート
            if (atc_v < 0) {
                if (getState(ent, "disable_atc") !== 1) {
                    setState(ent, "disable_atc", 1)
                    stopAni(ent, "mtc_anicon_atc_meter")
                }
            } else {
                setState(ent, "disable_atc", 0)
                playAni(ent, "atc_" + Math.trunc(atc_v / 5) * 5, "mtc_anicon_atc_meter")
                playAni(ent, "atc_" + Math.trunc(atc_v / 2) * 2, "mtc_anicon_atc_meter")
                playAni(ent, "atc_" + Math.trunc(atc_v), "mtc_anicon_atc_meter")
            }

            //飛行機用エンジン音源
            //world.playSound(name+"_a"+eng_pow_int,ent.location,{volume:512})
            ent.runCommand(`playsound ${name}_a${eng_pow_int} @a[r=100] ~~~ 512`)

        }
    }

}, 5);

//毎tick実行
const run_entity_interfaec = { families: ["mtc_body"] }
let count_g = 0
system.runInterval(() => {

    const section_scale = scale_g
    count_g++

    for (const ent of masters_g) {
        if(!ent.isValid) continue;
        //const sf_ents = getFormation(ent)
        let sf_ents = bodies_sfs_g[ent.id]
        if (sf_ents === undefined) sf_ents = []

        //鉄道走行演算
        if (!ent.hasTag("mtc_norail")) {
            //加速演算
            const unit_ch = 0.2 * section_scale
            const prev_spd2k = obj_mtc_spd.getScore(ent)
            const prev_not = obj_mtc_prenot.getScore(ent)
            const init_not = obj_mtc_not.getScore(ent)
            let not = init_not
            let spd2k = prev_spd2k
            if (!ent.hasTag("mtc_tasc_do")) {
                const ato_v = obj_mtc_ato.getScore(ent)
                if (ato_v < 0) {
                    let zero_inv_flag = false
                    let acc
                    const accN = obj_mtc_accN.getScore(ent)
                    if (not > 0) {
                        let racc = not * obj_accDA.getScore(ent)
                        const rspd = obj_mtc_Rspd.getScore(ent)
                        if (rspd > 0 && spd2k > rspd) {
                            racc = rspd * racc / spd2k
                        }
                        acc = racc + accN
                    } else if (not < 0) {
                        if (prev_spd2k < 0) {
                            acc = - not * obj_accDB.getScore(ent) + accN
                            zero_inv_flag = true
                        } else if (prev_spd2k > 0) {
                            acc = not * obj_accDB.getScore(ent) + accN
                        } else {
                            acc = 0
                        }
                    } else {
                        if (prev_spd2k < 0) {
                            if (world.getDynamicProperty("mtc_resist_off") === 1) {
                                acc = 0
                            } else {
                                acc = -accN
                            }
                            zero_inv_flag = true
                        } else if (prev_spd2k > 0) {
                            if (world.getDynamicProperty("mtc_resist_off") === 1) {
                                acc = 0
                            } else {
                                acc = accN
                            }
                        } else {
                            acc = 0
                        }
                    }
                    spd2k += acc * unit_ch
                    if (not <= 0) {
                        if (zero_inv_flag) {
                            if (spd2k > 0) spd2k = 0
                        } else {
                            if (spd2k < 0) spd2k = 0
                        }
                    }
                    if (not === 0) {
                        if (obj_mtc_gradacc.hasParticipant(ent) && world.getDynamicProperty("mtc_resist_off") !== 1) {
                            spd2k += obj_mtc_gradacc.getScore(ent) * unit_ch
                        }
                    }
                    if (obj_mtc_ats.getScore(ent) >= 0) {
                        if (Math.abs(spd2k) >= obj_mtc_ats.getScore(ent) - 1000 && not > 0) {
                            not = 0
                        }
                        if (Math.abs(spd2k) > obj_mtc_ats.getScore(ent)) {
                            not = obj_notBM.getScore(ent)
                        }
                    }

                } else {
                    //ATO
                    if (spd2k < ato_v) {
                        const notAM = obj_notAM.getScore(ent)
                        spd2k += unit_ch * (obj_accDA.getScore(ent) * notAM + obj_mtc_accN.getScore(ent))
                        if (spd2k > ato_v) spd2k = ato_v
                        not = notAM
                    } else if (spd2k > ato_v) {
                        const notBM = obj_notBM.getScore(ent)
                        spd2k += unit_ch * ((obj_accDB.getScore(ent) + 1) * notBM + obj_mtc_accN.getScore(ent))
                        if (spd2k < ato_v) spd2k = ato_v
                        not = notBM + 1
                    } else {
                        not = 0
                    }
                }

            }
            if (init_not !== not) {
                //ATS/ATOによる変更
                for (const ent_f of sf_ents) {
                    ent.addTag("mtc_mas_v2")
                }
            }
            if (prev_not !== not) {
                //変更全般
                if (prev_not < 0 && not >= 0) {
                    //ブレーキ緩解
                    if (Math.abs(prev_spd2k) < 1000) {
                        for (const ent_f of sf_ents) {
                            ent_f.addTag("mtc_air1")
                        }
                    } else {
                        for (const ent_f of sf_ents) {
                            ent_f.addTag("mtc_air2")
                        }
                    }
                }

            }
            if (ent.hasTag("mtc_manual")) {
                if (spd2k > 260000) spd2k = 260000
                if (spd2k < -260000) spd2k = -260000
            }
            const spd2kmax = obj_maxSpd.getScore(ent)
            if (spd2k > spd2kmax) spd2k = spd2kmax
            if (spd2k < -spd2kmax) spd2k = -spd2kmax
            spd2k=Math.round(spd2k)
            obj_mtc_spd.setScore(ent, spd2k)
            obj_mtc_prenot.setScore(ent, not)
            obj_mtc_not.setScore(ent, not)

            //拡張サウンドエンジン
            if (count_g % 2 == 0) {
                const not = obj_mtc_not.getScore(ent)
                const notBM = obj_notBM.getScore(ent)
                const v = Math.abs(Math.round(spd2k / 200))//km/h*10
                for (const ent_f of sf_ents) {
                    if (ent_f.hasTag("mtc_soundengine2")) {
                        const name2 = getIdBase(ent_f.typeId)
                        testSound(ent_f)
                        if (not == 0 || not == notBM) {
                            if (!(not == notBM && ent_f.hasTag("mtc_bus"))) ent_f.runCommand(`playsound ${name2}_n${v} @a[r=96,scores={mtc_sid=0}] ^^^${ent_f.getDynamicProperty("mtc_body_length") / 2} 64`);
                        } else if (not > 0) {
                            ent_f.runCommand(`playsound ${name2}_a${v} @a[r=96,scores={mtc_sid=0}] ^^^${ent_f.getDynamicProperty("mtc_body_length") / 2} 64`)
                        } else {
                            ent_f.runCommand(`playsound ${name2}_b${v} @a[r=96,scores={mtc_sid=0}] ^^^${ent_f.getDynamicProperty("mtc_body_length") / 2} 64`)
                        }
                    }
                }
            }

            //先頭車
            const mv_delta = 0.000006944445 * spd2k * section_scale

            //TASC
            if (ent.hasTag("mtc_tasc")) {
                const diff = (ent.getDynamicProperty("tasc_dist") - ent.getDynamicProperty("dist"))
                if (diff > 0) {
                    for(const entf of sf_ents){
                        if(entf.getProperty("mtc:tasc")!==undefined) entf.setProperty("mtc:tasc",diff);
                    }
                    const b_mid = ent.getDynamicProperty("tasc_b_mid")//常用最大
                    const trg_mid = Math.sqrt(diff * b_mid * 0.8) * 240
                    const now_spd = obj_mtc_spd.getScore(ent)

                    if (now_spd >= trg_mid) {
                        ent.addTag("mtc_tasc_do")
                        obj_mtc_ato.setScore(ent, -1)
                    }

                    if (ent.hasTag("mtc_tasc_do")) {
                        let trg_spd = trg_mid
                        let diff = now_spd - trg_spd
                        if (diff < 0) {
                            diff = 0.0
                        } else if (diff * 5 > b_mid) {
                            diff = b_mid / 5.0
                        }
                        trg_spd = now_spd - diff * section_scale

                        if (trg_spd <= 1000 / section_scale) {
                            obj_mtc_spd.setScore(ent, 1000 / section_scale)
                            obj_mtc_not.setScore(ent, -1)
                        } else {
                            obj_mtc_spd.setScore(ent, trg_spd)
                            obj_mtc_not.setScore(ent, Math.min(-1, Math.trunc((world.scoreboard.getObjective("mtc_notBM").getScore(ent) + 1) * diff * 5 / b_mid)))
                        }
                    }
                } else {
                    //解除
                    if (obj_mtc_spd.getScore(ent) <= 2000) {
                        obj_mtc_spd.setScore(ent, 0)
                        obj_mtc_not.setScore(ent, world.scoreboard.getObjective("mtc_notBM").getScore(ent) + 1)
                    } else {
                        obj_mtc_not.setScore(ent, world.scoreboard.getObjective("mtc_notBM").getScore(ent))
                    }
                    ent.removeTag("mtc_tasc")
                    ent.removeTag("mtc_tasc_do")
                    for(const entf of sf_ents){
                        if(entf.getProperty("mtc:tasc")!==undefined) entf.setProperty("mtc:tasc",-1);
                    }
                }
            }


            //鉄道走行演算
            if (spd2k !== 0 || count_g % 10 == 0) {
                const prev_uvec = getState(ent, "mtc_prev_uvec")
                if (ent.hasTag("mtc_on_newrail_b") && ent.hasTag("mtc_on_newrail_h") && prev_uvec !== undefined) {
                    let new_loc = {
                        x: ent.location.x + mv_delta * prev_uvec.x,
                        y: ent.location.y + mv_delta * prev_uvec.y,
                        z: ent.location.z + mv_delta * prev_uvec.z
                    }
                    ent.teleport(new_loc)
                } else {
                    let roty = ent.getRotation().y
                    let rotx = getState(ent, "mtc_tilt_x")
                    if (rotx === undefined) rotx = 0

                    rotx *= -1
                    roty *= -1
                    const bx_uz = Math.sin(0.0174533 * roty) * Math.cos(0.0174533 * rotx)
                    const by_uz = -Math.sin(0.0174533 * rotx)
                    const bz_uz = Math.cos(0.0174533 * roty) * Math.cos(0.0174533 * rotx)
                    let sign = 1
                    if (ent.hasTag("mtc_rev")) {
                        sign *= -1
                    }
                    let new_loc = {
                        x: ent.location.x + mv_delta * bx_uz * sign,
                        y: ent.location.y + mv_delta * by_uz * sign,
                        z: ent.location.z + mv_delta * bz_uz * sign
                    }
                    ent.teleport(new_loc)
                }

                //seat追従
                if (world.getDynamicProperty("mtc_tilt") === 1) {
                    let rotx = getState(ent, "mtc_tilt_x")
                    let rotz = getState(ent, "mtc_tilt_z")
                    if (rotx === undefined) rotx = 0
                    if (rotz === undefined) rotz = 0
                    rotz *= -1
                    const buz = Math.sin(0.0174533 * rotx)
                    const bux = Math.sin(0.0174533 * rotz)
                    const com = ent.getComponent("minecraft:rideable")
                    if (com !== undefined) {
                        const seats = com.getSeats()
                        const riders = com.getRiders()
                        if(riders[0]?.typeId=="mtc:seat"){
                            for (let i = 0; i < seats.length; i++) {
                                const rider = riders[i]
                                if (rider !== undefined && rider.typeId == "mtc:seat") {
                                    const seat = seats[i]
                                    const dy = seat.position.z * buz + seat.position.x * bux
                                    let index = Math.round(dy * 64)
                                    if (index < -256) index = -256
                                    if (index > 256) index = 256
                                    const index_old = getState(rider, "mtc_tilt_old")
                                    if (index !== index_old) {
                                        setState(rider, "mtc_tilt_old", index)
                                        if (index >= 0) {
                                            rider.triggerEvent("ev_p" + index)
                                        } else {
                                            rider.triggerEvent("ev_m" + (-index))
                                        }
                                    }
                                }

                            }
                        }
                    }
                }


                let joint_min = 0     //各車両が検出したジョイント間隔の最小値(0は無検出)
                let sign = 1
                if (ent.hasTag("mtc_rev")) {
                    sign *= -1
                }

                for (const entf of sf_ents) {

                    //付随車移動
                    if (!entf.hasTag("mtc_parent")) {
                        let roty = entf.getRotation().y
                        let rotx = getState(entf, "mtc_tilt_x")
                        if (rotx === undefined) rotx = 0
                        rotx *= -1
                        roty *= -1
                        const bx_uz = Math.sin(0.0174533 * roty) * Math.cos(0.0174533 * rotx)
                        const by_uz = -Math.sin(0.0174533 * rotx)
                        const bz_uz = Math.cos(0.0174533 * roty) * Math.cos(0.0174533 * rotx)

                        const new_loc = {
                            x: entf.location.x + mv_delta * bx_uz * sign,
                            y: entf.location.y + mv_delta * by_uz * sign,
                            z: entf.location.z + mv_delta * bz_uz * sign
                        }
                        entf.teleport(new_loc)
                        setState(entf, "mtc_prev", new_loc)

                        //seat追従
                        if (world.getDynamicProperty("mtc_tilt") === 1) {
                            rotx = getState(entf, "mtc_tilt_x")
                            let rotz = getState(entf, "mtc_tilt_z")
                            if (rotx === undefined) rotx = 0
                            if (rotz === undefined) rotz = 0
                            rotz *= -1
                            const buz = Math.sin(0.0174533 * rotx)
                            const bux = Math.sin(0.0174533 * rotz)
                            const com = entf.getComponent("minecraft:rideable")
                            if (com !== undefined) {
                                const seats = com.getSeats()
                                const riders = com.getRiders()
                                if(riders[0]?.typeId=="mtc:seat"){
                                    for (let i = 0; i < seats.length; i++) {
                                        const rider = riders[i]
                                        if (rider !== undefined && rider.typeId == "mtc:seat") {
                                            const seat = seats[i]
                                            const dy = seat.position.z * buz + seat.position.x * bux
                                            let index = Math.round(dy * 64)
                                            if (index < -256) index = -256
                                            if (index > 256) index = 256
                                            const index_old = getState(rider, "mtc_tilt_old")
                                            if (index !== index_old) {
                                                setState(rider, "mtc_tilt_old", index)
                                                if (index >= 0) {
                                                    rider.triggerEvent("ev_p" + index)
                                                } else {
                                                    rider.triggerEvent("ev_m" + (-index))
                                                }
                                            }
                                        }

                                    }
                                }
                            }
                        }

                        //測距
                        let now = entf.getDynamicProperty("dist")
                        if (now === undefined) {
                            now = 0.0
                        }
                        now += Math.abs(mv_delta)
                        entf.setDynamicProperty("dist", now)
                        //クライアントプロパティ
                        if(entf.getProperty("mtc:spd")!==undefined) entf.setProperty("mtc:spd",Math.abs(spd2k)/2000);
                        const prop_dist = entf.getProperty("mtc:dist")
                        if(prop_dist!==undefined) entf.setProperty("mtc:dist",prop_dist + mv_delta * sign);

                        //ジョイント
                        let joint = entf.getDynamicProperty("mtc_joint")
                        if (joint > 0) {
                            joint = Number(joint)
                            if (joint_min === 0 || joint_min > joint) {
                                joint_min = joint
                            }
                        }

                    }
                }

                let now = ent.getDynamicProperty("dist")
                if (now === undefined) {
                    now = 0.0
                }
                now += Math.abs(mv_delta)
                ent.setDynamicProperty("dist", now)
                obj_mtc_dist.setScore(ent, Math.round(now * 100))
                //クライアントプロパティ
                if(ent.getProperty("mtc:spd")!==undefined) ent.setProperty("mtc:spd",Math.abs(spd2k)/2000);
                const prop_dist = ent.getProperty("mtc:dist")
                if(prop_dist!==undefined) ent.setProperty("mtc:dist",prop_dist + mv_delta * sign);


                //ジョイント
                let joint = ent.getDynamicProperty("mtc_joint")
                let joint_last_dist = ent.getDynamicProperty("mtc_joint_last_dist")
                let is_joint = false
                if (joint > 0) {
                    joint = Number(joint)
                    if (joint_min === 0 || joint_min > joint) {
                        joint_min = joint
                    }
                    if (joint_last_dist === undefined) {
                        ent.setDynamicProperty("mtc_joint_last_dist", now)
                        is_joint = true
                    } else {
                        joint_last_dist = Number(joint_last_dist)
                        const diff = now - joint_last_dist
                        if (diff >= joint_min) {
                            is_joint = true
                            if (diff < joint_min * 2) {
                                ent.setDynamicProperty("mtc_joint_last_dist", joint_last_dist + joint_min)
                            } else {
                                ent.setDynamicProperty("mtc_joint_last_dist", now)
                            }
                        }
                    }
                    if (is_joint) {
                        runJoint(ent, sf_ents)
                    }
                }

                trace_newrail(ent, sf_ents)
                setState(ent, "mtc_prev", ent.location)


            } else {
                //列車停止時
                let mtc_prev = getState(ent, "mtc_prev")
                if (mtc_prev === undefined) {
                    mtc_prev = { x: ent.location.x, y: ent.location.y, z: ent.location.z }
                    setState(ent, "mtc_prev", mtc_prev)
                }
                mtc_prev = { x: Math.round(mtc_prev.x*100)/100, y: Math.round(mtc_prev.y*100)/100, z: Math.round(mtc_prev.z*100)/100 }
                //                if (dist2(ent.location, mtc_prev) > 0) {
                if (ent.hasTag("mtc_on_newrail_b") || obj_mtc_rot.getScore(ent) <= 10) {
                    //振動抑制位置固定
                    let nx, nz
                    switch (count_g % 4) {
                        case 0:
                            nz = 0.002
                            nx = 0.002
                            break
                        case 1:
                            nz = 0.002
                            nx = -0.002
                            break
                        case 2:
                            nz = -0.002
                            nx = -0.002
                            break
                        case 3:
                            nz = -0.002
                            nx = 0.002
                            break
                    }
                    const loc_e = { x: mtc_prev.x + nx, y: mtc_prev.y + Math.random() * 0.001, z: mtc_prev.z + nz }
                    ent.teleport(loc_e, { rotation: ent.getRotation() })
                } else {
                    setState(ent, "mtc_prev", ent.location)
                }
            }

            let new_loc = ent.location
            let mtc_car = ent.dimension.getEntities({ families: ["mtc_car", "mtc_runnable"], location: new_loc, closest: 1 })
            if (mtc_car.length > 0) {
                new_loc.y -= 2.3
                mtc_car[0].teleport(new_loc)
            }


            //付随車
            for (const entf of sf_ents) {
                if (!entf.hasTag("mtc_norail") && !entf.hasTag("mtc_parent")) {
                    //付随車方向制御
                    let parent = undefined
                    let master = undefined
                    let b1 = false
                    let b2 = false

                    //前後車探索
                    if(body_parent_master_refresh){
                        for (const p of sf_ents) {
                            if (obj_mtc_uid.getScore(p) === obj_mtc_parent.getScore(entf)) {
                                parent = p
                                b1 = true
                            }
                            if (obj_mtc_uid.getScore(p) === obj_mtc_fid.getScore(entf)) {
                                master = p
                                b2 = true
                            }
                            if (b1 && b2) break
                        }
                        if (b1 && b2){
                            setState(entf,"parent_ent",parent)
                            setState(entf,"master_ent",master)
                        }
                    }else{
                        parent=getState(entf,"parent_ent")
                        master=getState(entf,"master_ent")
                    }

                    if (parent !== undefined && master !== undefined) {
                        if (Math.abs(obj_mtc_spd.getScore(master)) > 0) {
                            //方向追従
                            const loc_e = entf.location
                            const loc_p = parent.location
                            const deg_y = Math.atan2(-(loc_p.x - loc_e.x), loc_p.z - loc_e.z) * 57.29578
                            const deg_y2 = getState(entf, "midcar_trace_deg")
                            //ent.setRotation({ x: 0, y: deg_y })
                            if (deg_y2 !== undefined && Math.abs(deg_y2 - deg_y) < 20) {
                                entf.teleport(loc_e, { rotation: { x: 0, y: deg_y2 } })
                            } else {
                                entf.teleport(loc_e, { rotation: { x: 0, y: deg_y } })
                            }
                        } else {
                            //振動抑制
                            let nx, nz
                            switch (count_g % 4) {
                                case 0:
                                    nz = 0.002
                                    nx = 0.002
                                    break
                                case 1:
                                    nz = 0.002
                                    nx = -0.002
                                    break
                                case 2:
                                    nz = -0.002
                                    nx = -0.002
                                    break
                                case 3:
                                    nz = -0.002
                                    nx = 0.002
                                    break
                            }
                            const loc_e = { x: entf.location.x + nx, y: entf.location.y + Math.random() * 0.001, z: entf.location.z + nz }
                            entf.teleport(loc_e)
                        }
                    }
                }
            }

            //座席エンティティ回転
            if(world.getDynamicProperty("mtc_autolook_off") !== 1){
                for(const entf of sf_ents){
                    const deg_y=entf.getRotation().y

                    if(getState(entf,"prev_deg")!==deg_y || count_g%20==0){
                        const riders=entf.getComponent("minecraft:rideable")?.getRiders()
                        if(riders!==undefined){
                            for(const rider of riders){
                                //if(rider.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_seat")){
                                if(rider.typeId=="mtc:seat" && (rider.hasTag("mtc_seat_has_rider"))){
                                    rider.setRotation({x:0,y:deg_y})
                                }
                            }
                        }
                        setState(entf,"prev_deg",deg_y)
                    }
                }
            }

        } else if (ent.hasTag("mtc_plane")) {
            //飛行機計算    

            //飛行機視線取得(相対)
            let rider_res = undefined
            const riders_cp = ent.getComponent("minecraft:rideable")
            if (riders_cp !== undefined) {
                const riders = riders_cp.getRiders()
                if (riders.length > 0) {
                    const rider = riders[0]
                    if (rider.typeId == "minecraft:player") {
                        rider_res = rider
                    } else if (rider.typeId !== "mtc:seat") {
                        const riders = rider.getComponent("minecraft:rideable").getRiders()
                        if (riders.length > 0) {
                            const rider = riders[0]
                            if (rider.typeId == "minecraft:player") {
                                rider_res = rider
                            }
                        }
                    }
                }
            }
            if (rider_res !== undefined) {
                const prot = rider_res.getRotation()
                const erot = ent.getRotation()
                let rx = prot.x - erot.x
                let ry = prot.y - erot.y
                if (ry > 180)
                    ry -= 360;
                if (ry < -180)
                    ry += 360;
                setState(ent, "mtc_rx", rx)
                setState(ent, "mtc_ry", ry)
            } else {
                setState(ent, "mtc_rx", 0.0)
                setState(ent, "mtc_ry", 0.0)
            }

            //飛行艇・船舶モードは走行抵抗減少・浮遊

            //高度計算
            let height = 1000.0
            let ublock
            let plane_float=false
            if(ent.hasTag("mtc_plane_float")){
                plane_float=true
                ublock = ent.dimension.getBlockFromRay({x:ent.location.x,y:ent.location.y+0.9,z:ent.location.z}, { x: 0, y: -1, z: 0 },{includeLiquidBlocks: true})
            }else{
                ublock = ent.dimension.getBlockFromRay({x:ent.location.x,y:ent.location.y+0.9,z:ent.location.z}, { x: 0, y: -1, z: 0 },{includeLiquidBlocks: false,includePassableBlocks:false})
            }
            if (ublock !== undefined) {
                height = ent.location.y - ublock.block.y - 1
                //アンダーフロー防止
                if(height>-0.005 && height<0.005){
                    height=0.006
                    const y_round=Math.round(ent.location.y*200)/200
                    ent.teleport({x:ent.location.x,y:y_round,z:ent.location.z})
                }
            }

            //スロットル計算
            let not = obj_not.getScore(ent)
            const notAM = world.scoreboard.getObjective("mtc_notAM").getScore(ent)
            const notBM = world.scoreboard.getObjective("mtc_notBM").getScore(ent)


            let trg_pow = 0.0
            if (not >= 0) {
                trg_pow = 20 + 80 * Math.max(0, not) / notAM
            } else {
                //制動方向に入れてる場合逆噴射のみ許可
                if (ent.hasTag("mtc_rev")) {
                    trg_pow = 20 - 80 * Math.max(0, -not) / (notBM + 1)
                } else {
                    trg_pow = 20
                }
            }

            if (not === notBM)
                trg_pow = 0.0

            let now_pow = ent.getDynamicProperty("mtc_engine")
            if (now_pow === undefined)
                now_pow = 0.0
            let diff = trg_pow - now_pow

            if (now_pow < 20) {
                if (diff > 0.5)
                    diff = 0.5;
                if (diff < -0.2)
                    diff = -0.2;
            } else {
                if (diff > 3)
                    diff = 3;
                if (diff < -3)
                    diff = -3;
            }
            now_pow += diff
            if (now_pow < 0)
                now_pow = 0.0;
            if (now_pow > 100)
                now_pow = 100.0;

            ent.setDynamicProperty("mtc_engine", now_pow)

            let now_bz
            let n_bz
            let p1, p2, p3
            let now_t
            //オートパイロット終了判定
            if (ent.hasTag("mtc_autopirot")) {
                now_bz = ent.getDynamicProperty("mtc_autopirot_now")
                n_bz = ent.getDynamicProperty("mtc_autopirot_n")

                p1 = ent.getDynamicProperty("mtc_autopirot_bz" + now_bz + "p1")
                p2 = ent.getDynamicProperty("mtc_autopirot_bz" + now_bz + "p2")
                p3 = ent.getDynamicProperty("mtc_autopirot_bz" + now_bz + "p3")

                now_t = getBezierNeart(p1, p2, p3, ent.location)
                ent.removeTag("mtc_rev")

                if (now_t >= 1 && now_bz === n_bz - 1) {
                    ent.removeTag("mtc_autopirot")
                    not = notBM + 1
                    obj_not.setScore(ent, not)
                    ent.addTag("mtc_rev")

                }
            }

            //オートパイロット本体
            if (ent.hasTag("mtc_autopirot")) {
                if (now_t >= 1) {
                    if (now_bz < n_bz - 1) {
                        now_bz++
                        ent.setDynamicProperty("mtc_autopirot_now", now_bz)
                        p1 = ent.getDynamicProperty("mtc_autopirot_bz" + now_bz + "p1")
                        p2 = ent.getDynamicProperty("mtc_autopirot_bz" + now_bz + "p2")
                        p3 = ent.getDynamicProperty("mtc_autopirot_bz" + now_bz + "p3")

                        now_t = getBezierNeart(p1, p2, p3, ent.location)
                    }

                }

                //機体向きベクトル
                const dir = bezierTangent(p1, p2, p3, now_t)
                const dir_size = Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2)
                const dir_n = { x: dir.x / dir_size, y: dir.y / dir_size, z: dir.z / dir_size }
                //回転x,y計算
                const ry = Math.atan2(-dir_n.x, dir_n.z) * 57.29578
                const rx = -Math.asin(dir_n.y) * 57.29578

                //速度計算

                //推力計算
                let now_spd2k = obj_mtc_spd.getScore(ent)

                let engine_out = (now_pow - 20) * 1.25
                if (engine_out < 0)
                    engine_out = 0;
                if (ent.hasTag("mtc_rev"))
                    engine_out *= -0.5

                let acc = engine_out * obj_accDA.getScore(ent) * 0.01
                let brk = obj_mtc_accN.getScore(ent)//<0

                //走行抵抗(飛ぶと無くなる)
                if (height < 0.01) {
                    if (now_spd2k + acc >= -brk) {
                        acc += brk
                    } else if (now_spd2k + acc <= brk) {
                        acc -= brk
                    } else {
                        acc -= now_spd2k + acc
                    }
                }

                //ブレーキ(空中でも制動がいる)
                //空中のブレーキは最大空気抵抗(フラップの空気抵抗増大をシミュレーション)
                if (not < 0) {
                    if (height < 0.01) {
                        brk = obj_accDB.getScore(ent) * not
                        if (now_spd2k + acc >= -brk) {
                            acc += brk
                        } else if (now_spd2k + acc <= brk) {
                            acc -= brk
                        } else {
                            acc -= now_spd2k + acc
                        }
                    } else {
                        acc -= (100 * ((now_spd2k / 2000) * obj_mtc_air.getScore(ent) / 100000) ** 2) * (not / (notBM + 1))
                    }
                }


                //空気抵抗
                acc -= 100 * ((now_spd2k / 2000) * obj_mtc_air.getScore(ent) / 100000) ** 2

                //速度計算
                let spdMax = obj_maxSpd.getScore(ent)
                if(plane_float && height < 0.01 && ublock?.block.isLiquid===false) spdMax = 4000;
                now_spd2k += acc

                if (now_spd2k > spdMax)
                    now_spd2k = spdMax;

                if (now_spd2k < -spdMax)
                    now_spd2k = -spdMax;

                //距離計算
                let dist = 0
                for (let i = n_bz - 1; i > now_bz; i--) {
                    const p1x = ent.getDynamicProperty("mtc_autopirot_bz" + i + "p1")
                    const p2x = ent.getDynamicProperty("mtc_autopirot_bz" + i + "p2")
                    const p3x = ent.getDynamicProperty("mtc_autopirot_bz" + i + "p3")
                    dist += bezierLength(p1x, p2x, p3x, 0, 1)
                }

                dist += bezierLength(p1, p2, p3, now_t, 1)


                //速度制御
                //減速度1m/s^2固定
                const v0 = obj_mtc_Rspd.getScore(ent) / 3.6//m/s
                const vmax = Math.sqrt(2 * dist + v0 ** 2) * 7200//v=sqrt(2ax+v0^2) (kmph*2000)


                if (now_spd2k > vmax) {
                    now_spd2k = vmax
                    not = 0
                } else {
                    not = Math.trunc(notAM * 0.9)
                }

                obj_not.setScore(ent, not)

                const v = 0.000006944445 * now_spd2k

                const next_t = getBezierNeart(p1, p2, p3, { x: ent.location.x + dir_n.x * v, y: ent.location.y + dir_n.y * v, z: ent.location.z + dir_n.z * v })
                const p_trg = getBezier(p1, p2, p3, next_t)
                const rot = ent.getRotation()
                ent.teleport(p_trg, { rotation: { x: rx, y: ry } })

                obj_mtc_spd.setScore(ent, Math.trunc(now_spd2k))
                if(ent.getProperty("mtc:spd")!==undefined) ent.setProperty("mtc:spd",Math.abs(now_spd2k)*0.00026998);

                if(ent.getProperty("mtc:altitude")!==undefined) ent.setProperty("mtc:altitude",ent.location.y);
                if(ent.getProperty("mtc:height")!==undefined) ent.setProperty("mtc:height",height);
                if(ent.getProperty("mtc:dir")!==undefined) ent.setProperty("mtc:dir",rot.y<0?rot.y+360:rot.y);
                if(ent.getProperty("mtc:power")!==undefined) ent.setProperty("mtc:power",engine_out);
                if(ent.getProperty("mtc:tacho")!==undefined) ent.setProperty("mtc:tacho",now_pow);

                if (height < 0.01) {
                    ent.setDynamicProperty("mtc_dy", 0)
                    ent.setDynamicProperty("mtc_dx", 0)
                    if(ent.getProperty("mtc:roll")!==undefined) ent.setProperty("mtc:roll",0);
                    if(ent.getProperty("mtc:pitch")!==undefined) ent.setProperty("mtc:pitch",0);
                } else {
                    ent.setDynamicProperty("mtc_dy", (ry - rot.y) * 10)
                    ent.setDynamicProperty("mtc_dx", -rx)
                    if(ent.getProperty("mtc:roll")!==undefined) ent.setProperty("mtc:roll",(ry - rot.y) * 10);
                    if(ent.getProperty("mtc:pitch")!==undefined) ent.setProperty("mtc:pitch",-rx);
                }
            } else {

                //推力計算
                let now_spd2k = obj_mtc_spd.getScore(ent)

                let engine_out = (now_pow - 20) * 1.25
                if (engine_out < 0)
                    engine_out = 0;
                if (ent.hasTag("mtc_rev"))
                    engine_out *= -0.5

                let acc = engine_out * obj_accDA.getScore(ent) * 0.01
                let brk = obj_mtc_accN.getScore(ent)//<0

                //走行抵抗(飛ぶと無くなる)
                if (height < 0.01) {
                    if (now_spd2k + acc >= -brk) {
                        acc += brk
                    } else if (now_spd2k + acc <= brk) {
                        acc -= brk
                    } else {
                        acc -= now_spd2k + acc
                    }
                }

                //ブレーキ(空中でも制動がいる)
                //空中のブレーキは最大空気抵抗(フラップの空気抵抗増大をシミュレーション)
                if (not < 0) {
                    if (height < 0.01) {
                        brk = obj_accDB.getScore(ent) * not
                        if (now_spd2k + acc >= -brk) {
                            acc += brk
                        } else if (now_spd2k + acc <= brk) {
                            acc -= brk
                        } else {
                            acc -= now_spd2k + acc
                        }
                    } else {
                        acc -= (100 * ((now_spd2k / 2000) * obj_mtc_air.getScore(ent) / 100000) ** 2) * (not / (notBM + 1))
                    }
                }


                //空気抵抗
                acc -= 100 * ((now_spd2k / 2000) * obj_mtc_air.getScore(ent) / 100000) ** 2

                //速度計算
                let spdMax = obj_maxSpd.getScore(ent)
                if(plane_float && height < 0.01 && ublock?.block.isLiquid===false) spdMax = 4000;
                now_spd2k += acc

                if (now_spd2k > spdMax)
                    now_spd2k = spdMax;

                if (now_spd2k < -spdMax)
                    now_spd2k = -spdMax;

                //回転
                const now_rot = ent.getRotation()
                let dx = getState(ent, "mtc_rx")
                let dy = getState(ent, "mtc_ry") * 0.1
                if (dy > 4)
                    dy = 4;
                if (dy < -4)
                    dy = -4;
                if (now_spd2k > 1 || now_spd2k < -1) {
                    //ent.setRotation({ x: 0, y: dy + now_rot.y })
                    ent.teleport(ent.location, { rotation: { x: 0, y: dy + now_rot.y } })
                } else {
                    dy = 0
                }

                //昇降計算
                const up_spd_2k = Math.sin(-dx * 0.0174533) * now_spd2k
                //m/tick
                let up_spd = 0.000006944445 * up_spd_2k//m/tick
                const up_spd_max = 0.0005 * obj_mtc_up.getScore(ent) * (now_spd2k / 2000 - obj_mtc_Rspd.getScore(ent))

                up_spd = Math.min(up_spd, up_spd_max)
                up_spd = Math.max(up_spd, -height, -50)

                if(plane_float && ent.isInWater){
                    up_spd=0.2
                }

                //正面衝突判定
                if (now_spd2k > 0) {
                    const fblock = ent.dimension.getBlockFromRay({ x: ent.location.x, y: ent.location.y + 1.5, z: ent.location.z }, { x: -Math.sin((dy + now_rot.y) * 0.0174533), y: 0, z: Math.cos((dy + now_rot.y) * 0.0174533) },{includeLiquidBlocks: false,includePassableBlocks:false})
                    if (fblock !== undefined) {
                        const d = (ent.location.z - fblock.block.z - 0.5) ** 2 + (ent.location.x - fblock.block.x - 0.5) ** 2
                        if (d < (0.000006944445 * now_spd2k + 1) ** 2) {
                            now_spd2k = 0
                        }
                    }
                } else if (now_spd2k < 0) {
                    const fblock = ent.dimension.getBlockFromRay({ x: ent.location.x, y: ent.location.y + 1.5, z: ent.location.z }, { x: Math.sin((dy + now_rot.y) * 0.0174533), y: 0, z: -Math.cos((dy + now_rot.y) * 0.0174533) },{includeLiquidBlocks: false,includePassableBlocks:false})
                    if (fblock !== undefined) {
                        const d = (ent.location.z - fblock.block.z - 0.5) ** 2 + (ent.location.x - fblock.block.x - 0.5) ** 2
                        if (d < (0.000006944445 * (-now_spd2k) + 1) ** 2) {
                            now_spd2k = 0
                        }
                    }
                }

                //飛行計算
                now_spd2k = Math.trunc(now_spd2k * 1000) / 1000
                const mv_delta = 0.000006944445 * now_spd2k
                /*
                const rot_y = ent.getRotation().y
                const mv_delta_x = -mv_delta * Math.sin(rot_y * 0.0174533)
                const mv_delta_z = mv_delta * Math.cos(rot_y * 0.0174533)
                const new_loc = { x: ent.location.x + mv_delta_x, y: ent.location.y + up_spd, z: ent.location.z + mv_delta_z }

                ent.teleport(new_loc)
                */
                ent.runCommand(`tp @s ^^${up_spd.toFixed(5)}^${mv_delta.toFixed(5)}`)
                obj_mtc_spd.setScore(ent, Math.trunc(now_spd2k))

                if(ent.getProperty("mtc:spd")!==undefined) ent.setProperty("mtc:spd",Math.abs(now_spd2k)*0.00026998);

                if(ent.getProperty("mtc:altitude")!==undefined) ent.setProperty("mtc:altitude",ent.location.y);
                if(ent.getProperty("mtc:height")!==undefined) ent.setProperty("mtc:height",height);
                if(ent.getProperty("mtc:dir")!==undefined) ent.setProperty("mtc:dir",now_rot.y<0?now_rot.y+360:now_rot.y);
                if(ent.getProperty("mtc:power")!==undefined) ent.setProperty("mtc:power",engine_out);
                if(ent.getProperty("mtc:tacho")!==undefined) ent.setProperty("mtc:tacho",now_pow);

                if (height < 0.01) {
                    ent.setDynamicProperty("mtc_dy", 0)
                    ent.setDynamicProperty("mtc_dx", 0)
                    if(ent.getProperty("mtc:roll")!==undefined) ent.setProperty("mtc:roll",0);
                    if(ent.getProperty("mtc:pitch")!==undefined) ent.setProperty("mtc:pitch",0);
                } else {
                    ent.setDynamicProperty("mtc_dy", dy * 10)
                    ent.setDynamicProperty("mtc_dx", -dx)
                    if(ent.getProperty("mtc:roll")!==undefined) ent.setProperty("mtc:roll",dy * 10);
                    if(ent.getProperty("mtc:pitch")!==undefined) ent.setProperty("mtc:pitch",-dx);
                }

            }

        }

        //マスコンアニメーション
        // 実行主mtc_fidと同じmtc_fidを持つ車体を取得

        if (ent.hasTag("mtc_mas_v2") || ent.hasTag("mtc_mode_v2")) {
            if (ent.hasTag("mtc_mas_v2")) {
                ent.removeTag("mtc_mas_v2")
                const not = obj_not.getScore(ent)
                for (const ent_f of sf_ents) {
                    //マスコンアニメーション
                    if (not < 0) {
                        playAni(ent_f, "mas_b" + (-not), "mtc_anicon_mas")
                    } else if (not > 0) {
                        playAni(ent_f, "mas_p" + not, "mtc_anicon_mas")
                    } else {
                        playAni(ent_f, "mas_nc", "mtc_anicon_mas")
                    }
                    if(ent_f.getProperty("mtc:notch")!==undefined) ent_f.setProperty("mtc:notch",not);
                }
            }
            if (ent.hasTag("mtc_mode_v2")) {
                ent.removeTag("mtc_mode_v2")
                const mtc_maku = obj_mtc_maku.getScore(ent)
                for (const ent_f of sf_ents) {
                    //幕イベント発生
                    //playAni(ent_f, "mode" + (mtc_maku + 1), "mtc_anicom_maku")
                    try {
                        ent_f.triggerEvent("mode" + (mtc_maku + 1))
                    } catch (e) { }
                }
            }

        }

    }
    body_parent_master_refresh=false

}, 1)


system.afterEvents.scriptEventReceive.subscribe((event) => {
    let { id, message, sourceEntity, sourceBlock, sourceType } = event;

    if(id.slice(0,4)!=="mtc:") {
        return
    }

    let initiator = undefined
    if (message.slice(0, 1) === "\"" && message.slice(-1) === "\"") {
        message = message.slice(1, -1)
    }

    if (sourceType == "Entity" || sourceType == "Block" || sourceType == "NPCDialogue") {
        initiator = sourceEntity
        let x, y, z, dim
        let org_loc

        if (sourceType == "Entity" || sourceType == "NPCDialogue") {
            dim = sourceEntity.dimension
            x = sourceEntity.location.x
            y = sourceEntity.location.y
            z = sourceEntity.location.z
            org_loc = sourceEntity.location

            //乗務確認
            if (sourceEntity.typeId == "minecraft:player") {
                sourceEntity.runCommand("function mtc/testBoard")
                sourceEntity.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_calcj1 = @s mtc_calc1")
                const jomu_ents = getSelectorEntities("@e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1]", sourceEntity)

                if (jomu_ents.length > 0) {
                    const jomu_ent = jomu_ents[0]
                    x = jomu_ent.location.x
                    y = jomu_ent.location.y
                    z = jomu_ent.location.z
                }
            }

        } else if (sourceType == "Block") {
            initiator = sourceBlock
            dim = sourceBlock.dimension
            x = sourceBlock.location.x
            y = sourceBlock.location.y
            z = sourceBlock.location.z
            org_loc = sourceBlock.location
        }

        const base_bodys = getSelectorEntities2(`@e[x=${x},y=${y},z=${z},family=mtc_body,tag=mtc_parent,c=1]`, dim)

        if (id == "mtc:set_crail_max") {
            world.setDynamicProperty("mtc_clearrail_max_len", Number(message))
            world.sendMessage("Clear Rail Max Distance = " + Number(message))
            world.sendMessage("Default is 16")
        } else if (id == "mtc:antilag_max") {
            world.setDynamicProperty("mtc_max_scale", Number(message))
            world.sendMessage("AntiLag System Max Scale = " + Number(message))
            world.sendMessage("Default is 1")
        } else if (id == "mtc:antilag_scale") {
            world.setDynamicProperty("mtc_scale", Number(message))
            world.sendMessage("AntiLag System Scale (Manual) = " + Number(message))
            world.sendMessage("Default is 0")
        } else if (id == "mtc:setjoint") {
            sourceEntity.setDynamicProperty("mtc_jointsound", message)
        } else if (id == "mtc:summon") {
            const args = message.split(" ")
            const ename = args[0]
            let arg = ""
            if (args.length >= 2) {
                arg = args[1]
                for (let i = 2; i < args.length; i++) {
                    arg += " " + args[i]
                }
            }

            if (args.length >= 2) {
                obj_mtc_global.setScore("dir_preset", 2)
            }
            if (sourceType == "Entity" || sourceType == "NPCDialogue") {
                initiator.runCommand(`summon ${ename} ${arg}`)

            } else if (sourceType == "Block") {
                x += 0.5
                z += 0.5
                dim.runCommand(`execute positioned ${x} ${y} ${z} run summon ${ename} ${arg}`)
            }

        } else if (id == "mtc:inner_body_length") {
            //ダミーprocを先においてそれとの距離を測定
            const ents = dim.getEntities({ type: "mtc:mtc_headloc" })
            let ent_p = undefined
            for (const ent of ents) {
                const sc_ca2 = world.scoreboard.getObjective("mtc_calc2")
                if (obj_mtc_uid.hasParticipant(sourceEntity) && sc_ca2.hasParticipant(ent)) {
                    if (world.scoreboard.getObjective("mtc_calc2").getScore(ent) === obj_mtc_uid.getScore(sourceEntity)) {
                        ent_p = ent
                        break
                    }
                }
            }
            if (ent_p === undefined) {
                sourceEntity.setDynamicProperty("mtc_body_length", 20.0)
            } else {
                sourceEntity.setDynamicProperty("mtc_body_length", dist(sourceEntity.location, ent_p.location))
                ent_p.remove()
            }
            trace_newrail(sourceEntity, getFormation(sourceEntity))
        } else if (id == "mtc:inner_body_length_d") {
            const ents = dim.getEntities({ type: "mtc:mtc_headloc" })
            let ent_p = undefined
            for (const ent of ents) {
                const sc_uid = world.scoreboard.getObjective("mtc_uid")
                const sc_ca2 = world.scoreboard.getObjective("mtc_calc2")

                if (sc_uid.hasParticipant(sourceEntity) && sc_ca2.hasParticipant(ent)) {
                    if (world.scoreboard.getObjective("mtc_calc2").getScore(ent) === world.scoreboard.getObjective("mtc_uid").getScore(sourceEntity) + 1) {
                        ent_p = ent
                        break
                    }
                }
            }
            //台車位置情報は連結先頭以外使えないことに注意
            if (ent_p === undefined) {
                sourceEntity.setDynamicProperty("mtc_d_length", 17.5)
            } else {
                sourceEntity.setDynamicProperty("mtc_d_length", dist(sourceEntity.location, ent_p.location))
                sourceEntity.addTag("mtc_has_dp")
                ent_p.remove()
            }
            trace_newrail(sourceEntity, getFormation(sourceEntity))
        } else if (id == "mtc:conrot") {
            //連結時向き補正
            const ent = getSelectorEntities("@e[family=mtc_body,c=1,tag=mtc_temp_conn]", sourceEntity)[0]
            const rot1 = sourceEntity.getRotation().y
            const rot2 = ent.getRotation().y
            let diff = rot1 - rot2
            if (diff < -90 || diff > 90) {


                const rails = sourceEntity.dimension.getEntities({ families: ["mtc_rail"], location: sourceEntity.location, maxDistance: 40 })
                let min = 1e30
                let m_rail = undefined
                for (const rail of rails) {
                    const p1 = rail.getDynamicProperty("mtc_bz_p1")
                    const p2 = rail.getDynamicProperty("mtc_bz_p2")
                    const p3 = rail.getDynamicProperty("mtc_bz_p3")
                    const t = getBezierNeart(p1, p2, p3, sourceEntity.location)

                    const p = getBezier(p1, p2, p3, t)
                    const d2 = dist2(sourceEntity.location, p)
                    if (d2 < min) {
                        min = d2
                        m_rail = rail
                    }
                }

                //新線路上の場合は反対方向に台車を伸ばす場合の近傍点
                if (min <= 25) {
                    const p1 = m_rail.getDynamicProperty("mtc_bz_p1")
                    const p2 = m_rail.getDynamicProperty("mtc_bz_p2")
                    const p3 = m_rail.getDynamicProperty("mtc_bz_p3")
                    const t = getBezierNeart(p1, p2, p3, sourceEntity.location)
                    const p = getBezier(p1, p2, p3, t)
                    const dir = bezierTangent(p1, p2, p3, t)
                    let deg = Math.atan2(-dir.x, dir.z) * 57.29578
                    let diff = deg - rot2
                    if (diff < -90) {
                        diff += 180
                    }
                    if (diff > 90) {
                        diff -= 180
                    }
                    deg = rot2 + diff

                    sourceEntity.teleport(p)

                    let def_d_length = sourceEntity.getDynamicProperty("mtc_d_length")
                    if (def_d_length === undefined) {
                        sourceEntity.setDynamicProperty("mtc_d_length", def_d_length)
                        def_d_length = 18
                    }
                    let h_min = 1e30
                    let h_rail = undefined
                    let head_loc
                    const n_spl = 0.5 / Math.round(def_d_length)
                    for (let j = n_spl; j <= 1; j += n_spl) {
                        const rot = { x: 0, y: deg }
                        const bx_uz = -Math.sin(0.0174533 * deg)
                        const by_uz = 0
                        const bz_uz = Math.cos(0.0174533 * rot.y)

                        const sx = sourceEntity.location.x + def_d_length * j * bx_uz
                        const sy = sourceEntity.location.y + def_d_length * j * by_uz
                        const sz = sourceEntity.location.z + def_d_length * j * bz_uz
                        head_loc = { x: sx, y: sy, z: sz }

                        h_min = 1e30
                        h_rail = undefined
                        for (const rail of rails) {
                            const p1 = rail.getDynamicProperty("mtc_bz_p1")
                            const p2 = rail.getDynamicProperty("mtc_bz_p2")
                            const p3 = rail.getDynamicProperty("mtc_bz_p3")
                            const tlm = rail.getDynamicProperty("mtc_tlm")
                            const vrail = rail.getDynamicProperty("mtc_vrail")
                            const t = getBezierNeart(p1, p2, p3, head_loc)

                            const p = getBezier(p1, p2, p3, t)
                            const d2 = dist2(head_loc, p)
                            if (d2 < h_min) {
                                h_min = d2
                                h_rail = rail
                                deg = Math.atan2(-(p.x - sourceEntity.location.x), p.z - sourceEntity.location.z) * 57.29578
                                sourceEntity.setDynamicProperty("mtc_head_p1", p1)
                                sourceEntity.setDynamicProperty("mtc_head_p2", p2)
                                sourceEntity.setDynamicProperty("mtc_head_p3", p3)
                                sourceEntity.setDynamicProperty("mtc_head_tlm", tlm)
                                sourceEntity.setDynamicProperty("mtc_head_vrail", vrail)
                            }
                        }
                    }
                    sourceEntity.setRotation({ x: 0, y: deg })
                } else {
                    //通常レールなら反転
                    if (diff < -90)
                        diff += 180;
                    if (diff > 90)
                        diff -= 180;
                    sourceEntity.setRotation({ x: 0, y: rot2 + diff })
                }
            }
            sourceEntity.runCommand("tag @e remove mtc_temp_conn")
        } else if (id == "mtc:npt") {
            const splits = message.split(" ")
            let id = splits[0]
            let accept = (splits.length <= 2)
            const trg_ents = dim.getEntities({ families: ["mtc_rail2"], location: { x: x, y: y, z: z }, closest: 1 })

            if (trg_ents.length > 0) {
                const trg_ent = trg_ents[0]

                if (splits.length == 2) {
                    //幕一致検索
                    if (base_bodys.length > 0) {
                        const base_body = base_bodys[0]
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    } else {
                        accept = false
                    }
                }

                if (accept) {
                    trg_ent.setDynamicProperty("mtc_bz_p1", trg_ent.getDynamicProperty("mtc_bz" + id + "_p1"))
                    trg_ent.setDynamicProperty("mtc_bz_p2", trg_ent.getDynamicProperty("mtc_bz" + id + "_p2"))
                    trg_ent.setDynamicProperty("mtc_bz_p3", trg_ent.getDynamicProperty("mtc_bz" + id + "_p3"))
                    trg_ent.setDynamicProperty("mtc_now_npt", Number(id))
                    if(trg_ent.getProperty("mtc:point")===undefined){
                        aniRail()
                    }else if(trg_ent.getDynamicProperty("mtc_pani_off") !== 1){
                        if(trg_ent.getDynamicProperty("mtc_now_npt")===2){
                            trg_ent.setProperty("mtc:point",2)
                        }else{
                            trg_ent.setProperty("mtc:point",1)
                        }
                    }
                }
            }

            //sourceEntity.setDynamicProperty("mtc_point_pre",Number(message))//これ直前のレッドストーン用なのでここでは書き込まない
        } else if (id == "mtc:init") {
            loadObjs()
        } else if (id == "mtc:setpgop") {
            let ent_pg = dim.getEntities({ excludeTypes: ["minecraft:player"], excludeFamilies: ["mtc_rail", "mtc_obj"], location: org_loc, closest: 1 })
            if (ent_pg.length > 0) {
                ent_pg[0].setDynamicProperty("mtc_pgop", message)
            }
        } else if (id == "mtc:setpgcl") {
            let ent_pg = dim.getEntities({ excludeTypes: ["minecraft:player"], excludeFamilies: ["mtc_rail", "mtc_obj"], location: org_loc, closest: 1 })
            if (ent_pg.length > 0) {
                ent_pg[0].setDynamicProperty("mtc_pgcl", message)
            }
        } else {


            if (base_bodys.length > 0) {
                const base_body = base_bodys[0]

                //編成全体取得
                const fid = world.scoreboard.getObjective("mtc_uid").getScore(base_body)
                let ents_f = []
                for (const ent of bodies_g) {
                    if (world.scoreboard.getObjective("mtc_fid").getScore(ent) == fid) {
                        ents_f.push(ent)
                    }
                }

                if (id == "mtc:stop") {
                    base_body.runCommand("scoreboard players operation @s mtc_not = @s mtc_notBM")
                    base_body.runCommand("tag @s add mtc_mas_v2")
                    base_body.runCommand("scoreboard players set @s mtc_ato -1")
                    base_body.runCommand("scoreboard players set @s mtc_spd 0")
                    world.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.stop" }] })
                } else if (id == "mtc:stopa") {
                    base_body.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_not = @s mtc_notBM")
                    base_body.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run tag @s add mtc_mas_v2")
                    base_body.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players set @s mtc_ato -1")
                    base_body.runCommand("execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players set @s mtc_spd 0")
                    world.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.stop" }] })
                } else if (id == "mtc:inner_pg_openL") {
                    if (!obj_mtc_global.hasParticipant("pg_off")) {
                        obj_mtc_global.setScore("pg_off", 0)
                    }
                    if (obj_mtc_global.getScore("pg_off") !== 1) {
                        const len = base_body.getDynamicProperty("mtc_body_length")
                        if (len !== undefined) {
                            let js = js_high
                            let je = je_high
                            if (sourceEntity.hasTag("mtc_pglow")) {
                                js = js_low
                                je = je_low
                            }

                            const loc = sourceEntity.location
                            const roty = sourceEntity.getRotation().y
                            let rotx = getState(sourceEntity, "mtc_tilt_x")
                            if (rotx === undefined) rotx = 0;
                            const ux_x = Math.cos(roty * 0.0174533)
                            const ux_z = Math.sin(roty * 0.0174533)
                            const uz_x = -Math.sin(roty * 0.0174533) * Math.cos(rotx * 0.0174533)
                            const uz_z = Math.cos(roty * 0.0174533) * Math.cos(rotx * 0.0174533)
                            const uz_y = Math.sin(rotx * 0.0174533)
                            let ents_pg = {}
                            const targ_ents = sourceEntity.dimension.getEntities({ location: loc, maxDistance: len * 2, excludeFamilies: ["mtc_obj", "mtc_rail"], excludeTypes: ["player", "mtc:seat"] })

                            for (let i = -4; i <= Math.ceil(len * 2) + 4; i++) {
                                for (let j = js; j <= je; j++) {
                                    for (let k = 1; k <= 3; k++) {
                                        const dz = 0.5 * i
                                        const dx = k
                                        const sloc = { x: loc.x + dx * ux_x + dz * uz_x, y: loc.y + dz * uz_y + j, z: loc.z + dx * ux_z + dz * uz_z }
                                        for (const s_ent of targ_ents) {
                                            if (dist2(sloc, s_ent.location) <= 0.81) ents_pg[s_ent.id] = s_ent;
                                        }
                                    }
                                }
                            }
                            for (const key in ents_pg) {
                                const pg_ent = ents_pg[key]
                                pg_ent.addTag("pg_open")
                                try {
                                    pg_ent.triggerEvent("open")
                                } catch (e) { }
                                try {
                                    pg_ent.triggerEvent("pgop")
                                } catch (e) { }

                                const sound = pg_ent.getDynamicProperty("mtc_pgop")
                                if (sound !== undefined) {
                                    pg_ent.runCommand(`playsound ${sound} @a ~~~ 10`)
                                }
                            }
                        }
                    }
                } else if (id == "mtc:inner_pg_openR") {
                    if (!obj_mtc_global.hasParticipant("pg_off")) {
                        obj_mtc_global.setScore("pg_off", 0)
                    }
                    if (obj_mtc_global.getScore("pg_off") !== 1) {
                        const len = base_body.getDynamicProperty("mtc_body_length")
                        if (len !== undefined) {
                            if (len !== undefined) {
                                let js = js_high
                                let je = je_high
                                if (sourceEntity.hasTag("mtc_pglow")) {
                                    js = js_low
                                    je = je_low
                                }

                                const loc = sourceEntity.location
                                const roty = sourceEntity.getRotation().y
                                let rotx = getState(sourceEntity, "mtc_tilt_x")
                                if (rotx === undefined) rotx = 0;
                                const ux_x = Math.cos(roty * 0.0174533)
                                const ux_z = Math.sin(roty * 0.0174533)
                                const uz_x = -Math.sin(roty * 0.0174533) * Math.cos(rotx * 0.0174533)
                                const uz_z = Math.cos(roty * 0.0174533) * Math.cos(rotx * 0.0174533)
                                const uz_y = Math.sin(rotx * 0.0174533)
                                let ents_pg = {}
                                const targ_ents = sourceEntity.dimension.getEntities({ location: loc, maxDistance: len * 2, excludeFamilies: ["mtc_obj", "mtc_rail"], excludeTypes: ["player", "mtc:seat"] })

                                for (let i = -4; i <= Math.ceil(len * 2) + 4; i++) {
                                    for (let j = js; j <= je; j++) {
                                        for (let k = 1; k <= 3; k++) {
                                            const dz = 0.5 * i
                                            const dx = -k
                                            const sloc = { x: loc.x + dx * ux_x + dz * uz_x, y: loc.y + dz * uz_y + j, z: loc.z + dx * ux_z + dz * uz_z }
                                            for (const s_ent of targ_ents) {
                                                if (dist2(sloc, s_ent.location) <= 0.81) ents_pg[s_ent.id] = s_ent;
                                            }
                                        }
                                    }
                                }
                                for (const key in ents_pg) {
                                    const pg_ent = ents_pg[key]

                                    pg_ent.addTag("pg_open")
                                    try {
                                        pg_ent.triggerEvent("open")
                                    } catch (e) { }
                                    try {
                                        pg_ent.triggerEvent("pgop")
                                    } catch (e) { }

                                    const sound = pg_ent.getDynamicProperty("mtc_pgop")
                                    if (sound !== undefined) {
                                        pg_ent.runCommand(`playsound ${sound} @a ~~~ 10`)
                                    }
                                }
                            }
                        }
                    }
                } else if (id == "mtc:inner_pg_closeL") {
                    if (!obj_mtc_global.hasParticipant("pg_off")) {
                        obj_mtc_global.setScore("pg_off", 0)
                    }
                    if (obj_mtc_global.getScore("pg_off") !== 1) {

                        const len = base_body.getDynamicProperty("mtc_body_length")
                        if (len !== undefined) {
                            if (len !== undefined) {
                                let js = js_high
                                let je = je_high
                                if (sourceEntity.hasTag("mtc_pglow")) {
                                    js = js_low
                                    je = je_low
                                }

                                const loc = sourceEntity.location
                                const roty = sourceEntity.getRotation().y
                                let rotx = getState(sourceEntity, "mtc_tilt_x")
                                if (rotx === undefined) rotx = 0;
                                const ux_x = Math.cos(roty * 0.0174533)
                                const ux_z = Math.sin(roty * 0.0174533)
                                const uz_x = -Math.sin(roty * 0.0174533) * Math.cos(rotx * 0.0174533)
                                const uz_z = Math.cos(roty * 0.0174533) * Math.cos(rotx * 0.0174533)
                                const uz_y = Math.sin(rotx * 0.0174533)
                                let ents_pg = {}
                                const targ_ents = sourceEntity.dimension.getEntities({ location: loc, maxDistance: len * 2, excludeFamilies: ["mtc_obj", "mtc_rail"], excludeTypes: ["player", "mtc:seat"] })

                                for (let i = -4; i <= Math.ceil(len * 2) + 4; i++) {
                                    for (let j = js; j <= je; j++) {
                                        for (let k = 1; k <= 3; k++) {
                                            const dz = 0.5 * i
                                            const dx = k
                                            const sloc = { x: loc.x + dx * ux_x + dz * uz_x, y: loc.y + dz * uz_y + j, z: loc.z + dx * ux_z + dz * uz_z }
                                            for (const s_ent of targ_ents) {
                                                if (dist2(sloc, s_ent.location) <= 0.81) ents_pg[s_ent.id] = s_ent;
                                            }
                                        }
                                    }
                                }
                                for (const key in ents_pg) {
                                    const pg_ent = ents_pg[key]

                                    pg_ent.removeTag("pg_open")
                                    try {
                                        pg_ent.triggerEvent("close")
                                    } catch (e) { }
                                    try {
                                        pg_ent.triggerEvent("pgcl")
                                    } catch (e) { }

                                    const sound = pg_ent.getDynamicProperty("mtc_pgcl")
                                    if (sound !== undefined) {
                                        pg_ent.runCommand(`playsound ${sound} @a ~~~ 10`)
                                    }
                                }
                            }
                        }
                    }
                } else if (id == "mtc:inner_pg_closeR") {
                    if (!obj_mtc_global.hasParticipant("pg_off")) {
                        obj_mtc_global.setScore("pg_off", 0)
                    }
                    if (obj_mtc_global.getScore("pg_off") !== 1) {

                        const len = base_body.getDynamicProperty("mtc_body_length")
                        if (len !== undefined) {
                            if (len !== undefined) {
                                let js = js_high
                                let je = je_high
                                if (sourceEntity.hasTag("mtc_pglow")) {
                                    js = js_low
                                    je = je_low
                                }

                                const loc = sourceEntity.location
                                const roty = sourceEntity.getRotation().y
                                let rotx = getState(sourceEntity, "mtc_tilt_x")
                                if (rotx === undefined) rotx = 0;
                                const ux_x = Math.cos(roty * 0.0174533)
                                const ux_z = Math.sin(roty * 0.0174533)
                                const uz_x = -Math.sin(roty * 0.0174533) * Math.cos(rotx * 0.0174533)
                                const uz_z = Math.cos(roty * 0.0174533) * Math.cos(rotx * 0.0174533)
                                const uz_y = Math.sin(rotx * 0.0174533)
                                let ents_pg = {}
                                const targ_ents = sourceEntity.dimension.getEntities({ location: loc, maxDistance: len * 2, excludeFamilies: ["mtc_obj", "mtc_rail"], excludeTypes: ["player", "mtc:seat"] })

                                for (let i = -4; i <= Math.ceil(len * 2) + 4; i++) {
                                    for (let j = js; j <= je; j++) {
                                        for (let k = 1; k <= 3; k++) {
                                            const dz = 0.5 * i
                                            const dx = -k
                                            const sloc = { x: loc.x + dx * ux_x + dz * uz_x, y: loc.y + dz * uz_y + j, z: loc.z + dx * ux_z + dz * uz_z }
                                            for (const s_ent of targ_ents) {
                                                if (dist2(sloc, s_ent.location) <= 0.81) ents_pg[s_ent.id] = s_ent;
                                            }
                                        }
                                    }
                                }
                                for (const key in ents_pg) {
                                    const pg_ent = ents_pg[key]

                                    pg_ent.removeTag("pg_open")
                                    try {
                                        pg_ent.triggerEvent("close")
                                    } catch (e) { }
                                    try {
                                        pg_ent.triggerEvent("pgcl")
                                    } catch (e) { }
                                    const sound = pg_ent.getDynamicProperty("mtc_pgcl")
                                    if (sound !== undefined) {
                                        pg_ent.runCommand(`playsound ${sound} @a ~~~ 10`)
                                    }

                                }
                            }
                        }
                    }
                } else if (id == "mtc:anion") {
                    const splits = message.split(" ")
                    let ani_id = Number(splits[0])
                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {
                        base_body.addTag("mtc_ani" + ani_id)
                        for (const ent of ents_f) {
                            ent.setDynamicProperty("ani" + ani_id, 1)
                            playAni(ent, "ani" + ani_id, "ani" + ani_id)
                            try { ent.runCommand(`function ${getIdBase(ent.typeId)}/ani/ani${ani_id}`) } catch (e) { }
                            const name = getIdBase(ent.typeId)
                            ent.dimension.playSound(name + "_ani" + ani_id, ent.location, { volume: 256 })
                        }
                    }
                } else if (id == "mtc:anioff") {
                    const splits = message.split(" ")
                    let ani_id = Number(splits[0])
                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {
                        base_body.removeTag("mtc_ani" + ani_id)
                        for (const ent of ents_f) {
                            ent.setDynamicProperty("ani" + ani_id, 0)
                            stopAni(ent, "ani" + ani_id)
                            playAni(ent, "ani" + ani_id + "e", "ani" + ani_id)
                            try { ent.runCommand(`function ${getIdBase(ent.typeId)}/ani/ani${ani_id}e`) } catch (e) { }
                            const name = getIdBase(ent.typeId)
                            ent.dimension.playSound(name + "_ani" + ani_id + "e", ent.location, { volume: 256 })
                        }
                    }
                } else if (id == "mtc:soundon") {
                    const splits = message.split(" ")
                    let sound_id = Number(splits[0])
                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {
                        loopSoundOn(ents_f,sound_id)
                    }
                } else if (id == "mtc:soundoff") {
                    const splits = message.split(" ")
                    let sound_id = Number(splits[0])
                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {
                        loopSoundOff(ents_f,sound_id)
                    }
                } else if (id == "mtc:horn") {
                    const splits = message.split(" ")
                    let sound_id = Number(splits[0])
                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {
                        dim.runCommand("execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc2 = @s mtc_fid")
                        dim.runCommand(`execute positioned ${x} ${y} ${z} run scoreboard players operation @e[family=mtc_body] mtc_calc2 -= @e[family=mtc_body,tag=mtc_parent,scores={mtc_calcj1=0},c=1] mtc_fid`)
                        const ents2 = getSelectorEntities2("@e[family=mtc_body,scores={mtc_calc2=0}]", dim)
                        horn(ents2,sound_id)
                    }
                } else if (id == "mtc:tasc") {
                    const splits = message.split(" ")
                    let dist = Number(splits[0])
                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {
                        if (dist === 0) {
                            base_body.removeTag("mtc_tasc")
                            base_body.removeTag("mtc_tasc_do")
                            for(const entf of ents_f){
                                if(entf.getProperty("mtc:tasc")!==undefined) entf.setProperty("mtc:tasc",-1);
                            }

                        } else {

                            //ブロック位置を考慮した真の距離を計算したい
                            //早く反応したか遅く反応したか確かめるため，位置と速度見たい
                            if (sourceType == "Block") {
                                x += 0.5
                                y += 0.5
                                z += 0.5

                                let spd = 0.0005 * obj_mtc_spd.getScore(base_body);
                                let sign = 1
                                if (base_body.hasTag("mtc_rev")) {
                                    spd *= -1
                                    sign = -1
                                }

                                const rot = base_body.getRotation()

                                const uz = Math.cos(0.0174533 * rot.y) * Math.cos(0.0174533 * rot.x)
                                const uy = Math.sin(0.0174533 * rot.x)
                                const ux = -Math.sin(0.0174533 * rot.y) * Math.cos(0.0174533 * rot.x)

                                const dx = x - base_body.location.x
                                const dy = y - base_body.location.y
                                const dz = z - base_body.location.z
                                const svx = sign * ux
                                const svy = sign * uy
                                const svz = sign * uz

                                const dot_product = dx * svx + dy * svy + dz * svz

                                let diff = Math.sqrt(dx ** 2 + dz ** 2)
                                if (dot_product < 0) {
                                    //遅く反応した場合
                                    diff *= -1

                                }
                                dist += diff
                            }
                            tascSet(base_body, dist)
                        }
                    }
                } else if (id == "mtc:run") {
                    const splits = message.split(" ")
                    let raw_spd = Number(splits[0])
                    let dist = Number(splits[1])
                    let accept = (splits.length == 2 || splits.length == 3)

                    if (splits.length == 3) {
                        //幕一致検索
                        accept = testMode(splits[2], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {

                        //ブロック位置を考慮した真の距離を計算したい
                        //早く反応したか遅く反応したか確かめるため，位置と速度見たい
                        if (sourceType == "Block") {
                            x += 0.5
                            y += 0.5
                            z += 0.5

                            let spd = 0.0005 * obj_mtc_spd.getScore(base_body);
                            let sign = 1
                            if (base_body.hasTag("mtc_rev")) {
                                spd *= -1
                                sign = -1
                            }

                            const rot = base_body.getRotation()
                            const loc = base_body.location

                            const uz = Math.cos(0.0174533 * rot.y) * Math.cos(0.0174533 * rot.x)
                            const uy = Math.sin(0.0174533 * rot.x)
                            const ux = -Math.sin(0.0174533 * rot.y) * Math.cos(0.0174533 * rot.x)

                            const dx = x - loc.x
                            const dy = y - loc.y
                            const dz = z - loc.z
                            const svx = sign * ux
                            const svy = sign * uy
                            const svz = sign * uz

                            const dot_product = dx * svx + dy * svy + dz * svz

                            let diff = Math.sqrt(dx ** 2 + dz ** 2)
                            if (dot_product < 0) {
                                //遅く反応した場合
                                diff *= -1

                            }
                            dist += diff
                        }
                        tascSet(base_body, dist)
                        if (raw_spd < 0) {
                            world.scoreboard.getObjective("mtc_ato").setScore(base_body, -1)
                        } else {
                            world.scoreboard.getObjective("mtc_ato").setScore(base_body, Math.trunc(raw_spd * 2000))
                        }
                    }
                } else if (id == "mtc:dist") {
                    if (base_body.getDynamicProperty("dist") === undefined) base_body.setDynamicProperty("dist", 0.0);
                    const now_dist = base_body.getDynamicProperty("dist")
                    const last_dist = base_body.getDynamicProperty("last_dist")
                    if (last_dist === undefined) {
                        world.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.from_spawn" }, { "text": " : " + (Math.round(now_dist * 1000) / 1000) + " m" }] })
                    } else {
                        world.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.from_last" }, { "text": " : " + (Math.round((now_dist - last_dist) * 1000) / 1000) + " m" }] })
                    }
                    base_body.setDynamicProperty("last_dist", now_dist)
                } else if (id == "mtc:ats") {
                    const splits = message.split(" ")
                    let spd_raw = Number(splits[0])
                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {

                        if (spd_raw < 0) {
                            world.scoreboard.getObjective("mtc_ats").setScore(base_body, -1)
                        } else {
                            world.scoreboard.getObjective("mtc_ats").setScore(base_body, Math.trunc(spd_raw * 2000))
                        }
                    }
                } else if (id == "mtc:ato") {
                    const splits = message.split(" ")
                    let spd_raw = Number(splits[0])
                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {

                        if (spd_raw < 0) {
                            world.scoreboard.getObjective("mtc_ato").setScore(base_body, -1)
                        } else {
                            world.scoreboard.getObjective("mtc_ato").setScore(base_body, Math.trunc(spd_raw * 2000))
                        }
                    }
                } else if (id == "mtc:atc") {
                    const splits = message.split(" ")
                    let spd_raw = Math.trunc(Number(splits[0]))
                    if (spd_raw < 0)
                        spd_raw = -1;
                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }

                    if (accept) {

                        for (const ent_f of ents_f) {
                            ent_f.setDynamicProperty("mtc_atc", spd_raw)
                            if (spd_raw < 0) {
                                stopAni(ent_f, "mtc_anicon_atc_meter")
                                if(ent_f.getProperty("mtc:atc")!==undefined) ent_f.setProperty("mtc:atc",-1);
                            } else {
                                playAni(ent_f, "atc_" + Math.trunc(spd_raw / 10) * 10, "mtc_anicon_atc_meter")
                                playAni(ent_f, "atc_" + Math.trunc(spd_raw / 5) * 5, "mtc_anicon_atc_meter")
                                playAni(ent_f, "atc_" + spd_raw, "mtc_anicon_atc_meter")
                                if(ent_f.getProperty("mtc:atc")!==undefined) ent_f.setProperty("mtc:atc",spd_raw);
                            }
                        }
                    }
                } else if (id == "mtc:ap") {
                    if (base_body.hasTag("mtc_plane")) {
                        //文法 飛行経路
                        //機能 着陸以外エンジン出力90%で連続動作
                        // 飛行経路の書き方:x,y,z x,y,z x,y,z ...
                        // 離陸する点の手前から接地する点の先まで
                        const str_points = message.split(" ")
                        let ct_p = [base_body.location]

                        for (const str_p of str_points) {
                            if (str_p !== "") {
                                const ps = str_p.split(",")
                                ct_p.push({ x: Number(ps[0]), y: Number(ps[1]), z: Number(ps[2]) })
                            }
                        }

                        const pe2 = ct_p[ct_p.length - 1]
                        const pe3 = ct_p[ct_p.length - 2]
                        const vx = pe2.x - pe3.x
                        const vy = 0
                        const vz = pe2.z - pe3.z
                        const vl = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2)
                        ct_p.push({ x: pe2.x + vx * 10 / vl, y: pe2.y + vy * 10 / vl, z: pe2.z + vz * 10 / vl })

                        const pi2 = ct_p[1]
                        const pi3 = ct_p[0]
                        const vx2 = pi2.x - pi3.x
                        const vy2 = 0
                        const vz2 = pi2.z - pi3.z
                        const vl2 = Math.sqrt(vx2 ** 2 + vy2 ** 2 + vz2 ** 2)
                        ct_p.splice(2, 0, { x: pi2.x + vx2 * 10 / vl2, y: pi2.y + vy2 * 10 / vl2, z: pi2.z + vz2 * 10 / vl2 })

                        const bzs = splitBezier(ct_p)

                        for (let i = 0; i < bzs.length; i++) {
                            const bz = bzs[i]
                            base_body.setDynamicProperty("mtc_autopirot_bz" + i + "p1", bz[0])
                            base_body.setDynamicProperty("mtc_autopirot_bz" + i + "p2", bz[1])
                            base_body.setDynamicProperty("mtc_autopirot_bz" + i + "p3", bz[2])
                        }
                        base_body.setDynamicProperty("mtc_autopirot_n", bzs.length)
                        base_body.setDynamicProperty("mtc_autopirot_now", 0)
                        base_body.addTag("mtc_autopirot")
                    } else {
                        world.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_autopirot" }] })
                    }

                } else if (id == "mtc:apoff") {
                    base_body.removeTag("mtc_autopirot")
                } else if (id == "mtc:rider") {
                    let buf = ""
                    let splits = []
                    let indc = false
                    for (const ch of message) {
                        if (ch === "\'") {
                            indc = !indc
                        } else if (!indc && ch === " ") {
                            if (buf != "") {
                                splits.push(buf)
                                buf = ""
                            }
                        } else {
                            buf += ch
                        }
                    }
                    if (buf != "") {
                        splits.push(buf)
                    }

                    let accept = (splits.length <= 2)

                    if (splits.length == 2) {
                        //幕一致検索
                        accept = testMode(splits[1], 1 + world.scoreboard.getObjective("mtc_maku").getScore(base_body))
                    }


                    if (accept) {

                        let pls = []
                        for (const ent of ents_f) {
                            pls = pls.concat(getRiderPlayer(ent))
                        }
                        for (const pl of pls) {
                            try {
                                pl.runCommand(splits[0])
                            } catch (e) { }
                        }
                    }

                } else {
                    world.sendMessage("§cInvalid Command!")
                }
            } else {
                world.sendMessage({ rawtext: [{ "translate": "mtc:mtc.warn.no_controll" }] })
            }
        }

    } else {
        console.warn("Cannot run from server!")
        return
    }
});

function getRiderPlayer(ent) {
    let res = []
    const riders_cp = ent.getComponent("minecraft:rideable")
    if (riders_cp !== undefined) {
        const riders = riders_cp.getRiders()
        for (const rider of riders) {
            if (rider.typeId !== "mtc:seat") {
                res.push(rider)
            } else {
                res = res.concat(rider.getComponent("minecraft:rideable").getRiders())
            }
        }
    }
    return res
}


world.beforeEvents.entityRemove.subscribe((e) => {
    const ent = e.removedEntity
    const dim = ent.dimension
    const loc = ent.location
    const rot = ent.getRotation()
    const type = ent.typeId
    const is_rail = (ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_rail") || ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_pole"))
    const mtc_safe_remove = ent.hasTag("mtc_safe_remove")
    let props = {}
    let n_prop = 0
    for (const key of ent.getDynamicPropertyIds()) {
        props[key] = ent.getDynamicProperty(key)
        n_prop++
    }


    system.run(() => {
        if (n_prop > 0 && !mtc_safe_remove && is_rail) {
            let new_ent = undefined
            try {
                new_ent = dim.spawnEntity(type, loc)
                new_ent.setRotation(rot)
                for (const key in props) {
                    new_ent.setDynamicProperty(key, props[key])
                }
                setState(new_ent, "mtc_rail_rest_rot", 20)
            } catch (e) {
                if (new_ent !== undefined) {
                    new_ent.remove()
                }
            }

        }
    })
})

//スポーン時
world.afterEvents.playerSpawn.subscribe((eventData) => {
    let { player, initialSpawn } = eventData;
    //if (!initialSpawn) return;
    no_loaded_players.push(player)
});

world.afterEvents.entityLoad.subscribe(
    (event) => {
        if (event.entity.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_body")) {
            bodies_g.push(event.entity)
            reflesh_formation()
        }
    }
);

players_g = world.getPlayers()
loadAllBodies()
//エンティティスポーン
world.afterEvents.entitySpawn.subscribe((entityEvent) => {
    spawnFunc(entityEvent.entity)
    if (entityEvent.entity.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_body")) {
        loadAllBodies()
        reflesh_formation()
    }
});


function loadAllBodies() {
    bodies_g = world.getDimension("overworld").getEntities(run_entity_interfaec)
    bodies_g = bodies_g.concat(world.getDimension("nether").getEntities(run_entity_interfaec))
    bodies_g = bodies_g.concat(world.getDimension("the_end").getEntities(run_entity_interfaec))
}

async function spawnFunc(ent_s) {
    if (ent_s.isValid()) {
        if (ent_s.hasTag("mtc_plane")) {
            ent_s.setDynamicProperty("mtc_engine", 0.0)
            ent_s.setDynamicProperty("mtc_dx", 0.0)
            ent_s.setDynamicProperty("mtc_dy", 0.0)
        } else if (!ent_s.hasTag("mtc_norail") && ent_s.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_body")) {
            //初期設定終わるまで待機
            const spawn_inv = world.getDynamicProperty("mtc_nextspawn_inv")
            world.setDynamicProperty("mtc_nextspawn_inv", false)

            while (true) {
                if (ent_s.hasTag("mtc_init")) break
                await sleep(1)
            }

            if (spawn_inv === true) {
                ent_s.setRotation({ x: 0, y: ent_s.getRotation().y + 180 })
            }

            let on_rail = false
            const ublock = ent_s.dimension.getBlockFromRay(ent_s.location, { x: 0, y: -1, z: 0 })
            if (ublock !== undefined) {
                if (ublock.block.typeId.slice(-4) == "rail") {
                    on_rail = true
                }
            }

            if (!on_rail) {
                const rails = ent_s.dimension.getEntities({ families: ["mtc_rail"], location: ent_s.location, maxDistance: 40 })
                let min = 1e30
                let min_f = 1e30
                let m_rail = undefined
                for (const rail of rails) {
                    const p1 = rail.getDynamicProperty("mtc_bz_p1")
                    const p2 = rail.getDynamicProperty("mtc_bz_p2")
                    const p3 = rail.getDynamicProperty("mtc_bz_p3")
                    const t = getBezierNeart(p1, p2, p3, ent_s.location)

                    const p = getBezier(p1, p2, p3, t)
                    const d2 = dist2(ent_s.location, p)
                    if (d2 < min) {
                        min = d2
                        min_f = (ent_s.location.x - p.x) ** 2 + (ent_s.location.z - p.z) ** 2
                        m_rail = rail
                    }
                }

                if (min_f <= 25) {
                    const p1 = m_rail.getDynamicProperty("mtc_bz_p1")
                    const p2 = m_rail.getDynamicProperty("mtc_bz_p2")
                    const p3 = m_rail.getDynamicProperty("mtc_bz_p3")
                    const tlm = m_rail.getDynamicProperty("mtc_tlm")
                    const joint = m_rail.getDynamicProperty("mtc_joint")
                    const vrail = m_rail.getDynamicProperty("mtc_vrail")
                    const t = getBezierNeart(p1, p2, p3, ent_s.location)
                    const p = getBezier(p1, p2, p3, t)
                    const dir = bezierTangent(p1, p2, p3, t)

                    let deg = Math.atan2(-dir.x, dir.z) * 57.29578
                    const init_deg = ent_s.getRotation().y
                    let diff = deg - init_deg
                    if (diff < -90) {
                        diff += 180
                    }
                    if (diff > 90) {
                        diff -= 180
                    }
                    deg = init_deg + diff

                    //レンジを+-180に修正
                    if (deg < -180) {
                        deg += 360
                    }
                    if (deg > 180) {
                        deg -= 360
                    }
                    //-135~45の範囲外なら反転
                    if (deg < -135) {
                        deg += 180
                    }
                    if (deg > 45) {
                        deg -= 180
                    }

                    if (spawn_inv === true) {
                        deg += 180
                        if (deg > 180) deg -= 360
                    }

                    ent_s.teleport(p)
                    ent_s.setDynamicProperty("mtc_body_p1", p1)
                    ent_s.setDynamicProperty("mtc_body_p2", p2)
                    ent_s.setDynamicProperty("mtc_body_p3", p3)
                    ent_s.setDynamicProperty("mtc_body_tlm", tlm)
                    ent_s.setDynamicProperty("mtc_joint", joint)
                    ent_s.setDynamicProperty("mtc_body_vrail", vrail)
                    ent_s.addTag("mtc_on_newrail_b")
                    ent_s.addTag("mtc_on_newrail_h")
                    setState(ent_s, "mtc_prev", ent_s.location)


                    let def_length = ent_s.getDynamicProperty("mtc_body_length")
                    if (def_length === undefined) {
                        ent_s.setDynamicProperty("mtc_body_length", def_length)
                        def_length = 18
                    }
                    let def_d_length = ent_s.getDynamicProperty("mtc_d_length")
                    if (def_d_length === undefined) {
                        ent_s.setDynamicProperty("mtc_d_length", def_d_length)
                        def_d_length = 18
                    }

                    let h_min = 1e30
                    let h_rail = undefined
                    let head_loc
                    const n_spl = 0.5 / Math.round(def_d_length)
                    for (let j = n_spl; j <= 1; j += n_spl) {
                        const rot = { x: 0, y: deg }
                        const bx_uz = -Math.sin(0.0174533 * deg)
                        const by_uz = 0
                        const bz_uz = Math.cos(0.0174533 * rot.y)

                        const sx = ent_s.location.x + def_d_length * j * bx_uz
                        const sy = ent_s.location.y + def_d_length * j * by_uz
                        const sz = ent_s.location.z + def_d_length * j * bz_uz
                        head_loc = { x: sx, y: sy, z: sz }

                        h_min = 1e30
                        h_rail = undefined
                        for (const rail of rails) {
                            const p1 = rail.getDynamicProperty("mtc_bz_p1")
                            const p2 = rail.getDynamicProperty("mtc_bz_p2")
                            const p3 = rail.getDynamicProperty("mtc_bz_p3")
                            const tlm = rail.getDynamicProperty("mtc_tlm")
                            const vrail = rail.getDynamicProperty("mtc_vrail")
                            const t = getBezierNeart(p1, p2, p3, head_loc)

                            const p = getBezier(p1, p2, p3, t)
                            const d2 = dist2(head_loc, p)
                            if (d2 < h_min) {
                                h_min = d2
                                h_rail = rail
                                deg = Math.atan2(-(p.x - ent_s.location.x), p.z - ent_s.location.z) * 57.29578
                                ent_s.setDynamicProperty("mtc_head_p1", p1)
                                ent_s.setDynamicProperty("mtc_head_p2", p2)
                                ent_s.setDynamicProperty("mtc_head_p3", p3)
                                ent_s.setDynamicProperty("mtc_head_tlm", tlm)
                                ent_s.setDynamicProperty("mtc_head_vrail", vrail)
                            }
                        }
                    }
                    ent_s.setRotation({ x: 0, y: deg })

                }
            }
        }
    }

}

world.afterEvents.entityHitEntity.subscribe((e) => {
    const ent = e.hitEntity
    const pl = e.damagingEntity
    const item = pl.getComponent("minecraft:inventory").container.getSlot(pl.selectedSlotIndex)
    if (item.hasItem()) {
        if ((item.typeId == "mtc:i_marker0" || item.typeId == "mtc:i_marker1") && ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_marker")) {
            pl.runCommand("playsound random.click @s")
            showRAILmenu0(ent, pl)
        } else if ((item.typeId == "mtc:i_marker0") && ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_rail")) {
            pl.runCommand("playsound random.anvil_land @a ~~~")
            ent.addTag("mtc_safe_remove")
            ent.remove()
        } else if ((item.typeId == "mtc:i_marker1") && ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_rail")) {
            pl.runCommand("playsound random.anvil_land @a ~~~")
            let ent_r = ent

            while (true) {
                const next_pos = ent_r.getDynamicProperty("mtc_bz_p3")
                const ents = ent_r.dimension.getEntities({ families: ["mtc_rail"], location: next_pos, maxDistance: 2 })
                ent_r.addTag("mtc_safe_remove")
                ent_r.remove()
                if (ents.length == 0) {
                    break
                } else {
                    ent_r = ents[0]
                }
            }
        } else if ((item.typeId == "mtc:i_marker2") && ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_pmarker")) {
            pl.runCommand("playsound random.click @s")
            showPOLEmenu0(ent, pl)
        } else if ((item.typeId == "mtc:i_marker2") && ent.getComponent("minecraft:type_family")?.hasTypeFamily("mtc_pole")) {
            pl.runCommand("playsound random.anvil_land @a ~~~")
            let ent_r = ent

            while (true) {
                const next_pos = ent_r.getDynamicProperty("mtc_po_p2")
                const ents = ent_r.dimension.getEntities({ families: ["mtc_pole"], location: next_pos, maxDistance: 2 })
                ent_r.addTag("mtc_safe_remove")
                ent_r.remove()
                if (ents.length == 0) {
                    break
                } else {
                    ent_r = ents[0]
                    const hide_base = ent_r.getDynamicProperty("mtc_pole_base_h")
                    if (hide_base !== true) break;

                }
            }
        }
    }
})

async function remove_ticker(ticker){
    ticker.remove()
    await sleep(5)
    active_tickers=active_tickers.filter(val => val.isValid === true);
}

async function setPole(ent, pl, rail_type, end_pole = false) {
    const name_add = pole_types[rail_type]
    let pole_max_len = 16


    const owner_id = ent.getDynamicProperty("mtc_owner")

    let final_remove_markers = []

    const ticker = ent.dimension.spawnEntity("mtc:ticker", ent.location)
    active_tickers.push(ticker)

    let marker0s = []
    {
        const bef_ents = pl.dimension.getEntities({ type: "mtc:marker2" })
        let n_bef_ent = 0
        for (const ent of bef_ents) {
            if (ent.getDynamicProperty("mtc_owner") === owner_id) {
                n_bef_ent++
                const index = ent.getDynamicProperty("mtc_mark_index")
                marker0s[index] = ent.location
                final_remove_markers.push(ent)
            }
        }
    }

    {
        let spl_pts = []//分割架線の始点，終点，親かどうか
        {

            for (let i = 0; i < marker0s.length; i++) {
                const p1 = marker0s[i]
                let p2
                if (i < marker0s.length - 1) {
                    p2 = marker0s[i + 1]
                } else {
                    p2 = marker0s[i]
                }
                const d = dist(p1, p2)
                if (d <= pole_max_len) {
                    spl_pts.push([p1, p2, true])
                } else {
                    const n_spl = Math.ceil(d / pole_max_len)
                    for (let j = 0; j < n_spl; j++) {
                        const dx = (p2.x - p1.x) / n_spl
                        const dy = (p2.y - p1.y) / n_spl
                        const dz = (p2.z - p1.z) / n_spl
                        const p1n = { x: p1.x + dx * j, y: p1.y + dy * j, z: p1.z + dz * j }
                        const p2n = { x: p1.x + dx * (j + 1), y: p1.y + dy * (j + 1), z: p1.z + dz * (j + 1) }
                        spl_pts.push([p1n, p2n, j === 0])
                    }
                }
            }
        }

        ticker.teleport(spl_pts[0][0])
        await sleep(5)
        for (const ent of final_remove_markers) {
            ent.remove()
        }

        for (let i = 0; i < spl_pts.length; i++) {
            if (i == spl_pts.length - 1 && end_pole === false) break;
            const po1 = spl_pts[i][0]
            const po2 = spl_pts[i][1]
            const pop = spl_pts[i][2]

            let ent = undefined
            let cnt=0
            while (ent === undefined) {
                try {
                    ticker.teleport(po1)
                    await sleep(1)
                    ent = pl.dimension.spawnEntity("mtc:pole_" + name_add, po1)
                    ent.setDynamicProperty("location", po1)
                } catch (e) {
                }
                if (ent === undefined)
                    await sleep(1)
                if(cnt>=50){
                    pl.sendMessage("§cRail Spawn Error!")
                    remove_ticker(ticker)
                    return
                }
                cnt++

            }
            pl.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.setrail1" }, { "text": ` : ${Math.round((i + 1) * 100 / spl_pts.length)} ％` }] })

            let dir = { x: po2.x - po1.x, y: po2.y - po1.y, z: po2.z - po1.z }
            if (i === spl_pts.length - 1) {
                if (i === 0) {
                    dir = { x: 0, y: 0, z: 1 }
                } else {
                    const po1b = spl_pts[i - 1][0]
                    dir = { x: po1.x - po1b.x, y: po1.y - po1b.y, z: po1.z - po1b.z }
                }
            } else if (i > 0) {
                const po1b = spl_pts[i - 1][0]
                const vec1 = { x: po1.x - po1b.x, y: po1.y - po1b.y, z: po1.z - po1b.z }
                const vec2 = { x: po2.x - po1.x, y: po2.y - po1.y, z: po2.z - po1.z }
                const len1 = dist(po1, po1b)
                const len2 = dist(po1, po2)

                dir = { x: vec2.x / len2 + vec1.x / len1, y: vec2.y / len2 + vec1.y / len1, z: vec2.z / len2 + vec1.z / len1 }
            }
            let deg_org = Math.atan2(-dir.x, dir.z) * 57.29578

            const near_rails = ent.dimension.getEntities({ families: ["mtc_rail"], location: ent.location, maxDistance: 40 })
            let min_d2 = 1e30
            let min_vec
            for (const ent_r of near_rails) {
                const bz1 = ent_r.getDynamicProperty("mtc_bz_p1")
                const bz2 = ent_r.getDynamicProperty("mtc_bz_p2")
                const bz3 = ent_r.getDynamicProperty("mtc_bz_p3")
                const t = getBezierNeart(bz1, bz2, bz3, ent.location)
                const pr = getBezier(bz1, bz2, bz3, t)
                const d2 = dist2(pr, ent.location)
                if (d2 < min_d2) {
                    min_d2 = d2
                    min_vec = bezierTangent(bz1, bz2, bz3, t)
                }
            }
            if (min_d2 < 36) {
                dir = min_vec
            }


            let deg = Math.atan2(-dir.x, dir.z) * 57.29578

            if (Math.abs(deg - deg_org) >= 180) {
                deg += 360
                if (deg > 360) deg -= 360
            }
            if (Math.abs(deg - deg_org) >= 90) {
                deg += 180
                if (deg > 180) deg -= 360
            }
            const deg2 = Math.round(deg / 45) * 45
            ent.setRotation({ x: 0, y: deg2 })

            const offset = deg - deg2

            //animation info
            ent.setDynamicProperty("mtc_po_p1", po1)
            const d_p1p2=dist(po1,po2)
            if(d_p1p2<0.01){
                ent.setDynamicProperty("mtc_po_p2", rotateXZ({x:po2.x,y:po2.y,z:po2.z+1},po2,Math.sin(deg*0.0174533),Math.cos(deg*0.0174533)))
            }else{
                ent.setDynamicProperty("mtc_po_p2", po2)
            }

            if (pop) {
                ent.setDynamicProperty("mtc_pole_base_h", false)
                ent.setDynamicProperty("mtc_pole_base_deg", offset)
            } else {
                ent.setDynamicProperty("mtc_pole_base_h", true)
            }
            const p_dist = Math.ceil(dist(po1, po2) * 2)

            setState(ent, "mtc_rail_rest_rot", 20)  //強制回転階数(tick5関数で消費しながら回転)
            if (i === spl_pts.length - 1) {
                ent.setDynamicProperty("n_s", 0)
            } else {
                ent.setDynamicProperty("n_s", p_dist)
            }

            const deg_ud = Math.round(Math.atan2(po2.y - po1.y, Math.sqrt((po2.x - po1.x) ** 2 + (po2.z - po1.z) ** 2)) * 57.29578)
            ent.setDynamicProperty("s_ud", deg_ud)
            let deg_lr = Math.round(Math.atan2(-(po2.x - po1.x), po2.z - po1.z) * 57.29578 - deg2)
            if (deg_lr < -180) deg_lr += 360
            if (deg_lr > 180) deg_lr -= 360
            deg_lr = Math.min(63, Math.max(-63, deg_lr))
            ent.setDynamicProperty("s_lr", deg_lr)
        }
    }

    remove_ticker(ticker)
    pl.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.setrailok" }] })

}

async function setRail(ent, pl, rail_type, tlm, vrail, joint, tunnel = false, dl = 0, dr = 0, du = 0, dd = 0, rani_off = false, po_sel = 0) {
    const name_add = rail_types[rail_type]

    const rail_max_len = 16

    const owner_id = ent.getDynamicProperty("mtc_owner")
    let init_ent
    let y_offset// = 0.68      //線路高さオフセット
    let init_y1             //初期高さ
    let init_offert = 0     //初期角オフセット

    let final_remove_markers = []

    const ticker = ent.dimension.spawnEntity("mtc:ticker", ent.location)
    active_tickers.push(ticker)


    let marker0s = []
    {
        const bef_ents = pl.dimension.getEntities({ type: "mtc:marker0" })
        for (const ent of bef_ents) {
            if (ent.getDynamicProperty("mtc_owner") === owner_id) {
                const index = ent.getDynamicProperty("mtc_mark_index")
                marker0s[index] = ent.location
                final_remove_markers.push(ent)
            }
        }
    }
    //位置重複削除
    /*
    for(let i=1;i<marker0s.length;i++){
        let trg_old=i-1
        while(trg_old>=0 && marker0s[trg_old]===undefined)trg_old--;
        if(trg_old>=0){
            let d=dist(marker0s[trg_old],marker0s[i])
            if(d<0.5){
                marker0s[i]=undefined
            }
        }
    }
    marker0s=marker0s.filter(number => number !== undefined);
    */

    let marker2s = [marker0s[0]]
    let n_bef_ent2 = 1
    {
        const bef_ents = pl.dimension.getEntities({ type: "mtc:marker1" })
        for (const ent of bef_ents) {
            if (ent.getDynamicProperty("mtc_owner") === owner_id) {
                n_bef_ent2++
                const index = ent.getDynamicProperty("mtc_mark_index")
                marker2s[index] = ent.location
                final_remove_markers.push(ent)
            }
        }
    }
    //位置重複削除
    /*
    for(let i=1;i<marker2s.length;i++){
        let trg_old=i-1
        while(trg_old>=0 && marker2s[trg_old]===undefined)trg_old--;
        if(trg_old>=0){
            let d=dist(marker2s[trg_old],marker2s[i])
            if(d<0.5){
                marker2s[i]=undefined
                n_bef_ent2--
            }
        }
    }
    marker2s=marker2s.filter(number => number !== undefined);
    */

    if(marker0s.length<2){
        pl.sendMessage({rawtext:[{"translate":"mtc:mtc.warn.no_marker1"}]})
        remove_ticker(ticker)
        return
    }


    // 折れ曲がったポイント警告
    /*
    if(marker0s.length>=2 && marker2s.length>=2){
        {
            let d1,d2
            let vec1,vec2
            d1=dist(marker0s[0],marker0s[1])
            d2=dist(marker2s[0],marker2s[1])
            vec1={x:marker0s[1].x,y:marker0s[1].y,z:marker0s[1].z}
            vec2={x:marker2s[1].x,y:marker2s[1].y,z:marker2s[1].z}
            vec1.x=(vec1.x-marker0s[0].x)/d1
            vec1.y=(vec1.y-marker0s[0].y)/d1
            vec1.z=(vec1.z-marker0s[0].z)/d1
            vec2.x=(vec2.x-marker2s[0].x)/d2
            vec2.y=(vec2.y-marker2s[0].y)/d2
            vec2.z=(vec2.z-marker2s[0].z)/d2
            let dot_prod=(vec1.x*vec2.x + vec1.y*vec2.y + vec1.z*vec2.z)
            
            if(dot_prod<=0){
                pl.sendMessage({rawtext:[{"translate":"mtc:mtc.warn.no_marker2"}]})
                remove_ticker(ticker)
                return
            }
            
            if(dot_prod<0.9999){
                let target_length = d2 * dot_prod * 0.5
                if(target_length<0.5)target_length=0.5;
                console.log(target_length)
                marker2s.splice(1,0,{x:marker0s[0].x+vec1.x*target_length,y:marker0s[0].y+vec1.y*target_length,z:marker0s[0].z+vec1.z*target_length})
                n_bef_ent2++
            }
        }
    }
    */

    let init_p1_bz

    {
        let spl_bzs = []
        {
            const bzs = splitBezier(marker0s)
            init_p1_bz = bzs[0]
            let j_len = undefined
            if (n_bef_ent2 > 1) {
                //ポイント向けに分岐の長さ調整
                const bzs = splitBezier(marker2s)
                let t
                for (t = 0; t <= 1; t += 0.001) {
                    const p_now = getBezier(bzs[0][0], bzs[0][1], bzs[0][2], t)
                    const t_near = getBezierNeart(init_p1_bz[0], init_p1_bz[1], init_p1_bz[2], p_now)
                    const p_near = getBezier(init_p1_bz[0], init_p1_bz[1], init_p1_bz[2], t_near)
                    const d = dist(p_now, p_near)
                    if (d >= 0.5) break
                }
                j_len = Math.min(rail_max_len, bezierLength(bzs[0][0], bzs[0][1], bzs[0][2], 0, t))
            }
            for (let i = 0; i < bzs.length; i++) {
                const bz = bzs[i]
                if (i === 0 && j_len !== undefined) {
                    spl_bzs = spl_bzs.concat(splitBezierDist(bz[0], bz[1], bz[2], rail_max_len, j_len))
                } else {
                    spl_bzs = spl_bzs.concat(splitBezierDist(bz[0], bz[1], bz[2], rail_max_len))
                }
            }
        }

        ticker.teleport(spl_bzs[0][0])
        await sleep(5)
        for (const ent of final_remove_markers) {
            ent.remove()
        }

        let bef_po_len = 0
        for (let i = 0; i < spl_bzs.length; i++) {
            const bz = spl_bzs[i]
            let ent = undefined
            let cnt = 0
            while (ent === undefined) {
                try {
                    ticker.teleport(bz[0])
                    await sleep(1)
                    if (i === 0 && n_bef_ent2 > 1) {
                        ent = pl.dimension.spawnEntity("mtc:rail2_" + name_add, bz[0])
                    } else {
                        ent = pl.dimension.spawnEntity("mtc:rail_" + name_add, bz[0])
                    }
                    ent.setDynamicProperty("location", bz[0])
                } catch (e) {
                }
                if (ent === undefined) await sleep(1);
                if(cnt>=50){
                    pl.sendMessage("§cRail Spawn Error!")
                    remove_ticker(ticker)
                    return
                }
                cnt++
            }
            pl.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.setrail1" }, { "text": ` : ${Math.round((i + 1) * 100 / spl_bzs.length)} ％` }] })

            if (i === 0)
                init_ent = ent

            /*
            let comp_variant = ent.getComponent("minecraft:variant")
            if (comp_variant !== undefined) {
                y_offset = comp_variant.value * 0.01
            }
            */
            y_offset = getRailOffset(ent)

            let bz1 = { x: bz[0].x, y: bz[0].y + y_offset, z: bz[0].z }
            let bz2 = { x: bz[1].x, y: bz[1].y + y_offset, z: bz[1].z }
            let bz3 = { x: bz[2].x, y: bz[2].y + y_offset, z: bz[2].z }
            ent.setDynamicProperty("mtc_bz_p1", bz1)
            ent.setDynamicProperty("mtc_bz_p2", bz2)
            ent.setDynamicProperty("mtc_bz_p3", bz3)
            if (i === 0 && n_bef_ent2 > 1) {
                ent.setDynamicProperty("mtc_bz1_p1", bz1)
                ent.setDynamicProperty("mtc_bz1_p2", bz2)
                ent.setDynamicProperty("mtc_bz1_p3", bz3)
            }
            ent.setDynamicProperty("mtc_tlm", tlm)
            ent.setDynamicProperty("mtc_vrail", vrail)
            ent.setDynamicProperty("mtc_joint", joint)

            if (!rani_off) ent.setDynamicProperty("mtc_pani_off", 1);

            if (tunnel) {
                await sleep(5)
                makeTunnel(ent.dimension, bz[0], bz[1], bz[2], dl, dr, du, dd)
            }

            const dir = bezierTangent(bz1, bz2, bz3, 0)
            const deg = Math.atan2(-dir.x, dir.z) * 57.29578
            const deg2 = Math.round(deg / 45) * 45
            ent.setRotation({ x: 0, y: deg2 })
            const offset = deg - deg2
            if (i === 0)
                init_offert = offset

            //animation info
            const bz_len = bezierLength(bz1, bz2, bz3, 0, 1)
            const n_sec = Math.ceil(bz_len * 2)
            const over = Math.ceil(bz_len * 2) / 2 - bz_len
            let degs_y = []
            let degs_x = []
            const dir_first = bezierTangent(bz1, bz2, bz3, 0)
            let stack_y = Math.atan2(-dir_first.x, dir_first.z) * 57.29578 - offset
            let stack_x = 0
            if (i === 0)
                init_y1 = stack_y

            let rail_head = { x: bz1.x, y: bz1.y, z: bz1.z }

            for (let j = 0; j < n_sec; j++) {
                let t = 0.5
                let df = 0.25
                if (j == n_sec - 1) {
                    t = 1
                } else {
                    for (let i = 0; i < 32; i++) {
                        const d = bezierLength(bz1, bz2, bz3, 0, t)
                        if (d > (j + 1) * rail_unit_size) {
                            t -= df
                        } else {
                            t += df
                        }
                        df *= 0.5
                    }
                }
                const tpos = getBezier(bz1, bz2, bz3, t)
                let deg_y = Math.round(Math.atan2(-(tpos.x - rail_head.x), (tpos.z - rail_head.z)) * 57.29578 - stack_y)
                if (deg_y > 180)
                    deg_y -= 360
                if (deg_y < -180)
                    deg_y += 360
                let deg_x = Math.round(Math.atan2((tpos.y - rail_head.y), Math.sqrt((tpos.z - rail_head.z) ** 2 + (tpos.x - rail_head.x) ** 2)) * 57.29578 - stack_x)


                if (j == n_sec - 1) {
                    const dir = bezierTangent(bz1, bz2, bz3, t)
                    deg_y = Math.round(Math.atan2(-dir.x, dir.z) * 57.29578 - stack_y)
                    if (deg_y > 180)
                        deg_y -= 360
                    if (deg_y < -180)
                        deg_y += 360
                    deg_x = Math.round(Math.atan2(dir.y, Math.sqrt(dir.z ** 2 + dir.x ** 2)) * 57.29578 - stack_x)
                }

                degs_y.push(deg_y)
                degs_x.push(deg_x)
                stack_y += deg_y
                stack_x += deg_x

                let step = rail_unit_size
                if (j == n_sec - 1)
                    step = rail_unit_size - over

                rail_head.y += step * Math.sin(stack_x * 0.0174533)
                const hy_r = Math.cos(stack_x * 0.0174533)
                rail_head.z += hy_r * step * Math.cos(stack_y * 0.0174533)
                rail_head.x -= hy_r * step * Math.sin(stack_y * 0.0174533)
            }

            setState(ent, "mtc_rail_rest_rot", 20)  //強制回転階数(tick5関数で消費しながら回転)
            if (n_sec === 0) {
                ent.setDynamicProperty("n_s", 1)
                ent.setDynamicProperty(`s1_lr`, 0)
                ent.setDynamicProperty(`s1_ud`, 0)
            } else {
                ent.setDynamicProperty("n_s", n_sec)
            }
            for (let j = 0; j < n_sec; j++) {
                const deg_y = degs_y[j]
                const deg_x = degs_x[j]
                ent.setDynamicProperty(`s${j + 1}_lr`, deg_y)
                ent.setDynamicProperty(`s${j + 1}_ud`, deg_x)
            }
            if (!(i === 0 && n_bef_ent2 > 1)) {
                applyRail2(ent)
            }
        }
    }

    if (n_bef_ent2 > 1) {
        {
            let spl_bzs = []
            {
                const bzs = splitBezier(marker2s)

                //ポイント向けに分岐の長さ調整
                let t
                for (t = 0; t <= 1; t += 0.001) {
                    const p_now = getBezier(bzs[0][0], bzs[0][1], bzs[0][2], t)
                    const t_near = getBezierNeart(init_p1_bz[0], init_p1_bz[1], init_p1_bz[2], p_now)
                    const p_near = getBezier(init_p1_bz[0], init_p1_bz[1], init_p1_bz[2], t_near)
                    const d = dist(p_now, p_near)
                    if (d >= 0.3) break
                }
                const j_len = Math.min(rail_max_len, bezierLength(bzs[0][0], bzs[0][1], bzs[0][2], 0, t))

                for (let i = 0; i < bzs.length; i++) {
                    const bz = bzs[i]
                    if (i === 0) {
                        spl_bzs = spl_bzs.concat(splitBezierDist(bz[0], bz[1], bz[2], rail_max_len, j_len))
                    } else {
                        spl_bzs = spl_bzs.concat(splitBezierDist(bz[0], bz[1], bz[2], rail_max_len))
                    }
                }
            }

            let bef_po_len = 0
            for (let i = 0; i < spl_bzs.length; i++) {
                const bz = spl_bzs[i]
                let ent = undefined
                let cnt=0
                if (i === 0) {
                    ent = init_ent
                } else {
                    while (ent === undefined) {
                        try {
                            ticker.teleport(bz[0])
                            await sleep(1)
                            ent = pl.dimension.spawnEntity("mtc:rail_" + name_add, bz[0])
                            ent.setDynamicProperty("location", bz[0])
                        } catch (e) {
                        }
                        if (ent === undefined)
                            await sleep(1)
                        if(cnt>=50){
                            pl.sendMessage("§cRail Spawn Error!")
                            remove_ticker(ticker)
                            return
                        }
                        cnt++
                    }

                }
                pl.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.setrail2" }, { "text": ` : ${Math.round((i + 1) * 100 / spl_bzs.length)} ％` }] })

                /*
                let comp_variant = ent.getComponent("minecraft:variant")
                if (comp_variant !== undefined) {
                    y_offset = comp_variant.value * 0.01
                }
                */
                y_offset = getRailOffset(ent)

                let bz1 = { x: bz[0].x, y: bz[0].y + y_offset, z: bz[0].z }
                let bz2 = { x: bz[1].x, y: bz[1].y + y_offset, z: bz[1].z }
                let bz3 = { x: bz[2].x, y: bz[2].y + y_offset, z: bz[2].z }

                let offset
                if (i === 0) {
                    ent.setDynamicProperty("mtc_bz2_p1", bz1)
                    ent.setDynamicProperty("mtc_bz2_p2", bz2)
                    ent.setDynamicProperty("mtc_bz2_p3", bz3)
                    offset = init_offert
                } else {
                    ent.setDynamicProperty("mtc_bz_p1", bz1)
                    ent.setDynamicProperty("mtc_bz_p2", bz2)
                    ent.setDynamicProperty("mtc_bz_p3", bz3)
                    ent.setDynamicProperty("mtc_tlm", tlm)
                    ent.setDynamicProperty("mtc_vrail", vrail)
                    ent.setDynamicProperty("mtc_joint", joint)

                    const dir = bezierTangent(bz1, bz2, bz3, 0)
                    const deg = Math.atan2(-dir.x, dir.z) * 57.29578
                    const deg2 = Math.round(deg / 45) * 45
                    ent.setRotation({ x: 0, y: deg2 })
                    offset = deg - deg2
                }

                if (!rani_off) ent.setDynamicProperty("mtc_pani_off", 1);


                if (tunnel) {
                    await sleep(5)
                    makeTunnel(ent.dimension, bz[0], bz[1], bz[2], dl, dr, du, dd)
                }

                //animation info
                const bz_len = bezierLength(bz1, bz2, bz3, 0, 1)
                const n_sec = Math.ceil(bz_len * 2)
                const over = Math.ceil(bz_len * 2) / 2 - bz_len
                let degs_y = []
                let degs_x = []
                const dir_first = bezierTangent(bz1, bz2, bz3, 0)
                let stack_y = Math.atan2(-dir_first.x, dir_first.z) * 57.29578 - offset
                let stack_x = 0
                let diff = stack_y - init_y1
                if (diff > 180)
                    diff -= 360
                if (diff < -180)
                    diff += 360
                if (i === 0)
                    stack_y -= diff

                let rail_head = { x: bz1.x, y: bz1.y, z: bz1.z }

                for (let j = 0; j < n_sec; j++) {
                    let t = 0.5
                    let df = 0.25
                    if (j == n_sec - 1) {
                        t = 1
                    } else {
                        for (let i = 0; i < 32; i++) {
                            const d = bezierLength(bz1, bz2, bz3, 0, t)
                            if (d > (j + 1) * rail_unit_size) {
                                t -= df
                            } else {
                                t += df
                            }
                            df *= 0.5
                        }
                    }

                    const tpos = getBezier(bz1, bz2, bz3, t)
                    let deg_y = Math.round(Math.atan2(-(tpos.x - rail_head.x), (tpos.z - rail_head.z)) * 57.29578 - stack_y)
                    if (deg_y > 180)
                        deg_y -= 360
                    if (deg_y < -180)
                        deg_y += 360
                    let deg_x = Math.round(Math.atan2((tpos.y - rail_head.y), Math.sqrt((tpos.z - rail_head.z) ** 2 + (tpos.x - rail_head.x) ** 2)) * 57.29578 - stack_x)

                    if (j == n_sec - 1) {
                        const dir = bezierTangent(bz1, bz2, bz3, t)
                        deg_y = Math.round(Math.atan2(-dir.x, dir.z) * 57.29578 - stack_y)
                        if (deg_y > 180)
                            deg_y -= 360
                        if (deg_y < -180)
                            deg_y += 360
                        deg_x = Math.round(Math.atan2(dir.y, Math.sqrt(dir.z ** 2 + dir.x ** 2)) * 57.29578 - stack_x)
                    }

                    degs_y.push(deg_y)
                    degs_x.push(deg_x)
                    stack_y += deg_y
                    stack_x += deg_x

                    let step = rail_unit_size
                    if (j == n_sec - 1)
                        step = rail_unit_size - over

                    rail_head.y += step * Math.sin(stack_x * 0.0174533)
                    const hy_r = Math.cos(stack_x * 0.0174533)
                    rail_head.z += hy_r * step * Math.cos(stack_y * 0.0174533)
                    rail_head.x -= hy_r * step * Math.sin(stack_y * 0.0174533)
                }

                setState(ent, "mtc_rail_rest_rot", 20)  //強制回転階数(tick5関数で消費しながら回転)

                if (i === 0) {
                    if (n_sec === 0) {
                        ent.setDynamicProperty("n_p2s", 1)
                        ent.setDynamicProperty(`p2s1_lr`, 0)
                        ent.setDynamicProperty(`p2s1_ud`, 0)
                    } else {
                        ent.setDynamicProperty("n_p2s", n_sec)
                    }

                    for (let j = 0; j < n_sec; j++) {
                        const deg_y = degs_y[j]
                        const deg_x = degs_x[j]
                        ent.setDynamicProperty(`p2s${j + 1}_lr`, deg_y)
                        ent.setDynamicProperty(`p2s${j + 1}_ud`, deg_x)
                    }
                } else {
                    if (n_sec === 0) {
                        ent.setDynamicProperty("n_s", 1)
                        ent.setDynamicProperty(`s1_lr`, 0)
                        ent.setDynamicProperty(`s1_ud`, 0)
                    } else {
                        ent.setDynamicProperty("n_s", n_sec)
                    }

                    for (let j = 0; j < n_sec; j++) {
                        const deg_y = degs_y[j]
                        const deg_x = degs_x[j]
                        ent.setDynamicProperty(`s${j + 1}_lr`, deg_y)
                        ent.setDynamicProperty(`s${j + 1}_ud`, deg_x)
                    }
                }
                applyRail2(ent)
            }
        }

    }

    remove_ticker(ticker)
    pl.sendMessage({ rawtext: [{ "translate": "mtc:mtc.ui.setrailok" }] })

}

function command(source, command) {
    system.run(() => {
        source.runCommand("execute as \"" + source.name + "\" at @s run " + command)
    })
}

function playAni(ent, ani, con = "", ply = null) {

    if (ply === null) {
        /*
        ent.playAnimation(ani, { controller: con, nextState: ""})
        */
        const pls = ent.dimension.getEntities({ type: "player", location: ent.location, maxDistance: 77 })
        let pls_name = []
        for (const pl of pls) {
            pls_name.push(pl.name)
        }
        if (pls_name.length > 0) ent.playAnimation(ani, { controller: con, nextState: "", players: pls_name });

    } else {
        ent.playAnimation(ani, { controller: con, nextState: "", players: [ply] })
    }
}

function stopAni(ent, con = "", ply = null) {
    if (ply === null) {
        ent.playAnimation("animation.npc.general", { controller: con, nextState: "" })
    } else {
        ent.playAnimation("animation.npc.general", { controller: con, nextState: "", players: [ply] })
    }
}

//同一編成エンティティ取得
function getFormation(ent) {
    return bodies_sfs_g[ent.id]??[]
    /*
    const ents = bodies_g
    const t_fid = obj_mtc_fid.getScore(ent)
    let ret = []
    for (const ent2 of ents) {
        const fid = obj_mtc_fid.getScore(ent2)
        if (fid == t_fid) {
            ret.push(ent2)
        }
    }
    return ret
    */
}

function getSelectorEntities(selector, player) {
    const id = "ID_" + Math.floor(Math.random() * 1000000000000000);

    let err = true
    while (err) {
        try {
            player.runCommand("tag " + selector + " add " + id)
            var ents = player.dimension.getEntities({ tags: [id] })
            for (const ent of ents) {
                ent.removeTag(id)
            }
            err = false
        } catch (e) {

        }
    }
    return ents
}

function getSelectorEntities2(selector, dim) {
    const id = "ID_" + Math.floor(Math.random() * 1000000000000000);
    let err = true
    while (err) {
        try {
            dim.runCommand("tag " + selector + " add " + id)
            var ents = dim.getEntities({ tags: [id] })
            for (const ent of ents) {
                ent.removeTag(id)
            }
            err = false
        } catch (e) {

        }
    }

    return ents
}

// 席を考慮した最寄り車両クラス取得
function getNearestCar(player) {
    let player_nearcar = null
    let player_nearD = 3.4e38

    if (bodies_g.length > 0) {
        for (const ent of bodies_g) {
            const rot = ent.getRotation()
            const loc = ent.location

            const bx_ux = Math.cos(0.0174533 * rot.y) * Math.cos(0.0174533 * rot.x)
            const bx_uy = Math.sin(0.0174533 * rot.x)
            const bx_uz = -Math.sin(0.0174533 * rot.y) * Math.cos(0.0174533 * rot.x)

            const by_ux = -Math.sin(0.0174533 * rot.x) * Math.cos(0.0174533 * rot.y)
            const by_uy = Math.cos(0.0174533 * rot.x)
            const by_uz = Math.sin(0.0174533 * rot.x) * Math.sin(0.0174533 * rot.y)

            const bz_ux = Math.sin(0.0174533 * rot.y)
            const bz_uy = 0
            const bz_uz = Math.cos(0.0174533 * rot.y)

            const seats_cp = ent.getComponent("minecraft:rideable")
            let seats = []
            if (seats_cp !== undefined) seats = seats_cp.getSeats()

            for (const seat of seats) {
                const sx = loc.x + seat.position.x * bx_ux + seat.position.y * bx_uy + seat.position.z * bx_uz
                const sy = loc.y + seat.position.x * by_ux + seat.position.y * by_uy + seat.position.z * by_uz
                const sz = loc.z + seat.position.x * bz_ux + seat.position.y * bz_uy + seat.position.z * bz_uz
                const d = Math.sqrt((player.location.x - sx) ** 2 + (player.location.y - sy) ** 2 + (player.location.z - sz) ** 2)
                if (d < player_nearD) {
                    player_nearD = d
                    player_nearcar = ent
                }
            }
            const d = dist(player.location, loc)
            if (d < player_nearD) {
                player_nearD = d
                player_nearcar = ent
            }

        }
    }

    return player_nearcar
}

// trg EntityにTASCセット
function tascSet(trg, x) {
    // tascモード
    trg.addTag("mtc_tasc")
    let now = trg.getDynamicProperty("dist")
    if (now === undefined) {
        trg.setDynamicProperty("dist", 0.0)
        now = 0.0
    }
    trg.setDynamicProperty("tasc_dist", now + x)
    trg.removeTag("mtc_tasc_do")
    trg.setDynamicProperty("tasc_b_mid", (-world.scoreboard.getObjective("mtc_notBM").getScore(trg) + 1) * world.scoreboard.getObjective("mtc_accDB").getScore(trg))
}


function dist(vec1, vec2) {
    return Math.sqrt((vec1.x - vec2.x) ** 2 + (vec1.y - vec2.y) ** 2 + (vec1.z - vec2.z) ** 2)
}
function dist2(vec1, vec2) {
    return ((vec1.x - vec2.x) ** 2 + (vec1.y - vec2.y) ** 2 + (vec1.z - vec2.z) ** 2)
}
//entの音を聞かせるプレーヤー選択
function testSound(ent, ents_f = undefined,max_d=128) {
    // 車両から実行
    // 同一編成calc3=0
    const ent_clen = ent.getDynamicProperty("mtc_body_length") / 2
    if (ents_f === undefined) {
        ents_f = getFormation(ent)
    }

    for (const pl of players_g) {
        let min = 1.0e30
        for (const ent_f of ents_f) {
            if (!ent_f.hasTag("mtc_nrs")) {
                const loc = ent_f.location

                if(dist2(pl.location,loc)<max_d*max_d){

                    const roty = ent_f.getRotation().y
                    const bx_uz = -Math.sin(0.0174533 * roty)
                    const by_uz = 0
                    const bz_uz = Math.cos(0.0174533 * roty)

                    const s = {
                        x: loc.x + ent_clen * bx_uz,
                        y: loc.y + ent_clen * by_uz,
                        z: loc.z + ent_clen * bz_uz
                    }

                    const d2 = dist2(pl.location, s)
                    if (d2 < min) {
                        min = d2
                        if (ent.id === ent_f.id) {
                            obj_mtc_sid.setScore(pl, 0)
                        } else {
                            obj_mtc_sid.setScore(pl, 1)
                        }
                    }
                }
            }
        }
    }
    //ent.runCommand("execute as @a at @s run scoreboard players operation @s mtc_sid = @e[family=mtc_body,tag=!mtc_nrs,scores={mtc_calc3=0},c=1] mtc_uid")
    // 対象者のsid=0
    //ent.runCommand("scoreboard players operation @a mtc_sid -= @s mtc_uid")
}

//mtc:mtcXXXX_[car]からmtcXXXXを切り出し
function getIdBase(s) {
    let names = s.split(":")[1].split("_")
    let name = ""
    for (let i = 0; i < names.length - 2; i++) {
        name += names[i] + "_"
    }
    return name + names[names.length - 2]

}

/**
 * mode_text文法
 * ~2,4,6~8,10~ -> ~2,4,6,6,8,10~
 */
function testMode(mode_text, mode_id) {
    let res = false
    const strs = mode_text.split(",")
    for (const t of strs) {
        const spl = t.split("~")
        if (t.search("^-?[0-9]+~-?[0-9]+$") != -1) {
            if (mode_id >= Number(spl[0]) && mode_id <= Number(spl[1])) {
                res = true
                break
            }
        } else if (t.search("^~-?[0-9]+$") != -1) {
            if (mode_id <= Number(spl[1])) {
                res = true
                break
            }

        } else if (t.search("^-?[0-9]+~$") != -1) {
            if (mode_id >= Number(spl[0])) {
                res = true
                break
            }

        } else if (t.search("^-?[0-9]+$") != -1) {
            if (mode_id == Number(spl[0])) {
                res = true
                break
            }

        } else {
            world.sendMessage("§cCommand Syntax Error!")
            break
        }

    }
    return res
}

//左から始点制御点終点
function getBezier(p1, p2, p3, t) {
    return { x: (t * t * p3.x + 2 * t * (1 - t) * p2.x + (1 - t) * (1 - t) * p1.x), y: (t * t * p3.y + 2 * t * (1 - t) * p2.y + (1 - t) * (1 - t) * p1.y), z: (t * t * p3.z + 2 * t * (1 - t) * p2.z + (1 - t) * (1 - t) * p1.z) }
}

/**
 * 2次ベジェ曲線上の、ある点に最も近い点のパラメータtを求める、分かりやすく修正された関数。
 *
 * 引数の順序を直感的な「始点、制御点、終点」に統一しました。
 *
 * @param {number} p1 - 始点(t=0)の座標
 * @param {number} p2 - 制御点の座標
 * @param {number} p3 - 終点(t=1)の座標
 * @param {number} p - ターゲットの点の座標
 * @returns {number} 最も近い点に対応するパラメータt (0 <= t <= 1)
 */
function getBezierNeart(p1,p2,p3,p) {
  // --- 1. ベクトル係数の計算 ---
  // 標準的なベジェ曲線の式 P(t) = (1-t)^2*P0 + 2t(1-t)*P1 + t^2*P2
  // を、P(t) = A*t^2 + B*t + C の形に変形する。 (P0=start, P1=control, P2=end)
  const P0x = p1.x, P0y = p1.y, P0z = p1.z;
  const P1x = p2.x, P1y = p2.y, P1z = p2.z;
  const P2x = p3.x, P2y = p3.y, P2z = p3.z;
  const pointX = p.x, pointY=p.y, pointZ=p.z;

  const Ax = P0x - 2 * P1x + P2x;
  const Ay = P0y - 2 * P1y + P2y;
  const Az = P0z - 2 * P1z + P2z;

  const Bx = 2 * (P1x - P0x);
  const By = 2 * (P1y - P0y);
  const Bz = 2 * (P1z - P0z);

  // C は P0 に等しい

  // --- 2. 縮退ケース (直線) の処理 ---
  const mag_A_sq = Ax * Ax + Ay * Ay + Az * Az;
  const epsilon = 1e-6;

  if (mag_A_sq < epsilon) {
    const mag_B_sq = Bx * Bx + By * By + Bz * Bz;
    if (mag_B_sq < epsilon) return 0; // すべての点が同一
    
    const dot_B_C_minus_X = Bx * (P0x - pointX) + By * (P0y - pointY) + Bz * (P0z - pointZ);
    let t = -dot_B_C_minus_X / mag_B_sq;
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    return t;
  }

  // --- 3. 3次方程式の係数計算 ---
  const C_minus_X_x = P0x - pointX;
  const C_minus_X_y = P0y - pointY;
  const C_minus_X_z = P0z - pointZ;

  const dot_A_B = Ax * Bx + Ay * By + Az * Bz;
  const dot_A_C_minus_X = Ax * C_minus_X_x + Ay * C_minus_X_y + Az * C_minus_X_z;
  const dot_B_B = Bx * Bx + By * By + Bz * Bz;
  const dot_B_C_minus_X = Bx * C_minus_X_x + By * C_minus_X_y + Bz * C_minus_X_z;

  const c3 = 2 * mag_A_sq;
  const c2 = 3 * dot_A_B;
  const c1 = 2 * dot_A_C_minus_X + dot_B_B;
  const c0 = dot_B_C_minus_X;

  // --- 4. 3次方程式の解法 (インライン化) ---
  let roots = [];
  let a = c3, b = c2, c = c1, d = c0;
  if (Math.abs(a) < 1e-8) { if (Math.abs(b) < 1e-8) { if (Math.abs(c) < 1e-8) {} else { roots.push(-d / c); } } else { const D = c * c - 4 * b * d; if (Math.abs(D) < 1e-8) { roots.push(-c / (2 * b)); } else if (D > 0) { roots.push((-c + Math.sqrt(D)) / (2 * b), (-c - Math.sqrt(D)) / (2 * b)); } } } else { const p = (3 * a * c - b * b) / (3 * a * a); const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a); if (Math.abs(p) < 1e-8) { roots.push(Math.cbrt(-q)); } else if (Math.abs(q) < 1e-8) { if (p < 0) { roots.push(0, Math.sqrt(-p), -Math.sqrt(-p)); } else { roots.push(0); } } else { const D = q * q / 4 + p * p * p / 27; if (Math.abs(D) < 1e-8) { roots.push(-1.5 * q / p, 3 * q / p); } else if (D > 0) { const u = Math.cbrt(-q / 2 + Math.sqrt(D)); roots.push(u - p / (3 * u)); } else { const u = 2 * Math.sqrt(-p / 3); const t_angle = Math.acos(3 * q / p / u) / 3; const k = 2 * Math.PI / 3; roots.push(u * Math.cos(t_angle), u * Math.cos(t_angle - k), u * Math.cos(t_angle + k)); } } const B_factor = b / (3 * a); for (let i = 0; i < roots.length; i++) { roots[i] -= B_factor; } }

  // --- 5. 最短距離のtを探索 ---
  const candidates = [0, 1];
  for (let i = 0; i < roots.length; i++) {
    const t = roots[i];
    if (t > 0 && t < 1) {
      candidates.push(t);
    }
  }

  let minDistanceSq = -1;
  let closestT = 0;

  for (let i = 0; i < candidates.length; i++) {
    const t = candidates[i];
    
    // P(t) = A*t^2 + B*t + C (=P0) を計算
    const px = Ax * t * t + Bx * t + P0x;
    const py = Ay * t * t + By * t + P0y;
    const pz = Az * t * t + Bz * t + P0z;

    const dx = px - pointX, dy = py - pointY, dz = pz - pointZ;
    const distanceSq = dx * dx + dy * dy + dz * dz;

    if (minDistanceSq < 0 || distanceSq < minDistanceSq) {
      minDistanceSq = distanceSq;
      closestT = t;
    }
  }

  return closestT;
}

//左から始点制御点終点
//t0<=t1
function bezierLength(p0, p1, p2, t0, t1) {

    //直線検出
    const va1 = p1.x - p0.x
    const va2 = p1.y - p0.y
    const va3 = p1.z - p0.z
    const vb1 = p2.x - p1.x
    const vb2 = p2.y - p1.y
    const vb3 = p2.z - p1.z
    const del = Math.abs(va2 * vb3 - va3 * vb2) + Math.abs(va3 * vb1 - vb3 * va1) + Math.abs(va1 * vb2 - vb1 * va2)

    if (del < 0.001) {
        p1.x = (p0.x + p2.x) / 2
        p1.y = (p0.y + p2.y) / 2
        p1.z = (p0.z + p2.z) / 2
    }

    const u0 = p0.x - p1.x
    const v0 = p0.y - p1.y
    const w0 = p0.z - p1.z
    const u1 = p0.x - 2 * p1.x + p2.x
    const v1 = p0.y - 2 * p1.y + p2.y
    const w1 = p0.z - 2 * p1.z + p2.z

    const a = u1 ** 2 + v1 ** 2 + w1 ** 2
    const b = u1 * u0 + v1 * v0 + w1 * w0
    const c = u0 ** 2 + v0 ** 2 + w0 ** 2
    const d = a * c - b ** 2

    let l = 0

    if (a > 1e-3) {
        if (d > 1e-3) {
            const x1 = (a * t1 - b) / Math.sqrt(d)
            const x0 = (a * t0 - b) / Math.sqrt(d)
            l = d * ((Math.log(x1 + Math.sqrt(x1 ** 2 + 1)) + x1 * Math.sqrt(x1 ** 2 + 1)) - (Math.log(x0 + Math.sqrt(x0 ** 2 + 1)) + x0 * Math.sqrt(x0 ** 2 + 1))) / (a * Math.sqrt(a))
        } else {
            l = ((a * t1 - b) * Math.abs((a * t1 - b)) - (a * t0 - b) * Math.abs((a * t0 - b))) / (a * Math.sqrt(a))
        }
    } else {
        l = 2 * Math.sqrt(c) * (t1 - t0)
    }
    return l
}

//接線
function bezierTangent(p1, p2, p3, t) {
    const v1x = (1 - t) * p1.x + t * p2.x
    const v1y = (1 - t) * p1.y + t * p2.y
    const v1z = (1 - t) * p1.z + t * p2.z
    const v2x = (1 - t) * p2.x + t * p3.x
    const v2y = (1 - t) * p2.y + t * p3.y
    const v2z = (1 - t) * p2.z + t * p3.z
    return { x: v2x - v1x, y: v2y - v1y, z: v2z - v1z }
}

function splitBezier(points) {
    const n_points = points.length

    if (n_points == 1) {
        return [[points[0], points[0], points[0]]]
    } else if (n_points == 2) {
        const c = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2, z: (points[0].z + points[1].z) / 2 }
        return [[points[0], c, points[1]]]
    } else if (n_points == 3) {
        return [[points[0], points[1], points[2]]]
    } else {
        let p1 = points[0]
        let p2 = { x: (points[1].x + points[2].x) / 2, y: (points[1].y + points[2].y) / 2, z: (points[1].z + points[2].z) / 2 }
        let res = [[p1, points[1], p2]]
        for (let i = 0; i < n_points - 4; i++) {
            p1 = p2
            p2 = { x: (points[i + 2].x + points[i + 3].x) / 2, y: (points[i + 2].y + points[i + 3].y) / 2, z: (points[i + 2].z + points[i + 3].z) / 2 }
            res.push([p1, points[i + 2], p2])
        }
        p1 = p2
        res.push([p1, points[n_points - 2], points[n_points - 1]])
        return res
    }
}

function splitBezierDist(p1, p2, p3, max_len, j_len = undefined) {

    //直線検出
    const va1 = p2.x - p1.x
    const va2 = p2.y - p1.y
    const va3 = p2.z - p1.z
    const vb1 = p3.x - p2.x
    const vb2 = p3.y - p2.y
    const vb3 = p3.z - p2.z
    const del = Math.abs(va2 * vb3 - va3 * vb2) + Math.abs(va3 * vb1 - vb3 * va1) + Math.abs(va1 * vb2 - vb1 * va2)

    if (del < 0.001) {
        p2.x = (p1.x + p3.x) / 2
        p2.y = (p1.y + p3.y) / 2
        p2.z = (p1.z + p3.z) / 2
    }


    let min_len = max_len
    if (j_len !== undefined) min_len = j_len
    let splits = []
    const org_len = bezierLength(p1, p2, p3, 0, 1)
    if (org_len <= min_len) {
        splits.push([p1, p2, p3])
    } else {
        let n_split
        let new_len
        if (j_len === undefined) {
            n_split = Math.ceil(org_len / max_len)
            new_len = org_len / n_split
        } else {
            n_split = Math.ceil((org_len - j_len) / max_len) + 1
            new_len = (org_len - j_len) / (n_split - 1)
        }

        let new_len2
        for (let i = 0; i < n_split - 1; i++) {
            if (i == 0 && j_len !== undefined) {
                new_len2 = j_len
            } else {
                new_len2 = new_len
            }
            let t = 0.5
            let df = 0.25
            for (let i = 0; i < 32; i++) {
                const d = bezierLength(p1, p2, p3, 0, t)
                if (d > new_len2) {
                    t -= df
                } else {
                    t += df
                }
                df *= 0.5
            }


            const new_p2 = { x: p2.x * t + p1.x * (1 - t), y: p2.y * t + p1.y * (1 - t), z: p2.z * t + p1.z * (1 - t) }
            const new_p3 = getBezier(p1, p2, p3, t)

            splits.push([p1, new_p2, new_p3])

            p1 = new_p3
            p2 = { x: p3.x * t + p2.x * (1 - t), y: p3.y * t + p2.y * (1 - t), z: p3.z * t + p2.z * (1 - t) }
        }
        //最後の1線
        splits.push([p1, p2, p3])
    }
    return splits
}

function warnVec3(p) {
    console.warn("Vec3 : " + p.x + ", " + p.y + ", " + p.z)
}


//載っているかの判定まで行う
function trace_newrail(ent, ent_f) {
    //const ent_f = getFormation(ent)
    let tilt_ud = 0
    let n_tilt_ud = 0
    for (const ent of ent_f) {
        const ret = trace_newrail2(ent)
        if (ret !== undefined) {
            tilt_ud += ret
            n_tilt_ud++
        }
    }
    if (n_tilt_ud > 0) {
        tilt_ud /= n_tilt_ud
    }
    let sign = 1
    if (ent.hasTag("mtc_rev")) {
        sign *= -1
    }

    let acc = Math.abs(17640 * Math.sin(tilt_ud * 0.0174533))
    if (tilt_ud > 0) {
        obj_mtc_gradacc.setScore(ent, -sign * acc)
    } else {
        obj_mtc_gradacc.setScore(ent, sign * acc)
    }
}

function trace_newrail2(ent) {
    //const tilt_mode = (world.getDynamicProperty("mtc_tilt") === 1)
    let body_vec = undefined
    let head_vec = undefined
    let search_b = false
    let search_h = false
    let tilt_ud = undefined
    if (!ent.hasTag("mtc_on_newrail_b")) {
        //body,head両方独立で線路上にいるか確認
        // いなければレール追従探索
        const loc = ent.location
        const rot = ent.getRotation()

        const on_rail = testOnRail(ent, { x: loc.x, y: loc.y + 1, z: loc.z }, rot)
        if (!on_rail) {
            search_b = true
            ent.addTag("mtc_on_newrail_b")
        } else {
            setState(ent, "mtc_railb_rot", undefined)
            setState(ent, "mtc_railb_nearest", undefined)
        }
    }
    //if (!ent.hasTag("mtc_on_newrail_h") && (ent.hasTag("mtc_parent") || tilt_mode)) {
    if (!ent.hasTag("mtc_on_newrail_h")) {
        //body,head両方独立で線路上にいるか確認
        // いなければレール追従探索
        const loc = ent.location
        let deg = ent.getRotation().y
        const def_d_length = ent.getDynamicProperty("mtc_d_length")

        const rot = { x: 0, y: deg }
        const bx_uz = -Math.sin(0.0174533 * deg)
        const by_uz = 0
        const bz_uz = Math.cos(0.0174533 * deg)

        const sx = loc.x + def_d_length * bx_uz
        const sy = loc.y + def_d_length * by_uz + 2
        const sz = loc.z + def_d_length * bz_uz
        const head_loc = { x: sx, y: sy, z: sz }
        const on_rail = testOnRail(ent, head_loc, rot)
        if (!on_rail) {
            search_h = true
            ent.addTag("mtc_on_newrail_h")
        } else {
            setState(ent, "mtc_railh_rot", undefined)
            setState(ent, "mtc_railh_nearest", undefined)
        }
    }

    let bp = undefined
    let bt, bp1, bp2, bp3
    if (ent.hasTag("mtc_on_newrail_b")) {
        let p1, p2, p3, tlm, vrail, t, p, d2, d22, joint, rail2
        let old_deg = undefined
        let old_pos = undefined
        let loc = ent.location
        const rot_y = ent.getRotation().y
        let dd_len = 0
        const db_length = ent.getDynamicProperty("mtc_d_length")
        if (db_length !== undefined) {
            const dbody_length = ent.getDynamicProperty("mtc_body_length")
            if (dbody_length !== undefined) {
                dd_len = dbody_length - db_length
                if (dd_len > db_length - 1) dd_len = db_length - 1
                if (dd_len < 0) dd_len = 0;
            }
        }
        const dz = dd_len * Math.cos(rot_y * 0.0174533)
        const dx = -dd_len * Math.sin(rot_y * 0.0174533)
        let dy = 0
        const deg_x = getState(ent, "mtc_tilt_x")
        if (deg_x !== undefined) {
            dy = dd_len * Math.sin(deg_x * 0.0174533)
        }

        loc.z += dz
        loc.x += dx
        loc.y += dy

        if (!search_b) {
            p1 = ent.getDynamicProperty("mtc_body_p1")
            if (p1 === undefined) {
                search_b = true
            } else {
                p2 = ent.getDynamicProperty("mtc_body_p2")
                p3 = ent.getDynamicProperty("mtc_body_p3")
                tlm = ent.getDynamicProperty("mtc_body_tlm")
                vrail = ent.getDynamicProperty("mtc_body_vrail")
                joint = ent.getDynamicProperty("mtc_joint")
                t = getBezierNeart(p1, p2, p3, loc)

                let t2
                if (t < 0.5) t2 = 0
                if (t >= 0.5) t2 = 1
                const vec = bezierTangent(p1, p2, p3, t2)
                old_deg = Math.atan2(-vec.x, vec.z) * 57.29578
                setState(ent, "mtc_railb_rot", old_deg)
                setState(ent, "mtc_railb_nearest", t<0.5?p1:p3)
            }
        }

        if (t === 0 || t === 1 || search_b) {
            const rails = ent.dimension.getEntities({ families: ["mtc_rail"], location: loc, maxDistance: 20 })
            d2 = 1e30
            d22 = 1e30
            let found = false
            for (const rail of rails) {
                const p1x = rail.getDynamicProperty("mtc_bz_p1")
                const p2x = rail.getDynamicProperty("mtc_bz_p2")
                const p3x = rail.getDynamicProperty("mtc_bz_p3")
                const tlmx = rail.getDynamicProperty("mtc_tlm")
                const jointx = rail.getDynamicProperty("mtc_joint")
                const vrailx = rail.getDynamicProperty("mtc_vrail")
                const tx = getBezierNeart(p1x, p2x, p3x, loc)

                const px = getBezier(p1x, p2x, p3x, tx)
                const d2x = dist(loc, px)
                const dh = Math.abs(loc.y - px.y)
                let d2x2 = d2x
                old_pos = getState(ent, "mtc_railb_nearest")
                if (old_pos !== undefined && tx !== 0 && tx !== 1) {
                    let ds = Math.min(dist(old_pos, p1x),dist(old_pos, p3x))
                    if (ds<0.2)d2x2=-10+d2x;
                }

                old_deg = getState(ent, "mtc_railb_rot")
                if (old_deg !== undefined) {
                    let tx2
                    if (tx < 0.5) tx2 = 0
                    if (tx >= 0.5) tx2 = 1
                    const vec = bezierTangent(p1x, p2x, p3x, tx2)
                    let deg_diff = old_deg - Math.atan2(-vec.x, vec.z) * 57.29578
                    if (deg_diff < -180) deg_diff += 360
                    if (deg_diff > 180) deg_diff -= 360
                    if (deg_diff < -90) deg_diff += 180
                    if (deg_diff > 90) deg_diff -= 180
                    deg_diff=Math.abs(deg_diff)
                    if(deg_diff<1){
                        d2x2 += deg_diff * 1
                    }else{
                        d2x2 += 1 + (deg_diff-1) * 0.001//10
                    }
                }

                if (d2x2 < d22 && /*tx !== 0 && tx !== 1 &&*/ dh < 5) {
                    d22 = d2x2
                    d2 = d2x
                    p1 = p1x
                    p2 = p2x
                    p3 = p3x
                    tlm = tlmx
                    vrail = vrailx
                    joint = jointx
                    t = tx
                    p = px
                    rail2=rail
                    found = true
                }
            }
            if (found) {
                ent.setDynamicProperty("mtc_body_p1", p1)
                ent.setDynamicProperty("mtc_body_p2", p2)
                ent.setDynamicProperty("mtc_body_p3", p3)
                ent.setDynamicProperty("mtc_body_tlm", tlm)
                ent.setDynamicProperty("mtc_body_vrail", vrail)
                ent.setDynamicProperty("mtc_joint", joint)
                const fmls=rail2.getComponent("minecraft:type_family")?.getTypeFamilies()??[]
                let jname=undefined
                for(const fml of fmls){
                    if(fml.slice(0,10)=="mtc_joint="){
                        jname=fml.slice(10)
                        break
                    }
                }
                setState(ent,"mtc_jname_b",jname)
            }
        } else {
            p = getBezier(p1, p2, p3, t)
            d2 = dist2(loc, p)
        }


        let rot = ent.getRotation()
        if (!((t === 0 || t === 1) && d2 > 0) && d2 < 5) {
            body_vec = bezierTangent(p1, p2, p3, t)
            p.z -= dz
            p.x -= dx
            p.y -= dy
            ent.teleport(p)
            bp = p
            bt = t
            bp1 = p1
            bp2 = p2
            bp3 = p3
        } else {
            //線路に戻るときに角度を3°単位に戻す
            rot.y = Math.round(rot.y / 3) * 3
            ent.teleport(ent.location, { rotation: rot })
            //ent.setRotation(rot)
            ent.removeTag("mtc_on_newrail_b")
            ent.setDynamicProperty("mtc_joint", 0)
            setState(ent,"mtc_jname_b",undefined)
        }
    }

//    if (!tilt_mode) setState(ent, "midcar_trace_deg", undefined);
    setState(ent, "midcar_trace_deg", undefined);
    //if (ent.hasTag("mtc_on_newrail_h") && (ent.hasTag("mtc_parent") || tilt_mode)) {//&& ent.hasTag("mtc_parent")
    if (ent.hasTag("mtc_on_newrail_h")) {//&& ent.hasTag("mtc_parent")

        //head
        const loc = ent.location
        let deg = ent.getRotation().y
        let def_d_length = ent.getDynamicProperty("mtc_d_length")
        if (def_d_length === undefined) {
            def_d_length = ent.getDynamicProperty("mtc_body_length")
        }

        const bx_uz = -Math.sin(0.0174533 * deg)
        const by_uz = 0
        const bz_uz = Math.cos(0.0174533 * deg)

        const sx = loc.x + def_d_length * bx_uz
        const sy = loc.y + def_d_length * by_uz
        const sz = loc.z + def_d_length * bz_uz
        const head_loc = { x: sx, y: sy, z: sz }


        let p1, p2, p3, tlm, vrail, t, p, d2, d22, rail2
        let d2f
        let old_deg = undefined
        let old_pos = undefined

        if (!search_h) {
            p1 = ent.getDynamicProperty("mtc_head_p1")
            if (p1 === undefined) {
                search_h = true
            } else {
                p2 = ent.getDynamicProperty("mtc_head_p2")
                p3 = ent.getDynamicProperty("mtc_head_p3")
                tlm = ent.getDynamicProperty("mtc_head_tlm")
                vrail = ent.getDynamicProperty("mtc_head_vrail")
                t = getBezierNeart(p1, p2, p3, head_loc)

                let t2
                if (t < 0.5) t2 = 0
                if (t >= 0.5) t2 = 1
                const vec = bezierTangent(p1, p2, p3, t2)
                old_deg = Math.atan2(-vec.x, vec.z) * 57.29578
                setState(ent, "mtc_railh_rot", old_deg)
                setState(ent, "mtc_railh_nearest", t<0.5?p1:p3)
            }
        }


        if (t === 0 || t === 1 || search_h) {
            const rails = ent.dimension.getEntities({ families: ["mtc_rail"], location: head_loc, maxDistance: 20 })
            d2 = 1e30
            d22 = 1e30
            let found = false
            for (const rail of rails) {
                const p1x = rail.getDynamicProperty("mtc_bz_p1")
                const p2x = rail.getDynamicProperty("mtc_bz_p2")
                const p3x = rail.getDynamicProperty("mtc_bz_p3")
                const tlmx = rail.getDynamicProperty("mtc_tlm")
                const vrailx = rail.getDynamicProperty("mtc_vrail")
                const tx = getBezierNeart(p1x, p2x, p3x, head_loc)

                const px = getBezier(p1x, p2x, p3x, tx)
                const d2x = dist2(head_loc, px)
                const dh = Math.abs(loc.y - px.y)

                let d2x2 = d2x

                old_pos = getState(ent, "mtc_railh_nearest")
                if (old_pos !== undefined && tx !== 0 && tx !== 1) {
                    let ds = Math.min(dist(old_pos, p1x),dist(old_pos, p3x))
                    if (ds<0.2)d2x2=-10+d2x;
                }

                old_deg = getState(ent, "mtc_railh_rot")
                if (old_deg !== undefined) {
                    let tx2
                    if (tx < 0.5) tx2 = 0
                    if (tx >= 0.5) tx2 = 1
                    const vec = bezierTangent(p1x, p2x, p3x, tx2)
                    let deg_diff = old_deg - Math.atan2(-vec.x, vec.z) * 57.29578
                    if (deg_diff < -180) deg_diff += 360
                    if (deg_diff > 180) deg_diff -= 360
                    if (deg_diff < -90) deg_diff += 180
                    if (deg_diff > 90) deg_diff -= 180
                    deg_diff=Math.abs(deg_diff)
                    if(deg_diff<1){
                        d2x2 += deg_diff * 1
                    }else{
                        d2x2 += 1 + (deg_diff-1) * 0.001//10
                    }

                }


                if (d2x2 < d22 && /*tx !== 0 && tx !== 1 && */dh < 5) {
                    d22 = d2x2
                    d2 = d2x
                    d2f = (px.x - head_loc.x) ** 2 + (px.z - head_loc.z) ** 2
                    p1 = p1x
                    p2 = p2x
                    p3 = p3x
                    tlm = tlmx
                    vrail = vrailx
                    t = tx
                    p = px
                    rail2=rail
                    found = true
                }
            }
            if (found) {
                ent.setDynamicProperty("mtc_head_p1", p1)
                ent.setDynamicProperty("mtc_head_p2", p2)
                ent.setDynamicProperty("mtc_head_p3", p3)
                ent.setDynamicProperty("mtc_head_tlm", tlm)
                ent.setDynamicProperty("mtc_head_vrail", vrail)
                const fmls=rail2.getComponent("minecraft:type_family")?.getTypeFamilies()??[]
                let jname=undefined
                for(const fml of fmls){
                    if(fml.slice(0,10)=="mtc_joint="){
                        jname=fml.slice(10)
                        break
                    }
                }
                setState(ent,"mtc_jname_h",jname)
            }
        } else {
            p = getBezier(p1, p2, p3, t)
            d2 = dist2(head_loc, p)
            d2f = (p.x - head_loc.x) ** 2 + (p.z - head_loc.z) ** 2
        }

        if (!((t === 0 || t === 1) && d2f > 0) && d2f < 25) {
            //let deg_y = Math.atan2(-(p.x - loc.x), p.z - loc.z) * 57.29578
            let deg_x = Math.atan2((p.y - loc.y), Math.sqrt((p.x - loc.x) ** 2 + (p.z - loc.z) ** 2)) * 57.29578
            setbodyUd(ent, deg_x)
            tilt_ud = deg_x
            head_vec = bezierTangent(p1, p2, p3, t)

            if (ent.hasTag("mtc_parent")) {
                //ent.setRotation({ x: 0, y: deg_y })//+-180°跨ぐときに挙動が良くない
                ent.teleport(ent.location, { facingLocation: { x: p.x, y: ent.location.y, z: p.z } })
                //ent.teleport(ent.location, {rotation:{x:0,y:deg_y}})
                if (bp !== undefined) {
                    let vec = bezierTangent(bp1, bp2, bp3, bt)
                    const vec_size = Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2)
                    if (vec_size > 0) {
                        const dot = ((p.x - loc.x) * vec.x + (p.y - loc.y) * vec.y + (p.z - loc.z) * vec.z)
                        let sign = 1
                        if (dot < 0)
                            sign *= -1
                        if (ent.hasTag("mtc_rev"))
                            sign *= -1

                        vec.x /= vec_size * sign
                        vec.y /= vec_size * sign
                        vec.z /= vec_size * sign
                        setState(ent, "mtc_prev_uvec", vec)
                    }
                }
            } else {
                setState(ent, "midcar_trace_deg", Math.atan2(-(p.x - loc.x), p.z - loc.z) * 57.29578)
            }

        } else {
            //if ((ent.hasTag("mtc_parent") || tilt_mode)) {
                let rot = ent.getRotation()
                rot.y = Math.round(rot.y / 3) * 3
                ent.teleport(ent.location, { rotation: rot })
                //ent.setRotation(rot)
                ent.removeTag("mtc_on_newrail_h")
                setState(ent,"mtc_jname_h",undefined)
            //}
            setState(ent, "midcar_trace_deg", undefined)
            setbodyUd(ent, 0)
        }


    }
    //カント
    //if (tilt_mode) {
    const deg_y = ent.getRotation().y
    let body_deg
    let head_deg
    let db_length = ent.getDynamicProperty("mtc_d_length")
    if (db_length === undefined) {
        db_length = ent.getDynamicProperty("mtc_body_length")
        if (db_length === undefined)
            db_length = 17.5
    }
    if (body_vec !== undefined) {
        body_deg = Math.atan2(-body_vec.x, body_vec.z) * 57.29578
    } else {
        body_deg = deg_y
    }
    if (head_vec !== undefined) {
        head_deg = Math.atan2(-head_vec.x, head_vec.z) * 57.29578
    } else {
        head_deg = deg_y
    }
    let body_deg_d = body_deg - deg_y
    let head_deg_d = head_deg - deg_y

    if (body_deg_d > 180)
        body_deg_d -= 360
    if (body_deg_d < -180)
        body_deg_d += 360
    if (head_deg_d > 180)
        head_deg_d -= 360
    if (head_deg_d < -180)
        head_deg_d += 360

    if (body_deg_d > 90)
        body_deg_d -= 180
    if (body_deg_d < -90)
        body_deg_d += 180
    if (head_deg_d > 90)
        head_deg_d -= 180
    if (head_deg_d < -90)
        head_deg_d += 180

    let diff = body_deg_d - head_deg_d

    if (Math.abs(diff) > 0) {
        //通過速度
        const vh = ent.getDynamicProperty("mtc_head_vrail")
        const vb = ent.getDynamicProperty("mtc_body_vrail")
        let v = 0
        if (vh !== undefined && vh > v)
            v = vh
        if (vb !== undefined && vb > v)
            v = vb

        //曲率半径
        const r = 0.70710678 * db_length / Math.sqrt(1 - Math.cos(diff * 0.0174533))
        let tlm_max = 0
        const tlm_h = ent.getDynamicProperty("mtc_head_tlm")
        const tlm_b = ent.getDynamicProperty("mtc_body_tlm")
        if (tlm_h !== undefined && tlm_h > tlm_max) {
            tlm_max = tlm_h
        }
        if (tlm_b !== undefined && tlm_b > tlm_max) {
            tlm_max = tlm_b
        }

        //カント各計算
        const tdeg = Math.min(tlm_max, Math.atan2(v * v / r, 127) * 57.29578)
        if (diff > 0) {
            setbodyRl(ent, tdeg)
        } else {
            setbodyRl(ent, -tdeg)
        }

        //台車回転
        let eg_d_dist = ent.getDynamicProperty("mtc_d_length")
        let b_dist = ent.getDynamicProperty("mtc_body_length")
        if (eg_d_dist === undefined) eg_d_dist = 16.9
        const dd_ratio = (eg_d_dist * 2 - b_dist) / eg_d_dist

        const body_deg_dx = head_deg_d + diff * dd_ratio//台車位置まで線形補完

        if (world.getDynamicProperty("mtc_tilt") === 1) {
            setdb(ent, -body_deg_dx)
            setdh(ent, -head_deg_d)
        } else {
            setdb(ent, -diff / 2)
            setdh(ent, diff / 2)
        }

    } else {
        setbodyRl(ent, 0)
        setdb(ent, 0)
        setdh(ent, 0)
    }
    //}
    return tilt_ud
}

function setbodyUd(ent, deg_x) {
    if(world.getDynamicProperty("mtc_tilt_car_off")===1) return;
    //if (world.getDynamicProperty("mtc_tilt") === 1) {
        deg_x=Math.max(-45, Math.min(45, deg_x))
        setState(ent, "mtc_tilt_x", deg_x)

        if(ent.getProperty("mtc:pitch")!==undefined){
            if (count_g % 20 == 0 || (getState(ent, "mtc_tiltold_ud") !== deg_x && Math.abs(getState(ent, "mtc_tiltold_ud") - deg_x )>1e-5 )) {
                setState(ent, "mtc_tiltold_ud", deg_x)
                ent.setProperty("mtc:pitch",-deg_x)
            }
            return
        }else{
            if (count_g % 20 == 0 || getState(ent, "mtc_tiltold_ud") !== deg_x) {
                let deg_x_int = Math.round(deg_x * 8)
                deg_x_int = Math.max(-63, Math.min(63, deg_x_int))
                setState(ent, "mtc_tiltold_ud", deg_x_int)

                if (deg_x_int > 0) {
                    for (let k = 0; k < 6; k++) {
                        if ((deg_x_int >> k & 1) == 1) {
                            playAni(ent, `animation.mtc_body.u${k}`, "mtc_body_ud" + k)
                        } else {
                            stopAni(ent, "mtc_body_ud" + k)
                        }
                    }

                } else if (deg_x_int < 0) {
                    for (let k = 0; k < 6; k++) {
                        if (((-deg_x_int) >> k & 1) == 1) {
                            playAni(ent, `animation.mtc_body.d${k}`, "mtc_body_ud" + k)
                        } else {
                            stopAni(ent, "mtc_body_ud" + k)
                        }
                    }
                } else {
                    for (let k = 0; k < 6; k++) {
                        stopAni(ent, "mtc_body_ud" + k)
                    }
                }
            
            }

        }



    //}
}

function setbodyRl(ent, deg_y) {
    //if (world.getDynamicProperty("mtc_tilt") === 1) {
    deg_y=Math.max(-45, Math.min(45, deg_y))
    setState(ent, "mtc_tilt_z", deg_y)

    if(ent.getProperty("mtc:roll")!==undefined){
        if (count_g % 20 == 0 || (getState(ent, "mtc_tiltold_lr") !== deg_y && Math.abs(getState(ent, "mtc_tiltold_lr") - deg_y )>1e-5 )) {
            setState(ent, "mtc_tiltold_lr", deg_y)
            ent.setProperty("mtc:roll",deg_y)
        }
        return
    }else{
        if (count_g % 20 == 0 || getState(ent, "mtc_tiltold_lr") !== deg_y) {
            

            let deg_y_int = Math.round(deg_y * 8)
            deg_y_int = Math.max(-63, Math.min(63, deg_y_int))
            setState(ent, "mtc_tiltold_lr", deg_y_int)

            if (deg_y_int > 0) {
                for (let k = 0; k < 6; k++) {
                    if ((deg_y_int >> k & 1) == 1) {
                        playAni(ent, `animation.mtc_body.l${k}`, "mtc_body_lr" + k)
                    } else {
                        stopAni(ent, "mtc_body_lr" + k)
                    }
                }

            } else if (deg_y_int < 0) {
                for (let k = 0; k < 6; k++) {
                    if (((-deg_y_int) >> k & 1) == 1) {
                        playAni(ent, `animation.mtc_body.r${k}`, "mtc_body_lr" + k)
                    } else {
                        stopAni(ent, "mtc_body_lr" + k)
                    }
                }
            } else {
                for (let k = 0; k < 6; k++) {
                    stopAni(ent, "mtc_body_lr" + k)
                }
            }
        
        }
    }

    

    //}
}

function setdb(ent, deg_y) {

    if (count_g % 20 == 0 || (getState(ent, "mtc_db") !== deg_y && Math.abs(getState(ent, "mtc_db") - deg_y )>1e-5 )) {
        setState(ent, "mtc_db", deg_y)

        if(ent.getProperty("mtc:db")!==undefined){
            ent.setProperty("mtc:db",-deg_y)
            return
        }

        let deg_y_int = Math.round(deg_y)
        deg_y_int = Math.max(-63, Math.min(63, deg_y_int))

        if (deg_y_int > 0) {
            for (let k = 0; k < 6; k++) {
                if ((deg_y_int >> k & 1) == 1) {
                    playAni(ent, `animation.mtc_body.dbl${k}`, "mtc_dblr" + k)
                } else {
                    stopAni(ent, "mtc_dblr" + k)
                }
            }

        } else if (deg_y_int < 0) {
            for (let k = 0; k < 6; k++) {
                if (((-deg_y_int) >> k & 1) == 1) {
                    playAni(ent, `animation.mtc_body.dbr${k}`, "mtc_dblr" + k)
                } else {
                    stopAni(ent, "mtc_dblr" + k)
                }
            }
        } else {
            for (let k = 0; k < 6; k++) {
                stopAni(ent, "mtc_dblr" + k)
            }
        }
    }
    //}
}
function setdh(ent, deg_y) {

    if (count_g % 20 == 0 || (getState(ent, "mtc_dh") !== deg_y && Math.abs(getState(ent, "mtc_dh") - deg_y )>1e-5 )) {
        setState(ent, "mtc_dh", deg_y)

        if(ent.getProperty("mtc:dh")!==undefined){
            ent.setProperty("mtc:dh",-deg_y)
            return
        }

        let deg_y_int = Math.round(deg_y)
        deg_y_int = Math.max(-63, Math.min(63, deg_y_int))


        if (deg_y_int > 0) {
            for (let k = 0; k < 6; k++) {
                if ((deg_y_int >> k & 1) == 1) {
                    playAni(ent, `animation.mtc_body.dhl${k}`, "mtc_dhlr" + k)
                } else {
                    stopAni(ent, "mtc_dhlr" + k)
                }
            }

        } else if (deg_y_int < 0) {
            for (let k = 0; k < 6; k++) {
                if (((-deg_y_int) >> k & 1) == 1) {
                    playAni(ent, `animation.mtc_body.dhr${k}`, "mtc_dhlr" + k)
                } else {
                    stopAni(ent, "mtc_dhlr" + k)
                }
            }
        } else {
            for (let k = 0; k < 6; k++) {
                stopAni(ent, "mtc_dhlr" + k)
            }
        }
    }
    //}
}

function testOnRail(ent, loc, rot) {
    let on_rail = false
    const ublock = ent.dimension.getBlockFromRay(loc, { x: 0, y: -1, z: 0 })
    if (ublock !== undefined) {
        if (ublock.block.typeId.slice(-4) == "rail") {
            on_rail = true
        }
    }
    if (!on_rail) {
        const bx_ux = -Math.cos(0.0174533 * rot.y)
        const by_ux = 0
        const bz_ux = Math.sin(0.0174533 * rot.y)
        const sx = loc.x + 1 * bx_ux
        const sy = loc.y + 1 * by_ux
        const sz = loc.z + 1 * bz_ux
        const ublock = ent.dimension.getBlockFromRay({ x: sx, y: sy, z: sz }, { x: 0, y: -1, z: 0 })
        if (ublock !== undefined) {
            if (ublock.block.typeId.slice(-4) == "rail") {
                on_rail = true
            }
        }
    }
    if (!on_rail) {
        const bx_ux = -Math.cos(0.0174533 * rot.y)
        const by_ux = 0
        const bz_ux = Math.sin(0.0174533 * rot.y)
        const sx = loc.x - 1 * bx_ux
        const sy = loc.y - 1 * by_ux
        const sz = loc.z - 1 * bz_ux
        const ublock = ent.dimension.getBlockFromRay({ x: sx, y: sy, z: sz }, { x: 0, y: -1, z: 0 })
        if (ublock !== undefined) {
            if (ublock.block.typeId.slice(-4) == "rail") {
                on_rail = true
            }
        }
    }
    return on_rail
}

//parentからの呼び出し
async function runJoint(ent_p, ents_f) {
    //編成連結順(1号車先頭)
    let entf_order = [ent_p]
    let pre_ent = ent_p
    while (true) {
        let fount_child = false
        for (const ent_trg of ents_f) {
            if (obj_mtc_uid.getScore(pre_ent) === obj_mtc_parent.getScore(ent_trg)) {
                entf_order.push(ent_trg)
                pre_ent = ent_trg
                fount_child = true
                break
            }
        }
        if (!fount_child) break
    }
    const cars = entf_order.length

    for (let i = 0; i < cars; i++) {
        let x0 = ent_p.getDynamicProperty("dist")
        let ent_f
        //編成連結順(進行方向先頭)
        if (ent_p.hasTag("mtc_rev")) {
            ent_f = entf_order[cars - 1 - i]
        } else {
            ent_f = entf_order[i]
        }

        //車軸間距離
        let d1 = 2.1
        if (obj_mtc_dd.hasParticipant(ent_f)) {
            d1 = obj_mtc_dd.getScore(ent_f) * 0.001
        }

        let eg_d_dist = ent_f.getDynamicProperty("mtc_d_length")
        let b_dist = ent_f.getDynamicProperty("mtc_body_length")
        if (eg_d_dist === undefined) eg_d_dist = 16.9

        //20m車の一般的なパラメータとMTCの初期パラメータの補正
        if (Math.abs(b_dist - 20) < 0.1 && Math.abs(eg_d_dist - 17.5) < 0.1) {
            eg_d_dist = 16.9
        }

        //台車間距離
        const d_dist = eg_d_dist * 2 - b_dist

        let pitch = 0.5 + (obj_mtc_spd.getScore(ent_p) - 20000) / 120000
        if (pitch < 0.5) pitch = 0.5
        if (pitch > 1) pitch = 1
        pitch = pitch.toFixed(5)


        let pos1, pos2
        let run_name1="mtc.joint"
        let run_name2="mtc.joint"
        if (ent_p.hasTag("mtc_rev")) {
            pos1 = (b_dist - eg_d_dist).toFixed(5)
            pos2 = eg_d_dist.toFixed(5)
            run_name1 = (ent_f.getDynamicProperty("mtc_jointsound") ?? getState(ent_f,"mtc_jname_b")) ?? run_name1
            run_name2 = (ent_f.getDynamicProperty("mtc_jointsound") ?? getState(ent_f,"mtc_jname_h")) ?? run_name2
        } else {
            pos1 = eg_d_dist.toFixed(5)
            pos2 = (b_dist - eg_d_dist).toFixed(5)
            run_name1 = (ent_f.getDynamicProperty("mtc_jointsound") ?? getState(ent_f,"mtc_jname_h")) ?? run_name1
            run_name2 = (ent_f.getDynamicProperty("mtc_jointsound") ?? getState(ent_f,"mtc_jname_b")) ?? run_name2
        }

        ent_f.runCommand(`execute positioned ^^^${pos1} run playsound ${run_name1} @a[r=${b_dist / 2}] ~~~ 1.0 ${pitch} 1.0`)
        ent_f.runCommand(`execute positioned ^^^${pos1} run playsound ${run_name1} @a[r=${b_dist},rm=${b_dist / 2}] ~~~ 0.2 ${pitch} 0.3`)
        ent_f.runCommand(`execute positioned ^^^${pos1} run playsound ${run_name1} @a[r=${b_dist * 1.5},rm=${b_dist}] ~~~ 0.1 ${pitch} 0.1`)

        if (d1 > 0) {
            await sleep(Math.max(1, Math.round(144000 * d1 / (obj_mtc_spd.getScore(ent_p) * scale_g))))

            ent_f.runCommand(`execute positioned ^^^${pos1} run playsound ${run_name1} @a[r=${b_dist / 2}] ~~~ 1.0 ${pitch} 1.0`)
            ent_f.runCommand(`execute positioned ^^^${pos1} run playsound ${run_name1} @a[r=${b_dist},rm=${b_dist / 2}] ~~~ 0.2 ${pitch} 0.3`)
            ent_f.runCommand(`execute positioned ^^^${pos1} run playsound ${run_name1} @a[r=${b_dist * 1.5},rm=${b_dist}] ~~~ 0.1 ${pitch} 0.1`)
        }

        while (ent_p.getDynamicProperty("dist") - x0 < d_dist) await sleep(1)

        ent_f.runCommand(`execute positioned ^^^${pos2} run playsound ${run_name2} @a[r=${b_dist / 2}] ~~~ 1.0 ${pitch} 1.0`)
        ent_f.runCommand(`execute positioned ^^^${pos2} run playsound ${run_name2} @a[r=${b_dist},rm=${b_dist / 2}] ~~~ 0.2 ${pitch} 0.3`)
        ent_f.runCommand(`execute positioned ^^^${pos2} run playsound ${run_name2} @a[r=${b_dist * 1.5},rm=${b_dist}] ~~~ 0.1 ${pitch} 0.1`)

        if (d1 > 0) {
            await sleep(Math.max(1, Math.ceil(144000 * d1 / (obj_mtc_spd.getScore(ent_p) * scale_g))))

            ent_f.runCommand(`execute positioned ^^^${pos2} run playsound ${run_name2} @a[r=${b_dist / 2}] ~~~ 1.0 ${pitch} 1.0`)
            ent_f.runCommand(`execute positioned ^^^${pos2} run playsound ${run_name2} @a[r=${b_dist},rm=${b_dist / 2}] ~~~ 0.2 ${pitch} 0.3`)
            ent_f.runCommand(`execute positioned ^^^${pos2} run playsound ${run_name2} @a[r=${b_dist * 1.5},rm=${b_dist}] ~~~ 0.1 ${pitch} 0.1`)
        }

        while (ent_p.getDynamicProperty("dist") - x0 < b_dist) await sleep(1)
        //await sleep(Math.ceil(144000 * (b_dist-d_dist-d1) / obj_mtc_spd.getScore(ent_p)))
    }
}

function makeTunnel(dim, bz1, bz2, bz3, dl, dr, du, dd) {
    let sca_l = []
    let sca_r = []
    let sca_u = []
    let sca_d = []
    for (let i = 0; i <= dl; i++) sca_l.push(i);
    sca_l.push(dl + 0.48)
    for (let i = 1; i <= dr; i++) sca_r.push(i);
    sca_r.push(dr + 0.48)
    for (let i = 0; i <= du; i++) sca_u.push(i);
    sca_u.push(du + 0.98)
    for (let i = 1; i <= dd; i++) sca_d.push(i);
    sca_d.push(dd)

    for (let t = 0; t <= 1; t += 0.01) {
        const p = getBezier(bz1, bz2, bz3, t)
        const vec = bezierTangent(bz1, bz2, bz3, t)
        let vx = vec.z
        let vz = -vec.x
        const vr = Math.sqrt(vx ** 2 + vz ** 2)
        if (vr <= 0) break
        vx /= vr
        vz /= vr
        setBlock(dim, p, "minecraft:air")
        for (const su of sca_u) {
            for (const sl of sca_l) {
                const p2 = { x: p.x + vx * sl, y: p.y + su, z: p.z + vz * sl }
                setBlock(dim, p2, "minecraft:air")
            }
            for (const sr of sca_r) {
                const p2 = { x: p.x - vx * sr, y: p.y + su, z: p.z - vz * sr }
                setBlock(dim, p2, "minecraft:air")
            }
        }
        for (const sd of sca_d) {
            for (const sl of sca_l) {
                const p2 = { x: p.x + vx * sl, y: p.y - sd, z: p.z + vz * sl }
                setBlock(dim, p2, "minecraft:air")
            }
            for (const sr of sca_r) {
                const p2 = { x: p.x - vx * sr, y: p.y - sd, z: p.z - vz * sr }
                setBlock(dim, p2, "minecraft:air")
            }
        }


    }

}

/********* ヘルパー  *********/

function getTime() {
    return new Date().getTime();
}


function setBlock(dim, pos, block_n) {
    try {
        const block = dim.getBlock(pos)
        block.setPermutation(BlockPermutation.resolve(block_n))
        return true
    } catch (e) {
    }
    return false
}

let temp_state = {}
function setState(ent, id, val) {
    temp_state[id + ent.id] = val
}
function getState(ent, id) {
    return temp_state[id + ent.id]
}

function getEntities(state={}){
    let ents = world.getDimension("overworld").getEntities(state)
    ents=ents.concat(world.getDimension("nether").getEntities(state))
    ents=ents.concat(world.getDimension("the_end").getEntities(state))
    return ents
}

/**
 * "mtc:XXXX_YY" という形式の文字列から "mtc:XXXX" の部分を抽出します。
 * XXXX部にはアンダースコアが含まれる可能性があります。
 * @param {string} name - "mtc:XXXX..._YY" の形式の文字列。
 * @returns {string} 最後のアンダースコアより前の部分。
 */
function getGroupName(name) {
  // 文字列の末尾から "_" を検索し、そのインデックスを取得します。
  const lastIndex = name.lastIndexOf('_');

  // "_" が見つかった場合（lastIndexが-1でない場合）、
  // 文字列の最初からその位置までの部分を返します。
  if (lastIndex !== -1) {
    return name.substring(0, lastIndex);
  }

  // "_" が見つからなかった場合は、元の文字列をそのまま返します。
  return name;
}


/**
 * 整数の配列をハフマン符号化し、24bitを利用した数値の配列として返す
 * @param {number[]} data - エンコード対象の整数配列
 * @param {Map<number, string>} huffmanTable - ハフマン符号テーブル
 * @returns {{encodedArray: number[], originalDataLength: number}}
 */
function huffmanEncodeToArray24bit(data, huffmanTable) {
    let encodedString = "";
    for (const num of data) {
        if (huffmanTable.has(num)) {
            encodedString += huffmanTable.get(num);
        } else {
            throw new Error(`Error: The number ${num} is not in the Huffman table.`);
        }
    }
    const originalDataLength = data.length;

    const BITS = 24; // 24ビット単位で処理
    const numIntegers = Math.ceil(encodedString.length / BITS);
    const encodedArray = []; // 通常の数値配列に出力

    for (let i = 0; i < numIntegers; i++) {
        const start = i * BITS;
        const end = start + BITS;
        let chunk = encodedString.substring(start, end);

        if (chunk.length < BITS) {
            chunk = chunk.padEnd(BITS, '0');
        }
        encodedArray.push(parseInt(chunk, 2));
    }

    return { encodedArray, originalDataLength };
}


function rotateXZ(trg_vec,pivot_vec,sin_y,cos_y){
    let delta_x=trg_vec.x-pivot_vec.x
    let delta_z=trg_vec.z-pivot_vec.z

    let n_delta_x=delta_x*cos_y-delta_z*sin_y
    let n_delta_z=delta_x*sin_y+delta_z*cos_y

    return {x:pivot_vec.x+n_delta_x,y:trg_vec.y,z:pivot_vec.z+n_delta_z}
}

function loopSoundOn(ents_f,sound_id){
    for (const ent of ents_f) {
        ent.setDynamicProperty("sound" + sound_id, 1)
        ent.addTag("mtc_nsound" + sound_id)
        try { ent.runCommand(`function ${getIdBase(ent.typeId)}/ani/loop${sound_id}`) } catch (e) { }
    }
}

function loopSoundOff(ents_f,sound_id){
    for (const ent of ents_f) {
        ent.setDynamicProperty("sound" + sound_id, 0)
        ent.removeTag("mtc_nsound" + sound_id)
        ent.removeTag("mtc_sound" + sound_id)
        try { ent.runCommand(`function ${getIdBase(ent.typeId)}/ani/loop${sound_id}e`) } catch (e) { }
    }
}

function horn(ents_f,sound_id){
    for (const ent of ents_f) {
        ent.runCommand(`playsound ${getIdBase(ent.typeId) + "_horn" + sound_id} @a[r=64] ~~~ 256`)
        try { ent.runCommand(`function ${getIdBase(ent.typeId)}/ani/horn${sound_id}`) } catch (e) { }
    }
}


const REGEX_RAIL_DEF = /^mtc:rail\d*_def(\d+)$/;
function getRailOffset(ent){
    let offset = (ent.getComponent("minecraft:variant")?.value??68)*0.01

    //variantが後から追加されたデフォルトレール対策
    if(offset===0){
        const match = ent.typeId.match(REGEX_RAIL_DEF);
        const id = match ? parseInt(match[1], 10) : undefined;

        if(id!==undefined){
            if(id>=0 && id<4){
                offset=0.5
            }else if(id>=4 && id<11){
                offset=0.68
            }else if(id==11){
                offset=-1.5
            }

        }
    }
    return offset
}