import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default {
    search: {
        title: 'search',
        description: 'hihih',
    },
    footer: {
        title: 'About OpenMined',
        description: 'Located at the intersection of privacy & AI, we are an open-source community of over 8000+ researchers, engineers, mentors and enthusiasts committed to making a fairer more prosperous world',
        button: {
            text: 'OpenMind.org',
            href: '#',
            icon: faArrowRight,
        },
        catalog: {
            title: 'Catalog', 
            links: [
                {
                    name: 'Privacy and Society',
                    href: '#',
                },
                {
                    name: 'Foundations of Private Computation',
                    href: '#',
                },
                {
                    name: 'Federated Learning Across Enterprises',
                    href: '#',
                },
                {
                    name: 'Federated Learning on Mobile',
                    href: '#',
                },
            ],
        },
        resources: {
            title: 'Resources',
            links: [
                {
                    name: 'Discussion Board',
                    href: '#',
                },
                {
                    name: 'Slack',
                    href: '#',
                },
                {
                    name: 'GitHub',
                    href: '#',
                },
                {
                    name: 'Blog',
                    href: '#',
                },
                {
                    name: 'Careers',
                    href: '#',
                },
            ],
        },
        copyright: 'Copyright 2020',
        otherLinks: [
            {
                name: 'Terms & Conditions',
                href:'#',
            },
            {
                name: 'Privacy Policy',
                href: '#',
            },
        ],
    },
}