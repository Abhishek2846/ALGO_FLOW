import SortingPageTemplate from './SortingPageTemplate';
import { generateInsertionSortSteps } from '../../algorithms/sortingAlgorithms';
import { getById } from '../../data/algorithms';
export default function InsertionSortPage() {
  return <SortingPageTemplate meta={getById('insertion-sort')!} generateSteps={generateInsertionSortSteps} />;
}
