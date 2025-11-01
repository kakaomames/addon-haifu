# 線路検知
execute if block ^0.3^2^ structure_void if block ^-0.3^2^ structure_void run tag @s add mtc_tc
execute unless entity @s[tag=mtc_tc] if block ^0.7 ^2 ^ structure_void run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tc] unless entity @s[tag=mtc_tl] if block ^1.09 ^2 ^ structure_void run tag @s add mtc_tl
execute unless entity @s[tag=mtc_tc] unless entity @s[tag=mtc_tl] if block ^-0.7 ^2 ^ structure_void run tag @s add mtc_tr
execute unless entity @s[tag=mtc_tc] unless entity @s[tag=mtc_tl] if block ^-1.09 ^2 ^ structure_void run tag @s add mtc_tr
