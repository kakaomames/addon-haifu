execute unless entity @e[family=mtc_body,c=1,r=30] run tellraw @p[r=30] {"rawtext":[{"text":"§c30m以内に車両が見つかりません"}]}


execute as @e[family=mtc_body,c=1,r=30] at @s run ride @e[type=mtc:mtc_car,c=1,r=1] evict_riders
execute as @e[family=mtc_body,c=1,r=30] at @s run tp @e[type=mtc:mtc_car,c=1,r=1] ~ -10000 ~

execute as @e[family=mtc_body,c=1,r=30] at @s run tag @e[type=mtc:mtc_proc,c=1,r=1] add mtc_kill
execute as @e[family=mtc_body,c=1,r=30] at @s run tp @e[type=mtc:mtc_proc,c=1,r=1] ~ 10000 ~

execute as @e[family=mtc_body,c=1,r=30] at @s run ride @s evict_riders
execute as @e[family=mtc_body,c=1,r=30] at @s run kill @s
