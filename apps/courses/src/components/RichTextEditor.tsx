import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Flex,
  Text,
  Box,
  Divider,
  Heading,
  UnorderedList,
  ListItem,
  OrderedList,
  Link,
  Code,
  Input,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
  Node,
  Element as SlateElement,
  Range,
} from 'slate';
import { withHistory } from 'slate-history';
import {
  faBold,
  faCode,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faQuoteLeft,
  faStrikethrough,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import isUrl from 'is-url';
import { useDebounce } from '../helpers';

import Icon from '../components/Icon';
import Modal from '../components/Modal';

export const EDITOR_STORAGE_STRING = '@openmined/rich-text-editor';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
  'mod+k': 'link',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const resetEditor = () => {
  localStorage.setItem(EDITOR_STORAGE_STRING, JSON.stringify(initialValue));
};

const withLinks = (editor) => {
  const { insertText } = editor;

  editor.insertText = (text) => {
    if (isUrl(text)) {
      const { selection } = editor;
      if (Range.isExpanded(selection)) {
        setLink(editor, text);
      } else {
        const newLink = { text, url: text, link: true };
        const emptySpace = { text: ' ' };

        Transforms.insertFragment(editor, [newLink, emptySpace]);
      }
      return;
    }

    insertText(text);
  };

  return editor;
};

export default ({
  readOnly = false,
  content = null,
  onChange = null,
  ...props
}) => {
  const [value, setValue] = useState<Node[]>(
    content ||
      JSON.parse(localStorage.getItem(EDITOR_STORAGE_STRING)) ||
      initialValue
  );
  const [url, setUrl] = useState();
  const [selection, setSelection] = useState();
  const [isEditing, setEditing] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback(
    (props) => <Leaf {...props} readOnly={readOnly} />,
    []
  );
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  );
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    if (onChange) {
      const isValueEmpty =
        value.length === 1 &&
        value[0].type === 'paragraph' &&
        value[0].children?.[0].text === '';
      onChange(value, { empty: isValueEmpty });
    }
  }, [value, onChange]);

  useEffect(() => {
    localStorage.setItem(EDITOR_STORAGE_STRING, JSON.stringify(debouncedValue));
  }, [debouncedValue]);

  useEffect(() => {
    if (!isOpen && selection) {
      Transforms.select(editor, selection);
      ReactEditor.focus(editor);

      if (url) {
        setLink(editor, url);
      } else {
        removeLink(editor);
      }
    }
  }, [isOpen, selection, editor, url]);

  const handleCreateLink = () => {
    if (!url || !isUrl(url)) {
      if (isEditing) {
        // @ts-ignore
        setUrl(isEditing);
      } else {
        setUrl(null);
      }
    }

    onClose();
  };

  const handleRemoveLink = () => {
    setUrl(null);
    onClose();
  };

  const openModal = () => {
    const marks = Editor.marks(editor);
    setEditing(marks.url);
    setUrl(marks.url);
    onOpen();
  };

  return (
    <Box {...props}>
      <Slate editor={editor} value={value} onChange={setValue}>
        {!readOnly && (
          <Flex
            width="full"
            bg="gray.800"
            justify="space-between"
            align="center"
          >
            <Flex align="center" wrap="wrap">
              <MarkButton format="bold" icon={faBold} />
              <MarkButton format="italic" icon={faItalic} />
              <MarkButton format="underline" icon={faUnderline} />
              <MarkButton format="strikethrough" icon={faStrikethrough} />
              <Divider orientation="vertical" height={8} mx={2} />
              <BlockButton format="heading-one" text="H1" />
              <BlockButton format="heading-two" text="H2" />
              <BlockButton format="heading-three" text="H3" />
              <BlockButton format="heading-four" text="H4" />
              <BlockButton format="heading-five" text="H5" />
              <BlockButton format="heading-six" text="H6" />
              <Divider orientation="vertical" height={8} mx={2} />
              <MarkButton
                format="link"
                icon={faLink}
                openModal={openModal}
                setSelection={setSelection}
              />
              <MarkButton format="code" icon={faCode} />
              <BlockButton format="block-quote" icon={faQuoteLeft} />
              <Divider orientation="vertical" height={8} mx={2} />
              <BlockButton format="numbered-list" icon={faListOl} />
              <BlockButton format="bulleted-list" icon={faListUl} />
            </Flex>
            <Text
              ml={6}
              mr={3}
              fontStyle="italic"
              color="gray.400"
              whiteSpace="nowrap"
            >
              Autosave on
            </Text>
          </Flex>
        )}
        <Box px={readOnly ? 0 : [8, null, 12]} py={readOnly ? 0 : 8}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Start typing..."
            readOnly={readOnly}
            spellCheck
            autoFocus
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark, openModal, setSelection);
                }
              }
            }}
          />
        </Box>
      </Slate>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Setup a Link"
        buttons={
          isEditing ? (
            <>
              <Button
                onClick={handleRemoveLink}
                variant="ghost"
                colorScheme="red"
                mr={3}
              >
                Remove Link
              </Button>
              <Button onClick={handleCreateLink} colorScheme="blue">
                Edit Link
              </Button>
            </>
          ) : (
            <Button onClick={handleCreateLink} colorScheme="blue">
              Create Link
            </Button>
          )
        }
      >
        <Input
          placeholder="Enter a valid url"
          my={2}
          defaultValue={
            isMarkActive(editor, 'link') ? Editor.marks(editor).url : ''
          }
          onChange={({ target }) => {
            // @ts-ignore
            setUrl(target.value);
          }}
        />
      </Modal>
    </Box>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && (n.type as string)
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

