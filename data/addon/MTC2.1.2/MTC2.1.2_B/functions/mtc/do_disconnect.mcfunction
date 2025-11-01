# 自身が解結
summon mtc:mtc_car ~~0.5~
ride @s start_riding @e[type=mtc:mtc_car,c=1]
summon mtc:mtc_proc
ride @e[type=mtc:mtc_proc,c=1] start_riding @e[type=mtc:mtc_car,c=1]

tag @s add mtc_parent

# 操作情報初期化
scoreboard players set @s mtc_ato -1
scoreboard players set @s mtc_not -1

scoreboard players set @s mtc_spd 0

# 親がいる場合
# 元編成先頭車の探索
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_uid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @s mtc_fid

execute if entity @e[family=mtc_body,scores={mtc_calc1=0},c=1] run scoreboard players operation @s mtc_spd = @e[family=mtc_body,scores={mtc_calc1=0},c=1] mtc_spd
execute if entity @e[family=mtc_body,scores={mtc_calc1=0},c=1] run scoreboard players operation @s mtc_not = @e[family=mtc_body,scores={mtc_calc1=0},c=1] mtc_not
execute if entity @e[family=mtc_body,scores={mtc_calc1=0},tag=mtc_rev,c=1] run tag @s add mtc_rev
execute if entity @e[family=mtc_body,scores={mtc_calc1=0},tag=!mtc_rev,c=1] run tag @s remove mtc_rev

scoreboard players operation @s mtc_fid = @s mtc_uid
scoreboard players set @s mtc_parent 0
