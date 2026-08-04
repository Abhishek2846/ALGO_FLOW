import StructurePageTemplate from './StructurePageTemplate';
import { getById } from '../../data/algorithms';

export default function LinkedListPage() {
  return <StructurePageTemplate meta={getById('linked-list')!} structType="linked-list" />;
}
