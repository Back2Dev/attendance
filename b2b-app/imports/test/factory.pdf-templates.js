import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import PdfTemplates from '/imports/api/pdf-templates/schema'

Factory.define('pdfTemplates', PdfTemplates, {})
