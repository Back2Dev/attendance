//
// Test data for SLSA import. Data format is as it comes out of SUrf Guard
//
const data = `Member ID,Last Name,First Name,Status,Season
911,Blick,Herminio,Active,2018/2019
911,Blick,Herminio,Active,2019/2020
912,Cartwright,Hope,Active,2019/2020
913,Kovacek,Dorothea,Active,2018/2019
`

export default data

export const currentNames = season => {
  // Split into rows:
  const header = data.split(/\n/)[0].split(/,/)
  const [lastix, firstix, seasonix] = [
    header.indexOf('Last Name'),
    header.indexOf('First Name'),
    header.indexOf('Season')
  ]
  return data.split(/\n/).map(row => {
    const fields = row.split(/,/)
    return (fields[seasonix] === season) ? `${fields[firstix]} ${fields[lastix]}` : null
  })
    .filter(x => x)
}