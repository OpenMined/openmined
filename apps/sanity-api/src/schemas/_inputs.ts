// export const figure = {
//   name: 'figure',
//   type: 'object',
//   fields: [
//     {
//       name: 'image',
//       type: 'image',
//     },
//     {
//       name: 'text',
//       type: 'string',
//     },
//   ],
// };

export const richText = {
  name: 'richText',
  type: 'array',
  of: [{ type: 'block' } /*{ type: 'figure' }*/],
};
