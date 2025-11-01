
# 最寄り車両mtc_fidと同じmtc_fidを持つ車体のmtc_calc1が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @e[family=mtc_body,c=1] mtc_fid


# 実行主mtc_fidと同じmtc_fidを持つ車体のmtc_calc2が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc2 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc2 -= @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] mtc_fid


# 実行
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_nsound1] run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_nsound1]  run tag @e[family=mtc_body,scores={mtc_calc2=0}] remove mtc_nsound1
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_revtag] run tag @e[family=mtc_body,scores={mtc_calc2=0}] add mtc_nsound1

tag @e remove mtc_revtag

execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_nsound1]  run scriptevent mtc:soundon 1
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_nsound1] run scriptevent mtc:soundoff 1

