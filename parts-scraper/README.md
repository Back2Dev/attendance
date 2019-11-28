1. get part list from wholesaler (ive used old 2017 list)

2. put `parts.xlsx` file in the `in` directory

# extract parts from the parts list

3. `yarn parse`

4. move output of this command into `in` directory

5. run `yarn scrape`

Not sure which file format you want, it appends to a csv file as it runs, and then afterwards it writes a json file. You may want to tweak this, all the code is in there to write to csv / json anyways. :)
