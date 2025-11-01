# 召喚
execute unless entity @s[tag=mtc_norail] run summon mtc:mtc_car
execute unless entity @s[tag=mtc_norail] unless block ~~-1~ rail unless block ~~-1~ golden_rail run tp @e[type=mtc:mtc_car,c=1] ~~-2.3~
#ride @s start_riding @e[type=mtc:mtc_car,c=1]
execute unless entity @s[tag=mtc_norail] run summon mtc:mtc_proc
execute unless entity @s[tag=mtc_norail] run ride @e[type=mtc:mtc_proc,c=1] start_riding @e[type=mtc:mtc_car,c=1]

# EBにセット
scoreboard players operation @s mtc_not = @s mtc_notBM
scoreboard players operation @s mtc_prenot = @s mtc_notBM

#自動連結
function mtc/auto_connect

tag @s add mtc_init