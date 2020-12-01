export default {
  title: 'Lesson',
  name: 'lesson',
  type: 'document',
  i18n: true,
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
      title: 'Resources',
      name: 'resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string',
            },
            {
              title: 'Link',
              name: 'link',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      title: 'Concepts',
      name: 'concepts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'concept' }] }],
    },
  ],
};
