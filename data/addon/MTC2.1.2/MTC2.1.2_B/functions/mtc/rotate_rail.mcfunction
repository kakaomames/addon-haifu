# 車体実行
# rotateから実行

# 線路検知
execute if block ^0.3^^1 rail if block ^-0.3^^1 rail run tag @s add mtc_tc
execute if block ^0.3^^1 golden_rail if block ^-0.3^^1 golden_rail run tag @s add mtc_tc

execute unless entity @s[tag=mtc_tc] run function mtc/rotate_rail2

