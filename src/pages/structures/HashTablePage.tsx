import StructurePageTemplate from './StructurePageTemplate';
import { getById } from '../../data/algorithms';

export default function HashTablePage() {
  return <StructurePageTemplate meta={getById('hash-table')!} structType="hash-table" />;
}
