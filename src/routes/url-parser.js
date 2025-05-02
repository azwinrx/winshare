export const parseActivePathname = () => {
  const hash = window.location.hash.slice(1);
  const path = hash.split("?")[0];

  if (!path.includes("/")) {
    return {};
  }

  const segments = path.split("/");
  const route = `/${segments[1]}${segments[2] ? "/:id" : ""}`;

  return {
    id: segments[2],
    route,
  };
};

export const getActiveRoute = () => {
  const { route = "/" } = parseActivePathname();
  return route;
};
