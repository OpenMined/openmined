import Link from 'next/link';

export default ({to, children, ...props}) => {
  return <Link
    href={to}
    {...props}
  >{ children }</Link>
}
