import SearchPageTemplate from './SearchPageTemplate';
import { generateJumpSearchSteps } from '../../algorithms/searchAlgorithms';
import { getById } from '../../data/algorithms';
export default function JumpSearchPage() {
  return <SearchPageTemplate meta={getById('jump-search')!} generateSteps={generateJumpSearchSteps} requiresSorted />;
}
