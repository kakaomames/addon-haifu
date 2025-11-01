# 最寄りの車両がその次に近い車両と連結する
# 連結元車両として実行

# 連結先fidが同じじゃない条件付き
# 実行主mtc_fidと同じmtc_fidを持つ車体のmtc_calc1が0になる
execute as @e[family=mtc_body] run scoreboard players operation @s mtc_calc1 = @s mtc_fid
scoreboard players operation @e[family=mtc_body] mtc_calc1 -= @s mtc_fid

# 前方連結
execute if entity @s[tag=mtc_connclassic] run tag @e[family=mtc_body,scores={mtc_calc1=!0},r=2.4,c=1] add mtc_resconn
execute if entity @s[tag=mtc_connclassic] unless entity @e[family=mtc_body,scores={mtc_calc1=!0},r=2.4] run tag @s add mtc_connerr

# 通常連結
execute if entity @e[family=mtc_body,scores={mtc_calc1=!0},r=2.4,tag=mtc_resconn] at @e[tag=mtc_resconn,c=1] run tellraw @a[r=30] {"rawtext":[{"text":"§a連結しました"}]}
execute unless entity @e[family=mtc_body,scores={mtc_calc1=!0},r=2.4,tag=mtc_resconn] run tag @s add mtc_connerr

# 失敗タグが無い車両無し=全失敗
execute unless entity @s[tag=mtc_connsilent] unless entity @e[family=mtc_body,tag=mtc_tryconn,tag=!mtc_connerr] at @e[tag=mtc_resconn,c=1] run tellraw @a[r=30] {"rawtext":[{"text":"§c連結可能距離2.4m範囲内に連結先がありません"}]}

# 成功
tag @e[family=mtc_body,scores={mtc_calc1=!0},r=2.4,tag=mtc_resconn] remove mtc_automaster
execute if entity @e[family=mtc_body,scores={mtc_calc1=!0},r=2.4,tag=mtc_resconn] run function mtc/do_connect

# 後処理
tag @s remove mtc_connsilent
tag @s remove mtc_connclassic

# 自動連結1失敗
execute unless entity @e[family=mtc_body,tag=mtc_tryconn,tag=!mtc_connerr] at @e[tag=mtc_resconn,c=1] as @e[family=mtc_body,tag=mtc_automaster,c=1] at @s run function mtc/auto_connect2

# calc2=mtc_uidにしたエンティティ欲しい
summon mtc:mtc_headloc
scoreboard players operation @e[type=mtc:mtc_headloc,c=1] mtc_calc2 = @s mtc_uid
scriptevent mtc:inner_body_length
