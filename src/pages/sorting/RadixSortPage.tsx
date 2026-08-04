import SortingPageTemplate from './SortingPageTemplate';
import { generateRadixSortSteps } from '../../algorithms/sortingAlgorithms';
import { getById } from '../../data/algorithms';
export default function RadixSortPage() {
  return <SortingPageTemplate meta={getById('radix-sort')!} generateSteps={generateRadixSortSteps} />;
}
