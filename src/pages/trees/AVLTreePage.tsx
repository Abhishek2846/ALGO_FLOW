import TreePageTemplate from './TreePageTemplate';
import { getById } from '../../data/algorithms';
export default function AVLTreePage() {
  return <TreePageTemplate meta={getById('avl-tree')!} treeType="avl" allowDelete={false} />;
}
