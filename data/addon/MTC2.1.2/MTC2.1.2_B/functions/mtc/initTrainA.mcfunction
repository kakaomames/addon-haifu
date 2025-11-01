# レール検知・方向自動
execute unless score dir_preset mtc_global matches 1.. run tp @s ~0.01~~0.01 0
execute unless score dir_preset mtc_global matches 1.. if block ~2~~ rail run tp @s ~~~ -90
execute unless score dir_preset mtc_global matches 1.. if block ~2~-1~ rail run tp @s ~~~ -90
execute unless score dir_preset mtc_global matches 1.. if block ~2~-2~ rail run tp @s ~~~ -90
execute unless score dir_preset mtc_global matches 1.. if block ~2~~ golden_rail run tp @s ~~~ -90
execute unless score dir_preset mtc_global matches 1.. if block ~2~-1~ golden_rail run tp @s ~~~ -90
execute unless score dir_preset mtc_global matches 1.. if block ~2~-2~ golden_rail run tp @s ~~~ -90
execute unless score dir_preset mtc_global matches 1.. run scoreboard players set @s mtc_rot 20
scoreboard players set dir_preset mtc_global 0

tag @s add mtc_parent
tag @s add mtc_mas_v2
tag @s add mtc_mode_v2


scoreboard players set @s mtc_norail 0
scoreboard players random @s mtc_uid 1 2147483646
scoreboard players operation @s mtc_fid = @s mtc_uid
scoreboard players set @s mtc_parent 0
scoreboard players set @s mtc_spd 0
scoreboard players set @s mtc_ats -1
scoreboard players set @s mtc_ato -1
scoreboard players set @s mtc_maku 0
scoreboard players set @s mtc_not -1
scoreboard players set @s mtc_prenot -1


# 初期値・本来車両側関数の処理
scoreboard players set @s mtc_spdMax 240000
scoreboard players set @s mtc_accN -100
scoreboard players set @s mtc_accDA 438
scoreboard players set @s mtc_accDB 338
scoreboard players set @s mtc_notAM 4
scoreboard players set @s mtc_notBM -8
scoreboard players set @s mtc_makuM 2
scoreboard players set @s mtc_max_ani 2
scoreboard players set @s mtc_max_sound 1
scoreboard players set @s mtc_max_horn 0
scoreboard players set @s mtc_dd 2100
