import React, { useContext } from "react";

import { AccountContext } from "/imports/ui/contexts/account-context.js";

export default function Auth() {
  const { isLoggedIn, setLoggedIn } = useContext(AccountContext);

  if (isLoggedIn) {
    return (
      <button
        onClick={() => {
          setLoggedIn(false);
        }}
      >
        Logout
      </button>
    );
  }
  return (
    <button
      onClick={() => {
        setLoggedIn(true);
      }}
    >
      Login
    </button>
  );
}
