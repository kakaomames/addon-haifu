# 最寄りの車両を解結状態にする

# 最寄り車両が解結可能(自分のIDをparentIDにもつ車両がある)なら，calc1=0
scoreboard players set @e[family=mtc_body,c=1] mtc_calc1 1
execute as @e[family=mtc_body,c=1] at @s run scoreboard players operation @e[family=mtc_body] mtc_calc2 = @s mtc_uid
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc2 -= @s mtc_parent
execute if entity @e[family=mtc_body,scores={mtc_calc2=0}] run scoreboard players set @e[family=mtc_body,c=1] mtc_calc1 0

execute as @e[family=mtc_body,c=1] unless entity @s[r=30] run tellraw @a[r=30] {"rawtext":[{"text":"§c30m以内に解結可能な車両がありません"}]}
execute as @e[family=mtc_body,r=30,c=1] if entity @s[scores={mtc_calc1=!0}] run tellraw @a[r=30] {"rawtext":[{"text":"§c既に解結されています"}]}
execute as @e[family=mtc_body,r=30,c=1] if entity @s[scores={mtc_calc1=0}] run tellraw @a[r=30] {"rawtext":[{"text":"§a解結しました"}]}

execute as @e[family=mtc_body,r=30,c=1] if entity @s[scores={mtc_calc1=0}] as @e[family=mtc_body,scores={mtc_calc2=0},c=1] at @s run function mtc/do_disconnect
