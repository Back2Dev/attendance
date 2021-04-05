# Slingshot testing

This explains how to run tests on the Meteor-slingshot package.

The way that Meteor testing works, packages can't be tested without a host Meteor application.
The tests themselves are mostly self contained, but there are some environment settings required.

Follow the instructions below:

## Getting started

Clone this repo

```
git clone https://github.com/Back2bikes/my-uniforms-sample
cd my-uniforms-sample
```

Go into the packages folder and bring in the slingshot package to the folder:

```
cd packages
git clone https://github.com/Back2bikes/meteor-slingshot slingshot
```

now run the tests:

```
cd ..
npm run test:packages
```
