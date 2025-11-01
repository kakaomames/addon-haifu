function mtc/testParent

# 自身の親が自分と違うfid持ってたらそれに書き換え
execute unless score @s mtc_fid = @e[family=mtc_body,scores={mtc_calc1=0},c=1] mtc_fid run scoreboard players operation @s mtc_fid = @e[family=mtc_body,scores={mtc_calc1=0},c=1] mtc_fid

# 自身の親が見つからない場合，自動解結
execute unless entity @e[family=mtc_body,scores={mtc_calc1=0},c=1] at @s run function mtc/do_disconnect

