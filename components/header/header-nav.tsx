import { ChevronDown, User } from 'lucide-react';

import { getSessionCustomerId } from '~/auth';
import { FragmentOf, graphql } from '~/client/graphql';
import { Link } from '~/components/link';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { cn } from '~/lib/utils';

export const HeaderNavFragment = graphql(`
  fragment HeaderNavFragment on Site {
    categoryTree {
      entityId
      name
      path
      children {
        entityId
        name
        path
        children {
          entityId
          name
          path
        }
      }
    }
  }
`);

export const WebpagesFragment = graphql(`
  fragment WebpagesFragment on Site {
    content {
      pages(filters: { isVisibleInNavigation: true }) {
        edges {
          node {
            __typename
            name
            ... on RawHtmlPage {
              path
            }
            ... on ContactPage {
              path
            }
            ... on NormalPage {
              path
            }
            ... on BlogIndexPage {
              path
            }
            ... on ExternalLinkPage {
              link
            }
          }
        }
      }
    }
  }
`);

type CombinedHeaderNavData = FragmentOf<typeof HeaderNavFragment> & FragmentOf<typeof WebpagesFragment>;

interface Props {
  data: CombinedHeaderNavData;
  className?: string;
  inCollapsedNav?: boolean;
}

export const HeaderNav = async ({ data, className, inCollapsedNav = false }: Props) => {
  // To prevent the navigation menu from overflowing, we limit the number of categories to 6.
  // To show a full list of categories, modify the `slice` method to remove the limit.
  // Will require modification of navigation menu styles to accommodate the additional categories.
  const categoryTree = data.categoryTree.slice(0, 6);
  const webPages = (data.content?.pages) ? removeEdgesAndNodes(data.content.pages) : [];
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
  }).concat(webPages.slice(0,2).map((webPage) => {
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
