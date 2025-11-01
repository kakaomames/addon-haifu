# 車両から実行
# 同一編成calc3=0
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc3 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc3 -= @s mtc_fid

execute as @a at @s run scoreboard players operation @s mtc_sid = @e[family=mtc_body,tag=!mtc_nrs,scores={mtc_calc3=0},c=1] mtc_uid

# 対象者のsid=0
scoreboard players operation @a mtc_sid -= @s mtc_uid

