function mtc/testBoard

# 状態取得
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_open] run tag @s add mtc_revtag
# 幕方向取得 calc2=0で上り
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s run scoreboard players operation @s mtc_calc2 = @s mtc_maku
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s run scoreboard players operation @s mtc_calc2 %= c2 mtc_global

#閉
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_revtag] run function mtc/close

#開
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_revtag,tag=mtc_bus] run function mtc/openR
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_rev,tag=!mtc_revtag] run function mtc/openR
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_rev,tag=!mtc_revtag] run function mtc/openL
# 旧幕連動
#execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_revtag,tag=mtc_bus] run function mtc/openR
#execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[scores={mtc_calc2=0},tag=!mtc_revtag] run function mtc/openR
#execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[scores={mtc_calc2=!0},tag=!mtc_revtag] run function mtc/openL


tag @e remove mtc_revtag