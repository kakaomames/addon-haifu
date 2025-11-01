# 個々先頭車実行
# 実行主mtc_fidと同じmtc_fidを持つ車体のmtc_calc1が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @s mtc_fid

# 衝突防止

execute if entity @s[tag=!mtc_rev] as @e[family=mtc_body,scores={mtc_calc1=0}] at @s positioned ^^^2 if entity @e[r=1.5,family=mtc_body] at @s run function mtc_stop
execute if entity @s[tag=mtc_rev] as @e[family=mtc_body,scores={mtc_calc1=0}] at @s positioned ^^^-2 if entity @e[r=1.5,family=mtc_body] at @s run function mtc_stop
