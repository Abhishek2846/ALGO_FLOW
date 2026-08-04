import SearchPageTemplate from './SearchPageTemplate';
import { generateInterpolationSearchSteps } from '../../algorithms/searchAlgorithms';
import { getById } from '../../data/algorithms';
export default function InterpolationSearchPage() {
  return <SearchPageTemplate meta={getById('interpolation-search')!} generateSteps={generateInterpolationSearchSteps} requiresSorted />;
}
