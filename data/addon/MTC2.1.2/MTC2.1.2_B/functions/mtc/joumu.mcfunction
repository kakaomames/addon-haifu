#未常務にタグ付け
execute as @p unless entity @s[tag=mtc_ride] run tag @s add mtc_revtag

execute as @p at @s if entity @s[tag=mtc_revtag] run function mtc/board
execute as @p at @s if entity @s[tag=!mtc_revtag] run function mtc/unboard
tag @e remove mtc_revtag
