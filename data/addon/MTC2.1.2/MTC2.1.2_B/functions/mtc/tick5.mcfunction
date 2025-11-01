# 連結fid自動調整
execute if score clock mtc_global matches 60.. as @e[family=mtc_body,tag=!mtc_parent,tag=mtc_init] run function mtc/autofid

# rotate補助
scoreboard players set @e[family=mtc_obj,scores={mtc_rot=1..,mtc_spd=1..}] mtc_rot 0
execute as @e[family=mtc_obj,scores={mtc_rot=1..}] at @s run tp @s ~~~~
execute as @e[family=mtc_obj,scores={mtc_rot=1..}] at @s run scoreboard players remove @s mtc_rot 1

# 速度対応イベント -> js行き

# ワールドクロック
scoreboard players add clock mtc_global 1

# 遅延自動連結
execute as @e[tag=mtc_conn2] run tag @s add mtc_conn
execute as @e[tag=mtc_conn2] run tag @s remove mtc_conn2
