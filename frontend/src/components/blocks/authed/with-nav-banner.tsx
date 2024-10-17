import { Fragment, type FC, type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import type { BreadCrumb } from '@/lib/routes';

type IBreadCrumbBannerProps = {
  crumbs: Array<BreadCrumb>;
};

export const WithNavBanner: FC<PropsWithChildren<IBreadCrumbBannerProps>> = ({
  children,
  crumbs,
}) => {
  const isLast = (index: number) => index === crumbs.length - 1;
  return (
    <>
      <div className='bg-secondary/50 flex w-full p-4 px-6'>
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map(({ path, title }, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={path} className={cn(isLast(index) && 'text-secondary-foreground')}>
                      {title}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!isLast(index) && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {children}
    </>
  );
};
