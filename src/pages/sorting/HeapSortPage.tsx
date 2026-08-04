import SortingPageTemplate from './SortingPageTemplate';
import { generateHeapSortSteps } from '../../algorithms/sortingAlgorithms';
import { getById } from '../../data/algorithms';
export default function HeapSortPage() {
  return <SortingPageTemplate meta={getById('heap-sort')!} generateSteps={generateHeapSortSteps} />;
}
