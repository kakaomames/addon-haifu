# 実行主mtc_fidと同じmtc_fidを持つ車体のmtc_calc1が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @s mtc_fid

# mtc_carも含めた同一編成車体にmtc_sfタグ付与
tag @e[family=mtc_runnable] remove mtc_sf
execute as @e[family=mtc_body,scores={mtc_calc1=0}] at @s run tag @e[family=mtc_runnable,r=1,c=2] add mtc_sf
