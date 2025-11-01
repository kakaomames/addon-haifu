# 親車両から実行
# 実行主mtc_fidと同じmtc_fidを持つ車体のmtc_calc1が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @s mtc_fid

event entity @e[scores={mtc_calc1=0},tag=mtc_openL] closeL
event entity @e[scores={mtc_calc1=0},tag=mtc_openR] closeR
event entity @e[scores={mtc_calc1=0},tag=mtc_openB] closeB

execute as @e[family=mtc_body,scores={mtc_calc1=0},tag=mtc_openL] at @s run scriptevent mtc:inner_pg_closeL
execute as @e[family=mtc_body,scores={mtc_calc1=0},tag=mtc_openR] at @s run scriptevent mtc:inner_pg_closeR
execute as @e[family=mtc_body,scores={mtc_calc1=0},tag=mtc_openB] at @s run scriptevent mtc:inner_pg_closeL
execute as @e[family=mtc_body,scores={mtc_calc1=0},tag=mtc_openB] at @s run scriptevent mtc:inner_pg_closeR


tag @e[scores={mtc_calc1=0}] remove mtc_openL
tag @e[scores={mtc_calc1=0}] remove mtc_openR
tag @e[scores={mtc_calc1=0}] remove mtc_openB
tag @e[scores={mtc_calc1=0}] remove mtc_open
