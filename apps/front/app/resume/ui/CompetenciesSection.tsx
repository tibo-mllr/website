import { ReactElement } from 'react';

type CompetenciesSectionProps = {
  competencies: string[];
};

export default function CompetenciesSection({
  competencies,
}: CompetenciesSectionProps): ReactElement {
  return (
    <span>
      {competencies.length ? (
        competencies.join(' • ')
      ) : (
        <i>No skills to display</i>
      )}
    </span>
  );
}
