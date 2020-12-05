import React from 'react';

import Code from './Code';
import Divider from './Divider';
import Formula from './Formula';
import Image from './Image';
import Quiz from './Quiz';
import Tasks from './Tasks';
import RichText from './Text';
import Video from './Video';

const SPACING = 8;

export default ({
  content,
  course,
  lesson,
  concept,
  dbCourse,
  onQuizComplete,
  numberOfQuizzesOnConcept,
}) =>
  content.map(({ _type, ...item }, i) => {
    if (_type === 'code') {
      return <Code key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'divider') {
      return <Divider key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'math') {
      return <Formula key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'image') {
      return <Image key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'quiz') {
      return (
        <Quiz
          key={i}
          spacing={SPACING}
          {...item}
          course={course}
          lesson={lesson}
          concept={concept}
          dbCourse={dbCourse}
          numQuizzes={numberOfQuizzesOnConcept}
          onComplete={onQuizComplete}
        />
      );
    } else if (_type === 'tasks') {
      return <Tasks key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'richText') {
      return <RichText key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'video') {
      return <Video key={i} spacing={SPACING} {...item} />;
    }

    return null;
  });
