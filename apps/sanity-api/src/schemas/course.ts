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
      of: [{ type: 'string' }],
    },
    {
      title: 'Project',
      name: 'project',
      type: 'string',
    },
    {
      title: 'Color',
      name: 'color',
      type: 'string',
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
      type: 'string',
    },
    {
      title: 'Lessons',
      name: 'lessons',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'lesson' }] }],
    },
  ],
};
