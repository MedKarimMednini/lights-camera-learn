import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const programsDirectory = path.join(process.cwd(), 'src/content/programs');

export async function getProgramData(slug: string) {
  const fullPath = path.join(programsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);
    
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...(matterResult.data as {
      title: string;
      heading: string;
      videos?: { id: string; title: string; description: string }[];
      gallery?: string[];
    })
  };
}

export function getAllProgramSlugs() {
  const fileNames = fs.readdirSync(programsDirectory);
  return fileNames.map(fileName => fileName.replace(/\.md$/, ''));
}
