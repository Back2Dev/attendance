//
import faker from 'faker'
import Members from '/imports/api/members/schema'

faker.seed(111)

const ISODate = date => {
  return new Date(date)
}

const NumberInt = n => {
  return parseInt(n)
}

export default populateShop = () => {
  Members.insert({
    mobile: '0438 002 921',
    email: 'Mikkel@almsford.org',
    name: 'Mike King',
    avatar: 'test21.png',
    isHere: false,
    isSuper: false,
    joined: ISODate('2019-04-07T03:00:40.033+01:00'),
    lastIn: ISODate('2019-08-14T08:48:01.622+01:00'),
    sessions: [],
    sessionCount: NumberInt(0),
    createdAt: ISODate('2019-04-07T03:01:14.825+01:00'),
    updatedAt: ISODate('2019-10-09T11:37:00.884+01:00'),
    pin: '2701',
    status: 'current',
    expiry: ISODate('2020-06-23T09:40:33.405+01:00'),
    subsType: 'member',
    remaining: NumberInt(0),
    paymentCustId: 'cus_QPZO1sYXkrv6_POq2LEWMA',
    wwccOk: true,
    wwcc: '01819845',
    wwccExpiry: ISODate('2020-02-02T13:00:00.000+00:00'),
    wwccSurname: 'King'
  })
}
