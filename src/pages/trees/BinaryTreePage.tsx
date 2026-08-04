import TreePageTemplate from './TreePageTemplate';
import { getById } from '../../data/algorithms';
export default function BinaryTreePage() {
  return <TreePageTemplate meta={getById('binary-tree')!} treeType="binary-tree" allowDelete={false} />;
}
