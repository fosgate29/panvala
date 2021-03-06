import * as React from 'react';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import Button from './Button';
import Image from './Image';
import NotificationPanel from './NotificationPanel';
import RouterLink from './RouterLink';
import { NotificationsContext } from './NotificationsProvider';

const StyledHeader = styled.header`
  margin-bottom: 2rem;
`;
const FlexContainer = styled.div`
  display: flex;
`;
const NavWrapper = styled(FlexContainer)`
  justify-content: space-between;
  align-items: center;
`;
const NavItems = styled(FlexContainer)`
  justify-content: flex-start;
`;
const NavItem = styled(FlexContainer)`
  margin-right: 1rem;
`;

const Header: React.FunctionComponent<any> = ({ router }: any) => {
  const { notifications } = React.useContext(NotificationsContext);
  return (
    <StyledHeader>
      <nav>
        <NavWrapper>
          <FlexContainer>
            <RouterLink href="/slates" as="/slates">
              <Image src="/static/logo-black.svg" alt="panvala logo" />
            </RouterLink>
          </FlexContainer>
          <NavItems>
            <NavItem>
              <RouterLink href="/slates" as="/slates">
                <Button
                  active={
                    (router && router.pathname === '/') ||
                    (router && router.asPath && router.asPath.startsWith('/slates'))
                  }
                >
                  {'Slates'}
                </Button>
              </RouterLink>
            </NavItem>

            <NavItem>
              <RouterLink href="/proposals" as="/proposals">
                <Button active={router && router.asPath && router.asPath.startsWith('/proposals')}>
                  {'Proposals'}
                </Button>
              </RouterLink>
            </NavItem>
            <NavItem>
              <RouterLink href="/ballots" as="/ballots">
                <Button active={router && router.asPath && router.asPath.startsWith('/ballots')}>
                  {'Ballots'}
                </Button>
              </RouterLink>
            </NavItem>
            <NotificationPanel items={notifications} />
          </NavItems>
        </NavWrapper>
      </nav>
    </StyledHeader>
  );
};

export default withRouter(Header);
