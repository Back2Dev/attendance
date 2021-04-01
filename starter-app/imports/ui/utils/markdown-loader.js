import React, { createElement, useState, useEffect } from "react";
import PropTypes from "prop-types";

import Markdown, { getCoreProps } from "react-markdown";
const debug = require("debug")("app:md-loader");

/* Removes YAML metadata 

YAML metadata can optionally appear between two lines containing three dashes '---'

eg:
---
id: outline
status: draft
published: Jan 2019
title: Proposed outline of GO-NAB X documentation
---

*/

export const getYAMLField = (doc, field) => {
  const lines = doc.split(/\n/);
  let title;
  let started;
  const reg = new RegExp(`${field}:`, "i");
  lines.forEach((line, ix) => {
    if (line.match(/^\s*---/)) {
      if (!started) {
        started = true;
      } else {
        if (line.match(reg)) {
          title = line.replace(reg, "");
        }
      }
    }
  });
  return title;
};

export const removeYAML = doc => {
  const lines = doc.split(/\n/);
  let started = false;
  let cut = 0;
  lines.forEach((line, ix) => {
    if (line.match(/^\s*---/)) {
      if (!started) {
        started = true;
      } else {
        if (!cut) {
          cut = ix + 1;
        }
      }
    }
  });
  lines.splice(0, cut);
  return lines.join("\n");
};

const MarkdownLoader = props => {
  const [markdown, setMarkdown] = useState(null);

  useEffect(() => {
    if (!markdown || props.src) loadContent();
  });

  const loadContent = () => {
    debug(`Loading file ${props.src}`);
    try {
      fetch(props.src)
        .then(function(response) {
          return response.text();
        })
        .then(function(text) {
          setMarkdown(removeYAML(text));
        })
        .catch(e => {
          console.error(e);
          setMarkdown(`
        # Error: failed to load the markdown file ${props.src}

        ${e.message}
        `);
        });
    } catch (e) {
      console.error(e);
      setMarkdown(`
      # Error: failed to load the markdown file ${props.src}

      ${e.message}
      `);
    }
  };

  return (
    <>
      {!props.src && <div>Error: No src= attribute supplied</div>}
      {props.src && !markdown && <>Loading...</>}
      {markdown && <Markdown source={markdown} />}
    </>
  );
};

export default MarkdownLoader;

MarkdownLoader.propTypes = {
  src: PropTypes.string.isRequired
};
