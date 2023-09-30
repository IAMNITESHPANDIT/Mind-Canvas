import React from "react";
import Router from "next/router";

const login = "/Login"; // Define your login route address.
const signup = "/Signup"; // Define your signup route address.

/**
 * Check user authentication and authorization
 * It depends on you and your auth service provider.
 * @returns {{auth: null}}
 */

const checkUserAuthentication = async () => {
  // Add your authentication check logic here.
  // Example: return { auth: isUserLoggedIn() };
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
    const userAuth = await checkUserAuthentication();

    // Are you an authorized user or not?
    if (!userAuth?.auth) {
      // Handle server-side and client-side rendering.
      if (context.res) {
        const redirectPath = context.pathname === signup ? signup : login;
        context.res.writeHead(302, {
          Location: redirectPath,
        });
        context.res.end();
      } else {
        Router.replace(login);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({
        ...context,
        auth: userAuth,
      });
      return { ...wrappedProps, userAuth };
    }

    return { userAuth };
  };

  return hocComponent;
};
