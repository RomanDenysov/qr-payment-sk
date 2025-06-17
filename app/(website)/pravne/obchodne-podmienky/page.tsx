import path from 'node:path';
import { MarkdownContent, readMarkdownFile } from '@/lib/markdown';
import { PageWrapper } from '../components/page-wrapper';

export default async function ObchodnePodmienkyPage() {
  const filePath = path.join(
    process.cwd(),
    'app/(website)/pravne/obchodne-podmienky/obchodne-podmienky.md'
  );
  const content = await readMarkdownFile(filePath);

  return (
    <PageWrapper>
      <MarkdownContent content={content} />
    </PageWrapper>
  );
}
