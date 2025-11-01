
tag @s[type=mtc:set,tag=!STIM0,tag=!STIM1,tag=!STIM2,tag=!STIM3,tag=!STIM4,tag=!STIM5,tag=!STIM6,tag=!STIM7,tag=!STIM8,tag=!STIM9,tag=!STIM10] add nSTIM0
tag @s[type=mtc:set,tag=STIM0] add nSTIM1
tag @s[type=mtc:set,tag=STIM1] add nSTIM2
tag @s[type=mtc:set,tag=STIM2] add nSTIM3
tag @s[type=mtc:set,tag=STIM3] add nSTIM4
tag @s[type=mtc:set,tag=STIM4] add nSTIM5
tag @s[type=mtc:set,tag=STIM5] add nSTIM6
tag @s[type=mtc:set,tag=STIM6] add nSTIM7
tag @s[type=mtc:set,tag=STIM7] add nSTIM8
tag @s[type=mtc:set,tag=STIM8] add nSTIM9
tag @s[type=mtc:set,tag=STIM9] add nSTIM10
tag @s[type=mtc:set,tag=STIM10] add nSTIM10

tag @s[type=mtc:set] remove STIM0
tag @s[type=mtc:set] remove STIM1
tag @s[type=mtc:set] remove STIM2
tag @s[type=mtc:set] remove STIM3
tag @s[type=mtc:set] remove STIM4
tag @s[type=mtc:set] remove STIM5
tag @s[type=mtc:set] remove STIM6
tag @s[type=mtc:set] remove STIM7
tag @s[type=mtc:set] remove STIM8
tag @s[type=mtc:set] remove STIM9
tag @s[type=mtc:set] remove STIM10

tag @s[type=mtc:set,tag=nSTIM0] add STIM0
tag @s[type=mtc:set,tag=nSTIM1] add STIM1
tag @s[type=mtc:set,tag=nSTIM2] add STIM2
tag @s[type=mtc:set,tag=nSTIM3] add STIM3
tag @s[type=mtc:set,tag=nSTIM4] add STIM4
tag @s[type=mtc:set,tag=nSTIM5] add STIM5
tag @s[type=mtc:set,tag=nSTIM6] add STIM6
tag @s[type=mtc:set,tag=nSTIM7] add STIM7
tag @s[type=mtc:set,tag=nSTIM8] add STIM8
tag @s[type=mtc:set,tag=nSTIM9] add STIM9
tag @s[type=mtc:set,tag=nSTIM10] add STIM10

tag @s[type=mtc:set] remove nSTIM0
tag @s[type=mtc:set] remove nSTIM1
tag @s[type=mtc:set] remove nSTIM2
tag @s[type=mtc:set] remove nSTIM3
tag @s[type=mtc:set] remove nSTIM4
tag @s[type=mtc:set] remove nSTIM5
tag @s[type=mtc:set] remove nSTIM6
tag @s[type=mtc:set] remove nSTIM7
tag @s[type=mtc:set] remove nSTIM8
tag @s[type=mtc:set] remove nSTIM9
tag @s[type=mtc:set] remove nSTIM10

execute if entity @s[type=mtc:set,tag=STIM0] run function mtc_inner/set1
execute if entity @s[type=mtc:set,tag=STIM3] run function mtc_inner/set2
execute if entity @s[type=mtc:set,tag=STIM9] run function mtc_inner/set4
