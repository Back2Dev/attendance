# End to end testing using Cypress

End to end testing is a critical part of the development process.

Component tests and integration tests serve their own purpose, but 
end-to-end testing will help to highlight when things are broken in the UI.

The more of these we can write, the less time it will take us to do manual QA

## Getting started

Cypress should already be installed if you have done a `meteor npm install`

The following terminal commands can be used to run tests:

* Runs meteor with a local database: `npm run local`
* Runs Cypress in interactive mode: `npm run cypress:open`
* Runs Cypress in headless mode: `npm run cypress:run`

## Organisation of files and folders

Cypress will run tests in alphabetical order. As the list of tests grow, tests may have some order dependencies, so planning ahead, we will group tests into folders, eg

* `00-logins`
* `01-school-edit`
* `02-survey`

The number prefix is there to force the sort order.

Within the folder, file names should be prefixed with a 2 digit number the same way, eg `00-`

## Writing the scripts

* Use of `beforeEach()` and `afterEach()`
* Make each test self standing (ie not dependent on previous tests), and immutable (ie not changing data)
* Test should be re-runnable

## Browser differences

Cypress by default targets Chrome (69), but there is also an option to run the tests against the Electron browser (currently an older Chrome version, 59).

If you have Canary installed, it will detect that, and offer it as a target.

The headless tests are run using the Electron 59 browser, which is what CircleCI uses, so it is important to make sure that your tests run against this target too.

This way we can cover 

* Older browser (Electron)
* Current browser (Chrome)
* Future browser (Canary)

I believe Firefox support is planned

There are also timing differences between headless mode and browser mode, so you should also include command line runs as a final stage of your workflow.

## Use of id's, or data-testid

Cypress scripts will need references to html elements such as labels, buttons etc. We will normally use `id`, as much of the application code doesn't use them.

It may be that we need to generate id's for elements dynamically, and in some cases it becomes difficult to work out a unique id for the test script, so in these cases we will fall back to using `data-testid="xxx"` to uniquely identify html elements.