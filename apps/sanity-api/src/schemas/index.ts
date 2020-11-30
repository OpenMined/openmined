import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import { richText } from './_inputs';
import course from './course';
import lesson from './lesson';
import concept from './concept';
import teacher from './teacher';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([richText, course, lesson, concept, teacher]),
});
