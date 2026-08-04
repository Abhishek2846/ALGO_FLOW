import SearchPageTemplate from './SearchPageTemplate';
import { generateBinarySearchSteps } from '../../algorithms/searchAlgorithms';
import { getById } from '../../data/algorithms';
export default function BinarySearchPage() {
  return <SearchPageTemplate meta={getById('binary-search')!} generateSteps={generateBinarySearchSteps} requiresSorted />;
}
