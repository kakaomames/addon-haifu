function mtc/testBoard

# 実行
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_ani1] run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_ani1]  run tag @s remove mtc_ani1
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_revtag] run tag @s add mtc_ani1

tag @e remove mtc_revtag

# 編成全体にイベント
# 実行主mtc_fidと同じmtc_fidを持つ車体のmtc_calc2が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc2 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc2 -= @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] mtc_fid

execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_ani1]  run scriptevent mtc:anion 1
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_ani1]  run scriptevent mtc:anioff 1
