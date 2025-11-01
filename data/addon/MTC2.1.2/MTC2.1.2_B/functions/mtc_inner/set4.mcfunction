#4
scoreboard players set tick10 mtc_global 0
tag @e[family=mtc_body] add mtc_conn
tag @e[family=mtc_body] add mtc_connsilent
scriptevent mtc:init

tellraw @a {"rawtext":[{"text":"§eMTCの導入に成功しました"}]}
tellraw @a {"rawtext":[{"text":"§a既に設置されている車両は再度設置するまで正常に動作しない可能性があります"}]}
tellraw @a {"rawtext":[{"text":"§aワールドを一度閉じてから開き直すことをお勧めします"}]}
tp @s ~ 10000 ~
tag @s add mtc_kill
