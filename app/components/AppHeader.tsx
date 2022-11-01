import { createStyles, Header, Container, Group, Burger, Transition, Paper, Anchor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@remix-run/react";
import { useState } from "react";
import CustomConnectButton from "./ConnectButton";
import { LogoMark, LogoType } from "./Logo";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  outer: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
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

export function AppHeader({ links, userLinks }: AppHeaderProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        close();
      }}
    >
      {link.label}
    </a>
  ));

  const secondaryItems = userLinks.map((item) => (
    <a
      key={item.label}
      href={item.link}
      className={cx(classes.link, { [classes.linkActive]: active === item.link })}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.link);
        close();
      }}
    >
      {item.label}
    </a>
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
        <Group position="left" spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group position="right" spacing={5} className={classes.links}>
          {secondaryItems}
        </Group>
        <CustomConnectButton />
      </Container>
      <hr style={{ color: "#FAFAFA", backgroundColor: "#FAFAFA", height: "1px", borderWidth: 0 }} />
    </Header>
  );
}
