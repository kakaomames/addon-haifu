execute rotated ~ 0 if block ^^3^ structure_void run tag @s add mtc_tc
execute rotated ~ 0 unless entity @s[tag=mtc_tc] if block ^1^3^ structure_void run tp @e[family=mtc_runnable,r=1,c=2] ^1^^
execute rotated ~ 0 unless entity @s[tag=mtc_tc] if block ^-1^3^ structure_void run tp @e[family=mtc_runnable,r=1,c=2] ^-1^^
