function mtc/testBoard

# 状態取得
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_open] run tag @s add mtc_revtag

#閉
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_revtag] run function mtc/close

#開
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_revtag] run function mtc/openB


tag @e remove mtc_revtag