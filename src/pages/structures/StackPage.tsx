import StructurePageTemplate from './StructurePageTemplate';
import { getById } from '../../data/algorithms';

export default function StackPage() {
  return <StructurePageTemplate meta={getById('stack')!} structType="stack" />;
}
