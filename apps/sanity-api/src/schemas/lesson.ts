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
      title: 'Learn How',
      name: 'learnHow',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      title: 'Length',
      name: 'length',
      type: 'string',
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
      title: 'Learn From',
      name: 'learnFrom',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teacher' }] }],
    },
    {
      title: 'Concepts',
      name: 'concepts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'concept' }] }],
    },
  ],
};
