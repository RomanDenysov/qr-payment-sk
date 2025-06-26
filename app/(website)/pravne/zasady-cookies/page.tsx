import path from 'node:path';
import {
  MarkdownContent,
  readMarkdownFile,
} from '@/components/shared/markdown';
import { PageWrapper } from '../components/page-wrapper';

export default async function ZasadyCookiesPage() {
  const filePath = path.join(
    process.cwd(),
    'app/(website)/pravne/zasady-cookies/zasady-cookies.md'
  );
  const content = await readMarkdownFile(filePath);

  return (
    <PageWrapper>
      <MarkdownContent content={content} />
    </PageWrapper>
  );
}
