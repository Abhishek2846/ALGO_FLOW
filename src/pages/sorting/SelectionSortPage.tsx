import SortingPageTemplate from './SortingPageTemplate';
import { generateSelectionSortSteps } from '../../algorithms/sortingAlgorithms';
import { getById } from '../../data/algorithms';
export default function SelectionSortPage() {
  return <SortingPageTemplate meta={getById('selection-sort')!} generateSteps={generateSelectionSortSteps} />;
}
