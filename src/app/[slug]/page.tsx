import { getProgramData, getAllProgramSlugs } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import Image from 'next/image';

export async function generateStaticParams() {
  const slugs = getAllProgramSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const programData = await getProgramData(resolvedParams.slug);

  if (!programData) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <PageContainer className="py-20">
        <h1 className="font-fjalla text-4xl md:text-5xl text-center uppercase tracking-widest mb-16">
          {programData.heading}
        </h1>

        <div 
          className="prose prose-lg prose-headings:font-fjalla prose-headings:uppercase prose-headings:tracking-widest max-w-4xl mx-auto font-libre text-gray-800 leading-relaxed mb-20"
          dangerouslySetInnerHTML={{ __html: programData.contentHtml }}
        />

        {programData.videos && programData.videos.length > 0 && (
          <div className="mb-20">
            <h2 className="font-fjalla text-3xl text-center uppercase tracking-widest mb-12">Our Films</h2>
            <div className="grid md:grid-cols-2 gap-12">
              {programData.videos.map((video, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="aspect-video relative mb-4 bg-gray-100">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="font-fjalla text-xl uppercase tracking-widest mb-2">{video.title}</h3>
                  <p className="font-libre text-gray-600">{video.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {programData.gallery && programData.gallery.length > 0 && (
          <div>
            <h2 className="font-fjalla text-3xl text-center uppercase tracking-widest mb-12">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {programData.gallery.map((image, idx) => (
                <div key={idx} className="aspect-square relative group bg-gray-100">
                  <Image 
                    src={image} 
                    alt={`Gallery Image ${idx + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
