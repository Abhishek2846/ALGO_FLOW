import SortingPageTemplate from './SortingPageTemplate';
import { generateMergeSortSteps } from '../../algorithms/sortingAlgorithms';
import { getById } from '../../data/algorithms';
export default function MergeSortPage() {
  return <SortingPageTemplate meta={getById('merge-sort')!} generateSteps={generateMergeSortSteps} />;
}
