# mtc_calc1はconnectから引き継ぎ
# 回転
#execute if entity @s[rym=0,ry=0] as @e[family=mtc_body,c=1] at @s unless entity @s[rym=0,ry=0] run tp @s ~~~ 0
#execute if entity @s[rym=180,ry=180] as @e[family=mtc_body,c=1] at @s if entity @s[rym=-179,ry=179] run tp @s ~~~ 180
#execute if entity @s[rym=-180,ry=-180] as @e[family=mtc_body,c=1] at @s if entity @s[rym=-179,ry=179] run tp @s ~~~ 180
#execute if entity @s[rym=90,ry=90] as @e[family=mtc_body,c=1] at @s unless entity @s[rym=90,ry=90] run tp @s ~~~ 90
#execute if entity @s[rym=-90,ry=-90] as @e[family=mtc_body,c=1] at @s unless entity @s[rym=-90,ry=-90] run tp @s ~~~ -90
#tp @s ~~~ 0
#execute as @e[family=mtc_body,c=1] at @s run tp @s ~~~ 0
tag @s add mtc_temp_conn
execute as @e[family=mtc_body,c=1] at @s run scriptevent mtc:conrot
scoreboard players set @e[family=mtc_body,c=1] mtc_rot 20

# 自身が最寄りに連結
execute at @s run tag @e[type=mtc:mtc_proc,r=1,c=1] add mtc_kill
execute at @s run tp @e[type=mtc:mtc_proc,r=1,c=1] ~ 10000 ~
execute at @s run ride @e[type=mtc:mtc_car,r=1,c=1] evict_riders
execute at @s run tp @e[type=mtc:mtc_car,r=1,c=1] ~ -10000 ~
tag @s remove mtc_parent

scoreboard players operation @s mtc_parent = @e[family=mtc_body,c=1,scores={mtc_calc1=!0}] mtc_uid
scoreboard players operation @s mtc_fid = @e[family=mtc_body,c=1,scores={mtc_calc1=!0}] mtc_fid

