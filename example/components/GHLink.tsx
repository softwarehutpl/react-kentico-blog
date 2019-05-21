import React from 'react';

export function GHLink({ filename }) {
  return (
    <a
      style={{ width: '100%' }}
      href={`https://github.com/softwarehutpl/react-kentico-blog/blob/master/example/${filename}`}>
      See this file on GitHub
    </a>
  );
}
