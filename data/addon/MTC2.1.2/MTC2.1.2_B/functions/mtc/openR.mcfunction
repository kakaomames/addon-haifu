# 親車両から実行
# 実行主mtc_fidと同じmtc_fidを持つ車体のmtc_calc1が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @s mtc_fid

execute unless entity @s[tag=mtc_open] run event entity @e[scores={mtc_calc1=0}] openR
execute unless entity @s[tag=mtc_open] as @e[family=mtc_body,scores={mtc_calc1=0}] at @s run scriptevent mtc:inner_pg_openR
execute unless entity @s[tag=mtc_open] run tag @e[scores={mtc_calc1=0}] add mtc_openR
execute unless entity @s[tag=mtc_open] run tag @e[scores={mtc_calc1=0}] add mtc_open
