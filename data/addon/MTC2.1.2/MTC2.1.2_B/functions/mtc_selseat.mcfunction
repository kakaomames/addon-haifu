# 最寄り車両mtc_fidと同じmtc_fidを持つ車体のmtc_calc1が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @e[family=mtc_body,c=1] mtc_fid

execute as @e[family=mtc_body,scores={mtc_calc1=0}] at @s run tag @s add mtc_selseat
execute as @e[family=mtc_body,scores={mtc_calc1=0}] at @s run function mtc/ride_seat

