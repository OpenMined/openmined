export default {
  title: 'Teacher',
  name: 'teacher',
  type: 'document',
  i18n: true,
  preview: {
    select: {
      title: 'name',
      subtitle: 'credential',
      media: 'image',
    },
  },
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Credential',
      name: 'credential',
      type: 'string',
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
    },
  ],
};
