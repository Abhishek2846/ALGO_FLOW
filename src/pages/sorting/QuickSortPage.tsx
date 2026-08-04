import SortingPageTemplate from './SortingPageTemplate';
import { generateQuickSortSteps } from '../../algorithms/sortingAlgorithms';
import { getById } from '../../data/algorithms';
export default function QuickSortPage() {
  return <SortingPageTemplate meta={getById('quick-sort')!} generateSteps={generateQuickSortSteps} />;
}
