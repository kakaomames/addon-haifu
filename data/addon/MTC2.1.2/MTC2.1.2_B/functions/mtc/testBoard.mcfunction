# 実行時の最寄りのプレイヤーのmtc_parentと同じuidの車体か最寄りの車体の先頭のcalc1を0にする

# 同一uidのcalc1を0にする
execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_calc1 = @s mtc_uid
scoreboard players operation @e[family=mtc_body,tag=mtc_parent] mtc_calc1 -= @p mtc_parent

# 0になった車両が無い場合
execute unless entity @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0}] as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_calc1 = @s mtc_uid
execute unless entity @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0}] as @e[family=mtc_body,c=1] run scoreboard players operation @e[family=mtc_body,tag=mtc_parent] mtc_calc1 -= @s mtc_fid

