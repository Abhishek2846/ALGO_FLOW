import StructurePageTemplate from './StructurePageTemplate';
import { getById } from '../../data/algorithms';

export default function UnionFindPage() {
  return <StructurePageTemplate meta={getById('union-find')!} structType="union-find" />;
}
