# attendance-app
Workshop attendance app for back2bikes volunteers.  
This app's intention is to address this [Problem Statement](http://devblog.back2bikes.com.au:8080/blog/attendance/)
# Get up and running
#### Clone this repo  
`git clone https://github.com/Back2bikes/attendance.git`   

#### Move into the meteor app directory
`cd attendance/meteor-app`

#### Install the npm packages  
`meteor npm i`  
*running this command with `meteor` installs packages much like `npm i` does, but lets meteor know about it too.

#### Start the app  
`npm run start` or `meteor run`

Meteor will start up a client and a server running a MongoDB host. 

Meteor will look in these directories at startup:  
`meteor-app/server/`  
`meteor-app/client/`  

Other than that, The client loads much like a normal `Create-React-App` would if you are familiar with that.

#### Query the DB with mongo  
When you start up your app in developement, Meteor creates a local database for you, stored in `meteor-app/.meteor/local`

To interact with it, whilst meteor is running, in a new terminal run  
`meteor mongo`  
`show dbs`  
You should see  
```
meteor:PRIMARY> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
meteor  0.000GB
```  

`use meteor`  
`show collections`

You should see  
```
meteor:PRIMARY> show collections
members
sessions
```  

`db.members.find({})`  
`db.sessions.find({})`  

Note its not recommended to add records like this, as the ObjectId that Meteor gives the records is different to that of which MongoDb client would without some configuration.

### Shape of the data currently
#### Member record  
```
{
	"_id" : "aPvgGf7C7KbtdvrZ3",
	"avatar" : "7.jpg",
	"sessionCount" : 7,
	"sessions" : [ ],
	"lastIn" : ISODate("2018-06-30T23:07:06.174Z"),
	"addressPostcode" : "3227",
	"addressState" : "VIC",
	"addressStreet" : "991 Orville Wall Apt. 501",
	"addressSuburb" : "Melbourne",
	"bikesHousehold" : 5,
	"email" : "Liza.Reynolds@Ibrahim.net",
	"emergencyContact" : "Maude Huel",
	"emergencyEmail" : "Lonny_Deckow@yahoo.com",
	"emergencyMobile" : "422-284-8924",
	"emergencyPhone" : "182-735-2485",
	"mobile" : "816-274-8144",
	"name" : "Herminio Blick",
	"phone" : "060-334-2244",
	"workStatus" : "Unemployed",
	"reasons" : "Corporis voluptatem dolores esse. Et repudiandae magnam aut atque dolores voluptatibus ut. Iusto laborum placeat quia deleniti dolorem quibusdam.",
	"primaryBike" : "Ladies",
	"isHere" : false,
	"isSuper" : false,
	"joined" : ISODate("2018-07-04T00:07:05.651Z"),
	"createdAt" : ISODate("2018-07-04T00:07:06.194Z")
}
```
#### Session record  
```
{
	"_id" : "PrrvqL2zg4sWAipvd",
	"memberId" : "2syNbSYsd8C7WeMwF",
	"timeIn" : ISODate("2018-07-04T00:34:08.930Z"),
	"timeOut" : ISODate("2018-07-04T06:34:08.930Z"),
	"duration" : 6,
	"createdAt" : ISODate("2018-07-04T00:34:08.934Z")
}
```

### Populating data  
Currently there is a script that populates the Members collection with dummy data. This is only in use for development. The script is in  
`meteor-app/imports/startup/server/members-data.js`  
If you need to reset the data to the initial state populated with some random members, run  
`meteor reset`  
This blows all away all the DB data.
When you next run `meteor run` the startup script will pick up that the collection is empty and repopulate.
Remember to add any new columns to the dummy data function if you change the shape of the data, as the app grows.  

### Schemas
Schemas are located in `meteor-app/imports/api/`

### Meteor Publish / Subscribe, a simple intro
  
The beauty of meteor is that serves up data that updates the client instantly via sockets. It does this via publications and subscriptions. You publish data on the server, and you subscribe in the client, any updates to data get dynamically updated in client.

### Collection model
```
// meteor-app/imports/api/members
const Members = new Mongo.Collection('members')

export const MembersSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 128,
  },
  // and so on...
```
### Publication  
On the server, you return a mongoDB query
```
import Members from '../members';

Meteor.publish('all.members', () => {
  return Members.find({});
});
```
### Subscription  
In a container, you subscribe to the data and feed it in as props to the child components.  
`withTracker` is meteors version of redux's `connect`, in which you create a container that is data aware, or connected, and you give the data to the presentational, or 'dumb' components following Reacts 'unidirectional' data flow. Read up about this in the React docs if this isnt clear. 
https://reactjs.org/docs/thinking-in-react.html  

Note that you have to use the same query on the client, that you used in the publication on the server.
This is because if you have multiple publications going, with different projections, ie sorting, limiting etc, Meteor mashes them all together and keeps a cache of all of these on something called `MiniMongo`, a client side Mongo.  
```
const AdminContainer = withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  const members = Members.find({}).fetch()
  const loading = !membersHandle.ready()

  return {
    loading,
    members,
  }
})(Admin)
```



### Create publications 

# User Interface
The UI has been roughed out and the pics below are intended as a guide only.

![main app](https://github.com/Back2bikes/attendance-app/blob/master/docs/UI%20Pics/attenApp_Main.jpg)
*Good work Joe!*

![modal confirmation](https://github.com/Back2bikes/attendance-app/blob/master/docs/UI%20Pics/attenApp_Modal.jpg)
*I'm not sure if we have any fat cat volunteers*

## Check-in Confirmation assumptions
- Attendance is based on an honour system. No one really needs to sign in or out so ...
- Attendance is more of a check in process
- Attendees usually have a rough idea how long they're going to be in the work shop for, so when they check in they just need to indicate that up front - which obviates the need to "sign out". If they skip off home after half an hour, no biggie.

#### For some reason github displays this horizontally not vertically ...
![the picture](https://github.com/Back2bikes/attendance-app/blob/master/docs/UI%20Pics/attenApp_bigPicture.jpg)
It's because the orientation of the image is stored in the meta data, and github is respecting that :)

## React Epiphany
Plan to re-implement initial start using this overlay as the basis for react componentry:
![the picture](https://github.com/Back2bikes/attendance-app/blob/master/docs/UI%20Pics/ui-1-layout-component-markup.jpg)

![modal confirmation](https://github.com/Back2bikes/attendance-app/blob/master/docs/UI%20Pics/ui-1-layout-modal-component-markup.jpg)
