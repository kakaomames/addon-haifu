# 制御タグ初期化
tag @e[family=mtc_body] remove mtc_resconn
tag @e[family=mtc_body] remove mtc_connerr
tag @e[family=mtc_body] remove mtc_tryconn
tag @e[family=mtc_body] remove mtc_automaster

# 自車がさらに前と連結
tag @s add mtc_tryconn
tag @s add mtc_connclassic
tag @s add mtc_connsilent
tag @s add mtc_conn2
