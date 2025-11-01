execute rotated ~ 0 if block ^^^ rail run tag @s add mtc_tc
execute rotated ~ 0 if block ^^^ golden_rail run tag @s add mtc_tc
execute rotated ~ 0 unless entity @s[tag=mtc_tc] if block ^1^^ rail run tp @e[family=mtc_runnable,r=1,c=2] ^1^^
execute rotated ~ 0 unless entity @s[tag=mtc_tc] if block ^1^^ golden_rail run tp @e[family=mtc_runnable,r=1,c=2] ^1^^
execute rotated ~ 0 unless entity @s[tag=mtc_tc] if block ^-1^^ rail run tp @e[family=mtc_runnable,r=1,c=2] ^-1^^
execute rotated ~ 0 unless entity @s[tag=mtc_tc] if block ^-1^^ golden_rail run tp @e[family=mtc_runnable,r=1,c=2] ^-1^^
