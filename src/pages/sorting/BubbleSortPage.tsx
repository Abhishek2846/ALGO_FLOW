import SortingPageTemplate from './SortingPageTemplate';
import { generateBubbleSortSteps } from '../../algorithms/sortingAlgorithms';
import { getById } from '../../data/algorithms';
export default function BubbleSortPage() {
  return <SortingPageTemplate meta={getById('bubble-sort')!} generateSteps={generateBubbleSortSteps} />;
}
