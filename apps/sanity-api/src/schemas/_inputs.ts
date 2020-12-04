export const richText = {
  name: 'richText',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Heading 5', value: 'h5' },
        { title: 'Heading 6', value: 'h6' },
        { title: 'Quote', value: 'blockquote' },
      ],
    },
  ],
};

export const quiz = {
  name: 'quiz',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          title: 'Question',
          name: 'question',
          type: 'string',
        },
        {
          title: 'Answers',
          name: 'answers',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  type: 'boolean',
                  name: 'correct',
                  title: 'Is correct answer?',
                },
                { type: 'string', name: 'value', title: 'Value' },
                { type: 'text', name: 'explanation', title: 'Explanation' },
              ],
              preview: {
                select: {
                  title: 'value',
                  subtitle: 'correct',
                },
                prepare: ({ title, subtitle }) => ({
                  title,
                  subtitle: subtitle ? 'Correct' : null,
                }),
              },
            },
          ],
        },
      ],
      preview: {
        select: {
          title: 'question',
          subtitle: 'answers',
        },
        prepare: ({ title, subtitle }) => ({
          title,
          subtitle: `${subtitle.length} answer${
            subtitle.length === 1 ? '' : 's'
          }`,
        }),
      },
    },
  ],
};
