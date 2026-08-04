import StructurePageTemplate from './StructurePageTemplate';
import { getById } from '../../data/algorithms';

export default function QueuePage() {
  return <StructurePageTemplate meta={getById('queue')!} structType="queue" />;
}
