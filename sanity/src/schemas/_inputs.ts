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

export const content = {
  name: 'content',
  type: 'array',
  of: [
    {
      title: 'Code',
      name: 'code',
      type: 'object',
      fields: [
        {
          title: 'Language',
          description: 'https://prismjs.com/#supported-languages',
          name: 'language',
          type: 'string',
        },
        {
          title: 'Code',
          name: 'code',
          type: 'text',
        },
      ],
      preview: {
        select: {
          title: 'language',
        },
        prepare: ({ title }) => ({
          title: 'Code Block',
          subtitle: `Language: ${title}`,
        }),
      },
    },
    {
      title: 'Content Block',
      name: 'richText',
      type: 'object',
      fields: [{ title: 'Content Block', name: 'richText', type: 'richText' }],
      preview: {
        select: {
          title: 'richText',
        },
        prepare: ({ title }) => ({
          title: 'Content Block',
          subtitle: `${title[0].children[0].text.substr(0, 60)}...`,
        }),
      },
    },
    {
      title: 'Divider',
      name: 'divider',
      type: 'object',
      fields: [
        {
          title: 'Divider',
          name: 'divider',
          description: 'Please mark it as "true"',
          type: 'boolean',
        },
      ],
      preview: {
        prepare: () => ({
          title: 'Divider',
        }),
      },
    },
    {
      title: 'Formula',
      name: 'math',
      type: 'object',
      fields: [
        {
          title: 'Formula',
          description: 'Type any LaTeX formula',
          name: 'math',
          type: 'text',
        },
      ],
      preview: {
        prepare: () => ({
          title: 'Math Expression',
        }),
      },
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
    },
    {
      title: 'Quiz',
      name: 'quiz',
      type: 'object',
      fields: [{ title: 'Quiz', name: 'quiz', type: 'quiz' }],
      preview: {
        select: {
          subtitle: 'quiz',
        },
        prepare: ({ subtitle }) => ({
          title: 'Quiz',
          subtitle: `${subtitle.length} question${
            subtitle.length === 1 ? '' : 's'
          }`,
        }),
      },
    },
    {
      title: 'Tasks',
      name: 'tasks',
      type: 'object',
      fields: [
        {
          title: 'Tasks',
          name: 'tasks',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
      preview: {
        select: {
          title: 'tasks',
        },
        prepare: ({ title }) => ({
          title: 'Tasks',
          subtitle: `${title.length} item${title.length === 1 ? '' : 's'}`,
        }),
      },
    },
    {
      title: 'Video',
      name: 'video',
      type: 'object',
      fields: [
        {
          title: 'Video',
          description: 'Type a YouTube video ID',
          name: 'video',
          type: 'string',
        },
      ],
      preview: {
        select: {
          title: 'video',
        },
        prepare: ({ title }) => ({
          title: 'Video',
          subtitle: `YouTube ID: ${title}`,
        }),
      },
    },
  ],
};
