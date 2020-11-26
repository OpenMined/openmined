export default {
  title: 'Lesson',
  name: 'lesson',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Concepts',
      name: 'concepts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'concept' }] }],
    },
  ],
};
