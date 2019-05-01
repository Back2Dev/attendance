# B2B Login flow

```mermaid
graph TD
classDef green fill:#9f6,stroke:#333,stroke-width:2px
class A green
AA[Find member] -- Tap picture --> HASPIN{Has PIN?}
HASPIN -- no PIN --> CP(Create Pin)
CP --> HASDETAILS{have details?}
HASDETAILS -- have details --> RETURN(Main Menu)
HASDETAILS -- no details --> EDIT(Edit profile)
HASPIN -- has PIN --> HASDETAILS
EDIT -- saved --> SELECT
LEGEND(Back2bikes sign in<br>Life cycle diagram)

style LEGEND fill:lemonchiffon,stroke:#333,stroke-width:2px
style HASPIN fill:lightblue,stroke:#333,stroke-width:2px
style HASDETAILS fill:lightblue,stroke:#333,stroke-width:2px
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTcwNTE2Nzg0OCw2NDM5OTU0NzMsMjQyMz
A1NTM3XX0=
-->