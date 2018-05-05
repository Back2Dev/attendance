# A syntax for surveys and recruitment forms

This is a specification for a simple syntax for defining surveys and recruitment forms

## Background

At present each customer has their own custom recruitment form. The technology we use has some drawbacks

  * Can only be done by a developer
  * Customisations take 1-2 days of effort (depending on complexity)
  * Needs a software release before the customer can see it
  * Modifications of any size need a software release into production
  * It is highly technical to program
  * There are many shortcomings and issues with the tools
  * Written in Blaze, it is difficult to test
  * Surveys are handled externally

## Rationale

By adopting a new, simpler syntax (and a new backend technology), we can put the 'programming' of a survey into less skilled hands, such as customer service, or technical support. The advantages include

  * Elimination of software releases
  * Reduction of risk (inherent with software releases)
  * Shorter programming time
  * Minor changes can be done instantly and tested with the customer
  * Less expensive people can do programming
  * Surveys can be done within the platform
    * Improved security
    * Reduces cost
    * Integrate with Sendgrid etc to track completion/reminders

# Syntax - general

The syntax definition is designed to be simple and easy to understand. It can be prepared using any text editor, or edited using the program edit function. It does not rely on indentation or bracket matching, although we recommend use of indentation to improve readability.

Each line of the file contains one of the following:
  * A directive, such as the start of a section, a question, or a response
  * A modifier, which applies to the previous directive


## Basics

### Preamble

In the preamble section is general information about the survey, 

### Sections

Each section starts with the 'Section' directive, eg

`Section: About you`

#### Section modifiers

| Modifier | Value | Description |
|---|---|---|
| `flow` | inline | questions will flow like written text in paragraphs |
|  | block | questions will each start on a new line |

#### Section example

```
Section: About you
  +flow=inline
```

### Questions

Each question starts with the 'Question' directive, which defines the variable for the data to be store in

`Q location`

#### Question modifiers

| Modifier | Value | Description |
|---|---|---|
| `prompt` | (free text) | The prompt of the question, eg 'where you work' |
| `type` | question type (optional) | defaults to string (see table below for supported question types)|
| `minWords` | [n] | The minimum number of words in the response |
| `matchlabel` | string | The label displayed when matching in PC match or my match |
| `placeholder` | string | Placeholder text to display before any data is present |
| `if` | expression | The question will appear only if the expression evaluates to true

#### Question types - single values

| Question type | Description |
|---|---|
| `text` | Use this for most questions. A text input box is shown for data entry |
| `textarea` | Use this for responses that will be longer or across more than one line |
| `password` | Same as `text`, except input is masked (shown as ***) |
| `email` | Same as `text`, except input must be a valid email address |
| `url` | Same as `text`, except input is checked to make sure it looks like  a URL |
explanatory text |
| `rating` | Only one response can be selected from a numeric rating scale (radio buttons)
#### Question types - multiple values

The previous question types assume a single response, and an attribute list is not required. These question types require an attribute list, because typically they require a response per attribute

| Question type | Description |
|---|---|
| `multi` | One or more responses can be selected from this list, typically displayed using checkboxes |
| `radio` | Only one response can be selected from this list, typically displayed using radio buttons |
| `slider` | Only one response can be selected using a slider. The slider may have numbers and anchors at either end, or a series of texts for each possible choice |
| `grid` | A grid of rating scales |

#### Special question types

These special question types are supported

| Question type | Description |
|---|---|
| `info` | Info blocks can be used to provide blocks of explanatory text without the need to gather information |
| `code` | Simple code blocks allow for the assignment of values and more complex expressions to be evaluated |

#### Question example

```
Q name
  +prompt=My name is
  +matchlabel
  +type=string
  +placeholder=Name and surname
  +minWords=2
```
In this case one response is assumed. If more than one response is possible


#### Question attributes

As discussed above, a question may assume a single response, or may require multiple responses

`  A response-text`

Question attributes are attached to the preceeding question. Any modifiers after an attribute apply to the attribute, not the question. Question modifiers should appear before any question attributes.

#### Question attribute example

```
  A New York
  A London
  A Paris, France
```

#### Attribute modifiers

Modifiers appearing after a question attribute apply to the attribute as below

| Modifier | Value | Description |
|---|---|---|
| `value` | number or text | The value to be stored for this question. If no value is specified, it will use the text of the attribute. |
| `skip` | question label | Skip to question if this attribute is selected | 

#### Question attribute modifier example

```
  A New York
    +value=NY
  A London
    +value=LON
  A Paris, France
    +value=PAR
```

#### Code blocks

Code blocks support some simple logic operations. 



## Sample questionnaire

```
Q name
  +prompt=My name is
  +var=name
  +type=string
  +placeholder=Name and surname
  +minWords=2

Q email
  +prompt=and my email is  
	+type=email

Q location
  +prompt=working in
  +match=office
  A New York
    +value=NY
  A London
    +value=LON
  A Paris, France
    +value=PAR

Q duration
  +prompt=I've been working in the industry for",
  +placeholder=Choose duration
	A 1-3 years
	A 3-5 years
	A 5+ years

Q gender
  +prompt=I am a
  +placeholder=Choose gender
  A Male
  A Female
  A Non binary
  A Prefer not to say

Q Paris Office
  +prompt=Which Paris office?
  +if=location=PAR
  A Gare du Lyon
  A Bastille
  A Sacre Coeur

Q London Office
  +prompt=Which London office?
  +if=location=LON
  +multi=false
  A Paddington
  A Knightsbridge
  A Notting Hill

Section: About mentoring

Q role
  +prompt=I am 
  A often asked for advice (I am a mentor)
  	+value=mentor
  A keen to further my career (I am a mentee)
  	+value=mentee
  A Interested in both giving advice and furthering my career
  	+value=either
```
