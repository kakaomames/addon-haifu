tag @e remove mtcmca_pt
tag @e[family=mca_car,c=1] add mtcmca_pt
tag @e[family=mtc_body,c=1] add mtcmca_pt

execute as @e[tag=mtcmca_pt,c=1] if entity @s[family=mca_car] at @s run function pt/mca_pt1
execute as @e[tag=mtcmca_pt,c=1] if entity @s[family=mtc_body] at @s run function pt/mtc_pt1

tag @e remove mtcmca_pt
