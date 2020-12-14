import React, { useCallback, useMemo, useState } from 'react';
import { Flex, Icon, Text, Box, Divider } from '@chakra-ui/react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
  Node,
  Element as SlateElement,
} from 'slate';
import { withHistory } from 'slate-history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faCode,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faQuoteLeft,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export const EDITOR_STORAGE_STRING = '@openmined/rich-text-editor';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export default () => {
  const [value, setValue] = useState<Node[]>(
    JSON.parse(localStorage.getItem(EDITOR_STORAGE_STRING)) || initialValue
  );
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(v) => {
        setValue(v);

        localStorage.setItem(EDITOR_STORAGE_STRING, JSON.stringify(v));
      }}
    >
      <Flex width="full" bg="gray.800" justify="space-between" align="center">
        <Flex align="center">
          <MarkButton format="bold" icon={faBold} />
          <MarkButton format="italic" icon={faItalic} />
          <MarkButton format="underline" icon={faUnderline} />
          <Divider orientation="vertical" height={8} mx={2} />
          <BlockButton format="heading-one" text="H1" />
          <BlockButton format="heading-two" text="H2" />
          <BlockButton format="heading-three" text="H3" />
          <BlockButton format="heading-four" text="H4" />
          <BlockButton format="heading-five" text="H5" />
          <BlockButton format="heading-six" text="H6" />
          <Divider orientation="vertical" height={8} mx={2} />
          {/* TODO: Patrick add the link functionality */}
          <MarkButton format="link" icon={faLink} />
          <MarkButton format="code" icon={faCode} />
          <BlockButton format="block-quote" icon={faQuoteLeft} />
          <Divider orientation="vertical" height={8} mx={2} />
          <BlockButton format="numbered-list" icon={faListOl} />
          <BlockButton format="bulleted-list" icon={faListUl} />
        </Flex>
        <Text color="gray.400" mr={3} fontStyle="italic">
          Autosave on
        </Text>
      </Flex>
      <Box px={12} py={8}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Start typing..."
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Box>
    </Slate>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { type: format, children: [] });
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);

  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>;
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>;
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'link':
      return <a {...attributes}>{children}</a>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon, text }) => {
  const editor = useSlate();

  return (
    <Flex
      justify="center"
      align="center"
      boxSize={10}
      cursor="pointer"
      color={isBlockActive(editor, format) ? 'white' : 'gray.400'}
      _hover={{ color: 'gray.200' }}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon && <Icon as={FontAwesomeIcon} icon={icon} />}
      {text && <Text fontWeight="bold">{text}</Text>}
    </Flex>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();

  return (
    <Flex
      justify="center"
      align="center"
      boxSize={10}
      cursor="pointer"
      color={isMarkActive(editor, format) ? 'white' : 'gray.400'}
      _hover={{ color: 'gray.200' }}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon as={FontAwesomeIcon} icon={icon} />
    </Flex>
  );
};
