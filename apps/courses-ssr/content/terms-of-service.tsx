import React from 'react';
import { Link } from '@chakra-ui/react';
import LinkWrapper from './../components/LinkWrapper';

import content from './privacy-policy';
import {
  codeofconductLink,
  discussionLink,
  issuesLink,
  slackLink,
} from './links';

import { getLinkPropsFromLink } from '../helpers';

const apacheLink = 'https://www.apache.org/licenses/LICENSE-2.0';

export default {
  heading: {
    title: 'Terms of Service',
    last_updated: 'December 30th, 2020',
    disclaimer: [
      () => (
        <>
          OpenMined provides you access to educational content and support
          services subject to the terms and conditions described in this
          document, the Terms of Service. By signing up for an OpenMined account
          (described below) and using our Services, you agree to these terms.
          See our{' '}
          <Link to="/policy" as={LinkWrapper}>
            Privacy Policy
          </Link>{' '}
          to learn how your data is collected and used.
        </>
      ),
      `For clarity, we refer to our online content as Courses and the support services as Support. Collectively we call them the Service or Services. We refer to people enrolled in our Courses as Students or more broadly, Users.`,
    ],
  },
  sections: [
    {
      title: 'OpenMined Accounts',
      content: [
        `To use our Services, you must sign up for an OpenMined account. This account is used to identify you across our current Services and potential future services. Refer to the Privacy Policy to learn more about the data you will provide and how we use it.`,
        `The account is used to track your progress through the Courses and your interactions with Support services. The information you provide through your account is used to communicate with you and may be used to improve the Services.`,
      ],
    },
    {
      title: 'Online Education Platform',
      content: [
        `Logging in to your OpenMined account grants you access to our online education platform, typically referred to as the Classroom, which hosts the Courses. Through the Classroom, you can enroll in individual Courses as well as view and edit your Profile. Your progress in each Course you’ve enrolled in is tracked and displayed in your Classroom home page.`,
        `Parts of the Classroom are built with services external to OpenMined that are not within our control. At any time these services might fail, rendering content or the Classroom itself inaccessible. We will notify users and provide status updates as appropriate.`,
        () => (
          <>
            If you have issues with the classroom and wish to report them to us,{' '}
            <Link {...getLinkPropsFromLink(issuesLink)}>
              please create a ticket here
            </Link>
            .
          </>
        ),
      ],
    },
    {
      title: 'Courses',
      content: [
        `Most of our Courses we provide will always be free to access. The only requirement for access is you must be logged into an OpenMined account.`,
        () => (
          <>
            All content is copyright OpenMined under the Creative Commons
            Attribution License 4.0. This means you can share and modify the
            content, including for commercial purposes, but you must attribute
            any of our work to OpenMined. Also, any derivative works must not
            restrict others from doing anything the license permits. Similarly,
            any code related to our Courses will be available under the{' '}
            <Link {...getLinkPropsFromLink(apacheLink)}>
              Apache-2.0 license
            </Link>
            .
          </>
        ),
        () => (
          <>
            Many of our Courses contain technical content including code
            examples and programming exercises. This content typically depends
            on open source software. As with any project involving code
            dependencies, the technical content in our Courses might result in
            errors due to broken dependencies or other bugs in the underlying
            code. You can report bugs in Courses through our main{' '}
            <Link {...getLinkPropsFromLink(issuesLink)}>GitHub repository</Link>
            . While we’ll do our best to address any issues, be aware that we
            may not maintain or support individual Courses forever into the
            future.
          </>
        ),
        `We may remove or modify existing Courses at any time. Students may or may not be notified of changes to Courses they are enrolled in. However, any certifications or other physical or digital items awarded upon completion of a Course will be retained.`,
      ],
    },
    {
      title: 'Support Services',
      content: [
        `Students are supported by Technical Mentors and Community Mentors. Community Mentors are volunteers who aid the whole OpenMined community. You will generally find them on Slack. They can help you find projects to work on, guide you to tutorials or other learning resources, and in general answer any questions you have about the community.`,
        `Technical Mentors specifically help students with Courses, through two Support Services: Project Reviews and the Discussion Boards. The Support Services are funded through grants from our partners and donors. As such, availability of the Support Services isn’t guaranteed for all students at all times. Often, a funding source will allow us to provide Support Services for a certain number of students. If we aren’t able to provide you with Support Services, you will always be able to ask for help from our Community members (see below).`,
        `Each Course has an associated project that allows you to demonstrate the skills you gained through the Course. If available, you are able to submit your project for a Project Review. A Technical Mentor will review your project and respond with feedback, including a pass/fail status. The feedback is intended to help you solidify your knowledge and skills, as well as provide further topics to study.`,
        `Passing or failing a project is determined by meeting the criteria of a rubric. Each project has an associated rubric that Mentors reference to determine a passing or failing status. You have access to the rubric as well through the Classroom.`,
        `You have three attempts to pass a project. The number of attempts you have left is displayed in the Classroom. If you do not pass a project after three attempts, the Course will still be labeled as completed, but the project won’t be listed in your Profile.`,
        `Projects are submitted through the Classroom for review. If you do not have access to Project Reviews, you aren’t able to submit your project through the classroom. However, you still have access to the project itself. You can work on it and share with other students on the discussion board for feedback, push it to your GitHub profile, or otherwise share it publicly.`,
        () => (
          <>
            Our Technical Mentors staff the{' '}
            <Link {...getLinkPropsFromLink(discussionLink)}>
              discussion boards
            </Link>{' '}
            where they provide help for students working on specific Courses. A
            limited number of Mentors will be available at any one time, so you
            might need to wait to get help while they are assisting other
            students. Don’t feel obligated to wait for a Technical Mentor
            though, you can always request help from other students and members
            of the OpenMined community.
          </>
        ),
        `We will do our best to provide coverage over all time zones, but you may not be able to get immediate help from Technical Mentors at all times of the day. We will post a schedule for our Technical mentors so you can find a time that works best for you.`,
      ],
    },
    {
      title: 'Our Community',
      content: [
        () => (
          <>
            OpenMined is primarily a community of people passionate about
            privacy and technology. You will be able to join the{' '}
            <Link {...getLinkPropsFromLink(slackLink)}>
              OpenMined community on Slack
            </Link>{' '}
            and ask questions through{' '}
            <Link {...getLinkPropsFromLink(discussionLink)}>
              GitHub Discussions
            </Link>
            . You aren’t obligated to be involved in the community, but we feel
            you’ll get the most out of your time with us if you are an active
            participant.
          </>
        ),
        () => (
          <>
            When interacting with others in our community, you must adhere to
            our{' '}
            <Link {...getLinkPropsFromLink(codeofconductLink)}>
              Code of Conduct
            </Link>
            . Above all, respect your peers in the community. If we find that
            you have broken our Code of Conduct, we may revoke your access to
            our Services or otherwise remove you from the community.
          </>
        ),
      ],
    },
    {
      title: 'Contact Us',
      content: `If you have any questions or suggestions about our Terms of Service, do not hesitate to contact us on Slack in the #courses channel or through email at courses@openmined.org.`,
    },
  ],
  sidebar: content.sidebar,
};
