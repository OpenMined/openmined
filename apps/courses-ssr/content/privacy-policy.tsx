import React from 'react';
import { Text, Link } from '@chakra-ui/react';

import { discussionLink } from './links';

export default {
  heading: {
    title: 'Privacy Policy',
    last_updated: 'December 30th, 2020',
  },
  sections: [
    {
      title: 'Overview',
      content: [
        `OpenMined operates the OpenMined Courses website which provides online courses (the "Service").`,
        `This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the OpenMined Courses website.`,
        `If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.`,
      ],
    },
    {
      title: 'Information Collection and Use',
      content: [
        `For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name and email address. The information that we collect will be used to contact or identify you.`,
        `You may also choose to provide a picture and other personal information for your Profile. Your Profile will also contain information based on your activity in the courses. Please be aware that your Profile is public and may be shared with other users, but we will never sell or distribute this information to third-party services.`,
      ],
    },
    {
      title: 'Log Data',
      content: `We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics. This information is collected purely for analytical purposes by our development team to fix bugs and improve the website.`,
    },
    {
      title: 'Retention of Your Information',
      content: `We keep your information for no longer than necessary for the purposes for which it is processed. The length of time for which we retain information depends on the purposes for which we collected it and/or as required to comply with applicable laws.`,
    },
    {
      title: 'Cookies',
      content: `Unlike most websites, we do not use cookies from our Service or from any other service for the "enhancement" of our Service. We may occasionally use "Local Storage", a similar technology, to track your "logged in" status throughout the various pages of our Service, or for other benign purposes such as temporarily storing what you type in a text editor, allowing you to refresh the page without losing your progress. This is intended purely as a feature to enhance your experience on our website, and not as a means for tracking, sale of your data, or other distribution of your data.`,
    },
    {
      title: 'Service Providers',
      content: [
        `We may employ third-party companies and individuals due to the following reasons: to facilitate our Service, to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used.`,
        `We want to inform our Service users that these third parties have access to some of your Personal Information. They have access in order to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.`,
      ],
    },
    {
      title: 'Security',
      content: `We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.`,
    },
    {
      title: 'Links to Other Sites',
      content: `Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.`,
    },
    {
      title: `Children's Privacy`,
      content: `Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to take the  necessary actions.`,
    },
    {
      title: 'Changes to this Privacy Policy',
      content: `We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.`,
    },
    {
      title: 'Rights to Your Data',
      content: `You have the complete and total right to access or destroy any data that we collect from you for the purposes of using our Service. At any point, if you would like to delete all of your information, you're allowed to request this on your Account Settings page. This process should only take a few minutes, but we will guarantee full deletion of your information within 48 hours. If you would like to retrieve a copy of your data, please file an issue on our Github page.`,
    },
    {
      title: 'Contact Us',
      content: `If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us on Slack or Github via the proper channels or repositories.`,
    },
  ],
  sidebar: {
    discussion: (
      <Text>
        Not seeing an answer to your specific question? Go to our{' '}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={discussionLink}
          as="a"
        >
          discussion board
        </Link>{' '}
        to get extra assistance.
      </Text>
    ),
  },
};
