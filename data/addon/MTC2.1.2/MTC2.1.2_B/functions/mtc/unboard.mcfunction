execute as @p if entity @s[tag=mtc_ride] at @s run scoreboard players set @p mtc_parent 0
execute as @p if entity @s[tag=mtc_ride] at @s run title @p actionbar 乗務を終了しました
execute as @p if entity @s[tag=mtc_ride] at @s run tag @p remove mtc_ride
