# 衝突防止
execute as @e[tag=mtc_parent,scores={mtc_spd=1..}] at @s run function mtc/antihit

# 走行
execute as @e[tag=mtc_parent,tag=!mtc_norail,tag=!mtc_plane,scores={mtc_spd=1..}] run function mtc/run1

# 浮上
#execute as @e[family=mtc_body,tag=mtc_plane,tag=mtc_parent] run scoreboard players operation @s mtc_calc1 = @s mtc_spd
#execute as @e[family=mtc_body,tag=mtc_plane,tag=mtc_parent] run scoreboard players operation @s mtc_calc1 -= @s mtc_minspd
#execute as @e[family=mtc_body,tag=mtc_plane,tag=mtc_parent,scores={mtc_calc1=0..}] at @s run function mtc/fly
#execute as @e[family=mtc_body,tag=mtc_plane,tag=mtc_parent,scores={mtc_calc1=..-1}] at @s run function mtc/drop
#execute as @e[family=mtc_body,tag=mtc_plane,tag=mtc_parent,scores={mtc_spd=120000..}] at @s run tp @s ~~0.1~
#execute as @e[family=mtc_body,tag=mtc_plane,tag=mtc_parent,scores={mtc_spd=..119999}] at @s run tp @s ~~-0.1~ true

# 回転
#execute as @e[family=mtc_body,tag=!mtc_parent] at @s run function mtc/trace

# 手動操作禁止(停止時)
#execute as @e[tag=mtc_parent,tag=!mtc_norail,scores={mtc_spd=0}] at @s unless entity @e[type=mtc:mtc_car,r=0.36] at @s run tp @s @e[type=mtc:mtc_car,c=1,r=7]