const toggleMark = (editor, format, openModal, setSelection) => {
  const isActive = isMarkActive(editor, format);
  const isLink = format === 'link';

  if (isActive && !isLink) {
    Editor.removeMark(editor, format);
  } else if (isLink) {
    if (Range.isExpanded(editor.selection)) {
      setSelection(editor.selection);
      openModal();
    }
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

export const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <Text
          mb={4}
          fontStyle="italic"
          color="gray.700"
          bg="gray.100"
          p={4}
          {...attributes}
        >
          {children}
        </Text>
      );
    case 'numbered-list':
      return (
        <OrderedList mb={4} {...attributes}>
          {children}
        </OrderedList>
      );
    case 'bulleted-list':
      return (
        <UnorderedList mb={4} {...attributes}>
          {children}
        </UnorderedList>
      );
    case 'list-item':
      return <ListItem>{children}</ListItem>;
    case 'heading-one':
      return (
        <Heading mb={4} as="h1" size="2xl" {...attributes}>
          {children}
        </Heading>
      );
    case 'heading-two':
      return (
        <Heading mb={4} as="h2" size="xl" {...attributes}>
          {children}
        </Heading>
      );
    case 'heading-three':
      return (
        <Heading mb={4} as="h3" size="lg" {...attributes}>
          {children}
        </Heading>
      );
    case 'heading-four':
      return (
        <Heading mb={4} as="h4" size="md" {...attributes}>
          {children}
        </Heading>
      );
    case 'heading-five':
      return (
        <Heading mb={4} as="h5" size="sm" {...attributes}>
          {children}
        </Heading>
      );
    case 'heading-six':
      return (
        <Heading mb={4} as="h6" size="xs" {...attributes}>
          {children}
        </Heading>
      );
    default:
      return (
        <Text mb={4} {...attributes}>
          {children}
        </Text>
      );
  }
};

export const Leaf = ({ attributes, children, leaf, readOnly }) => {
  if (leaf.bold) {
    return (
      <Text as="span" fontWeight="bold" {...attributes}>
        {children}
      </Text>
    );
  }

  if (leaf.italic) {
    return (
      <Text as="span" fontStyle="italic" {...attributes}>
        {children}
      </Text>
    );
  }

  if (leaf.underline) {
    return (
      <Text as="span" textDecoration="underline" {...attributes}>
        {children}
      </Text>
    );
  }

  if (leaf.strikethrough) {
    return (
      <Text as="span" textDecoration="line-through" {...attributes}>
        {children}
      </Text>
    );
  }

  if (leaf.code) {
    return <Code {...attributes}>{children}</Code>;
  }

  if (leaf.link) {
    return (
      <Link
        as="a"
        target="_blank"
        rel="noopener noreferrer"
        {...attributes}
        href={leaf.url}
        cursor={readOnly ? 'pointer' : 'text'}
      >
        {children}
      </Link>
    );
  }

  return (
    <Text as="span" {...attributes}>
      {children}
    </Text>
  );
};

const BlockButton = ({ format, icon, text }: any) => {
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
      {icon && <Icon icon={icon} />}
      {text && <Text fontWeight="bold">{text}</Text>}
    </Flex>
  );
};

const MarkButton = ({ format, icon, openModal, setSelection }: any) => {
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
        toggleMark(editor, format, openModal, setSelection);
      }}
    >
      <Icon icon={icon} />
    </Flex>
  );
};

const setLink = (editor, url) => {
  Editor.addMark(editor, 'link', true);
  Editor.addMark(editor, 'url', url);
};

const removeLink = (editor) => {
  Editor.removeMark(editor, 'link');
  Editor.removeMark(editor, 'url');
};
