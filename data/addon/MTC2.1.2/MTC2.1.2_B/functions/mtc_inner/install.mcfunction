# MTCアプデ
# プレイヤーから
## バージョン
execute unless score ver mtc_global matches 13 run function mtc_inner/scinit
execute unless score ver mtc_global matches 13 run summon mtc:set
execute unless score ver mtc_global matches 13 if entity @e[type=mtc:set] run scoreboard players set ver mtc_global 13
