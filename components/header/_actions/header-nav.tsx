import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@bigcommerce/components/navigation-menu';
import { ChevronDown, User } from 'lucide-react';

import { getSessionCustomerId } from '~/auth';
import { getCategoryTree } from '~/client/queries/get-category-tree';
import { getWebPages } from '~/client/queries/get-web-pages';
import { Link } from '~/components/link';
import { cn } from '~/lib/utils';

export const HeaderNav = async ({
  className,
  inCollapsedNav = false,
}: {
  className?: string;
  inCollapsedNav?: boolean;
}) => {
  // To prevent the navigation menu from overflowing, we limit the number of categories to 6.
  // To show a full list of categories, modify the `slice` method to remove the limit.
  // Will require modification of navigation menu styles to accommodate the additional categories.
  const categoryTree = (await getCategoryTree()).slice(0, 4);
  const webPages = (await getWebPages()).slice(0, 2);
  const customerId = await getSessionCustomerId();

  const navItems = categoryTree.map((category) => {
    return {
      name: category.name, 
      path: category.path, 
      children: category.children.map((childCategory1) => {
        return {
          name: childCategory1.name,
          path: childCategory1.path,
          children: childCategory1.children.map((childCategory2) => {
            return {
              name: childCategory2.name,
              path: childCategory2.path,
            }
          }),
        }
      }),
    };
  }).concat(webPages.map((webPage) => {
    return {
      name: webPage.name,
      path: webPage.__typename === 'ExternalLinkPage' ? webPage.link : webPage.path,
      children: [],
    }
  }));

  return (
    <>
      <NavigationMenuList
        className={cn(
          !inCollapsedNav && 'lg:gap-4',
          inCollapsedNav && 'flex-col items-start pb-6',
          className,
        )}
      >
        {navItems.map((navItem) => (
          <NavigationMenuItem className={cn(inCollapsedNav && 'w-full')} key={navItem.path}>
            {navItem.children.length > 0 ? (
              <>
                <NavigationMenuTrigger className="gap-0 p-0">
                  <>
                    <NavigationMenuLink asChild>
                      <Link className="grow" href={navItem.path}>
                        {navItem.name}
                      </Link>
                    </NavigationMenuLink>
                    <span className={cn(inCollapsedNav && 'p-3')}>
                      <ChevronDown
                        aria-hidden="true"
                        className="cursor-pointer transition duration-200 group-data-[state=open]/button:-rotate-180"
                      />
                    </span>
                  </>
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  className={cn(
                    !inCollapsedNav && 'mx-auto flex w-[700px] flex-row gap-20',
                    inCollapsedNav && 'ps-3',
                  )}
                >
                  {navItem.children.map((childNavItem1) => (
                    <ul className={cn(inCollapsedNav && 'pb-4')} key={childNavItem1.path}>
                      <NavigationMenuItem>
                        <NavigationMenuLink href={childNavItem1.path}>
                          {childNavItem1.name}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      {childNavItem1.children.map((childNavItem2) => (
                        <NavigationMenuItem key={childNavItem2.path}>
                          <NavigationMenuLink className="font-normal" href={childNavItem2.path}>
                            {childNavItem2.name}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </ul>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link href={navItem.path}>{navItem.name}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      {inCollapsedNav && (
        <NavigationMenuList className={cn('flex-col items-start border-t border-gray-200 pt-6')}>
          <NavigationMenuItem className="w-full">
            {customerId ? (
              <NavigationMenuLink href="/account">
                Your Account <User />
              </NavigationMenuLink>
            ) : (
              <NavigationMenuLink href="/login">
                {/* TODO: add Log out for mobile */}
                Log in <User />
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      )}
    </>
  );
};
