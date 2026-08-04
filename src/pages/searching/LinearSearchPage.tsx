import SearchPageTemplate from './SearchPageTemplate';
import { generateLinearSearchSteps } from '../../algorithms/searchAlgorithms';
import { getById } from '../../data/algorithms';
export default function LinearSearchPage() {
  return <SearchPageTemplate meta={getById('linear-search')!} generateSteps={generateLinearSearchSteps} requiresSorted={false} />;
}
