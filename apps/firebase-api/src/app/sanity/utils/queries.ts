export type SANITY_QUERY = {
  auth: boolean;
  query: (params: any) => string;
};

export const search = () => `
*[_type == "course" && visible == true] {
  title,
  description,
  level,
  length,
  cost,
  live,
  "slug": slug.current,
  visual {
    "default": default.asset -> url,
    "full": full.asset -> url
  },
}`;

export const overview = ({ course }) => `
*[_type == "course" && slug.current == "${course}" && visible == true] {
  ...,
  "slug": slug.current,
  visual {
    "default": default.asset -> url,
    "full": full.asset -> url
  },
  learnHow[] {
    title,
    "image": image.asset -> url
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
      _id,
      title,
      "type": content[0]._type
    }
  }
}[0]`;

export const courseComplete = ({ course }) => `
*[_type == "course" && slug.current == "${course}" && live == true] {
  ...,
  lessons[] -> {
    _id,
    title,
    "concepts": concepts[] -> { _id }
  }
}[0]`;

export const project = ({ course }) => `
*[_type == "course" && slug.current == "${course}" && live == true] {
  ...,
  lessons[] -> {
    _id,
    title,
    "concepts": concepts[] -> { _id }
  }
}[0]`;

export const projectSubmission = project;

export const projectComplete = ({ course }) => `
*[_type == "course" && slug.current == "${course}" && live == true] {
  ...,
  lessons[] -> {
    _id,
    title,
    "concepts": concepts[] -> { _id }
  }
}[0]`;

export const lesson = ({ lesson }) => `
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
}[0]`;

export const lessonComplete = ({ lesson }) => `
*[_type == "lesson" && _id == "${lesson}" && *[_type == "course" && references(^._id)][0].live == true] {
  title,
  description,
  resources,
  "course": *[_type == "course" && references(^._id)][0] {
    title,
    "projectTitle": project.title,
    "lessons": lessons[] -> {
      _id,
      title,
      "concepts": concepts[] -> { _id }
    }
  }
}[0]`;

export const concept = ({ lesson, concept }) => `
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
}[0]`;

export const homepage = () => `
*[_type == "course" && visible == true] {
  title,
  level,
  length,
  cost,
  live,
  "slug": slug.current,
  visual {
    "default": default.asset -> url,
    "full": full.asset -> url
  },
}`;

export const queries: { [method: string]: SANITY_QUERY } = {
  /* Course pages */
  search: {
    auth: false,
    query: search,
  },
  overview: {
    auth: false,
    query: overview,
  },
  courseComplete: {
    auth: false,
    query: courseComplete,
  },
  project: {
    auth: false,
    query: project,
  },
  projectSubmission: {
    auth: false,
    query: projectSubmission,
  },
  lesson: {
    auth: false,
    query: lesson,
  },
  lessonComplete: {
    auth: false,
    query: lessonComplete,
  },
  concept: {
    auth: false,
    query: concept,
  },
  /* Home page */
  homepageCourses: {
    auth: false,
    query: homepage,
  },
};
