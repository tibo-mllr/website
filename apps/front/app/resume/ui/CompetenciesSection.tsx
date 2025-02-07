'use client';

import { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { selectResume, selectResumeLoading } from '@/lib/redux/slices';

export default function CompetenciesSection(): ReactElement {
  const resume = useSelector(selectResume);
  const isLoading = useSelector(selectResumeLoading);

  if (isLoading) {
    return <i>Loading...</i>;
  }

  return (
    <span>
      {resume.competencies.length ? (
        resume.competencies.join(' • ')
      ) : (
        <i>No skills to display</i>
      )}
    </span>
  );
}
