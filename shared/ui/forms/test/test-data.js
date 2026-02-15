const forms = {
  text1: {
    text: `S Text tester

    Q This is a header
    
    Q This is a question, one attribute
    +id=text1
    +type=text
    A=
    
    Q Your name, 2 attributes, no ids
    +type=text
    A First name
    A Last name
    
    Q Your name, 2 attributes and all ids
    +id=text2
    +type=text
    A First name
    +id=first
    A Last name
    +id=last
    
    Q Text of differing types
        +id=textTypes
        +type=text
    A Name
        +id=name
    A Mobile
        +id=mobile
        +type=mobile
    A Address
        +id=address
        +type=address
    A Age last birthday (years)
        +id=age
        +type=number
    A Email
        +id=email
        +type=email
    A Password
        +id=password
        +type=password
    
    `,
    compiled: {
      steps: [
        {
          questions: [
            {
              answers: [],
              grid: [],
              id: 'this-is-a-header',
              type: 'text',
              object: 'question',
              lineno: 3,
              prompt: 'This is a header',
            },
            {
              answers: [
                {
                  title: '',
                  id: 'no-slug',
                  type: 'text',
                  object: 'answer',
                  lineno: 8,
                },
              ],
              grid: [],
              id: 'text1',
              type: 'text',
              object: 'question',
              lineno: 5,
              prompt: 'This is a question, one attribute',
            },
            {
              answers: [
                {
                  id: 'first-name',
                  type: 'text',
                  object: 'answer',
                  lineno: 12,
                  name: 'First name',
                },
                {
                  id: 'last-name',
                  type: 'text',
                  object: 'answer',
                  lineno: 13,
                  name: 'Last name',
                },
              ],
              grid: [],
              id: 'your-name-2-attributes-no-ids',
              type: 'text',
              object: 'question',
              lineno: 10,
              prompt: 'Your name, 2 attributes, no ids',
            },
            {
              answers: [
                {
                  id: 'first',
                  type: 'text',
                  object: 'answer',
                  lineno: 18,
                  name: 'First name',
                },
                {
                  id: 'last',
                  type: 'text',
                  object: 'answer',
                  lineno: 20,
                  name: 'Last name',
                },
              ],
              grid: [],
              id: 'text2',
              type: 'text',
              object: 'question',
              lineno: 15,
              prompt: 'Your name, 2 attributes and all ids',
            },
            {
              answers: [
                {
                  id: 'name',
                  type: 'text',
                  object: 'answer',
                  lineno: 26,
                  name: 'Name',
                },
                {
                  id: 'mobile',
                  type: 'mobile',
                  object: 'answer',
                  lineno: 28,
                  name: 'Mobile',
                },
                {
                  id: 'address',
                  type: 'address',
                  object: 'answer',
                  lineno: 31,
                  name: 'Address',
                },
                {
                  id: 'age',
                  type: 'number',
                  object: 'answer',
                  lineno: 34,
                  name: 'Age last birthday (years)',
                },
                {
                  id: 'email',
                  type: 'email',
                  object: 'answer',
                  lineno: 37,
                  name: 'Email',
                },
                {
                  id: 'password',
                  type: 'password',
                  object: 'answer',
                  lineno: 40,
                  name: 'Password',
                },
              ],
              grid: [],
              id: 'textTypes',
              type: 'text',
              object: 'question',
              lineno: 23,
              prompt: 'Text of differing types',
            },
          ],
          id: 'text-tester',
          object: 'step',
          lineno: 1,
          name: 'Text tester',
        },
      ],
      name: 'Sample Survey',
      slug: 'sample',
      version: '1',
      active: true,
    },
    fields:
      'text1 text2__first text2__last textTypes__password textTypes__email your-name-2-attributes-no-ids__first-name',
  },
}
export default forms
