# プレイヤー個々実行
execute as @e[family=mtc_body,tag=mtc_parent] run scoreboard players operation @s mtc_calc1 = @s mtc_uid
scoreboard players operation @e[family=mtc_body,tag=mtc_parent] mtc_calc1 -= @p mtc_parent

execute unless entity @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0}] run tellraw @p {"rawtext":[{"text":"§c乗務車両が見つからないため，乗務を終了します"}]}
execute unless entity @e[family=mtc_body,tag=mtc_parent,scores={mtc_calc1=0}] run function mtc/unboard