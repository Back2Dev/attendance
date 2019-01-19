# Back2bikes assignment

## Background

Backbikes has an attendance app, which is used on the workshop computer for people to sign in on when they arrive.

People can add themselves to the app as a volunteer, and provide personal contact details and choose their own avatar.

On arriving at the workshop, they find themselves in the list and sign in. Sign out is automatic at the end of the day.

The app is also to be used for workstand time. These are generally run of an evening. There is a cost for these sessions, you can pay at the time, or you can buy a 12 session pass, or you can buy a 6 month or 12 month membership, these plans allow unlimited workshop time.

## Assignment

We need a native app to perform the following functions:

- Initial app set up page, find user in database and save PIN number
- View attendance history (free and paid)
- View account balance
  - Sessions remaining
- Buy one of
  - Casual visits (any quantity, usually 10)
  - 6 month membership
  - 12 month membership
- View payment history

## Technical details

There is an existing backend system written using Meteor, which manages the database. Any data is available to your app using npm module `react-native-meteor`. Data can be read/written with simple method calls to meteor. All back end method calls will be provided for you. We will need to discuss what data you require.

## Technology stack

- React Native
- React web (if required)
- Meteor
- Storybook
- Jest test runner
- Cypress end to end testing

### Contact

```
Mike King
mikkel@back2bikes.com.au
0438 002 921
```
