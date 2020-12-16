export const search = () => `
*[_type == "course"] {
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
}`;

export const overview = ({ course }) => `
*[_type == "course" && slug.current == "${course}"] {
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
}[0]`;

export const courseComplete = ({ course }) => `
*[_type == "course" && slug.current == "${course}"] {
  ...,
  lessons[] -> {
    _id,
    title,
    "concepts": concepts[] -> { _id }
  }
}[0]`;

export const project = ({ course }) => `
*[_type == "course" && slug.current == "${course}"] {
  ...,
  lessons[] -> {
    _id,
    title,
    "concepts": concepts[] -> { _id }
  }
}[0]`;

export const projectComplete = ({ course }) => `
*[_type == "course" && slug.current == "${course}"] {
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
  "course": *[_type == "course" && references(^._id) ][0] {
    title,
    "lessons": lessons[] -> {
      _id,
      title,
      "concepts": concepts[] -> { _id }
    }
  }
}[0]`;

export const lessonComplete = ({ lesson }) => `
*[_type == "lesson" && _id == "${lesson}"] {
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
}[0]`;

export const concept = ({ lesson, concept }) => `
*[_type == "lesson" && _id == "${lesson}"] {
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
}[0]`;
