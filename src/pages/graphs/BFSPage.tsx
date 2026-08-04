import GraphPageTemplate from './GraphPageTemplate';
import { generateBFSSteps } from '../../algorithms/graphAlgorithms';
import { getById } from '../../data/algorithms';

export default function BFSPage() {
  return <GraphPageTemplate meta={getById('bfs')!} algoType="bfs" stepGenerator={generateBFSSteps} />;
}
