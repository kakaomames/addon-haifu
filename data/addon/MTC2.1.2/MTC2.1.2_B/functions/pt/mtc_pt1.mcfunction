# 実行主mtc_fidと同じmtc_fidを持つ車体のmtc_calc1が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @e[family=mtc_body,c=1] mtc_fid

tag @e[family=mtc_body,scores={mtc_calc1=0}] add mtc_pt1
tag @e[family=mtc_body,scores={mtc_calc1=0}] remove mtc_pt2
tag @e[family=mtc_body,scores={mtc_calc1=0}] remove mtc_pt3
