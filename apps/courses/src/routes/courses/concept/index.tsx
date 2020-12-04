import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import {
  AspectRatio,
  Box,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  useClipboard,
} from '@chakra-ui/core';
import Prism from 'prismjs';
import { faBookOpen, faCopy, faLink } from '@fortawesome/free-solid-svg-icons';
import Page from '@openmined/shared/util-page';
import {
  useSanity,
  useSanityImage,
  RichText,
} from '@openmined/shared/data-access-sanity';

import {
  getConceptNumber,
  getLessonNumber,
  hasCompletedConcept,
  hasStartedConcept,
  hasStartedCourse,
  hasStartedLesson,
} from '../_helpers';
import GridContainer from '../../../components/GridContainer';
import CourseHeader from '../../../components/CourseHeader';
import useToast, { toastConfig } from '../../../components/Toast';

// Plugins
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

// Languages
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-julia';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-objectivec';
import 'prismjs/components/prism-protobuf';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-wasm';
import 'prismjs/components/prism-yaml';

// Theme
import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CONTENT_SPACING = 8;

const ContentCode = ({ code, language }) => {
  const ref = useRef();
  const { onCopy } = useClipboard(code);
  const toast = useToast();

  useEffect(() => {
    if (ref && ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, []);

  return (
    <Box position="relative">
      <Icon
        as={FontAwesomeIcon}
        icon={faCopy}
        size="lg"
        color="whiteAlpha.500"
        _hover={{ color: 'white' }}
        transitionProperty="color"
        transitionDuration="slow"
        transitionTimingFunction="ease-in-out"
        position="absolute"
        top={4}
        right={4}
        zIndex={1}
        cursor="pointer"
        onClick={() => {
          onCopy();

          toast({
            ...toastConfig,
            title: 'Code copied',
            description: 'Put that code to good use!',
            status: 'success',
          });
        }}
      />
      <pre className="line-numbers show-language">
        <code ref={ref} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </Box>
  );
};

const ContentText = ({ richText }) => (
  <Box my={CONTENT_SPACING}>
    <RichText content={richText} />
  </Box>
);

const ContentDivider = () => <Divider />;

const ContentFormula = ({ math }) => {
  const ref = useRef(null);

  useEffect(() => {
    // @ts-ignore We import this in the HTML file
    katex.render(String.raw`${math}`, ref.current, {
      throwOnError: false,
    });
  }, [math]);

  return (
    <Flex justify="center" my={CONTENT_SPACING}>
      <Text ref={ref}>{math}</Text>
    </Flex>
  );
};

const ContentImage = (image) => {
  const img = useSanityImage(image);

  return (
    <Flex justify="center" my={CONTENT_SPACING}>
      <Image src={img.url()} maxW={600} />
    </Flex>
  );
};

const ContentQuiz = ({ quiz }) => {
  console.log('QUIZ', quiz);

  return null;
};

const ContentTasks = ({ tasks }) => (
  <Flex justify="center" my={CONTENT_SPACING}>
    <Stack spacing={4}>
      {tasks.map((t, i) => (
        <Checkbox
          key={i}
          spacing={4}
          colorScheme="magenta"
          alignItems="baseline"
        >
          <Flex>
            <Text mr={4}>{i + 1}.</Text>
            <Text>{t}</Text>
          </Flex>
        </Checkbox>
      ))}
    </Stack>
  </Flex>
);

const ContentVideo = ({ video }) => (
  <Flex justify="center" my={CONTENT_SPACING}>
    <AspectRatio width="100%" ratio={16 / 9}>
      <Box
        as="iframe"
        title="OpenMined Courses"
        src={`https://www.youtube.com/embed/${video}?modestbranding=1&rel=0`}
        allowFullScreen
      />
    </AspectRatio>
  </Flex>
);

const Concept = ({ data, dbCourse, course, lesson, concept }) => {
  const {
    concept: { title, content },
    concepts,
    course: { title: courseTitle, lessons },
    resources,
    title: lessonTitle,
  } = data;

  const lessonNum = getLessonNumber(lessons, lesson);
  const conceptNum = getConceptNumber(lessons, lesson, concept);

  const leftDrawerSections = [
    {
      title: 'Concepts',
      icon: faBookOpen,
      fields: concepts.map(({ _id, title }, index) => {
        let status = 'unavailable';

        if (hasStartedConcept(dbCourse, lesson, _id)) {
          if (hasCompletedConcept(dbCourse, lesson, _id)) status = 'completed';
          else status = 'available';
        } else if (index === 0) status = 'available';

        return {
          status,
          title,
          link: status !== 'unavailable' ? `/courses/${course}/${_id}` : null,
        };
      }),
    },
    {
      title: 'Resources',
      icon: faLink,
      fields: resources ? resources : [],
    },
  ];

  // TODO: Inline quiz
  // TODO: Footer (including feedback, get help, and read tracking)
  // TODO: How to complete a concept? Video should not require anything. Quiz pages should require attempting all questions. Normal pages should require attempting all questions and scrolling to the bottom of the concept at least once.
  // TODO: Allow for videos to be made big if they're the first item in the content
  // TODO: Do a refactor to ensure that this file is much smaller and more readable
  // TODO: Consider doing a skinned version of the video player
  // TODO: Quiz pages should also be a concept-type of page, they can only go at the end of lessons (add "quiz" as a field to the lesson in the CMS)
  // TODO: Should track quiz progress in backend
  // TODO: Make sure that they cannot begin a concept if they haven't completed the previous concepts (unless it's the first)
  // TODO: Make sure that they cannot begin a concept if they haven't completed the previous lessons (unless it's the first)

  return (
    <Page title={`${lessonTitle} - ${title}`}>
      <CourseHeader
        lessonNum={lessonNum}
        title={title}
        course={course}
        leftDrawerSections={leftDrawerSections}
      />
      <Box bg="gray.800">
        <GridContainer pt="header" height="100%">
          <Box bg="white" height="100%" px={8} pt={[8, null, null, 16]} pb={16}>
            <Box maxW={600} mx="auto">
              <Text color="gray.700" mb={2}>
                <Text fontWeight="bold" as="span">
                  {lessonTitle}
                </Text>{' '}
                | Concept {conceptNum}
              </Text>
              <Heading as="h1" size="xl">
                {title}
              </Heading>
              <Divider my={6} />
              {content.map(({ _type, ...item }, i) => {
                if (_type === 'code') {
                  return <ContentCode key={i} {...item} />;
                } else if (_type === 'richText') {
                  return <ContentText key={i} {...item} />;
                } else if (_type === 'divider') {
                  return <ContentDivider key={i} {...item} />;
                } else if (_type === 'math') {
                  return <ContentFormula key={i} {...item} />;
                } else if (_type === 'image') {
                  return <ContentImage key={i} {...item} />;
                } else if (_type === 'quiz') {
                  return <ContentQuiz key={i} {...item} />;
                } else if (_type === 'tasks') {
                  return <ContentTasks key={i} {...item} />;
                } else if (_type === 'video') {
                  return <ContentVideo key={i} {...item} />;
                }

                return null;
              })}
            </Box>
          </Box>
        </GridContainer>
      </Box>
    </Page>
  );
};

export default () => {
  const { course, lesson, concept } = useParams();
  const { data, loading } = useSanity(
    `*[_type == "lesson" && _id == "${lesson}"] {
      title,
      resources,
      "concept": *[_type == "concept" && _id == "${concept}"][0],
      "concepts": concepts[] -> {
        _id,
        title
      },
      "course": *[_type == "course" && references(^._id)][0] {
        title,
        "lessons": lessons[] -> {
          _id,
          title,
          "concepts": concepts[] -> { _id }
        }
      }
    }[0]`
  );

  const user = useUser();
  const db = useFirestore();
  const dbCourseRef = db
    .collection('users')
    .doc(user.uid)
    .collection('courses')
    .doc(course);
  const dbCourse = useFirestoreDocDataOnce(dbCourseRef);

  const serverTimestamp = useFirestore.FieldValue.serverTimestamp();

  useEffect(() => {
    const isCourseStarted = hasStartedCourse(dbCourse);
    const isLessonStarted = hasStartedLesson(dbCourse, lesson);
    const isConceptStarted = hasStartedConcept(dbCourse, lesson, concept);

    // If we haven't started the course, lesson, or concept
    if (!isCourseStarted || !isLessonStarted || !isConceptStarted) {
      const data = dbCourse;

      if (!isCourseStarted) {
        data.started_at = serverTimestamp;
        data.lessons = {};
      }
      if (!isLessonStarted) {
        data.lessons[lesson] = {
          started_at: serverTimestamp,
          concepts: {},
        };
      }
      if (!isConceptStarted) {
        data.lessons[lesson].concepts[concept] = {
          started_at: serverTimestamp,
        };
      }

      db.collection('users')
        .doc(user.uid)
        .collection('courses')
        .doc(course)
        .set(data, { merge: true });
    }
  }, [user.uid, db, dbCourse, serverTimestamp, course, lesson, concept]);

  if (loading) return null;

  const firstContentPiece = data.concept.content[0]._type;

  if (firstContentPiece === 'video') {
    console.log('DO VIDEO LAYOUT');

    return <div>Video Layout</div>;
  } else if (firstContentPiece === 'quiz') {
    console.log('DO QUIZ LAYOUT');

    return <div>Quiz Layout</div>;
  }

  return (
    <Concept
      data={data}
      dbCourse={dbCourse}
      course={course}
      lesson={lesson}
      concept={concept}
    />
  );
};
