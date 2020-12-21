import sanityClient from '@sanity/client';

const methods = {
  search: {
    auth: true,
    query: () => `
    *[_type == "course" && visible == true] {
      title,
      description,
      level,
      length,
      cost,
      "slug": slug.current,
      visual {
        "default": default.asset -> url,
        "full": full.asset -> url
      },
    }`,
  },
  overview: {
    auth: true,
    query: ({ course }) => `
    *[_type == "course" && slug.current == "${course}" && visible == true] {
      ...,
      "slug": slug.current,
      visual {
        "default": default.asset -> url,
        "full": full.asset -> url
      },
      learnFrom[] -> {
        ...,
        "image": image.asset -> url
      },
      lessons[] -> {
        _id,
        title,
        description,
        concepts[] -> {
          title
        }
      }
    }[0]`,
  },
  courseComplete: {
    auth: true,
    query: ({ course }) => `
    *[_type == "course" && slug.current == "${course}" && live == true] {
      ...,
      lessons[] -> {
        _id,
        title,
        "concepts": concepts[] -> { _id }
      }
    }[0]`,
  },
  project: {
    auth: true,
    query: ({ course }) => `
    *[_type == "course" && slug.current == "${course}" && live == true] {
      ...,
      lessons[] -> {
        _id,
        title,
        "concepts": concepts[] -> { _id }
      }
    }[0]`,
  },
  projectComplete: {
    auth: true,
    query: ({ course }) => `
    *[_type == "course" && slug.current == "${course}" && live == true] {
      ...,
      lessons[] -> {
        _id,
        title,
        "concepts": concepts[] -> { _id }
      }
    }[0]`,
  },
  lesson: {
    auth: true,
    query: ({ lesson }) => `
    *[_type == "lesson" && _id == "${lesson}"] {
      ...,
      learnFrom[] -> {
        ...,
        "image": image.asset -> url
      },
      "firstConcept": concepts[0]._ref,
      "conceptsCount": count(concepts),
      "course": *[_type == "course" && references(^._id)][0] {
        title,
        "lessons": lessons[] -> {
          _id,
          title,
          "concepts": concepts[] -> { _id }
        }
      }
    }[0]`,
  },
  lessonComplete: {
    auth: true,
    query: ({ lesson }) => `
    *[_type == "lesson" && _id == "${lesson}" && *[_type == "course" && references(^._id)][0].live == true] {
      title,
      description,
      resources,
      "course": *[_type == "course" && references(^._id)][0] {
        title,
        "lessons": lessons[] -> {
          _id,
          title,
          "concepts": concepts[] -> { _id }
        }
      }
    }[0]`,
  },
  concept: {
    auth: true,
    query: ({ lesson, concept }) => `
    *[_type == "lesson" && _id == "${lesson}" && *[_type == "course" && references(^._id)][0].live == true] {
      title,
      resources,
      "concept": *[_type == "concept" && _id == "${concept}"][0],
      "concepts": concepts[] -> {
        _id,
        title,
        "type": content[0]._type
      },
      "course": *[_type == "course" && references(^._id)][0] {
        title,
        "lessons": lessons[] -> {
          _id,
          title,
          "concepts": concepts[] -> { _id }
        }
      }
    }[0]`,
  },
};

const getQuery = ({ method, ...rest }) => methods[method].query(rest);

const isQueryAllowed = ({ method }, { auth }) => {
  const methodRequiresAuth = methods[method].auth;

  if (!methodRequiresAuth) return true;
  else if (methodRequiresAuth && auth && auth.uid) return true;

  return false;
};

export default (data, context) => {
  if (!isQueryAllowed(data, context)) {
    return {
      error: 'Permission denied',
    };
  }

  const dataset = data.env === 'production' ? 'production' : 'development';

  const config = {
    projectId: 'rzeg7i8f',
    dataset,
    // TODO: Need to figure out how to do this securely...
    token: process.env.NX_SANITY_API_TOKEN,
    useCdn: dataset === 'production',
  };

  const client = sanityClient(config);

  return client.fetch(getQuery(data)).catch((e) => ({ error: e }));
};
