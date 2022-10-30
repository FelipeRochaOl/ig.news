import { ReactElement, cloneElement } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}
// clone element <a> and add modify className props
export function ActiveLink({children, activeClassName, ...props}: ActiveLinkProps) {
  const {asPath} = useRouter();
  const className = asPath === props.href ? activeClassName : '';
  return (
    <Link className={activeClassName} {...props}>
      {cloneElement(children, {className})}
    </Link>
  )
}