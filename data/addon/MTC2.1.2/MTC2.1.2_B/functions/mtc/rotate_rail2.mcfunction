# 車体実行
# rotate_railから実行

#phase1
execute if block ^0.7 ^ ^ rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^0.7 ^ ^ golden_rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^0.7 ^1 ^ rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^0.7 ^1 ^ golden_rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^0.7 ^-1 ^ rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^0.7 ^-1 ^ golden_rail run tag @s add mtc_tl
#phase2
execute unless entity @s[tag=mtc_tl] if block ^1.09 ^ ^ rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^1.09 ^ ^ golden_rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^1.09 ^1 ^ rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^1.09 ^1 ^ golden_rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^1.09 ^-1 ^ rail run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tl] if block ^1.09 ^-1 ^ golden_rail run tag @s add mtc_tl


#phase1
execute unless entity @s[tag=mtc_tl] if block ^-0.7 ^ ^ rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-0.7 ^ ^ golden_rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-0.7 ^1 ^ rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-0.7 ^1 ^ golden_rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-0.7 ^-1 ^ rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-0.7 ^-1 ^ golden_rail run tag @s add mtc_tr
#phase2
execute unless entity @s[tag=mtc_tl] if block ^-1.09 ^ ^ rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-1.09 ^ ^ golden_rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-1.09 ^1 ^ rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-1.09 ^1 ^ golden_rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-1.09 ^-1 ^ rail run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tl] if block ^-1.09 ^-1 ^ golden_rail run tag @s add mtc_tr

