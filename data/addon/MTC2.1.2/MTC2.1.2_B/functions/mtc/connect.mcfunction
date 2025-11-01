# 最寄りの車両がその次に近い車両と連結する

# 制御タグ初期化
tag @e[family=mtc_body] remove mtc_resconn
tag @e[family=mtc_body] remove mtc_connerr
tag @e[family=mtc_body] remove mtc_tryconn

# 最寄り車両が連結可能(自分のIDをparentIDにもつ車両が無い)なら，calc1=0
scoreboard players set @e[family=mtc_body,c=1] mtc_calc1 1
execute as @e[family=mtc_body,c=1] at @s run scoreboard players operation @e[family=mtc_body] mtc_calc2 = @s mtc_uid
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc2 -= @s mtc_parent
execute unless entity @e[family=mtc_body,scores={mtc_calc2=0}] run scoreboard players set @e[family=mtc_body,c=1] mtc_calc1 0

# 最寄り車両が連結可能なら被連結車タグ付与
execute as @e[family=mtc_body,c=1] unless entity @s[r=30] run tellraw @a[r=30] {"rawtext":[{"text":"§c30m以内に連結可能な車両がありません"}]}
execute as @e[family=mtc_body,r=30,c=1] unless entity @s[scores={mtc_calc1=0}] run tellraw @a[r=30] {"rawtext":[{"text":"§c既に連結されています"}]}
tag @e[family=mtc_body,r=30,c=1,scores={mtc_calc1=0}] add mtc_resconn
# 全先頭車両が被連結車探索
execute as @e[family=mtc_body,r=30,c=1] if entity @s[scores={mtc_calc1=0}] run tag @e[family=mtc_body,tag=mtc_parent] add mtc_tryconn
execute as @e[family=mtc_body,r=30,c=1] if entity @s[scores={mtc_calc1=0}] run tag @e[family=mtc_body,tag=mtc_parent] add mtc_conn
