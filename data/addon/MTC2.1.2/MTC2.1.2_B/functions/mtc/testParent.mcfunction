# 実行主mtc_parentと同じmtc_uidを持つ車体のmtc_calc1が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_uid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @s mtc_parent
