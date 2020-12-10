interface featuresOrResources {
  title: string;
  icon: string;
  list: {
    title: string;
    icon: string | JSX.Element;
    description: string;
    link?: {
      title: string;
      link: string;
    };
  }[];
}

export default featuresOrResources;
