export default {
  title: 'Course',
  name: 'course',
  type: 'document',
  i18n: true,
  preview: {
    select: {
      title: 'title',
      media: 'visual.full',
    },
  },
  fields: [
    {
      title: 'Is visible?',
      description: 'Should the course show up on the website?',
      name: 'visible',
      type: 'boolean',
    },
    {
      title: 'Is live?',
      description: 'Should the course be allowed to be taken by students?',
      name: 'live',
      type: 'boolean',
    },
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text',
    },
    {
      title: 'Prerequisites',
      name: 'prerequisites',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      title: 'Learn How',
      name: 'learnHow',
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
              title: 'Image',
              name: 'image',
              type: 'image',
            },
          ],
        },
      ],
    },
    {
      title: 'Visual',
      name: 'visual',
      type: 'object',
      fields: [
        {
          title: 'Default',
          name: 'default',
          type: 'image',
        },
        {
          title: 'Full',
          name: 'full',
          type: 'image',
        },
      ],
    },
    {
      title: 'Cost',
      name: 'cost',
      type: 'string',
    },
    {
      title: 'Level',
      name: 'level',
      type: 'string',
    },
    {
      title: 'Length',
      name: 'length',
      type: 'string',
    },
    {
      title: 'Certification',
      name: 'certification',
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
    {
      title: 'Learn From',
      name: 'learnFrom',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teacher' }] }],
    },
    {
      title: 'Lessons',
      name: 'lessons',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'lesson' }] }],
    },
    {
      title: 'Project',
      name: 'project',
      type: 'object',
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
          title: 'Goals',
          name: 'goals',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          title: 'Needs',
          name: 'needs',
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
                  description: 'This is optional',
                  name: 'link',
                  type: 'url',
                },
              ],
            },
          ],
        },
        {
          title: 'Parts',
          name: 'parts',
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
                  title: 'Description',
                  name: 'description',
                  type: 'text',
                },
                {
                  title: 'Submission',
                  name: 'submission',
                  type: 'string',
                  options: {
                    list: [{ title: 'Rich Text', value: 'text' }],
                  },
                },
                {
                  title: 'Instructions',
                  name: 'instructions',
                  type: 'content',
                },
                {
                  title: 'Rubric',
                  name: 'rubric',
                  type: 'content',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
