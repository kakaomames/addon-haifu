# 手動操作禁止（走行時）
#execute at @s unless entity @e[type=mtc:mtc_car,r=0.36] as @e[type=mtc:mtc_car,c=1] at @s run tp @e[family=mtc_body,tag=mtc_parent,c=1] ~~~ 

# 同一編成検出
#function mtc/testFormation
# 走行
#execute if entity @s[tag=!mtc_rev] if score @s mtc_spd matches 1..160000 run function mtc/run2f1
#execute if entity @s[tag=!mtc_rev] if score @s mtc_spd matches 160001.. run function mtc/run2f2
#execute if entity @s[tag=mtc_rev] if score @s mtc_spd matches 1..160000 run function mtc/run2b1
#execute if entity @s[tag=mtc_rev] if score @s mtc_spd matches 160001.. run function mtc/run2b2

execute if entity @s[tag=mtc_parent,family=mtc_body] at @s run tp @e[type=mtc:mtc_car,c=1,r=7] @s
