function mtc/testBoard

execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s run scoreboard players operation @s mtc_calc2 = @s mtc_notBM
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s run scoreboard players operation @s mtc_calc2 -= @s mtc_not

# 実行
#execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if score @s mtc_calc2 matches ..-1 run 
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] if score @s mtc_calc2 matches ..-1 run playsound mtc.notch @p[r=30] ~~~ 100

execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if score @s mtc_calc2 matches ..-1 run scoreboard players remove @s mtc_not 1
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] run tag @s add mtc_mas_v2

# ATO解除
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] run scoreboard players set @s mtc_ato -1
