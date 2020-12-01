export default {
  title: 'Lesson',
  name: 'lesson',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text',
    },
    {
      title: 'Concepts',
      name: 'concepts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'concept' }] }],
    },
  ],
};
