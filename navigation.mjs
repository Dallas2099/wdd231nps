export const npsExplore = [
  {
    label: "About Us",
    links: [
      { text: "Our Mission", href: "#" },
      { text: "Leadership", href: "#" },
      { text: "Newsroom", href: "#" },
      { text: "Contact", href: "#" },
    ],
  },
  {
    label: "Discover History",
    links: [
      { text: "American Heritage", href: "#" },
      { text: "Archeology", href: "#" },
      { text: "Museums", href: "#" },
      { text: "Preservation", href: "#" },
    ],
  },
  {
    label: "Explore Nature",
    links: [
      { text: "Wildlife", href: "#" },
      { text: "Plants", href: "#" },
      { text: "Geology", href: "#" },
      { text: "Water", href: "#" },
    ],
  },
  {
    label: "Kids",
    links: [
      { text: "Junior Ranger", href: "#" },
      { text: "Education Resources", href: "#" },
      { text: "Youth Programs", href: "#" },
      { text: "Field Trips", href: "#" },
    ],
  },
];

const DESKTOP_QUERY = "(min-width: 960px)";
const RESIZE_DEBOUNCE = 180;

const debounce = (fn, delay = RESIZE_DEBOUNCE) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

const getButtonParts = (button) => {
  if (!button) return { listItem: null, submenu: null };
  const listItem = button.closest("li");
  if (!listItem) return { listItem: null, submenu: null };
  const submenu = listItem.querySelector(":scope > ul.global-nav__submenu");
  return { listItem, submenu };
};

const openSubmenuAnimated = (submenu, button, listItem) => {
  if (!submenu) return;
  submenu.hidden = false;
  const height = submenu.scrollHeight;
  submenu.style.maxHeight = "0px";
  requestAnimationFrame(() => {
    submenu.style.maxHeight = `${height}px`;
  });
  const finalize = (event) => {
    if (event.propertyName !== "max-height") return;
    submenu.style.maxHeight = "none";
    submenu.removeEventListener("transitionend", finalize);
  };
  submenu.addEventListener("transitionend", finalize);
  if (button) {
    button.setAttribute("aria-expanded", "true");
  }
  listItem?.classList.add("is-open");
};

const closeSubmenuAnimated = (submenu, button, listItem) => {
  if (!submenu) return;
  const height = submenu.scrollHeight;
  submenu.style.maxHeight =
    !submenu.style.maxHeight || submenu.style.maxHeight === "none"
      ? `${height}px`
      : submenu.style.maxHeight;
  requestAnimationFrame(() => {
    submenu.style.maxHeight = "0px";
  });
  const finalize = (event) => {
    if (event.propertyName !== "max-height") return;
    submenu.hidden = true;
    submenu.style.maxHeight = "";
    submenu.removeEventListener("transitionend", finalize);
  };
  submenu.addEventListener("transitionend", finalize);
  if (button) {
    button.setAttribute("aria-expanded", "false");
  }
  listItem?.classList.remove("is-open");
};

const openSubmenuInstant = (submenu, button, listItem) => {
  if (!submenu) return;
  submenu.hidden = false;
  submenu.style.maxHeight = "none";
  if (button) {
    button.setAttribute("aria-expanded", "true");
  }
  listItem?.classList.add("is-open");
};

const closeSubmenuInstant = (submenu, button, listItem) => {
  if (!submenu) return;
  submenu.hidden = true;
  submenu.style.maxHeight = "0px";
  if (button) {
    button.setAttribute("aria-expanded", "false");
  }
  listItem?.classList.remove("is-open");
};

export function enableNavigation(root = document) {
  if (!root) return;
  const nav = root.querySelector(".global-nav");
  if (!nav) return;

  const toggles = Array.from(
    nav.querySelectorAll(".global-nav__split-button__toggle"),
  );
  const mainToggle = root.querySelector(".global-nav__toggle");
  const mediaQuery = window.matchMedia
    ? window.matchMedia(DESKTOP_QUERY)
    : null;
  let isDesktopView = mediaQuery ? mediaQuery.matches : window.innerWidth >= 960;
  let navOpen = isDesktopView;

  const syncNavVisibility = () => {
    if (isDesktopView) {
      nav.hidden = false;
      nav.classList.add("is-open");
      if (mainToggle) {
        mainToggle.setAttribute("aria-expanded", "true");
      }
      toggles.forEach((button) => {
        const { listItem, submenu } = getButtonParts(button);
        if (!submenu) return;
        openSubmenuInstant(submenu, button, listItem);
      });
      return;
    }

    if (navOpen) {
      nav.hidden = false;
      nav.classList.add("is-open");
    } else {
      nav.classList.remove("is-open");
      nav.hidden = true;
    }

    if (mainToggle) {
      mainToggle.setAttribute("aria-expanded", String(navOpen));
    }

    toggles.forEach((button) => {
      const { listItem, submenu } = getButtonParts(button);
      if (!submenu) return;
      closeSubmenuInstant(submenu, button, listItem);
    });
  };

  const setNavOpen = (shouldOpen) => {
    if (isDesktopView) return;
    navOpen = shouldOpen;
    syncNavVisibility();
  };

  syncNavVisibility();

  if (mainToggle) {
    mainToggle.addEventListener("click", () => {
      setNavOpen(!navOpen);
    });
  }

  toggles.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (isDesktopView) return;
      const trigger = event.currentTarget;
      const { listItem, submenu } = getButtonParts(trigger);
      if (!submenu) return;
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeSubmenuAnimated(submenu, trigger, listItem);
      } else {
        openSubmenuAnimated(submenu, trigger, listItem);
      }
    });
  });

  const handleLayoutChange = (matches) => {
    if (matches === isDesktopView) return;
    isDesktopView = matches;
    if (isDesktopView) {
      navOpen = true;
    } else {
      navOpen = false;
    }
    syncNavVisibility();
  };

  const debouncedResize = debounce(() => {
    const matches = mediaQuery
      ? mediaQuery.matches
      : window.innerWidth >= 960;
    handleLayoutChange(matches);
  });

  if (mediaQuery && mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", (event) =>
      handleLayoutChange(event.matches),
    );
  } else if (mediaQuery && mediaQuery.addListener) {
    mediaQuery.addListener((event) => handleLayoutChange(event.matches));
  }

  window.addEventListener("resize", debouncedResize);
}
