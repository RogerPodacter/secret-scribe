'use client';

import GitHubButton from 'react-github-btn';

export function GithubButton() {
  return (
    <GitHubButton
      href="https://github.com/RogerPodacter/secret-scribe"
      data-size="large"
      data-show-count="true"
      aria-label="Star on GitHub"
    >
      Github
    </GitHubButton>
  );
}
