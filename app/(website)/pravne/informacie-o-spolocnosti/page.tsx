import path from 'node:path';
import {
  MarkdownContent,
  readMarkdownFile,
} from '@/components/shared/markdown';
import { PageWrapper } from '../components/page-wrapper';

export default async function InformacieOSpolocnostiPage() {
  const filePath = path.join(
    process.cwd(),
    'app/(website)/pravne/informacie-o-spolocnosti/informacie-o-spolocnosti.md'
  );
  const content = await readMarkdownFile(filePath);

  return (
    <PageWrapper>
      <MarkdownContent content={content} />
    </PageWrapper>
  );
}
