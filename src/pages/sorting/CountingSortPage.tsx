import SortingPageTemplate from './SortingPageTemplate';
import { generateCountingSortSteps } from '../../algorithms/sortingAlgorithms';
import { getById } from '../../data/algorithms';
export default function CountingSortPage() {
  return <SortingPageTemplate meta={getById('counting-sort')!} generateSteps={generateCountingSortSteps} />;
}
