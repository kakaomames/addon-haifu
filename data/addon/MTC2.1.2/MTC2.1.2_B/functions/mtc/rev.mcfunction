function mtc/testBoard

# 実行
#execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if score @s mtc_calc2 matches ..-1 run 
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] run playsound mtc.notch @p[r=30] ~~~ 100
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_rev] run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_rev]  run tag @s remove mtc_rev
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_revtag] run tag @s add mtc_rev

tag @e remove mtc_revtag

# 編成全体にレバーサイベント
# 実行主mtc_fidと同じmtc_fidを持つ車体のmtc_calc2が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc2 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc2 -= @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] mtc_fid

execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=mtc_rev]  run event entity @e[family=mtc_body,scores={mtc_calc2=0}] revb
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0},c=1] at @s if entity @s[tag=!mtc_rev]  run event entity @e[family=mtc_body,scores={mtc_calc2=0}] revf
