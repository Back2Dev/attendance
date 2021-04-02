import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Link } from "@material-ui/core";

import { LayoutContext } from "/imports/ui/contexts/layout-context.js";

function TestComponent() {
  const { layout, setLayout } = useContext(LayoutContext);

  const toggleLayout = () => {
    setLayout(layout === "default" ? "single" : "default");
  };

  return (
    <div>
      <div>Test Layouts</div>
      <div>
        <Button onClick={toggleLayout} variant="contained">
          Toggle layout (context)
        </Button>
      </div>
      <div>
        <Link component={RouterLink} to="/test/layout?layout=single">
          Single layout page URL
        </Link>
      </div>
    </div>
  );
}

export default TestComponent;
