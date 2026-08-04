import GraphPageTemplate from './GraphPageTemplate';
import { generateDFSSteps } from '../../algorithms/graphAlgorithms';
import { getById } from '../../data/algorithms';

export default function DFSPage() {
  return <GraphPageTemplate meta={getById('dfs')!} algoType="dfs" stepGenerator={generateDFSSteps} />;
}
