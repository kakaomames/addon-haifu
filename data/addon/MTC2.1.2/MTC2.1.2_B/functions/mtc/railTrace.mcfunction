# 脱線補正
# 車両curveから実行
tag @s remove mtc_tc
execute if entity @s[tag=!mtc_pt1,tag=!mtc_pt2,tag=!mtc_pt3] run function mtc/railTraceRail
execute if entity @s[tag=mtc_pt1] run function mtc/railTracePT1
execute if entity @s[tag=mtc_pt2] run function mtc/railTracePT2
execute if entity @s[tag=mtc_pt3] run function mtc/railTracePT3
