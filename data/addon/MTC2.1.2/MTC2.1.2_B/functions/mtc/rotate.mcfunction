# 車両実行
# 線路検知
tag @s remove mtc_tc
tag @s remove mtc_tl
tag @s remove mtc_tr

execute if entity @s[tag=mtc_parent] if entity @s[tag=!mtc_pt1,tag=!mtc_pt2,tag=!mtc_pt3] run function mtc/rotate_rail
execute if entity @s[tag=mtc_parent] if entity @s[tag=mtc_pt1] run function mtc/rotate_pt1
execute if entity @s[tag=mtc_parent] if entity @s[tag=mtc_pt2] run function mtc/rotate_pt2
execute if entity @s[tag=mtc_parent] if entity @s[tag=mtc_pt3] run function mtc/rotate_pt3

# 回転
execute if entity @s[tag=mtc_tl] if score @s mtc_spd matches 1.. at @s run tp @s ~~~~-3
execute if entity @s[tag=mtc_tr] if score @s mtc_spd matches 1.. at @s run tp @s ~~~~3

execute if entity @s[tag=mtc_tl] run tag @s add mtc_trot
execute if entity @s[tag=mtc_tr] run tag @s add mtc_trot
execute if entity @s[tag=mtc_tc] run tag @s remove mtc_trot

execute unless entity @s[tag=mtc_has_dp] run summon mtc:mtc_headloc
execute unless entity @s[tag=mtc_has_dp] run scoreboard players operation @e[type=mtc:mtc_headloc,c=1] mtc_calc2 = @s mtc_uid
execute unless entity @s[tag=mtc_has_dp] run scoreboard players operation @e[type=mtc:mtc_headloc,c=1] mtc_calc2 += c1 mtc_global
execute unless entity @s[tag=mtc_has_dp] run scriptevent mtc:inner_body_length_d
