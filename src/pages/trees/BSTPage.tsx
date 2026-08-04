import TreePageTemplate from './TreePageTemplate';
import { getById } from '../../data/algorithms';
export default function BSTPage() {
  return <TreePageTemplate meta={getById('bst')!} treeType="bst" allowDelete={true} />;
}
