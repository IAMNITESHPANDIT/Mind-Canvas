import React from "react";
import Router from "next/router";

const dashboard = "/Dashboard"; // Define the route where authenticated users should be redirected.

/**
 * Check if the user is already authenticated
 * It depends on your authentication logic.
 * @returns {boolean}
 */
const checkUserAuthentication = () => {
  return {
    auth:
      typeof window !== "undefined" && sessionStorage.getItem("USER_TOKEN")
        ? true
        : false,
  };
};

export default (WrappedComponent) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async (context) => {
    // Check if the user is authenticated
    const isAuthenticated = checkUserAuthentication();

    // Redirect the user to the dashboard if already authenticated
    if (isAuthenticated) {
      if (context.res) {
        context.res.writeHead(302, {
          Location: dashboard,
        });
        context.res.end();
      } else {
        Router.replace(dashboard);
      }
    }

    // Pass any props to the wrapped component
    if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(context);
      return { ...wrappedProps };
    }

    return {};
  };

  return hocComponent;
};
