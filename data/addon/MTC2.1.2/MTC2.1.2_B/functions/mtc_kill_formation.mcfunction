execute unless entity @e[family=mtc_body,c=1,r=30] run tellraw @p[r=30] {"rawtext":[{"text":"§c30m以内に車両が見つかりません"}]}

execute as @e[family=mtc_body,c=1,r=30] at @s run function mtc/testFormation
execute as @e[family=mtc_body,c=1,r=30] at @s run execute as @e[family=mtc_body,scores={mtc_calc1=0}] at @s run function mtc_kill
