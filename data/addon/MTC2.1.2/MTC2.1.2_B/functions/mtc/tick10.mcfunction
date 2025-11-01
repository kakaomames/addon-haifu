# 乗務
title @a[tag=mtc_ride] actionbar 乗務中
execute as @a[tag=mtc_ride] at @s run function mtc/autounboard

# 線路外検知
tag @e[tag=mtc_parent] remove mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,scores={mtc_norail=0..}] at @s if block ~~~ rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s if block ~~~ golden_rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s if block ~~~ detector_rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s if block ~~~ activator_rail run tag @s add mtc_revtag

execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s rotated ~ 0 if block ^1^^ rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s rotated ~ 0 if block ^1^^ golden_rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s rotated ~ 0 if block ^1^^ detector_rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s rotated ~ 0 if block ^1^^ activator_rail run tag @s add mtc_revtag

execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s rotated ~ 0 if block ^-1^^ rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s rotated ~ 0 if block ^-1^^ golden_rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s rotated ~ 0 if block ^-1^^ detector_rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s rotated ~ 0 if block ^-1^^ activator_rail run tag @s add mtc_revtag
execute as @e[family=mtc_body,tag=mtc_parent,tag=!mtc_revtag,scores={mtc_norail=0..}] at @s if entity @s[tag=mtc_on_newrail_b] run tag @s add mtc_revtag

execute as @e[tag=mtc_parent,tag=!mtc_revtag,tag=!mtc_plane,scores={mtc_norail=0..}] run scoreboard players operation @s mtc_norail += @s mtc_spd
scoreboard players set @e[tag=mtc_parent,tag=!mtc_plane,tag=mtc_revtag] mtc_norail 0

scoreboard players set @e[tag=mtc_parent,tag=!mtc_plane,scores={mtc_norail=720001..}] mtc_spd 0
scoreboard players set @e[tag=mtc_parent,tag=!mtc_plane,scores={mtc_norail=720001..}] mtc_not -1
scoreboard players set @e[tag=mtc_parent,tag=!mtc_plane,scores={mtc_norail=720001..}] mtc_ato -1
scoreboard players set @e[tag=mtc_parent,tag=!mtc_plane,scores={mtc_norail=720001..}] mtc_norail -1
tag @e[tag=mtc_parent] remove mtc_revtag

# mascon
execute as @e[family=mtc_body,tag=mtc_parent] run tag @s add mtc_mas_v2
execute as @e[family=mtc_body,tag=mtc_parent] run tag @s add mtc_mode_v2

# 座席乗車
function mtc/ride_seat

# 座席消去(api化)
#ride @e[type=mtc:seat] summon_ride mtc:death skip_riders

# 暴走母体対策
execute as @e[family=mtc_car] at @s positioned ~~-2.3~ unless entity @e[family=mtc_body,tag=mtc_parent,tag=!mtc_norail,r=7] run tag @s add mtc_kill
execute as @e[family=mtc_car] at @s positioned ~~-2.3~ unless entity @e[family=mtc_body,tag=mtc_parent,tag=!mtc_norail,r=7] run tp @s ~ -10000 ~

# 走行母体を失った車両
# 母体召喚
execute as @e[tag=mtc_parent,tag=!mtc_norail,family=mtc_body] at @s positioned ~~-2.3~ unless entity @e[type=mtc:mtc_car,r=7] run summon mtc:mtc_car
execute as @e[type=mtc:mtc_proc] at @s run ride @s start_riding @e[type=mtc:mtc_car,c=1]
# proc召喚
execute as @e[type=mtc:mtc_car] at @s unless entity @e[type=mtc:mtc_proc,r=7] run ride @s summon_rider mtc:mtc_proc

# 遅延キル
kill @e[family=mtc_obj,tag=mtc_kill2]
tag @e[family=mtc_obj,tag=mtc_kill] add mtc_kill2
