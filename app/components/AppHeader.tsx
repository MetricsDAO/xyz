import { createStyles, Header, Container, Group, Burger, Transition, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, NavLink } from "@remix-run/react";
import CustomConnectButton from "./ConnectButton";
import { LogoMark, LogoType } from "./Logo";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  outer: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: "#666666",
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: "#E6EBF0",
      color: "#333333",
    },
  },

  linkLabel: {
    marginRight: 5,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

interface AppHeaderProps {
  links: { link: string; label: string }[];
  userLinks: { link: string; label: string }[];
}

const activeLinkStyle = { backgroundColor: "#E6EBF0", color: "#333333" };

export function AppHeader({ links, userLinks }: AppHeaderProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes, cx } = useStyles();

  const items = links.map((link) => (
    <NavLink
      key={link.label}
      to={link.link}
      className={({ isActive }) => cx(classes.link, { [classes.linkActive]: isActive })}
      style={({ isActive }) => (isActive ? activeLinkStyle : {})}
    >
      {link.label}
    </NavLink>
  ));

  const secondaryItems = userLinks.map((item) => (
    <NavLink
      key={item.label}
      to={item.link}
      className={({ isActive }) => cx(classes.link, { [classes.linkActive]: isActive })}
      style={({ isActive }) => (isActive ? activeLinkStyle : {})}
    >
      {item.label}
    </NavLink>
  ));

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.outer} fluid>
        <Group>
          <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
          <Transition transition="pop-top-right" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items.concat(secondaryItems)}
              </Paper>
            )}
          </Transition>
          <Link className="flex flex-row items-center gap-2" to="/">
            <LogoMark /> <LogoType className="hidden md:block" />
          </Link>
        </Group>
        <Group position="center" spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group position="right" spacing={5}>
          <Group className={classes.links}> {secondaryItems}</Group>
          <CustomConnectButton />
        </Group>
      </Container>

      <hr style={{ color: "#FAFAFA", backgroundColor: "#FAFAFA", height: "1px", borderWidth: 0 }} />
    </Header>
  );
}
